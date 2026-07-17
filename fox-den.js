(() => {
  "use strict";

  const shell = document.getElementById("cottage-shell");
  const frame = document.getElementById("ib-frame");
  const enter = document.getElementById("cottage-enter");
  const enterLabel = document.getElementById("cottage-enter-label");
  const remember = document.getElementById("cottage-remember");
  const preset = document.getElementById("cottage-preset");
  const returnSeal = document.getElementById("return-seal");
  const toast = document.getElementById("cottage-toast");
  const skipGateKey = "shanshan-fox-cottage-skip-gate";
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1900);
  }

  function rememberIsOn() {
    return remember.getAttribute("aria-pressed") === "true";
  }

  function setRemember(on) {
    remember.setAttribute("aria-pressed", String(on));
    localStorage.setItem(skipGateKey, on ? "1" : "0");
  }

  function enterCottage({ quiet = false } = {}) {
    shell.classList.add("has-entered");
    window.setTimeout(() => frame.focus(), 160);
    if (!quiet) showToast("灯火可亲，欢迎归来");
  }

  function reopenGate() {
    shell.classList.remove("has-entered");
    window.setTimeout(() => enter.focus(), 350);
  }

  async function readProfileWhenReady(app) {
    let lastError;
    for (let attempt = 0; attempt < 25; attempt += 1) {
      try {
        return await app.dbGet("about", "main");
      } catch (error) {
        lastError = error;
        await new Promise(resolve => window.setTimeout(resolve, 120));
      }
    }
    throw lastError || new Error("Database is not ready");
  }

  async function applyStarterPreset() {
    const app = frame.contentWindow;
    if (!app || typeof app.dbGet !== "function" || typeof app.dbPut !== "function") {
      showToast("小筑尚未醒来，请稍后再试");
      return;
    }

    preset.disabled = true;
    try {
      const response = await fetch("presets/shanshan-starter.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Preset could not be loaded");
      const data = await response.json();
      const profile = data.about && data.about[0];
      if (!profile || profile.id !== "main") throw new Error("Preset is invalid");

      const current = await readProfileWhenReady(app);
      const hasCustomProfile = current && (
        (current.name && current.name !== "Sui") || current.bio || current.avatar ||
        current.bgImage || current.customText ||
        (Array.isArray(current.galleryImages) && current.galleryImages.some(Boolean))
      );
      if (hasCustomProfile && !window.confirm("这里已经住着一份自定义资料。要用珊珊预设覆盖昵称、简介和小签吗？\n\nAPI、聊天、记忆与图片都不会被修改。")) {
        showToast("好，原来的资料继续住着");
        return;
      }

      const nextProfile = Object.assign({}, current || {}, profile, {
        avatar: current && current.avatar ? current.avatar : profile.avatar,
        bgImage: current && current.bgImage ? current.bgImage : profile.bgImage,
        galleryImages: current && Array.isArray(current.galleryImages) && current.galleryImages.some(Boolean)
          ? current.galleryImages
          : profile.galleryImages
      });
      await app.dbPut("about", nextProfile);
      if (typeof app._refreshCachedUserName === "function") app._refreshCachedUserName();
      if (typeof app.loadAboutDisplay === "function") await app.loadAboutDisplay();
      if (typeof app.navTo === "function") app.navTo("about");

      preset.textContent = "珊珊已入住 · 可再次安置";
      showToast("珊珊已入住，秘密一件也没动");
      window.setTimeout(() => enterCottage({ quiet: true }), 650);
    } catch (error) {
      console.warn("Starter preset could not be applied:", error);
      showToast("预设没放好，再试一次吧");
    } finally {
      preset.disabled = false;
    }
  }

  function injectCottageTheme() {
    const doc = frame.contentDocument;
    if (!doc || !doc.head || !doc.body) return;

    doc.title = "狐隐小筑 · Internal Beyond";
    const loadingTitle = doc.querySelector("#preloader .preloader-text");
    const loadingSub = doc.querySelector("#preloader .preloader-sub");
    if (loadingTitle) loadingTitle.textContent = "正在点亮小筑…";
    if (loadingSub) loadingSub.textContent = "the lantern is waiting for you";

    if (!doc.getElementById("fox-cottage-theme")) {
      const style = doc.createElement("style");
      style.id = "fox-cottage-theme";
      style.textContent = `
        :root {
          --bg-deep: #0c171d;
          --bg-mid: #172832;
          --mist: #7f9495;
          --silver: #aebcba;
          --light: #ccd3cc;
          --pale: #e3dfd3;
          --white: #f1ebdf;
          --accent: #985046;
          --accent-light: #c77861;
          --glass-bg: rgba(76, 102, 101, .1);
          --glass-border: rgba(196, 186, 164, .18);
          --text-primary: #e7e3d9;
          --text-secondary: #b9beb7;
          --text-muted: #829392;
        }
        ::selection { background: rgba(164, 76, 62, .34); color: #fff7e9; }
        #preloader {
          background: radial-gradient(ellipse 88% 68% at 50% 45%, rgba(27, 48, 56, .98), rgba(7, 16, 21, .995));
        }
        #preloader .preloader-text { color: rgba(236, 226, 210, .9); }
        #preloader .preloader-sub { color: rgba(201, 163, 121, .5); }
        #splash::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 73% 24%, rgba(225, 174, 103, .08), transparent 24%),
            linear-gradient(90deg, rgba(7, 16, 20, .09), transparent 62%, rgba(93, 38, 31, .07));
          mix-blend-mode: screen;
        }
        #navbar { border-color: rgba(206, 192, 168, .16); }
        #navbar.on-subpage { background: rgba(10, 27, 34, .16); }
        .splash-action-btn, .nav-btn, .theme-toggle { border-color: rgba(205, 184, 154, .28); }
        .home-rule, .module-intro-rule { filter: sepia(.18) hue-rotate(345deg) saturate(1.15); }
        * { scrollbar-color: rgba(158, 84, 70, .4) rgba(13, 28, 34, .22); }
      `;
      doc.head.appendChild(style);
    }

    if (!doc.getElementById("fox-cottage-stamp")) {
      const stamp = doc.createElement("div");
      stamp.id = "fox-cottage-stamp";
      stamp.setAttribute("aria-hidden", "true");
      stamp.textContent = "珊珊 · 狐隐小筑";
      stamp.style.cssText = [
        "position:fixed", "right:70px", "bottom:18px", "z-index:90",
        "pointer-events:none", "font:400 10px/1.4 'Noto Serif SC',serif",
        "letter-spacing:.16em", "color:rgba(216,198,174,.4)",
        "text-shadow:0 2px 14px rgba(3,12,16,.5)"
      ].join(";");
      doc.body.appendChild(stamp);
    }
  }

  function handleFrameReady() {
    if (shell.classList.contains("is-ready")) return;
    try {
      injectCottageTheme();
    } catch (error) {
      console.warn("Cottage theme could not be injected:", error);
    }

    shell.classList.add("is-ready");
    enter.disabled = false;
    preset.disabled = false;
    enterLabel.textContent = "循灯入内";

    const shouldSkip = localStorage.getItem(skipGateKey) === "1";
    setRemember(shouldSkip);
    if (shouldSkip) window.setTimeout(() => enterCottage({ quiet: true }), 520);
  }

  frame.addEventListener("load", handleFrameReady);
  if (frame.contentDocument && frame.contentDocument.readyState === "complete") handleFrameReady();

  enter.addEventListener("click", () => enterCottage());
  returnSeal.addEventListener("click", reopenGate);
  remember.addEventListener("click", () => setRemember(!rememberIsOn()));
  preset.addEventListener("click", applyStarterPreset);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && shell.classList.contains("has-entered")) reopenGate();
    if (event.key === "Enter" && !shell.classList.contains("has-entered") && !enter.disabled) enterCottage();
  });

  window.setTimeout(() => {
    if (!shell.classList.contains("is-ready")) enterLabel.textContent = "雾重，再候片刻…";
  }, 9000);
})();
