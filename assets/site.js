// Shared theme toggle for q78717.github.io. Load in <head> (not deferred) so the
// saved theme applies before first paint; the button is wired on DOMContentLoaded.
(function () {
  var root = document.documentElement;
  var SPECIMEN_ORIGIN = "https://q78717.github.io";

  function saved() {
    try { var t = localStorage.getItem("theme"); return t === "light" || t === "dark" ? t : null; } catch (e) { return null; }
  }
  function effective() {
    return root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  // Tell an embedded specimen which theme to show (null = follow the OS).
  function syncFrame(frame) {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: "rv-theme", theme: root.getAttribute("data-theme") }, SPECIMEN_ORIGIN);
  }

  var t = saved();
  if (t) root.setAttribute("data-theme", t);

  document.addEventListener("DOMContentLoaded", function () {
    var frame = document.querySelector(".specimen-frame");
    if (frame) {
      frame.addEventListener("load", function () { syncFrame(frame); });
      window.addEventListener("message", function (e) {
        if (e.origin === SPECIMEN_ORIGIN && e.data && e.data.type === "rv-theme-ready") syncFrame(frame);
      });
    }

    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncFrame(frame);
    });
  });
})();
