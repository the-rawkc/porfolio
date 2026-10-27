'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePortfolio } from '@/components/PortfolioContext';

const ParticleUniverse = dynamic(() => import('@/components/ParticleUniverse'), { ssr: false });

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const hero = data.hero;

    useEffect(() => {
        // Animate hero elements in on load
        const timers: ReturnType<typeof setTimeout>[] = [];
        const els = heroRef.current?.querySelectorAll<HTMLElement>('[data-hero-animate]');
        els?.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(22px)';
            timers.push(
                setTimeout(() => {
                    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 200 + i * 140)
            );
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    const scrollToProjects = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };
    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero" ref={heroRef} id="hero">
            <div className="hero-particles">
                <ParticleUniverse />
            </div>

            {/* Dark gradient at bottom for section transition */}
            <div className="hero-fade-bottom" aria-hidden="true" />

            <div className="hero-content">
                <p className="hero-label" data-hero-animate>
                    {hero.label}
                </p>

                <h1 className="hero-headline" data-hero-animate>
                    {hero.headlineLine1}
                    <br />
                    {hero.headlineLine2}
                    <br />
                    <span className="hero-headline-accent">{hero.headlineAccent}</span>
                    <br />
                    {hero.headlineLine4}
                </h1>

                <p className="hero-description" data-hero-animate>
                    {hero.description}
                </p>

                <div className="hero-ctas" data-hero-animate>
                    <button className="cta-primary" onClick={scrollToProjects}>
                        {hero.ctaPrimaryText}
                    </button>
                    <button className="cta-secondary" onClick={scrollToContact}>
                        {hero.ctaSecondaryText}
                    </button>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator" data-hero-animate aria-hidden="true">
                <span className="scroll-line" />
                <span className="scroll-text">Scroll</span>
            </div>
        </section>
    );
}
