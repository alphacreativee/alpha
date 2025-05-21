import { preloadImages } from "../../libs/utils.js";

function ourStory() {
  gsap.set(".content:not(:first-child)", { yPercent: 100 });

  // Lấy tất cả các phần tử .content không có class first-child
  const contents = gsap.utils.toArray(".content:not(:first-child)");

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
      const contentCount = contents.length;
      const step = 0.4; // Khoảng cách giữa các hiệu ứng (i * 0.2)

      let activeIndex = Math.floor(progress / step);
      if (activeIndex >= contentCount) activeIndex = contentCount - 1;
      if (activeIndex < 0) activeIndex = 0;

      texts.forEach((text, index) => {
        if (index === activeIndex) {
          text.classList.add("active");
        } else {
          text.classList.remove("active");
        }
      });
    },
  });

  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0,
      duration: 0.5,
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
