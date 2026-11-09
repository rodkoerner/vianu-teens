/*
  Kontaktformular von HubSpot. Schnittstelle: Ein Element [data-hubspot] enthält einen Hinweis mit Knopf [data-hubspot-laden],
  eine Statuszeile [data-hubspot-status] und den Platz .hs-form-frame mit dem Attribut data-hubspot-skript (Adresse des Einbettungsskripts).
  Erst der Klick auf den Knopf lädt das Skript. Vorher geht beim Aufruf der Seite keine Anfrage an HubSpot.
  Es werden nur Skripte von js-eu1.hsforms.net geladen. Texte für "lädt" und "Fehler" stehen als data-laedt und data-fehler im Element.
  Ohne Skript zeigt das Popup den Hinweis und den Knopf, der Telefonweg bleibt erreichbar.
*/
(function () {
  var ERLAUBT = /^https:\/\/js-eu1\.hsforms\.net\/forms\/embed\/\d+\.js$/;

  function init(wurzel) {
    var knopf = wurzel.querySelector("[data-hubspot-laden]");
    var vorab = wurzel.querySelector("[data-hubspot-vorab]");
    var status = wurzel.querySelector("[data-hubspot-status]");
    var platz = wurzel.querySelector(".hs-form-frame");
    if (!knopf || !platz) return;
    var adresse = platz.getAttribute("data-hubspot-skript") || "";
    var geladen = false;

    function meldung(text) { if (status) status.textContent = text; }

    knopf.addEventListener("click", function () {
      if (geladen || !ERLAUBT.test(adresse)) return;
      geladen = true;
      knopf.disabled = true;
      meldung(wurzel.getAttribute("data-laedt") || "");
      var skript = document.createElement("script");
      skript.src = adresse;
      skript.async = true;
      skript.onload = function () {
        if (vorab) vorab.hidden = true;
        meldung("");
      };
      skript.onerror = function () {
        geladen = false;
        knopf.disabled = false;
        meldung(wurzel.getAttribute("data-fehler") || "");
      };
      document.head.appendChild(skript);
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-hubspot]"), init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
