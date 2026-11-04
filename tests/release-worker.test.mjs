import test from "node:test";
import assert from "node:assert/strict";
import legacy from "../src/legacy-worker.mjs";
import release from "../src/release-worker.mjs";

test("HTML CSP supplies a fresh nonce for Cloudflare challenge scripts without allowing arbitrary inline scripts", async () => {
  const env = {
    ASSETS: {
      fetch: async () =>
        new Response("<html></html>", {
          headers: { "content-type": "text/html" },
        }),
    },
  };
  const policies = [];
  for (let i = 0; i < 2; i++) {
    const response = await release.fetch(
      new Request("https://example.com/"),
      env,
    );
    const policy = response.headers.get("content-security-policy");
    assert.match(policy, /script-src 'self' 'nonce-[a-f0-9]{32}'/);
    assert.doesNotMatch(policy, /script-src[^;]*'unsafe-inline'/);
    policies.push(policy);
  }
  assert.notEqual(policies[0], policies[1]);
});

for (const path of [
  "/health",
  "/api/health",
  "/api/v1/elements",
  "/api/v1/elements/2",
  "/api/v1/elements/57",
  "/api/v1/elements/118",
  "/api/v1/elements/119",
  "/missing",
]) {
  test(`preserves deployed Worker response for ${path}`, async () => {
    const request = new Request(`https://example.com${path}`);
    const before = await legacy.fetch(request.clone());
    const after = await release.fetch(request, {});
    assert.equal(after.status, before.status);
    assert.deepEqual([...after.headers], [...before.headers]);
    assert.equal(await after.text(), await before.text());
  });
}
test("serves only frontend paths with static assets and preserves method rejection", async () => {
  for (const path of ["/", "/index.html", "/assets/example.js"]) {
    const response = await release.fetch(
      new Request(`https://example.com${path}`),
      { ASSETS: { fetch: async () => new Response("static") } },
    );
    assert.equal(await response.text(), "static");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.match(
      response.headers.get("content-security-policy"),
      /script-src 'self'/,
    );
  }
  const post = await release.fetch(
    new Request("https://example.com/", { method: "POST" }),
    {},
  );
  assert.equal(post.status, 405);
});
