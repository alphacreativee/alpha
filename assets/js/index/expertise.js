import { preloadImages } from "../../libs/utils.js";

function animateChessItems() {
  if (!$(".banner-expertise").length) return;

  // Tính tổng chiều cao
  const banner = document.querySelector(".section-banner.banner-expertise");
  const chessItems = document.querySelectorAll(".wrapper-chess .chess-item");

  // Tính chiều cao của banner
  const bannerHeight = banner ? banner.getBoundingClientRect().height : 0;

  // Tính tổng chiều cao của tất cả chess-item
  let chessItemsHeight = 0;
  chessItems.forEach((item) => {
    chessItemsHeight += item.getBoundingClientRect().height;
  });

  const totalHeight =
    bannerHeight + chessItemsHeight - window.innerHeight + 200;

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
      end: "+=200%",
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
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animateChessItems();
  buildABrand();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
