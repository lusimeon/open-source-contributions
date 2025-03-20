export interface User {
  username: string
  name: string
  avatar: string
}

export interface PullRequest {
  repo: string
  title: string
  url: string
  issue: boolean
  created_at: string
  updated_at: string
  state: 'merged' | 'open' | 'closed'
  number: number
  type: 'User' | 'Organization'
  stars: number
}

export interface Contributions {
  user: User
  prs: PullRequest[]
}
