import adapter from "@sveltejs/adapter-static";

const dev = process.argv.includes("dev");

const config = {
	kit: {
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: "404.html",
			strict: false
		}),
		paths: {
			base: dev ? "" : "/table-mind"
		},
		appDir: "app"
	}
};

export default config;
