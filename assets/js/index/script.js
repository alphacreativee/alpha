import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;

const lenis = new Lenis({
  duration: 1,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  smooth: true,
  smoothTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

function handlePageVisibilityAndFavicon() {
  const originalTitle = document.title;
  let faviconInterval;
  let isBlinking = false;

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      document.title = "Alpha Creative • Thiết kế cảm xúc cho thương hiệu";
      startFaviconBlinking();
    } else {
      document.title = originalTitle;
      stopFaviconBlinking();
    }
  });

  function changeFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml"; // Thêm MIME type cho SVG
      document.head.appendChild(link);
    }
    link.href = `${src}?v=${new Date().getTime()}`;
  }

  function startFaviconBlinking() {
    if (isBlinking) return; // Tránh chạy nhiều interval

    isBlinking = true;
    const hostname = window.location.origin;

    const favicons = [
      `${hostname}/wp-content/themes/alpha/assets/images/use/favicon-gold.svg`,
      `${hostname}/wp-content/themes/alpha/assets/images/use/favicon-black.svg`,
    ];
    let faviconIndex = 0;

    faviconInterval = setInterval(() => {
      changeFavicon(favicons[faviconIndex]);
      faviconIndex = (faviconIndex + 1) % favicons.length;
    }, 500);
  }

  function stopFaviconBlinking(assestUrl) {
    clearInterval(faviconInterval);
    isBlinking = false;
    const hostname = window.location.origin;
    changeFavicon(
      `${hostname}/wp-content/themes/alpha/assets/images/use/favicon-black.svg`
    );
  }
}

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
    btnMenuOpen.addClass("active");
    menuOverlay.addClass("active");
    body.addClass("overflow-hidden");
    setTimeout(function () {
      subMenu.addClass("active");
    }, 100);
  });

  btnMenuClose.on("click", function () {
    subMenu.removeClass("active");
    btnMenuOpen.removeClass("active");
    setTimeout(function () {
      btnMenuClose.removeClass("active");
      menuOverlay.removeClass("active");
      body.removeClass("overflow-hidden");
    }, 300);
  });

  subEmpty.on("click", function () {
    subMenu.removeClass("active");
    btnMenuOpen.removeClass("active");
    setTimeout(function () {
      btnMenuClose.removeClass("active");
      menuOverlay.removeClass("active");
      body.removeClass("overflow-hidden");
    }, 300);
  });
  if ($(window).width() >= 991) {
    btnMenuClose.hover(
      function () {
        btnMenuOpen.addClass("animation");
      },
      function () {
        btnMenuOpen.removeClass("animation");
      }
    );
    btnMenuOpen.hover(
      function () {
        btnMenuOpen.addClass("hovered");
      },
      function () {
        btnMenuOpen.removeClass("hovered");
      }
    );
  }
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
        type: "lines",
        linesClass: "line",
        // autoSplit: true,
        mask: "lines",
        onSplit: (self) => {
          const isScrollTrigger = element.classList.contains("scroll-trigger");

          if (isScrollTrigger) {
            // ScrollTrigger case
            splitTitle = gsap.from(self.lines, {
              duration: 0.8,
              yPercent: 100,
              opacity: 0,
              stagger: 0.2,
              ease: "expo.out",
              scrollTrigger: {
                trigger: element,
                start: "top 60%",
                end: "bottom 60%",
                toggleActions: "play none none none",
              },
            });
          } else {
            // Auto-play case
            splitTitle = gsap.from(self.lines, {
              duration: 0.4,
              yPercent: 100,
              opacity: 0,
              stagger: 0.1,
              ease: "expo.out",
            });

            // Play animation immediately after fonts are loaded
            gsap.to(splitTitle, {
              timeScale: 0.2,
              onStart: () => splitTitle.play(0),
            });
          }

          return splitTitle;
        },
      });
    });

    // effect fade in
    gsap.utils.toArray(".effect-fade-content").forEach((element) => {
      const delay = parseFloat(element.dataset.delay) || 0;
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
            // markers: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "sine.out",
          delay: delay,
        }
      );
    });
    gsap.utils
      .toArray(".effect-fade-content-auto")
      .forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            "will-change": "opacity, transform",
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "sine.out",
            delay: 0.5, // Độ trễ để tạo hiệu ứng lần lượt
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
            // markers: true,
          },
        }
      );
    });
  });
}

