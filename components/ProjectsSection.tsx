'use client';

import { useEffect, useRef } from 'react';
import ProjectCard from '@/components/ProjectCard';
import projects from '@/lib/projects';

export default function ProjectsSection() {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 100);
                    });
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="section projects-section" id="projects" ref={ref}>
            <div className="section-inner">
                <div className="section-header" data-reveal>
                    <p className="section-label">
                        <span className="section-number">05</span>
                        Selected Projects
                    </p>
                    <h2 className="section-title">
                        Things I&rsquo;ve
                        <br />
                        <span className="accent-text">Built.</span>
                    </h2>
                </div>

                <div className="projects-grid">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
