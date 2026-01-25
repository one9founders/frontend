import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ExternalLink({ href, children, className, ...props }: ExternalLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  
  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        rel="noopener nofollow"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  }
  
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
