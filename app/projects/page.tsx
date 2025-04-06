export default function ProjectsPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8">Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.title} className="border border-gray-700 rounded-lg p-6 hover:border-[var(--accent-color)] transition-all">
            <h2 className="text-xl font-medium mb-2">{project.title}</h2>
            <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="bg-gray-800 px-2 py-1 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub
                </a>
              )}
              {project.demo && (
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const projects = [
  {
    title: "Cluj-Napoca Bus Tracking App",
    description: "A real-time public transportation tracking application for Cluj-Napoca, focusing on fast data processing and user-friendly features. Achieved near-instant data updates for bus locations through efficient network calls and optimized API data handling.",
    technologies: ["Swift", "SwiftUI", "TranzyAPI"],
    github: "https://github.com/mihaicrisan04/bus-map"
  },
  {
    title: "Boccelute",
    description: "A full-stack e-commerce website specializing in tote bag sales. Implemented robust backend logic for user account management with secure encryption of sensitive data and seamless signup functionality.",
    technologies: ["JavaScript", "PHP", "SQL", "MySQL", "WampServer"],
    github: "https://github.com/mihaicrisan04/boccelute"
  },
  {
    title: "Obstruction Game",
    description: "An implementation of the 'Obstruction' game with a scalable architecture and advanced AI opponent using Minimax algorithm with Alpha-Beta Pruning. Created using Python and Pygame for graphical rendering and interactive gameplay.",
    technologies: ["Python", "PyGame", "AI Algorithms"],
    github: "https://github.com/mihaicrisan04/obstruction"
  },
  {
    title: "Medlog",
    description: "Led the design and development of a healthcare communication platform in a team of 5. Optimized navigation system improving user efficiency by 50% and implemented responsive design for all screen sizes.",
    technologies: ["Full-Stack Development", "UI/UX Design", "Responsive Design"],
    demo: "https://medlog.app"
  },
  {
    title: "Kindergarten Automation Project",
    description: "Developed a Google Sheets automation system and email newsletter system for efficient parent-teacher communication. Transitioned from paper-based to digital reporting, improving data accuracy and accessibility.",
    technologies: ["Google Apps Script", "Automation", "Email Systems"]
  },
  {
    title: "Personal Portfolio",
    description: "A responsive portfolio website built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/mihaicrisan04/portfolio",
    demo: "https://mihaicrisan.com"
  }
]; 