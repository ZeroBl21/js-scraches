import { AppRouter } from "./router.js";

window.addEventListener("DOMContentLoaded", () => {
	AppRouter.addRoute("home", "static/home.html");
	AppRouter.addRoute("about", "static/about.html");
});
