/* ===== Config ===== */
// Paste your KonfHub event / ticket link here. Every button marked `data-konfhub`
// (Register, Reserve Your Seat, Register Now …) will open it.
const KONFHUB_URL = ""; // e.g. "https://konfhub.com/your-event-name"
const EVENT_DATE = new Date("2026-11-09T10:00:00+05:30"); // workshop start (IST)
const ROTATE_WORDS = ["teachers", "researchers", "students", "educators", "innovators"];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Header: scrolled state, mobile menu, active link ===== */
const header = $("#header");
const toTop = $("#toTop");
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 700);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

const navToggle = $("#navToggle");
const navLinks = $("#navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});
$$("#navLinks a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("#navLinks a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
["about", "topics", "schedule", "speakers", "fees", "faq"].forEach((id) => sectionObserver.observe(document.getElementById(id)));

/* ===== Rotating word ===== */
const rot = $("#rotator");
let rotIdx = 0;
if (!reduceMotion) {
  setInterval(() => {
    rot.classList.add("out");
    setTimeout(() => {
      rotIdx = (rotIdx + 1) % ROTATE_WORDS.length;
      rot.textContent = ROTATE_WORDS[rotIdx];
      rot.classList.remove("out");
    }, 350);
  }, 2400);
}

/* ===== Neural network illustration ===== */
(function buildNet() {
  const svg = $("#net");
  const NS = "http://www.w3.org/2000/svg";
  const layers = [
    [45, 95, 145],
    [25, 72, 119, 166],
    [25, 72, 119, 166],
    [70, 120],
  ];
  const xs = [30, 120, 210, 290];
  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };

  const defs = el("defs", {});
  const grad = el("linearGradient", { id: "pulseGrad", x1: "0", x2: "1", y1: "0", y2: "0" });
  grad.append(el("stop", { offset: "0%", "stop-color": "#4f46e5" }), el("stop", { offset: "100%", "stop-color": "#06b6d4" }));
  defs.append(grad);
  svg.append(defs);

  const edges = el("g", {});
  const pulses = el("g", {});
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach((y1) =>
      layers[l + 1].forEach((y2) => {
        const a = { x1: xs[l], y1, x2: xs[l + 1], y2 };
        edges.append(el("line", { ...a, class: "edge" }));
        if (Math.random() < 0.45) {
          const p = el("line", { ...a, class: "pulse", pathLength: "100" });
          p.style.animationDelay = (Math.random() * 2.6).toFixed(2) + "s";
          p.style.animationDuration = (2 + Math.random() * 1.6).toFixed(2) + "s";
          pulses.append(p);
        }
      })
    );
  }
  svg.append(edges, pulses);

  const nodes = el("g", {});
  layers.forEach((ys, l) =>
    ys.forEach((y) => {
      nodes.append(el("circle", { cx: xs[l], cy: y, r: 9, class: "node" }));
      const c = el("circle", { cx: xs[l], cy: y, r: 4, class: "core" });
      c.style.animationDelay = (l * 0.3 + Math.random() * 0.6).toFixed(2) + "s";
      nodes.append(c);
    })
  );
  svg.append(nodes);
})();

/* ===== Fake "training" metrics ===== */
(function training() {
  const bar = $("#trainBar"), epochEl = $("#epoch"), accEl = $("#acc"), lossEl = $("#loss");
  const total = 20;
  let epoch = 0;
  const tick = () => {
    epoch = epoch >= total ? 1 : epoch + 1;
    const t = epoch / total;
    const acc = 62 + 32.4 * (1 - Math.exp(-3.2 * t)) + Math.random() * 0.6;
    const loss = 0.08 + 0.92 * Math.exp(-3.4 * t) + Math.random() * 0.01;
    bar.style.width = t * 100 + "%";
    epochEl.textContent = `Epoch ${epoch}/${total}`;
    accEl.textContent = acc.toFixed(1) + "%";
    lossEl.textContent = loss.toFixed(3);
  };
  tick();
  if (!reduceMotion) setInterval(tick, 900);
})();

/* ===== Countdown ===== */
const pad = (n) => String(n).padStart(2, "0");
function updateCountdown() {
  const diff = Math.max(0, EVENT_DATE - Date.now());
  $("#cd-d").textContent = pad(Math.floor(diff / 864e5));
  $("#cd-h").textContent = pad(Math.floor(diff / 36e5) % 24);
  $("#cd-m").textContent = pad(Math.floor(diff / 6e4) % 60);
  $("#cd-s").textContent = pad(Math.floor(diff / 1e3) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== Scroll reveal + counters ===== */
const countUp = (el) => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now(), dur = 1400;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target;
      t.classList.add("in");
      $$("[data-count]", t).forEach(countUp);
      revealObserver.unobserve(t);
      // hand control back to normal hover styles once revealed
      setTimeout(() => t.classList.remove("reveal", "d1", "d2", "d3", "d4", "d5"), 1300);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ===== Bento tile hover glow ===== */
$$(".tile").forEach((tile) =>
  tile.addEventListener("pointermove", (e) => {
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", e.clientX - r.left + "px");
    tile.style.setProperty("--my", e.clientY - r.top + "px");
  })
);

/* ===== Schedule tabs (segmented control) ===== */
const indicator = $("#segIndicator");
const moveIndicator = (btn) => {
  indicator.style.width = btn.offsetWidth + "px";
  indicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
};
$$(".seg").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".seg").forEach((b) => b.classList.toggle("active", b === btn));
    $$(".timeline").forEach((t) => t.classList.toggle("active", t.id === btn.dataset.day));
    moveIndicator(btn);
  })
);
const initIndicator = () => moveIndicator($(".seg.active"));
window.addEventListener("resize", initIndicator);
document.fonts ? document.fonts.ready.then(initIndicator) : window.addEventListener("load", initIndicator);
initIndicator();

/* ===== FAQ accordion ===== */
$$(".faq-item").forEach((item) => {
  const q = $(".faq-q", item);
  q.addEventListener("click", () => {
    const open = !item.classList.contains("open");
    $$(".faq-item.open").forEach((o) => {
      o.classList.remove("open");
      $(".faq-q", o).setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("open", open);
    q.setAttribute("aria-expanded", open);
  });
});

/* ===== KonfHub registration links ===== */
if (KONFHUB_URL) {
  $$("[data-konfhub]").forEach((a) => {
    a.href = KONFHUB_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ===== Footer year ===== */
$("#year").textContent = new Date().getFullYear();
