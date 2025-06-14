import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;
// Detect problematic devices
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isOldAndroid = /Android [1-6]/.test(navigator.userAgent);

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
  wheelMultiplier: 1,
  normalizeWheel: true,
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
      document.title = "Alpha Creative - Thiết kế cảm xúc cho thương hiệu";
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
    const favicons = [
      "./assets/images/use/favicon-gold.svg",
      "./assets/images/use/favicon-black.svg",
    ];
    let faviconIndex = 0;

    faviconInterval = setInterval(() => {
      changeFavicon(favicons[faviconIndex]);
      faviconIndex = (faviconIndex + 1) % favicons.length;
    }, 500);
  }

  function stopFaviconBlinking() {
    clearInterval(faviconInterval);
    isBlinking = false;
    changeFavicon("./assets/images/use/favicon-black.svg");
  }
}
window.addEventListener("load", (event) => {
  handlePageVisibilityAndFavicon();
});

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
        type: "words,lines",
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

  // Thiết lập canvas
  const canvas = document.getElementById("canvas-chess");
  const context = canvas.getContext("2d");

  // Mobile viewport handling
  const isMobile = window.innerWidth <= 991;
  let initialViewportHeight = window.innerHeight;
  let initialViewportWidth = window.innerWidth;

  // Lưu kích thước ban đầu cho mobile
  if (isMobile) {
    // Sử dụng screen.height thay vì innerHeight cho mobile
    initialViewportHeight = Math.max(window.innerHeight, screen.height * 0.6);
  }

  canvas.width = initialViewportWidth;
  canvas.height = initialViewportHeight;

  // Debounce function để tối ưu resize
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Mobile-specific resize handler
  const handleResize = debounce(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Trên mobile, chỉ resize khi width thay đổi hoặc height thay đổi đáng kể
    if (isMobile) {
      const widthChanged = Math.abs(newWidth - canvas.width) > 10;
      const heightChanged = Math.abs(newHeight - initialViewportHeight) > 100; // Chỉ resize khi thay đổi > 100px

      if (widthChanged) {
        // Width thay đổi (xoay màn hình)
        canvas.width = newWidth;
        initialViewportWidth = newWidth;

        // Cập nhật height nếu cần
        if (heightChanged) {
          canvas.height = newHeight;
          initialViewportHeight = newHeight;
        }

        requestAnimationFrame(() => {
          render();
        });
      }
      // Bỏ qua các thay đổi nhỏ của height (ẩn/hiện thanh địa chỉ)
    } else {
      // Desktop: resize bình thường
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        requestAnimationFrame(() => {
          render();
        });
      }
    }
  }, 150);

  window.addEventListener("resize", handleResize);

  // Orientation change handler cho mobile
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;
      initialViewportWidth = newWidth;
      initialViewportHeight = newHeight;

      requestAnimationFrame(() => {
        render();
      });
    }, 300); // Delay lâu hơn để đảm bảo orientation đã thay đổi xong
  });

  const frameCount = 130;
  const sectionIntro = document.querySelector(".section-intro");
  let currentFrame;

  const url = canvas.getAttribute("data-assets")
    ? canvas.getAttribute("data-assets")
    : ".";

  if (sectionIntro.classList.contains("home")) {
    currentFrame = (index) =>
      `${url}/assets/images/intro-chess/chess-${(index + 1).toString()}.jpg`;
  } else if (sectionIntro.classList.contains("about")) {
    currentFrame = (index) =>
      `${url}/assets/images/img-about/chess-${(index + 1).toString()}.jpg`;
  } else {
    currentFrame = (index) =>
      `${url}/assets/images/intro-chess/chess-${(index + 1).toString()}.jpg`;
  }

  const images = [];
  const imageSeq = { frame: 0 };
  let imagesLoaded = 0;

  // Tải hình ảnh và theo dõi khi tất cả được tải
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === frameCount) {
        render();
      }
    };
    img.onerror = () => {
      console.error(`Không tải được hình ảnh: ${img.src}`);
    };
    images[i] = img;
  }

  // Hiệu ứng GSAP cho chuỗi khung hình
  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 1,
      trigger: "#canvas-chess",
      start: "top+=100 bottom",
      end: "bottom top",
      // markers: true,
    },
    onUpdate: render,
  });

  // Hiệu ứng cho section-intro-content
  const sectionIntroContent = document.querySelector(".section-intro-content");
  const tagElement = document.querySelector(".section-intro-content .tag");
  const contentElement = document.querySelector(
    ".section-intro-content .h2-heading"
  );

  // Khởi tạo SplitText cho content
  const splitContent = new SplitText(contentElement, {
    type: "words,lines",
    mask: "lines",
    linesClass: "line",
  });

  // Tạo timeline cho hiệu ứng vào và ngược lại
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#canvas-chess",
      start: `top+=${(110 / frameCount) * 100 - 20}% top`,
      end: `top+=${(110 / frameCount) * 100 + 20}% top`,
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(sectionIntroContent, { opacity: 0 }, { opacity: 1, duration: 0.4 });
  tl.fromTo(
    tagElement,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }
  );
  tl.fromTo(
    splitContent.lines,
    { opacity: 0, yPercent: 100 },
    { opacity: 1, yPercent: 0, duration: 0.3, stagger: 0.05, ease: "expo.out" },
    "-=0.1"
  );

  function render() {
    if (images[imageSeq.frame] && images[imageSeq.frame].complete) {
      scaleImage(images[imageSeq.frame], context);
    }
  }

  function scaleImage(img, ctx) {
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  // Ghim section-intro

  gsap.to(".section-intro", {
    scrollTrigger: {
      trigger: ".section-intro",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      // markers: true,
      // Thêm những tùy chọn này cho mobile
      // Tối ưu cho mobile
      fastScrollEnd: true,
      preventOverlaps: true,
      onToggle: (self) => {
        if (isMobile && window.lenis) {
          if (self.isActive) {
            window.lenis.stop(); // Dừng Lenis khi pin
          } else {
            window.lenis.start(); // Khởi động lại Lenis
          }
        }
      },
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
  if ($(window).width() < 991) return;
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
    ".project-item, .our-team-item"
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
function pinSectionBanner() {
  const banner = document.querySelector(".group-intro-banner");
  const bannerTitle = document.querySelector(".section-banner-title");
  let isTitleHidden = false;
  if (banner && bannerTitle) {
    gsap.to(banner, {
      scrollTrigger: {
        trigger: banner,
        pin: true,
        pinSpacing: false,
        start: "top top",
        end: `+=${window.innerHeight}`,
        scrub: true,
        // markers: true,
        onUpdate: (self) => {
          if (self.progress === 1 && !isTitleHidden) {
            gsap.to(bannerTitle, {
              opacity: 0,
              duration: 0.3,
              ease: "power2.out",
            });
            isTitleHidden = true;
          } else if (self.progress < 1 && isTitleHidden) {
            gsap.to(bannerTitle, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
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
          scaleY: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0.6
      )
      .to(loading, {
        autoAlpha: 0,
      });
  } else {
    gsap.delayedCall(3.55, effectTextBanner);
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
        loading.find(".loading-desc"),
        {
          opacity: 0,
          y: -40,
          duration: 0.5,
          ease: "power2.out",
        },
        2.8
      )
      .to(
        loading.find(".loading-wrapper"),
        {
          scaleY: 0,
          duration: 1,
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
      type: "words,lines",
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
  contentItems[0].classList.add("active");
  Array.from(contentItems)
    .slice(1)
    .forEach((item) => {
      item.classList.remove("active");
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
            item.classList.add("active");
          } else {
            item.classList.remove("active");
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
      type: "words,lines",
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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);

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
  setTimeout(() => {
    cookieModal();
  }, 5000);
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
