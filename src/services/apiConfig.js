export const resolveApiPrefix = (env = import.meta.env) => {
  const configuredBase = env?.VITE_BACKEND_URL?.trim().replace(/\/$/, '');
  if (configuredBase) {
    return `${configuredBase}/api`;
  }

  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:3001/api';
  }

  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://127.0.0.1:3001/api';
  }

  return '/api';
};

export const resolveApiUrl = (path, env = import.meta.env) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiPrefix(env)}${normalizedPath}`;
};
