/* =========================================================
   QUEEN LIDIYAH — SCRIPT UTAMA
   Version: 5.0 (Batangan emas klasik Antam)
   ========================================================= */

/* ---------- KONSTANTA DATA ---------- */
const BR = {
  "Antam":           { j: 2650000, b: 2500000, c: "#B3122A", s: "ANTAM" },
  "UBS":             { j: 2580000, b: 2470000, c: "#1F4E9C", s: "UBS" },
  "Raja Emas":       { j: 2565000, b: 2455000, c: "#7A1F2B", s: "RAJA EMAS" },
  "Hartadinata":     { j: 2555000, b: 2445000, c: "#1B6B4A", s: "HARTADINATA" },
  "Semar Nusantara": { j: 2540000, b: 2435000, c: "#2F5D62", s: "SEMAR" }
};

const DIG     = { j: 2665000, b: 2480000 };
const AG      = { j: 32000,   b: 27500 };
const GRAM    = [0.5, 1, 2, 5, 10, 25, 50, 100];
const GRAM_AG = [5, 10, 25, 50, 100, 250, 500, 1000];
const FEE     = {
  0.5: 250000, 1: 275000, 2: 300000, 5: 350000,
  10: 450000, 25: 600000, 50: 800000, 100: 1000000
};
const NO_WA   = "6281234567890";

/* ---------- TEKS LUCU ---------- */
const BADGES = [
  "Best seller",
  "Harga pilihan",
  "Pilihan premium",
  "Paling diminati",
  "Favorit pelanggan",
  "Rekomendasi",
  "Nilai terbaik"
];

/* ---------- STATE GLOBAL ---------- */
let metal    = "Emas";
let brandNow = "Semua";
let dig      = 0;
let aset     = [];

/* ---------- HELPER ---------- */
const grams   = () => (metal === "Emas" ? GRAM : GRAM_AG);
const premi   = g => (g <= 0.5 ? 0.08 : g <= 1 ? 0.04 : g <= 2 ? 0.025 : g <= 5 ? 0.015 : 0.008);
const premiAg = g => (g <= 10 ? 0.18 : g <= 50 ? 0.12 : g <= 250 ? 0.08 : 0.05);
const fk      = b => BR[b].j / BR.Antam.j;

const jual = (b, g, m = "Emas") =>
  m === "Emas"
    ? Math.round(BR[b].j * g * (1 + premi(g)))
    : Math.round(AG.j * fk(b) * g * (1 + premiAg(g)));

const beli = (b, g, m = "Emas") =>
  m === "Emas"
    ? Math.round(BR[b].b * g)
    : Math.round(AG.b * fk(b) * g);

const rp = n => "Rp " + Math.round(n).toLocaleString("id-ID");
const $  = id => document.getElementById(id);
const ld = (k, d) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; }
  catch (e) { return d; }
};
const sv = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
};

const pageLoader = $("pageLoader");
if (pageLoader) {
  const hidePageLoader = () => window.setTimeout(() => {
    pageLoader.classList.add("out");
    pageLoader.setAttribute("aria-hidden", "true");
  }, 1000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hidePageLoader, { once: true });
  } else {
    hidePageLoader();
  }
}

/* ---------- UI FEEDBACK ---------- */
function toast(t) {
  const e = $("toast");
  if (!e) return;
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(e._t);
  e._t = setTimeout(() => e.classList.remove("show"), 2800);
}

function fail(errId, inputId, msg) {
  $(errId).textContent = msg;
  if (inputId) {
    $(inputId).classList.add("bad");
    $(inputId).focus();
  }
  return false;
}

function clear(errId, ...ids) {
  $(errId).textContent = "";
  ids.forEach(i => $(i).classList.remove("bad"));
}

const opsiBrand = () => Object.keys(BR).map(b => `<option>${b}</option>`).join("");
const opsiGram  = () => GRAM.map(g => `<option value="${g}">${g} gram</option>`).join("");

