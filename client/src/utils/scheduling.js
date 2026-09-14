const DAY_TIMES = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function labelForOffset(offset, date) {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getTodayISO() {
  return formatDateISO(new Date());
}

export function generateUpcomingSlots(daysCount = 6, alreadyTaken = []) {
  const takenSet = new Set(alreadyTaken.map(({ date, time }) => `${date}|${time}`));
  const days = [];
  const now = new Date();

  for (let offset = 0; offset < daysCount; offset += 1) {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    const isoDate = formatDateISO(date);

    days.push({
      date: isoDate,
      label: labelForOffset(offset, date),
      times: DAY_TIMES.map((time) => ({ time, taken: takenSet.has(`${isoDate}|${time}`) })),
    });
  }

  return days;
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function parseTimeTo24Hour(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((time || '').trim());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

export function buildAppointmentDate(isoDate, time) {
  const [year, month, day] = (isoDate || '').split('-').map(Number);
  const parsedTime = parseTimeTo24Hour(time);
  if (!year || !month || !day || !parsedTime) return null;
  return new Date(year, month - 1, day, parsedTime.hours, parsedTime.minutes);
}

function toICSDate(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

export function buildAppointmentICS({ doctorName, specialty, date, time, durationMinutes = 30 }) {
  const start = buildAppointmentDate(date, time);
  const end = start ? new Date(start.getTime() + durationMinutes * 60000) : null;
  const now = new Date();

  const summary = `Appointment with ${doctorName || 'your doctor'}`;
  const description = specialty
    ? `Neuracare appointment — ${specialty}`
    : 'Neuracare appointment';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Neuracare//Appointment//EN',
    'BEGIN:VEVENT',
    `UID:${now.getTime()}@neuracare`,
    `DTSTAMP:${toICSDate(now)}`,
    start ? `DTSTART:${toICSDate(start)}` : null,
    end ? `DTEND:${toICSDate(end)}` : null,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function downloadICS(icsContent, filename = 'neuracare-appointment.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
