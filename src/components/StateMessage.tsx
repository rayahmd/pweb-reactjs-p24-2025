interface StateMessageProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function LoadingState({ title, description }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 flex justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-400 opacity-75"></div>
          <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        </div>
      </div>
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
      <div className="mt-4 flex justify-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: "0ms" }}></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: "150ms" }}></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: "300ms" }}></span>
      </div>
    </div>
  );
}

export function ErrorState({ title, description, action }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-center text-rose-800">
      <p className="text-lg font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600">
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {description ? <p className="mt-1 text-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
