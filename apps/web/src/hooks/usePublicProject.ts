import { useContext, useEffect, useState } from 'react';

import { getPublishedProjectBySlug } from '../lib/public-projects';
import type { Project } from '../types';
import { PreviewDataContext } from '../preview/preview-context';

export function usePublicProject(slug: string | undefined) {
  const preview = useContext(PreviewDataContext);
  const [project, setProject] = useState<Project>();
  const [isLoading, setIsLoading] = useState(Boolean(slug));
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (preview) return;
    if (!slug) {
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    getPublishedProjectBySlug(slug, controller.signal)
      .then(setProject)
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        const status = caught && typeof caught === 'object' && 'status' in caught ? caught.status : undefined;
        setNotFound(status === 404);
        setError(caught instanceof Error ? caught.message : 'Unable to load project.');
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });

    return () => controller.abort();
  }, [preview, slug]);

  const previewProject = preview?.projects.find((candidate) => candidate.slug === slug);
  return {
    project: preview ? previewProject : project,
    isLoading: preview ? false : isLoading,
    error: preview ? '' : error,
    notFound: preview ? !previewProject : notFound
  };
}
