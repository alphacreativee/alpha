import { preloadImages } from "../../libs/utils.js";
2;
function formReruitment() {
  if ($(".our-works").length < 1) return;

  $("#file-attach").on("change", function () {
    const file = this.files[0];
    const $input = $(this);
    const $labelSpan = $input.next("label").find("span");
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const maxSize = 5 * 1024 * 1024;

    $input.removeClass("error");
    $labelSpan.text("Upload file under 5MB");

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      $input.addClass("error");
      $labelSpan.text("Only PDF or DOCX files allowed");
      $input.val("");
      return;
    }

    if (file.size > maxSize) {
      $input.addClass("error");
      $labelSpan.text("File too large (max 5MB)");
      $input.val("");
      return;
    }

    $labelSpan.text(file.name);
  });

  $("form.form-recruitment").on("submit", function (e) {
    e.preventDefault();
    const $form = $(this);
    let isValid = true;

    const $inputFile = $form.find("input[type='file']");
    const $inputName = $form.find("input[name='name']");
    const $inputEmail = $form.find("input[name='email']");
    const $note = $form.find(".note");

    const originalNote = $note.text();

    $form.find("input").removeClass("error");

    if ($inputFile.hasClass("error")) {
      isValid = false;
    }

    if ($inputName.val().trim() === "") {
      isValid = false;
      $inputName.addClass("error");
    }

    if ($inputEmail.val().trim() === "") {
      isValid = false;
      $inputEmail.addClass("error");
    }

    if (isValid) {
      $form[0].reset();
      $note.text("Your application has been submitted successfully.");

      setTimeout(function () {
        $note.text(originalNote);
      }, 5000);
    }
  });

  $(document).on("click", ".our-works a[data-bs-toggle='modal']", function () {
    const title = $(this).data("title");
    $(".modal-recruitment .col-content .title").text(title);
  });

  ScrollTrigger.create({
    trigger: ".our-works",
    start: "top 65%",
    onEnter: () => {
      document.querySelector(".our-works").classList.add("theme-light");
    },
    onLeaveBack: () => {
      document.querySelector(".our-works").classList.remove("theme-light");
    }
    // markers: true
  });
}

function whyChooseUs() {
  if ($(".why-choose-us").length < 1) return;

  const wrapper = document.querySelector(".why-choose-us .list-wrapper");
  const container = document.querySelector(".why-choose-us .main-section");
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
  formReruitment();
  whyChooseUs();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
