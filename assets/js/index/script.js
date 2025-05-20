import { preloadImages } from "../../libs/utils.js";
let lenis;

function customDropdown() {
  const $dropdowns = $(".dropdown-custom");

  $dropdowns.each(function () {
    const $dropdown = $(this);
    const $btnDropdown = $dropdown.find(".dropdown-custom__btn");
    const $dropdownMenu = $dropdown.find(".dropdown-custom__menu");
    const $dropdownItems = $dropdown.find(".dropdown-custom__item");
    const $textDropdown = $dropdown.find(".dropdown-custom__text");

    $btnDropdown.on("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns($dropdown);
      $dropdownMenu.toggleClass("dropdown--active");
      $btnDropdown.toggleClass("--active");
    });

    $(document).on("click", function () {
      closeAllDropdowns();
    });

    $dropdownItems.on("click", function (e) {
      e.stopPropagation();
      const $item = $(this);
      let tmpText = $textDropdown.text();
      const tmpImgSrc = $textDropdown.find("img").attr("src");
      const $img = $item.find("img");

      $textDropdown.text($item.text());

      if ($img.length) {
        $textDropdown.html($item.html());

        if ($item.hasClass("language__item")) {
          tmpText = `<span>${tmpText}</span>`;
        }

        $item.html(
          `${tmpImgSrc ? `<img src="${tmpImgSrc}" />` : ""} ${tmpText}`
        ); // Swap img and text back to the item
      } else if ($item.hasClass("language__item")) {
        $item.text(tmpText);
      }

      closeAllDropdowns();
    });

    function closeAllDropdowns(exception) {
      $(".dropdown-custom__btn").removeClass("active");
      $dropdowns.each(function () {
        const $menu = $(this).find(".dropdown-custom__menu");
        const $ic = $(this).find(".dropdown-custom__btn");
        if (!exception || !$(this).is(exception)) {
          $menu.removeClass("dropdown--active");
          $ic.removeClass("--active");
        }
      });
    }
  });
}
function header() {
  let btnMenuOpen = $(".header-hambuger");
  let subMenu = $(".header-sub-container");
  let menuOverlay = $(".header-sub");
  let btnMenuClose = $(".header-icon-close");
  let body = $("body");
  let subEmpty = $(".header-sub-empty");

  btnMenuOpen.on("click", function () {
    $(this).addClass("active");
    menuOverlay.addClass("active");
    body.addClass("overflow-hidden");
    setTimeout(function () {
      subMenu.addClass("active");
    }, 100);
  });

  btnMenuClose.on("click", function () {
    subMenu.removeClass("active");
    setTimeout(function () {
      btnMenuClose.removeClass("active");
      menuOverlay.removeClass("active");
      body.removeClass("overflow-hidden");
    }, 300);
  });

  subEmpty.on("click", function () {
    subMenu.removeClass("active");
    setTimeout(function () {
      btnMenuClose.removeClass("active");
      menuOverlay.removeClass("active");
      body.removeClass("overflow-hidden");
    }, 300);
  });
}
function effectText() {
  gsap.registerPlugin(SplitText, ScrollTrigger); // Register both plugins
  document.fonts.ready.then(() => {
    // Select all elements with .effect-heading-mask-line
    const elements = document.querySelectorAll(".effect-heading-mask-line");

    elements.forEach((element) => {
      gsap.set(element, { opacity: 1 }); // Set initial opacity
      let splitTitle;

      SplitText.create(element, {
        type: "words,lines",
        linesClass: "line",
        autoSplit: true,
        mask: "lines",
        onSplit: (self) => {
          const isScrollTrigger = element.classList.contains("scroll-trigger");

          if (isScrollTrigger) {
            // ScrollTrigger case
            splitTitle = gsap.from(self.lines, {
              duration: 0.4,
              yPercent: 100,
              opacity: 0,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: element,
                start: "top 60%",
                end: "bottom 60%",
                toggleActions: "play none none none"
                // markers: true,
              }
            });
          } else {
            // Auto-play case
            splitTitle = gsap.from(self.lines, {
              duration: 0.4,
              yPercent: 100,
              opacity: 0,
              stagger: 0.03,
              ease: "expo.out"
            });

            // Play animation immediately after fonts are loaded
            gsap.to(splitTitle, {
              timeScale: 0.2,
              onStart: () => splitTitle.play(0)
            });
          }

          return splitTitle;
        }
      });
    });

    // effect fade in
    gsap.utils.toArray(".effect-fade-content").forEach((element) => {
      gsap.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            end: "bottom 75%",
          },
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "sine.out",
        }
      );
    });

    // effect blur text
    const elementsBlur = document.querySelectorAll(".effect-heading-blur");

    elementsBlur.forEach((elementBlur) => {
      let splitBlur = SplitText.create(elementBlur, {
        type: "words, chars",
        charsClass: "split-char",
        wordsClass: "split-word",
      });
      gsap.fromTo(
        splitBlur.chars,
        {
          filter: "blur(10px) ",
          y: 10,
          willChange: "filter, transform",
          opacity: 0,
        },
        {
          ease: "none",
          filter: "blur(0px)",
          y: 0,
          stagger: 0.05,
          opacity: 1,
          scrollTrigger: {
            trigger: elementBlur.classList.contains("footer-effect-text")
              ? ".footer-ovl"
              : elementBlur,
            start: "top 90%",
          },
        }
      );
    });
  });
}

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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  header();
  customDropdown();
  sectionSpecialize();
  effectText();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
