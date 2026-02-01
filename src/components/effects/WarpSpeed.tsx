'use client';

import { useEffect, useRef } from 'react';

interface WarpSpeedProps {
    className?: string;
    starCount?: number;
    speed?: number;
}

export function WarpSpeed({ className = '', starCount = 1000, speed = 2 }: WarpSpeedProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        // Star factory
        const createStar = () => ({
            x: (Math.random() - 0.5) * width * 2,
            y: (Math.random() - 0.5) * height * 2,
            z: Math.random() * width
        });

        const stars = Array.from({ length: starCount }, createStar);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            cx = width / 2;
            cy = height / 2;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const animate = () => {
            if (!ctx) return;

            // Fade trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                // Update
                star.z -= speed * 10;

                // Reset if passed camera
                if (star.z <= 0) {
                    star.z = width;
                    star.x = (Math.random() - 0.5) * width * 2;
                    star.y = (Math.random() - 0.5) * height * 2;
                }

                // Draw
                const sx = (star.x / star.z) * width + cx;
                const sy = (star.y / star.z) * height + cy;

                // Don't draw if outside canvas
                if (sx < 0 || sx > width || sy < 0 || sy > height) return;

                const size = (1 - star.z / width) * 3;
                const alpha = (1 - star.z / width);

                // Tail effect
                const px = (star.x / (star.z + speed * 10)) * width + cx;
                const py = (star.y / (star.z + speed * 10)) * height + cy;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(200, 255, 255, ${alpha})`;
                ctx.lineWidth = size;
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();

                // Star head
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [starCount, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`block absolute inset-0 w-full h-full pointer-events-none ${className}`}
        />
    );
}
