import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100svh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050505',
                color: '#F5F5F5',
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                textAlign: 'center',
                padding: '40px 20px',
            }}
        >
            <p
                style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#C6FF4D',
                    marginBottom: '20px',
                }}
            >
                Error 404
            </p>
            <h1
                style={{
                    fontSize: 'clamp(48px, 10vw, 96px)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '20px',
                }}
            >
                Lost in space.
            </h1>
            <p style={{ color: '#A1A1AA', fontSize: '16px', marginBottom: '40px' }}>
                This page doesn&apos;t exist. Let&apos;s get you back.
            </p>
            <Link
                href="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 28px',
                    background: '#C6FF4D',
                    color: '#050505',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                }}
            >
                Back to RAWKC ↗
            </Link>
        </div>
    );
}
