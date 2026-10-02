// GitHub contribution calendar for the last year, fetched once at build time and prerendered to
// /github-contributions.json (see nitro.prerender.routes), so visitors never call a third-party API.
// Source: github-contributions-api.jogruber.de (public, no token needed). If it is unreachable the
// build still succeeds and the component falls back to fetching it in the browser.

interface ContributionDay { date: string, count: number, level: 0 | 1 | 2 | 3 | 4 }

export default defineCachedEventHandler(async () => {
  const { github } = useAppConfig()
  const username = github.username

  try {
    const data = await $fetch<{ total: Record<string, number>, contributions: ContributionDay[] }>(
      `https://github-contributions-api.jogruber.de/v4/${username}`,
      { query: { y: 'last' }, timeout: 15000, retry: 2 },
    )
    return {
      username,
      total: data.total?.lastYear ?? data.contributions.reduce((sum, d) => sum + d.count, 0),
      contributions: data.contributions,
      fetchedAt: new Date().toISOString(),
    }
  }
  catch (error) {
    console.warn(`[github-contributions] could not fetch contributions for ${username}:`, (error as Error).message)
    return { username, total: null, contributions: [] as ContributionDay[], fetchedAt: null }
  }
}, { maxAge: 60 * 60 }) // one upstream call per build (and at most hourly in dev)
