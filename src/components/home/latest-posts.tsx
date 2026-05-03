import Link from "next/link";

type LatestPostsProps = {
  posts: Array<{
    slug: string;
    title: string;
    dek: string;
    category: string;
    parish: string;
    readTime: string;
    rating: string;
    area: string;
    image: string;
  }>;
};

export function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <section className="section" id="stories">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Latest reviews</span>
            <h2>Every review gets its own page, its own story, and its own verdict.</h2>
          </div>
        </div>
        <div className="story-grid">
          {posts.map((post) => (
            <Link className="card story-card" href={`/reviews/${post.slug}`} key={post.slug}>
              <div className="story-card-image">
                <img alt="" loading="lazy" src={post.image} />
                <span className="badge">{post.category}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.dek}</p>
              <div className="card-meta">
                <span>{post.area}</span>
                <span>{post.readTime}</span>
                <span>{post.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
