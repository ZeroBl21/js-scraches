export class BrowserRouter extends HTMLElement {
	constructor() {
		super();

		this.routes = new Map([
			["/", "static/home.html"],
			["/about", "static/about.html"],
			["/home/feed", "static/feed.html"],
			["/tutorial", "static/tutorial.html"],
		]);

		console.log("Running");
	}

	connectedCallback() {
		this.render();
		document.addEventListener("click", (e) => this.pickAnchors(e));
		console.log("Connected");

		window.addEventListener("popstate", (e) => {
			console.log(e.state.route);
			this.loadRoute(e.state.route, false);
		});

		this.loadRoute();
	}

	disconnectedCallback() {
		window.removeEventListener("click", this.pickAnchors);
		window.removeEventListener("popstate", this.loadRoute);
	}

	pickAnchors(event) {
		const link = event.target.closest("a");
		if (!link) {
			return;
		}
		event.preventDefault();
		const url = event.target.getAttribute("href");

		this.loadRoute(url);
	}

	async loadRoute(
		route = window.location.pathname || "/",
		addToHistory = true,
	) {
		const path = this.routes.get(route);

		if (!path) {
			console.error("404 Not Found");
			this.innerHTML = "<p>404 - Page Not Found</p>";
			return;
		}

		if (addToHistory) {
			history.pushState({ route }, null, route);
		}

		const response = await fetch(`/${path}`).catch((err) => err);
		if (response instanceof Error) {
			this.innerHTML = `<p>Error: ${response.message}</p>`;
			return;
		}

		if (!response.ok) {
			console.log(response);
			this.innerHTML = `<p>Error loading: ${path}</p>`;
			return;
		}

		const content = await response.text().catch((err) => err);
		if (content instanceof Error) {
			this.innerHTML = `<p>Error: ${response.message}</p>`;
			return;
		}

		this.innerHTML = content;
	}

	render() {
		this.innerHTML = "<div>Loading...</div>";
	}
}

customElements.define("browser-router", BrowserRouter);
