/**
 * Starter content. Everything here is editable from the admin dashboard.
 * Items marked isPlaceholder are samples — replace them with your real work.
 */

export const content = {
  profile: {
    name: 'Zubayer Hossen',
    title: 'Full-Stack MERN Developer',
    location: 'Bangladesh',
    email: '',
    phone: '',
    photo: '',
    logo: '',
    bio: 'Full-stack developer building web applications with MongoDB, Express, React and Node.js.',
  },
  hero: {
    greeting: "Hi, I'm",
    headline: 'Zubayer Hossen',
    roleTitle: 'Full-Stack MERN Developer',
    subtitle: 'I build secure, fast web applications from the database to the interface.',
    description:
      'I design REST APIs, build responsive React interfaces and ship complete MERN projects I can walk you through end to end. I am looking for a software developer role and open to freelance work.',
    availabilityStatus: true,
    availabilityText: 'Available for opportunities',
    ctas: [
      { label: 'View my work', path: '/projects', variant: 'primary' },
      { label: 'Hire me', path: '/contact', variant: 'secondary' },
      { label: 'Download resume', path: '@resume', variant: 'ghost' },
    ],
    floatingTech: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Git', 'GitHub', 'TypeScript'],
  },
  about: {
    headline: 'Developer who cares about the whole stack',
    bio: 'I am a full-stack developer focused on the MERN stack. I like taking an idea from a data model to a deployed, usable product — and explaining the decisions along the way.',
    careerDirection: 'I am aiming for a junior-to-mid full-stack developer role where I can contribute to real products, learn from experienced engineers and grow into ownership of features end to end.',
    philosophy: 'Keep it simple, make it work, then make it fast. Clear code, honest estimates and small, reviewable changes beat clever tricks.',
    currentLearning: 'Deepening my backend fundamentals, testing, and deployment practices.',
    futureGoals: 'Work on a product team, contribute to open source and build tools that save people time.',
    interests: ['Web development', 'Problem solving', 'Open source', 'Writing about what I learn'],
    timeline: [],
  },
  settings: {
    siteName: 'Zubayer Hossen',
    tagline: 'Full-Stack MERN Developer',
    defaultTheme: 'dark',
    defaultLanguage: 'en',
    features: { loader: true, customCursor: true, konami: true },
    navigation: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Skills', path: '/skills' },
      { label: 'Projects', path: '/projects' },
      { label: 'Blog', path: '/blog' },
      { label: 'Services', path: '/services' },
      { label: 'Contact', path: '/contact' },
      { label: 'Resume', path: '/resume', cta: true },
    ],
    homepageSections: [
      { key: 'stats', label: 'Quick stats', enabled: true },
      { key: 'tech', label: 'Technologies', enabled: true },
      { key: 'about', label: 'About', enabled: true },
      { key: 'skills', label: 'Skills', enabled: true },
      { key: 'projects', label: 'Featured projects', enabled: true },
      { key: 'caseStudies', label: 'Case studies', enabled: true },
      { key: 'experience', label: 'Experience', enabled: true },
      { key: 'education', label: 'Education', enabled: true },
      { key: 'certifications', label: 'Certifications', enabled: true },
      { key: 'services', label: 'Services', enabled: true },
      { key: 'blog', label: 'Featured articles', enabled: true },
      { key: 'testimonials', label: 'Testimonials', enabled: true },
      { key: 'workWithMe', label: 'Work with me', enabled: true },
      { key: 'contact', label: 'Contact call-to-action', enabled: true },
    ],
    stats: [
      { label: 'Projects', value: 0, auto: 'projects', suffix: '' },
      { label: 'Technologies', value: 0, auto: 'skills', suffix: '' },
      { label: 'Articles', value: 0, auto: 'blogs', suffix: '' },
      { label: 'Certificates', value: 0, auto: 'certifications', suffix: '' },
    ],
    workWithMe: {
      status: 'Open to full-time roles and freelance projects',
      responseTime: 'Within 24 hours',
      projectTypes: ['Full-stack web apps', 'REST APIs', 'React front ends', 'Portfolio and business websites'],
      text: 'Tell me what you are building. I will reply with questions, an honest estimate and a plan.',
    },
    contactCta: { title: "Let's build something together", text: 'Hiring, freelance work or a quick question — my inbox is open.' },
    footer: { bio: 'Full-stack MERN developer building fast, secure and maintainable web applications.', copyright: 'Zubayer Hossen' },
  },
  seo: {
    defaultTitle: 'Zubayer Hossen — Full-Stack MERN Developer',
    titleTemplate: '%s | Zubayer Hossen',
    description: 'Portfolio of Zubayer Hossen, a Full-Stack MERN developer from Bangladesh. Projects, skills, case studies and articles.',
    keywords: ['MERN developer', 'Full-stack developer', 'React', 'Node.js', 'MongoDB', 'Bangladesh'],
    ogImage: '',
    twitterHandle: '',
  },
  resume: { pdfUrl: '', version: 'v1', lastUpdated: new Date().toISOString().slice(0, 10), summary: '' },
};

