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
        // markers: true
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
}

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
    }
  });

  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0,
      duration: 0.5,
      boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.4)",
      ease: "power2.out"
    });
  });
}

function gsapexpertise2() {
  const wrapperexpertise2 = $(".wrapper-expertise2");

  // Nếu có bất kỳ phần tử expertise2 nào
  if (wrapperexpertise2.length > 0) {
    // Lặp qua từng phần tử wrapper
    wrapperexpertise2.each(function (index, wrapper) {
      const expertise2 = $(wrapper).find(".expertise2");

      // Hàm để tính toán lượng cuộn cần thiết
      const getScrollAmount = () => {
        const racesWidth = expertise2[0].scrollWidth;
        return racesWidth - window.innerWidth + 200;
      };

      // Hàm để tạo tween animation cho expertise2
      const createTween = (expertise2, scrollAmount) => {
        return gsap.to(expertise2, {
          x: -scrollAmount,
          duration: 3,
          ease: "none"
        });
      };

      // Hàm để tạo ScrollTrigger cho phần tử wrapper
      const createScrollTrigger = (wrapper, tween, scrollAmount) => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: `+=${scrollAmount}`,
          pin: true,
          animation: tween,
          scrub: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          id: "expertise2Scroll"
          // markers: true,
        });
      };

      // Tính toán lượng cuộn cần thiết
      const scrollAmount = getScrollAmount();
      // Tạo tween animation cho expertise2
      const tween = createTween(expertise2, scrollAmount);
      // Tạo ScrollTrigger cho phần tử wrapper
      createScrollTrigger(wrapper, tween, scrollAmount);
    });

    const containerTrigger = ScrollTrigger.getById("expertise2Scroll");

    if (!containerTrigger) return;

    const items = gsap.utils.toArray(".expertise2-item:not(.item-title-large)");

    items.forEach((item) => {
      const content = item.querySelector(".item-content");

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          containerAnimation: containerTrigger.animation,
          start: "left 85%",
          onEnter: () => item.classList.add("active"),
          onLeaveBack: () => item.classList.remove("active"),
          invalidateOnRefresh: true
          // markers: true,
        });
      });
    });

    // Làm mới ScrollTrigger sau khi tất cả triggers đã được thiết lập
    ScrollTrigger.refresh();
  }
}

function ourTeam() {
  const teamItems = gsap.utils.toArray(".our-team-item");

  gsap.set(teamItems, {
    opacity: 0,
    y: 50
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".our-team-list",
      start: "top 80%",
      end: "bottom 30%",
      scrub: 1
      // markers: true,
    }
  });

  tl.to(teamItems, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  ourTeam();
  ourStory();
  coreValue();
  gsapexpertise2();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
