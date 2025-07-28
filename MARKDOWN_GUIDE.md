# Project Markdown System Guide

This guide explains how to add rich markdown content to your project pages.

## Quick Start

To add a new project with markdown content:

1. **Add project metadata** to `data/projects.json`
2. **Create markdown file** in `content/projects/[slug].md`
3. **Add images** to `public/content/projects/` (if needed)

That's it! The project page will automatically display your markdown content.

## Directory Structure

```
mihaicrisan.com/
├── content/projects/          # Markdown files
│   ├── project-name.md
│   └── another-project.md
├── public/content/projects/   # Images for markdown
│   ├── image1.jpg
│   └── image2.png
└── data/projects.json         # Project metadata
```

## Creating a Project

### Step 1: Add to projects.json

Add your project metadata to `data/projects.json`:

```json
{
  "id": "my-awesome-project",
  "name": "My Awesome Project",
  "shortDescription": "Brief description for cards",
  "fullDescription": "Longer description for the project page",
  "status": "completed",
  "category": "web-app",
  "featured": true,
  "startDate": "2024-01-01",
  "endDate": "2024-03-01",
  "techStack": [
    { "name": "React", "category": "frontend" },
    { "name": "TypeScript", "category": "language" }
  ],
  "links": [
    { "name": "Live Demo", "url": "https://example.com", "type": "demo" },
    { "name": "GitHub", "url": "https://github.com/user/repo", "type": "code" }
  ],
  "images": [
    { "url": "/projects/screenshot1.jpg", "alt": "Project Screenshot" }
  ]
}
```

### Step 2: Create Markdown File

Create `content/projects/my-awesome-project.md`:

```markdown
---
title: My Awesome Project
description: Extended description
date: 2024-01-01
---

# Project Overview

Your project description here...

## Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

### Code Example

```javascript
const example = () => {
  console.log("Hello, world!");
};
```

### Architecture

Explain your project architecture...

## Images

![Screenshot](screenshot.jpg)

## Results

What you achieved...
```

### Step 3: Add Images (Optional)

Place any images referenced in your markdown in `public/content/projects/`:

```
public/content/projects/
├── screenshot.jpg
├── diagram.png
└── demo.gif
```

## Markdown Features

### Frontmatter

Add metadata at the top of your markdown file:

```yaml
---
title: Project Title
description: Project description
date: 2024-01-01
category: web-app
---
```

### Syntax Highlighting

Use fenced code blocks with language specification:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
}
```

### Images

Reference images in three ways:

1. **Relative path**: `![Alt text](image.jpg)` → `/content/projects/image.jpg`
2. **Absolute path**: `![Alt text](/images/image.jpg)`
3. **External URL**: `![Alt text](https://example.com/image.jpg)`

All images automatically open in a full-screen modal when clicked.

### Interactive Elements

- **Links** open in new tabs automatically
- **Images** are clickable and open in modal
- **Code blocks** have syntax highlighting
- **Lists** and **tables** are properly styled

## Styling

The markdown content uses Tailwind Typography with custom styling that matches your site's theme:

- Respects dark/light mode
- Uses your CSS custom properties
- Maintains consistent spacing
- Optimized for readability

## File Naming

The markdown filename should match the project slug:

- Project name: "My Awesome Project"
- Slug: `my-awesome-project` (lowercase, hyphens)
- Filename: `content/projects/my-awesome-project.md`

## Tips

1. **Keep it focused**: Don't duplicate information from projects.json
2. **Use headings**: Structure your content with H2 and H3 headings
3. **Add code examples**: Show implementation details
4. **Include visuals**: Screenshots, diagrams, and demos
5. **Write for your audience**: Technical details for developers, features for users

## Advanced Features

### Custom Components

The markdown renderer supports:

- ✅ GitHub Flavored Markdown (tables, strikethrough, etc.)
- ✅ Syntax highlighting for 100+ languages
- ✅ Auto-linking URLs
- ✅ Image optimization
- ✅ Modal image viewer
- ✅ Dark mode support

### Performance

- Images are lazy-loaded
- Code highlighting is client-side optimized
- Markdown parsing happens at build time
- Static generation for fast loading

## Troubleshooting

### Markdown not showing?

1. Check filename matches project slug
2. Ensure markdown file is in `content/projects/`
3. Verify frontmatter syntax

### Images not loading?

1. Check image path in markdown
2. Ensure images are in `public/content/projects/`
3. Verify image file extensions

### Code not highlighting?

1. Check language specification in code fence
2. Ensure language is supported by Prism.js

## Example Projects

See `content/projects/hover-card-test.md` for a complete example with:
- Frontmatter
- Multiple heading levels
- Code blocks with syntax highlighting
- Lists and checkboxes
- Blockquotes
- Various markdown features 
