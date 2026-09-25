import SEO from '../components/common/SEO';
import AboutSection from '../features/home/AboutSection';
import ExperienceSection from '../features/home/ExperienceSection';
import EducationSection from '../features/home/EducationSection';

export default function About() {
  return (
    <>
      <SEO title="About" path="/about" />
      <AboutSection full />
      <ExperienceSection />
      <EducationSection />
    </>
  );
}
