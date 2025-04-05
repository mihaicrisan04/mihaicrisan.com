import Link from 'next/link'

export default function Page() {
  return (
    <section>
      {/* Preload projects page */}
      <Link href="/projects" prefetch={true} className="hidden" />
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Hi, I'm Mihai, welcome to my homepage.</h3>
        
        <p className="mb-4">
          I'm a Computer Science student at <a href="https://www.cs.ubbcluj.ro" className="hover:underline">Babeș-Bolyai University</a> and a software engineer with a growing passion for AI and all things tech.
        </p>

        <p className="mb-4">
        I'm addicted to clean code and perfectly engineered solutions. I treat good architecture like an art form and see naming variables as a spiritual journey. I chase elegant logic like most people chase weekends😌.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">For more of my professional background and work:</h3>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li><a href="/files/cv.pdf" className="hover:underline">my cv</a></li>
          <li><a href="https://github.com/mihaicrisan04" className="hover:underline">my github</a></li>
          <li><a href="https://linkedin.com/in/mihaicrisan04" className="hover:underline">my linkedin</a></li>
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Get in touch at <i>crisanmihai2004@gmail.com</i></h3>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">A bit more about me</h3>
        
        <p className="mb-4">
        In my free time, I enjoy experimenting with the latest tools, optimizing workflows, and improving my typing speed on <a href="" className="hover:underline">Monkeytype</a>. I'm a Vim user who loves working in the terminal and pushing the limits of productivity, often tweaking my keyboard setup to perfection.
        </p>

        <p className="mb-4">Outside of tech, I'm passionate about sports and inspired by clever design. For a peek into the movies that inspire me, check out my <a href="https://letterboxd.com/MihaiCrisan/" className="hover:underline">Letterboxd</a>.</p>
      </div>
    </section>
  )
}