const s = (name, category, level, iconSlug, description, extra = {}) => ({ name, category, level, iconSlug, description, isPlaceholder: true, ...extra });

export const skills = [
  s('React', 'Frontend', 70, 'react', 'Component-based UI, hooks, routing and state management.', { featured: true, order: 1 }),
  s('JavaScript', 'Programming', 70, 'javascript', 'Modern ES6+ JavaScript for browser and server.', { featured: true, order: 2 }),
  s('HTML5', 'Frontend', 80, 'html5', 'Semantic, accessible markup.', { order: 3 }),
  s('CSS3', 'Frontend', 75, 'css3', 'Responsive layouts with Flexbox and Grid.', { order: 4 }),
  s('Tailwind CSS', 'Frontend', 70, 'tailwindcss', 'Utility-first styling and design tokens.', { order: 5 }),
  s('Vite', 'Tools', 65, 'vite', 'Fast dev server and production builds.', { order: 6 }),
  s('Node.js', 'Backend', 65, 'nodedotjs', 'Server-side JavaScript and tooling.', { featured: true, order: 7 }),
  s('Express.js', 'Backend', 65, 'express', 'REST APIs, middleware and routing.', { featured: true, order: 8 }),
  s('REST API', 'Backend', 65, '', 'Resource-oriented API design and validation.', { order: 9 }),
  s('JWT', 'Backend', 60, 'jsonwebtokens', 'Token-based authentication and authorization.', { order: 10 }),
  s('MongoDB', 'Database', 65, 'mongodb', 'Document modelling, indexes and aggregation.', { featured: true, order: 11 }),
  s('Mongoose', 'Database', 65, 'mongoose', 'Schemas, validation and middleware.', { order: 12 }),
  s('Git', 'Tools', 70, 'git', 'Branching, commits and pull requests.', { order: 13 }),
  s('GitHub', 'Tools', 70, 'github', 'Version control hosting and collaboration.', { order: 14 }),
  s('Cloudinary', 'Tools', 55, 'cloudinary', 'Media upload and optimisation.', { order: 15 }),
];

export const services = [
  { title: 'Full-Stack Web Development', icon: 'Layers', description: 'End-to-end web applications: database, API and interface.', features: ['Requirements to deployment', 'Authentication and roles', 'Admin dashboards'], order: 1 },
  { title: 'MERN Development', icon: 'Boxes', description: 'Complete applications on MongoDB, Express, React and Node.js.', features: ['Clean architecture', 'Reusable components', 'Documented code'], order: 2 },
  { title: 'React Development', icon: 'AppWindow', description: 'Fast, accessible and responsive React front ends.', features: ['Pixel-accurate UI', 'Performance-minded', 'Mobile first'], order: 3 },
  { title: 'Backend Development', icon: 'Server', description: 'Secure Node.js back ends with well-structured data models.', features: ['MongoDB modelling', 'Validation and security', 'Error handling'], order: 4 },
  { title: 'API Development', icon: 'Webhook', description: 'REST APIs that are easy to consume and easy to maintain.', features: ['Versioned endpoints', 'JWT authentication', 'Clear documentation'], order: 5 },
  { title: 'Website Optimization', icon: 'Gauge', description: 'Improve load time, accessibility and SEO of existing sites.', features: ['Lighthouse audit', 'Image and bundle optimisation', 'SEO basics'], order: 6 },
  { title: 'Bug Fixing', icon: 'Bug', description: 'Track down and fix issues in MERN applications.', features: ['Root-cause analysis', 'Regression-safe fixes', 'Clear write-up'], order: 7 },
  { title: 'Portfolio Development', icon: 'Briefcase', description: 'Personal and professional portfolio websites with a CMS.', features: ['Custom design', 'Editable content', 'SEO ready'], order: 8 },
];

