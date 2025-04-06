"use client";

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation';


interface TransitionLinkProps extends LinkProps {
    href: string
    children: React.ReactNode
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
    
export const TransitionLink = ({
    href,
    children,
    ...props
}: TransitionLinkProps) => {
    const router = useRouter()

    const handleTransition = async (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        e.preventDefault()

        const body = document.querySelector('body');
        body?.classList.add('page-transition')

        await sleep(100)

        router.push(href)

        await sleep(100)

        body?.classList.remove('page-transition')
    }

    return (
        <Link 
        onClick={handleTransition}
        href={href} 
        {...props}
        > 
            {children} 
        </Link>

    )
}
 