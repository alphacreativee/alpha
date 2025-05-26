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

  const totalHeight = chessItemsHeight + 200;

  // Tạo spacer
  let spacer = document.querySelector(".banner-expertise-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.classList.add("banner-expertise-spacer");
    document
      .querySelector(".banner-expertise")
      .insertAdjacentElement("afterend", spacer);
  }
  spacer.style.height = `${totalHeight}px`;

  const items = gsap.utils.toArray(".wrapper-chess .chess-item");

  gsap.set(items, { y: "120%" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-expertise",
      start: "top top",
      end: `+=${totalHeight}px`,
      scrub: true,
      pin: true,
      pinSpacing: false
    }
  });

  items.forEach((item) => {
    tl.to(item, {
      y: "0%",
      duration: 0.6,
      ease: "none"
    });
  });
}

function buildABrand() {
  if ($(".build-a-brand").length < 1) return;

  const tab = $(".build-a-brand .tab-wrapper .item");

  tab.on("click", function () {
    let thisTab = $(this);
    let dataThisTab = thisTab.data("branding");
    if (thisTab.hasClass("active")) return;

    tab.removeClass("active");
    thisTab.addClass("active");

    // Update content based on the active tab
    const content = $(".build-a-brand .wrapper-content");
    content.find(".item").addClass("d-none");
    content.find(`.item[data-branding="${dataThisTab}"]`).removeClass("d-none");

    const whyChooseUs = $(".why-choose-us.page-expertise");
    if (whyChooseUs.length > 0) {
      $(".why-choose-us.page-expertise .main-section").addClass("d-none");
      $(
        `.why-choose-us.page-expertise .main-section[data-branding="${dataThisTab}"]`
      ).removeClass("d-none");
    }
  });

  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: "top 70%",
    end: "bottom top",
    // markers: true,
    onEnter: () => {
      $(".build-a-brand .tab-wrapper .item[data-branding='2']").addClass(
        "active"
      );
    },
    onLeaveBack: () => {
      $(".build-a-brand .tab-wrapper .item").removeClass("active");
    }
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
      end: "bottom top"
      // markers: true
    },
    onUpdate: render2
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
  gsap.to(".section-intro", {
    scrollTrigger: {
      trigger: ".section-intro",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false
      // markers: true,
    }
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  buildABrand();
  introBrading();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
