/** Visible FAQ answers may use [label](/path) for in-site links. Schema text stays plain. */
export function faqAnswerParts(answer: string): { text: string; href?: string }[] {
  const parts = answer.split(/(\[[^\]]+\]\([^)]+\))/g).filter((part) => part.length > 0);
  return parts.map((part) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match || !match[2].startsWith("/")) return { text: part };
    return { text: match[1], href: match[2] };
  });
}

export function plainFaqAnswer(answer: string): string {
  return faqAnswerParts(answer)
    .map((part) => part.text)
    .join("");
}
