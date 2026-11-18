export type NavbarState = {
  scrolled: boolean;
  awake: boolean;
  sleep: boolean;
};

const SCROLLED_OFFSET = 750;
const AWAKE_OFFSET = 800;

/**
 * スクロール位置からナビゲーションバーの次の状態を求めます。
 * 境界ちょうどの位置では状態を変えません。
 */
export const nextNavbarState = (scrollTop: number, state: NavbarState): NavbarState => {
  const next = { ...state };
  if (scrollTop > SCROLLED_OFFSET) {
    next.scrolled = true;
  }
  if (scrollTop < SCROLLED_OFFSET && next.scrolled) {
    next.scrolled = false;
    next.sleep = false;
  }
  if (scrollTop > AWAKE_OFFSET) {
    next.awake = true;
  }
  if (scrollTop < AWAKE_OFFSET && next.awake) {
    next.awake = false;
    next.sleep = true;
  }
  return next;
};
