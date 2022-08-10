import adapter from '@sveltejs/adapter-auto'
import dotenv from 'dotenv'
dotenv.config()

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			precompress: true
		})
	}
};

export default config;
