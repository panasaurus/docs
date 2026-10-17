import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import PanasaurusLogo from "@/components/ui/PanasaurusLogo";
import WingsLogo from "@/components/ui/WingsLogo";
import { Card, Cards } from "fumadocs-ui/components/card";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BookOpenText, Server, Boxes, Egg, MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
	metadataBase: new URL('https://panasaurus.com'),
	title: "Panasaurus — the dino-strong game server platform",
	description:
		"Panasaurus is a game server management platform built on the proven Pterodactyl and Pyrodactyl lineage. A Docker-native panel with Blueprint built in, a Wings daemon rewritten in Rust, and every core image in one GHCR namespace.",
	openGraph: {
		title: "Panasaurus — the dino-strong game server platform",
		description:
			"A Docker-native panel with Blueprint built in, a Wings daemon rewritten in Rust, and every core image in one GHCR namespace.",
		images: [{ url: "/og.png" }],
	},
};

const components = [
	{
		name: "Panel",
		icon: <Server size={20} />,
		href: "/docs/panasaurus/installation",
		tagline: "The control plane.",
		points: [
			"Laravel 12 + React 19, OPcache JIT out of the box",
			"Blueprint extension framework pre-installed",
			"Marketplace, extension CLI, and /api/health built in",
			"One compose stack: panel, MariaDB, Redis",
		],
	},
	{
		name: "Wings",
		icon: <WingsLogo className="h-5 w-5" />,
		href: "/docs/wings/installation",
		tagline: "The node daemon, in Rust.",
		points: [
			"Drop-in compatible with the Wings v1.13.3 API",
			"Native TLS with automatic ACME certificates",
			"SFTP with rate limits and a sandboxed shell",
			"Six backup drivers, per-server bandwidth limits",
		],
	},
	{
		name: "Images",
		icon: <Boxes size={20} />,
		href: "/docs/panasaurus/images",
		tagline: "The yolks, maintained.",
		points: [
			"One namespace: ghcr.io/panasaurus/images",
			"Java 8–26, Node 12–24, Python 3.7–3.13, Go, Rust, .NET",
			"Multi-arch builds, rebuilt monthly",
			"A single linted CI pipeline for all 58 images",
		],
	},
];

