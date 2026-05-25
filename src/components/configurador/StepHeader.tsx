export function StepHeader({
  question,
  helper,
}: {
  question: string;
  helper: string;
}) {
  return (
    <header className="mb-8">
      <h2 className="mb-3 font-serif text-3xl leading-[1.15] text-green-deep sm:text-[32px]">
        {question}
      </h2>
      <p className="font-sans text-sm leading-[1.6] text-ink-soft">{helper}</p>
    </header>
  );
}
