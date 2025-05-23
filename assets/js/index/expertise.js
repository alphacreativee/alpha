import { preloadImages } from "../../libs/utils.js";

function animateChessItems() {
  if (!$(".banner-expertise").length) return;

  const items = gsap.utils.toArray(".wrapper-chess .chess-item");

  gsap.set(items, { y: "120%" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-expertise",
      start: "top top",
      end: "+=200%",
      scrub: true,
      pin: true
    }
  });

  items.forEach((item) => {
    tl.to(item, {
      y: "0%",
      duration: 0.6,
      ease: "none"
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
