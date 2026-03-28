"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@/shared/lib/analytics/gtag";

export function useScrollTracking() {
	const trackedSections = useRef<Set<string>>(new Set());

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const sectionId = (entry.target as HTMLElement).dataset.section;
						if (sectionId && !trackedSections.current.has(sectionId)) {
							trackedSections.current.add(sectionId);
							sendGAEvent({
								action: "section_view",
								category: "landing_scroll",
								label: sectionId,
							});
						}
					}
				}
			},
			{ threshold: 0.3 }
		);

		const sections = document.querySelectorAll("[data-section]");
		for (const section of sections) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	}, []);
}
