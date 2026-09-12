import { getBotReply } from './botReply';

describe('getBotReply', () => {
  it('matches a known keyword regardless of case', () => {
    const reply = getBotReply('I have a HEADACHE');
    expect(reply.condition).toMatch(/tension headache|migraine/i);
  });

  it('matches "chest pain" as a phrase', () => {
    const reply = getBotReply('I have chest pain');
    expect(reply.condition).toMatch(/chest pain/i);
  });

  it('falls back to a general reply for unmatched input', () => {
    const reply = getBotReply('something unrelated entirely');
    expect(reply.condition).toBe('General health concern');
  });

  it('falls back to a general reply for empty input', () => {
    const reply = getBotReply('');
    expect(reply.condition).toBe('General health concern');
  });
});
