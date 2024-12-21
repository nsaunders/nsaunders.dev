export const githubRequestInit = (config?: RequestInit) => ({
  ...config,
  headers: {
    ...config?.headers,
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});
