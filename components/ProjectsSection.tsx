'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { usePortfolio } from '@/components/PortfolioContext';

export default function ProjectsSection() {
    const ref = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const projects = data.projects;
    const [showAll, setShowAll] = useState(false);

    const visibleProjects = showAll ? projects : projects.slice(0, 6);

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
    }, [visibleProjects]);

    const handleToggleShow = () => {
        if (showAll) {
            setShowAll(false);
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            setShowAll(true);
        }
    };

    return (
        <section className="section projects-section" id="projects" ref={ref}>
            <div className="section-inner">
                <div className="section-header" data-reveal>
                    <p className="section-label">
                        <span className="section-number">{String(projects.length).padStart(2, '0')}</span>
                        Selected Projects
                    </p>
                    <h2 className="section-title">
                        Things I&rsquo;ve
                        <br />
                        <span className="accent-text">Built.</span>
                    </h2>
                </div>

                <div className="projects-grid">
                    {visibleProjects.map((project, i) => (
                        <ProjectCard key={project.id || i} project={project} index={i} />
                    ))}
                </div>

                {projects.length > 6 && (
                    <div className="show-more-wrapper">
                        <button
                            type="button"
                            className="show-more-btn"
                            onClick={handleToggleShow}
                            aria-expanded={showAll}
                        >
                            <span>{showAll ? 'Show Fewer Projects' : `Show More Projects (+${projects.length - 6})`}</span>
                            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
