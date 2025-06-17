import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;

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

  const startValue = $(window).width() > 991 ? "top 50%" : "top 10%";
  const endValue = $(window).width() > 991 ? "bottom 20%" : "bottom 70%";
  gsap.to(".specialize-main-slider", {
    xPercent: -107,
    scrollTrigger: {
      trigger: ".section-specialize",
      start: startValue,
      end: endValue,
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
  if ($(".client-insight").length < 1 || $(window).width() < 992) return;

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
  const wrappers = document.querySelectorAll(".wrapper-expertise");

  if (!wrappers.length) return;

  wrappers.forEach((wrapper, index) => {
    if (wrapper.classList.contains("desktop") && $(window).width() > 991) {
      const expertise = wrapper.querySelector(".expertise");
      if (!expertise) return;

      const getScrollAmount = () => {
        const racesWidth = expertise.scrollWidth;
        const addScrollHeight = window.innerWidth < 1600 ? 150 : 250;
        return racesWidth - window.innerWidth + addScrollHeight;
      };

      const createTween = (element, scrollAmount) => {
        return gsap.to(element, {
          x: -scrollAmount,
          duration: 3,
          ease: "none"
        });
      };

      const getTotalHeight = () => {
        const items = wrapper.querySelectorAll(".expertise-item");
        return Array.from(items).reduce((acc, el) => acc + el.offsetHeight, 0);
      };

      const updateSpacer = (scrollAmount) => {
        let spacer = wrapper.nextElementSibling;
        if (!spacer || !spacer.classList.contains("expertise-spacer")) {
          spacer = document.createElement("div");
          spacer.classList.add("expertise-spacer");
          wrapper.insertAdjacentElement("afterend", spacer);
        }
        const totalHeight = getTotalHeight();
        spacer.style.height = `${Math.max(totalHeight, scrollAmount)}px`;
      };

      const createScrollTrigger = (wrapper, tween, scrollAmount) => {
        const isDesktop = window.innerWidth > 991;
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 20%",
          end: `+=${scrollAmount}`,
          pin: isDesktop,
          animation: tween,
          scrub: 1,
          pinSpacing: false,
          // invalidateOnRefresh: true,
          id: `expertiseScroll-${index}`
          // markers: true,
        });
      };

      const scrollAmount = getScrollAmount() + 100;
      updateSpacer(scrollAmount);

      const tween = createTween(expertise, scrollAmount);
      createScrollTrigger(wrapper, tween, scrollAmount);

      const containerTrigger = ScrollTrigger.getById(
        `expertiseScroll-${index}`
      );
      if (!containerTrigger) return;

      const items = gsap.utils.toArray(
        wrapper.querySelectorAll(".expertise-item:not(.item-title-large)")
      );

      items.forEach((item) => {
        const content = item.querySelector(".item-content");
        if (!content) return;

        const isDesktop = window.innerWidth > 991;
        if (isDesktop) {
          // Desktop: Sử dụng containerAnimation
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
              }
            }
          );
        }
      });
    } else {
      var swiperExpertise = new Swiper(".swiper-expertise", {
        spaceBetween: 24,
        pagination: {
          el: ".wrapper-expertise.mobile .swiper-pagination",
          type: "progressbar"
        }
      });

      // Set initial state
      gsap.set(".swiper-expertise .item-content", { yPercent: 40, opacity: 0 });

      // ScrollTrigger khi thấy swiper
      ScrollTrigger.create({
        trigger: ".swiper-expertise",
        start: "top 50%", // Khi swiper vào 80% viewport
        // markers: true,
        once: true,
        onEnter: () => {
          const firstContent =
            swiperExpertise.slides[0]?.querySelector(".item-content");
          if (firstContent) {
            gsap.fromTo(
              firstContent,
              { yPercent: 40, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.5,
                ease: "none"
              }
            );
          }
        }
      });

      // slideChange event như cũ
      swiperExpertise.on("slideChange", function () {
        const activeSlide = this.slides[this.activeIndex];
        const content = activeSlide.querySelector(".item-content");

        if (content) {
          const tl = gsap.timeline();
          tl.fromTo(
            content,
            { yPercent: 40, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
              ease: "none"
            }
          );
        }
      });
    }
  });
}

function brandingAnimation() {
  if (!$(".branding-wrapper").length) return;

  const brandingItem = gsap.utils.toArray(".branding-wrapper .item");
  const isMobile = window.innerWidth <= 991;

  if (isMobile) {
    gsap.set(brandingItem, {
      y: 50,
      opacity: 0
    });
    brandingItem.forEach((item, index) => {
      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          end: "bottom 90%"
          // markers: true,
        }
      });
    });
  } else {
    gsap.set(brandingItem, {
      yPercent: 50,
      opacity: 0
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".branding-wrapper",
        start: "top 85%",
        end: "bottom 70%",
        scrub: 1
        // markers: true,
      }
    });

    tl.to(brandingItem, {
      yPercent: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.1
    });
  }
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsapExpertise();
  sectionSpecialize();
  clientInsight();
  brandingAnimation();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
