function toggleBlock(id) {
  let blocks = document.querySelectorAll(".block");

  blocks.forEach((block) => {
    block.classList.remove("active");
  });

  let selectedBlock = document.getElementById(id);

  if (selectedBlock) {
    selectedBlock.classList.add("active");
  }
}

const buttons = document.querySelectorAll(".prod-info__btn");

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    toggleBlock(`block${index + 1}`);
  });
});
