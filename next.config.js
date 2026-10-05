const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // O Safari (incl. PWA instalado no iPhone) bloqueia cookies de terceiros. Com a API em outro
  // domínio, o cookie de login é descartado e as chamadas seguintes falham com "Token não informado.".
  // Quando API_PROXY_TARGET está definido, o front encaminha /api/* para a API a partir do próprio
  // domínio, e os cookies passam a ser de primeira parte. Com NEXT_PUBLIC_API_URL vazio, o client usa /api.
  async rewrites() {
    if (!apiProxyTarget) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
