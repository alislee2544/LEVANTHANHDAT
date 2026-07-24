/* ==========================================================
   soda.notsofa — js/app.js
   HTML5 | CSS3 | JavaScript
   Lê Văn Thành Đạt - 231A010884
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     LOADER
     (Nếu index.html có thêm <div id="loader">Đang tải...</div>
      ngay đầu <body>, đoạn này sẽ tự ẩn nó khi trang tải xong.
      Nếu chưa có phần tử #loader thì đoạn này bỏ qua, không lỗi.)
  --------------------------------------------------------- */
  const loader = document.getElementById("loader");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("hide"), 400);
    });
  }

  /* ---------------------------------------------------------
     FADE IN ON SCROLL (áp dụng cho mọi phần tử class="fade")
  --------------------------------------------------------- */
  const fadeEls = document.querySelectorAll(".fade");
  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));
  }

  /* ---------------------------------------------------------
     TK5 — ACCORDION
  --------------------------------------------------------- */
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isOpen = item.classList.contains("active");

      // đóng các accordion khác đang mở (kiểu chỉ mở 1 mục tại 1 thời điểm)
      document.querySelectorAll(".accordion-item.active").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("active");
          openItem.querySelector(".accordion-content").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("active");
        content.style.maxHeight = null;
      } else {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     TK7 — RANDOM PASSWORD GENERATOR (8 ký tự, chữ thường + số)
  --------------------------------------------------------- */
  const passwordBtn = document.getElementById("passwordBtn");
  const passwordResult = document.getElementById("passwordResult");

  function generatePassword(length = 8) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  }

  if (passwordBtn && passwordResult) {
    passwordBtn.addEventListener("click", () => {
      passwordResult.value = generatePassword(8);
    });
  }

  /* ---------------------------------------------------------
     TK8 — CHUYỂN ĐỔI HEX SANG RGB
  --------------------------------------------------------- */
  const convertBtn = document.getElementById("convertBtn");
  const hexInput = document.getElementById("hexInput");
  const rgbResult = document.getElementById("rgbResult");

  function hexToRgb(hex) {
    hex = hex.trim().replace("#", "");

    // hỗ trợ dạng viết tắt #f00 -> ff0000
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;

    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  if (convertBtn && hexInput && rgbResult) {
    const doConvert = () => {
      const rgb = hexToRgb(hexInput.value);
      if (!rgb) {
        rgbResult.textContent = "Mã Hex không hợp lệ. Vui lòng nhập lại (VD: #FF0000)";
        rgbResult.style.color = "#c0392b";
        return;
      }
      rgbResult.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      rgbResult.style.color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    };

    convertBtn.addEventListener("click", doConvert);
    hexInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doConvert();
    });
  }

  /* ---------------------------------------------------------
     K4 — PAGINATION (50 mục, 10 mục / trang)
  --------------------------------------------------------- */
  const itemList = document.getElementById("itemList");
  const paginationEl = document.getElementById("pagination");

  if (itemList && paginationEl) {
    const TOTAL_ITEMS = 50;
    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;

    const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => `Mục số ${i + 1}`);
    const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

    function renderItems(page) {
      itemList.innerHTML = "";
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      allItems.slice(start, end).forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        itemList.appendChild(li);
      });
    }

    function renderPagination(page) {
      paginationEl.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === page) btn.classList.add("active");
        btn.addEventListener("click", () => {
          currentPage = i;
          renderItems(currentPage);
          renderPagination(currentPage);
          itemList.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        paginationEl.appendChild(btn);
      }
    }

    renderItems(currentPage);
    renderPagination(currentPage);
  }

  /* ---------------------------------------------------------
     K6 — DI CHUYỂN DIV BẰNG PHÍM MŨI TÊN (↑ / ↓)
  --------------------------------------------------------- */
  const moveBox = document.getElementById("moveBox");
  const moveArea = document.querySelector(".move-area");

  if (moveBox && moveArea) {
    const STEP = 15;
    let posY = moveBox.offsetTop;

    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

      e.preventDefault(); // tránh cuộn trang khi bấm mũi tên
      const maxY = moveArea.clientHeight - moveBox.offsetHeight;

      if (e.key === "ArrowUp") posY = Math.max(0, posY - STEP);
      if (e.key === "ArrowDown") posY = Math.min(maxY, posY + STEP);

      moveBox.style.top = posY + "px";
    });
  }

  /* ---------------------------------------------------------
     K8 — BMI CALCULATOR
  --------------------------------------------------------- */
  const bmiBtn = document.getElementById("bmiBtn");
  const bmiResult = document.getElementById("bmiResult");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");

  if (bmiBtn && bmiResult && weightInput && heightInput) {
    bmiBtn.addEventListener("click", () => {
      const weight = parseFloat(weightInput.value);
      const height = parseFloat(heightInput.value);

      if (!weight || !height || weight <= 0 || height <= 0) {
        bmiResult.textContent = "Vui lòng nhập đầy đủ cân nặng và chiều cao hợp lệ.";
        return;
      }

      const bmi = weight / (height * height);
      let classification = "";

      if (bmi < 18.5) classification = "Thiếu cân";
      else if (bmi < 25) classification = "Bình thường";
      else if (bmi < 30) classification = "Thừa cân";
      else classification = "Béo phì";

      bmiResult.textContent = `Chỉ số BMI của bạn: ${bmi.toFixed(2)} (${classification})`;
    });
  }

});
