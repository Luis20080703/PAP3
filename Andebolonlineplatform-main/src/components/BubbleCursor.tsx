import { useEffect, useRef } from 'react';

interface Bubble {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export function BubbleCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Only enable on fine pointer devices
        const mediaQuery = window.matchMedia('(pointer: fine)');
        if (!mediaQuery.matches) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            // Spawn bubbles on move
            // Randomize count for natural feel
            const count = Math.random() < 0.5 ? 1 : 2;

            for (let i = 0; i < count; i++) {
                bubblesRef.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.random() * 6 + 2, // Size between 2 and 8
                    speedX: (Math.random() - 0.5) * 1.5, // Random X drift
                    speedY: (Math.random() - 0.5) * 1.5, // Random Y drift
                    opacity: 0.8 // Start mostly opaque
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        let animationFrameId: number;

        const animate = () => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw bubbles
            // We process the array backwards to allow easy removal
            for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
                const bubble = bubblesRef.current[i];

                // Physics
                bubble.x += bubble.speedX;
                bubble.y += bubble.speedY;
                bubble.opacity -= 0.02; // Fade out speed
                bubble.size -= 0.05; // Slowly shrink

                if (bubble.opacity <= 0 || bubble.size <= 0) {
                    bubblesRef.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
                // Use the brand blue or a nice cyan
                ctx.fillStyle = `rgba(59, 130, 246, ${bubble.opacity})`; // Tailwind blue-500 equivalent
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', setSize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
        />
    );
}
