'use client';

import { useEffect, useRef } from 'react';

export default function AboutSection() {
    const ref = useRef<HTMLElement>(null);

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
                            Engineer.
                            <br />
                            Builder.
                            <br />
                            <span className="accent-text">Problem solver.</span>
                        </h2>
                    </div>

                    {/* Right: content */}
                    <div className="about-right">
                        <p className="about-bio" data-reveal>
                            I&rsquo;m <strong>Ravi Mohan Rohela</strong>, a software engineer who enjoys turning complex
                            requirements into clean, working software. My focus is on backend systems and full-stack
                            product development — writing APIs that perform well, interfaces that feel intuitive,
                            and architectures that can actually grow.
                        </p>

                        <p className="about-bio" data-reveal>
                            I graduated with a B.Tech in Information Technology from{' '}
                            <em>Ajay Kumar Garg Engineering College</em> (2021–2025), where I built most of the
                            projects in this portfolio while exploring everything from distributed systems
                            to generative AI tooling.
                        </p>

                        <p className="about-bio" data-reveal>
                            I care about code that works the first time it matters — reliable, legible, and built
                            to last rather than built to impress on a conference slide.
                        </p>

                        <div className="about-details" data-reveal>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Location</span>
                                <span className="about-detail-value">India</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Focus</span>
                                <span className="about-detail-value">Backend &amp; Full-Stack</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Education</span>
                                <span className="about-detail-value">B.Tech IT — 2025</span>
                            </div>
                            <div className="about-detail-item">
                                <span className="about-detail-label">Status</span>
                                <span className="about-detail-value about-status">Available for opportunities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
