import { WoodFrame } from "@/shared/ui";
import { ContentSection } from "@/widgets/content-section";
import { FeatureShowcase } from "@/widgets/feature-showcase";
import { LandingFeed } from "@/widgets/landing-feed";
import { LandingFooter } from "@/widgets/landing-footer";
import { LandingHero } from "@/widgets/landing-hero";

export default function Home() {
	return (
		<WoodFrame>
			<main id="main-content" className="bg-chalkboard-bg">
				<LandingHero />
				<FeatureShowcase />
				<ContentSection />
				<LandingFeed />
				<LandingFooter />
			</main>
		</WoodFrame>
	);
}
