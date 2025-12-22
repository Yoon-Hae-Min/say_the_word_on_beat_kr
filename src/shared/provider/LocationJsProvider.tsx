"use client";

import React, { PropsWithChildren } from "react";

import setupLocatorUI from "@locator/runtime";

const LocationJsProvider = ({ children }: PropsWithChildren) => {
  if (process.env.NODE_ENV === "development") {
    setupLocatorUI();
  }

  return <> {children} </>;
};

export default LocationJsProvider;
