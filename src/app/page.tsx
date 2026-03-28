import { WoodFrame } from "@/shared/ui";
import { CtaBanner } from "@/widgets/cta-banner";
import { FeatureShowcase } from "@/widgets/feature-showcase";
import { LandingFeed } from "@/widgets/landing-feed";
import { LandingFooter } from "@/widgets/landing-footer";
import { LandingHero } from "@/widgets/landing-hero";
import LandingScrollTracker from "./_components/LandingScrollTracker";

export default function Home() {
	return (
		<WoodFrame>
			<main id="main-content" className="bg-chalkboard-bg">
				<LandingScrollTracker />
				<div data-section="hero">
					<LandingHero />
				</div>
				<div data-section="feed">
					<LandingFeed />
				</div>
				<div data-section="feature-showcase">
					<FeatureShowcase />
				</div>
				<div data-section="cta-banner">
					<CtaBanner />
				</div>
				<div data-section="footer">
					<LandingFooter />
				</div>
			</main>
		</WoodFrame>
	);
}
