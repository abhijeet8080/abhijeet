import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Config-level headers apply to statically prerendered pages too,
        // unlike proxy.ts's response.headers mutation (which can be
        // clobbered by Next's own cache-serving layer for prerendered
        // routes). Declaring it here guarantees every response — cached
        // or dynamic — tells CDNs the HTML and Markdown representations
        // (see proxy.ts) vary independently by Accept.
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept, Accept-Encoding" }],
      },
    ];
  },
};

export default nextConfig;
