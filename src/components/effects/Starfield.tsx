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
    shouldTwinkle: boolean;
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
    reducedMotion?: boolean;
}

export function Starfield({ warp = false, reducedMotion = false }: StarfieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const warpSpeedRef = useRef(0);
    const warpRef = useRef(warp);
    const reducedMotionRef = useRef(reducedMotion);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        warpRef.current = warp;
    }, [warp]);

    useEffect(() => {
        reducedMotionRef.current = reducedMotion;
    }, [reducedMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let shootingStars: ShootingStar[] = [];

        const isMobile = window.innerWidth < 768;
        // Configuration
        const BASE_STAR_COUNT = reducedMotion ? 400 : 800;
        const STAR_COUNT = isMobile ? Math.floor(BASE_STAR_COUNT / 2) : BASE_STAR_COUNT;
        const TARGET_WARP_SPEED = 50;
        const BASE_SPEED = 0.05;

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                starsRef.current.push({
                    x: Math.random() * width - width / 2,
                    y: Math.random() * height - height / 2,
                    z: Math.random() * width,
                    size: Math.random() * 0.8 + 0.2,
                    baseOpacity: Math.random() * 0.5 + 0.5,
                    opacity: 1,
                    twinkleSpeed: Math.random() * 0.05 + 0.02,
                    twinklePhase: Math.random() * Math.PI * 2,
                    shouldTwinkle: Math.random() > 0.7,
                });
            }
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            if (starsRef.current.length < STAR_COUNT) {
                initStars();
            }
        };

        // ... Shooting Star Logic ...
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

        const render = () => {
            // STOP ANIMATION if reduced motion is ON
            if (reducedMotionRef.current) {
                // Just draw static stars once and return? 
                // Better: Draw a slow, simple twinkle or static scene.
                // For now, let's keep a very slow drift or just static.
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, width, height);

                const cx = width / 2;
                const cy = height / 2;

                starsRef.current.forEach((star) => {
                    // No Z movement
                    const safeZ = Math.max(0.1, star.z);
                    const k = 128.0 / safeZ;
                    const px = star.x * k + cx;
                    const py = star.y * k + cy;

                    if (px >= 0 && px <= width && py >= 0 && py <= height) {
                        const shade = Math.floor((1 - safeZ / width) * 255);
                        ctx.fillStyle = `rgb(${shade},${shade},${255})`;
                        ctx.beginPath();
                        ctx.arc(px, py, star.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Request next frame only to handle resize/updates, but logic is static
                animationFrameRef.current = requestAnimationFrame(render);
                return;
            }

            // ... NORMAL RENDER ...
            const target = warpRef.current ? TARGET_WARP_SPEED : BASE_SPEED;
            warpSpeedRef.current += (target - warpSpeedRef.current) * 0.05;

            if (warpSpeedRef.current > 1) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.fillRect(0, 0, width, height);
            }

            const cx = width / 2;
            const cy = height / 2;

            starsRef.current.forEach((star) => {
                star.z -= warpSpeedRef.current;

                if (star.z <= 0 || isNaN(star.z)) {
                    star.z = width;
                    star.x = Math.random() * width - cx;
                    star.y = Math.random() * height - cy;
                }

                const safeZ = Math.max(0.1, star.z);
                const k = 128.0 / safeZ;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = Math.max(0, (1 - safeZ / width) * 2.5);
                    const shade = Math.floor((1 - safeZ / width) * 255);

                    if (warpSpeedRef.current < 2 && star.shouldTwinkle) {
                        star.twinklePhase += star.twinkleSpeed;
                        star.opacity = star.baseOpacity + Math.sin(star.twinklePhase) * 0.4;
                    } else {
                        star.opacity = star.baseOpacity;
                    }

                    const colorVal = `rgb(${shade},${shade},${255})`;
                    ctx.fillStyle = colorVal;
                    ctx.strokeStyle = colorVal;

                    if (warpSpeedRef.current > 2) {
                        const oldK = 128.0 / (star.z + warpSpeedRef.current * 1.5);
                        const oldPx = star.x * oldK + cx;
                        const oldPy = star.y * oldK + cy;

                        ctx.lineWidth = size;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(oldPx, oldPy);
                        ctx.stroke();
                    } else {
                        // Optimization: Use fillRect for small stars instead of arc
                        if (size < 1.5) {
                            ctx.fillRect(px - size / 2, py - size / 2, size, size);
                        } else {
                            ctx.beginPath();
                            ctx.arc(px, py, size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });

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
                    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(tailX, tailY);
                    ctx.stroke();
                });

                if (Math.random() < 0.005) {
                    spawnShootingStar();
                }
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [reducedMotion]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Nebula Glow Spots */}
            {!warp && !reducedMotion && (
                <>
                    <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15] transition-opacity duration-1000 -z-10 blur-[100px] bg-[radial-gradient(circle,rgba(124,58,237,0.4),transparent_70%)] -left-[20%] top-[10%]" />
                    <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12] transition-opacity duration-1000 -z-10 blur-[90px] bg-[radial-gradient(circle,rgba(6,182,212,0.4),transparent_70%)] right-[5%] -bottom-[10%]" />
                </>
            )}
        </div>
    );
}
