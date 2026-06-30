document.addEventListener("DOMContentLoaded", () => {
  //Burger_bar
  const burger = document.getElementById("burger-menu");
  const navList = document.getElementById("nav-list");

  burger.addEventListener("click", () => {
    navList.classList.toggle("active");
    burger.classList.toggle("toggle");
  });

  //headerColor
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  //ScrollReveal
  ScrollReveal().reveal(".reveal-left", {
    origin: "left",
    distance: "50px",
    duration: 1000,
    delay: 200,
  });
  ScrollReveal().reveal(".reveal-up", {
    origin: "bottom",
    distance: "50px",
    duration: 800,
    interval: 200,
  });
  ScrollReveal().reveal(".section-title", {
    origin: "top",
    distance: "30px",
    duration: 800,
  });
  ScrollReveal().reveal(".reveal-scale", { scale: 0.9, duration: 800 });

  //API
  const apiContainer = document.getElementById("api-container");

  async function fetchGames() {
    try {
      const response = await axios.get(
        "https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50&sortBy=Metacritic&pageNumber=0",
      );
      const fetchedGames = response.data.slice(0, 6);

      apiContainer.innerHTML = "";

      fetchedGames.forEach((game) => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        card.innerHTML = `
                    <img src="${game.thumb}" alt="${game.title}" class="game-img">
                    <div class="game-info">
                        <h3>${game.title}</h3>
                        <p>Metacritic: ${game.metacriticScore} | ფასი: $${game.salePrice}</p>
                        <button class="wishlist-btn" onclick="addToWishlist('${game.dealID}', '${game.title.replace(/'/g, "\\'")}', '${game.thumb}')">
                            <i class="bi bi-bookmark-plus"></i> Wishlist
                        </button>
                    </div>
                `;
        apiContainer.appendChild(card);
      });
    } catch (error) {
      console.error("API Error:", error);
      apiContainer.innerHTML =
        '<p style="color:red; text-align:center;">მონაცემების ჩატვირთვა ვერ მოხერხდა.</p>';
    }
  }
  fetchGames();

  //CarouselXLoad
  const loadMoreBtn = document.getElementById("load-more-btn");
  const carouselWrapper = document.getElementById("carousel-wrapper");
  const carouselList = document.getElementById("carousel-list");

  loadMoreBtn.addEventListener("click", async () => {
    loadMoreBtn.textContent = "იტვირთება...";
    loadMoreBtn.disabled = true;

    try {
      const response = await axios.get(
        "https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50&sortBy=Metacritic&pageNumber=1",
      );
      const moreGames = response.data.slice(0, 20);

      moreGames.forEach((game) => {
        const slide = document.createElement("li");
        slide.classList.add("splide__slide");

        slide.innerHTML = `
                    <div class="game-card">
                        <img src="${game.thumb}" alt="${game.title}" class="game-img">
                        <div class="game-info">
                            <h3>${game.title}</h3>
                            <p>Metacritic: ${game.metacriticScore} | ფასი: $${game.salePrice}</p>
                            <button class="wishlist-btn" onclick="addToWishlist('${game.dealID}', '${game.title.replace(/'/g, "\\'")}', '${game.thumb}')">
                                <i class="bi bi-bookmark-plus"></i> Wishlist
                            </button>
                        </div>
                    </div>
                `;
        carouselList.appendChild(slide);
      });

      carouselWrapper.classList.remove("hidden");
      loadMoreBtn.parentElement.classList.add("hidden");

      //Splide
      new Splide(".splide", {
        type: "loop",
        perPage: 3,
        perMove: 1,
        gap: "20px",
        pagination: true,
        breakpoints: {
          1024: { perPage: 2 },
          768: { perPage: 1 },
        },
      }).mount();
    } catch (error) {
      console.error("Carousel Load Error:", error);
      loadMoreBtn.textContent = "შეცდომა";
    }
  });

  //LocalStorage
  const wishlistContainer = document.getElementById("wishlist-container");

  window.addToWishlist = function (id, title, thumb) {
    let wishlist = JSON.parse(localStorage.getItem("myWishlist")) || [];

    const exists = wishlist.find((item) => item.id === id);
    if (!exists) {
      wishlist.push({ id, title, thumb });
      localStorage.setItem("myWishlist", JSON.stringify(wishlist));
      renderWishlist();
      alert(`${title} დაემატა სიაში!`);
    } else {
      alert("ეს თამაში უკვე თქვენს სიაშია.");
    }
  };

  window.removeFromWishlist = function (id) {
    let wishlist = JSON.parse(localStorage.getItem("myWishlist")) || [];
    wishlist = wishlist.filter((item) => item.id !== id);
    localStorage.setItem("myWishlist", JSON.stringify(wishlist));
    renderWishlist();
  };

  function renderWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("myWishlist")) || [];
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML =
        '<p class="empty-msg">თქვენი სია ცარიელია. დაამატეთ თამაშები ზედა სექციიდან.</p>';
      return;
    }

    wishlist.forEach((game) => {
      const card = document.createElement("div");
      card.classList.add("game-card");

      card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" class="game-img">
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <button class="remove-btn" onclick="removeFromWishlist('${game.id}')">
                        <i class="bi bi-trash"></i> წაშლა
                    </button>
                </div>
            `;
      wishlistContainer.appendChild(card);
    });
  }

  renderWishlist();

  //ფორმის ვალიდაცია
  const form = document.getElementById("guild-form");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");

  togglePassword.addEventListener("click", () => {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    togglePassword.classList.toggle("bi-eye");
    togglePassword.classList.toggle("bi-eye-slash");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (username.value.trim().length < 3) {
      setError(username);
      isValid = false;
    } else {
      setSuccess(username);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      setError(email);
      isValid = false;
    } else {
      setSuccess(email);
    }

    const passRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passRegex.test(password.value.trim())) {
      setError(password);
      isValid = false;
    } else {
      setSuccess(password);
    }

    if (isValid) {
      alert("გილდიაში რეგისტრაცია წარმატებით დასრულდა!");
      form.reset();
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("success");
      });
    }
  });

  function setError(input) {
    const formGroup = input.closest(".form-group");
    formGroup.classList.add("error");
    formGroup.classList.remove("success");
  }

  function setSuccess(input) {
    const formGroup = input.closest(".form-group");
    formGroup.classList.remove("error");
    formGroup.classList.add("success");
  }

  //Cookies_Notification
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (!localStorage.getItem("abyssCookiesAccepted")) {
    cookieBanner.classList.remove("hidden");
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("abyssCookiesAccepted", "true");
    cookieBanner.classList.add("hidden");
  });
});

///Scroll_To_Top
const myButton = document.getElementById("scrollToTopBtn");

//Show
window.onscroll = function () {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    myButton.style.display = "flex";
  } else {
    myButton.style.display = "none";
  }
};

//Click
myButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
