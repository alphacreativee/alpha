import { preloadImages } from "../../libs/utils.js";

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
