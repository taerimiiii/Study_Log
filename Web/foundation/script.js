const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");
let isCheering = false;

cheerButton.addEventListener("click", function () {
  isCheering = !isCheering;

  if (isCheering) {
    message.textContent = "좋아요! 작은 코드부터 직접 바꾸어 봅시다. 🚀";
  } else {
    message.textContent = "HTML, CSS, JavaScript를 배우고 있습니다.";
  }
});
