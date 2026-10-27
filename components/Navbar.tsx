'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            // Active section detection
            const sections = ['about', 'projects', 'skills', 'experience', 'contact'];
            for (const id of sections.reverse()) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 120) {
                    setActiveSection(id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNav = (href: string) => {
        setMobileOpen(false);
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <header
            className="navbar"
            style={{
                background: scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
            }}
        >
            <nav className="navbar-inner">
                {/* Wordmark */}
                <Link href="/" className="wordmark" aria-label="RAWKC Home">
                    RAWKC<sup className="registered">®</sup>
                </Link>

                {/* Desktop nav */}
                <ul className="nav-links" role="list">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <button
                                className={`nav-link ${activeSection === link.href.replace('#', '') ? 'nav-link--active' : ''}`}
                                onClick={() => handleNav(link.href)}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                    <li>
                        <a
                            href="/resume.pdf"
                            className="nav-resume-btn"
                            download="Ravi_Mohan_Rohela_Resume.pdf"
                            aria-label="Download Resume"
                        >
                            Resume ↗
                        </a>
                    </li>
                </ul>

                {/* Mobile hamburger */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(v => !v)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            <div
                className="mobile-nav"
                style={{
                    maxHeight: mobileOpen ? '400px' : '0',
                    opacity: mobileOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease, opacity 0.25s ease',
                    background: 'rgba(5,5,5,0.97)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <ul role="list" className="mobile-nav-list">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <button className="mobile-nav-link" onClick={() => handleNav(link.href)}>
                                {link.label}
                            </button>
                        </li>
                    ))}
                    <li>
                        <a href="/resume.pdf" className="mobile-nav-link" download="Ravi_Mohan_Rohela_Resume.pdf">
                            Resume ↗
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
}
