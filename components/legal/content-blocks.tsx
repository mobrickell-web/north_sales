export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] };

type HeadingTag = "h2" | "h3";

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
    default:
      return null;
  }
}
