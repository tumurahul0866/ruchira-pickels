export const resolveApiPrefix = (env = import.meta.env) => {
const DEFAULT_PROD_BACKEND = 'https://ruchira-backend-kv3q.onrender.com';

  let configuredBase = env?.VITE_BACKEND_URL?.trim().replace(/\/$/, '');
  if (configuredBase) {
    const normalizedBase = configuredBase.replace(/\/api$/, '');
    const safeHost = normalizedBase.replace(/^(https?:\/\/)?ruchira-backend\.vercel\.app(?:\/api)?$/i, 'https://ruchira-backend-kv3q.onrender.com');
    configuredBase = safeHost;
    const finalBase = configuredBase.replace(/\/api$/, '');
    // If the configured value is a bare host (no protocol), default to https://
    const hasProtocol = /^https?:\/\//i.test(finalBase);
    const withProtocol = hasProtocol ? finalBase : `https://${finalBase}`;
    return `${withProtocol}/api`;
  }

  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:3001/api';
  }

  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://127.0.0.1:3001/api';
  }

  // In production, default to the separate backend deployment when no VITE_BACKEND_URL is configured.
  return `${DEFAULT_PROD_BACKEND}/api`;
};

export const resolveApiUrl = (path, env = import.meta.env) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${resolveApiPrefix(env)}${normalizedPath}`;
};
