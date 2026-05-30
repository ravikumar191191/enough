/**
 * api/og.tsx — Vercel Edge function that renders a 1200×630 Open-Graph card
 * for a shared scenario. Pure renderer: it reads display strings from the query
 * (city, amount, line) — the client computes them — and draws the card.
 *
 * Runs only on Vercel (edge runtime); it cannot run in the local Vite dev server.
 * Text is kept ASCII-safe so it renders with @vercel/og's default font (no ₹/≈/·).
 */
import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler(req: Request) {
  const p = new URL(req.url).searchParams;
  const city = p.get("city") || "Your number";
  const amount = p.get("amount") || "";
  const line =
    p.get("line") || "How much you need to stop working - India and US, ranked.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f3ec",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 2,
            color: "#6f685b",
          }}
        >
          ENOUGH / YOUR CROSS-BORDER "ENOUGH" NUMBER
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 68, color: "#23201a", fontWeight: 600 }}>
            {city}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              color: "#9a3412",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {amount}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 38, color: "#23201a" }}>{line}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", fontSize: 36, color: "#9a3412", fontWeight: 600 }}>
            Find your number, free, at enough-wheat.vercel.app
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#6f685b" }}>
            India and US cities ranked   -   not financial advice
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
