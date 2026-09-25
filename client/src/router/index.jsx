import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import { NotFound } from '../pages/ErrorPages';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Skills = lazy(() => import('../pages/Skills'));
const Projects = lazy(() => import('../pages/Projects'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));
const Services = lazy(() => import('../pages/Services'));
const Experience = lazy(() => import('../pages/Experience'));
const Contact = lazy(() => import('../pages/Contact'));
const Resume = lazy(() => import('../pages/Resume'));
const Preview = lazy(() => import('../pages/Preview'));
const Login = lazy(() => import('../pages/admin/Login'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const AdminResource = lazy(() => import('../pages/admin/AdminResource'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="experience" element={<Experience />} />
        <Route path="contact" element={<Contact />} />
        <Route path="resume" element={<Resume />} />
        <Route path="preview/:type/:id" element={<Preview />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path=":resource" element={<AdminResource />} />
        <Route path=":resource/:id" element={<AdminResource />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
