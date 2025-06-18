import { preloadImages } from "../../libs/utils.js";

function ourStory() {
  if (!document.querySelector(".our-story")) return;
  gsap.set(".our-story .content:not(:first-child)", { yPercent: 100 });

  // Lấy tất cả các phần tử .content không có class first-child
  const contents = gsap.utils.toArray(".our-story .content:not(:first-child)");
  const texts = gsap.utils.toArray(".text-wrap .text");

  const contentTimeline = gsap.timeline();
  // Tính tổng chiều cao
  const totalHeight = document.querySelectorAll(".our-story .content")
    ? Array.from(document.querySelectorAll(".our-story .content")).reduce(
        (acc, el) => acc + el.offsetHeight,
        0
      )
    : 0;

  let spacer = document.querySelector(".our-story-spacer");
  if (!spacer) {
    spacer = document.createElement("div");
    spacer.classList.add("our-story-spacer");
    document
      .querySelector(".our-story")
      .insertAdjacentElement("afterend", spacer);
  }
  spacer.style.height = `${totalHeight}px`;

  ScrollTrigger.create({
    trigger: ".our-story",
    start: "top top",
    end: `+=${totalHeight}`, // dùng chiều cao động
    pin: true,
    scrub: true,
    // markers: true,
    animation: contentTimeline,
    pinSpacing: false,
    onUpdate: (self) => {
      const progress = self.progress;
      const step = 1 / (contents.length + 1);

      let activeIndex = Math.floor(progress / step);
      if (activeIndex >= texts.length) activeIndex = texts.length - 1;

      texts.forEach((text, index) => {
        const isActive = index === activeIndex;
        text.classList.toggle("active", isActive);
        text.classList.toggle("text-effect-gradient-not-effect", isActive);
      });
    }
  });

  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0,
      duration: 0.5,
      // boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.4)",
      ease: "power2.out"
    });
  });
}

function gsapexpertise2() {
  ScrollTrigger.create({
    trigger: ".wrapper-expertise2",
    start: "top 65%",
    // markers: true,
    onEnter: () => {
      document
        .querySelector(".wrapper-expertise2")
        .classList.add("theme-light");
      document
        .querySelector(".header-menu-container")
        .classList.add("theme-light");
    },
    onLeaveBack: () => {
      document
        .querySelector(".wrapper-expertise2")
        .classList.remove("theme-light");
      document
        .querySelector(".header-menu-container")
        .classList.remove("theme-light");
    }
    // markers: true
  });
  if (window.innerWidth < 991) return;
  const wrapperexpertise2 = $(".wrapper-expertise2");

  if (wrapperexpertise2.length > 0) {
    wrapperexpertise2.each(function (index, wrapper) {
      const expertise2 = $(wrapper).find(".expertise2");

      // Hàm để tính toán lượng cuộn cần thiết
      const getScrollAmount = () => {
        const racesWidth = expertise2[0].scrollWidth;
        return racesWidth - window.innerWidth + 0; // Xóa +200 để tối ưu
      };

      // Hàm để tạo tween animation cho expertise2
      const createTween = (expertise2, scrollAmount) => {
        return gsap.to(expertise2, {
          x: -scrollAmount,
          duration: 3,
          ease: "none"
        });
      };

      // Hàm để tính một nửa tổng chiều cao của các .expertise2-item
      const getTotalHeight = () => {
        const items = wrapper.querySelectorAll(".expertise2-item");
        const total = Array.from(items).reduce(
          (acc, el) => acc + el.offsetHeight,
          0
        );
        return total / 7; // Trả về một nửa tổng chiều cao
      };

      // Hàm để tạo hoặc cập nhật spacer
      const updateSpacer = (scrollAmount) => {
        let spacer = wrapper.querySelector(".expertise2-spacer");
        if (!spacer) {
          spacer = document.createElement("div");
          spacer.classList.add("expertise2-spacer");
          wrapper.insertAdjacentElement("afterend", spacer);
        }
        // Đặt chiều cao spacer bằng một nửa totalHeight hoặc scrollAmount
        const totalHeight = getTotalHeight();
        spacer.style.height = `${Math.max(totalHeight, scrollAmount)}px`;
      };

      // Hàm để tạo ScrollTrigger
      const createScrollTrigger = (wrapper, tween, scrollAmount) => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: `+=${scrollAmount * 1}`, // Rút ngắn 80% để giảm thời gian cuộn
          pin: true,
          animation: tween,
          scrub: 1,
          pinSpacing: false, // Quản lý chiều cao bằng spacer
          invalidateOnRefresh: true,
          id: `expertise2Scroll-${index}`
          // markers: true,
        });
      };

      // Tính toán chiều cao và lượng cuộn
      const scrollAmount = getScrollAmount();
      updateSpacer(scrollAmount);

      // Tạo tween animation
      const tween = createTween(expertise2, scrollAmount);
      // Tạo ScrollTrigger
      createScrollTrigger(wrapper, tween, scrollAmount);
    });

    // Xử lý animation cho các .expertise2-item
    const containerTrigger = ScrollTrigger.getById(`expertise2Scroll-0`);

    if (!containerTrigger) return;

    const items = gsap.utils.toArray(".expertise2-item:not(.item-title-large)");

    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        containerAnimation: containerTrigger.animation,
        start: "left 80%",
        onEnter: () => item.classList.add("active"),
        onLeaveBack: () => item.classList.remove("active"),
        invalidateOnRefresh: true
        // markers: true,
      });
    });

    // Làm mới ScrollTrigger
    ScrollTrigger.refresh();

    const itemImgExpertise2 = $(
      ".wrapper-expertise2 .expertise2-item .item-content:not(.empty)"
    );
    itemImgExpertise2.on("mouseenter", function () {
      $(this).addClass("hover");
    });
    itemImgExpertise2.on("mouseleave", function () {
      $(this).removeClass("hover");
    });
  }
}

