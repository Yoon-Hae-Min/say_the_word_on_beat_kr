"use client";

import setupLocatorUI from "@locator/runtime";
import type { PropsWithChildren } from "react";

const LocationJsProvider = ({ children }: PropsWithChildren) => {
	if (process.env.NODE_ENV === "development") {
		setupLocatorUI();
	}

	return <> {children} </>;
};

export default LocationJsProvider;
