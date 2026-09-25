import Button from '../ui/Button';
import { cn } from '../../lib/utils';

export default function SectionHeading({ title, text, action, className, as: Tag = 'h2' }) {
  return (
    <div className={cn('mb-10 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <Tag className="h-section">{title}</Tag>
        {text && <p className="lead mt-3">{text}</p>}
      </div>
      {action && (
        <Button to={action.to} variant="ghost">
          {action.label}
        </Button>
      )}
    </div>
  );
}
