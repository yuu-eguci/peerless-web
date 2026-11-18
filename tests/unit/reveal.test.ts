import { describe, expect, test } from 'vitest';
import { revealEffect } from '../../src/reveal.ts';

describe('revealEffect', () => {
  test.each(['fadeIn', 'fadeInLeft', 'fadeInRight'])('%s を指定するとその効果を返します', (effect) => {
    expect(revealEffect(effect)).toBe(effect);
  });

  test.each([undefined, '', 'zoomIn', 1])('%s を指定すると fadeInUp を返します', (effect) => {
    expect(revealEffect(effect)).toBe('fadeInUp');
  });
});