/* ---------- FOTO BATANGAN (SVG fallback) ---------- */
const FB = {};
const fileBase = name => ({
  Antam: "antam",
  UBS: "ubs",
  "Raja Emas": "raja emas",
  Hartadinata: "hartadinata",
  "Semar Nusantara": "semar"
}[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());

function foto(b, g, m = "Emas") {
  const list = m === "Emas" ? GRAM : GRAM_AG;
  const t = list.indexOf(g) / (list.length - 1);
  const w = 60 + t * 80, h = 36 + t * 30;
  const x = (160 - w) / 2, y = (100 - h) / 2;
  const s = BR[b].s, fs = Math.min(9, (w - 12) / (s.length * 0.75));
  const base = fileBase(b);
  const suffix = m === "Emas" ? "" : "-perak";
  const key = `${base}${suffix}-${g}`;

  FB[key] = `<svg viewBox="0 0 160 100" role="img" aria-label="Ilustrasi ${m} ${b} ${g} gram">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5"
      fill="url(#${m === "Emas" ? "gold" : "silver"})"
      stroke="${m === "Emas" ? "#8A6414" : "#6D747D"}"/>
    <rect x="${x + 4}" y="${y + h * 0.28}" width="${w - 8}" height="${h * 0.34}"
      rx="2" fill="${BR[b].c}" opacity=".9"/>
    <text x="80" y="${y + h * 0.28 + h * 0.17 + fs / 3}" text-anchor="middle"
      font-size="${fs}" font-weight="700"
      fill="${m === "Emas" ? "#F5DC94" : "#fff"}"
      font-family="Figtree,sans-serif">${s}</text>
    <text x="80" y="${y + h - 5}" text-anchor="middle" font-size="6"
      fill="#3a2c08" font-family="Figtree,sans-serif">${g} g · ${m === "Emas" ? "999.9" : "999"}</text>
  </svg>`;

  return `<img src="assets/images/${base}${suffix}-${g}.jpg" alt="${m} ${b} ${g} gram"
    loading="lazy" onerror="this.outerHTML=FB['${key}']">`;
}

/* =========================================================
    LOGO TILT
   ========================================================= */
(function initLogoTilt() {
  const wrap = document.getElementById("logoWrap");
  if (!wrap) return;

  const brand = document.getElementById("brandLogo");
  if (!brand) return;

  const MAX_TILT = 18;

  brand.addEventListener("mousemove", e => {
    const r = wrap.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);

    const cdx = Math.max(-1, Math.min(1, dx));
    const cdy = Math.max(-1, Math.min(1, dy));

    wrap.style.setProperty("--tiltX", (cdx * MAX_TILT) + "deg");
    wrap.style.setProperty("--tiltY", (-cdy * MAX_TILT) + "deg");
    wrap.classList.add("tilting");
  });

  brand.addEventListener("mouseleave", () => {
    wrap.style.setProperty("--tiltX", "0deg");
    wrap.style.setProperty("--tiltY", "0deg");
    wrap.classList.remove("tilting");
  });
})();

/* =========================================================
    CONFETTI
   ========================================================= */
function launchConfetti(count = 60) {
  const container = document.getElementById("confetti");
  if (!container) return;

  const colors = ["#F5DC94", "#D8A93B", "#1E3554", "#FFFFFF"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + "s";
    piece.style.animationDelay = (Math.random() * 0.5) + "s";
    piece.style.width = (6 + Math.random() * 8) + "px";
    piece.style.height = (10 + Math.random() * 10) + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

    container.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

/* =========================================================
    COIN RAIN
   ========================================================= */
function launchCoinRain(originElement = $("brandLogo"), count = 28) {
  const container = $("coinRain");
  if (!container || !originElement) return;
  const origin = originElement.getBoundingClientRect();
  const maxCoinWidth = 46;
  const width = Math.max(0, window.innerWidth - maxCoinWidth);

  for (let i = 0; i < count; i++) {
    const coin = document.createElement("span");
    const delay = Math.random() * 0.45;
    const isBar = i % 2 === 0;
    coin.className = isBar ? "coin coin-bar" : "coin coin-crown";
    coin.textContent = isBar ? "Au 999.9" : "";
    coin.style.left = Math.random() * width + "px";
    coin.style.top = origin.top + origin.height / 2 + "px";
    coin.style.setProperty("--drift", (Math.random() - 0.5) * 150 + "px");
    coin.style.animationDelay = delay + "s";
    coin.style.animationDuration = (2.2 + Math.random() * 1.1) + "s";
    container.appendChild(coin);
    setTimeout(() => coin.remove(), 3800 + delay * 1000);
  }
}

/* =========================================================
   STICKY HEADER SHRINK
   ========================================================= */
(function initHeaderScroll() {
  const top = document.querySelector(".top");
  if (!top) return;
  window.addEventListener("scroll", () => {
    top.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
})();

/* =========================================================
   HAMBURGER MENU
   ========================================================= */
(function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.classList.toggle("active", open);
    btn.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
    });
  });
})();

