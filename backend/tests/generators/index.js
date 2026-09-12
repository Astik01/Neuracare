let counter = 0;
function unique() {
  counter += 1;
  return `${Date.now()}${counter}`;
}

function generate_user(overrides = {}) {
  const id = unique();
  return {
    name: `Test User ${id}`,
    email: `user${id}@example.com`,
    password: 'password123',
    ...overrides,
  };
}

function generate_invalid_user(missingField = 'email') {
  const user = generate_user();
  delete user[missingField];
  return user;
}

function generate_doctor(overrides = {}) {
  const id = unique();
  return {
    name: `Dr. Test ${id}`,
    specialty: 'cardiology',
    specialties: ['Cardiology'],
    rating: 4.5,
    experience: '10 years',
    fee: '$100',
    availability: 'Available',
    ...overrides,
  };
}

function generate_booking_payload(doctorId, overrides = {}) {
  return {
    doctorId,
    date: '2026-01-01',
    time: '10:00',
    reason: 'Routine checkup',
    ...overrides,
  };
}

function generate_contact_payload(overrides = {}) {
  const id = unique();
  return {
    name: `Test Contact ${id}`,
    email: `contact${id}@example.com`,
    subject: 'General question',
    message: 'This is a generated test message.',
    ...overrides,
  };
}

function generate_random_payload(shape = {}) {
  const randomValueFor = (type) => {
    switch (type) {
      case 'string':
        return `random-${unique()}`;
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  };

  return Object.fromEntries(
    Object.entries(shape).map(([key, type]) => [key, randomValueFor(type)]),
  );
}

module.exports = {
  generate_user,
  generate_invalid_user,
  generate_doctor,
  generate_booking_payload,
  generate_contact_payload,
  generate_random_payload,
};
