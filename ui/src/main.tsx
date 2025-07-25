import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./app/routing/routing";

const withEruda = false;

if (
	(import.meta.env.DEV && import.meta.env.VITE_ENABLE_ERUDA === "true") ||
	withEruda
) {
	import("eruda").then(({ default: eruda }) => eruda.init());
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
