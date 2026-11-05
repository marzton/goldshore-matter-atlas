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
      // Cloudflare's JavaScript Detections copies a CSP response-header nonce
      // onto its injected challenge scripts. Keep bot protection enabled.
      const isDocument = path === "/" || path === "/index.html";
      const nonce = isDocument
        ? ` 'nonce-${crypto.randomUUID().replaceAll("-", "")}'`
        : "";
      response.headers.set(
        "content-security-policy",
        `default-src 'none'; script-src 'self'${nonce}; style-src 'self'; style-src-attr 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
      );
      if (isDocument) response.headers.set("cache-control", "no-cache");
      return response;
    }
    return legacy.fetch(request);
  },
};
