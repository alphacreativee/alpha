import { preloadImages } from "../../libs/utils.js";

function sectionSpecialize() {
  if ($(".section-specialize").length < 1) return;

  gsap.fromTo(
    ".section-specialize .image",
    { scale: 0.5 },
    {
      scale: 1,
      scrollTrigger: {
        trigger: ".section-specialize",
        start: "center bottom",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "none",
    }
  );

  gsap.to(".specialize-main-slider", {
    xPercent: -160,
    scrollTrigger: {
      trigger: ".section-specialize",
      start: "top 20%",
      end: "bottom 20%",
      scrub: true,
      // markers: true,
      onEnter: () => {
        $(".section-specialize").addClass("theme-light");
        $("main").addClass("theme-light");
      },
      onLeaveBack: () => {
        $("main").removeClass("theme-light");
        $(".section-specialize").removeClass("theme-light");
      },
    },
    ease: "none",
  });

  let hasCounted = false;
  ScrollTrigger.create({
    trigger: ".section-specialize",
    start: "top 15%",
    once: true,
    onEnter: () => {
      if (!hasCounted) {
        activeNumberCount();
        hasCounted = true;
      }
    },
  });

  $(".section-specialize .number").each(function () {
    const $stat = $(this);
    const patt = /(\D+)?(\d+(\.\d+)?)(\D+)?/;
    let result = patt.exec($stat.text());

    if (!result) return;

    result.shift();
    result = result.filter((res) => res != null);

    $stat.empty();

    result.forEach((res) => {
      if (isNaN(res)) {
        $stat.append(`<span>${res}</span>`);
      } else {
        for (let i = 0; i < res.length; i++) {
          $stat.append(`
            <span data-value="${res[i]}">
              <span>&nbsp;</span>
              ${Array(parseInt(res[i]) + 1)
                .join(0)
                .split(0)
                .map((x, j) => `<span>${j}</span>`)
                .join("")}
            </span>
          `);
        }
      }
    });
  });

  function activeNumberCount() {
    $(".section-specialize .number").each(function () {
      const ticks = $(this).find("span[data-value]");
      ticks.each(function () {
        const dist = parseInt($(this).attr("data-value")) + 1;
        $(this).css("transform", `translateY(-${dist * 100}%)`);
      });
    });
  }
}

function introChess() {
  if ($(".section-intro").length < 1) return;

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
  const canvas = document.getElementById("canvas-chess");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  const frameCount = 74;
  const currentFrame = (index) =>
    `./assets/images/img-chess/chess-${(index + 1).toString()}.jpg`;
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
    },
    onUpdate: render,
  });

  // Hiệu ứng cho section-intro-content
  const tagElement = document.querySelector(".section-intro-content .tag");
  const contentElement = document.querySelector(
    ".section-intro-content .h2-heading"
  );

  // Khởi tạo SplitText cho content
  const splitContent = new SplitText(contentElement, {
    type: "words,lines",
    linesClass: "line",
  });

  // Tạo timeline cho hiệu ứng vào và ngược lại
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#canvas-chess",
      start: `top+=${(70 / frameCount) * 100}% top`,
      end: `top+=${(70 / frameCount) * 100}% top`,
      toggleActions: "play none none reverse",
    },
    // onStart: () => {
    //   tagElement.classList.add("effect-fade-content-intro");
    // },
  });

  // Thêm hiệu ứng cho tag
  tl.fromTo(
    tagElement,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" }
  );

  // Thêm hiệu ứng cho các dòng của content
  tl.fromTo(
    splitContent.lines,
    { opacity: 0, yPercent: 100 },
    { opacity: 1, yPercent: 0, duration: 0.4, stagger: 0.1, ease: "expo.out" },
    "-=0.3" // Chồng lấn nhẹ để hiệu ứng mượt hơn
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
    },
  });
}

function clientInsight() {
  if ($(".client-insight").length < 1) return;

  const wrapper = document.querySelector(".client-wrapper");
  const container = document.querySelector(".main-section");
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
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);

  sectionSpecialize();

  introChess();
  clientInsight();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
