import Link from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  addRef?: boolean;
}

function addRefParam(url: string): string {
  try {
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has('ref')) {
      urlObj.searchParams.set('ref', 'one9founders.com');
    }
    return urlObj.toString();
  } catch {
    return url;
  }
}

export default function ExternalLink({ href, children, className, addRef = true, ...props }: ExternalLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  
  if (isExternal) {
    const finalHref = addRef ? addRefParam(href) : href;
    return (
      <a
        href={finalHref}
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
