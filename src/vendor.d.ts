// index.html が先に読み込む jQuery プラグインのうち、 src/ が使う API だけを宣言します。

type StellarOptions = {
  responsive?: boolean;
  parallaxBackgrounds?: boolean;
  parallaxElements?: boolean;
  horizontalScrolling?: boolean;
  hideDistantElements?: boolean;
  scrollProperty?: 'scroll' | 'position' | 'margin' | 'transform';
  horizontalOffset?: number;
  verticalOffset?: number;
};

type OwlCarouselResponsiveOptions = {
  items?: number;
  stagePadding?: number;
};

type OwlCarouselOptions = OwlCarouselResponsiveOptions & {
  autoplay?: boolean;
  center?: boolean;
  loop?: boolean;
  margin?: number;
  nav?: boolean;
  navText?: [string, string];
  responsive?: Record<number, OwlCarouselResponsiveOptions>;
};

type MagnificPopupOptions = {
  type?: 'image' | 'iframe' | 'inline' | 'ajax';
  disableOn?: number;
  closeOnContentClick?: boolean;
  closeBtnInside?: boolean;
  fixedContentPos?: boolean;
  mainClass?: string;
  removalDelay?: number;
  preloader?: boolean;
  gallery?: { enabled?: boolean; navigateByImgClick?: boolean; preload?: [number, number] };
  image?: { verticalFit?: boolean };
  zoom?: { enabled?: boolean; duration?: number };
};

type AnimateNumberStep = (now: number, tween: object) => void;

interface Waypoint {
  element: HTMLElement;
}

interface JQuery<TElement = HTMLElement> {
  stellar(options?: StellarOptions): this;
  owlCarousel(options?: OwlCarouselOptions): this;
  magnificPopup(options?: MagnificPopupOptions): this;
  waypoint(
    handler: (this: Waypoint, direction: 'up' | 'down') => void,
    options?: { offset?: string | number },
  ): Waypoint[];
  animateNumber(options: { number: number; numberStep?: AnimateNumberStep }, duration?: number): this;
}

interface JQueryStatic {
  Scrollax(): void;
  animateNumber: {
    numberStepFactories: {
      separator(separator: string): AnimateNumberStep;
    };
  };
}
