import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function StarField(){
    const setColors = ['#FF6B4A', "#FFD666", "#7BA3FF", "#F0F0FF"]

    const [stars, setStars] = useState<{x: number, y: number, opacity: number, size: number, duration: number, delay: number, colors: string}[]>([])

    useEffect(() => {
        setStars(Array.from({length: 120}, (_, i) => ({
            x: Math.random() * 98,
            y: Math.random() * 98,
            opacity: Math.random() * 0.6 + 0.2,
            size: Math.random() * 2 + 5,
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 4,
            colors: setColors[Math.floor(Math.random() * setColors.length)]
        })))
    }, [])

    return(
        <div className="absolute w-full h-full inset-0 overflow-hidden pointer-events-none">
            {stars.map((star, i) => (
                <motion.span 
                    key={i}
                    animate={{opacity: [0.2, 0.8, 0.2]}}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity
                    }}
                    style={{
                        backgroundColor: `${star.colors}`,
                        height: `${star.size}px`,
                        width: `${star.size}px`,
                        top: `${star.y}%`,
                        left: `${star.x}%`,
                        position: 'absolute',
                        borderRadius: '100%',
                        animationIterationCount: 'infinite'
                    }}
                />
            ))}
        </div>
    )
}