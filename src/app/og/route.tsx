import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(_req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#0f0f0f",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "10px",
            background: "#FF5A1F",
            display: "flex"
          }}
        />

        {/* Decorative ring — top right */}
        <div
          style={{
            position: "absolute",
            top: "-140px",
            right: "-140px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            border: "2px solid rgba(255,90,31,0.18)",
            display: "flex"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: "rgba(255,200,87,0.05)",
            border: "1px solid rgba(255,200,87,0.22)",
            display: "flex"
          }}
        />
        {/* Small solid dot */}
        <div
          style={{
            position: "absolute",
            top: "52px",
            right: "52px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,90,31,0.22)",
            display: "flex"
          }}
        />

        {/* Main content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "68px 100px 68px 120px",
            position: "relative",
            zIndex: 1,
            flex: 1
          }}
        >
          {/* Eyebrow row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "30px"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "5px",
                background: "#FF5A1F",
                display: "flex"
              }}
            />
            <span
              style={{
                color: "#FF5A1F",
                fontSize: "21px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily:
                  '"Helvetica Neue", Helvetica, "Arial", sans-serif'
              }}
            >
              JAMAICA&apos;S BOLDEST FOOD CRITIC
            </span>
          </div>

          {/* Main brand name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "36px"
            }}
          >
            <span
              style={{
                fontSize: "142px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 0.87,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                fontFamily:
                  'Impact, "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
              }}
            >
              WHEN WI
            </span>
            <span
              style={{
                fontSize: "142px",
                fontWeight: 900,
                color: "#FF5A1F",
                lineHeight: 0.87,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                fontFamily:
                  'Impact, "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
              }}
            >
              HUNGRY
            </span>
          </div>

          {/* Yellow rule */}
          <div
            style={{
              width: "90px",
              height: "5px",
              background: "#FFC857",
              marginBottom: "30px",
              display: "flex"
            }}
          />

          {/* Tagline */}
          <span
            style={{
              fontSize: "27px",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.55,
              fontFamily:
                '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 400,
              maxWidth: "680px"
            }}
          >
            No fake ratings. No sponsored plates. Just the truth.
          </span>
        </div>

        {/* Bottom Jamaican-colour strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            display: "flex"
          }}
        >
          <div style={{ flex: 1, background: "#000000", display: "flex" }} />
          <div style={{ flex: 1, background: "#FFC857", display: "flex" }} />
          <div style={{ flex: 1, background: "#009B3A", display: "flex" }} />
          <div style={{ flex: 1, background: "#000000", display: "flex" }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
