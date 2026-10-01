export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

type HeadingTag = "h2" | "h3";

import Image from "next/image";

export function ContentBlockContent({
  block,
  headingTag: HeadingTag = "h3",
}: {
  block: ContentBlock;
  headingTag?: HeadingTag;
}) {
  switch (block.type) {
    case "heading":
      return (
        <HeadingTag className="careers-page__group-title">
          {block.text}
        </HeadingTag>
      );
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
    case "image":
      return (
        <figure className="legal-page__figure">
          <Image
            src={block.src}
            alt={block.alt}
            width={1200}
            height={750}
            unoptimized
            className="legal-page__figure-image"
          />
          {block.caption && (
            <figcaption className="legal-page__figure-caption">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}
