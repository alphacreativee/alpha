import { preloadImages } from "../../libs/utils.js";

function animateChessItems() {
  if (!$(".banner-expertise").length) return;

  const banner = document.querySelector(".section-banner.banner-expertise");
  const chessItems = document.querySelectorAll(".wrapper-chess .chess-item");

  const bannerHeight = banner ? banner.getBoundingClientRect().height : 0;

  let chessItemsHeight = 0;
  chessItems.forEach((item) => {
    chessItemsHeight += item.getBoundingClientRect().height;
  });

  const totalHeight = chessItemsHeight - 200;

  // Tạo spacer
  let spacer = document.querySelector(".banner-expertise-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.classList.add("banner-expertise-spacer");
    document
      .querySelector(".banner-expertise")
      .insertAdjacentElement("afterend", spacer);
  }
  spacer.style.height = `${totalHeight / 2}px`;

  const items = gsap.utils.toArray(".wrapper-chess .chess-item");

  gsap.set(items, { y: "120%" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-expertise",
      start: "top top",
      end: `+=100%`,
      scrub: true,
      pin: true,
      pinSpacing: false,
      // markers: true,
    },
  });

  items.forEach((item) => {
    tl.to(item, {
      y: "0%",
      duration: 0.6,
      ease: "none",
    });
  });
}
// function animateChessItems() {
//   if (!$(".banner-expertise").length) return;

//   const items = gsap.utils.toArray(".wrapper-chess .chess-item");

//   gsap.set(items, { y: "100%", opacity: 0 });

//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: ".wrapper-chess",
//       start: "top 30%",
//       toggleActions: "play none none reverse",
//       markers: true,
//     },
//   });

//   tl.to(items, {
//     y: "0%",
//     opacity: 1,
//     duration: 0.6,
//     ease: "power2.out",
//     stagger: 0.3,
//   });
// }

