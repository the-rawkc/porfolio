'use client';

import { useEffect, useRef } from 'react';
import { usePortfolio } from '@/components/PortfolioContext';

export default function ExperienceSection() {
    const ref = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const experiences = data.experiences;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                ref.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 120);
                });
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [experiences]);

    return (
        <section className="section experience-section" id="experience" ref={ref}>
            <div className="section-inner">
                <div className="section-header" data-reveal>
                    <p className="section-label">Background</p>
                    <h2 className="section-title">
                        Education &amp;
                        <br />
                        <span className="accent-text">Experience.</span>
                    </h2>
                </div>

                <div className="timeline">
                    {experiences.map((item, index) => (
                        <div key={item.id || index} className="timeline-item" data-reveal>
                            <div className="timeline-marker">
                                <div className="timeline-dot" />
                                {index < experiences.length - 1 && <div className="timeline-line" />}
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-meta">
                                    <span className="timeline-type">{item.type || 'Experience'}</span>
                                    <span className="timeline-period">{item.period}</span>
                                </div>
                                <h3 className="timeline-role">{item.role}</h3>
                                <p className="timeline-org">{item.org}</p>
                                <p className="timeline-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
