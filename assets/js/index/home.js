import { preloadImages } from "../../libs/utils.js";

function sectionSpecialize() {
  if ($(".section-specialize").length < 1) return;

  gsap.fromTo(
    ".section-specialize .image",
    { scale: 0.5 },
    {
      scale: 1,
      scrollTrigger: {
        trigger: ".section-specialize",
        start: "center bottom",
        end: "bottom bottom",
        scrub: true
      },
      ease: "none"
    }
  );

  gsap.to(".specialize-main-slider", {
    xPercent: -160,
    scrollTrigger: {
      trigger: ".section-specialize",
      start: "top 20%",
      end: "bottom 20%",
      scrub: true,
      // markers: true,
      onEnter: () => {
        $(".section-specialize").addClass("theme-light");
        $("main").addClass("theme-light");
      },
      onLeaveBack: () => {
        $("main").removeClass("theme-light");
        $(".section-specialize").removeClass("theme-light");
      }
    },
    ease: "none"
  });

  let hasCounted = false;
  ScrollTrigger.create({
    trigger: ".section-specialize",
    start: "top 15%",
    once: true,
    onEnter: () => {
      if (!hasCounted) {
        activeNumberCount();
        hasCounted = true;
      }
    }
  });

  $(".section-specialize .number").each(function () {
    const $stat = $(this);
    const patt = /(\D+)?(\d+(\.\d+)?)(\D+)?/;
    let result = patt.exec($stat.text());

    if (!result) return;

    result.shift();
    result = result.filter((res) => res != null);

    $stat.empty();

    result.forEach((res) => {
      if (isNaN(res)) {
        $stat.append(`<span>${res}</span>`);
      } else {
        for (let i = 0; i < res.length; i++) {
          $stat.append(`
            <span data-value="${res[i]}">
              <span>&nbsp;</span>
              ${Array(parseInt(res[i]) + 1)
                .join(0)
                .split(0)
                .map((x, j) => `<span>${j}</span>`)
                .join("")}
            </span>
          `);
        }
      }
    });
  });

  function activeNumberCount() {
    $(".section-specialize .number").each(function () {
      const ticks = $(this).find("span[data-value]");
      ticks.each(function () {
        const dist = parseInt($(this).attr("data-value")) + 1;
        $(this).css("transform", `translateY(-${dist * 100}%)`);
      });
    });
  }
}

function clientInsight() {
  if ($(".client-insight").length < 1) return;

  const wrapper = document.querySelector(".client-wrapper");
  const container = document.querySelector(".main-section");
  let scrollAmount = 0;
  let isHovering = false;

  function handleScroll(e) {
    if (!isHovering) return;

    const containerWidth = container.offsetWidth;
    const wrapperWidth = wrapper.scrollWidth;
    const paddingRight = 80;
    const maxScroll = wrapperWidth - containerWidth + paddingRight;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const triggerZone = 200;
    if (mouseX >= containerWidth - triggerZone) {
      scrollAmount = -maxScroll;
    } else {
      const adjustedWidth = containerWidth - triggerZone;
      const adjustedRatio = mouseX / adjustedWidth;
      scrollAmount = Math.min(0, adjustedRatio * maxScroll * -1);
    }

    scrollAmount = Math.max(-maxScroll, Math.min(0, scrollAmount));
    wrapper.style.transform = `translateX(${scrollAmount}px)`;
  }

  container.addEventListener("mouseenter", () => {
    isHovering = true;
  });

  container.addEventListener("mouseleave", () => {
    isHovering = false;
    wrapper.style.transform = `translateX(0px)`;
  });

  container.addEventListener("mousemove", (e) => {
    handleScroll(e);
  });
}

function gsapExpertise() {
  const wrapperExpertise = $(".wrapper-expertise");

  // Nếu có bất kỳ phần tử expertise nào
  if (wrapperExpertise.length > 0) {
    // Lặp qua từng phần tử wrapper
    wrapperExpertise.each(function (index, wrapper) {
      const expertise = $(wrapper).find(".expertise");

      // Hàm để tính toán lượng cuộn cần thiết
      const getScrollAmount = () => {
        const racesWidth = expertise[0].scrollWidth;
        return racesWidth - window.innerWidth + 200;
      };

      // Hàm để tạo tween animation cho expertise
      const createTween = (expertise, scrollAmount) => {
        return gsap.to(expertise, {
          x: -scrollAmount,
          duration: 3,
          ease: "none"
        });
      };

      // Hàm để tạo ScrollTrigger cho phần tử wrapper
      const createScrollTrigger = (wrapper, tween, scrollAmount) => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 30%",
          end: `+=${scrollAmount}`,
          pin: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true,
          id: "expertiseScroll"
          // markers: true,
        });
      };

      // Tính toán lượng cuộn cần thiết
      const scrollAmount = getScrollAmount();
      // Tạo tween animation cho expertise
      const tween = createTween(expertise, scrollAmount);
      // Tạo ScrollTrigger cho phần tử wrapper
      createScrollTrigger(wrapper, tween, scrollAmount);
    });

    const containerTrigger = ScrollTrigger.getById("expertiseScroll");

    if (!containerTrigger) return;

    const items = gsap.utils.toArray(".expertise-item:not(.item-title-large)");

    items.forEach((item) => {
      const content = item.querySelector(".item-content");

      gsap.fromTo(
        content,
        { yPercent: 70 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            containerAnimation: containerTrigger.animation,
            start: "left 80%",
            end: "center 60%",
            scrub: true,
            invalidateOnRefresh: true
            // markers: true,
          }
        }
      );
    });

    // Làm mới ScrollTrigger sau khi tất cả triggers đã được thiết lập
    ScrollTrigger.refresh();
  }
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsapExpertise();
  sectionSpecialize();
  clientInsight();

  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