function buildABrand() {
  if ($(".build-a-brand").length < 1) return;

  const tab = $(".build-a-brand .tab-wrapper .item");

  // Hàm để tạo và chạy animation cho tab hiện tại
  function animateTabContent(activeTabData) {
    // Chọn nội dung của tab hiện tại
    const contentItem = $(
      `.build-a-brand .wrapper-content .item[data-branding="${activeTabData}"]`
    );

    if (contentItem.length === 0) {
      console.warn(`Không tìm thấy nội dung cho tab ${activeTabData}`);
      return;
    }

    const contentElement = contentItem.find(".h1-heading");
    const tagElement = contentItem.find(".desc");

    // Đảm bảo nội dung hiển thị trước khi chạy SplitText
    contentItem.removeClass("d-none");

    // Tạo SplitText cho heading của tab hiện tại
    const splitContent = new SplitText(contentElement, {
      type: "words,lines",
      linesClass: "line",
      mask: "lines",
    });

    // Tạo timeline mới
    let tl = gsap.timeline();
    tl.fromTo(
      splitContent.lines,
      { opacity: 0, yPercent: 100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        stagger: 0.13,
        ease: "expo.out",
      }
    );
    // Hiệu ứng cho tag
    tl.fromTo(
      tagElement,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }
    );

    return tl;
  }

  // Xử lý sự kiện click tab
  tab.on("click", function () {
    let thisTab = $(this);
    let dataThisTab = thisTab.data("branding");

    if (thisTab.hasClass("active")) return;

    // Cập nhật trạng thái tab
    tab.removeClass("active");
    thisTab.addClass("active");

    // Cập nhật nội dung hiển thị
    const content = $(".build-a-brand .wrapper-content");
    content.find(".item").addClass("d-none");
    const activeContent = content.find(`.item[data-branding="${dataThisTab}"]`);

    if (activeContent.length === 0) {
      console.warn(`Không tìm thấy nội dung cho tab ${dataThisTab}`);
      return;
    }

    activeContent.removeClass("d-none");

    // Cập nhật section why-choose-us nếu có
    const whyChooseUs = $(".why-choose-us.page-expertise");
    if (whyChooseUs.length > 0) {
      whyChooseUs.find(".main-section").addClass("d-none");
      const activeSection = whyChooseUs.find(
        `.main-section[data-branding="${dataThisTab}"]`
      );
      if (activeSection.length > 0) {
        activeSection.removeClass("d-none");
      } else {
        console.warn(`Không tìm thấy main-section cho tab ${dataThisTab}`);
      }
    }

    animateTabContent(dataThisTab);
  });

  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: "top 40%",
    end: "bottom top",
    // markers: true,
    onEnter: () => {
      const defaultTab = $(
        ".build-a-brand .tab-wrapper .item[data-branding='2']"
      );
      if (!defaultTab.hasClass("active")) {
        // Cập nhật trạng thái tab mặc định
        tab.removeClass("active");
        defaultTab.addClass("active");

        // Cập nhật nội dung hiển thị
        const content = $(".build-a-brand .wrapper-content");
        content.find(".item").addClass("d-none");
        const defaultContent = content.find(`.item[data-branding='2']`);
        defaultContent.removeClass("d-none");

        // Chạy animation cho tab mặc định
        animateTabContent("2");
      }
    },
    onLeaveBack: () => {
      // Reset trạng thái khi scroll ngược ra khỏi section
      tab.removeClass("active");
      $(".build-a-brand .wrapper-content .item").addClass("d-none");
    },
  });
}
function introBrading() {
  if (document.querySelectorAll(".build-a-brand").length < 1) return;

  // Khởi tạo Lenis cho cuộn mượt
  const lenis = new Lenis();
  lenis.on("scroll", () => ScrollTrigger.update());
  const scrollFn = (time) => {
    lenis.raf(time * 1000);
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);

  // Đăng ký plugin ScrollTrigger và SplitText
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Thiết lập canvas
  const canvas2 = document.getElementById("intro-branding");
  const context = canvas2.getContext("2d");

  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    render2();
  });

  const frameCount2 = 74;

  let currentFrame = (index) =>
    `./assets/images/img-chess/chess-${(index + 1).toString()}.jpg`;

  const images2 = [];
  const imageSeq2 = { frame: 0 };
  let imagesLoaded2 = 0;

  // Tải hình ảnh và theo dõi khi tất cả được tải
  for (let i = 0; i < frameCount2; i++) {
    const img2 = new Image();
    img2.src = currentFrame(i);
    img2.onload = () => {
      imagesLoaded2++;
      if (imagesLoaded2 === frameCount2) {
        render2();
      }
    };
    img2.onerror = () => {
      console.error(`Không tải được hình ảnh: ${img2.src}`);
    };
    images2[i] = img2;
  }

  // Hiệu ứng GSAP cho chuỗi khung hình
  gsap.to(imageSeq2, {
    frame: frameCount2 - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 1,
      trigger: "#intro-branding",
      start: "top bottom",
      end: "bottom top",
      // markers: true
    },
    onUpdate: render2,
  });

  function render2() {
    if (images2[imageSeq2.frame] && images2[imageSeq2.frame].complete) {
      scaleImage(images2[imageSeq2.frame], context);
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
  if (!$(".section-intro").length) return;

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
function showCoreValue() {
  if ($(".expertise-core-value").length < 1) return;

  gsap.set(".expertise-core-value .content-ovl", {
    autoAlpha: 0,
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".expertise-core-value",
      start: "top 10%",
      end: "bottom bottom",
      scrub: true,
      // markers: true
      onUpdate: (self) => {
        if (self.progress === 1) {
          $(".expertise-core-value .content-ovl").addClass("active");
        } else {
          $(".expertise-core-value .content-ovl").removeClass("active");
        }
      },
    },
  });

  // Thêm animation vào timeline
  tl2.to(".expertise-core-value .content-ovl", {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
  });
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
  const items = document.querySelectorAll(".build-a-brand .tab-wrapper .item");
  const buttons = document.querySelectorAll(".btn-large");

  items.forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      callParallax(e);
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        duration: 0.3,
        height: 40,
        width: 42,
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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  buildABrand();
  introBrading();
  showCoreValue();
  hoverIcon();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
