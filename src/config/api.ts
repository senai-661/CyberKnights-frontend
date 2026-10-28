// Forneça somente a origem da API pelo .env.local ou pelo ambiente da Vercel.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error('Configure a variável de ambiente VITE_API_URL.');
}

let parsedApiUrl: URL;

try {
  parsedApiUrl = new URL(configuredApiUrl);
} catch {
  throw new Error('VITE_API_URL deve ser uma URL absoluta, como https://api.exemplo.com.');
}

if (!['http:', 'https:'].includes(parsedApiUrl.protocol)) {
  throw new Error('VITE_API_URL deve usar o protocolo HTTP ou HTTPS.');
}

if (import.meta.env.PROD && parsedApiUrl.protocol !== 'https:') {
  throw new Error('VITE_API_URL deve usar HTTPS em produção.');
}

if (parsedApiUrl.username || parsedApiUrl.password || parsedApiUrl.pathname !== '/' || parsedApiUrl.search || parsedApiUrl.hash) {
  throw new Error('VITE_API_URL deve conter somente a origem da API, sem credenciais, caminhos ou parâmetros.');
}

export const API_URL = parsedApiUrl.origin;