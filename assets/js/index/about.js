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
    }
  });

  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0,
      duration: 0.5,
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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
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
