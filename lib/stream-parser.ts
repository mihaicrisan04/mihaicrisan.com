// Stream event types matching the backend protocol
export type StreamEvent =
	| { type: "step:start"; step: { type: "tool_call"; name: string } }
	| { type: "step:complete"; step: { type: "tool_call"; result: string } }
	| { type: "text:delta"; content: string }
	| { type: "text:done"; threadId: string }
	| { type: "error"; message: string };

// Chat step types for UI state
// "portfolio_search" is a special type for the searchPortfolio tool to display nicely
export interface ChatStep {
	id: string;
	type: "portfolio_search" | "tool_call";
	status: "loading" | "complete";
	// Portfolio search specific (parsed from searchPortfolio tool result)
	query?: string;
	resultsCount?: number;
	// Tool call specific
	name?: string;
	result?: string;
}

// Parse SSE data line into a StreamEvent
export function parseSSELine(line: string): StreamEvent | null {
	if (!line.startsWith("data: ")) {
		return null;
	}

	try {
		const jsonStr = line.slice(6); // Remove "data: " prefix
		return JSON.parse(jsonStr) as StreamEvent;
	} catch {
		console.error("Failed to parse SSE line:", line);
		return null;
	}
}

// Create an async generator that yields parsed events from an SSE stream
export async function* parseSSEStream(
	reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncGenerator<StreamEvent, void, unknown> {
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			break;
		}

		buffer += decoder.decode(value, { stream: true });

		// Process complete lines
		const lines = buffer.split("\n");
		buffer = lines.pop() || ""; // Keep incomplete line in buffer

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) {
				continue; // Skip empty lines
			}

			const event = parseSSELine(trimmed);
			if (event) {
				yield event;
			}
		}
	}

	// Process any remaining data in buffer
	if (buffer.trim()) {
		const event = parseSSELine(buffer.trim());
		if (event) {
			yield event;
		}
	}
}

// Helper to generate unique step IDs
export function generateStepId(): string {
	return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Streaming chat function for the frontend
export async function streamingChat(
	convexUrl: string,
	message: string,
	threadId: string | null,
	callbacks: {
		onStepStart: (step: ChatStep) => void;
		onStepComplete: (stepId: string, data: Partial<ChatStep>) => void;
		onTextDelta: (content: string) => void;
		onComplete: (threadId: string) => void;
		onError: (error: string) => void;
	},
): Promise<void> {
	const activeSteps = new Map<string, string>(); // Maps step key to step ID

	try {
		const response = await fetch(`${convexUrl}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				threadId,
				message,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		if (!response.body) {
			throw new Error("No response body");
		}

		const reader = response.body.getReader();

		console.log("[streamParser] Starting to process stream");
		let completeCalled = false;
		let lastThreadId = "";

		for await (const event of parseSSEStream(reader)) {
			console.log("[streamParser] Received event:", event.type);
			switch (event.type) {
				case "step:start": {
					const stepId = generateStepId();
					const toolName = event.step.name;
					const stepKey = `tool_${toolName}`;
					console.log("[streamParser] Step start:", toolName);

					activeSteps.set(stepKey, stepId);

					// Special handling for searchPortfolio tool - show as portfolio search
					if (toolName === "searchPortfolio") {
						callbacks.onStepStart({
							id: stepId,
							type: "portfolio_search",
							status: "loading",
							name: toolName,
						});
					} else {
						callbacks.onStepStart({
							id: stepId,
							type: "tool_call",
							status: "loading",
							name: toolName,
						});
					}
					break;
				}

				case "step:complete": {
					// Find the most recent step that matches
					let stepId: string | undefined;
					let stepName: string | undefined;

					// Get the last active step
					for (const [key, id] of activeSteps.entries()) {
						stepId = id;
						stepName = key.replace("tool_", "");
					}
					console.log("[streamParser] Step complete:", stepName);

					if (stepId) {
						// Parse the result for searchPortfolio to extract resultsCount
						if (stepName === "searchPortfolio") {
							try {
								const parsed = JSON.parse(event.step.result);
								callbacks.onStepComplete(stepId, {
									status: "complete",
									resultsCount: parsed.resultsCount ?? 0,
									result: event.step.result,
								});
							} catch {
								callbacks.onStepComplete(stepId, {
									status: "complete",
									result: event.step.result,
								});
							}
						} else {
							callbacks.onStepComplete(stepId, {
								status: "complete",
								result: event.step.result,
							});
						}
					}
					break;
				}

				case "text:delta":
					console.log(
						"[streamParser] Text delta:",
						event.content?.substring(0, 30),
					);
					callbacks.onTextDelta(event.content);
					break;

				case "text:done":
					console.log("[streamParser] Stream done, threadId:", event.threadId);
					lastThreadId = event.threadId;
					completeCalled = true;
					callbacks.onComplete(event.threadId);
					break;

				case "error":
					console.error("[streamParser] Stream error:", event.message);
					callbacks.onError(event.message);
					break;

				default:
					console.log("[streamParser] Unknown event type:");
					break;
			}
		}
		console.log(
			"[streamParser] Stream processing finished, completeCalled:",
			completeCalled,
		);

		// Safety: if text:done was never received, still call onComplete to clean up UI state
		if (!completeCalled) {
			console.warn(
				"[streamParser] text:done event was never received, calling onComplete as fallback",
			);
			callbacks.onComplete(lastThreadId || "fallback");
		}
	} catch (error) {
		callbacks.onError(error instanceof Error ? error.message : "Stream failed");
	}
}
