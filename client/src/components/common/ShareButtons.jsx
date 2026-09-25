import { Facebook, Link2, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import { SITE_URL } from '../../lib/api';
import { useT } from '../../i18n';

/**
 * Social crawlers do not run JavaScript, so shares point at `/og/:type/:slug`
 * (rendered by the API with Open Graph tags, then redirected to the real page).
 */
export default function ShareButtons({ title, type, slug, path }) {
  const { t } = useT();
  const pageUrl = SITE_URL + path;
  const shareUrl = encodeURIComponent(`${SITE_URL}/og/${type}/${slug}`);
  const text = encodeURIComponent(title);
  const links = [
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { label: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}` },
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${text}%20${shareUrl}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast.success(t('linkCopied'));
    } catch {
      toast.error('Could not copy the link.');
    }
  };
  const cls = 'grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition hover:border-accent/70 hover:text-accent';
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t('share')}>
      {links.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${t('share')} on ${label}`} className={cls}>
          <Icon className="h-[18px] w-[18px]" />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label={t('copyLink')} className={cls}>
        <Link2 className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