/* =========================================================
   BACK TO TOP
   ========================================================= */
(function initBackTop() {
  const btn = document.getElementById("backTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast(" Wush! Sampai di atas!");
  });
})();

/* =========================================================
   REVEAL SAAT SCROLL
   ========================================================= */
function initReveal() {
  const els = document.querySelectorAll(".summary > div, .card, .item, .tick, .fun-badge");
  if (!("IntersectionObserver" in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => {
    if (!el.style.transform) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    }
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    obs.observe(el);
  });
}

/* =========================================================
   NAVIGASI VIEW
   ========================================================= */
function show(v, triggerElement = null) {
  document.querySelectorAll("[data-page]").forEach(page => {
    page.hidden = page.dataset.page !== v;
  });
  document.querySelectorAll("nav button").forEach(b => {
    b.classList.toggle("on", b.dataset.view === v);
  });
  document.body.setAttribute("data-view", v);
  if (triggerElement) launchCoinRain(triggerElement);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("nav [data-view], #brandLogo").forEach(b => {
  b.addEventListener("click", e => {
    e.preventDefault();
    show(b.dataset.view, b);
  });
});

/* =========================================================
   BERANDA & KATALOG
   ========================================================= */
$("tgl").textContent = new Date().toLocaleDateString("id-ID", {
  day: "numeric", month: "long", year: "numeric"
});

$("ticker").innerHTML = [
  ["Emas Antam per gram", BR.Antam.j, BR.Antam.b],
  ["Perak Antam per gram", jual("Antam", 1, "Perak"), beli("Antam", 1, "Perak")],
  ["Emas digital per gram", DIG.j, DIG.b]
].map(([t, j, b]) => `
  <div class="tick">
    <small>${t}</small>
    <strong>${rp(j)}</strong>
    <span>Beli kembali ${rp(b)} · selisih ${rp(j - b)}</span>
  </div>`).join("");

$("filters").innerHTML = ["Semua", ...Object.keys(BR)]
  .map((b, i) => `<button data-brand="${b}" class="${i ? "" : "on"}">${b}</button>`)
  .join("");

function renderKatalog() {
  const katalog = $("katalog");
  if (metal === "Perak" && brandNow === "UBS") {
    katalog.innerHTML = `<p class="catalog-message" role="status">Perak dari merek UBS sedang tidak tersedia.</p>`;
    return;
  }

  if (metal === "Perak" && brandNow === "Raja Emas") {
    katalog.innerHTML = `<p class="catalog-message" role="status">Perak dari merek Raja Emas sedang tidak tersedia.</p>`;
    return;
  }

  if (metal === "Perak" && brandNow === "Hartadinata") {
    katalog.innerHTML = `<p class="catalog-message" role="status">Perak dari merek Hartadinata sedang tidak tersedia.</p>`;
    return;
  }

  if (metal === "Perak" && brandNow === "Semar Nusantara") {
    katalog.innerHTML = `<p class="catalog-message" role="status">Perak dari merek Semar Nusantara sedang tidak tersedia.</p>`;
    return;
  }

  const merek = brandNow === "Semua"
    ? Object.keys(BR).filter(b => {
        if (metal === "Perak") return b === "Antam";
        return true;
      })
    : [brandNow];
  let i = 0;
  katalog.innerHTML = merek.flatMap(b => {
    let sizes = metal === "Perak" && b === "Antam" ? [250, 500] : grams();

    if (b === "Semar Nusantara" && metal === "Emas") {
      sizes = sizes.filter(g => g !== 0.5 && g !== 50 && g !== 100);
    }

    if (b === "Hartadinata" && metal === "Emas") {
      sizes = sizes.filter(g => g !== 50 && g !== 100);
    }

    if (b === "Raja Emas" && metal === "Emas") {
      sizes = sizes.filter(g => g !== 25);
    }

    return sizes.map(g => {
      const j = jual(b, g, metal);
      const k = beli(b, g, metal);
      const showBadge = Math.random() > 0.6;
      const badge = BADGES[Math.floor(Math.random() * BADGES.length)];
      return `
        <article class="card gcard" style="--i:${i++ % 12}">
          ${showBadge ? `<span class="badge">${badge}</span>` : ""}
          <div class="foto">${foto(b, g, metal)}</div>
          <div class="gbody">
            <small>${metal} ${b}</small>
            <b>${g} gram</b>
            <dl>
              <dt>Harga jual</dt><dd>${rp(j)}</dd>
              <dt>Beli kembali</dt><dd>${rp(k)}</dd>
              <dt>Selisih</dt><dd>${rp(j - k)} (${((j - k) / j * 100).toFixed(1)}%)</dd>
            </dl>
          </div>
        </article>`;
    });
  }).join("");
}

$("filters").addEventListener("click", e => {
  const b = e.target.closest("[data-brand]");
  if (!b) return;
  document.querySelectorAll("#filters button").forEach(x => x.classList.toggle("on", x === b));
  brandNow = b.dataset.brand;
  renderKatalog();
});

$("metal").addEventListener("click", e => {
  const b = e.target.closest("[data-m]");
  if (!b) return;
  metal = b.dataset.m;
  document.querySelectorAll("#metal button").forEach(x => x.classList.toggle("on", x === b));
  renderKatalog();
});

renderKatalog();

/* =========================================================
   EMAS DIGITAL
   ========================================================= */
dig  = ld("dig", 0);
aset = ld("aset", []);

$("dJual").textContent = rp(DIG.j);
$("dBeli").textContent = rp(DIG.b);

function renderDigital() {
  $("dGram").textContent  = dig.toFixed(4) + " g";
  $("dNilai").textContent = rp(dig * DIG.b);
  $("bar").style.width    = Math.min(dig / 0.5, 1) * 100 + "%";
  $("dInfo").textContent  = dig >= 0.5
    ? " Saldo udah cukup! Bisa cetak jadi emas fisik lho~"
    : ` Semangat! Kurang ${(0.5 - dig).toFixed(4)} g lagi (sekitar ${rp((0.5 - dig) * DIG.j)}) buat bisa dicetak.`;

  const opsi = GRAM.filter(g => g <= dig + 1e-9);
  $("cetak").hidden = !opsi.length;
  $("cetakList").innerHTML = opsi
    .map(g => `<button class="opt" data-g="${g}"><b>${g} gram</b><small>Biaya cetak ${rp(FEE[g])}</small></button>`)
    .join("");

  sv("dig", dig);
  renderAset();
}

$("fBeli").addEventListener("submit", e => {
  e.preventDefault();
  clear("bErr", "bRp");
  const n = +$("bRp").value;
  if (!n || n < 10000) return fail("bErr", "bRp", "Nominal beli minimal Rp 10.000.");
  const g = Math.floor(n / DIG.j * 10000) / 10000;
  dig = +(dig + g).toFixed(4);
  $("bRp").value = "";
  renderDigital();
  launchConfetti(50);
  toast(` Berhasil beli ${g.toFixed(4)} gram!`);
});

$("fJual").addEventListener("submit", e => {
  e.preventDefault();
  clear("jErr2", "jGr");
  const g = +$("jGr").value;
  if (!g || g <= 0) return fail("jErr2", "jGr", "Isi jumlah gram yang mau dijual.");
  if (g > dig)     return fail("jErr2", "jGr", "Jumlah melebihi saldo emas digitalmu.");
  dig = +(dig - g).toFixed(4);
  $("jGr").value = "";
  renderDigital();
  toast(` Terjual! Kamu terima ${rp(g * DIG.b)}`);
});

$("cetakList").addEventListener("click", e => {
  const b = e.target.closest("[data-g]");
  if (!b) return;
  const g = +b.dataset.g;
  if (!confirm(` Cetak ${g} gram jadi emas fisik?\nBiaya cetak ${rp(FEE[g])}, dibayar saat ambil di toko Queen Lidiyah.`)) return;
  dig = +(dig - g).toFixed(4);
  aset.push({ b: "Cetakan toko", g, q: 1, cetak: 1, fee: FEE[g] });
  sv("aset", aset);
  renderDigital();
  launchConfetti(30);
  toast(" Permintaan cetak dicatat!");
});

/* =========================================================
   PORTOFOLIO
   ========================================================= */
$("pBrand").innerHTML = opsiBrand();
$("pGram").innerHTML  = opsiGram();

function renderAset() {
  let total = dig * DIG.b;
  let berat = 0;

  $("daftar").innerHTML = aset.length
    ? aset.map((a, i) => {
        const merekNilai = BR[a.b] ? a.b : "Antam";
        const nilai = beli(merekNilai, a.g) * a.q;
        total += nilai;
        berat += a.g * a.q;
        return `
          <div class="item" style="--i:${i}">
            <div>
              <b>${a.cetak ? `Emas cetak ${a.g} g` : `${a.q} batang ${a.b} ${a.g} g`}</b>
              ${a.cetak ? ` <span class="tag">Cetak digital</span>` : ""}
              <br>
              <small>Estimasi ${rp(nilai)}${a.cetak ? ` · biaya cetak ${rp(a.fee)}` : ""}</small>
            </div>
            <button data-i="${i}"> Hapus</button>
          </div>`;
      }).join("")
    : `<div class="empty">
      Album masih kosong.<br>
      <small>Catat kepemilikan emas fisik pertama di atas.</small>
      </div>`;

  $("total").textContent = rp(total);
  $("berat").textContent = berat.toLocaleString("id-ID") + " g";
}

$("daftar").addEventListener("click", e => {
  if (e.target.dataset.i === undefined) return;
  aset.splice(+e.target.dataset.i, 1);
  sv("aset", aset);
  renderAset();
  toast(" Catatan dihapus!");
});

$("fPorto").addEventListener("submit", e => {
  e.preventDefault();
  clear("pErr", "pQty");
  const q = parseInt($("pQty").value, 10);
  if (!q || q < 1) return fail("pErr", "pQty", "Isi jumlah batang minimal 1.");
  const b = $("pBrand").value;
  const g = +$("pGram").value;
  const ada = aset.find(a => a.b === b && a.g === g && !a.cetak);
  if (ada) ada.q += q; else aset.push({ b, g, q });
  sv("aset", aset);
  renderAset();
  $("pQty").value = "";
  toast(" Tersimpan ke album!");
});

/* =========================================================
   KALKULATOR
   ========================================================= */
document.querySelectorAll(".tabs button").forEach(b => {
  b.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach(x => {
      const on = x === b;
      x.classList.toggle("on", on);
      x.setAttribute("aria-selected", on);
    });
    document.querySelectorAll(".tab").forEach(t => {
      t.hidden = t.id !== "t-" + b.dataset.tab;
    });
  });
});

