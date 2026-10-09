import { AlertCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { AdminApiError, getAdminResourceApi } from '../../lib/admin-api';
import { uploadsApi } from '../../lib/admin-api';

const RESOURCE_TITLES: Record<string, string> = {
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  research: 'Research',
  achievements: 'Achievements',
  services: 'Services',
  'blog-posts': 'Blog posts'
};

const projectOptions = ['AI / ML', 'Generative AI', 'LLM / RAG', 'NLP', 'Computer Vision', 'Cybersecurity', 'Software Engineering'];
const skillOptions = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'AI / ML'];
const statusOptions = ['draft', 'published', 'archived'];

type ResourceField = { name: string; label: string; type?: string; required?: boolean; options?: string[] };
const resourceFieldMap: Record<string, ResourceField[]> = {
  profile: [
    { name: 'name', label: 'Name', required: true },
    { name: 'title', label: 'Role / title', required: true },
    { name: 'headline', label: 'Headline', type: 'textarea', required: true },
    { name: 'bio', label: 'Summary / bio', type: 'textarea', required: true },
    { name: 'location', label: 'Location' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'github', label: 'GitHub URL', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { name: 'socials', label: 'Other social links (label | URL per line)', type: 'list' },
    { name: 'profileImagePublic', label: 'Publish profile image', type: 'checkbox' }
  ],
  projects: [
    { name: 'slug', label: 'Slug', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'summary', label: 'Summary', type: 'textarea', required: true },
    { name: 'description', label: 'Long description', type: 'textarea' },
    { name: 'problem', label: 'Problem', type: 'textarea' },
    { name: 'approach', label: 'Approach', type: 'textarea' },
    { name: 'implementation', label: 'Implementation', type: 'textarea' },
    { name: 'architecture', label: 'Architecture (one item per line)', type: 'list' },
    { name: 'technologies', label: 'Technologies (one item per line)', type: 'list' },
    { name: 'results', label: 'Results (one item per line)', type: 'list' },
    { name: 'technicalChallenges', label: 'Technical challenges (one item per line)', type: 'list' },
    { name: 'learnings', label: 'Learnings (one item per line)', type: 'list' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { name: 'demoUrl', label: 'Demo URL', type: 'url' },
    { name: 'category', label: 'Category', type: 'select', options: projectOptions },
    { name: 'featured', label: 'Featured', type: 'checkbox' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  skills: [
    { name: 'name', label: 'Name', required: true },
    { name: 'category', label: 'Category', type: 'select', options: skillOptions },
    { name: 'featured', label: 'Featured', type: 'checkbox' }
  ],
  experience: [
    { name: 'company', label: 'Company', required: true },
    { name: 'role', label: 'Role', required: true },
    { name: 'location', label: 'Location' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'current', label: 'Current', type: 'checkbox' },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'responsibilities', label: 'Responsibilities (one per line)', type: 'list' },
    { name: 'technologies', label: 'Technologies (one per line)', type: 'list' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  education: [
    { name: 'school', label: 'School', required: true },
    { name: 'degree', label: 'Degree', required: true },
    { name: 'field', label: 'Field' },
    { name: 'location', label: 'Location' },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'coursework', label: 'Coursework (one per line)', type: 'list' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  research: [
    { name: 'title', label: 'Title', required: true },
    { name: 'summary', label: 'Summary', type: 'textarea', required: true },
    { name: 'area', label: 'Research area' },
    { name: 'methodology', label: 'Methodology', type: 'textarea' },
    { name: 'technologies', label: 'Technologies (one per line)', type: 'list' },
    { name: 'publicationDate', label: 'Publication date', type: 'date' },
    { name: 'publicationUrl', label: 'Publication URL', type: 'url' },
    { name: 'paperUrl', label: 'Paper URL', type: 'url' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  achievements: [
    { name: 'title', label: 'Title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'issuer', label: 'Issuer' },
    { name: 'awardDate', label: 'Award Date', type: 'date' },
    { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  services: [
    { name: 'title', label: 'Title', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'category', label: 'Category' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions }
  ],
  'blog-posts': [
    { name: 'slug', label: 'Slug', required: true },
    { name: 'title', label: 'Title', required: true },
    { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true },
    { name: 'category', label: 'Category', required: true },
    { name: 'tags', label: 'Tags (one per line)', type: 'list' },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'publishedAt', label: 'Published At', type: 'date' }
  ]
};

const uploadFieldMap: Record<string, Array<{ field: string; assetField: string; label: string; accept: string; purpose: string; image?: boolean }>> = {
  profile: [
    { field: 'profileImageUrl', assetField: 'profileImageAssetId', label: 'Profile image', accept: 'image/jpeg,image/png,image/webp,image/svg+xml', purpose: 'profile-image', image: true },
    { field: 'resumeUrl', assetField: 'resumeAssetId', label: 'Resume (PDF)', accept: 'application/pdf', purpose: 'resume' }
  ],
  projects: [{ field: 'imageUrl', assetField: 'imageAssetId', label: 'Project cover image', accept: 'image/jpeg,image/png,image/webp,image/svg+xml', purpose: 'project-image', image: true }],
  research: [
    { field: 'imageUrl', assetField: 'imageAssetId', label: 'Research figure', accept: 'image/jpeg,image/png,image/webp,image/svg+xml', purpose: 'research-figure', image: true },
    { field: 'fileUrl', assetField: 'fileAssetId', label: 'Paper / research PDF', accept: 'application/pdf', purpose: 'research-paper' }
  ],
  achievements: [
    { field: 'imageUrl', assetField: 'imageAssetId', label: 'Achievement image', accept: 'image/jpeg,image/png,image/webp,image/svg+xml', purpose: 'achievement-image', image: true },
    { field: 'documentUrl', assetField: 'documentAssetId', label: 'Certificate / document (PDF)', accept: 'application/pdf', purpose: 'achievement-document' }
  ],
  'blog-posts': [{ field: 'coverImageUrl', assetField: 'coverImageAssetId', label: 'Blog cover image', accept: 'image/jpeg,image/png,image/webp,image/svg+xml', purpose: 'blog-cover', image: true }]
};

const toInputValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }
  return typeof value === 'boolean' ? String(value) : String(value);
};

const parseDate = (value: string) => (value ? new Date(value).toISOString() : null);

const nullableFields = new Set([
  'profile:location', 'profile:email', 'profile:github', 'profile:linkedin',
  'projects:problem', 'projects:approach', 'projects:implementation', 'projects:imageUrl', 'projects:githubUrl', 'projects:demoUrl',
  'research:area', 'research:methodology', 'research:publicationDate', 'research:publicationUrl', 'research:paperUrl', 'research:githubUrl', 'research:notes', 'research:imageUrl', 'research:fileUrl',
  'experience:startDate', 'experience:endDate', 'education:field', 'education:location', 'education:startDate', 'education:endDate', 'education:description',
  'achievements:issuer', 'achievements:awardDate', 'achievements:credentialUrl', 'achievements:imageUrl', 'achievements:documentUrl',
  'services:category', 'blog-posts:publishedAt', 'blog-posts:coverImageUrl'
]);

const normalizePayload = (resource: string, values: Record<string, string>) => {
  const normalized: Record<string, unknown> = {};
  for (const [key, rawValue] of Object.entries(values)) {
    if (rawValue === '') {
      if (key === 'socials') normalized[key] = [];
      else if (nullableFields.has(`${resource}:${key}`)) normalized[key] = null;
      else if (['architecture', 'technologies', 'results', 'technicalChallenges', 'learnings', 'responsibilities', 'coursework', 'tags'].includes(key)) normalized[key] = [];
      continue;
    }

    if (key === 'featured' || key === 'current' || key === 'published' || key === 'profileImagePublic') {
      normalized[key] = rawValue === 'true';
      continue;
    }

    if (key === 'socials') {
      normalized.socials = rawValue.split('\n').map((line) => line.split('|').map((part) => part.trim())).filter(([label, href]) => label && href).map(([label, href]) => ({ label, href }));
      continue;
    }

    if (['architecture', 'technologies', 'results', 'technicalChallenges', 'learnings', 'responsibilities', 'coursework', 'tags'].includes(key)) {
      normalized[key] = rawValue.split('\n').map((item) => item.trim()).filter(Boolean);
      continue;
    }

    if (key.endsWith('Date') || key === 'publishedAt') {
      normalized[key] = rawValue ? parseDate(rawValue) : null;
      continue;
    }

    normalized[key] = rawValue.trim();
  }

  return Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== undefined));
};

const parseFieldErrors = (error: unknown) => {
  if (!(error instanceof AdminApiError) || !error.details) {
    return {} as Record<string, string>;
  }

  const details = error.details as Record<string, unknown>;

  const nestedFormErrors = details.formErrors;
  if (nestedFormErrors && typeof nestedFormErrors === 'object' && !Array.isArray(nestedFormErrors)) {
    const fieldErrors = (nestedFormErrors as Record<string, unknown>).fieldErrors;
    if (fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)) {
      return Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : String(value)
        ])
      );
    }
  }

  return Object.fromEntries(
    Object.entries(details).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : String(value)
    ])
  );
};