function introChess() {
  if (document.querySelectorAll(".section-intro").length < 1) return;

  // Đăng ký plugin ScrollTrigger và SplitText
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Hiệu ứng cho section-intro-content
  const sectionIntroContent = document.querySelector(".section-intro-content");
  const tagElement = document.querySelector(".section-intro-content .tag");
  const contentElement = document.querySelector(
    ".section-intro-content .h2-heading"
  );

  // Khởi tạo SplitText cho content
  const splitContent = new SplitText(contentElement, {
    type: "lines",
    mask: "lines",
    linesClass: "line",
  });
  const valueStarMobile = window.innerWidth < 991 ? "top-=100px" : "top top";
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-intro-video",
      start: "top top",
      end: "bottom center",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });

  tl.fromTo(sectionIntroContent, { opacity: 0 }, { opacity: 1, duration: 0.4 });
  tl.fromTo(
    tagElement,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }
  );
  tl.fromTo(
    splitContent.lines,
    { opacity: 0, yPercent: 100 },
    { opacity: 1, yPercent: 0, duration: 0.3, stagger: 0.05, ease: "expo.out" },
    "-=0.1"
  );

  // Ghim section-intro

  gsap.to(".section-intro", {
    scrollTrigger: {
      trigger: ".section-intro",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      // markers: true,
    },
  });
}

function whyChooseUs() {
  if ($(".why-choose-us").length < 1) return;
  if ($(".why-choose-us.page-expertise").length > 0) {
    ScrollTrigger.create({
      trigger: ".why-choose-us.page-expertise",
      start: "top 70%",
      end: "bottom top",
      // markers: true,
      onEnter: () => {
        document
          .querySelector(".why-choose-us.page-expertise")
          .classList.add("theme-light");
        document
          .querySelector(".header-menu-container")
          .classList.add("theme-light");
        document.querySelector("main").classList.add("theme-light");
      },
      onLeaveBack: () => {
        document
          .querySelector(".why-choose-us.page-expertise")
          .classList.remove("theme-light");
        document
          .querySelector(".header-menu-container")
          .classList.remove("theme-light");
        document.querySelector("main").classList.remove("theme-light");
      },
    });
  }
  if ($(window).width() < 1100) return;
  const sections = document.querySelectorAll(".why-choose-us .main-section");

  sections.forEach((container) => {
    const wrapper = container.querySelector(".list-wrapper");
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
  });

  // hover video
  document
    .querySelectorAll(".why-choose-us .item-child.video")
    .forEach((item) => {
      const video = item.querySelector("video");

      item.addEventListener("mouseenter", () => {
        video.loop = true;
        video.play();
      });

      item.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
    });
}

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
      clipPath: initialClipPath,
    },
    {
      scrollTrigger: {
        trigger: ".core-value .core-value__top",
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1,
        // markers: true
      },
      clipPath: "inset(0% 0% 0% 0%)", // hiện dần ra
      duration: 0.4,
      ease: "power2.out",
    }
  );

  gsap.fromTo(
    ".core-value .image img",
    {
      scale: 1,
    },
    {
      scrollTrigger: {
        trigger: ".core-value .core-value__top",
        start: "top 40%",
        end: "bottom top",
        scrub: 1,
        // markers: true,
      },
      scale: 1.5,
      duration: 0.4,
      ease: "power2.out",
      transformOrigin: () =>
        document.querySelector(".core-value .image").dataset.transformOrigin,
    }
  );

  // pin core value
  if ($("#core-value-text").length < 1) return;

  const xPercentValue = window.innerWidth < 991 ? "0" : "-300";
  const sectionHeight = document.querySelector(".core-value").offsetHeight;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#core-value-text",
      start: "center center",
      end:
        window.innerWidth < 991 ? `+=${sectionHeight * 0.5 + 114}px` : "+=200%",
      scrub: true,
      pin: true,
      toggleClass: { targets: ".core-value", className: "active" },
      // markers: true,
    },
  });

  tl.to("#core-value-text", {
    scale: 1.7,
    duration: 0.6,
    ease: "power2.out",
  });

  tl.to("#core-value-text", {
    xPercent: xPercentValue,
    duration: 0.5,
    ease: "none",
  });
}

