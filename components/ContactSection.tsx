'use client';

import { useEffect, useRef } from 'react';
import { Download, Mail } from 'lucide-react';
import { usePortfolio } from '@/components/PortfolioContext';

export default function ContactSection() {
    const ref = useRef<HTMLElement>(null);
    const { data } = usePortfolio();
    const contact = data.contact;

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
                    <p className="section-label">{contact.label}</p>
                    <h2 className="section-title contact-headline">
                        {contact.headlineNormal}
                        <br />
                        <span className="accent-text">{contact.headlineAccent}</span>
                    </h2>
                    <p className="contact-sub">{contact.subtitle}</p>
                </div>

                <div className="contact-layout" data-reveal>
                    <div className="contact-links">
                        <a href={`mailto:${contact.email}`} className="contact-link">
                            <Mail size={20} />
                            <span>{contact.email}</span>
                        </a>
                        {contact.github && (
                            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                                <span aria-hidden="true">GH</span>
                                <span>{contact.github.replace('https://', '')}</span>
                            </a>
                        )}
                        {contact.linkedin && (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                                <span aria-hidden="true">in</span>
                                <span>{contact.linkedin.replace('https://', '')}</span>
                            </a>
                        )}
                        <a
                            href={contact.resumeUrl || '/resume.pdf'}
                            download={contact.resumeFileName || 'Ravi_Mohan_Rohela_Resume.pdf'}
                            className="contact-link contact-link--resume"
                            aria-label="Download Resume PDF"
                        >
                            <Download size={20} />
                            <span>Download Resume (PDF)</span>
                        </a>
                    </div>

                    <div className="contact-form contact-form--direct">
                        <p className="contact-direct-label">Prefer email?</p>
                        <p className="contact-direct-copy">
                            Tell me what you&rsquo;re building and I&rsquo;ll get back to you directly.
                        </p>
                        <a href={`mailto:${contact.email}`} className="cta-primary">
                            Email Ravi <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
