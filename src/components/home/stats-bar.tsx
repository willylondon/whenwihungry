type StatsBarProps = {
  placeCount: number;
  reviewCount: number;
  parishCount: number;
};

export function StatsBar({ parishCount, placeCount, reviewCount }: StatsBarProps) {
  const items = [
    { label: "Places Listed", suffix: "", value: placeCount },
    { label: "Reviews Written", suffix: "+", value: reviewCount },
    { label: "Parishes Covered", suffix: "+", value: parishCount }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="stats-grid card">
          {items.map((item) => (
            <div className="stat-item" key={item.label}>
              <strong>
                {item.value}
                {item.suffix}
              </strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
