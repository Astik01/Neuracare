const {
  generate_user,
  generate_invalid_user,
  generate_doctor,
  generate_booking_payload,
  generate_contact_payload,
  generate_random_payload,
} = require('./index');

describe('test-data generators', () => {
  it('generate_user produces unique, valid-shaped users', () => {
    const a = generate_user();
    const b = generate_user();

    expect(a.email).not.toBe(b.email);
    expect(a).toMatchObject({
      name: expect.any(String),
      email: expect.stringContaining('@'),
      password: expect.any(String),
    });
  });

  it('generate_user accepts overrides', () => {
    const user = generate_user({ email: 'fixed@example.com' });
    expect(user.email).toBe('fixed@example.com');
  });

  it('generate_invalid_user omits the requested field', () => {
    const user = generate_invalid_user('password');
    expect(user.password).toBeUndefined();
    expect(user.name).toEqual(expect.any(String));
  });

  it('generate_doctor produces a valid-shaped doctor', () => {
    const doctor = generate_doctor({ specialty: 'dermatology' });
    expect(doctor.specialty).toBe('dermatology');
    expect(doctor.rating).toEqual(expect.any(Number));
  });

  it('generate_booking_payload wires in the given doctorId', () => {
    const payload = generate_booking_payload('doctor-id-123');
    expect(payload.doctorId).toBe('doctor-id-123');
    expect(payload.date).toEqual(expect.any(String));
  });

  it('generate_contact_payload produces unique valid-shaped contacts', () => {
    const a = generate_contact_payload();
    const b = generate_contact_payload();
    expect(a.email).not.toBe(b.email);
  });

  it('generate_random_payload fills fields according to the requested shape', () => {
    const payload = generate_random_payload({ name: 'string', age: 'number', active: 'boolean' });
    expect(typeof payload.name).toBe('string');
    expect(typeof payload.age).toBe('number');
    expect(typeof payload.active).toBe('boolean');
  });
});
