interface QuickAnswerTLDRProps {
  quickAnswer: {
    tldr: string;
    winner?: string | null;
    confidence?: number | null;
    reasoning?: string | null;
  };
  entityA: { name: string; imageUrl?: string | null };
  entityB: { name: string; imageUrl?: string | null };
}

export function QuickAnswerTLDR({ quickAnswer, entityA, entityB }: QuickAnswerTLDRProps) {
  const winner = quickAnswer.winner;
  const winnerName = winner === "A" ? entityA.name : winner === "B" ? entityB.name : null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">⚡</span>
          <div>
            <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2">
              Quick Answer
            </h2>
            <p className="text-text text-base leading-relaxed">{quickAnswer.tldr}</p>
            {winnerName && quickAnswer.confidence && (
              <p className="mt-2 text-sm text-text-secondary">
                <span className="font-semibold text-text">{winnerName}</span> leads with{" "}
                {Math.round(quickAnswer.confidence * 100)}% confidence.
              </p>
            )}
            {quickAnswer.reasoning && (
              <p className="mt-2 text-sm text-text-secondary italic">{quickAnswer.reasoning}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
