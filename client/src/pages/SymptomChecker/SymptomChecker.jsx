import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';

const STEPS = ['Symptoms', 'Details', 'Analysis'];

const DURATION_OPTIONS = [
  { value: 'less-than-a-day', label: 'Less than a day' },
  { value: '1-3-days', label: '1–3 days' },
  { value: '4-7-days', label: '4–7 days' },
  { value: 'more-than-a-week', label: 'More than a week' },
];

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
];

const RECURRING_OPTIONS = [
  { value: 'no', label: 'No, first time' },
  { value: 'yes', label: 'Yes, it recurs' },
];

const ANALYSIS_CHECKLIST = ['Processing symptoms', 'Comparing patterns', 'Preparing recommendations'];
const ANALYSIS_STEP_DELAY = 220;
const ANALYSIS_MIN_DURATION = 500;

function RadioPillGroup({ legend, name, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                isSelected
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function StepIndicator({ step }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === step;
        const isDone = stepNumber < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                isCurrent
                  ? 'bg-brand-700 text-white'
                  : isDone
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {isDone ? '✓' : stepNumber}
            </span>
            <span className={isCurrent ? 'text-slate-900 dark:text-white' : ''}>{label}</span>
            {stepNumber < STEPS.length && <span className="mx-1 h-px w-4 bg-slate-200 dark:bg-slate-700" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function SymptomChecker() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [symptomError, setSymptomError] = useState(null);
  const [duration, setDuration] = useState(DURATION_OPTIONS[0].value);
  const [severity, setSeverity] = useState(SEVERITY_OPTIONS[0].value);
  const [recurring, setRecurring] = useState(RECURRING_OPTIONS[0].value);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function addSymptom(event) {
    event.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      setSymptomError('Please enter a symptom before adding it.');
      return;
    }
    if (symptoms.includes(trimmed)) {
      setSymptomError('That symptom has already been added.');
      setInput('');
      return;
    }
    setSymptoms([...symptoms, trimmed]);
    setSymptomError(null);
    setInput('');
  }

  function removeSymptom(symptom) {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  }

  function goToDetails() {
    if (symptoms.length === 0) {
      setSymptomError('Please add at least one symptom before continuing.');
      return;
    }
    setSymptomError(null);
    setStep(2);
  }

  async function handleAnalyze() {
    setError(null);
    setStep(3);
    setAnalysisIndex(0);

    timers.current.push(setTimeout(() => setAnalysisIndex(1), ANALYSIS_STEP_DELAY));
    timers.current.push(setTimeout(() => setAnalysisIndex(2), ANALYSIS_STEP_DELAY * 2));

    const startedAt = Date.now();
    try {
      const data = await apiFetch('/symptom-check', { method: 'POST', body: { symptoms } });
      const elapsed = Date.now() - startedAt;
      if (elapsed < ANALYSIS_MIN_DURATION) {
        await new Promise((resolve) => {
          timers.current.push(setTimeout(resolve, ANALYSIS_MIN_DURATION - elapsed));
        });
      }
      navigate('/symptom-checker/results', {
        state: { results: data.results, symptoms, duration, severity, recurring },
      });
    } catch (err) {
      setError(err.message);
      setStep(2);
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

      <div className="mt-6">
        <StepIndicator step={step} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        {step === 1 && (
          <>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              What symptoms are you experiencing?
            </h2>
            <form onSubmit={addSymptom} className="mb-4 mt-4 flex gap-2">
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

            <ul className="mb-2 flex flex-wrap gap-2">
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

            {symptomError && (
              <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
                {symptomError}
              </p>
            )}

            <button
              type="button"
              onClick={goToDetails}
              className="mt-4 w-full rounded-lg bg-brand-700 px-6 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 sm:w-auto"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              A bit more detail
            </h2>
            <div className="mt-4 space-y-5">
              <RadioPillGroup
                legend="How long have you had these symptoms?"
                name="duration"
                options={DURATION_OPTIONS}
                value={duration}
                onChange={setDuration}
              />
              <RadioPillGroup
                legend="How severe would you say it is?"
                name="severity"
                options={SEVERITY_OPTIONS}
                value={severity}
                onChange={setSeverity}
              />
              <RadioPillGroup
                legend="Is this recurring?"
                name="recurring"
                options={RECURRING_OPTIONS}
                value={recurring}
                onChange={setRecurring}
              />
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg bg-slate-100 px-6 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                className="rounded-lg bg-brand-700 px-6 py-2.5 font-medium text-white shadow-soft transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500"
              >
                Analyze Symptoms
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-4">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Analyzing your symptoms…
            </h2>
            <ul className="mt-6 space-y-4">
              {ANALYSIS_CHECKLIST.map((label, index) => {
                const isDone = index < analysisIndex;
                const isCurrent = index === analysisIndex;
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isDone
                          ? 'bg-brand-600 text-white'
                          : isCurrent
                            ? 'animate-pulse bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : index + 1}
                    </span>
                    <span
                      className={`text-sm ${
                        isDone || isCurrent
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
