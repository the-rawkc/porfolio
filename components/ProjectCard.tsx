'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
            { threshold: 0.15 }
        );
        if (cardRef.current) obs.observe(cardRef.current);
        return () => obs.disconnect();
    }, []);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ x: dy * -5, y: dx * 5 });
    };

    const onMouseLeave = () => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    const statusLabel: Record<string, string> = {
        live: 'Live',
        completed: 'Completed',
        development: 'In Development',
    };

    return (
        <div
            ref={cardRef}
            className="project-card"
            data-index={index}
            style={{
                opacity: revealed ? 1 : 0,
                transform: revealed
                    ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0)`
                    : 'translateY(40px)',
                transition: revealed
                    ? 'opacity 0.7s ease, transform 0.15s ease'
                    : `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
            }}
            onMouseMove={onMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onMouseLeave}
        >
            {/* Top bar accent — gradient band */}
            <div
                className="project-card-accent"
                style={{
                    background: `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}88, transparent)`,
                    height: hovered ? '4px' : '2px',
                    opacity: hovered ? 1 : 0.6,
                }}
            />

            <div className="project-card-inner">
                {/* Header */}
                <div className="project-header">
                    <div>
                        <p className="project-category">{project.category}</p>
                        <h3 className="project-title" style={{ color: hovered ? project.accentColor : '#F5F5F5' }}>
                            {project.title}
                        </h3>
                    </div>
                    <span
                        className="project-status"
                        style={{
                            color: project.status === 'development' ? '#FB923C' :
                                project.status === 'live' ? '#4ADE80' : '#A1A1AA',
                        }}
                    >
                        {statusLabel[project.status]}
                    </span>
                </div>

                <p className="project-short-desc">{project.shortDesc}</p>

                {/* Stack */}
                <div className="project-stack">
                    {project.stack.map(tech => (
                        <span key={tech} className="stack-tag">{tech}</span>
                    ))}
                </div>

                {/* Features — visible on hover */}
                <div
                    className="project-features"
                    style={{ maxHeight: hovered ? '200px' : '0', opacity: hovered ? 1 : 0, transition: 'max-height 0.4s ease, opacity 0.3s ease' }}
                >
                    <ul className="features-list">
                        {project.features.slice(0, 4).map(f => (
                            <li key={f}>
                                <span className="feature-dot" style={{ background: project.accentColor }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Links */}
                <div className="project-links">
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                            aria-label={`${project.title} GitHub`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg> GitHub
                        </a>
                    )}
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link project-link--primary"
                            style={{ color: project.accentColor, borderColor: project.accentColor + '44' }}
                            aria-label={`${project.title} Live Demo`}
                        >
                            <ExternalLink size={16} /> Live Demo
                        </a>
                    )}
                </div>
            </div>

            {/* Subtle light effect on hover */}
            {hovered && (
                <div
                    className="project-hover-glow"
                    style={{
                        background: `radial-gradient(circle at 50% 0%, ${project.accentColor}0D 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
}
