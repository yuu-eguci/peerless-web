export type RevealEffect = 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'fadeInUp';

/**
 * `data-animate-effect` の値から表示時のアニメーションを選びます。
 * 未指定や未知の値では `fadeInUp` を使います。
 */
export const revealEffect = (effect: unknown): RevealEffect =>
  effect === 'fadeIn' || effect === 'fadeInLeft' || effect === 'fadeInRight' ? effect : 'fadeInUp';
