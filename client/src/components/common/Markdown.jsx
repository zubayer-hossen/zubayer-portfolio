import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { nodeText, slugifyHeading } from '../../lib/utils';

const heading = (Tag) =>
  function Heading({ children }) {
    return <Tag id={slugifyHeading(nodeText(children))}>{children}</Tag>;
  };

const components = {
  h2: heading('h2'),
  h3: heading('h3'),
  a: ({ href, children }) => (
    <a href={href} {...(/^https?:/.test(href || '') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt || ''} loading="lazy" />,
};

/** Markdown is sanitised (no raw scripts / event handlers) before render. */
export default function Markdown({ children, className = '' }) {
  return (
    <div className={`md ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
        {children || ''}
      </ReactMarkdown>
    </div>
  );
}
