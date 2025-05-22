import { preloadImages } from "../../libs/utils.js";

function ourStory() {
  gsap.set(".our-story .content:not(:first-child)", { yPercent: 100 });

  // Lấy tất cả các phần tử .content không có class first-child
  const contents = gsap.utils.toArray(".our-story .content:not(:first-child)");
  const texts = gsap.utils.toArray(".text");

  const contentTimeline = gsap.timeline();
  // Tính tổng chiều cao
  const totalHeight = document.querySelectorAll(".our-story .content")
    ? Array.from(document.querySelectorAll(".our-story .content")).reduce(
        (acc, el) => acc + el.offsetHeight,
        0
      )
    : 0;

  let spacer = document.querySelector(".our-story-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.classList.add("our-story-spacer");
    document
      .querySelector(".our-story")
      .insertAdjacentElement("afterend", spacer);
  }
  spacer.style.height = `${totalHeight}px`;

  ScrollTrigger.create({
    trigger: ".our-story",
    start: "top top",
    end: `+=${totalHeight}`, // dùng chiều cao động
    pin: true,
    scrub: true,
    animation: contentTimeline,
    pinSpacing: false,
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
