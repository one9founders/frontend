export function addRefToUrl(url: string): string {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has('ref')) {
      urlObj.searchParams.set('ref', 'one9founders.com');
    }
    return urlObj.toString();
  } catch {
    return url;
  }
}
