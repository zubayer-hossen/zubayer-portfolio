import { SERVICE_ICONS } from '../../lib/icons';

const STAFF = ['super_admin', 'admin', 'editor'];
const ADMINS = ['super_admin', 'admin'];

const seo = [
  { name: 'seo.title', label: 'SEO title', type: 'text', group: 'SEO', hint: 'Leave empty to use the title.' },
  { name: 'seo.description', label: 'SEO description', type: 'textarea', rows: 2, group: 'SEO' },
  { name: 'seo.image', label: 'Social share image', type: 'image', folder: 'general', group: 'SEO' },
];
const order = { name: 'order', label: 'Order', type: 'number', hint: 'Lower numbers appear first.' };
const active = { name: 'isActive', label: 'Visible on the site', type: 'boolean', default: true };
const sample = { name: 'isPlaceholder', label: 'This is sample / placeholder content', type: 'boolean', hint: 'Untick after you replace the sample text with real content.' };

/** Collections managed by the generic list + editor pages. */
export const resources = {
  projects: {
    title: 'Projects', singular: 'project', endpoint: 'projects', roles: STAFF, sortName: 'title',
    previewPath: (r) => `/preview/project/${r._id}`, githubSync: true,
    filters: [{ name: 'publishStatus', label: 'Status', options: ['draft', 'published'] }, { name: 'featured', label: 'Featured', options: ['true'] }],
    columns: [{ key: 'title', label: 'Title', primary: true }, { key: 'publishStatus', label: 'Status', type: 'status' }, { key: 'featured', label: 'Featured', type: 'bool' }, { key: 'views', label: 'Views', type: 'number' }, { key: 'updatedAt', label: 'Updated', type: 'date' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, group: 'Basics' },
      { name: 'slug', label: 'URL slug', type: 'text', group: 'Basics', hint: 'Leave empty to generate from the title.' },
      { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2, group: 'Basics' },
      { name: 'category', label: 'Category', type: 'select', optionsFrom: { endpoint: '/project-categories', value: 'slug', label: 'name' }, group: 'Basics' },
      { name: 'type', label: 'Type', type: 'text', placeholder: 'Full-stack, API, Frontend…', group: 'Basics' },
      { name: 'status', label: 'Project status', type: 'select', options: ['completed', 'in-progress', 'planned', 'archived'], group: 'Basics' },
      { name: 'projectDate', label: 'Project date', type: 'date', group: 'Basics' },
      { name: 'featured', label: 'Featured', type: 'boolean', group: 'Basics' },
      { name: 'publishStatus', label: 'Publish status', type: 'select', options: ['draft', 'published'], group: 'Basics', hint: 'Editors can save drafts; admins publish.' },
      { name: 'cover', label: 'Cover image', type: 'image', folder: 'projects', group: 'Media' },
      { name: 'screenshots', label: 'Screenshots', type: 'image', multiple: true, folder: 'projects', group: 'Media' },
      { name: 'videoUrl', label: 'Demo video URL', type: 'url', placeholder: 'YouTube, Vimeo or direct .mp4 link', group: 'Media' },
      { name: 'liveUrl', label: 'Live demo URL', type: 'url', group: 'Links' },
      { name: 'githubUrl', label: 'GitHub repository URL', type: 'url', group: 'Links' },
      { name: 'description', label: 'Description (Markdown)', type: 'markdown', group: 'Details' },
      { name: 'technologies', label: 'Technologies', type: 'tags', group: 'Details', hint: 'Press Enter after each one.' },
      { name: 'tags', label: 'Tags', type: 'tags', group: 'Details' },
      { name: 'features', label: 'Key features', type: 'lines', group: 'Details', hint: 'One per line.' },
      { name: 'problem', label: 'Problem', type: 'textarea', rows: 4, group: 'Story' },
      { name: 'solution', label: 'Solution', type: 'textarea', rows: 4, group: 'Story' },
      { name: 'process', label: 'Process', type: 'textarea', rows: 4, group: 'Story' },
      { name: 'architecture', label: 'Architecture', type: 'textarea', rows: 4, group: 'Story' },
      { name: 'challenges', label: 'Challenges', type: 'lines', group: 'Story', hint: 'One per line.' },
      { name: 'results', label: 'Results', type: 'textarea', rows: 3, group: 'Story' },
      { name: 'futureImprovements', label: 'Future improvements', type: 'textarea', rows: 3, group: 'Story' },
      { name: 'caseStudy.enabled', label: 'Show a case study section', type: 'boolean', group: 'Case study' },
      ...['research', 'planning', 'design', 'development', 'challenges', 'solutions', 'result', 'lessons', 'futurePlan'].map((k) => ({ name: `caseStudy.${k}`, label: k === 'futurePlan' ? 'Future plan' : k[0].toUpperCase() + k.slice(1), type: 'textarea', rows: 3, group: 'Case study' })),
      ...seo,
      { ...sample, group: 'Basics' },
    ],
  },
  'project-categories': {
    title: 'Project categories', singular: 'category', endpoint: 'project-categories', roles: STAFF, sortName: 'name',
    columns: [{ key: 'name', label: 'Name', primary: true }, { key: 'slug', label: 'Slug' }, { key: 'order', label: 'Order', type: 'number' }],
    fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea', rows: 2 }, order],
  },
  blogs: {
    title: 'Blog posts', singular: 'post', endpoint: 'blogs', roles: STAFF, sortName: 'title',
    previewPath: (r) => `/preview/blog/${r._id}`,
    filters: [{ name: 'status', label: 'Status', options: ['draft', 'scheduled', 'published'] }],
    columns: [{ key: 'title', label: 'Title', primary: true }, { key: 'status', label: 'Status', type: 'status' }, { key: 'views', label: 'Views', type: 'number' }, { key: 'publishedAt', label: 'Published', type: 'date' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, group: 'Basics' },
      { name: 'slug', label: 'URL slug', type: 'text', group: 'Basics' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, group: 'Basics' },
      { name: 'category', label: 'Category', type: 'select', optionsFrom: { endpoint: '/blog-categories', value: 'slug', label: 'name' }, group: 'Basics' },
      { name: 'tags', label: 'Tags', type: 'tags', group: 'Basics' },
      { name: 'cover', label: 'Cover image', type: 'image', folder: 'blog', group: 'Basics' },
      { name: 'author', label: 'Author', type: 'text', group: 'Basics' },
      { name: 'content', label: 'Content (Markdown)', type: 'markdown', group: 'Content' },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'scheduled', 'published'], group: 'Publishing', hint: 'Scheduled posts go live automatically at the chosen time.' },
      { name: 'scheduledAt', label: 'Publish at', type: 'datetime', group: 'Publishing' },
      { name: 'featured', label: 'Featured', type: 'boolean', group: 'Publishing' },
      ...seo,
      { ...sample, group: 'Publishing' },
    ],
  },
  'blog-categories': {
    title: 'Blog categories', singular: 'category', endpoint: 'blog-categories', roles: STAFF, sortName: 'name',
    columns: [{ key: 'name', label: 'Name', primary: true }, { key: 'slug', label: 'Slug' }, { key: 'order', label: 'Order', type: 'number' }],
    fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea', rows: 2 }, order],
  },
  skills: {
    title: 'Skills', singular: 'skill', endpoint: 'skills', roles: STAFF, sortName: 'name',
    filters: [{ name: 'category', label: 'Category', options: ['Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'DevOps', 'Design', 'Other'] }],
    columns: [{ key: 'name', label: 'Skill', primary: true }, { key: 'category', label: 'Category' }, { key: 'level', label: 'Level', type: 'number' }, { key: 'featured', label: 'Featured', type: 'bool' }, { key: 'isActive', label: 'Visible', type: 'bool' }],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'DevOps', 'Design', 'Other'] },
      { name: 'level', label: 'Proficiency (0–100)', type: 'number', min: 0, max: 100, hint: 'Be honest — interviewers will ask.' },
      { name: 'years', label: 'Years of experience', type: 'number', step: '0.5' },
      { name: 'iconSlug', label: 'Icon slug (simple-icons)', type: 'text', placeholder: 'react, nodedotjs, mongodb…', hint: 'See simpleicons.org. Leave empty for a monogram.' },
      { name: 'iconUrl', label: 'Custom icon URL', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
      { name: 'featured', label: 'Featured on the homepage', type: 'boolean' },
      order, active, sample,
    ],
  },
  experience: {
    title: 'Experience', singular: 'experience', endpoint: 'experience', roles: STAFF,
    columns: [{ key: 'position', label: 'Position', primary: true }, { key: 'company', label: 'Company' }, { key: 'startDate', label: 'Start', type: 'date' }, { key: 'current', label: 'Current', type: 'bool' }],
    fields: [
      { name: 'position', label: 'Position', type: 'text', required: true }, { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Volunteer'] },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'startDate', label: 'Start date', type: 'date' }, { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'current', label: 'I currently work here', type: 'boolean' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'responsibilities', label: 'Responsibilities', type: 'lines', hint: 'One per line.' },
      { name: 'achievements', label: 'Achievements', type: 'lines', hint: 'Only things you can back up.' },
      { name: 'technologies', label: 'Technologies', type: 'tags' }, order, active,
    ],
  },
  education: {
    title: 'Education', singular: 'education', endpoint: 'education', roles: STAFF,
    columns: [{ key: 'degree', label: 'Degree', primary: true }, { key: 'institution', label: 'Institution' }, { key: 'endYear', label: 'End' }],
    fields: [
      { name: 'degree', label: 'Degree', type: 'text', required: true }, { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text' }, { name: 'startYear', label: 'Start year', type: 'text' }, { name: 'endYear', label: 'End year', type: 'text' },
      { name: 'result', label: 'Result / grade', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea', rows: 3 }, order, active,
    ],
  },
  certifications: {
    title: 'Certifications', singular: 'certification', endpoint: 'certifications', roles: STAFF, sortName: 'title',
    columns: [{ key: 'title', label: 'Title', primary: true }, { key: 'organization', label: 'Issuer' }, { key: 'issueDate', label: 'Issued', type: 'date' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true }, { name: 'organization', label: 'Issuing organisation', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue date', type: 'date' }, { name: 'credentialId', label: 'Credential ID', type: 'text' },
      { name: 'url', label: 'Verification URL', type: 'url' },
      { name: 'image', label: 'Certificate image', type: 'image', folder: 'certificates' },
      { name: 'file', label: 'Certificate PDF', type: 'file', folder: 'certificates' },
      { name: 'skills', label: 'Skills covered', type: 'tags' }, order, active,
    ],
  },
  services: {
    title: 'Services', singular: 'service', endpoint: 'services', roles: STAFF, sortName: 'title',
    columns: [{ key: 'title', label: 'Title', primary: true }, { key: 'order', label: 'Order', type: 'number' }, { key: 'isActive', label: 'Visible', type: 'bool' }],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: Object.keys(SERVICE_ICONS) },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'features', label: 'Highlights', type: 'lines', hint: 'One per line.' }, order, active,
    ],
  },
  testimonials: {
    title: 'Testimonials', singular: 'testimonial', endpoint: 'testimonials', roles: STAFF,
    filters: [{ name: 'status', label: 'Status', options: ['pending', 'approved'] }],
    quickActions: [{ label: 'Approve', patch: { status: 'approved' }, when: (r) => r.status !== 'approved', adminOnly: true }],
    columns: [{ key: 'clientName', label: 'Client', primary: true }, { key: 'company', label: 'Company' }, { key: 'rating', label: 'Rating', type: 'number' }, { key: 'status', label: 'Status', type: 'status' }],
    fields: [
      { name: 'clientName', label: 'Client name', type: 'text', required: true }, { name: 'company', label: 'Company', type: 'text' }, { name: 'position', label: 'Position', type: 'text' },
      { name: 'photo', label: 'Photo', type: 'image', folder: 'general' },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5 },
      { name: 'text', label: 'Testimonial', type: 'textarea', rows: 4, required: true },
      { name: 'projectName', label: 'Project', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['pending', 'approved'], hint: 'Only approved testimonials are public.' }, order,
    ],
  },
  'social-links': {
    title: 'Social links', singular: 'link', endpoint: 'social-links', roles: STAFF,
    columns: [{ key: 'platform', label: 'Platform', primary: true }, { key: 'url', label: 'URL' }, { key: 'isActive', label: 'Visible', type: 'bool' }],
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', options: ['github', 'linkedin', 'x', 'facebook', 'youtube', 'instagram', 'email', 'website'], required: true },
      { name: 'label', label: 'Label', type: 'text' }, { name: 'url', label: 'URL', type: 'url', required: true }, order, { ...active, default: false },
    ],
  },
  announcements: {
    title: 'Announcements', singular: 'announcement', endpoint: 'announcements', roles: ADMINS,
    columns: [{ key: 'text', label: 'Text', primary: true }, { key: 'type', label: 'Type' }, { key: 'isActive', label: 'Active', type: 'bool' }],
    fields: [
      { name: 'text', label: 'Text', type: 'text', required: true },
      { name: 'type', label: 'Style', type: 'select', options: ['info', 'success', 'warning'] },
      { name: 'link', label: 'Link (path or URL)', type: 'text' }, { name: 'linkLabel', label: 'Link label', type: 'text' },
      { name: 'startsAt', label: 'Show from', type: 'datetime' }, { name: 'endsAt', label: 'Show until', type: 'datetime' },
      { name: 'isActive', label: 'Active', type: 'boolean', default: true },
    ],
  },
  users: {
    title: 'Users', singular: 'user', endpoint: 'users', roles: ['super_admin'],
    filters: [{ name: 'role', label: 'Role', options: ['super_admin', 'admin', 'editor'] }],
    columns: [{ key: 'name', label: 'Name', primary: true }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role', type: 'status' }, { key: 'isActive', label: 'Active', type: 'bool' }, { key: 'lastLoginAt', label: 'Last login', type: 'date' }],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true }, { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'select', options: ['super_admin', 'admin', 'editor'], hint: 'Editors can draft content but cannot publish or delete.' },
      { name: 'password', label: 'Password', type: 'password', hint: 'Required for new users (10+ characters). Leave empty to keep the current one.' },
      { name: 'isActive', label: 'Account active', type: 'boolean', default: true },
    ],
  },
  'activity-logs': {
    title: 'Activity log', singular: 'entry', endpoint: 'activity-logs', roles: ADMINS, readOnly: true,
    filters: [{ name: 'action', label: 'Action', options: ['created', 'updated', 'deleted', 'logged_in', 'exported'] }],
    columns: [{ key: 'createdAt', label: 'When', type: 'datetime' }, { key: 'userName', label: 'User' }, { key: 'action', label: 'Action', type: 'status' }, { key: 'entity', label: 'Entity' }, { key: 'summary', label: 'Summary', primary: true }],
    fields: [],
  },
};

