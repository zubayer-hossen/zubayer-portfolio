import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, fieldErrors } from '../../lib/api';
import Button from '../../components/ui/Button';
import { useT } from '../../i18n';
import { cn } from '../../lib/utils';

// Mirrors server/src/validators/schemas.js (contactSchema)
const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.string().trim().email('Enter a valid email address.'),
  subject: z.string().trim().min(3, 'Add a short subject.').max(150),
  message: z.string().trim().min(10, 'Tell me a little more (10+ characters).').max(5000),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  website: z.string().optional(),
});

const BUDGETS = ['Not sure yet', 'Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+'];
const TYPES = ['Full-time role', 'Freelance project', 'Bug fix or maintenance', 'Collaboration', 'Something else'];

function Field({ label, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const { t } = useT();
  const shownAt = useRef(Date.now());
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', subject: '', message: '', budget: '', projectType: '', website: '' },
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/messages', { ...values, elapsed: Date.now() - shownAt.current });
      setSent(true);
      reset();
    } catch (e) {
      Object.entries(fieldErrors(e)).forEach(([name, message]) => setError(name, { message }));
      toast.error(errorMessage(e));
    }
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center px-6 py-16 text-center" role="status">
          <CheckCircle2 className="h-14 w-14 text-ok" />
          <h2 className="mt-5 font-display text-2xl font-bold">Message sent</h2>
          <p className="mt-2 max-w-sm text-muted">Thanks for reaching out. I will reply to the email you provided.</p>
          <Button variant="secondary" className="mt-6" onClick={() => { shownAt.current = Date.now(); setSent(false); }}>Send another message</Button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" error={errors.name?.message} htmlFor="c-name">
              <input id="c-name" autoComplete="name" className={cn('input', errors.name && 'input-error')} {...register('name')} />
            </Field>
            <Field label="Email" error={errors.email?.message} htmlFor="c-email">
              <input id="c-email" type="email" autoComplete="email" className={cn('input', errors.email && 'input-error')} {...register('email')} />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="I am contacting you about" htmlFor="c-type">
              <select id="c-type" className="input" {...register('projectType')}>
                <option value="">Choose one</option>
                {TYPES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Budget (optional)" htmlFor="c-budget">
              <select id="c-budget" className="input" {...register('budget')}>
                <option value="">Choose one</option>
                {BUDGETS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Subject" error={errors.subject?.message} htmlFor="c-subject">
            <input id="c-subject" className={cn('input', errors.subject && 'input-error')} {...register('subject')} />
          </Field>
          <Field label="Message" error={errors.message?.message} htmlFor="c-message">
            <textarea id="c-message" rows={6} className={cn('input resize-y', errors.message && 'input-error')} {...register('message')} />
          </Field>
          {/* Honeypot: hidden from people, tempting for bots */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
          </div>
          <Button type="submit" loading={isSubmitting} magnetic>
            <Send className="h-4 w-4" /> {t('sendMessage')}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
