export { browser, dev, prerendering } from '$app/env'
//https://github.com/sveltejs/kit/blob/master/packages/adapter-auto/adapters.js
export const vercel = !!process.env.VERCEL
export const cloudflarePage = !!process.env.CF_PAGES
export const netlify = !!process.env.NETLIFY