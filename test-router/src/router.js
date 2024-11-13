export class HashRouter extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: "open" });

		this.routes = new Map([["/", "static/home.html"]]);
	}

	connectedCallback() {
		this.render();
		window.addEventListener("hashchange", () => this.loadRoute());
		this.loadRoute();
	}

	disconnectedCallback() {
		window.removeEventListener("hashchange", this.loadRoute);
	}

	static addRoute(name, path) {
		const appRouterInstance = document.querySelector("app-router");
		if (!appRouterInstance) return;

		if (typeof name !== "string") {
			console.error("Invalid route name");
			return;
		}
		if (typeof path !== "string") {
			console.error("Invalid route path");
			return;
		}

		appRouterInstance.routes.set(name, path);
	}

	async loadRoute() {
		const hash = window.location.hash.substring(1) || "/";
		const path = this.routes.get(hash);

		if (!path) {
			console.error("404 Not Found");
			this.shadowRoot.innerHTML = "<p>404 - Page Not Found</p>";
			return;
		}

		const response = await fetch(path).catch((err) => err);
		if (response instanceof Error) {
			this.shadowRoot.innerHTML = `<p>Error: ${response.message}</p>`;
			return;
		}

		if (!response.ok) {
			console.log(response);
			this.shadowRoot.innerHTML = `<p>Error loading: ${path}</p>`;
			return;
		}

		const content = await response.text().catch((err) => err);
		if (content instanceof Error) {
			this.shadowRoot.innerHTML = `<p>Error: ${response.message}</p>`;
			return;
		}

		this.shadowRoot.innerHTML = content;
	}

	render() {
		this.shadowRoot.innerHTML = "<div>Loading...</div>";
	}
}

customElements.define("hash-router", HashRouter);
