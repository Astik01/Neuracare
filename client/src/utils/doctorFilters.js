export function parseExperienceYears(experience) {
  const match = /\d+/.exec(experience || '');
  return match ? Number(match[0]) : 0;
}

export function parseFeeAmount(fee) {
  const match = /\d+/.exec(fee || '');
  return match ? Number(match[0]) : 0;
}

export const EXPERIENCE_RANGES = [
  { value: 'under-5', label: 'Under 5 years', test: (years) => years < 5 },
  { value: '5-10', label: '5–10 years', test: (years) => years >= 5 && years < 10 },
  { value: '10-15', label: '10–15 years', test: (years) => years >= 10 && years < 15 },
  { value: '15-plus', label: '15+ years', test: (years) => years >= 15 },
];

export const FEE_RANGES = [
  { value: 'under-100', label: 'Under $100', test: (fee) => fee < 100 },
  { value: '100-150', label: '$100–$150', test: (fee) => fee >= 100 && fee <= 150 },
  { value: 'over-150', label: 'Over $150', test: (fee) => fee > 150 },
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'experience', label: 'Experience: Most to Least' },
  { value: 'fee', label: 'Fee: Low to High' },
];

export function sortDoctors(doctors, sortBy) {
  const sorted = [...doctors];
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'experience':
      return sorted.sort((a, b) => parseExperienceYears(b.experience) - parseExperienceYears(a.experience));
    case 'fee':
      return sorted.sort((a, b) => parseFeeAmount(a.fee) - parseFeeAmount(b.fee));
    case 'recommended':
    default:
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
}

export function filterDoctors(doctors, { search, specialty, availability, experience, fee }) {
  const query = search.trim().toLowerCase();

  return doctors.filter((doctor) => {
    if (query) {
      const haystack = [doctor.name, doctor.specialty, ...(doctor.specialties || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (specialty && doctor.specialty !== specialty) return false;

    if (availability && doctor.availability !== availability) return false;

    if (experience) {
      const range = EXPERIENCE_RANGES.find((r) => r.value === experience);
      if (range && !range.test(parseExperienceYears(doctor.experience))) return false;
    }

    if (fee) {
      const range = FEE_RANGES.find((r) => r.value === fee);
      if (range && !range.test(parseFeeAmount(doctor.fee))) return false;
    }

    return true;
  });
}
