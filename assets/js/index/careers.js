import { preloadImages } from "../../libs/utils.js";
2;
function formReruitment() {
  if ($(".our-works").length < 1) return;

  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  $(".modal-recruitment .file-attach").on("change", function () {
    const file = this.files[0];
    const $input = $(this);
    const $labelSpan = $input.next("label").find("span");
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    function truncateText(text, maxLength) {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    function formatFileName(name) {
      const lower = name.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

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

    const formattedName = formatFileName(truncateText(file.name, 28));
    $labelSpan.text(formattedName);
    $labelSpan.addClass("has-file");
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
  const topValue = window.innerWidth > 991 ? "top 65%" : "top 40%";
  ScrollTrigger.create({
    trigger: ".our-works",
    start: topValue,

    onEnter: () => {
      document.querySelector(".our-works").classList.add("theme-light");
      document
        .querySelector(".header-menu-container")
        .classList.add("theme-light");
      document.querySelector("main").classList.add("theme-light");
      document.querySelector(".section-banner").classList.add("theme-light");
    },
    onLeaveBack: () => {
      document.querySelector(".our-works").classList.remove("theme-light");
      document
        .querySelector(".header-menu-container")
        .classList.remove("theme-light");
      document.querySelector("main").classList.remove("theme-light");
      document.querySelector(".section-banner").classList.remove("theme-light");
    },
    // markers: true
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  formReruitment();
  ScrollTrigger.refresh();
};
preloadImages("img").then(() => {
  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
