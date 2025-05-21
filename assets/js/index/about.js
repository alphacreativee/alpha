import { preloadImages } from "../../libs/utils.js";

function coreValue() {
  if ($(".core-value").length < 1) return;

  const viewportWidth = window.innerWidth;
  let targetWidth = viewportWidth - 32;
  if (viewportWidth > 991) {
    targetWidth = viewportWidth - 160;
  } else if (viewportWidth > 767) {
    targetWidth = viewportWidth - 80;
  }

  const widthClipPercentage =
    ((viewportWidth - targetWidth) / 2 / viewportWidth) * 100;

  const image = document.querySelector(".core-value .core-value__top");
  const currentHeight = image.offsetHeight;
  const targetHeight =
    viewportWidth > 991 ? currentHeight - 100 : currentHeight;
  const heightClipPixels = (currentHeight - targetHeight) / 2;
  const heightClipPercentage = (heightClipPixels / currentHeight) * 100;

  const initialClipPath = `inset(${heightClipPercentage}% ${widthClipPercentage}% ${heightClipPercentage}% ${widthClipPercentage}%)`;

  gsap.fromTo(
    ".core-value .image",
    {
      clipPath: initialClipPath
    },
    {
      scrollTrigger: {
        trigger: ".core-value .core-value__top",
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1
      },
      clipPath: "inset(0% 0% 0% 0%)", // hiện dần ra
      duration: 0.4,
      ease: "power2.out"
    }
  );

  gsap.fromTo(
    ".core-value .image img",
    {
      scale: 1.1
    },
    {
      scrollTrigger: {
        trigger: ".core-value .core-value__top",
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1
      },
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    }
  );

  // pin core value
  ScrollTrigger.create({
    trigger: ".core-value",
    start: "top top",
    end: "bottom top",
    toggleClass: { targets: ".core-value", className: "active" },
    markers: false
  });

  const coreValueTopEl = document.querySelector(".core-value__top");
  const coreValueTopHeight = coreValueTopEl.getBoundingClientRect().height;

  const coreValueTop = coreValueTopHeight * 0.5 - 44;
  const endPinOffset = coreValueTopHeight * 0.05;

  gsap.to(".core-value__top .content-bottom", {
    scale: 1.5,
    ease: "none",
    scrollTrigger: {
      trigger: ".core-value__top .content-bottom",
      start: `top ${coreValueTop}px`,
      end: `top ${endPinOffset}px`,
      scrub: true,
      pin: true
      // markers: true
    }
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  coreValue();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