function magicCursor() {
  if (!document.querySelector(".magic-cursor")) return;

  var circle = document.querySelector(".magic-cursor");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Di chuyển circle trực tiếp đến vị trí con chuột
    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1, // Không có độ trễ
    });
  });

  var cursorDot = document.querySelector(".magic-cursor .cursor");
  var cursorDotIcon = document.querySelector(".magic-cursor .cursor .icon");
  var cursorText = document.querySelector(
    ".magic-cursor .cursor .text-content"
  );

  const itemsContent = document.querySelectorAll(
    ".project-item, .our-team-item, .project-banner.animate"
  );
  itemsContent.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
    });
  });

  const cursorArrow = document.querySelectorAll("[data-cursor='arrow']");
  cursorArrow.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show", "arrow");

      const rotation = item.classList.contains("swiper-button-prev") ? 180 : 0;
      gsap.to(cursorDotIcon, {
        rotate: rotation,
        yPercent: -50,
        xPercent: -50,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show", "arrow");

      gsap.to(cursorDotIcon, {
        rotate: 0,
        yPercent: -50,
        xPercent: -50,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // section client
  const itemsContentClient = document.querySelectorAll(".client-wrapper");
  itemsContentClient.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
    });
  });
  // section client
  const itemsContentListW = document.querySelectorAll(".list-wrapper");
  itemsContentListW.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
    });
  });
}
function magicCursorV2() {
  if (!document.querySelector(".magic-cursor-chess")) return;

  var circle = document.querySelector(".magic-cursor-chess");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Di chuyển circle trực tiếp đến vị trí con chuột
    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1, // Không có độ trễ
    });
  });

  var cursorDot = document.querySelector(".magic-cursor-chess .cursor");

  const itemsChess = document.querySelectorAll(".expertise-item .item-image");
  itemsChess.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show");
      item.classList.add("hovered");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
      item.classList.remove("hovered");
    });
  });
}
function pinSectionBanner() {
  const banner = document.querySelector(".group-intro-banner");
  const bannerTitle = document.querySelector(".section-banner-title");
  let isTitleHidden = false;
  const pinEndValue =
    window.innerWidth < 991
      ? `+=${window.innerHeight * 0.6}`
      : `+=${window.innerHeight}`;
  if (banner && bannerTitle) {
    gsap.to(banner, {
      scrollTrigger: {
        trigger: banner,
        pin: true,
        pinSpacing: false,
        start: "top top",
        end: pinEndValue,
        scrub: true,
        // markers: true,
        onUpdate: (self) => {
          if (self.progress === 1 && !isTitleHidden) {
            gsap.to(bannerTitle, {
              opacity: 0,
              duration: 0.3,
              ease: "expo.out",
            });
            isTitleHidden = true;
          } else if (self.progress < 1 && isTitleHidden) {
            gsap.to(bannerTitle, {
              opacity: 1,
              duration: 0.3,
              delay: 0.65,
              ease: "expo.out",
            });
            isTitleHidden = false;
          }
        },
      },
    });
  }
}

function cookieModal() {
  const modalCookies = document.querySelector(".modal-cookies");
  if (!modalCookies) return;

  const acceptBtn = modalCookies.querySelector("button[data-button='ACCEPT']");
  const rejectBtn = modalCookies.querySelector("button[data-button='REJECT']");
  if (!acceptBtn || !rejectBtn) return;

  function hasAcceptedCookies() {
    const stored = localStorage.getItem("cookieConsent");
    if (!stored) return false;
    try {
      const data = JSON.parse(stored);
      return Date.now() < data.expires;
    } catch (e) {
      return false;
    }
  }

  if (!hasAcceptedCookies()) {
    modalCookies.classList.add("open");
  } else {
    modalCookies.classList.remove("open");
  }

  acceptBtn.addEventListener("click", function () {
    const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({ accepted: true, expires })
    );
    modalCookies.classList.remove("open");
  });

  rejectBtn.addEventListener("click", function () {
    modalCookies.classList.remove("open");
  });
}
function addThemeLightToHeader() {
  // Tìm element main có class blog-page-detail
  const mainElement = document.querySelector("body.blog-page-detail");

  const headerMenuContainer = document.querySelector(".header-menu-container");

  if (mainElement && headerMenuContainer) {
    headerMenuContainer.classList.add("theme-light");
  }
}

