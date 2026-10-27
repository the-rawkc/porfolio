'use client';

import { useEffect, useRef, useState } from 'react';
import { ParticleEngine } from '@/lib/particle-engine';

export default function ParticleUniverse() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<ParticleEngine | null>(null);
    const [interacted, setInteracted] = useState(false);
    const [textVisible, setTextVisible] = useState(true);

    useEffect(() => {
        if (!canvasRef.current) return;

        const isMobile = window.innerWidth < 768;
        let engine: ParticleEngine;
        try {
            engine = new ParticleEngine({
                canvas: canvasRef.current,
                isMobile,
                particleCount: isMobile ? 1800 : 3800,
            });
        } catch {
            return;
        }
        engineRef.current = engine;

        const handleFirstInteraction = () => {
            if (!interacted) {
                setInteracted(true);
                setTimeout(() => setTextVisible(false), 400);
            }
        };

        window.addEventListener('mousemove', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });

        return () => {
            engine.destroy();
            engineRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="particle-universe" aria-hidden="true">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
            {/* Instruction text */}
            <div
                className="particle-instruction"
                style={{
                    opacity: textVisible ? 1 : 0,
                    transition: 'opacity 1s ease',
                    pointerEvents: 'none',
                }}
            >
                <span className="touch-hint">Touch to explore.</span>
                <span className="mouse-hint">Move your mouse.</span>
            </div>

            {/* Entering text */}
            <div
                className="particle-instruction"
                style={{
                    opacity: interacted && !textVisible ? 1 : 0,
                    transition: 'opacity 1.2s ease',
                    pointerEvents: 'none',
                    transitionDelay: '0.2s',
                }}
            >
                <span className="entering-text">You&rsquo;re entering RAWKC&rsquo;s world.</span>
            </div>
        </div>
    );
}
