// @ts-check
import { defineConfig } from 'astro/config';
import { storyblok }  from '@storyblok/astro';

import basicSsl from '@vitejs/plugin-basic-ssl'

import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

const { STORYBLOK_DELIVERY_API_TOKEN } = loadEnv(
	import.meta.env.MODE,
	process.cwd(),
	'',
);

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), basicSsl()]
  },
  integrations: [
    storyblok({
      bridge: process.env.STORYBLOK_IS_PREVIEW === 'true' ? true : false,
      accessToken: STORYBLOK_DELIVERY_API_TOKEN,
      apiOptions: { region: process.env.STORYBLOK_REGION ?? 'eu' },
      components: {                
        page: 'components/home/Page',
        hero: 'components/home/Hero',
        about: 'components/home/About',
        routes: 'components/home/Routes',
        prices_services: 'components/home/Services',
        portfolio: 'components/home/Materials',
        materials: 'components/home/Materials',
      },
    })
  ],
  output: process.env.STORYBLOK_IS_PREVIEW === 'true' ? 'server' : 'static',
});