import { preloadImages } from "../../libs/utils.js";

function ourStory() {
  gsap.set(".our-story .content:not(:first-child)", { yPercent: 100 });

  // Lấy tất cả các phần tử .content không có class first-child
  const contents = gsap.utils.toArray(".our-story .content:not(:first-child)");

  const texts = gsap.utils.toArray(".text");

  const contentTimeline = gsap.timeline();

  ScrollTrigger.create({
    trigger: ".our-story",
    start: "top top",
    end: "+=1000",
    pin: true,
    scrub: true,
    animation: contentTimeline,

    onUpdate: (self) => {
      const progress = self.progress;
      const step = 1 / (contents.length + 1);

      let activeIndex = Math.floor(progress / step);
      if (activeIndex >= texts.length) activeIndex = texts.length - 1;

      texts.forEach((text, index) => {
        text.classList.toggle("active", index === activeIndex);
      });
    },
  });

  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0,
      duration: 0.5,
      boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.4)",
      ease: "power2.out",
    });
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);

  ourStory();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
