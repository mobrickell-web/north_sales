import Image from "next/image";

import { siteConfig } from "@/config/site";

type PrivacyBlock =
  (typeof siteConfig.privacyPolicy.sections)[number]["blocks"][number];

function PrivacyBlockContent({ block }: { block: PrivacyBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="legal-page__text">{block.text}</p>;
    case "list":
      return (
        <ul className="legal-page__list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "email":
      return (
        <p className="legal-page__text">
          <a href={`mailto:${block.text}`} className="legal-page__link">
            {block.text}
          </a>
        </p>
      );
    case "contact":
      return (
        <div className="legal-page__contact">
          <p className="legal-page__contact-label">{block.company}</p>
          <p>
            Email:{" "}
            <a href={`mailto:${block.email}`} className="legal-page__link">
              {block.email}
            </a>
          </p>
          <p>
            Telephone:{" "}
            <a
              href={`tel:${block.phone.replace(/\D/g, "")}`}
              className="legal-page__link"
            >
              {block.phone}
            </a>
          </p>
        </div>
      );
    default:
      return null;
  }
}

export function PrivacyPolicyPage() {
  const { privacyPolicy } = siteConfig;

  return (
    <article className="legal-page" aria-labelledby="privacy-policy-heading">
      <header className="legal-page__hero">
        <Image
          src={privacyPolicy.hero.image.src}
          alt={privacyPolicy.hero.image.alt}
          fill
          priority
          unoptimized
          className="legal-page__hero-image"
          sizes="100vw"
        />
        <div className="legal-page__hero-overlay" aria-hidden />
        <div className="legal-page__hero-content">
          <span className="legal-page__hero-badge">{privacyPolicy.badge}</span>
          <h1 id="privacy-policy-heading" className="legal-page__hero-title">
            {privacyPolicy.title}
          </h1>
          <p className="legal-page__hero-subtitle">
            {privacyPolicy.hero.subtitle}
          </p>
        </div>
      </header>

      <div className="legal-page__inner">
        <div className="legal-page__intro">
          {privacyPolicy.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="legal-page__sections">
          {privacyPolicy.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="legal-page__section"
              aria-labelledby={`${section.id}-title`}
            >
              <h2
                id={`${section.id}-title`}
                className="legal-page__section-title"
              >
                {section.number}. {section.title}
              </h2>
              <div className="legal-page__blocks">
                {section.blocks.map((block, index) => (
                  <PrivacyBlockContent
                    key={`${section.id}-${block.type}-${index}`}
                    block={block}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
