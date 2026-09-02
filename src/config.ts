export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000';

export const WS_BASE =
  (import.meta.env.VITE_WS_URL as string | undefined) || 'ws://localhost:3000';

export const GITHUB_FE_REPO_URL =
  (import.meta.env.VITE_GITHUB_FE_REPO_URL as string | undefined) ||
  'https://github.com/atharvadhumal/canvasRTC-fe';

export const GITHUB_BE_REPO_URL =
  (import.meta.env.VITE_GITHUB_BE_REPO_URL as string | undefined) ||
  'https://github.com/atharvadhumal/canvasRTC-be';

export const GITHUB_REPOS = [
  { label: 'Frontend', url: GITHUB_FE_REPO_URL },
  { label: 'Backend', url: GITHUB_BE_REPO_URL },
] as const;
