import React, { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Page from "./app/page";

export function render(_url) {
  const html = renderToString(
    <StrictMode>
      <Page />
    </StrictMode>
  );
  return { html };
}