const link = { name: 'path', label: 'Path or URL', type: 'text' };

/** Singleton content editors (stored in SiteContent by key). */
export const singletons = {
  profile: {
    title: 'Profile', text: 'Your name, contact details and photo. Used across the site and the resume.',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true }, { name: 'title', label: 'Professional title', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' }, { name: 'email', label: 'Public email', type: 'email' }, { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'photo', label: 'Profile photo', type: 'image', folder: 'profile' }, { name: 'logo', label: 'Logo (optional)', type: 'image', folder: 'profile' },
      { name: 'bio', label: 'Short bio', type: 'textarea', rows: 3 },
    ],
  },
  hero: {
    title: 'Hero section', text: 'The first thing visitors see on the homepage.',
    fields: [
      { name: 'greeting', label: 'Greeting', type: 'text' }, { name: 'headline', label: 'Name / headline', type: 'text' }, { name: 'roleTitle', label: 'Role title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'availabilityStatus', label: 'Show “available” badge', type: 'boolean' }, { name: 'availabilityText', label: 'Availability text', type: 'text' },
      { name: 'ctas', label: 'Buttons', type: 'objectList', itemLabel: 'Button', hint: 'Use @resume as the path to link the resume PDF.', fields: [{ name: 'label', label: 'Label', type: 'text' }, link, { name: 'variant', label: 'Style', type: 'select', options: ['primary', 'secondary', 'ghost'] }] },
      { name: 'floatingTech', label: 'Floating technology chips', type: 'tags', hint: 'Up to 8 are shown.' },
    ],
  },
  about: {
    title: 'About', text: 'Tell your story honestly. Recruiters read this page closely.',
    fields: [
      { name: 'headline', label: 'Headline', type: 'text' }, { name: 'bio', label: 'Biography', type: 'textarea', rows: 5 },
      { name: 'careerDirection', label: 'Career direction', type: 'textarea', rows: 3 }, { name: 'philosophy', label: 'How I work', type: 'textarea', rows: 3 },
      { name: 'currentLearning', label: 'Currently learning', type: 'textarea', rows: 2 }, { name: 'futureGoals', label: 'Future goals', type: 'textarea', rows: 2 },
      { name: 'interests', label: 'Interests', type: 'tags' },
      { name: 'timeline', label: 'Timeline', type: 'objectList', itemLabel: 'Milestone', fields: [{ name: 'year', label: 'Year', type: 'text' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea', rows: 2 }] },
    ],
  },
  resume: {
    title: 'Resume', text: 'Upload a PDF for the download button. The online resume is built from your other content.',
    fields: [
      { name: 'pdfUrl', label: 'Resume PDF', type: 'file', folder: 'resume' }, { name: 'version', label: 'Version label', type: 'text' },
      { name: 'lastUpdated', label: 'Last updated', type: 'date' }, { name: 'summary', label: 'Resume summary', type: 'textarea', rows: 4, hint: 'Leave empty to reuse your About bio.' },
    ],
  },
  seo: {
    title: 'SEO', text: 'Defaults used when a page has no title or description of its own.',
    fields: [
      { name: 'defaultTitle', label: 'Default title', type: 'text' }, { name: 'titleTemplate', label: 'Title template', type: 'text', hint: '%s is replaced by the page title.' },
      { name: 'description', label: 'Default description', type: 'textarea', rows: 3 }, { name: 'keywords', label: 'Keywords', type: 'tags' },
      { name: 'ogImage', label: 'Default social share image', type: 'image', folder: 'general' }, { name: 'twitterHandle', label: 'X / Twitter handle', type: 'text', placeholder: '@username' },
    ],
  },
  settings: {
    title: 'Site settings', text: 'Navigation, homepage layout, theme and effects.',
    fields: [
      { name: 'siteName', label: 'Site name', type: 'text', group: 'General' }, { name: 'tagline', label: 'Tagline', type: 'text', group: 'General' },
      { name: 'defaultTheme', label: 'Default theme', type: 'select', options: ['dark', 'light'], group: 'General' },
      { name: 'defaultLanguage', label: 'Default language', type: 'select', options: ['en', 'bn', 'de'], group: 'General' },
      { name: 'features.loader', label: '3D loading screen', type: 'boolean', group: 'Effects' },
      { name: 'features.customCursor', label: 'Custom cursor ring', type: 'boolean', group: 'Effects' },
      { name: 'features.konami', label: 'Konami code easter egg', type: 'boolean', group: 'Effects' },
      { name: 'navigation', label: 'Navigation links', type: 'objectList', itemLabel: 'Link', group: 'Navigation', fields: [{ name: 'label', label: 'Label', type: 'text' }, link, { name: 'cta', label: 'Show as button', type: 'boolean' }] },
      { name: 'homepageSections', label: 'Homepage sections (top to bottom)', type: 'objectList', itemLabel: 'Section', group: 'Homepage', hint: 'Reorder with the arrows. Keys: stats, tech, about, skills, projects, caseStudies, experience, education, certifications, services, blog, testimonials, workWithMe, contact.', fields: [{ name: 'key', label: 'Key', type: 'text' }, { name: 'label', label: 'Label', type: 'text' }, { name: 'enabled', label: 'Show', type: 'boolean' }] },
      { name: 'stats', label: 'Quick stats', type: 'objectList', itemLabel: 'Stat', group: 'Homepage', hint: 'Choose an automatic source or type a value. Stats equal to 0 are hidden.', fields: [{ name: 'label', label: 'Label', type: 'text' }, { name: 'auto', label: 'Automatic source', type: 'select', options: ['', 'projects', 'skills', 'blogs', 'certifications'] }, { name: 'value', label: 'Manual value', type: 'number' }, { name: 'suffix', label: 'Suffix', type: 'text', placeholder: '+' }] },
      { name: 'workWithMe.status', label: 'Availability line', type: 'text', group: 'Work with me' }, { name: 'workWithMe.responseTime', label: 'Response time', type: 'text', group: 'Work with me' },
      { name: 'workWithMe.projectTypes', label: 'Project types', type: 'tags', group: 'Work with me' }, { name: 'workWithMe.text', label: 'Text', type: 'textarea', rows: 2, group: 'Work with me' },
      { name: 'contactCta.title', label: 'Contact section title', type: 'text', group: 'Footer & contact' }, { name: 'contactCta.text', label: 'Contact section text', type: 'textarea', rows: 2, group: 'Footer & contact' },
      { name: 'footer.bio', label: 'Footer bio', type: 'textarea', rows: 2, group: 'Footer & contact' }, { name: 'footer.copyright', label: 'Copyright name', type: 'text', group: 'Footer & contact' },
    ],
  },
};

/** Sidebar structure. `roles` limits visibility (server enforces the same rules). */
export const NAV = [
  { group: 'Overview', items: [{ to: '/admin', label: 'Dashboard', end: true }, { to: '/admin/analytics', label: 'Analytics', roles: ADMINS }] },
  { group: 'Identity', items: [{ to: '/admin/profile', label: 'Profile' }, { to: '/admin/hero', label: 'Hero' }, { to: '/admin/about', label: 'About' }, { to: '/admin/resume', label: 'Resume' }] },
  { group: 'Career', items: [{ to: '/admin/experience', label: 'Experience' }, { to: '/admin/education', label: 'Education' }, { to: '/admin/certifications', label: 'Certifications' }, { to: '/admin/skills', label: 'Skills' }] },
  { group: 'Work', items: [{ to: '/admin/projects', label: 'Projects' }, { to: '/admin/project-categories', label: 'Project categories' }] },
  { group: 'Content', items: [{ to: '/admin/blogs', label: 'Blog posts' }, { to: '/admin/blog-categories', label: 'Blog categories' }, { to: '/admin/services', label: 'Services' }, { to: '/admin/testimonials', label: 'Testimonials' }] },
  { group: 'Inbox', items: [{ to: '/admin/messages', label: 'Messages', roles: ADMINS }] },
  { group: 'Site', items: [{ to: '/admin/settings', label: 'Settings' }, { to: '/admin/seo', label: 'SEO' }, { to: '/admin/social-links', label: 'Social links' }, { to: '/admin/announcements', label: 'Announcements', roles: ADMINS }, { to: '/admin/media', label: 'Media library' }] },
  { group: 'System', items: [{ to: '/admin/users', label: 'Users', roles: ['super_admin'] }, { to: '/admin/activity-logs', label: 'Activity log', roles: ADMINS }, { to: '/admin/security', label: 'Security & backup' }] },
];
