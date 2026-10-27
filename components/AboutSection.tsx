'use client';

import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '@/components/PortfolioContext';

function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const animated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animated.current) {
                    animated.current = true;
                    const start = performance.now();
                    const step = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - (1 - progress) * (1 - progress);
                        setCount(Math.round(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count}</span>;
}

export default function AboutSection() {
    const ref = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const about = data.about;

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
                            setTimeout(() => {
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                            }, i * 120);
                        });
                    }
                });
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="section about-section" id="about" ref={ref}>
            <div className="section-inner">
                <div className="about-grid">
                    {/* Left: big typographic treatment */}
                    <div className="about-left">
                        <p className="section-label" data-reveal>About</p>
                        <h2 className="about-headline" data-reveal>
                            {about.headlineLine1}
                            <br />
                            {about.headlineLine2}
                            <br />
                            <span className="accent-text">{about.headlineAccent}</span>
                        </h2>
                    </div>

                    {/* Right: content */}
                    <div className="about-right">
                        {about.bioParagraphs.map((para, i) => (
                            <p key={i} className="about-bio" data-reveal>
                                {para}
                            </p>
                        ))}

                        {/* Animated Stat Counters */}
                        <div className="about-stats" data-reveal>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <AnimatedCounter target={about.stats.projectsCount} />
                                </span>
                                <span className="stat-label">Projects Built</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <AnimatedCounter target={about.stats.yearsCoding} />+
                                </span>
                                <span className="stat-label">Years Coding</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <AnimatedCounter target={about.stats.deploymentsLive} />
                                </span>
                                <span className="stat-label">Deployments Live</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <AnimatedCounter target={about.stats.technologiesCount} />+
                                </span>
                                <span className="stat-label">Technologies Used</span>
                            </div>
                        </div>

                        <div className="about-details" data-reveal>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Location</span>
                                <span className="about-detail-value">{about.details.location}</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Focus</span>
                                <span className="about-detail-value">{about.details.focus}</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Education</span>
                                <span className="about-detail-value">{about.details.education}</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Status</span>
                                <span className="about-detail-value about-status">{about.details.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
