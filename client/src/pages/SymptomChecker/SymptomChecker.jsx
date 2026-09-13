import { useState } from 'react';
import { apiFetch } from '../../api/client';

const URGENCY_STYLES = {
  high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
};

export default function SymptomChecker() {
  const [input, setInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function addSymptom(event) {
    event.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
    }
    setInput('');
  }

  function removeSymptom(symptom) {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  }

  async function handleAnalyze() {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom before analyzing.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const data = await apiFetch('/symptom-check', { method: 'POST', body: { symptoms } });
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-brand-700 dark:text-brand-400">Symptom Checker</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
        What's going on?
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        This is a demo tool, not a medical diagnosis. Consult a healthcare professional for real
        concerns.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <form onSubmit={addSymptom} className="mb-4 flex gap-2">
          <label htmlFor="symptom-input" className="sr-only">
            Add a symptom
          </label>
          <input
            id="symptom-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. headache"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Add
          </button>
        </form>

        <ul className="mb-6 flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <li
              key={symptom}
              className="flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-800 dark:bg-brand-900/40 dark:text-brand-200"
            >
              {symptom}
              <button
                type="button"
                onClick={() => removeSymptom(symptom)}
                aria-label={`Remove ${symptom}`}
                className="text-brand-600 hover:text-brand-900 dark:text-brand-300"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full rounded-lg bg-brand-700 px-6 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60 sm:w-auto"
        >
          {isAnalyzing ? 'Analyzing…' : 'Analyze Symptoms'}
        </button>
      </div>

      {results && (
        <ul className="mt-8 space-y-3">
          {results.map((result) => (
            <li
              key={result.condition}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-semibold capitalize text-slate-900 dark:text-white">
                  {result.condition}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    URGENCY_STYLES[result.urgency] || URGENCY_STYLES.low
                  }`}
                >
                  {result.urgency} urgency
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {result.probability}% match
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
