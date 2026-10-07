# WhenWiHungry design system: "Cookshop signboard"

Inspired by Jamaican hand-painted shop signs. White pages and real food photos do the work; a dark signboard header and footer carry the logo; the painted verdict sign is the one bold device.

## Tokens (`src/app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| `--paper` | #FFFFFF | Page background |
| `--concrete` | #F1F1EE | Quiet sections, filter panel, placeholders |
| `--ink` | #241B16 | Text, signboard header/footer, outlines |
| `--ink-soft` | #5B4F47 | Secondary text |
| `--red` | #C8261A | Actions, links, the "For restaurants" band |
| `--yellow` | #FFC93C | Highlights behind ink text only (Run Go Get It, header CTA) |
| `--green` | #1F6B45 | The "Worth It" verdict only |

Type: **Alfa Slab One** (`--font-display`) for headlines in sentence case; **Libre Franklin** (`--font-text`) for everything else.

## Rules
- Verdicts are always `<VerdictBadge>` (painted, tilted sign). Nothing else rotates or gets a hard shadow.
- Photos lead: listing cards are photo + type, no boxes. Third-party photos carry a small "Photo: …" credit.
- No all-caps labels, no single-word colour accents in headlines, no emoji icons, no "→" on buttons.
- One red action per view where possible; secondary actions are ink outlines.
- Motion only in response to the reader (hover zoom on photos); `prefers-reduced-motion` turns it off.
