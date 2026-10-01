import Image from "next/image";
import Link from "next/link";

import { blog, getPostExcerpt } from "@/config/blog";

export function BlogsIndexPage() {
  return (
    <article className="legal-page blog-page" aria-labelledby="blog-heading">
      <header className="legal-page__hero">
        <Image
          src={blog.hero.image.src}
          alt={blog.hero.image.alt}
          fill
          priority
          unoptimized
          className="legal-page__hero-image"
          sizes="100vw"
        />
        <div className="legal-page__hero-overlay" aria-hidden />
        <div className="legal-page__hero-content">
          <span className="legal-page__hero-badge">{blog.badge}</span>
          <h1 id="blog-heading" className="legal-page__hero-title">
            {blog.title}
          </h1>
          <p className="legal-page__hero-subtitle">{blog.hero.subtitle}</p>
        </div>
      </header>

      <div className="legal-page__inner">
        <div className="blog-page__list">
          {blog.posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="blog-page__card"
            >
              <h2 className="blog-page__card-title">{post.title}</h2>
              <p className="legal-page__text">{getPostExcerpt(post)}</p>
              <span className="legal-page__link">Read Article</span>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
