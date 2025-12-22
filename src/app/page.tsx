import FeatureShowcase from "@/components/landing/FeatureShowcase";
import FeedSection from "@/components/landing/FeedSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import WoodFrame from "@/components/ui/WoodFrame";

export default function Home() {
	return (
		<WoodFrame>
			<div className="bg-chalkboard-bg">
				<HeroSection />
				<FeatureShowcase />
				<FeedSection />
				<Footer />
			</div>
		</WoodFrame>
	);
}
