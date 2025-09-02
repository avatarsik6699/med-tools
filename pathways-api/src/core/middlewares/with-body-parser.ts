import bodyParser from "koa-bodyparser";

export function withBodyParser() {
	return bodyParser({
		enableTypes: ["json", "form"],
		jsonLimit: "1mb",
		formLimit: "1mb",
		strict: true,
	});
}
