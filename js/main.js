"use strict";
(() => {
  // src/navbar.ts
  var SCROLLED_OFFSET = 750;
  var AWAKE_OFFSET = 800;
  var nextNavbarState = (scrollTop, state) => {
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

  // src/reveal.ts
  var revealEffect = (effect) => effect === "fadeIn" || effect === "fadeInLeft" || effect === "fadeInRight" ? effect : "fadeInUp";

  // src/main.ts
  var $ = jQuery;
  var $window = $(window);
  $window.stellar({
    responsive: false,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: true,
    scrollProperty: "scroll",
    horizontalOffset: 0,
    verticalOffset: 0
  });
  var fitFullHeight = () => {
    $(".js-fullheight").css("height", $window.height() ?? 0);
  };
  fitFullHeight();
  $window.on("resize", fitFullHeight);
  setTimeout(() => {
    $("#prls-loader").removeClass("show");
  }, 1);
  $.Scrollax();
  $(".carousel-work").owlCarousel({
    autoplay: true,
    center: true,
    loop: true,
    items: 1,
    margin: 30,
    stagePadding: 0,
    nav: true,
    navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
    responsive: {
      0: { items: 1, stagePadding: 0 },
      600: { items: 2, stagePadding: 50 },
      1e3: { items: 3, stagePadding: 100 }
    }
  });
  $("nav .dropdown").on("mouseenter", function() {
    const $this = $(this);
    $this.addClass("show");
    $this.find("> a").attr("aria-expanded", "true");
    $this.find(".dropdown-menu").addClass("show");
  });
  $("nav .dropdown").on("mouseleave", function() {
    const $this = $(this);
    $this.removeClass("show");
    $this.find("> a").attr("aria-expanded", "false");
    $this.find(".dropdown-menu").removeClass("show");
  });
  $window.on("scroll", () => {
    const scrollTop = $window.scrollTop() ?? 0;
    const navbar = $(".ftco_navbar");
    const next = nextNavbarState(scrollTop, {
      scrolled: navbar.hasClass("scrolled"),
      awake: navbar.hasClass("awake"),
      sleep: navbar.hasClass("sleep")
    });
    navbar.toggleClass("scrolled", next.scrolled).toggleClass("awake", next.awake).toggleClass("sleep", next.sleep);
    if (scrollTop > 800) {
      $(".js-scroll-wrap").addClass("sleep");
    } else if (scrollTop < 800) {
      $(".js-scroll-wrap").removeClass("sleep");
    }
  });
  $("#section-counter").waypoint(
    function(direction) {
      if (direction === "down" && !$(this.element).hasClass("prls-animated")) {
        const numberStep = $.animateNumber.numberStepFactories.separator(",");
        $(".number").each(function() {
          const $this = $(this);
          $this.animateNumber({ number: Number($this.data("number")), numberStep }, 7e3);
        });
      }
    },
    { offset: "95%" }
  );
  $(".prls-animate").waypoint(
    function(direction) {
      if (direction === "down" && !$(this.element).hasClass("prls-animated")) {
        $(this.element).addClass("item-animate");
        setTimeout(() => {
          $("body .prls-animate.item-animate").each(function(index) {
            const el = $(this);
            setTimeout(() => {
              el.addClass(`${revealEffect(el.data("animate-effect"))} prls-animated`);
              el.removeClass("item-animate");
            }, index * 50);
          });
        }, 100);
      }
    },
    { offset: "95%" }
  );
  $(".smoothscroll[href^='#'], #prls-nav ul li a[href^='#']").on("click", function(event) {
    event.preventDefault();
    const hash = this.hash;
    const offset = $(hash).offset();
    if (offset === void 0) {
      return;
    }
    $("html, body").animate({ scrollTop: offset.top }, 700, "easeInOutExpo", () => {
      window.location.hash = hash;
    });
    const navToggler = $(".navbar-toggler");
    if (navToggler.is(":visible")) {
      navToggler.trigger("click");
    }
  });
  $(".image-popup").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: "mfp-no-margins mfp-with-zoom",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300
      // CSS の duration も合わせて変更します。
    }
  });
  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });
})();
