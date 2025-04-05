'use client'

import { useEffect, useState, useRef } from 'react'

export default function SpriteCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [frame, setFrame] = useState(0)
  const animationRef = useRef<number | null>(null)
  
  // Choose your sprite character - comment/uncomment to change
  const sprites = ['🌟', '✨', '💫', '⭐️', '🤩']
  // const sprites = ['🐱', '😺', '😸', '😹']
  // const sprites = ['🦊', '🦝', '🦄', '🐺']

  // Animation settings
  const followDistance = 50 // Distance at which sprite follows cursor
  const followSpeed = 0.08  // Lower is smoother but slower

  useEffect(() => {
    // Set up animation frames counter
    const frameInterval = setInterval(() => {
      setFrame(prevFrame => (prevFrame + 1) % sprites.length)
    }, 250)

    return () => clearInterval(frameInterval)
  }, [])

  useEffect(() => {
    const updateSpritePosition = () => {
      // Calculate direction from sprite to cursor
      const dx = position.x - spritePosition.x
      const dy = position.y - spritePosition.y
      
      // Calculate distance between sprite and cursor
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Only move if we're beyond the follow distance
      if (distance > followDistance) {
        // Calculate movement amount this frame based on distance
        const moveX = dx * followSpeed
        const moveY = dy * followSpeed
        
        // Update sprite position
        setSpritePosition(prev => ({
          x: prev.x + moveX,
          y: prev.y + moveY
        }))
      }
      
      // Continue the animation loop
      animationRef.current = requestAnimationFrame(updateSpritePosition)
    }
    
    // Start the animation
    animationRef.current = requestAnimationFrame(updateSpritePosition)
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [position, spritePosition])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isLink = target.tagName.toLowerCase() === 'a' || 
                    target.tagName.toLowerCase() === 'button' ||
                    target.closest('a') !== null || 
                    target.closest('button') !== null
      setIsHovering(isLink)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${spritePosition.x}px`,
        top: `${spritePosition.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div 
        className={`text-3xl transition-transform ${isHovering ? 'scale-150' : 'scale-100'}`}
        style={{
          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
          animation: isHovering ? 'bounce 0.7s ease infinite' : 'float 3s ease-in-out infinite'
        }}
      >
        {sprites[frame]}
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }
      `}</style>
    </div>
  )
} 