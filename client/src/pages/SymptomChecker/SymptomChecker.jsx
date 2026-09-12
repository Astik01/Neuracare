import { useState } from 'react';
import { apiFetch } from '../../api/client';

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Symptom Checker</h1>
      <p className="text-slate-600 mb-6">
        This is a demo tool, not a medical diagnosis. Consult a healthcare professional for real
        concerns.
      </p>

      <form onSubmit={addSymptom} className="flex gap-2 mb-4">
        <label htmlFor="symptom-input" className="sr-only">
          Add a symptom
        </label>
        <input
          id="symptom-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. headache"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-slate-100 px-4 py-2 hover:bg-slate-200">
          Add
        </button>
      </form>

      <ul className="flex flex-wrap gap-2 mb-6">
        {symptoms.map((symptom) => (
          <li
            key={symptom}
            className="flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800"
          >
            {symptom}
            <button
              type="button"
              onClick={() => removeSymptom(symptom)}
              aria-label={`Remove ${symptom}`}
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
        className="rounded bg-teal-700 px-6 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {isAnalyzing ? 'Analyzing…' : 'Analyze Symptoms'}
      </button>

      {results && (
        <ul className="mt-8 space-y-3">
          {results.map((result) => (
            <li
              key={result.condition}
              className="rounded border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">{result.condition}</p>
              <p className="text-sm text-slate-600">
                {result.probability}% match · {result.urgency} urgency
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
