// Videos can live outside this site, e.g. a teaser .mp4 committed to a project's GitHub repo.
// A GitHub "blob" URL is the HTML page that shows the file, not the file itself, so it can't feed a <video>.
// These helpers turn it into the raw file URL (raw.githubusercontent.com serves byte ranges and
// `Cross-Origin-Resource-Policy: cross-origin`, so the browser can stream and seek it directly).
// Local paths (/videos/…) and other direct links are returned unchanged.

const GITHUB_FILE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+?)(?:\?.*)?$/

/** Playable URL for a video link: GitHub blob/raw page → raw.githubusercontent.com file, anything else as-is. */
export function videoSrc(url: string) {
  const m = url.match(GITHUB_FILE)
  return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}` : url
}

/** The repo page for a GitHub video link ("https://github.com/<owner>/<repo>"), or undefined for other links. */
export function videoRepo(url: string) {
  const m = url.match(GITHUB_FILE)
  return m ? `https://github.com/${m[1]}/${m[2]}` : undefined
}

/** MIME type from the file extension, so the browser can skip formats it can't play. */
export function videoType(url: string) {
  const ext = url.split(/[?#]/)[0]!.split('.').pop()?.toLowerCase()
  return ext === 'webm' ? 'video/webm' : ext === 'mov' ? 'video/quicktime' : 'video/mp4'
}
