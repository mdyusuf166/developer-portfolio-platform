import { useContext, useEffect, useState } from 'react';

import { getPublishedProjects } from '../lib/public-projects';
import { projects as staticProjects } from '../data/projects';
import type { Project } from '../types';
import { PreviewDataContext } from '../preview/preview-context';

export function usePublicProjects() {
  const preview = useContext(PreviewDataContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preview) return;
    const controller = new AbortController();

    getPublishedProjects(controller.signal)
      .then((publishedProjects) => {
        setProjects(publishedProjects.length ? publishedProjects : staticProjects);
      })
      .catch((caughtError: unknown) => {
        if (!controller.signal.aborted) {
          setProjects(staticProjects);
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load published projects.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [preview]);

  return { projects: preview ? preview.projects : projects, isLoading: preview ? false : isLoading, error: preview ? '' : error };
}
