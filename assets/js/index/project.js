import { preloadImages } from "../../libs/utils.js";

function sliderProject() {
  if ($(".swiper-project").length < 1) return;
  let interleaveOffsetTour = 0.8;
  var swiperProject = $(".swiper-project");
  const defaultDuration = 2000; // Thời gian autoplay cố định (1000ms)

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
          progressBar.style.transition = `width ${swiper.params.autoplay.delay}ms linear`;
        }, 10);
      } else {
        // Bullet của slide chưa xem
        bullet.classList.remove("viewed");
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
      }
    });
  }

  swiperProject.each(function () {
    var $this = $(this);

    var swiper = new Swiper($this[0], {
      slidesPerView: 1,
      speed: 1000,
      init: true,

      loopAdditionalSlides: 1,
      autoplay: false,
      watchSlidesProgress: true,

      pagination: {
        el: $this.find(".swiper-pagination")[0],
        clickable: true,
        renderBullet: function (index, className) {
          return `
            <button class="${className}">
              <span class="progress-bar"></span>
            </button>`;
        },
      },
      on: {
        progress: function (swiper) {
          swiper.slides.forEach(function (slide) {
            var slideProgress = slide.progress || 0;
            var innerOffset = swiper.width * interleaveOffsetTour;
            var innerTranslate = slideProgress * innerOffset;
            if (!isNaN(innerTranslate)) {
              var slideInner = slide.querySelector(".img-parallax");
              if (slideInner) {
                slideInner.style.transform =
                  "translate3d(" + innerTranslate + "px, 0, 0)";
              }
            }
          });
        },
        touchStart: function (swiper) {
          swiper.slides.forEach(function (slide) {
            slide.style.transition = "";
          });
        },
        setTransition: function (swiper, speed) {
          var easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
          swiper.slides.forEach(function (slide) {
            slide.style.transition = speed + "ms " + easing;
            var slideInner = slide.querySelector(".img-parallax");
            if (slideInner) {
              slideInner.style.transition = speed + "ms " + easing;
            }
          });
        },
        slideChangeTransitionStart: function (swiper) {
          swiper.params.autoplay.delay = defaultDuration; // Đặt lại delay
          swiper.autoplay.start();
        },
        slideChangeTransitionEnd: function (swiper) {
          updateProgressBars(swiper);
        },
      },
    });

    // Thêm sự kiện hover để kích hoạt/dừng autoplay
    $this.on("mouseenter", function () {
      swiper.autoplay.start({
        delay: defaultDuration, // 1000ms
        disableOnInteraction: false,
      });
      updateProgressBars(swiper);
    });

    $this.on("mouseleave", function () {
      swiper.autoplay.pause();
      swiper.slideToLoop(0, 1000, true); // Chuyển về slide đầu với hiệu ứng mượt
      setTimeout(() => {
        swiper.autoplay.stop();
      }, 1000);
    });
  });

  //   load project
}
function loadImg() {
  const projectItems = gsap.utils.toArray(".project-item");
  // Thiết lập riêng cho phần tử đầu tiên
  gsap.set(projectItems[0], {
    yPercent: 10, // yPercent: 10 cho phần tử đầu tiên
    opacity: 0,
  });

  // Tạo timeline với ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".project-list",
      start: "top 90%",
      end: "bottom 80%",
      scrub: 1,
      // markers: true,
    },
  });

  // Áp dụng hiệu ứng cho tất cả phần tử
  tl.to(projectItems, {
    yPercent: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out",
    stagger: 0.2, // Stagger cho tất cả phần tử
  });
}
function magicCursor() {
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
  var cursorText = document.querySelector(
    ".magic-cursor .cursor .text-content"
  );

  const itemsContent = document.querySelectorAll(".project-item");
  itemsContent.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.add("show");
    });
    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
    });
  });
}
function changeColor() {
  const blogPage = document.querySelector(".blog-page");
  if (!blogPage) {
    return;
  }

  // Kiểm tra sự tồn tại của main và blogElement
  const mainElement = document.querySelector("main");
  const blogElement = document.querySelector(
    ".blog-page-container .project-list"
  );
  const blogContainer = document.querySelector(".blog-page-container");

  // Tạo ScrollTrigger
  ScrollTrigger.create({
    trigger: blogElement,
    start: "top 70%",
    end: "bottom 70%",
    scrub: true,
    markers: true,
    onEnter: () => {
      blogContainer.classList.add("theme-light");
      mainElement.classList.add("theme-light");
    },
    onLeaveBack: () => {
      mainElement.classList.remove("theme-light");
      blogContainer.classList.remove("theme-light");
    },
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sliderProject();
  magicCursor();
  loadImg();
  changeColor();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
