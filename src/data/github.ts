export const githubRequestInit = (config?: {
  headers?: Record<string, unknown>;
}) => ({
  ...config,
  headers: {
    ...config?.headers,
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
});
