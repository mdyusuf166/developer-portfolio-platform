import { useEffect } from 'react';

export function PageMeta({
  title,
  description,
  robots = 'index, follow'
}: {
  title: string;
  description?: string;
  robots?: string;
}) {
  useEffect(() => {
    const siteTitle = 'MD MAHTAB AHMED MAHIN — AI / ML Engineer';
    const pageTitle = title === 'Home' ? siteTitle : `${title} | ${siteTitle}`;
    document.title = pageTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description ?? `${siteTitle}. Portfolio, projects, and research interests.`);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description ?? `${siteTitle}. Portfolio, projects, and research interests.`);
    }

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', robots);

    const canonical = document.querySelector('link[rel="canonical"]');
    const route = window.location.pathname;
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}${route}`);
    }
  }, [title, description, robots]);

  return null;
}
