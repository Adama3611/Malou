/* The Yes page: confetti, the typed letter, and the date picker. */
(function () {
  const C = window.VALENTINE;
  const $ = (s) => document.querySelector(s);
  const PLAN_KEY = "valentine-plan";

  document.title = `Yippie!!! 💖`;

  /* ---------- how many tries it took ---------- */
  const tries = parseInt(new URLSearchParams(location.search).get("tries") || "0", 10) || 0;
  $("#tries").textContent =
    tries === 0
      ? "First try!! 🥹 I knew it."
      : tries === 1
      ? "Only took you 1 try to come around 😌"
      : `It only took you ${tries} tries 😤 but I'll take it`;

  /* ---------- confetti ---------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#ff4d88", "#ff8fb1", "#ffd166", "#ffffff", "#c81d5a", "#ffb3c8"];
  let parts = [];
  let running = false;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(x, y, n, dir) {
    if (window.REDUCE_MOTION) return;
    for (let i = 0; i < n; i++) {
      const spread = dir === 0 ? (Math.random() - 0.5) * 16 : dir * (3 + Math.random() * 11);
      parts.push({
        x,
        y,
        vx: spread,
        vy: dir === 0 ? -4 - Math.random() * 10 : -10 - Math.random() * 13,
        s: 7 + Math.random() * 8,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0],
        heart: Math.random() < 0.4,
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function heartPath(s) {
    ctx.beginPath();
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, s / 4);
    ctx.bezierCurveTo(-s / 2, s / 2, 0, s * 0.7, 0, s);
    ctx.bezierCurveTo(0, s * 0.7, s / 2, s / 2, s / 2, s / 4);
    ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, s / 4);
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    parts = parts.filter((p) => p.y < window.innerHeight + 40);
    for (const p of parts) {
      p.vx *= 0.99;
      p.vy += 0.3;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      if (p.heart) {
        ctx.translate(0, -p.s / 2);
        heartPath(p.s * 1.4);
      } else {
        ctx.scale(1, Math.cos(p.rot * 2));
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      }
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(loop);
    else running = false;
  }

  setTimeout(() => {
    burst(0, window.innerHeight, 90, 1);
    burst(window.innerWidth, window.innerHeight, 90, -1);
  }, 250);

  const yippie = $("#yippie");
  yippie.addEventListener("click", () => {
    const r = yippie.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 70, 0);
  });

  /* ---------- the letter, typed out ---------- */
  const typed = $("#typed");
  const sig = $("#sig");
  const plans = $("#plans");
  const text = `Dear ${C.name},\n\n` + C.letter.join("\n\n");
  sig.textContent = C.signature;

  let i = 0;
  let skip = false;
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    typed.textContent = text;
    typed.classList.add("done");
    sig.classList.add("show");
    setTimeout(() => {
      plans.hidden = false;
      plans.classList.add("pop");
    }, 600);
  }

  function tick() {
    if (skip || window.REDUCE_MOTION) return finish();
    i++;
    typed.textContent = text.slice(0, i);
    if (i >= text.length) return finish();
    const ch = text[i - 1];
    const delay = ch === "\n" ? 200 : /[.,!?]/.test(ch) ? 170 : 26 + Math.random() * 34;
    setTimeout(tick, delay);
  }
  $("#letter").addEventListener("click", () => (skip = true));
  setTimeout(tick, 1300);

  /* ---------- pick a date ---------- */
  const options = $("#options");
  const picked = $("#picked");

  function choose(plan, btn, celebrate) {
    options.querySelectorAll(".opt").forEach((b) => b.classList.toggle("chosen", b === btn));
    picked.textContent = `It's a date: ${plan.emoji} ${plan.label}. Screenshot this and send it to me 💌`;
    try {
      localStorage.setItem(PLAN_KEY, plan.label);
    } catch (_) {}
    if (celebrate) {
      const r = btn.getBoundingClientRect();
      window.heartBurst(r.left + r.width / 2, r.top + r.height / 2, 20);
    }
  }

  let saved = null;
  try {
    saved = localStorage.getItem(PLAN_KEY);
  } catch (_) {}

  C.plans.forEach((plan) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.type = "button";
    const e = document.createElement("span");
    e.className = "e";
    e.textContent = plan.emoji;
    b.append(e, plan.label);
    b.addEventListener("click", () => choose(plan, b, true));
    options.appendChild(b);
    if (plan.label === saved) choose(plan, b, false);
  });
})();
