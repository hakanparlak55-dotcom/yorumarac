(function () {
  "use strict";

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  function post(url, data) {
    return fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(data),
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Hata"); return j; }); });
  }

  // Tek tık oylar: faydalı, ben de yaşadım ve model anketi (sende var mı, alır mıydın)
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-vote]");
    if (btn) {
      e.preventDefault();
      var kind = btn.getAttribute("data-vote");
      var target = btn.getAttribute("data-target");
      var payload = { kind: kind, target: target };
      var poll = kind === "again" || kind === "owner";
      if (poll) payload.value = Number(btn.getAttribute("data-value"));
      btn.disabled = true;
      post("/api/oy", payload).then(function (res) {
        if (poll) {
          // Sunucu anket kutusunu güncel sonuçlarla yeniden üretip gönderir.
          var box = btn.closest("[data-poll]");
          var wrap = document.createElement("div");
          wrap.innerHTML = res.html;
          if (box && wrap.firstElementChild) box.replaceWith(wrap.firstElementChild);
          toast("Cevabın kaydedildi");
        } else {
          btn.classList.toggle("is-on", res.on);
          btn.setAttribute("aria-pressed", res.on ? "true" : "false");
          btn.querySelector(".vote-n").textContent = res.n;
        }
      }).catch(function (err) { toast(err.message || "Oy kaydedilemedi"); })
        .finally(function () { btn.disabled = false; });
      return;
    }

    var rep = e.target.closest("[data-report]");
    if (rep) {
      var reason = window.prompt("Bu içeriği neden bildiriyorsun? (Hakaret, reklam, sahte deneyim…)");
      if (reason === null) return;
      post("/api/bildir", { kind: rep.getAttribute("data-report"), target: rep.getAttribute("data-target"), reason: reason })
        .then(function () { rep.textContent = "Bildirildi"; rep.disabled = true; toast("Bildirimin alındı, incelenecek."); })
        .catch(function () { toast("Bildirim gönderilemedi"); });
      return;
    }

    var share = e.target.closest("[data-share]");
    if (share) {
      var title = share.getAttribute("data-share") + " sahipleri ne diyor?";
      if (navigator.share) { navigator.share({ title: title, url: location.href }).catch(function () {}); }
      else if (navigator.clipboard) { navigator.clipboard.writeText(location.href).then(function () { toast("Bağlantı kopyalandı"); }); }
    }
  });

  // "Sorun bildir" bağlantısıyla gelinince kapalı formu aç.
  function openReport() {
    var d = document.getElementById("sorun-bildir");
    if (d && location.hash === "#sorun-bildir") { d.open = true; d.scrollIntoView({ block: "start" }); }
  }
  window.addEventListener("hashchange", openReport);
  openReport();

  // Liste içi filtre (marka/model ara)
  document.querySelectorAll("[data-filter]").forEach(function (input) {
    var items = document.querySelectorAll(input.getAttribute("data-filter"));
    input.addEventListener("input", function () {
      var q = input.value.toLocaleLowerCase("tr").trim();
      items.forEach(function (li) { li.hidden = q && li.getAttribute("data-name").indexOf(q) === -1; });
    });
  });

  // Sıfır fiyatlar: arama, filtre, sıralama
  var table = document.getElementById("mkt-table");
  if (table) {
    var state = { q: "", brand: "", fuel: "", sort: "", body: "" };
    var groups = Array.prototype.slice.call(table.querySelectorAll("tbody[data-group]"));
    var empty = document.getElementById("mkt-empty");
    function apply() {
      var shown = 0;
      var order = groups.map(function (g) {
        var rows = Array.prototype.slice.call(g.querySelectorAll("tr[data-row]"));
        var vis = 0, best = null;
        rows.forEach(function (r) {
          var ok = (!state.q || r.dataset.text.indexOf(state.q) !== -1) && (!state.brand || r.dataset.brand === state.brand) &&
            (!state.fuel || r.dataset.fuel === state.fuel) && (!state.body || r.dataset.body === state.body);
          r.hidden = !ok;
          if (ok) {
            vis++;
            var ch = r.dataset.change === "" ? null : Number(r.dataset.change), pr = Number(r.dataset.price);
            var v = state.sort === "up" ? -(ch == null ? -1e9 : ch) : state.sort === "down" ? (ch == null ? 1e9 : ch) : state.sort === "cheap" ? pr : state.sort === "exp" ? -pr : 0;
            if (best == null || v < best) best = v;
          }
        });
        g.hidden = vis === 0;
        shown += vis;
        return { g: g, v: best == null ? 0 : best };
      });
      if (state.sort) order.sort(function (a, b) { return a.v - b.v; });
      order.forEach(function (o) { table.appendChild(o.g); });
      empty.classList.toggle("is-hidden", shown > 0);
    }
    document.querySelectorAll("[data-mkt]").forEach(function (el) {
      el.addEventListener(el.tagName === "INPUT" ? "input" : "change", function () {
        var k = el.getAttribute("data-mkt");
        state[k] = k === "q" ? el.value.toLocaleLowerCase("tr").trim() : el.value;
        apply();
      });
    });
    document.querySelectorAll("[data-mkt-body]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-mkt-body]").forEach(function (b) { b.classList.toggle("on", b === btn); });
        state.body = btn.getAttribute("data-mkt-body");
        apply();
      });
    });
  }

  // Yorum formu: kategori → marka → model
  var form = document.getElementById("write-form");
  if (form) {
    var cat = document.getElementById("f-cat");
    var brand = document.getElementById("f-brand");
    var model = document.getElementById("f-model");
    var freeWrap = document.getElementById("f-free-wrap");
    var free = document.getElementById("f-free");
    var usageWrap = document.getElementById("f-usage-wrap");
    var usageLabel = document.getElementById("f-usage-label");
    var data = null;

    function opt(value, label) { var o = document.createElement("option"); o.value = value; o.textContent = label; return o; }
    function fillModels() {
      var list = (data && data.brands[brand.value]) || [];
      model.innerHTML = "";
      model.appendChild(opt("", brand.value ? (list.length ? "Seç" : "Modeli aşağıya yaz") : "Önce marka seç"));
      list.forEach(function (m) { model.appendChild(opt(m, m)); });
      model.appendChild(opt("__diger", "Listede yok, kendim yazacağım"));
      if (brand.value && !list.length) model.value = "__diger";
      syncFree();
    }
    function syncFree() {
      var other = model.value === "__diger";
      freeWrap.classList.toggle("is-hidden", !other);
      free.required = other;
      model.required = !other;
    }
    function load(fill) {
      fetch("/api/katalog/" + cat.value).then(function (r) { return r.json(); }).then(function (j) {
        data = j;
        usageWrap.classList.toggle("is-hidden", !j.usageLabel);
        if (j.usageLabel) usageLabel.textContent = j.usageLabel + " (" + j.usageUnit + ")";
        if (fill) {
          brand.innerHTML = "";
          brand.appendChild(opt("", "Seç"));
          Object.keys(j.brands).sort(function (a, b) { return a.localeCompare(b, "tr"); }).forEach(function (b) { brand.appendChild(opt(b, b)); });
          fillModels();
        }
      });
    }
    cat.addEventListener("change", function () { load(true); });
    brand.addEventListener("change", fillModels);
    model.addEventListener("change", syncFree);
    load(false);
    syncFree();

    var body = form.querySelector('textarea[name="metin"]');
    var counter = form.querySelector('[data-count-for="metin"]');
    function count() {
      var n = body.value.trim().length;
      counter.textContent = n < 60 ? (60 - n) + " karakter daha" : n + " karakter";
      counter.classList.toggle("ok", n >= 60);
    }
    body.addEventListener("input", count);
    count();
  }
})();