$("cRp").addEventListener("input", () => {
  const n = +$("cRp").value;
  $("cRpOut").innerHTML = n > 0
    ? ` Kamu dapat <b>${(n / DIG.j).toFixed(4)} gram</b> emas digital!`
    : "Isi nominal untuk lihat gram yang didapat~";
});

$("cGr").addEventListener("input", () => {
  const g = +$("cGr").value;
  $("cGrOut").innerHTML = g > 0
    ? ` Nilai jual kembali <b>${rp(g * DIG.b)}</b>`
    : "Isi gram untuk lihat nilai jual kembali~";
});

$("kBrand").innerHTML = opsiBrand();
$("kGram").innerHTML  = opsiGram();

$("t-fisik").addEventListener("submit", e => {
  e.preventDefault();
  clear("kErr", "kQty");
  const q = parseInt($("kQty").value, 10);
  if (!q || q < 1) return fail("kErr", "kQty", "Isi jumlah batang minimal 1.");
  const b = $("kBrand").value;
  const g = +$("kGram").value;
  const tb = jual(b, g) * q;
  const tj = beli(b, g) * q;
  $("kOut").innerHTML = `
    <span> ${q} batang ${b} ${g} g</span>
    <span> Harga beli: <b>${rp(tb)}</b></span>
    <span> Nilai jual kembali: <b>${rp(tj)}</b></span>
    <span> Selisih: <b>${rp(tb - tj)}</b> (${((tb - tj) / tb * 100).toFixed(1)}%)</span>`;
  toast(" Selesai dihitung!");
});

