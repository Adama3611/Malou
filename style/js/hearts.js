/* Floating hearts in the background + a heart burst helper used by both pages. */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.REDUCE_MOTION = reduceMotion;

  // Burst of hearts from a point (used on button clicks).
  window.heartBurst = function (x, y, count) {
    const n = reduceMotion ? 6 : count || 16;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "burst-heart";
      s.textContent = i % 3 ? "♥" : "💖";
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.fontSize = 14 + Math.random() * 18 + "px";
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2;
      const d = 60 + Math.random() * 120;
      const anim = s.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1)`,
            opacity: 0,
          },
        ],
        { duration: 700 + Math.random() * 500, easing: "cubic-bezier(.2,.8,.3,1)" }
      );
      anim.onfinish = () => s.remove();
    }
  };

  const box = document.getElementById("hearts");
  if (!box || reduceMotion) return;

  function spawn() {
    if (document.hidden) return;
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() < 0.85 ? "♥" : "💗";
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 12 + Math.random() * 26 + "px";
    h.style.setProperty("--o", (0.35 + Math.random() * 0.5).toFixed(2));
    h.style.setProperty("--dx", Math.random() * 120 - 60 + "px");
    h.style.setProperty("--r", Math.random() * 90 - 45 + "deg");
    h.style.animationDuration = 7 + Math.random() * 7 + "s";
    h.addEventListener("animationend", () => h.remove());
    box.appendChild(h);
  }

  for (let i = 0; i < 10; i++) setTimeout(spawn, i * 200);
  setInterval(spawn, 650);
})();
