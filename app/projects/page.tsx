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
    title: "Personal Portfolio",
    description: "A responsive portfolio website built with Next.js and Tailwind CSS.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/yourusername/portfolio",
    demo: "https://yourportfolio.com"
  },
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce application with product management, cart functionality, and payment integration.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://yourecommerceapp.com"
  },
  {
    title: "Weather App",
    description: "A weather application that displays current weather conditions and forecasts using the OpenWeather API.",
    technologies: ["JavaScript", "React", "CSS", "API Integration"],
    github: "https://github.com/yourusername/weather-app",
    demo: "https://yourweatherapp.com"
  },
  {
    title: "Task Management System",
    description: "A task management application with features like task creation, assignment, prioritization, and progress tracking.",
    technologies: ["Vue.js", "Firebase", "Vuex", "CSS"],
    github: "https://github.com/yourusername/task-manager",
    demo: "https://yourtaskapp.com"
  }
]; 