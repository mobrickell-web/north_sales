import Image from "next/image";
import Link from "next/link";

import { BlogPostCta } from "@/components/legal/blog-post-cta";
import { ContentBlockContent } from "@/components/legal/content-blocks";
import { blog, type BlogPost } from "@/config/blog";

export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <article
      className="legal-page blog-page"
      aria-labelledby="blog-post-heading"
    >
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
          <h1
            id="blog-post-heading"
            className="legal-page__hero-title blog-page__post-title"
          >
            {post.title}
          </h1>
          <p className="legal-page__hero-subtitle">{blog.hero.subtitle}</p>
        </div>
      </header>

      <div className="legal-page__inner">
        <div className="legal-page__blocks">
          {post.blocks.map((block, index) => (
            <ContentBlockContent
              key={`${post.slug}-${block.type}-${index}`}
              block={block}
              headingTag="h2"
            />
          ))}
        </div>

        <div className="blog-page__conclusion">
          <p className="legal-page__text">{post.conclusion}</p>
        </div>

        <div className="blog-page__cta">
          <BlogPostCta text={post.cta} />
        </div>

        <p className="blog-page__back">
          <Link href="/blogs" className="legal-page__link">
            Back to all articles
          </Link>
        </p>
      </div>
    </article>
  );
}
