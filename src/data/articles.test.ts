import { describe, expect, it } from "vitest";
import { ARTICLES } from "./articles";

describe("article publishing quality", () => {
  it("gives every guide substantial topic-focused structure and sources", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(10);
    for (const article of ARTICLES) {
      expect(article.title.length, article.slug).toBeGreaterThan(20);
      expect(article.description.length, article.slug).toBeGreaterThan(80);
      expect(article.intro.length, article.slug).toBeGreaterThanOrEqual(2);
      expect(article.keyTakeaways.length, article.slug).toBeGreaterThanOrEqual(4);
      expect(article.sections.length, article.slug).toBeGreaterThanOrEqual(4);
      expect(article.faqs.length, article.slug).toBeGreaterThanOrEqual(3);
      expect(article.sources.length, article.slug).toBeGreaterThanOrEqual(1);
      expect(
        article.sections.every(
          (section) => section.heading.length > 8 && section.paragraphs.length >= 2,
        ),
        article.slug,
      ).toBe(true);
    }
  });

  it("contains no assistant reasoning or drafting residue", () => {
    const publishedText = JSON.stringify(ARTICLES);
    const forbidden = [
      /\bas an ai\b/i,
      /\bchatgpt\b/i,
      /\blanguage model\b/i,
      /\bchain of thought\b/i,
      /\blet(?:'|’)s think\b/i,
      /\bmy reasoning\b/i,
      /\bprompt\b/i,
      /\bdraft note\b/i,
      /\beditorial note\b/i,
      /\bplaceholder\b/i,
      /\bTODO\b/,
    ];
    for (const pattern of forbidden) {
      expect(publishedText).not.toMatch(pattern);
    }
  });
});