export function AdminResourcePage({ resource }: { resource: string }) {
  const api = getAdminResourceApi(resource);
  const fields = resourceFieldMap[resource] ?? [];

  const [items, setItems] = useState<unknown[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [clearedFiles, setClearedFiles] = useState<string[]>([]);
  const [privateReadUrls, setPrivateReadUrls] = useState<Record<string, string>>({});
  const imagePreviews = useMemo(() => Object.fromEntries(Object.entries(selectedFiles).map(([field, file]) => [field, URL.createObjectURL(file)])), [selectedFiles]);

  useEffect(() => () => Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url)), [imagePreviews]);

  const loadItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.list();
      setItems(result);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [resource]);

  useEffect(() => {
    if (!formOpen && !deleteTarget) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (deleteTarget) setDeleteTarget(null);
      else setFormOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteTarget, formOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return items;
    }

    const needle = query.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(needle));
  }, [items, query]);

  const openCreateForm = () => {
    setEditingItem(null);
    setProjectImage(null);
    setSelectedFiles({});
    setClearedFiles([]);
    setPrivateReadUrls({});
    setFieldErrors({});
    setSuccess('');
    setFormOpen(true);
  };

  const openEditForm = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setProjectImage(null);
    setSelectedFiles({});
    setClearedFiles([]);
    setPrivateReadUrls({});
    for (const field of uploadFieldMap[resource] ?? []) {
      const assetId = item[field.assetField];
      if (typeof assetId === 'string') void uploadsApi.readUrl(assetId).then((url) => setPrivateReadUrls((current) => ({ ...current, [field.field]: url }))).catch(() => undefined);
    }
    setFieldErrors({});
    setSuccess('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    for (const field of fields) {
      const value = form.get(field.name);
      values[field.name] = field.type === 'checkbox' ? value === null ? 'false' : 'true' : value === null ? '' : String(value);
    }

    const payload = normalizePayload(resource, values);
    if (resource === 'blog-posts' && payload.published === true && !payload.publishedAt) payload.publishedAt = new Date().toISOString();
    if (resource === 'blog-posts' && payload.published === false) payload.publishedAt = null;
    setSubmitting(true);
    const controller = new AbortController();
    setUploadController(controller);
    setUploadProgress(0);
    setFieldErrors({});
    setError('');
    const uploadedAssetIds: string[] = [];

    try {
      for (const field of uploadFieldMap[resource] ?? []) {
        const selectedFile = selectedFiles[field.field] ?? (field.field === 'imageUrl' ? projectImage : undefined);
        if (selectedFile) {
          const uploadedAsset = await uploadsApi.upload(selectedFile, field.purpose, { signal: controller.signal, onProgress: setUploadProgress });
          payload[field.field] = uploadedAsset.url;
          payload[field.assetField] = uploadedAsset.id;
          if (typeof uploadedAsset.id === 'string') uploadedAssetIds.push(uploadedAsset.id);
        } else if (clearedFiles.includes(field.field)) {
          payload[field.field] = null;
          payload[field.assetField] = null;
        } else if (typeof editingItem?.[field.field] === 'string') {
          payload[field.field] = editingItem[field.field];
          payload[field.assetField] = typeof editingItem[field.assetField] === 'string' ? editingItem[field.assetField] : null;
        }
      }
      setUploadController(null);

      if (editingItem?.id) {
        await api.update(String(editingItem.id), payload as Record<string, unknown>);
      } else {
        await api.create(payload as Record<string, unknown>);
      }
      setFormOpen(false);
      await loadItems();
      setSuccess(editingItem ? 'Changes saved.' : 'Item created.');
    } catch (caughtError) {
      await Promise.all(uploadedAssetIds.map((id) => uploadsApi.remove(id).catch(() => undefined)));
      setFieldErrors(parseFieldErrors(caughtError));
      setError(caughtError instanceof DOMException && caughtError.name === 'AbortError' ? 'Upload cancelled.' : caughtError instanceof AdminApiError && caughtError.code === 'UPLOAD_AUTHORIZATION_INVALID' ? 'Upload authorization expired. Select the file again to retry.' : caughtError instanceof Error ? caughtError.message : 'Unable to save the record.');
    } finally {
      setSubmitting(false);
      setUploadController(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id || !('remove' in api)) {
      return;
    }

    setDeleting(true);
    try {
      await api.remove(String(deleteTarget.id));
      setDeleteTarget(null);
      await loadItems();
      setSuccess('Item deleted.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to delete the record.');
    } finally {
      setDeleting(false);
    }
  };

  const startValue = (field: ResourceField) => {
    const source = editingItem ?? {};
    const value = source[field.name];
    if (field.name === 'socials' && Array.isArray(value)) return value.map((item) => `${String((item as { label?: string }).label ?? '')} | ${String((item as { href?: string }).href ?? '')}`).join('\n');
    return field.type === 'list' && Array.isArray(value) ? value.join('\n') : toInputValue(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Management</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{RESOURCE_TITLES[resource] ?? 'Content'}</h2>
        </div>

        {resource !== 'profile' || items.length === 0 ? <Button className="self-start" onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          {resource === 'profile' ? 'Set up profile' : 'New item'}
        </Button> : null}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search records"
            className="w-full max-w-sm border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
            aria-label="Search records"
          />
          <p className="text-sm text-slate-400">{filteredItems.length} visible records</p>
        </div>

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : null}
        {success ? <div role="status" className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div> : null}

        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-900/80" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center text-slate-400">
            No records found for this resource.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const record = item as Record<string, unknown>;
              const title = (record.title ?? record.name ?? record.company ?? record.school ?? record.slug ?? `Record ${index + 1}`) as string;
              const excerpt = (record.summary ?? record.description ?? record.excerpt ?? record.role ?? record.category ?? 'Portfolio content') as string;

              return (
                <div key={String(record.id ?? `${resource}-${index}`)} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <h3 className="break-words text-base font-medium text-white">{title}</h3>
                    <p className="break-words text-sm text-slate-400">{String(excerpt).slice(0, 140)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="border-slate-700 text-slate-100" onClick={() => openEditForm(record)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {resource !== 'profile' ? <Button variant="outline" className="border-rose-500/30 text-rose-200 hover:bg-rose-500/10" onClick={() => setDeleteTarget(record)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/75 p-3 sm:items-center sm:p-4" aria-modal="true" role="dialog" aria-labelledby="admin-resource-dialog-title">
          <div className="my-auto max-h-[calc(100vh-1.5rem)] w-full min-w-0 max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 id="admin-resource-dialog-title" className="text-xl font-semibold text-white">{editingItem ? 'Edit item' : 'Create item'}</h3>
              <Button variant="ghost" onClick={() => setFormOpen(false)} aria-label="Close dialog">
                Close
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => {
                  const fieldName = field.name;
                  const hasError = Boolean(fieldErrors[fieldName]);
                  const labelId = `${resource}-${fieldName}`;

                  if (field.type === 'checkbox') {
                    return (
                      <label key={fieldName} htmlFor={labelId} className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 md:col-span-2">
                        <input id={labelId} name={fieldName} type="checkbox" defaultChecked={Boolean(editingItem?.[fieldName])} value="true" className="h-4 w-4 rounded border-slate-600 bg-slate-800" />
                        {field.label}
                      </label>
                    );
                  }

                  const commonProps = {
                    id: labelId,
                    name: fieldName,
                    defaultValue: startValue(field),
                    required: field.required,
                    'aria-invalid': hasError,
                    'aria-describedby': hasError ? `${labelId}-error` : undefined,
                    className: `w-full min-h-11 min-w-0 rounded-md border px-3 py-2 border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 ${hasError ? 'border-rose-500' : ''}`
                  };

                  return (
                    <div key={fieldName} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label htmlFor={labelId} className="mb-2 block text-sm font-medium text-slate-200">
                        {field.label}
                      </label>

                      {field.type === 'textarea' || field.type === 'list' ? (
                        <textarea {...commonProps} rows={4} />
                      ) : field.type === 'select' ? (
                        <select {...commonProps}>
                          <option value="">Select</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input {...commonProps} type={field.type ?? 'text'} />
                      )}

                      {hasError ? (
                        <p id={`${labelId}-error`} className="mt-1 text-xs text-rose-300">
                          {fieldErrors[fieldName]}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {(uploadFieldMap[resource] ?? []).map((field) => {
                const selectedFile = selectedFiles[field.field] ?? (field.field === 'imageUrl' ? projectImage : undefined);
                const existingUrl = typeof editingItem?.[field.field] === 'string' ? String(editingItem[field.field]) : '';
                const fieldId = `${resource}-${field.field}-upload`;
                return <div key={field.field} className="space-y-2 md:col-span-2">
                  <label htmlFor={fieldId} className="block text-sm font-medium text-slate-200">{field.label}</label>
                  {field.image && selectedFile ? <img className="max-h-48 rounded-lg border border-slate-700 object-contain" src={imagePreviews[field.field]} alt={`Preview of ${selectedFile.name}`} /> : null}
                  {field.image && !selectedFile && privateReadUrls[field.field] && !clearedFiles.includes(field.field) ? <img className="max-h-48 rounded-lg border border-slate-700 object-contain" src={privateReadUrls[field.field]} alt={`Current ${field.label.toLowerCase()}`} /> : null}
                  {!field.image && privateReadUrls[field.field] && !clearedFiles.includes(field.field) ? <a className="block text-sm text-sky-300 underline" href={privateReadUrls[field.field]} target="_blank" rel="noreferrer">Open current file</a> : null}
                  {selectedFile ? <p className="break-all text-sm text-sky-200">Selected: {selectedFile.name}</p> : null}
                  {selectedFile || existingUrl ? <Button type="button" variant="outline" size="sm" onClick={() => {
                    setSelectedFiles((files) => { const next = { ...files }; delete next[field.field]; return next; });
                    setProjectImage(null);
                    setClearedFiles((cleared) => cleared.includes(field.field) ? cleared : [...cleared, field.field]);
                  }}>Remove / replace</Button> : null}
                  <input id={fieldId} type="file" accept={field.accept} aria-describedby={`${fieldId}-help`} onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setSelectedFiles((files) => ({ ...files, [field.field]: file }));
                      if (field.field === 'imageUrl') setProjectImage(file);
                      setClearedFiles((cleared) => cleared.filter((key) => key !== field.field));
                    }
                  }} className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" />
                  <p id={`${fieldId}-help`} className="text-xs text-slate-400">JPEG, PNG, WebP, SVG, or PDF as appropriate; maximum 10 MiB. Unpublished and private until linked to published content.</p>
                </div>;
              })}

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                {uploadController ? <Button type="button" variant="outline" onClick={() => uploadController.abort()}>Cancel upload ({uploadProgress}%)</Button> : null}
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? projectImage && resource === 'projects' ? 'Uploading and saving...' : 'Saving...' : editingItem ? 'Save changes' : 'Create item'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-950/75 p-3 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="admin-delete-dialog-title">
          <div className="my-auto w-full min-w-0 max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6">
            <h3 id="admin-delete-dialog-title" className="break-words text-xl font-semibold text-white">Delete {RESOURCE_TITLES[resource] ?? 'item'}?</h3>
            <p className="mt-3 text-sm text-slate-300">This action cannot be undone.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button type="button" className="border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
