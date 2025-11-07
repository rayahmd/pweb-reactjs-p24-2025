interface StateMessageProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function LoadingState({ title, description }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-3 flex justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      ) : null}
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
