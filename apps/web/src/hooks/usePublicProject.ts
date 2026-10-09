import { useEffect, useState } from 'react';

import { getPublishedProjectBySlug } from '../lib/public-projects';
import type { Project } from '../types';

export function usePublicProject(slug: string | undefined) {
  const [project, setProject] = useState<Project>();
  const [isLoading, setIsLoading] = useState(Boolean(slug));
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
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
  }, [slug]);

  return { project, isLoading, error, notFound };
}