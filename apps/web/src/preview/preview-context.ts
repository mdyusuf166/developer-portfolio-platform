import { createContext } from 'react';

import type { Profile, Project } from '../types';

export type PreviewData = {
  profile: Profile;
  projects: Project[];
};

export const PreviewDataContext = createContext<PreviewData | null>(null);
