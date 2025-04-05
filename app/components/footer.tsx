function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-10 mt-8 border-t border-gray-700 pt-6">
      {/* <ul className="flex flex-col space-y-2 md:flex-row md:space-x-6 md:space-y-0">
        <li>
          <a
            className="flex items-center transition-all hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/yourusername"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">github</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://linkedin.com/in/yourusername"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">linkedin</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://twitter.com/yourusername"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">twitter</p>
          </a>
        </li>
      </ul> */}
      <p className="mt-8 text-[var(--text-secondary)]">
        © {new Date().getFullYear()} Mihai Crisan
      </p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Inspired by <a href="https://this-website.com" className="hover:underline">this website</a>, built with <a href="https://nextjs.org" className="hover:underline">Next.js</a>
      </p>
    </footer>
  )
}
