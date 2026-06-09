import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'


export default defineConfig({

plugins:[

react(),

Sitemap({

hostname:
'https://tool-hub-bxb.pages.dev'

})

]

})