type TiktokEmbedProps = {
  url?: string;
};

export function TiktokEmbed({ url }: TiktokEmbedProps) {
  if (!url) {
    return (
      <section className="card">
        <h2>WhenWiHungry review</h2>
        <p>No TikTok review linked yet. This slot is ready for the first video embed.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>WhenWiHungry review</h2>
      <p>
        Video integration is queued for the live data pass. For now, this place is linked to{" "}
        <a href={url}>{url}</a>.
      </p>
    </section>
  );
}
