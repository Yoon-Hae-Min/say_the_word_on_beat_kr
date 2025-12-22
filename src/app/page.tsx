import { WoodFrame } from "@/shared/ui";
import { FeatureShowcase } from "@/widgets/feature-showcase";
import { LandingFeed } from "@/widgets/landing-feed";
import { LandingFooter } from "@/widgets/landing-footer";
import { LandingHero } from "@/widgets/landing-hero";

export default function Home() {
	return (
		<WoodFrame>
			<div className="bg-chalkboard-bg">
				<LandingHero />
				<FeatureShowcase />
				<LandingFeed />
				<LandingFooter />
			</div>
		</WoodFrame>
	);
}
