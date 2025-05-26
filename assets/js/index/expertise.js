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
      pinSpacing: false,
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

function buildABrand() {
  if ($(".build-a-brand").length < 1) return;

  const tab = $(".build-a-brand .tab-wrapper .item");

  // Hàm để tạo và chạy animation cho tab hiện tại
  function animateTabContent(activeTabData) {
    // Chọn nội dung của tab hiện tại
    const contentItem = $(
      `.wrapper-content .item[data-branding="${activeTabData}"]`
    );
    const contentElement = contentItem.find(".h1-heading");
    const tagElement = contentItem.find(".desc");

    // Kiểm tra xem phần tử có tồn tại và có nội dung không
    if (contentElement.length === 0 || tagElement.length === 0) {
      console.warn(
        `Không tìm thấy .h1-heading hoặc .desc trong tab ${activeTabData}`
      );
      return;
    }

    // Đảm bảo nội dung hiển thị trước khi chạy SplitText
    contentItem.removeClass("d-none");

    // Tạo SplitText cho heading của tab hiện tại
    const splitContent = new SplitText(contentElement, {
      type: "words,lines",
      linesClass: "line",
    });

    // Tạo timeline mới
    let tl = gsap.timeline();
    tl.fromTo(
      splitContent.lines,
      { opacity: 0, yPercent: 100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.1,
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

    // Chạy animation cho tab hiện tại
    animateTabContent(dataThisTab);
  });

  // ScrollTrigger để kích hoạt tab mặc định
  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: "top 70%",
    end: "bottom top",
    onEnter: () => {
      const defaultTab = $(
        ".build-a-brand .tab-wrapper .item[data-branding='2']"
      );
      if (!defaultTab.hasClass("active")) {
        defaultTab.addClass("active");
        const content = $(".build-a-brand .wrapper-content");
        content.find(".item").addClass("d-none");
        content.find(`.item[data-branding='2']`).removeClass("d-none");
        animateTabContent("2");
      }
    },
    onLeaveBack: () => {
      $(".build-a-brand .tab-wrapper .item").removeClass("active");
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
  console.log("expertise-core-value");

  gsap.set(".expertise-core-value .content-ovl", {
    autoAlpha: 0,
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".expertise-core-value",
      start: "top 10%",
      end: "+=40%",
      scrub: true,
      // markers: true
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
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  buildABrand();
  introBrading();
  showCoreValue();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
