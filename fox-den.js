(() => {
  "use strict";

  const shell = document.getElementById("fox-shell");
  const frame = document.getElementById("ib-frame");
  const enter = document.getElementById("fox-enter");
  const enterLabel = document.getElementById("fox-enter-label");
  const remember = document.getElementById("fox-remember");
  const charm = document.getElementById("fox-charm");
  const toast = document.getElementById("fox-toast");
  const skipGateKey = "shanshan-fox-den-skip-gate";
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1900);
  }

  function enterDen({ quiet = false } = {}) {
    shell.classList.add("has-entered");
    localStorage.setItem(skipGateKey, remember.checked ? "1" : "0");
    window.setTimeout(() => frame.focus(), 120);
    if (!quiet) showToast("欢迎回家，珊珊");
  }

  function reopenGate() {
    shell.classList.remove("has-entered");
    window.setTimeout(() => enter.focus(), 320);
  }

  function injectPersonalTheme() {
    const doc = frame.contentDocument;
    if (!doc || !doc.head || !doc.body) return;

    doc.title = "珊珊的小窝 · Internal Beyond";
    const loadingTitle = doc.querySelector("#preloader .preloader-text");
    const loadingSub = doc.querySelector("#preloader .preloader-sub");
    if (loadingTitle) loadingTitle.textContent = "正在把小窝点亮…";
    if (loadingSub) loadingSub.textContent = "preparing shanshan's private den";

    if (!doc.getElementById("fox-den-personal-theme")) {
      const style = doc.createElement("style");
      style.id = "fox-den-personal-theme";
      style.textContent = `
        :root {
          --bg-deep: #18131d;
          --bg-mid: #302138;
          --mist: #9f8298;
          --silver: #c5a8b5;
          --light: #ddc8cd;
          --pale: #eee0dc;
          --white: #f8efea;
          --accent: #9f657e;
          --accent-light: #c98ca2;
          --glass-bg: rgba(126, 78, 105, 0.1);
          --glass-border: rgba(222, 174, 188, 0.2);
          --text-primary: #eee2e2;
          --text-secondary: #cbb3bd;
          --text-muted: #9e7f92;
        }
        ::selection { background: rgba(190, 126, 151, 0.3); color: #fff7f1; }
        #preloader {
          background: radial-gradient(ellipse 90% 70% at 50% 45%, rgba(58, 34, 53, 0.98), rgba(22, 16, 28, 0.99));
        }
        #preloader .preloader-text { color: rgba(246, 226, 225, 0.9); }
        #preloader .preloader-sub { color: rgba(215, 177, 190, 0.5); }
        #splash::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(circle at 74% 18%, rgba(173, 100, 130, 0.13), transparent 30%);
          mix-blend-mode: screen;
        }
        #navbar { border-color: rgba(213, 168, 185, 0.17); }
        #navbar.on-subpage { background: rgba(48, 27, 45, 0.14); }
        .splash-action-btn, .nav-btn, .theme-toggle {
          border-color: rgba(218, 177, 190, 0.3);
        }
        .home-rule, .module-intro-rule { filter: sepia(.25) hue-rotate(285deg) saturate(1.25); }
        * { scrollbar-color: rgba(177, 117, 142, .4) rgba(32, 23, 35, .2); }
      `;
      doc.head.appendChild(style);
    }

    if (!doc.getElementById("fox-den-stamp")) {
      const stamp = doc.createElement("div");
      stamp.id = "fox-den-stamp";
      stamp.setAttribute("aria-hidden", "true");
      stamp.textContent = "珊珊的小窝 · 🦊";
      stamp.style.cssText = [
        "position:fixed", "right:70px", "bottom:18px", "z-index:90",
        "pointer-events:none", "font:400 10px/1.4 'Noto Sans SC',sans-serif",
        "letter-spacing:.12em", "color:rgba(232,202,211,.42)",
        "text-shadow:0 2px 14px rgba(25,12,22,.45)"
      ].join(";");
      doc.body.appendChild(stamp);
    }
  }

  function handleFrameReady() {
    if (shell.classList.contains("is-ready")) return;
    try {
      injectPersonalTheme();
    } catch (error) {
      console.warn("Fox den theme could not be injected:", error);
    }

    shell.classList.add("is-ready");
    enter.disabled = false;
    enterLabel.textContent = "推门进去";

    if (localStorage.getItem(skipGateKey) === "1") {
      remember.checked = true;
      window.setTimeout(() => enterDen({ quiet: true }), 420);
    }
  }

  frame.addEventListener("load", handleFrameReady);
  if (frame.contentDocument && frame.contentDocument.readyState === "complete") {
    handleFrameReady();
  }

  enter.addEventListener("click", () => enterDen());
  charm.addEventListener("click", reopenGate);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shell.classList.contains("has-entered")) reopenGate();
    if (event.key === "Enter" && !shell.classList.contains("has-entered") && !enter.disabled) enterDen();
  });

  window.setTimeout(() => {
    if (!shell.classList.contains("is-ready")) {
      enterLabel.textContent = "小窝加载得有点慢，再等等…";
    }
  }, 9000);
})();
