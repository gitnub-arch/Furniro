const cartIcons = document.querySelectorAll(".cart-modal-icon");
const cartModal = document.querySelector(".cart-modal");
const cartModalOverlay = document.querySelector(".cart-modal__overlay");
const cartModalClear = document.querySelector("#cart-modal__clear");

cartIcons.forEach((cartIcon) => {
  cartIcon?.addEventListener("click", () => {
    cartModal.classList.add("active");

    document.body.classList.add("hide-overlow");
    cartModalOverlay.classList.add("active");
  });
});

const closeCartModal = () => {
  cartModal.classList.remove("active");
  document.body.classList.remove("hide-overlow");
  cartModalOverlay.classList.remove("active");
};

document.body.addEventListener("click", (event) => {
  if (cartModalOverlay === event.target) {
    closeCartModal();
  }
});

cartModalClear.addEventListener("click", () => {
  closeCartModal();
});
