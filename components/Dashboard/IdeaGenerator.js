import { useState } from "react";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";

/**
 * Minimal, accessible, and clear idea generation form.
 */
export default function IdeaGenerator({ onNewIdeas, quota, isPro }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a keyword or phrase.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        onNewIdeas(data.ideas);
        setPrompt("");
      } else {
        setError(data.error || "Failed to generate ideas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="flex flex-col gap-3 mb-8">
      <label className="font-semibold text-gray-700 dark:text-gray-200">
        Enter a keyword or sentence:
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900"
          placeholder="E.g. TikTok for plumbers"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? <Loader /> : "Generate"}
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      {!isPro && (
        <div className="text-xs text-gray-500 mt-1">
          Free users: {quota.limit - quota.used} ideas left today.
        </div>
      )}
    </form>
  );
}