function ourTeam() {
  const teamItems = gsap.utils.toArray(".our-team-item");

  if (window.innerWidth > 991) {
    gsap.set(teamItems, {
      opacity: 0,
      y: 100
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".our-team-list",
        start: "top 90%",
        end: "bottom 70%",
        scrub: 1
      }
    });

    tl.to(teamItems, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15
    });
  } else {
    gsap.set(teamItems, {
      opacity: 0,
      y: 50
    });
    teamItems.forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse"
          // markers: true,
        }
      });
    });
  }
}

function swiperTeam() {
  if ($("#modal-teams").length < 1) return;

  const itemModal = $("[modal-team]");
  const itemModalClose = $("#modal-teams").find(".btn-close");
  const defaultDuration = 15000;

  // Hàm cập nhật progress bar
  function updateProgressBars(swiper) {
    var bullets = swiper.pagination.bullets;
    bullets.forEach((bullet, index) => {
      let progressBar = bullet.querySelector(".progress-bar");
      if (index < swiper.realIndex) {
        // Bullet của slide đã xem trước đó
        bullet.classList.add("viewed");
        progressBar.style.width = "100%";
        progressBar.style.transition = "none";
      } else if (index === swiper.realIndex) {
        // Bullet của slide hiện tại: chạy progress bar từ 0% đến 100%
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
        setTimeout(() => {
          progressBar.style.width = "100%";
          progressBar.style.transition = `width ${
            swiper.params.autoplay.delay || defaultDuration
          }ms linear`;
        }, 10);
      } else {
        // Bullet của slide chưa xem
        bullet.classList.remove("viewed");
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
      }
    });
  }

  const swiper = new Swiper(".swiper-team", {
    slidesPerView: 1,
    effect: "fade",
    spaceBetween: 0,
    navigation: {
      nextEl: ".swiper-team .swiper-button-next",
      prevEl: ".swiper-team .swiper-button-prev"
    },
    pagination: {
      el: ".swiper-team .swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `
          <button class="${className}">
            <span class="progress-bar"></span>
          </button>`;
      }
    },
    autoplay:
      window.innerWidth <= 991
        ? {
            delay: defaultDuration,
            disableOnInteraction: false
          }
        : false,
    on: {
      slideChangeTransitionStart: function (swiper) {
        if (swiper.params.autoplay) {
          swiper.params.autoplay.delay = defaultDuration;
        }
      },
      slideChangeTransitionEnd: function (swiper) {
        updateProgressBars(swiper);
      },
      init: function (swiper) {
        // Khởi tạo progress bar khi swiper được tạo
        if (window.innerWidth <= 991) {
          updateProgressBars(swiper);
        }
      }
    }
  });

  itemModal.on("click", function (e) {
    e.preventDefault();

    const index = $(this).data("slider") || 0;

    $("#modal-teams").addClass("show");
    $("body").addClass("overflow-hidden");

    swiper.slideTo(index);

    // Cập nhật progress bar khi mở modal
    if (window.innerWidth <= 991) {
      updateProgressBars(swiper);
    }
  });

  itemModalClose.on("click", function () {
    $("#modal-teams").removeClass("show");
    $("body").removeClass("overflow-hidden");
  });

  let scrollTimeout;
  $("#modal-teams").on("wheel", function (e) {
    e.preventDefault();

    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
    }, 500);

    const deltaY = e.originalEvent.deltaY;
    const currentIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    if (deltaY > 0 && currentIndex < totalSlides - 1) {
      swiper.slideNext();
    } else if (deltaY < 0 && currentIndex > 0) {
      swiper.slidePrev();
    }
  });
}
function coreValueItemMobile() {
  if (!$(".wrapper-expertise2").length && window.innerWidth > 991) return;

  const coreValueItem = gsap.utils.toArray(
    ".wrapper-expertise2 .expertise2-item"
  );

  gsap.set(coreValueItem, {
    y: 70,
    opacity: 0
  });

  coreValueItem.forEach((item, index) => {
    gsap.to(item, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom bottom"
        // markers: true,
      }
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  ourTeam();
  ourStory();
  gsapexpertise2();
  swiperTeam();
  coreValueItemMobile();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
