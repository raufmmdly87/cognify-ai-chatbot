import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cognify AI Chatbot',
    short_name: 'Cognify',
    description: 'An installable AI chat application with offline support.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  };
}
