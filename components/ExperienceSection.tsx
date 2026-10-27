'use client';

import { useEffect, useRef } from 'react';

const experiences = [
    {
        type: 'education',
        role: 'B.Tech in Information Technology',
        org: 'Ajay Kumar Garg Engineering College',
        period: '2021 – 2025',
        desc: 'Studied core computer science fundamentals while building projects across backend, full-stack, and AI-assisted video tooling.',
    },
];

export default function ExperienceSection() {
    const ref = useRef<HTMLElement>(null);

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
    }, []);

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
                        <div key={item.org} className="timeline-item" data-reveal>
                            <div className="timeline-marker">
                                <div className="timeline-dot" />
                                {index < experiences.length - 1 && <div className="timeline-line" />}
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-meta">
                                    <span className="timeline-type">Education</span>
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
