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

  // const totalHeight = chessItemsHeight;
  const totalHeight = window.innerHeight;

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

  const frameCount2 = 131;

  let currentFrame = (index) =>
    `./assets/images/expertise-img/img-${(index + 1).toString()}.jpg`;

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
      scrub: 2,
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

  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: "top+=10% top",
    // markers: true,
    onEnter: () => {
      document.querySelector(".build-a-brand").classList.add("active");
    },
    onLeaveBack: () => {
      document.querySelector(".build-a-brand").classList.remove("active");
    },
  });

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
  const contentItems = document.querySelectorAll(".content-item-lg");
  const contentOvl = document.querySelector(
    ".expertise-core-value .content-ovl"
  );

  gsap.set(contentOvl, {
    autoAlpha: 0,
  });
  if (contentItems.length === 0) return;

  gsap.set(contentItems[0], {
    fontSize: "80px",
    lineHeight: "88px",
    fontWeight: "100",
  });
  gsap.set(Array.from(contentItems).slice(1), {
    fontSize: "20px",
    lineHeight: "28px",
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".expertise-core-value",
      start: "top top",
      end: "+=300%",
      scrub: true,
      // markers: true,
      pin: true,
      onUpdate: (self) => {
        // console.log(self.progress);
      },
    },
  });

  let currentTime = 0;

  // Item đầu tiên: từ 80px xuống 20px
  tl2.to(
    contentItems[0],
    {
      fontSize: "20px",
      lineHeight: "28px",
      duration: 0.5, // Giảm từ 1 xuống 0.5
      ease: "none",
      fontWeight: "100",
    },
    currentTime
  );
  currentTime += 0.5; // Cập nhật theo duration mới

  // Các item còn lại: lần lượt từ 20px lên 80px
  contentItems.forEach((item, index) => {
    if (index > 0) {
      // Lên 80px
      tl2.to(
        item,
        {
          fontSize: "80px",
          lineHeight: "88px",
          duration: 0.5, // Giảm từ 1 xuống 0.5
          ease: "none",
          fontWeight: "100",
        },
        currentTime
      );
      currentTime += 0.5; // Cập nhật theo duration mới

      // Chỉ xuống 20px nếu KHÔNG phải item cuối cùng
      if (index < contentItems.length - 1) {
        tl2.to(
          item,
          {
            fontSize: "20px",
            lineHeight: "28px",
            duration: 0.5, // Giảm từ 1 xuống 0.5
            ease: "none",
            fontWeight: "100",
          },
          currentTime
        );
        currentTime += 0.5; // Cập nhật theo duration mới
      }
    }
  });

  // Hiển thị contentOvl sau khi tất cả animation hoàn thành
  tl2.to(
    contentOvl,
    {
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
    },
    currentTime
  );

  // Tăng currentTime để tạo thêm khoảng scroll giữ contentOvl hiển thị
  currentTime += 1;
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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  buildABrand();
  introBrading();
  showCoreValue();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