function loading() {
  if ($(".loading").length < 1) return;
  let tlLoading = gsap.timeline({
    onComplete: () => {
      $("body").removeClass("overflow-hidden");
    },
  });
  let loading = $(".loading");
  let body = $("body");
  body.addClass("overflow-hidden");

  if (loading.hasClass("out-home")) {
    gsap.delayedCall(1.4, effectTextBanner);
    tlLoading
      .to(
        loading.find(".loading-logo"),
        {
          opacity: 0,
          y: -60,
          ease: "power2.out",
        },
        0.5
      )
      .to(
        loading.find(".loading-wrapper"),
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.5,
          ease: "power3.inOut",
        },
        0.6
      )
      .to(loading, {
        autoAlpha: 0,
      });
  } else {
    gsap.delayedCall(3.65, effectTextBanner);
    tlLoading
      .to(
        loading.find(".loading-logo"),
        {
          opacity: 0,
          y: -60,
          duration: 0.8,
          ease: "power2.out",
        },
        0.5
      )
      .to(
        loading.find(".loading-text"),
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        1
      )
      .to(
        loading.find(".loading-text"),
        {
          opacity: 0,
          y: -60,
          duration: 0.5,
          ease: "power2.out",
        },
        1.8
      )
      .to(
        loading.find(".loading-desc"),
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        2.3
      )

      .to(
        loading.find(".loading-wrapper"),
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.5,
          ease: "power3.inOut",
        },
        2.9
      )
      .to(loading, { autoAlpha: 0 });
  }
}
$(window).on("DOMContentLoaded", function () {
  loading();
});
function effectTextBanner() {
  const elements = document.querySelectorAll(
    ".effect-heading-mask-line-banner"
  );

  elements.forEach((element) => {
    gsap.set(element, { opacity: 0 }); // Set initial opacity to 0
    let splitTitle;

    SplitText.create(element, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
      onSplit: (self) => {
        // Auto-play animation
        splitTitle = gsap.fromTo(
          self.lines,
          {
            yPercent: 100,
            opacity: 0, // Start from opacity 0
          },
          {
            yPercent: 0,
            opacity: 1, // Animate to opacity 1
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          }
        );

        // Play animation immediately after fonts are loaded
        gsap.to(splitTitle, {
          timeScale: 0.2,
          onStart: () => splitTitle.play(0),
        });

        // Set parent element opacity to 1 after animation starts
        gsap.to(element, {
          opacity: 1,
          duration: 0, // Instant change
          delay: 0.1, // Slight delay to ensure lines are visible
        });

        return splitTitle;
      },
    });
  });

  // effect fade in
  gsap.utils.toArray(".effect-fade-content-banner").forEach((element) => {
    const additionalDelay = element.dataset.delay
      ? parseFloat(element.dataset.delay)
      : 0;
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "sine.out",
        delay: 0.5 + additionalDelay,
      }
    );
  });
}
function stickyFilter() {
  $(window).on("scroll", function () {
    if ($(".project-filter").length < 1) return;
    const $filter = $(".project-filter");
    const top = $filter.offset().top - $(window).scrollTop();

    if (top <= 84) {
      $filter.addClass("sticky");
    } else {
      $filter.removeClass("sticky");
    }
  });
}

function hoverVideo() {
  if ($(".item-hover-video").length < 1) return;

  document.querySelectorAll(".item-hover-video").forEach((item) => {
    const video = item.querySelector("video");

    item.addEventListener("mouseenter", () => {
      video.loop = true;
      video.play();
    });

    item.addEventListener("mouseleave", () => {
      video.pause();

      setTimeout(() => {
        video.currentTime = 0;
        video.load();
      }, 500);
    });
  });
}

function hoverNumberCount() {
  const items = document.querySelectorAll(".item-hover-number .item-number");

  items.forEach((item) => {
    const target = parseInt(item.dataset.target, 10) || 0;
    const suffix = item.dataset.suffix || "";
    let countObj = { val: 0 };

    const showTween = () => {
      gsap.to(item, {
        opacity: 1,
        y: "0%",
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(countObj, {
        val: target,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          item.textContent = Math.floor(countObj.val).toLocaleString() + suffix;
        },
      });
    };

    const hideTween = () => {
      gsap.to(item, {
        opacity: 0,
        y: "20%",
        duration: 0.6,
        ease: "power2.in",
      });

      gsap.to(countObj, {
        val: 0,
        duration: 1,
        ease: "power2.in",
        onUpdate: () => {
          item.textContent = Math.floor(countObj.val).toLocaleString() + suffix;
        },
      });
    };

    const parent = item.closest(".item-hover-number");

    parent.addEventListener("mouseenter", showTween);
    parent.addEventListener("mouseleave", hideTween);
  });
}

function scrollToForm() {
  const buttonContact = document.querySelector("#button-contact");
  const contactForm = document.querySelector("#section-contact");

  if (buttonContact) {
    buttonContact.addEventListener("click", (e) => {
      e.preventDefault();

      if (contactForm) {
        gsap.registerPlugin(ScrollToPlugin);
        const sectionBottom = contactForm.offsetTop + contactForm.offsetHeight;
        const scrollPosition = sectionBottom - window.innerHeight;

        gsap.to(window, {
          duration: 1,
          scrollTo: scrollPosition,
          ease: "none",
        });
      }
    });
  }
}

function parallaxIt(e, target, movement) {
  const rect = target.getBoundingClientRect();

  const relX = e.clientX - rect.left;
  const relY = e.clientY - rect.top;

  const parallaxX = (relX / rect.width - 0.5) * movement;
  const parallaxY = (relY / rect.height - 0.5) * movement;

  gsap.to(target, {
    duration: 0.3,
    x: parallaxX,
    y: parallaxY,
    ease: "power2.out",
  });
}

function callParallax(e) {
  const item = e.currentTarget;
  const img = item.querySelector("img");
  const span = item.querySelector("span");

  parallaxIt(e, item, 10);

  if (img) {
    parallaxIt(e, img, 20);
  }

  if (span) {
    parallaxIt(e, span, 15);
  }
}

function hoverIcon() {
  if (window.innerWidth < 992) return;

  if (
    !document.querySelector(".build-a-brand") &&
    !document.querySelector("section.project")
  )
    return;

  const items = document.querySelectorAll(
    ".build-a-brand .tab-wrapper .item, .project-container .nav-link"
  );
  const buttons = document.querySelectorAll(".btn-large");

  items.forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      callParallax(e);
    });

    item.addEventListener("mouseleave", () => {
      const rect = item.getBoundingClientRect();

      gsap.to(item, {
        duration: 0.3,
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
        ease: "power2.out",
      });

      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          x: 0,
          y: 0,
          scale: 1,
          ease: "power2.out",
        });
      }
    });

    item.addEventListener("mouseenter", () => {
      const img = item.querySelector("img");
      if (img) {
        gsap.to(img, {
          duration: 0.3,
          scale: 0.9,
          ease: "power2.out",
        });
      }
    });
  });
}
let coreValueTimeline = null;