$("t-tabung").addEventListener("submit", e => {
  e.preventDefault();
  clear("sErr", "sBulan", "sLama", "sGrowth");
  const s = +$("sBulan").value;
  const n = +$("sLama").value;
  const g = +$("sGrowth").value;

  if (!s || s < 10000)             return fail("sErr", "sBulan",  "Tabungan per bulan minimal Rp 10.000.");
  if (!n || n < 1 || n > 360)      return fail("sErr", "sLama",   "Lama menabung harus 1–360 bulan.");
  if (isNaN(g) || g < 0 || g > 50) return fail("sErr", "sGrowth", "Kenaikan harga harus 0–50 persen.");

  const r = Math.pow(1 + g / 100, 1 / 12) - 1;
  let gram = 0;
  for (let t = 1; t <= n; t++) gram += s / (DIG.j * Math.pow(1 + r, t));

  const nilai = gram * DIG.b * Math.pow(1 + r, n);
  const modal = s * n;
  const u = nilai - modal;

  $("sOut").innerHTML = `
    <span> Setelah ${n} bulan nabung ${rp(s)}/bulan</span>
    <span> Emas terkumpul: <b>${gram.toFixed(2)} gram</b></span>
    <span> Modal: ${rp(modal)}</span>
    <span> Perkiraan nilai: <b>${rp(nilai)}</b></span>
    <span> Selisih: <b>${u >= 0 ? "+" : "−"}${rp(Math.abs(u))}</b></span>
    <span>${gram >= 0.5 ? " Udah cukup buat cetak fisik!" : " Semangat nabung terus!"}</span>`;
  if (u > 0) launchConfetti(20);
});

