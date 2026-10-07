import { VerdictBadge } from "@/components/ui/verdict-badge";

const VERDICTS = [
  { code: "RUN_GO_GET_IT", text: "This one hit different. Exceptional food, the experience was right, and you need to move quickly." },
  { code: "WORTH_IT", text: "Solid food, no major complaints. Not life-changing, but it delivered on what it promised." },
  { code: "MID", text: "Could've been better, could've been worse. If it's convenient, fine. Making a trip? Skip it." },
  { code: "SAVE_YOUR_MONEY", text: "Put your wallet back. This one didn't earn it, and your hard-earned money deserves better." }
];

/** How the four verdicts read, shown as the signs themselves. */
export function RatingExplainer() {
  return <section className="section band-concrete" aria-labelledby="verdicts-heading">
    <div className="container">
      <div className="section-heading"><div>
        <h2 id="verdicts-heading">Four verdicts, no star soup</h2>
        <p>Every review ends on one plain call. Star ratings in the directory come from public sources and are labelled that way.</p>
      </div></div>
      <ul className="verdict-guide">
        {VERDICTS.map(verdict => <li key={verdict.code}>
          <VerdictBadge verdict={verdict.code} size="lg" />
          <p>{verdict.text}</p>
        </li>)}
      </ul>
    </div>
  </section>;
}
