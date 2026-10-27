export interface Project {
    id: string;
    title: string;
    category: string;
    shortDesc: string;
    description: string;
    contributions: string[];
    stack: string[];
    features: string[];
    github?: string;
    demo?: string;
    status: 'live' | 'development' | 'completed';
    accentColor: string;
}

const projects: Project[] = [
    {
        id: 'quantara',
        title: 'Quantara',
        category: 'Online Examination Platform',
        shortDesc: 'A full-stack proctored examination system with real-time monitoring and automated assessment workflows.',
        description:
            'Quantara is a comprehensive online examination and proctoring platform built for educational institutions. It handles the full assessment lifecycle — from exam creation and scheduling through candidate monitoring, automated evaluation, and result processing.',
        contributions: [
            'Designed and implemented the full-stack architecture using Node.js, Express, and React',
            'Built the real-time proctoring module with webcam-based activity monitoring',
            'Created an adaptive question engine supporting MCQ, subjective, and coding challenges',
            'Developed an automated evaluation pipeline with instant result generation',
        ],
        stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'WebSockets', 'TypeScript'],
        features: [
            'Multi-format question support (MCQ, subjective, code)',
            'Real-time candidate monitoring and activity logging',
            'Automated result processing and analytics dashboard',
            'Secure exam session management with timer enforcement',
            'Role-based access for institutions, examiners, and candidates',
        ],
        status: 'completed',
        accentColor: '#C6FF4D',
    },
    {
        id: 'passop',
        title: 'PassOP',
        category: 'Password Manager',
        shortDesc: 'A browser-based password manager with encrypted local storage and a clean, minimal interface.',
        description:
            'PassOP is a client-side password management application focused on simplicity and usability. Passwords are stored with client-side encryption and the interface is designed to be fast and unobtrusive.',
        contributions: [
            'Designed the full UI using React and Tailwind CSS with focus on minimalism',
            'Implemented client-side encryption for credential storage',
            'Built CRUD operations for password entries with search and filter',
            'Created a password strength analyzer and generator',
        ],
        stack: ['React', 'JavaScript', 'Tailwind CSS', 'LocalStorage', 'Web Crypto API'],
        features: [
            'Client-side encrypted credential storage',
            'Password generator with configurable complexity',
            'Password strength indicator',
            'Quick copy-to-clipboard with auto-clear',
            'Search and categorization of stored entries',
        ],
        github: 'https://github.com/rawkc',
        status: 'completed',
        accentColor: '#A0A0C0',
    },
    {
        id: 'travio',
        title: 'Travio',
        category: 'Travel Planning Application',
        shortDesc: 'A social travel platform for discovering destinations, planning itineraries, and splitting travel expenses.',
        description:
            'Travio is a full-stack travel companion application. Users can discover destinations, build collaborative trip itineraries, connect with other travelers, and manage group travel expenses — all within a single platform.',
        contributions: [
            'Architected the backend REST API with Node.js and Express',
            'Built the social matching system for connecting travelers with similar interests',
            'Implemented the full trip planning workflow with collaborative editing',
            'Developed the expense splitting engine with multi-currency support',
            'Deployed backend on Render and frontend on Vercel with MongoDB Atlas',
        ],
        stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Vercel', 'Render'],
        features: [
            'Destination discovery with search and filtering',
            'Collaborative trip itinerary builder',
            'Traveler social matching and profile system',
            'Group expense splitting with settlement tracking',
            'Activity feed and trip sharing',
        ],
        demo: 'https://travio.vercel.app',
        status: 'live',
        accentColor: '#60A5FA',
    },
    {
        id: 'tunetide',
        title: 'Tune Tide',
        category: 'Music Application',
        shortDesc: 'A music discovery and playback application with curated playlists and an audio-first interface.',
        description:
            'Tune Tide is a music-focused web application built for discovering and playing audio content. The interface is designed around the listening experience, with a focus on smooth playback controls and a visually immersive audio environment.',
        contributions: [
            'Built the full frontend using React with an audio-centric design language',
            'Implemented custom audio playback controls with progress tracking',
            'Created the playlist management and track discovery flows',
            'Designed the animated audio visualizer component',
        ],
        stack: ['React', 'JavaScript', 'Web Audio API', 'CSS Animations', 'REST APIs'],
        features: [
            'Audio playback with custom controls',
            'Playlist creation and management',
            'Track discovery and search',
            'Audio visualization effects',
            'Queue management',
        ],
        status: 'completed',
        accentColor: '#F472B6',
    },
    {
        id: 'cinemiq',
        title: 'Cinemiq',
        category: 'AI Video Editing Application',
        shortDesc: 'An AI-powered generative video studio that transforms images and prompts into cinematic video sequences.',
        description:
            'Cinemiq is an AI-assisted video creation platform built around generative workflows. Users can create video sequences from image assets, define cinematic transitions, and control timing through a director\'s panel interface.',
        contributions: [
            'Architected the full-stack platform with React, TypeScript, and Node.js',
            'Built the generative video synthesis pipeline using FFmpeg on the backend',
            'Implemented the AI asset discovery module integrating Giphy and Freesound APIs',
            'Designed the Director\'s Panel for granular control over slide timing and transitions',
            'Created the Photos-to-Video studio enabling image-sequence-based video generation',
        ],
        stack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'FFmpeg', 'Giphy API', 'Freesound API'],
        features: [
            'AI-generated video from image sequences',
            'Director\'s Panel for timing and transition control',
            'Asset discovery from Giphy and Freesound integrations',
            'Parallel video synthesis for faster rendering',
            'Photos-to-Video studio',
            'Background music integration (in development)',
            'Export to MP4 (in development)',
        ],
        status: 'development',
        accentColor: '#FB923C',
    },
];

export default projects;
