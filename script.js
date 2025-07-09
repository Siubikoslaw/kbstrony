document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const backToTopBtn = document.getElementById("backToTop");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 200) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
