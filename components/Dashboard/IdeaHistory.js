import { useState } from "react";

/**
 * Card-based idea history with copy-to-clipboard and quota display.
 */
export default function IdeaHistory({ ideas, quota, isPro }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  return (
    <section className="mt-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Generated Ideas</h2>
        {!isPro && (
          <span className="text-sm text-gray-500">Daily quota: {quota.used}/{quota.limit}</span>
        )}
      </div>
      {ideas.length === 0 && (
        <div className="rounded border bg-blue-50 px-4 py-8 text-center text-blue-400 mt-8">
          No ideas generated yet.
        </div>
      )}
      <ul className="grid gap-4">
        {ideas.map((idea) => (
          <li key={idea.id} className="bg-white dark:bg-gray-800 rounded shadow p-5 flex flex-col gap-2">
            <div className="font-semibold text-blue-700 dark:text-blue-200">{idea.prompt}</div>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-100">{idea.ideas}</div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>{new Date(idea.createdAt).toLocaleString()}</span>
              <button
                onClick={() => handleCopy(idea.id, idea.ideas)}
                className={`transition px-2 py-1 rounded ${copiedId === idea.id ? "bg-green-100 text-green-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                aria-label="Copy idea"
              >
                {copiedId === idea.id ? "Copied!" : "Copy"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}