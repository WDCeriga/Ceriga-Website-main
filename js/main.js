// navbar set for mobile and toggle --------------
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector(".navbar-toggler");
  const topBar = toggler.querySelector(".top");
  const bottomBar = toggler.querySelector(".bottom");
  const navList = document.querySelector("#mainNavbar .navbar-nav");

  let menuOpen = false;
  let firstItem, lastItem;

  toggler.addEventListener("click", () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      topBar.style.transform = "rotate(45deg)";
      topBar.style.top = "7px";

      bottomBar.style.transform = "rotate(-45deg)";
      bottomBar.style.bottom = "7px";
    } else {
      topBar.style.transform = "rotate(0deg)";
      topBar.style.top = "0";

      bottomBar.style.transform = "rotate(0deg)";
      bottomBar.style.bottom = "0";
    }

    setTimeout(() => {
      const isMobile = window.innerWidth <= 425;

      if (firstItem) firstItem.remove();
      if (lastItem) lastItem.remove();

      if (isMobile && menuOpen) {
        firstItem = document.createElement("li");
        firstItem.className = "nav-item extra-nav";
        firstItem.innerHTML =
          '<a class="nav-link" href="./index.html">Home</a>';
        navList.insertBefore(firstItem, navList.firstElementChild);

        lastItem = document.createElement("div");
        lastItem.className = "nav-item nav-bar-footer";
        lastItem.innerHTML = `
          <div class="mobile-footer">
            <div class="mobile-footer-inner">
              <span>© 2025 CERIGA.</span>
              <div class="social-icons">
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-x-twitter"></i></a>
                <a href="#"><i class="fab fa-facebook-f"></i></a>
              </div>
            </div>
          </div>`;
        navList.appendChild(lastItem);
      }
    }, 350);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 425) {
      if (firstItem) firstItem.remove();
      if (lastItem) lastItem.remove();
    }
  });
});

// FAQ -------------
document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".customer-faq__question");

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;

      btn.classList.toggle("active");

      if (btn.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }

      questions.forEach((other) => {
        if (other !== btn) {
          other.classList.remove("active");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
    });
  });
});


