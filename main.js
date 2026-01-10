(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Sticky header shadow on scroll
  const topbar = document.querySelector(".topbar");
  const setShadow = () => {
    const y = window.scrollY || 0;
    if (!topbar) return;
    topbar.dataset.shadow = y > 10 ? "1" : "0";
  };
  setShadow();
  window.addEventListener("scroll", setShadow, { passive: true });

  // Mobile menu
  const btn = document.getElementById("menuBtn");
  const mobile = document.getElementById("mobileNav");
  const toggleMenu = (open) => {
    if (!btn || !mobile) return;
    const isOpen = typeof open === "boolean" ? open : btn.getAttribute("aria-expanded") === "true";
    const next = !isOpen;
    btn.setAttribute("aria-expanded", String(next));
    mobile.hidden = !next;
  };
  btn?.addEventListener("click", () => toggleMenu());
  mobile?.addEventListener("click", (e) => {
    const a = e.target?.closest("a");
    if (a) toggleMenu(false);
  });

  // Active section highlighting
  const links = Array.from(document.querySelectorAll(".navlink"));
  const sections = ["projects", "about", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const id = visible.target.id;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  }, { rootMargin: "-20% 0px -70% 0px", threshold: [0.05, 0.1, 0.2] });

  sections.forEach(s => observer.observe(s));

  // Copy email
  const copyBtn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.style.opacity = "1";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => (toast.hidden = true), 200);
    }, 1400);
  };

  copyBtn?.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Skopiowano email");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Skopiowano email");
    }
  });
})();
