import { ImageResponse } from "next/og";
import { SITE_SEO } from "@/constant/seo";

export const alt = SITE_SEO.siteTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SKILLS = ["TypeScript", "Next.js", "React", "Node.js", "Voice AI", "RAG", "LLMs", "Azure"];

export default function OgImage() {
  const host = SITE_SEO.siteUrl.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #050505 0%, #0c0c14 55%, #101528 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#38bdf8",
              }}
            />
            <span style={{ fontSize: 28, letterSpacing: 6, color: "#a1a1aa", textTransform: "uppercase" }}>
              abhi os
            </span>
          </div>
          <span style={{ fontSize: 22, color: "#71717a" }}>{host}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
            Abhijeet Kadam
          </span>
          <span style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 900 }}>
            Voice agents, RAG pipelines & agent tooling — production AI systems with Next.js, TypeScript and Node.js.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {SKILLS.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: 20,
                  color: "#d4d4d8",
                  border: "1px solid #3f3f46",
                  borderRadius: 999,
                  padding: "8px 18px",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
