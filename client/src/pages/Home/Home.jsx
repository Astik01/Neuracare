import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">
        Your health, understood faster.
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Check your symptoms, find the right doctor, and book an appointment in minutes.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/symptom-checker"
          className="rounded bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
        >
          Check Symptoms
        </Link>
        <Link
          to="/find-doctors"
          className="rounded border border-teal-700 px-6 py-3 font-medium text-teal-700 hover:bg-teal-50"
        >
          Find a Doctor
        </Link>
      </div>
    </div>
  );
}
