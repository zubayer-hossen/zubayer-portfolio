import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import ExperienceSection from '../features/home/ExperienceSection';
import EducationSection from '../features/home/EducationSection';
import CertificationsSection from '../features/home/CertificationsSection';

export default function Experience() {
  return (
    <>
      <SEO title="Experience" path="/experience" />
      <PageHeader title="Experience, education and certifications" />
      <ExperienceSection />
      <EducationSection />
      <CertificationsSection />
    </>
  );
}
