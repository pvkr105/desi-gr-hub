export function PageHeader({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="gradient-text">{title}</span>
      </h1>
      {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
    </div>
  );
}
