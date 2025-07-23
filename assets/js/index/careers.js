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
    const $inputName = $form.find("input[name='name']");
    const $inputEmail = $form.find("input[name='email']");
    const $inputFile = $form.find("input[type='file']");
    const $inputCV = $form.find("input[name='cv']");
    const $note = $form.find(".note");
    const $success = $form.find(".success-message");
    const $buttonSubmit = $form.find("button[type='submit']");
    const jobId = $buttonSubmit.attr("job-id");

    let isValid = true;

    $form.find("input").removeClass("error");

    if ($inputName.val().trim() === "") {
      $inputName.addClass("error");
      isValid = false;
    }

    if ($inputEmail.val().trim() === "") {
      $inputEmail.addClass("error");
      isValid = false;
    }

    if ($inputFile.get(0).files.length === 0) {
      $inputFile.addClass("error");
      isValid = false;
    }

    if (!isValid) return;

    const formData = new FormData();
    formData.append("action", "submit_recruitment_form");
    formData.append("name", $inputName.val().trim());
    formData.append("email", $inputEmail.val().trim());
    formData.append("cv", $inputCV.val().trim());
    formData.append("file", $inputFile.get(0).files[0]);
    formData.append("job_id", jobId);

    console.log($inputFile.get(0).files[0]);

    $.ajax({
      url: ajaxUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: function () {
        $buttonSubmit.addClass("aloading");
      },
      success: function (res) {
        $form[0].reset();

        const $labelSpan = $form
          .find("input[type='file']")
          .next("label")
          .find("span");
        $labelSpan.text("Upload file under 5MB").removeClass("has-file");

        if ($note.length > 0 && $success.length > 0) {
          $note.hide();
          $success.show();

          setTimeout(function () {
            $note.show();
            $success.hide();
          }, 5000);
        }

        $inputFile.removeClass("error");
        $buttonSubmit.removeClass("aloading");
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi gửi form:", error);
        $form.append(
          '<span class="contact-message body-sm-regular" style="color: #FF0000;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
        );
        $buttonSubmit.removeClass("aloading");
      },
    });
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