const Page = () => {
	return (
		<>
			<div className="relative z-10 w-full overflow-clip rounded-3xl bg-gray-50 dark:bg-[#111] text-white">
				<div className="relative mx-auto flex h-full w-full container flex-col items-center px-6">
					<div className="z-10 mx-auto mt-12 flex h-full w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-0">
						<h1 className="w-full font-extrabold text-display-lg tracking-[-0.14rem] drop-shadow-xl lg:w-1/2 text-gray-900 dark:text-gray-100">
							The dino-strong game server platform
						</h1>
						<div className="flex w-full flex-col gap-8 lg:w-1/3 lg:gap-4">
							<p className="text-gray-600 dark:text-[#ffffffbb] text-[20px] leading-[155%]">
								A Docker-native panel with Blueprint built in, a Wings daemon rewritten in Rust, and every core image in one GHCR namespace — designed to run together.
							</p>
							<div className="flex gap-2 flex-col">
								<Button variant="secondary" href="/docs/panasaurus" isArrow>
									<BookOpenText size={16} /> View Documentation
								</Button>
								<Button variant="secondary" href="https://github.com/panasaurus/panel" isArrow external>
									<GitHubLogoIcon /> Star on GitHub
								</Button>
							</div>
						</div>
					</div>
					<div className="relative mt-8 mb-12 w-full max-w-3xl">
						<div className="overflow-hidden rounded-2xl border border-black/10 shadow-2xl dark:border-white/10">
							<div className="flex items-center gap-2 border-b border-white/10 bg-[#0B1210] px-4 py-3">
								<span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
								<span className="h-3 w-3 rounded-full bg-[#febc2e]" />
								<span className="h-3 w-3 rounded-full bg-[#28c840]" />
								<span className="ml-3 font-mono text-xs text-white/40">root@node — install.sh</span>
							</div>
							<div className="bg-[#0B1210] px-6 py-6 font-mono text-sm leading-7 text-white/90">
								<p>
									<span className="text-brand">$</span> curl -fsSL https://panasaurus.com/install.sh | bash
								</p>
								<p className="text-white/45">
									&nbsp;&nbsp;1) Install the Panel
									<br />
									&nbsp;&nbsp;2) Install Wings
									<br />
									&nbsp;&nbsp;3) Install both
									<br />
									&nbsp;&nbsp;4) Exit
								</p>
								<p>
									<span className="text-brand">?</span> Choose what to install <span className="animate-pulse text-brand">▊</span>
								</p>
							</div>
						</div>
						<div className="pointer-events-none absolute -bottom-8 left-0 z-[-1] h-[400px] w-[400px] scale-[1.4] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand to-70% to-[transparent] opacity-[12%]" />
					</div>
				</div>
			</div>
			<section className="relative z-10 w-full overflow-clip rounded-3xl rounded-b-none bg-gray-50 dark:bg-[#111]">
				<div
					className="container relative grid gap-12 pt-24 lg:pt-24 pb-20 lg:gap-20 lg:py-40"
					style={{ "--circle-background": "#0e9f6e" } as React.CSSProperties}
				>
					<div className="pointer-events-none absolute bottom-0 left-0 z-[0] h-[676px] w-[676px] scale-[1.75] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[--circle-background] to-70% to-[transparent] opacity-[12%] xl:right-[50px] xl:left-auto" />
					<div className="relative z-[14] flex max-w-[750px] flex-col items-start justify-start">
						<Pill>Three parts, one installer</Pill>
						<h1 className="mb-6 max-w-4xl font-extrabold text-display-xl tracking-tighter text-gray-900 dark:text-white">
							<span className="bg-gradient-to-br from-brand to-emerald-500 bg-clip-text text-transparent">Docker-native.</span> <br />
							<span className="bg-gradient-to-br from-brand to-emerald-500 bg-clip-text text-transparent">Dino-strong.</span>
						</h1>
						<p className="mb-6 font-medium text-gray-600 dark:text-[#ffffff99] text-xl leading-[190%]">
							One command turns a bare apt-based server into a running panel, a Wings node, or both — it installs Docker, verifies release checksums, generates secrets, writes the systemd unit, and waits for the health checks to pass.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-12 md:grid-cols-3">
						{components.map((component) => (
							<a key={component.name} href={component.href} className="group col-span-1">
								<div className="flex flex-col gap-1">
									<span className="flex items-center gap-2 font-bold text-brand text-lg">
										{component.icon}&nbsp;{component.name}
										<ArrowRight size={16} className="opacity-0 transition-opacity group-hover:opacity-100" />
									</span>
									<span className="font-semibold text-gray-900 dark:text-gray-100">{component.tagline}</span>
									<ul className="mt-2 flex list-none flex-col gap-1.5 text-gray-600 dark:text-gray-300">
										{component.points.map((point) => (
											<li key={point} className="flex items-start gap-2">
												<span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
												<span className="text-sm leading-relaxed">{point}</span>
											</li>
										))}
									</ul>
								</div>
							</a>
						))}
					</div>

					<div className="relative z-[14] flex max-w-[750px] flex-col items-start justify-start pt-8">
						<Pill>The ecosystem</Pill>
						<h1 className="mb-6 max-w-4xl font-extrabold text-display-lg tracking-tighter text-gray-900 dark:text-white">
							Eggs, community, and source
						</h1>
					</div>

					<Cards className="relative z-[14]">
						<Card title="Eggs marketplace" href="https://eggs.panasaurus.com" external>
							<Egg size={16} className="mb-2 text-brand" />
							Curated, tested eggs for popular games at eggs.panasaurus.com — import one JSON file under Admin → Nests and deploy.
						</Card>
						<Card title="Discord" href="https://discord.gg/tszvW9zKN7" external>
							<MessageCircle size={16} className="mb-2 text-brand" />
							Install help, Wings networking questions, egg requests, and extension talk — the fastest way to reach people who run this stack daily.
						</Card>
						<Card title="GitHub" href="https://github.com/panasaurus" external>
							<GitHubLogoIcon className="mb-2 text-brand" />
							Panel, Wings, images, and these docs — everything is open source under the panasaurus organization.
						</Card>
					</Cards>
				</div>
			</section>
			<footer className="w-full border-t border-black/5 bg-gray-50 py-10 dark:border-white/5 dark:bg-[#111]">
				<div className="container flex flex-col items-start justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 md:flex-row md:items-center">
					<span className="flex items-center gap-2">
						<PanasaurusLogo className="h-5 w-5" />
						Panasaurus — the dino-strong game server platform
					</span>
					<span>
						Built on{" "}
						<a className="text-brand hover:underline" href="https://pterodactyl.io" target="_blank" rel="noopener noreferrer">Pterodactyl</a>,{" "}
						<a className="text-brand hover:underline" href="https://pyrodactyl.dev" target="_blank" rel="noopener noreferrer">Pyrodactyl</a>, and{" "}
						<a className="text-brand hover:underline" href="https://blueprint.zip" target="_blank" rel="noopener noreferrer">Blueprint</a>.
					</span>
				</div>
			</footer>
		</>
	);
};

export default Page;
