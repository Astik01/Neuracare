import { useMemo, useState } from 'react';
import { generateUpcomingSlots } from '../utils/scheduling';

export default function SlotPicker({ daysCount = 6, alreadyTaken = [], selected, onSelect }) {
  const days = useMemo(() => generateUpcomingSlots(daysCount, alreadyTaken), [daysCount, alreadyTaken]);
  const [activeDayIndex, setActiveDayIndex] = useState(() => {
    if (!selected) return 0;
    const index = days.findIndex((day) => day.date === selected.date);
    return index === -1 ? 0 : index;
  });
  const activeDay = days[activeDayIndex];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a day"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {days.map((day, index) => (
          <button
            key={day.date}
            type="button"
            role="tab"
            aria-selected={index === activeDayIndex}
            onClick={() => setActiveDayIndex(index)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              index === activeDayIndex
                ? 'bg-brand-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4 flex flex-wrap gap-2">
        {activeDay.times.map((slot) => {
          const isSelected = selected?.date === activeDay.date && selected?.time === slot.time;
          return (
            <button
              key={slot.time}
              type="button"
              disabled={slot.taken}
              onClick={() => onSelect({ date: activeDay.date, time: slot.time })}
              className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                slot.taken
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300 line-through dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600'
                  : isSelected
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
