export default function Page() {
  return (
    <section>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Hi, I'm Mihai, welcome to my homepage.</h3>
        
        <p className="mb-4">
          I'm currently working as a Software Engineer at <a href="https://example.com" className="hover:underline">Company Name</a>, where I am focusing on web development and cloud solutions.
        </p>

        <p className="mb-4">
          Before that, I earned my MSc in Computer Science at the University of Technology.
          In my <a href="/files/thesis.pdf" className="hover:underline">thesis</a>, I worked on developing machine learning models for natural language processing.
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
          I was born in Romania but grew up in several countries due to my parents' work. In my free time, I enjoy hiking, playing chess, and experimenting with new programming languages. I like to talk and think about technology, sustainability, and the future of AI.
        </p>
        
        <p className="mb-4">
          My favorite artistic period is contemporary art and design. For what I listen to, check out my <a href="https://open.spotify.com/user/yourusername" className="hover:underline">playlist</a>. For what I read, check out my <a href="https://goodreads.com/user/yourusername" className="hover:underline">goodreads</a>.
        </p>
      </div>
    </section>
  )
}
