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

    // Hàm khởi tạo autoplay chung
    const startAutoplay = () => {
      swiper.autoplay.start({
        delay: defaultDuration,
        disableOnInteraction: false,
      });
      updateProgressBars(swiper);
    };

    // Sự kiện hover và responsive
    $this.on("mouseenter", startAutoplay);

    if (window.innerWidth < 991) {
      startAutoplay();
    }

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
function loadImg(scope) {
  const projectItems = gsap.utils.toArray(".project-item", scope);

  // Use matchMedia for better responsive handling
  gsap.matchMedia().add("(max-width: 991px)", () => {
    // Set initial positions
    gsap.set(projectItems, {
      y: 100,
    });

    gsap.set(projectItems[0], {
      y: 10,
    });
    // Mobile: Individual triggers for each item
    projectItems.forEach((item, index) => {
      gsap.to(item, {
        y: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          end: "bottom 90%",

          // markers: true,
        },
      });
    });
  });

  gsap.matchMedia().add("(min-width: 992px)", () => {
    // Set initial positions
    gsap.set(projectItems, {
      yPercent: 40,
    });

    gsap.set(projectItems[0], {
      yPercent: 10,
    });
    // Desktop: Original timeline approach
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1,
        // markers: true,
      },
    });

    tl.to(projectItems, {
      yPercent: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const firstProjectList = document.querySelector(
    ".tab-pane.show.active .project-list",
  );
  if (firstProjectList) {
    loadImg(firstProjectList);
    ScrollTrigger.refresh(); // đảm bảo trigger hoạt động chính xác
  }
});

document.querySelectorAll('button[data-bs-toggle="pill"]').forEach((tab) => {
  tab.addEventListener("shown.bs.tab", function (e) {
    const targetSelector = e.target.getAttribute("data-bs-target");
    const projectList = document.querySelector(
      `${targetSelector} .project-list`,
    );

    if (projectList) {
      // Gọi loadImg chỉ khi tab có chứa .project-list
      loadImg(projectList);
      ScrollTrigger.refresh();
    }
  });
});
function changeColor() {
  const blogPage = document.querySelector(".blog-page");
  if (!blogPage) {
    return;
  }

  // Kiểm tra sự tồn tại của main và blogElement
  const mainElement = document.querySelector("main");
  const blogElement = document.querySelector(
    ".blog-page-container .project-list",
  );
  const blogContainer = document.querySelector(".blog-page-container");

  // Tạo ScrollTrigger
  ScrollTrigger.create({
    trigger: blogElement,
    start: "top 75%",
    end: "bottom 75%",
    scrub: true,
    // markers: true,
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

function magicCursorImg() {
  if (!document.querySelector(".magic-cursor-image")) return;

  var circle = document.querySelector(".magic-cursor-image");
  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Di chuyển circle theo vị trí chuột, không delay
    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
    });
  });

  var cursorDot = document.querySelector(".magic-cursor-image .cursor");
  var imgContent = document.querySelector(".magic-cursor-image .img-content");

  const itemsPor = document.querySelectorAll(".porfolio-item .porfolio-link");

  itemsPor.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const imgSrc = item.getAttribute("data-cursor-image");

      if (!imgSrc) return; // Nếu ko có data-cursor-image thì thôi

      cursorDot.classList.add("show");
      item.classList.add("hovered");
      // Hiển thị ảnh vào img-content
      imgContent.innerHTML = `<img src="${imgSrc}" alt="cursor image" />`;
    });

    item.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("show");
      item.classList.remove("hovered");
      // Xoá ảnh khỏi img-content
      imgContent.innerHTML = "";
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sliderProject();
  changeColor();
  magicCursorImg();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
