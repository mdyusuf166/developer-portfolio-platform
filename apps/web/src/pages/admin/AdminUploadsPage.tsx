import { useEffect, useMemo, useState } from 'react';

import { AlertCircle, Image, Trash2, Upload } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { uploadsApi } from '../../lib/admin-api';

type UploadRecord = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  purpose?: string | null;
  createdAt: string;
};

export function AdminUploadsPage() {
  const [assets, setAssets] = useState<UploadRecord[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);
  const [readUrls, setReadUrls] = useState<Record<string, string>>({});
  const previewUrl = useMemo(() => file && file.type.startsWith('image/') ? URL.createObjectURL(file) : '', [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const records = await uploadsApi.list() as UploadRecord[];
      setAssets(records);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load uploaded files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAssets(); }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage('');
    setError('');
    const controller = new AbortController();
    setUploadController(controller);
    setProgress(0);
    try {
      await uploadsApi.upload(file, purpose, { signal: controller.signal, onProgress: setProgress });
      setFile(null);
      setPurpose('');
      setMessage('File uploaded.');
      await loadAssets();
    } catch (caught) {
      setError(caught instanceof DOMException && caught.name === 'AbortError' ? 'Upload cancelled. Start a new upload to retry.' : caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setUploading(false);
      setUploadController(null);
    }
  };

  const handleDelete = async (asset: UploadRecord) => {
    if (!window.confirm(`Delete ${asset.originalName}? Any content currently referencing it will no longer display the file.`)) return;
    try {
      await uploadsApi.remove(asset.id);
      await loadAssets();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to delete file.');
    }
  };

  const handleOpen = async (asset: UploadRecord) => {
    try {
      const url = readUrls[asset.id] ?? await uploadsApi.readUrl(asset.id);
      setReadUrls((current) => ({ ...current, [asset.id]: url }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to access this private file.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Development media library</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Media / Uploads</h2>
        <p className="mt-2 text-sm text-slate-400">Uploads remain private unless explicitly linked to published content or explicitly approved as the public profile image.</p>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5" aria-labelledby="upload-new-file">
        <h3 id="upload-new-file" className="text-lg font-semibold text-white">Upload a file</h3>
        <label className="block space-y-2 text-sm text-slate-200">
          <span>File: JPEG, PNG, WebP, SVG, or PDF; maximum 10 MB</span>
          <input type="file" disabled={uploading} accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" />
        </label>
        {file ? <div className="flex min-w-0 flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center">{previewUrl ? <img className="max-h-32 max-w-full rounded-lg border border-slate-700 object-contain sm:max-w-48" src={previewUrl} alt={`Preview of ${file.name}`} /> : null}<span className="min-w-0 break-all">Selected: {file.name} ({Math.ceil(file.size / 1024)} KB)</span><Button size="sm" variant="outline" onClick={() => setFile(null)}>Remove</Button></div> : null}
        <label className="block space-y-2 text-sm text-slate-200"><span>Purpose (optional)</span><input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" value={purpose} maxLength={80} onChange={(event) => setPurpose(event.target.value)} /></label>
        <div className="flex flex-wrap items-center gap-3"><Button disabled={!file || uploading} onClick={() => void handleUpload()}><Upload className="mr-2 h-4 w-4" />{uploading ? `Uploading ${progress}%` : 'Upload'}</Button>{uploading ? <Button variant="outline" onClick={() => uploadController?.abort()}>Cancel</Button> : null}</div>
        {message ? <p role="status" className="text-sm text-emerald-300">{message}</p> : null}
        {error ? <p role="alert" className="flex items-center gap-2 text-sm text-rose-300"><AlertCircle className="h-4 w-4" />{error}</p> : null}
      </section>

      <section className="space-y-3" aria-label="Uploaded files">
        {loading ? <p className="text-sm text-slate-400">Loading files...</p> : assets.length === 0 ? <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">No uploaded files.</p> : assets.map((asset) => (
          <article key={asset.id} className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center">
            {asset.mimeType.startsWith('image/') && readUrls[asset.id] ? <img className="max-h-24 max-w-36 rounded-lg object-contain" src={readUrls[asset.id]} alt={asset.originalName} /> : <Image className="h-8 w-8 text-slate-400" aria-hidden="true" />}
            <div className="min-w-0 flex-1"><h3 className="break-all font-medium text-white">{asset.originalName}</h3><p className="break-words text-xs text-slate-400">{asset.mimeType} · {Math.ceil(asset.size / 1024)} KB{asset.purpose ? ` · ${asset.purpose}` : ''}</p>{readUrls[asset.id] ? <a className="inline-flex min-h-11 items-center break-all text-xs text-sky-300 underline" href={readUrls[asset.id]} target="_blank" rel="noreferrer">Open file</a> : <button type="button" className="inline-flex min-h-11 items-center text-xs text-sky-300 underline" onClick={() => void handleOpen(asset)}>Authorize private access</button>}</div>
            <Button variant="outline" className="border-rose-500/30 text-rose-200" onClick={() => void handleDelete(asset)} aria-label={`Delete ${asset.originalName}`}><Trash2 className="h-4 w-4" /></Button>
          </article>
        ))}
      </section>
    </div>
  );
}