function showCoreValue() {
  if ($(".expertise-core-value").length < 1) return;

  // Nếu đã có timeline trước đó thì kill nó
  if (coreValueTimeline) {
    coreValueTimeline.kill();
    ScrollTrigger.getById("core-value-trigger")?.kill();
  }

  const contentItems = document.querySelectorAll(".content-item-lg");
  const contentOvl = document.querySelector(
    ".expertise-core-value .content-ovl"
  );

  gsap.set(contentOvl, {
    autoAlpha: 0,
  });
  if (contentItems.length === 0) return;

  // Khởi tạo trạng thái ban đầu
  contentItems[0].classList.add("active", "text-effect-gradient-not-effect");
  Array.from(contentItems)
    .slice(1)
    .forEach((item) => {
      item.classList.remove("active", "text-effect-gradient-not-effect");
    });

  const totalItems = contentItems.length;
  const stepDuration = 0.2;
  const totalAnimationTime = (totalItems * 2 - 1) * stepDuration;

  coreValueTimeline = gsap.timeline({
    scrollTrigger: {
      id: "core-value-trigger", // thêm ID để dễ quản lý
      trigger: ".expertise-core-value",
      start: "top top",
      end: "+=150%",
      scrub: true,
      pin: true,
      // markers: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const animationProgress = Math.min(
          (progress * (totalAnimationTime + 1)) / totalAnimationTime,
          1
        );

        // Tính activeIndex như bạn đã viết
        let activeIndex = 0;
        const progressInAnimation = animationProgress * totalAnimationTime;

        if (progressInAnimation <= stepDuration) {
          activeIndex = progressInAnimation / stepDuration < 0.5 ? 0 : -1;
        } else {
          const remainingProgress = progressInAnimation - stepDuration;
          const currentStep = Math.floor(remainingProgress / stepDuration);
          const stepProgress =
            (remainingProgress % stepDuration) / stepDuration;

          if (currentStep < totalItems - 1) {
            if (currentStep % 2 === 0) {
              activeIndex = Math.floor(currentStep / 2) + 1;
            } else {
              const itemIndex = Math.floor(currentStep / 2) + 1;
              if (itemIndex === totalItems - 1) {
                activeIndex = itemIndex;
              } else {
                activeIndex = stepProgress < 0.5 ? itemIndex : -1;
              }
            }
          } else {
            activeIndex = totalItems - 1;
          }
        }

        contentItems.forEach((item, index) => {
          if (index === activeIndex) {
            item.classList.add("active", "text-effect-gradient-not-effect");
          } else {
            item.classList.remove("active", "text-effect-gradient-not-effect");
          }
        });
      },
    },
  });

  coreValueTimeline
    .to({}, { duration: totalAnimationTime })
    .to(contentOvl, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => {
        const contentBgOvl = document.querySelector(".content-bg-ovl");
        if (contentBgOvl) {
          contentBgOvl.classList.add("show");
        }
        effectTextCoreValue();
      },
      onReverseComplete: () => {
        const contentBgOvl = document.querySelector(".content-bg-ovl");
        if (contentBgOvl) {
          contentBgOvl.classList.remove("show");
        }
      },
    })
    .to({}, { duration: 0.5 });
}

