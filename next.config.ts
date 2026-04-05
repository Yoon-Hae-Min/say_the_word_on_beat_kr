import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/(privacy|terms|faq|about|guide)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, stale-while-revalidate=604800",
					},
				],
			},
			{
				source: "/(favicon\\.ico|robots\\.txt|sitemap\\.xml)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400",
					},
				],
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "dnldvqkwlbvhspvpduqc.supabase.co",
				port: "",
				pathname: "/storage/v1/object/public/**",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "54321",
				pathname: "/storage/v1/object/public/**",
			},
		],
		// Disable optimization for local development to allow private IPs
		unoptimized: true,
	},
	turbopack: {
		rules: {
			"**/*.{tsx,jsx}": {
				loaders: [
					{
						loader: "@locator/webpack-loader",
						options: { env: "development" },
					},
				],
			},
		},
	},
};

export default nextConfig;
