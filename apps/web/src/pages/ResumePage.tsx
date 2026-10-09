import { Download, ExternalLink } from 'lucide-react';

import { EmptyState } from '../components/common/EmptyState';
import { PageMeta } from '../components/common/PageMeta';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

const cvDownloadName = 'MD-Mahtab-Ahmed-Mahin-CV.jpg';

export function ResumePage() {
  const { profile } = usePublicPortfolio();
  const resumeUrl = profile.resume;

  return (
    <>
      <PageMeta title="CV" description="Preview and download MD Mahtab Ahmed Mahin's CV image." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12">
          <p className="eyebrow">CV / 11</p>
          <h1 className="section-title mt-4">A concise record of the work.</h1>
          <p className="section-copy mt-5">The supplied CV is a JPEG screenshot, not a PDF. Preview it below or download the original image.</p>
        </header>

        <div className="grid min-w-0 gap-10 py-9 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] md:py-12">
          <div className="min-w-0">
            <p className="eyebrow">{profile.title}</p>
            <h2 className="mt-3 break-words font-display text-3xl font-medium">{profile.name}</h2>
            <p className="mt-4 max-w-2xl break-words text-base leading-8 text-muted-foreground">{profile.bio}</p>
            {resumeUrl ? (
              <>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={resumeUrl} download={cvDownloadName} className="inline-flex min-h-12 items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-offset-4">
                    <Download className="h-4 w-4" aria-hidden="true" /> Download CV
                  </a>
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                    Open image <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
                <figure className="mt-8 min-w-0 border border-border bg-card">
                  <div className="max-w-full overflow-x-auto overscroll-x-contain p-2 sm:p-4" tabIndex={0} role="region" aria-label="CV image preview. Scroll horizontally if the image is wider than the screen.">
                    <img
                      src={resumeUrl}
                      alt="CV of MD Mahtab Ahmed Mahin. JPEG screenshot covering summary, education, technical skills, projects, and career objective."
                      width={770}
                      height={599}
                      className="mx-auto h-auto w-[770px] max-w-none"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="border-t border-border px-3 py-3 text-center text-xs leading-5 text-muted-foreground sm:px-4">
                    CV preview · JPEG image · 770 × 599 pixels. On a narrow screen, scroll inside the frame to read it. The download is the same image.
                  </figcaption>
                </figure>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  If the preview does not load, use the <a className="text-link" href={resumeUrl} download={cvDownloadName}>direct JPEG download</a>.
                </p>
              </>
            ) : (
              <div className="mt-7"><EmptyState title="CV unavailable" description="A public CV image has not been provided." /></div>
            )}
          </div>

          <aside className="h-fit min-w-0 border-t border-primary pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Focus</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {profile.aboutHighlights.map((highlight) => <li key={highlight} className="break-words py-3 text-sm text-foreground">{highlight}</li>)}
            </ul>
          </aside>
        </div>

        <div className="grid gap-5 border-t border-border pt-7 sm:grid-cols-3">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="min-w-0 border-l border-border pl-4">
              <p className="eyebrow">{stat.label}</p>
              <p className="mt-2 break-words text-sm leading-6">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