function effectTextCoreValue() {
  const elements = document.querySelectorAll(".effect-heading-mask-line-core");

  elements.forEach((element) => {
    gsap.set(element, { opacity: 0 }); // Set initial opacity to 0
    let splitTitle;

    SplitText.create(element, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
      onSplit: (self) => {
        // Auto-play animation
        splitTitle = gsap.fromTo(
          self.lines,
          {
            yPercent: 100,
            opacity: 0, // Start from opacity 0
          },
          {
            yPercent: 0,
            opacity: 1, // Animate to opacity 1
            duration: 0.4,
            stagger: 0.1,
            ease: "expo.out",
          }
        );

        // Play animation immediately after fonts are loaded
        gsap.to(splitTitle, {
          timeScale: 0.2,
          onStart: () => splitTitle.play(0),
        });

        // Set parent element opacity to 1 after animation starts
        gsap.to(element, {
          opacity: 1,
          duration: 0, // Instant change
          delay: 0.1, // Slight delay to ensure lines are visible
        });

        return splitTitle;
      },
    });
  });

  // effect fade in
  gsap.utils.toArray(".effect-fade-content-core").forEach((element) => {
    const additionalDelay = element.dataset.delay
      ? parseFloat(element.dataset.delay)
      : 0;
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "sine.out",
        delay: 0.5 + additionalDelay,
      }
    );
  });
}
$(".accordion").on("shown.bs.collapse hidden.bs.collapse", function () {
  setTimeout(() => {
    showCoreValue(); // sẽ tự destroy timeline cũ
    ScrollTrigger.refresh(); // cập nhật lại layout
  }, 200);
});

function contactForm() {
  if ($(".contact-form").length < 1) return;

  const contactForm = $("#contact-form");
  const nameField = contactForm.find("input[name='name']");
  const emailField = contactForm.find("input[name='email']");
  const phoneField = contactForm.find("input[name='phone']");
  const companyField = contactForm.find("input[name='company']");
  const serviceField = contactForm.find(
    ".dropdown-custom .dropdown-custom__text"
  );
  const messageField = contactForm.find("textarea[name='message']");
  const buttonSubmit = contactForm.find("button[type='submit']");

  contactForm.on("submit", function (e) {
    e.preventDefault();

    contactForm.find("input, textarea").removeClass("error");

    let isValid = true;

    if (!nameField.val().trim()) {
      nameField.addClass("error");
      isValid = false;
    }

    if (!emailField.val().trim()) {
      emailField.addClass("error");
      isValid = false;
    }

    if (!phoneField.val().trim()) {
      phoneField.addClass("error");
      isValid = false;
    }

    if (!isValid) return;

    $.ajax({
      type: "POST",
      url: ajaxUrl,
      data: {
        action: "submit_contact_form",
        name: nameField.val().trim(),
        email: emailField.val().trim(),
        phone: phoneField.val().trim(),
        company: companyField.val().trim(),
        service: serviceField.text().trim(),
        messageNote: messageField.val().trim(),
      },
      beforeSend: function () {
        buttonSubmit.addClass("aloading");
      },
      success: function (res) {
        contactForm[0].reset();

        if (contactForm.find(".privacy").length > 0) {
          contactForm.find(".privacy").hide();
          contactForm.find(".success-message").show();

          setTimeout(function () {
            contactForm.find(".privacy").show();
            contactForm.find(".success-message").hide();
          }, 5000);
        }

        buttonSubmit.removeClass("aloading");
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi gửi form:", error);

        contactForm.append(
          '<span class="contact-message body-sm-regular" style="color: #FF0000;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
        );
      },
    });
  });
}

function projectDetail() {
  if ($(".project-detail").length < 1) return;

  $(".project-banner.animate").each(function () {
    const banner = $(this).find(".banner-img")[0];
    if (!banner) return;

    const img = banner.querySelector("img");
    const video = banner.querySelector("video");
    const media = img || video;
    if (!media) return;

    const viewportWidth = window.innerWidth;
    const imageHeight = banner.offsetHeight || 1; // tránh chia 0

    const clipLeftRight = viewportWidth > 991 ? 80 : 24;
    const clipTopBottom = viewportWidth > 991 ? 80 : 24;

    const widthClipPercent = (clipLeftRight / viewportWidth) * 100;
    const heightClipPercent = (clipTopBottom / imageHeight) * 100;

    const initialClip = `inset(0% 0% 0% 0%)`;
    const finalClip = `inset(${heightClipPercent}% ${widthClipPercent}% ${heightClipPercent}% ${widthClipPercent}%)`;

    // ClipPath animation
    gsap.fromTo(
      banner,
      {
        clipPath: initialClip,
      },
      {
        scrollTrigger: {
          trigger: $(this), // trigger là từng project-banner
          start: "top 80%",
          end: "top top",
          scrub: 1,
        },
        clipPath: finalClip,
        ease: "power2.out",
      }
    );

    // Scale animation
    gsap.fromTo(
      media,
      {
        scale: 1,
      },
      {
        scrollTrigger: {
          trigger: $(this),
          start: "top 80%",
          end: "top top",
          scrub: 1,
        },
        scale: 1.3,
        ease: "power2.out",
        transformOrigin: media.dataset.transformOrigin || "center center",
      }
    );
  });
}

// function scrollInfiniteProject() {
//   if ($(".project-detail").length < 1) {
//     // console.log("No .project-detail found, exiting.");
//     return;
//   }

