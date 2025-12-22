/**
 * Design Token Usage Examples
 *
 * This component demonstrates how to use the design tokens defined in src/app/globals.css
 * All tokens are available as Tailwind utility classes
 */

export default function DesignTokenExample() {
	return (
		<div className="space-y-8 p-8">
			<section>
				<h2 className="mb-4 text-2xl font-bold text-text-main">Color Tokens</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-3 text-lg font-semibold text-text-main">Semantic Colors</h3>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-primary" />
								<p className="text-sm">bg-primary</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-primary-hover" />
								<p className="text-sm">bg-primary-hover</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card border-2 bg-surface" />
								<p className="text-sm">bg-surface</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-danger" />
								<p className="text-sm">bg-danger</p>
							</div>
						</div>
					</div>

					<div>
						<h3 className="mb-3 text-lg font-semibold text-text-main">Chalkboard Theme</h3>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-chalkboard-bg" />
								<p className="text-sm">bg-chalkboard-bg</p>
								<p className="text-xs text-slate-600">#2F4F4F</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-wood-frame" />
								<p className="text-sm">bg-wood-frame</p>
								<p className="text-xs text-slate-600">#8B4513</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card border-2 bg-chalk-white" />
								<p className="text-sm">bg-chalk-white</p>
								<p className="text-xs text-slate-600">#F5F5F5</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-chalk-yellow" />
								<p className="text-sm">bg-chalk-yellow</p>
								<p className="text-xs text-slate-600">#FFFF33</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-card bg-chalk-blue" />
								<p className="text-sm">bg-chalk-blue</p>
								<p className="text-xs text-slate-600">#87CEEB</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-bold text-text-main">Button Examples</h2>
				<div className="space-y-6">
					<div>
						<h3 className="mb-3 text-lg font-semibold text-text-main">Standard Buttons</h3>
						<div className="flex flex-wrap gap-4">
							<button
								type="button"
								className="rounded-button bg-primary px-6 py-3 text-text-inverse transition-colors hover:bg-primary-hover"
							>
								Primary Button
							</button>
							<button
								type="button"
								className="rounded-button border-2 border-primary bg-surface px-6 py-3 text-primary transition-colors hover:bg-primary hover:text-text-inverse"
							>
								Secondary Button
							</button>
							<button
								type="button"
								className="rounded-button bg-danger px-6 py-3 text-text-inverse transition-colors hover:opacity-90"
							>
								Danger Button
							</button>
						</div>
					</div>

					<div>
						<h3 className="mb-3 text-lg font-semibold text-text-main">Chalkboard Buttons</h3>
						<div className="flex flex-wrap gap-4">
							<button
								type="button"
								className="rounded-button bg-chalk-yellow px-6 py-3 text-chalkboard-bg transition-colors hover:opacity-90"
							>
								Yellow Chalk
							</button>
							<button
								type="button"
								className="rounded-button bg-chalk-blue px-6 py-3 text-chalkboard-bg transition-colors hover:opacity-90"
							>
								Blue Chalk
							</button>
							<button
								type="button"
								className="rounded-button border-2 border-chalk-white bg-chalkboard-bg px-6 py-3 text-chalk-white transition-colors hover:bg-wood-frame"
							>
								Chalkboard Button
							</button>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-bold text-text-main">Card Example</h2>
				<div className="max-w-md rounded-card bg-surface p-6 shadow-lg">
					<h3 className="mb-2 text-xl font-semibold text-text-main">Card Title</h3>
					<p className="text-text-main opacity-80">
						This card uses the design tokens for consistent styling. The border radius uses the card
						token (rounded-card).
					</p>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-bold text-text-main">Spacing Examples</h2>
				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 bg-primary" style={{ margin: "var(--spacing-4)" }} />
						<p>Spacing 4 (1rem)</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 bg-primary" style={{ margin: "var(--spacing-8)" }} />
						<p>Spacing 8 (2rem)</p>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-2xl font-bold text-text-main">Using Design Tokens</h2>
				<div className="rounded-card bg-surface p-4">
					<p className="mb-4 text-sm text-text-main">
						All design tokens are defined in{" "}
						<code className="rounded bg-slate-900 px-2 py-1 text-white">src/app/globals.css</code>
					</p>

					<div className="space-y-4">
						<div>
							<h3 className="mb-2 font-semibold text-text-main">방법 1: Tailwind 클래스 (권장)</h3>
							<pre className="overflow-x-auto rounded bg-slate-900 p-4 text-sm text-white">
								{`<button className="rounded-button bg-primary text-text-inverse">
  Button
</button>`}
							</pre>
						</div>

						<div>
							<h3 className="mb-2 font-semibold text-text-main">
								방법 2: CSS 변수 (필요한 경우만)
							</h3>
							<pre className="overflow-x-auto rounded bg-slate-900 p-4 text-sm text-white">
								{`<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Custom element
</div>`}
							</pre>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
