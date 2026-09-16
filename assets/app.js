// YouTube カード: サムネをクリックしたときだけ iframe プレイヤーに差し替える(ページを軽く保つ)
document.addEventListener("click", function (ev) {
  var a = ev.target.closest(".card.yt .thumb");
  if (!a) return;
  var card = a.closest(".card.yt");
  var vid = card && card.getAttribute("data-vid");
  if (!vid) return;               // 動画IDが無ければ通常のリンク遷移
  ev.preventDefault();
  // 先に再生中のものを止める(同時再生防止)
  document.querySelectorAll(".card.yt.playing iframe").forEach(function (f) { f.remove(); });
  document.querySelectorAll(".card.yt.playing").forEach(function (c) { c.classList.remove("playing"); });
  var iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1&rel=0";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.title = "YouTube player";
  a.replaceWith(iframe);
  card.classList.add("playing");
});

// 追従バー: 今いるセクションを表示し、該当チップを強調する
(function () {
  var bar = document.getElementById("toc");
  var now = document.getElementById("now");
  var totop = document.getElementById("totop");
  if (!bar || !now) return;
  var secs = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var links = {};
  Array.prototype.forEach.call(bar.querySelectorAll("a[href^='#']"), function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var current = null;

  function update() {
    var y = window.pageYOffset + bar.offsetHeight + 24;
    var cur = secs[0];
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top + window.pageYOffset <= y) cur = secs[i];
    }
    if (totop) totop.classList.toggle("show", window.pageYOffset > 600);
    if (!cur || cur === current) return;
    current = cur;
    var link = links[cur.id];
    var heading = cur.querySelector(".sechead .t");
    now.textContent = heading ? heading.textContent : cur.id;
    now.setAttribute("data-accent", cur.getAttribute("data-accent") || "");
    for (var id in links) links[id].classList.toggle("active", id === cur.id);
    if (link && link.scrollIntoView) {
      link.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
  if (totop) {
    totop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
