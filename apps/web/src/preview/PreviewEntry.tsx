import { BrowserRouter, Link, useLocation } from 'react-router-dom';

import App from '../App';
import { PreviewDataContext } from './preview-context';
import { previewProfile, previewProjects } from './mock-data';

function PreviewBanner() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return <main className="min-h-screen bg-background p-8 text-foreground"><h1 className="font-display text-3xl">Admin is unavailable in the UI preview</h1><p className="mt-4">This preview does not simulate authentication or admin APIs.</p><Link className="mt-5 inline-block underline" to="/">Return to the portfolio preview</Link></main>;
  }
  return <><div role="note" className="sticky top-0 z-[100] border-b border-amber-800 bg-amber-100 px-4 py-2 text-center text-xs font-bold tracking-wide text-amber-950">PREVIEW MODE · SYNTHETIC SAMPLE DATA · NOT VERIFIED PRODUCTION CONTENT</div><App /></>;
}

export default function PreviewEntry() {
  return <BrowserRouter basename="/__preview"><PreviewDataContext.Provider value={{ profile: previewProfile, projects: previewProjects }}><PreviewBanner /></PreviewDataContext.Provider></BrowserRouter>;
}
