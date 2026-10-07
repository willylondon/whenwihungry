type SectionHeaderProps = {
  heading: string;
  subtext?: string;
  headingLevel?: 1 | 2;
  id?: string;
};

/** A plain section heading in the site's display type. */
export function SectionHeader({ heading, subtext, headingLevel = 2, id }: SectionHeaderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return <div className="section-heading"><div>
    <Heading id={id}>{heading}</Heading>
    {subtext && <p>{subtext}</p>}
  </div></div>;
}
