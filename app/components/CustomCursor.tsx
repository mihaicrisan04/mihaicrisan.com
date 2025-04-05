'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show cursor when mouse enters the window
    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Update position with slight delay for trailing effect
    const handleMouseMove = (e: MouseEvent) => {
      setTimeout(() => {
        setPosition({ x: e.clientX, y: e.clientY })
      }, 50) // Small delay for trailing effect
    }

    // Check if mouse is over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isLink = target.tagName.toLowerCase() === 'a' || 
                    target.tagName.toLowerCase() === 'button' ||
                    target.closest('a') !== null || 
                    target.closest('button') !== null
      setIsPointer(isLink)
    }

    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      {/* Hide real cursor */}
      <style jsx global>{`
        body {
          cursor: none;
        }
        a, button {
          cursor: none;
        }
      `}</style>
      
      {/* Main circular cursor */}
      <div 
        className={`fixed pointer-events-none z-50 rounded-full mix-blend-difference transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isPointer ? '50px' : '20px',
          height: isPointer ? '50px' : '20px',
          backgroundColor: 'white',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s',
        }}
      />
      
      {/* Trailing effect */}
      <div 
        className={`fixed pointer-events-none z-40 rounded-full mix-blend-difference transition-opacity duration-300 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '8px',
          height: '8px',
          backgroundColor: 'white',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.15s linear, top 0.15s linear',
          transitionDelay: '0.05s',
        }}
      />
    </>
  )
} 