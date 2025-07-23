import { preloadImages } from "../../libs/utils.js";

function animateChessItems() {
  if (!$(".banner-expertise").length) return;

  const banner = document.querySelector(".section-banner.banner-expertise");
  const chessItems = document.querySelectorAll(".wrapper-chess .chess-item");
  const wrapperChess = document.querySelector(".wrapper-chess");

  const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = window.innerWidth <= 991;

  const totalHeight = isIPhone
    ? window.innerHeight + 50
    : window.innerHeight + 100;

  // Tạo spacer
  let spacer = document.querySelector(".banner-expertise-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.classList.add("banner-expertise-spacer");
    document
      .querySelector(".banner-expertise")
      .insertAdjacentElement("afterend", spacer);
  }
  if (window.innerWidth <= 991) {
    spacer.style.height = `${totalHeight}px`;
  } else {
    spacer.style.height = `${totalHeight / 2 + 1}px`;
  }

  const items = gsap.utils.toArray(".wrapper-chess .chess-item");

  gsap.set(items, { y: "120%" });
  const endValueMobileEx = window.innerWidth <= 991 ? "+=100%" : "+=50%";
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-expertise",
      start: "top top",
      end: endValueMobileEx,
      scrub: true,
      pin: true,
      pinSpacing: false,
      // markers: true,
    },
  });

  // Tính toán để phần tử cuối vẫn hiển thị
  const totalItems = items.length;
  const durationValue = window.innerWidth < 991 ? 1 : 0.6;
  // Animation cho từng item
  items.forEach((item, index) => {
    // Animation item slide up
    tl.to(item, {
      y: "0%",
      duration: durationValue,
      ease: "none",
    });

    // Trên mobile: đẩy wrapper sang trái
    if (isMobile) {
      // Tính toán để item cuối vẫn hiển thị
      // Chia đều khoảng đẩy cho tất cả items
      const maxPushPercent = 50; // Tối đa đẩy 50%
      const pushPerItem = maxPushPercent / totalItems;
      const pushAmount = (index + 1) * -pushPerItem;

      tl.to(
        wrapperChess,
        {
          x: `${pushAmount}%`,
          duration: 1,
          ease: "power2.out",
        },
        ">"
      );

      tl.to(
        item,
        {
          scale: 0.9,

          duration: 0.5,
          ease: "power2.out",
        },
        ">"
      );
    }
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
      type: "lines",
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
  const topValue = window.innerWidth < 991 ? "top 60%" : "top 40%";
  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: topValue,
    end: "bottom top",
    // markers: true,
    onEnter: () => {
      const brandingValue = window.innerWidth < 991 ? "1" : "2";
      const defaultTab = $(
        `.build-a-brand .tab-wrapper .item[data-branding='${brandingValue}']`
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

  const pinValueBrand =
    window.innerHeight < 991 ? "top+=7% top" : "top+=5% top";
  ScrollTrigger.create({
    trigger: ".build-a-brand",
    start: "top+=3% top",
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
