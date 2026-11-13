/* Floating "Bibingka" player. The official upload loads only when someone taps the button,
   so nothing from YouTube is requested until they want the music. */
(function () {
  const VIDEO_ID = "AIRCTJREWKM"; // Ben&Ben - Bibingka (official, YouTube)
  const toggle = document.getElementById("music-toggle");
  const panel = document.getElementById("music-panel");
  const box = document.getElementById("music-frame");
  let loaded = false;

  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    // Closing only moves the panel off screen, so the song keeps playing
    if (open && !loaded) {
      loaded = true;
      const frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + VIDEO_ID + "?autoplay=1&playsinline=1&rel=0";
      frame.title = "Bibingka by Ben&Ben (official upload on YouTube)";
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
    }
  });
})();
