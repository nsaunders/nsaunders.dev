export const configureRequest = (req: { headers?: Record<string, string> }) => {
  const token = process.env.VITE_GITHUB_ACCESS_TOKEN;
  if (token) {
    return {
      ...req,
      headers: {
        ...req.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return req;
};
