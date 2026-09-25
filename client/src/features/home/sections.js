import { lazy } from 'react';

/** Homepage section registry: keys match settings.homepageSections[].key (editable in Admin → Settings). */
export const homeSections = {
  stats: lazy(() => import('./StatsSection')),
  tech: lazy(() => import('./TechMarquee')),
  about: lazy(() => import('./AboutSection')),
  skills: lazy(() => import('./SkillsSection')),
  projects: lazy(() => import('./FeaturedProjects')),
  caseStudies: lazy(() => import('./CaseStudies')),
  experience: lazy(() => import('./ExperienceSection')),
  education: lazy(() => import('./EducationSection')),
  certifications: lazy(() => import('./CertificationsSection')),
  services: lazy(() => import('./ServicesSection')),
  blog: lazy(() => import('./FeaturedBlog')),
  testimonials: lazy(() => import('./TestimonialsSection')),
  workWithMe: lazy(() => import('./WorkWithMe')),
  contact: lazy(() => import('./ContactCta')),
};
