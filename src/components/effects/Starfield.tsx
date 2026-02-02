'use client';

import { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number; // Depth for 3D effect
    size: number;
    baseOpacity: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

interface ShootingStar {
    id: number;
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
    active: boolean;
}

interface StarfieldProps {
    warp?: boolean;
}

export function Starfield({ warp = false }: StarfieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const warpSpeedRef = useRef(0); // Current speed factor

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let shootingStars: ShootingStar[] = [];

        // Configuration
        const STAR_COUNT = 800;
        const TARGET_WARP_SPEED = 50; // Max speed during warp
        const BASE_SPEED = 0.05; // Gentle drift

        // Initialize Canvas Size
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            // Only re-init if empty
            if (starsRef.current.length === 0) {
                initStars();
            }
        };

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                starsRef.current.push({
                    x: Math.random() * width - width / 2, // Center origin
                    y: Math.random() * height - height / 2,
                    z: Math.random() * width, // Random depth
                    size: Math.random() * 0.8 + 0.2, // Base size (will scale by Z)
                    baseOpacity: Math.random() * 0.5 + 0.5,
                    opacity: 1,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        // Shooting Star Logic (Only when not warping)
        const spawnShootingStar = () => {
            const angle = (35 + Math.random() * 25) * (Math.PI / 180);
            const speed = 15 + Math.random() * 10;

            shootingStars.push({
                id: Date.now(),
                x: Math.random() * width,
                y: Math.random() * (height * 0.4),
                length: 100 + Math.random() * 150,
                speed: speed,
                angle: angle,
                opacity: 1,
                active: true
            });
        };

        // Animation Loop
        const render = () => {
            // Smoothly interpolate warp speed
            const target = warp ? TARGET_WARP_SPEED : BASE_SPEED;
            warpSpeedRef.current += (target - warpSpeedRef.current) * 0.05;

            // Clear with trail effect during warp
            if (warpSpeedRef.current > 1) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Leave trails
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.clearRect(0, 0, width, height);
            }

            const cx = width / 2;
            const cy = height / 2;

            // Update and Draw Stars
            starsRef.current.forEach((star) => {
                // Move Star
                star.z -= warpSpeedRef.current;

                // Reset star if it passes camera or is invalid
                if (star.z <= 0 || isNaN(star.z)) {
                    star.z = width;
                    star.x = Math.random() * width - cx;
                    star.y = Math.random() * height - cy;
                }

                // Project 3D position to 2D
                // Prevent division by very small numbers
                const safeZ = Math.max(0.1, star.z);
                const k = 128.0 / safeZ;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = Math.max(0, (1 - safeZ / width) * 2.5); // Bigger as it gets closer
                    const shade = parseInt(((1 - safeZ / width) * 255).toString());

                    // Twinkle (only when slow)
                    if (warpSpeedRef.current < 2) {
                        star.twinklePhase += star.twinkleSpeed;
                        star.opacity = star.baseOpacity + Math.sin(star.twinklePhase) * 0.3;
                    } else {
                        star.opacity = 1;
                    }

                    ctx.beginPath();

                    if (warpSpeedRef.current > 2) {
                        // Draw line streak
                        const oldK = 128.0 / (star.z + warpSpeedRef.current * 1.5); // Previous Z
                        const oldPx = star.x * oldK + cx;
                        const oldPy = star.y * oldK + cy;

                        ctx.strokeStyle = `rgb(${shade},${shade},${255})`;
                        ctx.lineWidth = size;
                        ctx.moveTo(px, py);
                        ctx.lineTo(oldPx, oldPy);
                        ctx.stroke();
                    } else {
                        // Draw circle
                        ctx.fillStyle = `rgb(${shade},${shade},${255})`;
                        ctx.arc(px, py, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });

            // Shooting Stars (Only when calm)
            if (warpSpeedRef.current < 5) {
                shootingStars = shootingStars.filter(s => s.active);
                shootingStars.forEach(star => {
                    star.x += Math.cos(star.angle) * star.speed;
                    star.y += Math.sin(star.angle) * star.speed;

                    if (star.x > width + star.length || star.y > height + star.length) {
                        star.active = false;
                    }

                    const tailX = star.x - Math.cos(star.angle) * star.length;
                    const tailY = star.y - Math.sin(star.angle) * star.length;

                    const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
                    gradient.addColorStop(0, 'rgba(34, 211, 238, 1)');
                    gradient.addColorStop(0.2, 'rgba(34, 211, 238, 0.4)');
                    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(tailX, tailY);
                    ctx.stroke();
                });

                if (Math.random() < 0.005) {
                    spawnShootingStar();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        // Setup
        handleResize();
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [warp]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Nebula Glow Spots */}
            {!warp && (
                <>
                    <div
                        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15] transition-opacity duration-1000"
                        style={{
                            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4), transparent 70%)',
                            left: '-20%',
                            top: '10%',
                            filter: 'blur(100px)',
                            zIndex: -1
                        }}
                    />
                    <div
                        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12] transition-opacity duration-1000"
                        style={{
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%)',
                            right: '5%',
                            bottom: '-10%',
                            filter: 'blur(90px)',
                            zIndex: -1
                        }}
                    />
                </>
            )}
        </div>
    );
}