export const projectCategories = [
  { name: 'MERN Stack', description: 'Full-stack applications built with MongoDB, Express, React and Node.js.', order: 1 },
  { name: 'Frontend', description: 'Interface-focused projects.', order: 2 },
  { name: 'Backend & API', description: 'Server-side and API projects.', order: 3 },
];

export const blogCategories = [
  { name: 'MERN Stack', order: 1 },
  { name: 'Learning Notes', order: 2 },
  { name: 'Career', order: 3 },
];

const ph = 'Placeholder project — replace this with what you actually built.';

export const projects = [
  {
    title: 'Job Portal Platform',
    shortDescription: `${ph} A job board with employer and candidate roles.`,
    description: 'Describe the project in a few paragraphs: what it does, who it is for and what makes it interesting. This is sample text created with your portfolio and should be replaced from the admin dashboard.',
    category: 'mern-stack',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Tailwind CSS'],
    tags: ['jobs', 'auth', 'dashboard'],
    type: 'Full-stack',
    status: 'completed',
    featured: true,
    publishStatus: 'published',
    isPlaceholder: true,
    features: ['Role-based authentication (candidate / employer)', 'Job posting and search', 'Application tracking', 'Responsive dashboard'],
    problem: 'What problem does this project solve? Write it from the user’s point of view.',
    solution: 'How does your solution work at a high level?',
    process: 'How did you plan, design and build it?',
    architecture: 'React client → REST API (Express) → MongoDB. JWT authentication with role-based middleware.',
    challenges: ['Describe a real technical challenge you faced.', 'Explain how you solved it.'],
    results: 'What did you learn or achieve? Only include facts you can stand behind.',
    futureImprovements: 'What would you build next?',
    caseStudy: {
      enabled: true,
      research: 'What did you research before building?',
      planning: 'How did you plan features and data models?',
      design: 'Key UI and UX decisions.',
      development: 'Notable implementation details.',
      challenges: 'Hardest problems.',
      solutions: 'How you solved them.',
      result: 'Outcome.',
      lessons: 'What you would do differently.',
      futurePlan: 'What comes next.',
    },
  },
  {
    title: 'Real-time Chat Application',
    shortDescription: `${ph} Messaging with rooms and live updates.`,
    description: 'Sample project entry. Replace with your own description, screenshots and links.',
    category: 'mern-stack',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    tags: ['realtime', 'chat'],
    type: 'Full-stack',
    status: 'in-progress',
    publishStatus: 'published',
    isPlaceholder: true,
    features: ['Direct and group conversations', 'Message history', 'Online status'],
    architecture: 'React client → REST + WebSocket server → MongoDB.',
  },
  {
    title: 'Hostel Management System',
    shortDescription: `${ph} Room allocation, payments and notices.`,
    description: 'Sample project entry. Replace with your own description, screenshots and links.',
    category: 'mern-stack',
    technologies: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
    tags: ['management', 'dashboard'],
    type: 'Full-stack',
    status: 'planned',
    publishStatus: 'published',
    isPlaceholder: true,
    features: ['Room allocation', 'Fee tracking', 'Notice board'],
  },
];

export const blogs = [
  {
    title: 'How this portfolio is built',
    excerpt: 'A short tour of the architecture behind this site: React, Express, MongoDB and a custom admin dashboard.',
    category: 'mern-stack',
    tags: ['architecture', 'mern', 'portfolio'],
    status: 'published',
    featured: true,
    isPlaceholder: true,
    content: `This is a sample article created with the portfolio. Edit or delete it from **Admin → Blog**.

## The big picture

The site has two parts: a React single-page application and an Express REST API backed by MongoDB. Every piece of content you see — hero text, skills, projects, articles — is stored in the database and edited through the admin dashboard.

## Why a CMS for a portfolio?

A portfolio is never finished. Keeping content out of the code means new projects and articles can go live in minutes, without a redeploy.

## Security basics

- Passwords are hashed with bcrypt
- Sessions use short-lived JWTs in HTTP-only cookies
- Requests are validated, rate limited and sanitised

## What is next

Replace this article with something you actually learned. Short, honest posts about real problems you solved make the strongest impression.
`,
  },
];

export const socialLinks = [
  { platform: 'github', label: 'GitHub', url: 'https://github.com/', order: 1, isActive: false },
  { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/', order: 2, isActive: false },
];

export const announcement = {
  text: 'Currently available for full-time roles and freelance projects',
  link: '/contact',
  linkLabel: 'Get in touch',
  type: 'success',
  isActive: true,
};
