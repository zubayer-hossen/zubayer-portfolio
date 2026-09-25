import {
  AppWindow, Boxes, Briefcase, Bug, Code2, Cpu, Database, Gauge, Globe, Layers, LayoutDashboard, Palette, Rocket,
  Server, Shield, Smartphone, Terminal, Webhook, Wrench, Zap, Github, Linkedin, Twitter, Facebook, Youtube, Instagram, Mail, Link2,
} from 'lucide-react';

export const SERVICE_ICONS = {
  AppWindow, Boxes, Briefcase, Bug, Code2, Cpu, Database, Gauge, Globe, Layers, LayoutDashboard, Palette, Rocket,
  Server, Shield, Smartphone, Terminal, Webhook, Wrench, Zap,
};
export const serviceIcon = (name) => SERVICE_ICONS[name] || Code2;

export const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, x: Twitter, twitter: Twitter, facebook: Facebook, youtube: Youtube, instagram: Instagram, email: Mail, website: Globe };
export const socialIcon = (platform = '') => SOCIAL_ICONS[platform.toLowerCase()] || Link2;
