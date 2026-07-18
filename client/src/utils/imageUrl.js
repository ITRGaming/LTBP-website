const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const serverUrl = apiBaseUrl.replace(/\/api\/?$/, '');

export const resolveImageUrl = (url) => {
  if (!url || /^(https?:|data:|blob:)/i.test(url)) return url;
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
