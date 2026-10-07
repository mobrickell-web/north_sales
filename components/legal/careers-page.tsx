import Image from "next/image";

import { ContentBlockContent } from "@/components/legal/content-blocks";
import { siteConfig } from "@/config/site";

export function CareersPage() {
  const { careers } = siteConfig;

  return (
    <article
      className="legal-page careers-page"
      aria-labelledby="careers-heading"
    >
      <header className="legal-page__hero">
        <Image
          src={careers.hero.image.src}
          alt={careers.hero.image.alt}
          fill
          priority
          unoptimized
          className="legal-page__hero-image"
          sizes="100vw"
        />
        <div className="legal-page__hero-overlay" aria-hidden />
        <div className="legal-page__hero-content">
          <span className="legal-page__hero-badge">{careers.badge}</span>
          <h1 id="careers-heading" className="legal-page__hero-title">
            {careers.title}
          </h1>
          <p className="legal-page__hero-subtitle">{careers.hero.subtitle}</p>
        </div>
      </header>

      <div className="legal-page__inner">
        <div className="legal-page__contact careers-page__notice">
          <p className="legal-page__contact-label">{careers.notice.title}</p>
          <p>{careers.notice.text}</p>
        </div>

        <div className="legal-page__intro">
          {careers.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="careers-page__roles">
          {careers.roles.map((role) => (
            <details
              key={role.id}
              id={role.id}
              name="careers-roles"
              className="careers-page__role group"
            >
              <summary className="careers-page__role-summary">
                <span
                  id={`${role.id}-title`}
                  className="careers-page__role-title"
                >
                  {role.title}
                </span>
                <span aria-hidden className="careers-page__role-icon">
                  +
                </span>
              </summary>

              <div className="careers-page__role-body">
                <p className="careers-page__income">{role.income}</p>
                <div className="legal-page__blocks careers-page__blocks">
                  {role.blocks.map((block, index) => (
                    <ContentBlockContent
                      key={`${role.id}-${block.type}-${index}`}
                      block={block}
                    />
                  ))}
                </div>
                <div className="careers-page__apply">
                  <p className="careers-page__group-title">
                    {careers.apply.title}
                  </p>
                  <p className="legal-page__text">
                    {careers.apply.text}{" "}
                    <a
                      href={`mailto:${careers.apply.email}`}
                      className="legal-page__link"
                    >
                      {careers.apply.email}
                    </a>
                    .
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>

        <section
          id={careers.closing.id}
          className="careers-page__closing"
          aria-labelledby={`${careers.closing.id}-title`}
        >
          <h2
            id={`${careers.closing.id}-title`}
            className="careers-page__closing-title"
          >
            {careers.closing.title}
          </h2>
          <div className="careers-page__closing-copy">
            {careers.closing.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
