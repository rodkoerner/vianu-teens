/*
  Fußspuren unter dem Kopf der B2C-Seite reagieren auf die Maus. Schnittstelle: Der Bereich [data-spuren-bereich] (der Kopf)
  hört auf die Zeigerbewegung, die Spuren sind die Elemente .spur in .hero__spuren. Jede Spur, deren Mitte näher als NAEHE Pixel
  am Zeiger liegt, bekommt data-nah (Darstellung per CSS: dicker dunkler Rand). Nur Maus und Stift beim Bewegen, bei Touch
  per Fingertipp. Keine Scroll- und Resize-Behandlung, die Positionen werden bei jedem Ereignis frisch gemessen.
*/
(function () {
  var NAEHE = 110;

  function init(bereich) {
    var spuren = Array.prototype.slice.call(bereich.querySelectorAll(".hero__spuren .spur"));
    if (!spuren.length) return;

    function pruefe(e) {
      spuren.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var dx = r.left + r.width / 2 - e.clientX;
        var dy = r.top + r.height / 2 - e.clientY;
        if (Math.sqrt(dx * dx + dy * dy) < NAEHE) s.setAttribute("data-nah", "");
        else s.removeAttribute("data-nah");
      });
    }
    function raeume() {
      spuren.forEach(function (s) { s.removeAttribute("data-nah"); });
    }

    bereich.addEventListener("pointermove", pruefe);
    bereich.addEventListener("pointerdown", pruefe);
    bereich.addEventListener("pointerleave", raeume);
    bereich.addEventListener("pointercancel", raeume);
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-spuren-bereich]"), function (b) {
      try { init(b); } catch (e) { /* die Spuren sind Zierde, ein Fehler darf nichts anderes stören */ }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