//   const observerOptions = {
//     root: null,
//     rootMargin: "0px", // No offset, check within viewport
//     threshold: 0.6 // Trigger when 80% of element is visible
//   };

//   // Store previous URLs for each element to revert when scrolling up
//   const urlHistory = new Map();

//   const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach((entry) => {
//       const $element = $(entry.target);
//       const currentPostId = $element.data("post-id");
//       const nextPostUrl = $element.data("next-post");

//       if (!currentPostId) {
//         // console.warn("No post-id found on element:", $element);
//         observer.unobserve(entry.target);
//         return;
//       }

//       if (entry.isIntersecting) {
//         // console.log("80% of element visible, triggering AJAX and URL update for post-id:", currentPostId);

//         // Store the current URL before updating
//         urlHistory.set(entry.target, window.location.href);

//         // Update URL if data-next-post exists
//         if (nextPostUrl) {
//           // console.log("Updating URL to:", nextPostUrl);
//           window.history.pushState({ postId: currentPostId }, "", nextPostUrl);
//         } else {
//           // console.warn("No data-next-post found on element:", $element);
//         }

//         $.ajax({
//           type: "POST",
//           url: ajaxUrl,
//           dataType: "json",
//           data: {
//             action: "load_next_project",
//             current_post_id: currentPostId
//           },
//           success: function (res) {
//             // console.log("AJAX response:", res);
//             if (res.success && res.data && res.data.content) {
//               const $newContent = $(res.data.content);
//               // console.log("Appended new content:", $newContent, "Raw HTML:", res.data.content);

//               // Append the new content to .project-detail
//               $(".project-detail").append($newContent);

//               // Find .project-banner.animate in both nested and top-level elements
//               const $newBanners = $newContent
//                 .find(".project-banner.animate")
//                 .add($newContent.filter(".project-banner.animate"));
//               // console.log("Found new .project-banner.animate elements:", $newBanners.length, $newBanners);

//               $newBanners.each(function () {
//                 // console.log("Observing new element:", this);
//                 observer.observe(this);
//               });

//               // Reinitialize functions
//               projectDetail();
//               magicCursor();
//               ScrollTrigger.refresh();
//             } else {
//               // console.warn("Invalid response or no content:", res);
//             }
//           },
//           error: function (xhr, status, error) {
//             // console.error("AJAX error:", status, error, xhr.responseText);
//           }
//         });

//         // Stop observing this element to prevent multiple triggers
//         observer.unobserve(entry.target);
//       } else if (!entry.isIntersecting && urlHistory.has(entry.target)) {
//         // Revert to previous URL when element is no longer 80% visible
//         const previousUrl = urlHistory.get(entry.target);
//         // console.log("Element no longer 80% visible, reverting URL to:", previousUrl);
//         window.history.pushState({ postId: currentPostId }, "", previousUrl);
//       }
//     });
//   }, observerOptions);

//   // Observe initial .project-banner.animate elements
//   const $initialBanners = $(".project-banner.animate");
//   // console.log("Initial .project-banner.animate elements found:", $initialBanners.length);
//   $initialBanners.each(function () {
//     observer.observe(this);
//   });

//   // Handle popstate to ensure URL changes are tracked when using browser back/forward
//   window.addEventListener("popstate", function (event) {
//     // console.log("Popstate event, current URL:", window.location.href);
//   });
// }

