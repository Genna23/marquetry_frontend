import { renderRichText } from "@storyblok/astro";

export function renderRichTextWithSpan(content) {
  if (!content) return "";
  if (typeof content === "string") return `<span>${content}</span>`;

  let html = renderRichText(content);
  html = html.replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>");
  html = html.replace(
    /<u>(.*?)<\/u>/g,
    (_, inner) => {
      return inner.replace(
        /<span style="color: (#[0-9A-Fa-f]{3,6})">(.*?)<\/span>/g,
        '<span style="color: $1; text-decoration: underline;">$2</span>'
      );
    }
  );

  return html;
}
