import { filterDoctors, parseExperienceYears, parseFeeAmount, sortDoctors } from './doctorFilters';

const DOCTORS = [
  { name: 'Dr. Sarah Johnson', specialty: 'cardiology', specialties: ['Cardiology'], rating: 4.9, experience: '15 years', fee: '$150', availability: 'Available Today' },
  { name: 'Dr. James Patel', specialty: 'general practice', specialties: ['General Practice'], rating: 4.6, experience: '8 years', fee: '$80', availability: 'Available Today' },
  { name: 'Dr. Olivia Turner', specialty: 'neurology', specialties: ['Neurology'], rating: 4.7, experience: '14 years', fee: '$170', availability: 'Available This Week' },
];

describe('parseExperienceYears', () => {
  it('extracts the leading number of years', () => {
    expect(parseExperienceYears('15 years')).toBe(15);
    expect(parseExperienceYears('')).toBe(0);
    expect(parseExperienceYears(undefined)).toBe(0);
  });
});

describe('parseFeeAmount', () => {
  it('extracts the numeric fee', () => {
    expect(parseFeeAmount('$150')).toBe(150);
    expect(parseFeeAmount('')).toBe(0);
  });
});

describe('sortDoctors', () => {
  it('sorts by rating descending for recommended and rating', () => {
    const sorted = sortDoctors(DOCTORS, 'rating');
    expect(sorted.map((d) => d.name)).toEqual([
      'Dr. Sarah Johnson',
      'Dr. Olivia Turner',
      'Dr. James Patel',
    ]);
  });

  it('sorts by experience descending', () => {
    const sorted = sortDoctors(DOCTORS, 'experience');
    expect(sorted[0].name).toBe('Dr. Sarah Johnson');
    expect(sorted[2].name).toBe('Dr. James Patel');
  });

  it('sorts by fee ascending', () => {
    const sorted = sortDoctors(DOCTORS, 'fee');
    expect(sorted.map((d) => d.fee)).toEqual(['$80', '$150', '$170']);
  });

  it('does not mutate the original array', () => {
    const copy = [...DOCTORS];
    sortDoctors(DOCTORS, 'fee');
    expect(DOCTORS).toEqual(copy);
  });
});

describe('filterDoctors', () => {
  const baseFilters = { search: '', specialty: '', availability: '', experience: '', fee: '' };

  it('filters by search across name and specialty', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, search: 'neuro' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. Olivia Turner');
  });

  it('filters by specialty', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, specialty: 'cardiology' });
    expect(result).toHaveLength(1);
  });

  it('filters by availability', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, availability: 'Available This Week' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. Olivia Turner');
  });

  it('filters by experience range', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, experience: 'under-5' });
    expect(result).toHaveLength(0);
  });

  it('filters by fee range', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, fee: 'under-100' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. James Patel');
  });

  it('combines multiple filters', () => {
    const result = filterDoctors(DOCTORS, {
      ...baseFilters,
      availability: 'Available Today',
      fee: 'under-100',
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. James Patel');
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterDoctors(DOCTORS, { ...baseFilters, search: 'zzz-no-match' });
    expect(result).toHaveLength(0);
  });
});