function scrollInfiniteProject(scrollCount = 0) {
  if ($(".project-detail").length < 1) {
    return;
  }

  // Ensure .loading is visible on initial page load
  if ($(".loading").length) {
    $(".loading").removeClass("d-none");
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.9, // Trigger when 90% of element is visible
  };

  // Store previous URLs for each element to revert when scrolling up
  const urlHistory = new Map();

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const $element = $(entry.target);
      const currentPostId = $element.data("post-id");
      const nextPostUrl = $element.data("next-post");

      if (!currentPostId || !nextPostUrl) {
        observer.unobserve(entry.target);
        return;
      }

      if (entry.isIntersecting) {
        // Increment scrollCount for the parameter
        scrollCount++;

        // Store the current URL before updating
        urlHistory.set(entry.target, window.location.href);

        // Append scrollCount as a query parameter to the nextPostUrl
        const url = new URL(nextPostUrl, window.location.origin);
        url.searchParams.set("scrollCount", scrollCount);

        // Hide .loading before navigating
        if ($(".loading").length) {
          $(".loading").addClass("d-none");
        }

        // Update URL and navigate to the next page
        window.history.pushState(
          { postId: currentPostId, scrollCount: scrollCount },
          "",
          url.toString()
        );
        window.location.href = url.toString();

        // Stop observing this element
        observer.unobserve(entry.target);
      } else if (!entry.isIntersecting && urlHistory.has(entry.target)) {
        // Revert to previous URL when element is no longer 90% visible
        const previousUrl = urlHistory.get(entry.target);
        window.history.pushState({ postId: currentPostId }, "", previousUrl);
      }
    });
  }, observerOptions);

  // Observe initial .project-banner.animate elements
  const $initialBanners = $(".project-banner.animate");
  $initialBanners.each(function () {
    observer.observe(this);
  });

  // Handle popstate to track URL changes with browser back/forward
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.scrollCount) {
      scrollCount = event.state.scrollCount;
    }
    // Hide .loading before navigating
    if ($(".loading").length) {
      $(".loading").addClass("d-none");
    }
    window.location.href = window.location.href;
  });
}
function animateBannerProjectDetail() {
  if ($(".project-banner").length < 1) return;

  gsap.fromTo(
    ".project-banner .banner-img",
    {
      clipPath: () => {
        const viewportWidth = window.innerWidth;
        let targetWidth = viewportWidth - 32;
        if (viewportWidth > 991) {
          targetWidth = viewportWidth - 160;
        } else if (viewportWidth > 767) {
          targetWidth = viewportWidth - 80;
        } else {
          targetWidth = viewportWidth - 32;
        }
        const widthClipPercentage =
          ((viewportWidth - targetWidth) / 2 / viewportWidth) * 100;
        const image = document.querySelector(".project-banner");
        const currentHeight = image.offsetHeight;
        const targetHeight =
          viewportWidth > 991 ? currentHeight - 160 : currentHeight;
        const heightClipPixels = (currentHeight - targetHeight) / 2;
        const heightClipPercentage = (heightClipPixels / currentHeight) * 100;
        return `inset(${heightClipPercentage}% ${widthClipPercentage}% ${heightClipPercentage}% ${widthClipPercentage}%)`;
      },
    },
    {
      scrollTrigger: {
        trigger: ".project-banner",
        start: "top top",
        end: "bottom 50%",
        scrub: 1,
        pin: true,
        // markers: true,
      },
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.4,
      ease: "power2.out",
    }
  );

  gsap.fromTo(
    ".project-banner .banner-img img",
    {
      scale: 1.4,
    },
    {
      scrollTrigger: {
        trigger: ".project-banner",
        start: "top top",
        end: "bottom 70%",
        scrub: 1,
      },
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    }
  );
}
function spotlightNextProject() {
  if (window.innerWidth < 991) return;
  if ($(".project-spotlight").length < 1) return;
  const cursor = document.getElementById("cursor-next-project");
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 10 + "px";
    cursor.style.top = e.clientY - 10 + "px";
  });
  const spotlight = document.querySelector(".project-spotlight");
  spotlight.addEventListener("mousemove", (e) => {
    updateMousePosition(spotlight, e);
  });
  [spotlight].forEach((element) => {
    element.addEventListener("touchmove", (e) => {
      // e.preventDefault();
      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--mouse-x", `${x}%`);
      element.style.setProperty("--mouse-y", `${y}%`);
    });

    element.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      updateMousePosition(element, {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    });
  });
  spotlight.addEventListener("mouseleave", () => {
    spotlight.style.setProperty("--mouse-x", "50%");
    spotlight.style.setProperty("--mouse-y", "50%");
  });
  function updateMousePosition(element, event) {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty("--mouse-x", `${x}%`);
    element.style.setProperty("--mouse-y", `${y}%`);
  }
  [spotlight].forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.display = "none";
    });

    element.addEventListener("mouseleave", () => {
      cursor.style.display = "block";
    });
  });
}
function scrollCTA() {
  if ($(".tt-draggable").length < 1) return;
  ScrollTrigger.refresh();

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    paused: true,
    onUpdate: (self) => {
      self.direction === 1
        ? $(".tt-draggable").addClass("hide")
        : $(".tt-draggable").removeClass("hide");
    },
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  scrollCTA();

  spotlightNextProject();
  animateBannerProjectDetail();
  header();
  scrollToForm();
  stickyFilter();
  pinSectionBanner();
  customDropdown();
  effectText();
  introChess();
  whyChooseUs();
  coreValue();
  showCoreValue();
  magicCursor();
  addThemeLightToHeader();
  hoverVideo();
  hoverNumberCount();
  hoverIcon();
  contactForm();
  handlePageVisibilityAndFavicon();
  projectDetail();
  scrollInfiniteProject();
  magicCursorV2();
  setTimeout(() => {
    cookieModal();
  }, 5000);
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
// loadpage
let isLinkClicked = false;
$("a").on("click", function (e) {
  // Nếu liên kết dẫn đến trang khác (không phải hash link hoặc javascript void)
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
    console.log("1");
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