/* =========================================================
   TOKO
   ========================================================= */
$("wa").href = `https://wa.me/${NO_WA}?text=` +
  encodeURIComponent("Halo Queen Lidiyah, saya mau tanya soal emas ");
$("jTgl").min = new Date().toISOString().split("T")[0];

$("fJanji").addEventListener("submit", e => {
  e.preventDefault();
  clear("jErr", "jNama", "jTgl");
  if ($("jNama").value.trim().length < 3) return fail("jErr", "jNama", "Nama minimal 3 huruf.");
  if (!$("jTgl").value)                   return fail("jErr", "jTgl",  "Pilih tanggal kedatangan.");
  if (new Date($("jTgl").value).getDay() === 0)
    return fail("jErr", "jTgl", " Toko tutup Minggu. Pilih hari lain ya!");
  toast(` Janji terkirim! Sampai jumpa ${$("jTgl").value} `);
  e.target.reset();
});

/* =========================================================
    BATANGAN EMAS INTERAKTIF — drag untuk muter
   ========================================================= */
const st = $("stage");
const bar = $("ingot");

if (st && bar) {
  let ry = 25, vel = 0, drag = false, lx = 0, moved = 0;

  st.addEventListener("pointerdown", e => {
    drag = true; lx = e.clientX; moved = 0; vel = 0;
    st.setPointerCapture(e.pointerId);
  });

  st.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - lx;
    lx = e.clientX;
    ry += dx;
    vel = dx;
    moved += Math.abs(dx);
  });

  st.addEventListener("pointerup", () => {
    drag = false;
    if (moved < 6) hujan();
  });

  (function loop() {
    if (!drag) {
      ry += vel;
      vel *= 0.96;
      if (Math.abs(vel) < 0.3) vel = 0.3;
    }
    // Update variabel CSS --ry (rotasi Y batangan)
    bar.style.setProperty("--ry", ry + "deg");
    requestAnimationFrame(loop);
  })();

  function hujan() {
    for (let i = 0; i < 16; i++) {
      const d = document.createElement("span");
      const s = 10 + Math.random() * 12;
      d.className = "drop";
      d.style.cssText = `
        left:${Math.random() * 92}%;
        width:${s * 1.8}px;
        height:${s}px;
        --t:${1 + Math.random()}s;
        animation-delay:${Math.random() * 0.4}s`;
      d.onanimationend = () => d.remove();
      st.appendChild(d);
    }
  }
}

