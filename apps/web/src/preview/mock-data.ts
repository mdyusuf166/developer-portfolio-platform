import { profile as localProfile } from '../data/profile';
import type { BlogPost, Profile, Project, ResearchItem } from '../types';

const illustration = (label: string, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600"><rect width="960" height="600" fill="#f3eee4"/><rect x="48" y="48" width="864" height="504" rx="18" fill="#fffdf8" stroke="#${color}" stroke-width="4"/><circle cx="136" cy="136" r="34" fill="#${color}"/><path d="M210 122h440M210 154h280" stroke="#26352e" stroke-width="14" stroke-linecap="round"/><rect x="96" y="230" width="340" height="250" rx="12" fill="#e7e2d6"/><rect x="476" y="230" width="380" height="32" rx="8" fill="#${color}"/><rect x="476" y="286" width="320" height="18" rx="8" fill="#c8c1b2"/><rect x="476" y="324" width="350" height="18" rx="8" fill="#c8c1b2"/><rect x="476" y="384" width="150" height="64" rx="8" fill="#${color}"/><text x="96" y="520" font-family="sans-serif" font-size="22" fill="#26352e">SYNTHETIC UI SAMPLE · ${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const previewProjects: Project[] = [
  {
    slug: 'sample-document-explorer',
    title: 'Sample Document Explorer',
    shortDescription: 'Synthetic interface fixture for reviewing a document search case study layout.',
    description: 'This fictional sample demonstrates how a project overview, design rationale, and implementation notes appear in the portfolio. It does not describe completed or measured work.',
    problem: 'Sample prompt: how might a reader find a useful passage in a set of notes?',
    approach: 'The invented interface groups search controls, a result list, and a reading pane to exercise common case-study content shapes.',
    technologies: ['TypeScript (sample)', 'React (sample)', 'Search UI (sample)'],
    architecture: ['Synthetic fixture only; no service or model is connected.'],
    implementation: 'A static illustration and text are used to check spacing and responsive behavior.',
    results: ['No performance, quality, or user results are claimed in this UI fixture.'],
    technicalChallenges: ['Example long-form content tests how detail sections wrap on narrow screens.'],
    learnings: ['Placeholder for a future verified project reflection.'],
    image: { src: illustration('DOCUMENT EXPLORER', '54745f'), alt: 'Synthetic interface illustration for sample document explorer', caption: 'Synthetic UI fixture; not a real project screenshot.' },
    category: 'Interface design sample', status: 'Preview fixture · not published', featured: true
  },
  {
    slug: 'sample-model-review',
    title: 'Sample Model Review Board',
    shortDescription: 'Synthetic layout fixture showing an evaluation dashboard presentation.',
    description: 'A fictional concept used only to preview project metadata, technical sections, and a second image aspect ratio.',
    problem: 'Sample prompt: what could a model evaluation summary look like?',
    approach: 'The mock dashboard presents example labels and abstract blocks without real measurements or data.',
    technologies: ['Dashboard UI (sample)', 'Data visualization (sample)'],
    architecture: ['Static client-side illustration only.'],
    results: ['No model evaluation or benchmark was performed.'],
    image: { src: illustration('MODEL REVIEW', 'b66d50'), alt: 'Synthetic dashboard illustration for sample model review board', caption: 'Synthetic UI fixture; contains no real metrics.' },
    category: 'AI / ML layout sample', status: 'Preview fixture · not published'
  },
  {
    slug: 'sample-accessible-notes',
    title: 'Sample Accessible Notes',
    shortDescription: 'Synthetic content fixture for a smaller project card and detail page.',
    description: 'A fictional sample entry used to review category filtering and navigation between the project list and detail view.',
    technologies: ['Accessibility review (sample)', 'Content design (sample)'],
    results: ['This fixture makes no accessibility conformance claim.'],
    image: { src: illustration('ACCESSIBLE NOTES', '8a9878'), alt: 'Synthetic notes interface illustration for sample accessible notes', caption: 'Synthetic UI fixture; not a real project screenshot.' },
    category: 'Interface design sample', status: 'Preview fixture · not published'
  }
];

export const previewBlogPosts: BlogPost[] = [
  {
    id: 'preview-note-one', slug: 'sample-note-reading-system-design',
    title: '[Sample] Reading a System Diagram Carefully',
    excerpt: 'Synthetic editorial content used to preview blog cards, metadata, and long-form typography.',
    content: `SYNTHETIC SAMPLE ARTICLE — NOT A PUBLISHED POST\n\nA useful system diagram is a map of decisions. In this fictional example, the first pass is to identify the boundaries: where data enters, which component transforms it, and what evidence leaves the system.\n\nThe next pass asks what the arrows mean. Does an arrow show a request, a stream, or a dependency? Naming those relationships helps readers follow the design without implying that an implementation exists.\n\nFor a real case study, this section would connect the diagram to verified code, observed behavior, and documented trade-offs. This sample intentionally contains no results, citations, or claims about completed work.\n\nA final review checks whether the same concepts fit on a phone screen. Long labels should wrap, sections should retain their hierarchy, and readers should always have a clear path back to the article list.`,
    category: 'Synthetic sample', tags: ['UI preview', 'sample content'], readingTime: '2 min sample', published: true
  },
  {
    id: 'preview-note-two', slug: 'sample-note-interface-states',
    title: '[Sample] Interfaces Need More Than a Happy Path',
    excerpt: 'A second fictional article makes category, tag, and detail navigation states visible.',
    content: `SYNTHETIC SAMPLE ARTICLE — NOT A PUBLISHED POST\n\nA content interface has several ordinary states: loading, empty, unavailable, and populated. Each needs clear language and a sensible next action. This sample exists to exercise those visual states in a browser preview.\n\nFor example, a list can show a stable empty message while a request is in flight, then replace it with a populated list once data is available. A detail page should also explain when an item cannot be found.\n\nThese paragraphs are fictional fixture copy. They do not document an actual application experiment or user study.`,
    category: 'Synthetic sample', tags: ['content states', 'sample content'], readTime: '1 min sample', published: true
  }
];

const previewResearch: ResearchItem[] = [{
  id: 'preview-research-layout',
  title: '[Synthetic UI sample] Research card layout (not a publication)',
  topic: 'Layout fixture only',
  summary: 'This fictional entry exists solely to preview the research page presentation. It is not research output, a paper, or a claim of completed work.',
  methodology: 'No research was conducted. This text is a layout fixture.',
  status: 'Preview fixture · not published', topics: ['synthetic sample'], tags: ['layout only'], technologies: []
}];

export const previewProfile: Profile = {
  ...localProfile,
  projects: previewProjects,
  blogPosts: previewBlogPosts,
  research: previewResearch
};
