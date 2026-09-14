export default function ErrorState({
  message = "Something went wrong. We couldn't load this information right now.",
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-900/20"
    >
      <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-red-700 px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-red-800"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
