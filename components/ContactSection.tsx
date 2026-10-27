'use client';

import { useEffect, useRef } from 'react';
import { Download, Mail } from 'lucide-react';

export default function ContactSection() {
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
        <section className="section contact-section" id="contact" ref={ref}>
            <div className="section-inner">
                <div className="contact-header" data-reveal>
                    <p className="section-label">Get in Touch</p>
                    <h2 className="section-title contact-headline">
                        Have something
                        <br />
                        <span className="accent-text">worth building?</span>
                    </h2>
                    <p className="contact-sub">Let&rsquo;s turn a good idea into something real.</p>
                </div>

                <div className="contact-layout" data-reveal>
                    <div className="contact-links">
                        <a href="mailto:ravimohanrohela@gmail.com" className="contact-link">
                            <Mail size={20} />
                            <span>ravimohanrohela@gmail.com</span>
                        </a>
                        <a href="https://github.com/rawkc" target="_blank" rel="noopener noreferrer" className="contact-link">
                            <span aria-hidden="true">GH</span>
                            <span>github.com/rawkc</span>
                        </a>
                        <a href="https://linkedin.com/in/ravi-mohan-rohela" target="_blank" rel="noopener noreferrer" className="contact-link">
                            <span aria-hidden="true">in</span>
                            <span>linkedin.com/in/ravi-mohan-rohela</span>
                        </a>
                        <a href="/resume.pdf" download="Ravi_Mohan_Rohela_Resume.pdf" className="contact-link contact-link--resume">
                            <Download size={20} />
                            <span>Download Resume (PDF)</span>
                        </a>
                    </div>

                    <div className="contact-form contact-form--direct">
                        <p className="contact-direct-label">Prefer email?</p>
                        <p className="contact-direct-copy">
                            Tell me what you&rsquo;re building and I&rsquo;ll get back to you directly.
                        </p>
                        <a href="mailto:ravimohanrohela@gmail.com" className="cta-primary">
                            Email Ravi <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
