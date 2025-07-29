import "/src/styles/index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Page from "./app/page";

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <Page />
  </StrictMode>
);
