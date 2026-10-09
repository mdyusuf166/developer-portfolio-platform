import { useEffect, useState } from 'react';

import { getPublishedProjects } from '../lib/public-projects';
import type { Project } from '../types';

export function usePublicProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getPublishedProjects(controller.signal)
      .then((publishedProjects) => {
        setProjects(publishedProjects);
      })
      .catch((caughtError: unknown) => {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load published projects.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { projects, isLoading, error };
}