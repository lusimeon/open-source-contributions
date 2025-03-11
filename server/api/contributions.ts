import type { Contributions, PullRequest, User } from '~~/types/index'

export default defineCachedEventHandler(async (event) => {
  const octokit = useOctokit()
  // Fetch user from token
  const userResponse = await octokit.request('GET /user')
  const user: User = {
    name: userResponse.data.name ?? userResponse.data.login,
    username: userResponse.data.login,
    avatar: userResponse.data.avatar_url,
  }
  // Fetch pull requests from user
  const { data } = await octokit.request('GET /search/issues', {
    q: `author:"${user.username}"+-user:"${user.username}"`,
    per_page: 50,
    page: 1,
  })

  const prs: PullRequest[] = []
  // For each PR, fetch the repository details
  for (const pr of data.items) {
    const [owner, name] = pr.repository_url.split('/').slice(-2)
    const repo = await fetchRepo(event, owner!, name!)

    prs.push({
      repo: `${owner}/${name}`,
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      state: pr.pull_request?.merged_at ? 'merged' : pr.state as 'open' | 'closed',
      number: pr.number,
      issue: !pr.pull_request,
      type: repo.owner.type, // Add type information (User or Organization)
      stars: repo.stargazers_count,
    })
  }

  return {
    user,
    prs,
  } as Contributions
}, {
  group: 'api',
  name: 'contributions',
  getKey: () => 'all',
  swr: true,
  maxAge: 60 * 5, // 5 minutes
})
