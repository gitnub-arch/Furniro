const mobileMenu = document.querySelector(".mobile-menu");
const mobileNav = document.querySelector(".mobile-nav");

mobileMenu?.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  mobileNav.classList.toggle('active');
});

