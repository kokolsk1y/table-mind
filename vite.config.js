import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: "autoUpdate",
			scope: "/table-mind/",
			base: "/table-mind/",
			manifest: {
				name: "TableMind — AI-официант",
				short_name: "TableMind",
				description: "AI-помощник в ресторане. Меню, рекомендации, вызов официанта.",
				start_url: "/table-mind/",
				scope: "/table-mind/",
				display: "standalone",
				background_color: "#0e0e0e",
				theme_color: "#0e0e0e",
				lang: "ru",
				orientation: "portrait",
				icons: [
					{ src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{ src: "icons/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
				]
			},
			workbox: {
				globPatterns: ["**/*.{js,css,ico,png,svg,webp,woff,woff2,json,html}"],
				navigateFallback: "/table-mind/",
				navigateFallbackDenylist: [/^\/api\//],
				cleanupOutdatedCaches: true,
				skipWaiting: true,
				clientsClaim: true,
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.endsWith("/catalog.json"),
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "catalog-cache",
							expiration: { maxAgeSeconds: 86400 }
						}
					}
				]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
