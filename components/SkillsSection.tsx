'use client';

import { useEffect, useRef } from 'react';
import { usePortfolio } from '@/components/PortfolioContext';

export default function SkillsSection() {
    const ref = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const skillGroups = data.skills;

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 80);
                    });
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [skillGroups]);

    return (
        <section className="section skills-section" id="skills" ref={ref}>
            <div className="section-inner">
                <div className="section-header" data-reveal>
                    <p className="section-label">
                        <span className="section-number">∞</span>
                        Craft
                    </p>
                    <h2 className="section-title">
                        Tools &amp;
                        <br />
                        <span className="accent-text">Technologies.</span>
                    </h2>
                </div>

                <div className="skills-grid">
                    {skillGroups.map((group, gi) => (
                        <div key={group.label || gi} className="skill-group" data-reveal style={{ transitionDelay: `${gi * 80}ms` }}>
                            <h3 className="skill-group-label">{group.label}</h3>
                            <div className="skill-tags">
                                {group.skills.map((skill, si) => (
                                    <span key={si} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
