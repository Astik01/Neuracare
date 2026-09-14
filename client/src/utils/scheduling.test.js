import {
  buildAppointmentDate,
  buildAppointmentICS,
  formatDisplayDate,
  generateUpcomingSlots,
  getTodayISO,
} from './scheduling';

describe('getTodayISO', () => {
  it('returns an ISO-formatted date string', () => {
    expect(getTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('generateUpcomingSlots', () => {
  it('labels the first two days as Today and Tomorrow', () => {
    const days = generateUpcomingSlots(3);
    expect(days).toHaveLength(3);
    expect(days[0].label).toBe('Today');
    expect(days[1].label).toBe('Tomorrow');
    expect(days[0].times.length).toBeGreaterThan(0);
  });

  it('marks slots as taken when they match already-booked date/time pairs', () => {
    const today = generateUpcomingSlots(1)[0];
    const takenTime = today.times[0].time;
    const days = generateUpcomingSlots(1, [{ date: today.date, time: takenTime }]);

    expect(days[0].times.find((slot) => slot.time === takenTime).taken).toBe(true);
    expect(days[0].times.find((slot) => slot.time !== takenTime).taken).toBe(false);
  });
});

describe('formatDisplayDate', () => {
  it('formats an ISO date into a readable string', () => {
    expect(formatDisplayDate('2026-03-05')).toContain('2026');
    expect(formatDisplayDate('2026-03-05')).toContain('March');
  });

  it('returns an empty string for no input', () => {
    expect(formatDisplayDate('')).toBe('');
  });
});

describe('buildAppointmentDate', () => {
  it('parses a 12-hour time string into a Date', () => {
    const date = buildAppointmentDate('2026-03-05', '02:00 PM');
    expect(date.getHours()).toBe(14);
    expect(date.getMinutes()).toBe(0);
    expect(date.getFullYear()).toBe(2026);
  });

  it('handles AM correctly including 12 AM', () => {
    const date = buildAppointmentDate('2026-03-05', '12:00 AM');
    expect(date.getHours()).toBe(0);
  });

  it('returns null for unparseable input', () => {
    expect(buildAppointmentDate('', '')).toBeNull();
    expect(buildAppointmentDate('2026-03-05', 'not-a-time')).toBeNull();
  });
});

describe('buildAppointmentICS', () => {
  it('produces a valid-looking ICS document', () => {
    const ics = buildAppointmentICS({
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2026-03-05',
      time: '09:00 AM',
    });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('SUMMARY:Appointment with Dr. Sarah Johnson');
    expect(ics).toContain('DTSTART:');
  });

  it('does not crash when date/time cannot be parsed', () => {
    const ics = buildAppointmentICS({ doctorName: 'Dr. Sarah Johnson', date: '', time: '' });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).not.toContain('DTSTART:');
  });
});