/* Ganti logam (emas ↔ perak) */
$("imetal").addEventListener("click", e => {
  const b = e.target.closest("[data-m]");
  if (!b) return;
  document.querySelectorAll("#imetal button").forEach(x => x.classList.toggle("on", x === b));
  st.classList.toggle("ag", b.dataset.m === "Perak");
});

/* =========================================================
   GRAFIK HARGA EMAS DIGITAL
   ========================================================= */
function riwayat(n) {
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const v = [1];
  for (let i = 1; i < n; i++) v.push(v[i - 1] * (1 + (r() - 0.47) * 0.012));
  const k = DIG.j / v[n - 1];
  const sp = DIG.j - DIG.b;
  return v.map(x => ({ j: x * k, b: x * k - sp }));
}

function gambarGrafik(n = 30) {
  const d = riwayat(n);
  const W = 760, H = 300;
  const p = { left: 62, right: 20, top: 18, bottom: 34 };
  const all = d.flatMap(x => [x.j, x.b]);
  const range = Math.max(...all) - Math.min(...all) || 1;
  const mn = Math.min(...all) - range * 0.12;
  const mx = Math.max(...all) + range * 0.12;

  const X = i => p.left + i * (W - p.left - p.right) / (n - 1);
  const Y = v => H - p.bottom - (v - mn) / (mx - mn) * (H - p.top - p.bottom);
  const line = k => d.map((x, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(x[k]).toFixed(1)}`).join("");
  const area = `${line("j")} L${X(n - 1)} ${H - p.bottom} L${X(0)} ${H - p.bottom} Z`;
  const grid = Array.from({ length: 5 }, (_, i) => {
    const y = p.top + i * (H - p.top - p.bottom) / 4;
    const value = mx - i * (mx - mn) / 4;
    return `
      <line class="chart-gridline" x1="${p.left}" x2="${W - p.right}" y1="${y}" y2="${y}" />
      <text class="chart-axis-label" x="${p.left - 10}" y="${y + 4}" text-anchor="end">${(value / 1000000).toFixed(2)}</text>`;
  }).join("");
  const labels = [
    { x: p.left, text: `${n} hari lalu`, anchor: "start" },
    { x: (p.left + W - p.right) / 2, text: "Periode", anchor: "middle" },
    { x: W - p.right, text: "Hari ini", anchor: "end" }
  ].map(label => `<text class="chart-axis-label" x="${label.x}" y="${H - 6}" text-anchor="${label.anchor}">${label.text}</text>`).join("");

  $("chart").innerHTML = `
    <div class="chart-legend" aria-hidden="true">
      <span class="legend-sell">Harga jual</span>
      <span class="legend-buy">Beli kembali</span>
    </div>
    <svg class="price-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik area harga jual dan beli kembali selama ${n} hari">
      <defs>
        <linearGradient id="sellArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#B08A45" stop-opacity=".24" />
          <stop offset="1" stop-color="#B08A45" stop-opacity=".015" />
        </linearGradient>
      </defs>
      ${grid}
      ${labels}
      <path class="chart-area" d="${area}" />
      <path class="chart-line chart-line-sell" d="${line("j")}" />
      <path class="chart-line chart-line-buy" d="${line("b")}" />
      <line class="chart-crosshair" id="gl" y1="${p.top}" y2="${H - p.bottom}" opacity="0" />
      <circle class="chart-point chart-point-sell" id="gd" r="5" opacity="0" />
      <circle class="chart-point chart-point-buy" id="gbd" r="4" opacity="0" />
    </svg>`;

  const svg = $("chart").querySelector(".price-chart");
  const gl = svg.querySelector("#gl");
  const gd = svg.querySelector("#gd");
  const gbd = svg.querySelector("#gbd");

  const info = i => {
    const x = d[i];
    $("spread").innerHTML =
      `${i === n - 1 ? "Hari ini" : (n - 1 - i) + " hari lalu"}: ` +
      `jual <b>${rp(x.j)}</b> · beli <b>${rp(x.b)}</b> · ` +
      `selisih <b>${rp(x.j - x.b)}</b> (${((x.j - x.b) / x.j * 100).toFixed(1)}%)`;
  };

  info(n - 1);

  svg.addEventListener("pointermove", e => {
    const r = svg.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * W;
    const i = Math.max(0, Math.min(n - 1, Math.round((x - p.left) / (W - p.left - p.right) * (n - 1))));
    gl.setAttribute("x1", X(i));
    gl.setAttribute("x2", X(i));
    gl.setAttribute("opacity", 1);
    gd.setAttribute("cx", X(i));
    gd.setAttribute("cy", Y(d[i].j));
    gd.setAttribute("opacity", 1);
    gbd.setAttribute("cx", X(i));
    gbd.setAttribute("cy", Y(d[i].b));
    gbd.setAttribute("opacity", 1);
    info(i);
  });

  svg.addEventListener("pointerleave", () => {
    gl.setAttribute("opacity", 0);
    gd.setAttribute("opacity", 0);
    gbd.setAttribute("opacity", 0);
    info(n - 1);
  });
}

$("range").addEventListener("click", e => {
  const b = e.target.closest("[data-d]");
  if (!b) return;
  document.querySelectorAll("#range button").forEach(x => x.classList.toggle("on", x === b));
  gambarGrafik(+b.dataset.d);
});

gambarGrafik();

/* =========================================================
   PENDAFTARAN & KELUAR
   ========================================================= */
const splash = $("splash");

const sapa = (u, baru) => {
  $("salam").textContent = `Halo, ${u.nama.split(" ")[0]}! Selamat datang${baru ? "" : " kembali"} di Queen Lidiyah.`;
  $("jNama").value = u.nama;
};

function masuk(u) {
  sapa(u, true);
  splash.classList.add("out");
  show("katalog");
  toast(`Selamat datang, ${u.nama.split(" ")[0]}!`);
}

function tampilSplash() {
  const sc = splash.querySelector(".scene");
  sc.style.animation = "none"; void sc.offsetWidth; sc.style.animation = "";

  const f = $("fDaftar");
  f.style.animation = "none"; void f.offsetWidth; f.style.animation = "";

  splash.scrollTop = 0;
  splash.classList.remove("out");
}

const user = ld("user", null);
if (user) {
  splash.classList.add("out", "now");
  sapa(user, false);
  requestAnimationFrame(() => requestAnimationFrame(() => splash.classList.remove("now")));
}

$("fDaftar").addEventListener("submit", e => {
  e.preventDefault();
  clear("dErr", "dNama", "dTelp", "dAlamat");

  const nama = $("dNama").value.trim();
  const telp = $("dTelp").value.replace(/[\s-]/g, "");
  const alamat = $("dAlamat").value.trim();

  if (nama.length < 3)
    return fail("dErr", "dNama", "Nama minimal 3 huruf.");

  if (!/^(\+62|62|0)8\d{8,11}$/.test(telp))
    return fail("dErr", "dTelp", "Nomor telepon tidak valid. Contoh: 081234567890.");

  if (alamat.length < 8)
    return fail("dErr", "dAlamat", "Alamat minimal 8 karakter.");

  const user = { nama, telp, alamat };
  sv("user", user);
  masuk(user);
});

$("daftarMasuk").addEventListener("click", () => $("fDaftar").requestSubmit());

const logoutConfirm = $("logoutConfirm");

$("logout").addEventListener("click", () => logoutConfirm.showModal());
$("logoutCancel").addEventListener("click", () => logoutConfirm.close());
logoutConfirm.addEventListener("click", event => {
  if (event.target === logoutConfirm) logoutConfirm.close();
});

$("logoutConfirmButton").addEventListener("click", () => {
  logoutConfirm.close();
  localStorage.removeItem("user");
  $("fDaftar").reset();
  clear("dErr", "dNama", "dTelp", "dAlamat");
  const goodbye = $("goodbyeLoader");
  goodbye.classList.add("show");
  goodbye.setAttribute("aria-hidden", "false");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 450 : 1600;
  window.setTimeout(() => {
    goodbye.classList.remove("show");
    goodbye.setAttribute("aria-hidden", "true");
    tampilSplash();
  }, delay);
});

$("masukTamu").addEventListener("click", () => masuk({ nama: "Tamu" }));
