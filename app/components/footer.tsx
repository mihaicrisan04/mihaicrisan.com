import { TextLoop } from './motion-primitives/text-loop';

// function ArrowIcon() {
//   return (
//     <svg
//       width="12"
//       height="12"
//       viewBox="0 0 12 12"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
//         fill="currentColor"
//       />
//     </svg>
//   )
// }

export default function Footer() {
  return (
    <footer className="mb-10 mt-8 border-t border-gray-700 pt-6">
  
      {/* <TextLoop className='mt-8 text-[var(--text-tertiary)]'>
        <span>© {new Date().getFullYear()} Mihai Crisan</span>
        <span>Inspired by <a href="https://this-website.com" className="hover:underline">this website</a></span>
      </TextLoop> */}
      <p className="mt-8 text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Mihai Crisan
      </p>
      <p className="mt-1 text-sm text-[var(--text-tertiary)]">
        Inspired by <a href="https://www.giuliostarace.com" className="hover:underline">this website</a>, built with <a href="https://nextjs.org" className="hover:underline">Next.js</a>
      </p>
    </footer>
  )
}
