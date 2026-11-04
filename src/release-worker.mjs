// Keep the deployed baseline's APIs and error behavior; serve the reviewed UI as assets.
import legacy from "./legacy-worker.mjs";

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    const isFrontend =
      path === "/" || path === "/index.html" || path.startsWith("/assets/");
    if (isFrontend && ["GET", "HEAD"].includes(request.method)) {
      const asset = await env.ASSETS.fetch(request);
      const response = new Response(asset.body, asset);
      response.headers.set("x-content-type-options", "nosniff");
      response.headers.set("x-frame-options", "DENY");
      response.headers.set(
        "referrer-policy",
        "strict-origin-when-cross-origin",
      );
      response.headers.set(
        "permissions-policy",
        "camera=(), microphone=(), geolocation=()",
      );
      response.headers.set(
        "content-security-policy",
        "default-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
      );
      if (path === "/" || path === "/index.html")
        response.headers.set("cache-control", "no-cache");
      return response;
    }
    return legacy.fetch(request);
  },
};
