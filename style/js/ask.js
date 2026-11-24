/* The question page: envelope, the cat, the runaway No button, the growing Yes button. */
(function () {
  const C = window.VALENTINE;
  const $ = (s) => document.querySelector(s);

  document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = C.name));
  document.title = `A letter for ${C.name} 💌`;

  const wrap = $("#envelopeWrap");
  const envelope = $("#envelope");
  const card = $("#card");
  const cat = $("#cat");
  const yes = $("#yesButton");
  const no = $("#noButton");
  const sub = $("#sub");
  const buttonsRow = $(".buttons");

  let count = 0;
  let converted = false;

  /* ---------- envelope ---------- */
  let opened = false;
  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    setTimeout(() => wrap.classList.add("leaving"), 1300);
    setTimeout(() => {
      wrap.style.display = "none";
      card.hidden = false;
      card.classList.add("pop");
    }, 1700);
  });

  /* ---------- the cat's mood ---------- */
  function setMood(m) {
    cat.classList.remove("m0", "m1", "m2", "m3");
    cat.classList.add("m" + m);
  }
  function moodFor(n) {
    if (n === 0) return 0;
    if (n < 3) return 1;
    if (n < 6) return 2;
    return 3;
  }

  const subs = [
    [0, "I made this just for you ♥"],
    [2, "hmm… are you sure about that?"],
    [4, "the Yes button is getting bigger, just saying"],
    [6, "you made the cat cry. look at it."],
    [9, "ok at this point No isn't really an option"],
  ];
  function updateSub() {
    let text = subs[0][1];
    for (const [min, t] of subs) if (count >= min) text = t;
    if (sub.textContent !== text) {
      sub.style.opacity = 0;
      setTimeout(() => {
        sub.textContent = text;
        sub.style.opacity = "";
      }, 200);
    }
  }

  /* ---------- No ---------- */
  function registerNo() {
    count++;
    if (count >= C.noLines.length) {
      // The No button gives up and becomes a second Yes.
      converted = true;
      no.textContent = "Yes 💖";
      no.classList.remove("no", "loose");
      no.classList.add("yes");
      no.style.left = no.style.top = "";
      buttonsRow.appendChild(no);
      sub.textContent = "the No button gave up. it's a Yes now 💖";
      setMood(0);
    } else {
      no.textContent = C.noLines[count];
      setMood(moodFor(count));
      updateSub();
    }
    const maxSize = Math.min(64, window.innerWidth / 6);
    yes.style.fontSize = Math.min(20 + count * 4, maxSize) + "px";

    cat.classList.remove("shake");
    void cat.offsetWidth; // restart the animation
    cat.classList.add("shake");
  }

  function dodge(px, py) {
    const pad = 16;
    let r = no.getBoundingClientRect();
    if (!no.classList.contains("loose")) {
      // Pin it where it is first, so it glides away from its spot in the row.
      // It moves to <body> because the card's blur would trap a fixed button inside the card.
      no.style.left = r.left + "px";
      no.style.top = r.top + "px";
      no.classList.add("loose");
      document.body.appendChild(no);
      void no.offsetWidth;
      r = no.getBoundingClientRect();
    }
    const w = r.width;
    const h = r.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const y = yes.getBoundingClientRect();
    let spot = null;
    for (let i = 0; i < 40; i++) {
      const x = pad + Math.random() * Math.max(0, vw - w - 2 * pad);
      const t = pad + Math.random() * Math.max(0, vh - h - 2 * pad);
      const farFromPointer = px == null || Math.hypot(x + w / 2 - px, t + h / 2 - py) > 170;
      const hitsYes = !(x + w < y.left - 14 || x > y.right + 14 || t + h < y.top - 14 || t > y.bottom + 14);
      if (farFromPointer && !hitsYes) {
        spot = [x, t];
        break;
      }
    }
    if (!spot) spot = [pad, pad];
    no.style.left = spot[0] + "px";
    no.style.top = spot[1] + "px";
  }

  // Mouse: it runs away before she can click it.
  no.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse" || converted || yes.disabled) return;
    registerNo();
    if (!converted) dodge(e.clientX, e.clientY);
  });

  // Touch / keyboard (or a lucky mouse click): counts as a No, then it runs.
  no.addEventListener("click", (e) => {
    if (converted) return sayYes(e);
    registerNo();
    if (!converted) dodge(e.detail ? e.clientX : null, e.detail ? e.clientY : null);
  });

  window.addEventListener("resize", () => {
    if (no.classList.contains("loose")) dodge(null, null);
  });

  /* ---------- Yes ---------- */
  yes.addEventListener("pointerenter", () => {
    if (!converted) setMood(0);
  });
  yes.addEventListener("pointerleave", () => {
    if (!converted && !yes.disabled) setMood(moodFor(count));
  });

  function sayYes(e) {
    const r = e.currentTarget.getBoundingClientRect();
    window.heartBurst(r.left + r.width / 2, r.top + r.height / 2, 30);
    setMood(0);
    cat.classList.add("yay");
    yes.disabled = true;
    no.disabled = true;
    setTimeout(() => (location.href = "yes.html?tries=" + count), 900);
  }
  yes.addEventListener("click", sayYes);
})();
