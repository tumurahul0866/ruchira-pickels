export const resolveApiPrefix = (env = import.meta.env) => {
  const configuredBase = env?.VITE_BACKEND_URL?.trim().replace(/\/$/, '');
  return configuredBase ? `${configuredBase}/api` : '/api';
};

export const resolveApiUrl = (path, env = import.meta.env) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiPrefix(env)}${normalizedPath}`;
};
