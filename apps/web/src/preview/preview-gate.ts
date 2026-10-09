export function isPreviewEntryEnabled(isDevelopment: boolean, pathname: string): boolean {
  return isDevelopment && (pathname === '/__preview' || pathname.startsWith('/__preview/'));
}
