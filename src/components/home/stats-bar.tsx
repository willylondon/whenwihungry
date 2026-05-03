type StatsBarProps = {
  placeCount: number;
  reviewCount: number;
  parishCount: number;
};

export function StatsBar({ parishCount, placeCount, reviewCount }: StatsBarProps) {
  const items = [
    { label: "Places Listed", value: placeCount },
    { label: "Reviews Written", value: reviewCount },
    { label: "Parishes Covered", value: parishCount }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="stats-grid card">
          {items.map((item) => (
            <div className="stat-item" key={item.label}>
              <strong>{item.value}+</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
