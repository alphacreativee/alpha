import { preloadImages } from "../../libs/utils.js";

function test() {
  // Đặt trạng thái ban đầu cho các .content không có class initial
  gsap.set(".content:not(.initial)", { yPercent: 100 });

  // Lấy tất cả các phần tử .content không có class initial
  const contents = gsap.utils.toArray(".content:not(.initial)");

  // Lấy các phần tử .text tương ứng
  const texts = gsap.utils.toArray(".text");

  // Tạo timeline cho hiệu ứng của .content và .below
  const contentTimeline = gsap.timeline();

  // Tạo ScrollTrigger cho .our-story
  ScrollTrigger.create({
    trigger: ".our-story",
    start: "top top",
    end: "+=1000", // Tăng độ dài scroll để chứa cả hiệu ứng .below
    pin: true,
    scrub: true,
    animation: contentTimeline,
    // markers: true, // Bỏ comment để debug
    onUpdate: (self) => {
      // Tính toán phần tử .content nào đang hiển thị
      const progress = self.progress;
      const contentCount = contents.length;
      const step = 0.4; // Khoảng cách giữa các hiệu ứng (i * 0.2)

      // Tìm chỉ số của .content đang hiển thị
      let activeIndex = Math.floor(progress / step);
      if (activeIndex >= contentCount) activeIndex = contentCount - 1;
      if (activeIndex < 0) activeIndex = 0;

      // Cập nhật class active cho .text tương ứng
      texts.forEach((text, index) => {
        if (index === activeIndex) {
          text.classList.add("active");
        } else {
          text.classList.remove("active");
        }
      });
    },
  });

  // Tạo hiệu ứng lần lượt cho các .content:not(.initial)
  contents.forEach((content, i) => {
    contentTimeline.to(content, {
      yPercent: 0, // Đẩy từ yPercent: 101 về 0
      duration: 0.5,
      ease: "power2.out",
    });
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);

  test();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
