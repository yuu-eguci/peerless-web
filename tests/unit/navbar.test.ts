import { describe, expect, test } from 'vitest';
import { nextNavbarState, type NavbarState } from '../../src/navbar.ts';

const top: NavbarState = { scrolled: false, awake: false, sleep: false };

describe('nextNavbarState', () => {
  test('750px 以下では状態を変えません', () => {
    expect(nextNavbarState(0, top)).toEqual(top);
    expect(nextNavbarState(750, top)).toEqual(top);
  });

  test('750px を超えると scrolled になります', () => {
    expect(nextNavbarState(751, top)).toEqual({ scrolled: true, awake: false, sleep: false });
  });

  test('800px を超えると awake になります', () => {
    expect(nextNavbarState(801, top)).toEqual({ scrolled: true, awake: true, sleep: false });
  });

  test('awake から 800px 未満へ戻ると sleep になります', () => {
    const awake: NavbarState = { scrolled: true, awake: true, sleep: false };
    expect(nextNavbarState(780, awake)).toEqual({ scrolled: true, awake: false, sleep: true });
  });

  test('750px 未満へ戻ると scrolled を外し、 awake だった場合は sleep になります', () => {
    expect(nextNavbarState(0, { scrolled: true, awake: true, sleep: false })).toEqual({
      scrolled: false,
      awake: false,
      sleep: true,
    });
    expect(nextNavbarState(0, { scrolled: true, awake: false, sleep: true })).toEqual(top);
  });
});
