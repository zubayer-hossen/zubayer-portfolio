import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import SkillsShowcase from '../skills/SkillsShowcase';

export default function SkillsSection() {
  return (
    <Section id="skills" tone="alt">
      <SectionHeading title="Skills and tools" text="The technologies I use to build complete applications." action={{ to: '/skills', label: 'All skills' }} />
      <SkillsShowcase limit={6} />
    </Section>
  );
}
