// YouTube カード: サムネをクリックしたときだけ iframe プレイヤーに差し替える(ページを軽く保つ)
document.addEventListener("click", function (ev) {
  var a = ev.target.closest(".card.yt .thumb");
  if (!a) return;
  var card = a.closest(".card.yt");
  var vid = card && card.getAttribute("data-vid");
  if (!vid) return;               // 動画IDが無ければ通常のリンク遷移
  ev.preventDefault();
  var iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube-nocookie.com/embed/" + vid + "?autoplay=1&rel=0";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.title = "YouTube player";
  a.replaceWith(iframe);
  card.classList.add("playing");
  // 他のカードで再生中のものは止める(同時再生防止)
  document.querySelectorAll(".card.yt.playing").forEach(function (c) {
    if (c !== card) {
      var f = c.querySelector("iframe");
      if (f) { f.src = f.src.replace("autoplay=1", "autoplay=0"); }
    }
  });
});
