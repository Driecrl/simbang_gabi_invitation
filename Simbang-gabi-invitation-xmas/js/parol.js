/* Pixel art drawn from simple grids: the parol (lantern) and the church. */
(function () {
  const COLORS = { G: "#1f7a43", H: "#2f9d57", T: "#6b4423", D: "#c9473b", E: "#2f8f55", Y: "#e3b448", L: "#f3d98b", C: "#f6efdc", R: "#c9473b", S: "#e3b448", "#": "#06130d", W: "#f3d98b" };

  // Draw rows of characters as 1x1 squares, each row centered in `width`
  function draw(id, rows, width) {
    let out = "";
    rows.forEach((row, y) => {
      const pad = Math.floor((width - row.length) / 2);
      for (let x = 0; x < row.length; x++) {
        const fill = COLORS[row[x]];
        if (fill) out += `<rect x="${pad + x}" y="${y}" width="1" height="1" fill="${fill}"/>`;
      }
    });
    const svg = document.getElementById(id);
    svg.setAttribute("viewBox", `0 0 ${width} ${rows.length}`);
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.innerHTML = out;
  }
  // "####W" becomes "####W####" (last character is the middle)
  const mirror = (half) => {
    const left = half.slice(0, -1);
    return left + half.slice(-1) + left.split("").reverse().join("");
  };

  /* ----- Parol: 8-point star, red tassels ----- */
  function starChar(x, y) {
    const dx = Math.abs(x - 8), dy = Math.abs(y - 8);
    const mn = Math.min(dx, dy), mx = Math.max(dx, dy), r2 = dx * dx + dy * dy;
    if (r2 <= 1) return "R";
    if (r2 <= 5) return "C";
    if (mn <= 1 && mx <= 8 - 3 * mn) return mx >= 7 ? "L" : "Y";
    if (Math.abs(dx - dy) <= 1 && mx <= 5) return "Y";
    if (r2 <= 18) return "Y";
    return ".";
  }
  const tassel = (cols) => Array.from({ length: 17 }, (_, x) => (cols.includes(x) ? "R" : ".")).join("");
  const parol = [".".repeat(8) + "S" + ".".repeat(8), ".".repeat(8) + "S" + ".".repeat(8)];
  for (let y = 0; y < 17; y++) parol.push(Array.from({ length: 17 }, (_, x) => starChar(x, y)).join(""));
  parol.push(tassel([6, 8, 10]), tassel([6, 8, 10]), tassel([6, 8, 10]), tassel([6, 10]), tassel([8]), tassel([8]));
  draw("parol", parol, 17);

  /* ----- Church: each string is the left half, last character = middle ----- */
  const church = [
    "#", "###", "#", "#", "##", "##", "###", "###", "####", "####",
    "#####", "####W", "####W", "#####",
    "##############", "##W##W##W#####", "##W##W##W#####", "##############",
    "##W##W##W#WWWW", "##W##W##W#WWWW", "##############"
  ].map(mirror);
  draw("church", church, 27);

  /* ----- Christmas tree with star and gifts (31 x 26 grid) ----- */
  (function () {
    const W = 31, H = 26;
    const g = Array.from({ length: H }, () => Array(W).fill("."));
    const put = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c; };
    const cx = 9;
    [1, 3, 5, 3, 1].forEach((w, r) => { for (let i = 0; i < w; i++) put(cx - (w >> 1) + i, r, "S"); });
    const widths = [3, 5, 7, 5, 7, 9, 11, 7, 9, 11, 13, 15, 9, 11, 13, 15, 17, 19];
    widths.forEach((w, r) => {
      for (let i = 0; i < w; i++) {
        const dx = i - (w >> 1);
        let c = i < 2 ? "H" : "G";
        if (r > 0 && Math.abs(dx) < (w >> 1)) {
          if ((r * 7 + dx * 3) % 11 === 0) c = "Y";
          else if ((r * 5 + dx * 2) % 13 === 0) c = "R";
          else if ((r * 3 + dx) % 9 === 1) c = "L";
        }
        put(cx - (w >> 1) + i, 5 + r, c);
      }
    });
    for (let r = 23; r < 26; r++) for (let x = cx - 1; x <= cx + 1; x++) put(x, r, "T");
    const stamp = (rows, x0, y0) => rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== ".") put(x0 + x, y0 + y, c); }));
    stamp([".Y..Y.", "..YY..", "DDYYDD", "YYYYYY", "DDYYDD", "DDYYDD"], 21, 20);
    stamp(["EECEE", "CCCCC", "EECEE", "EECEE"], 26, 22);
    draw("tree", g.map((r) => r.join("")), W);
  })();

  /* ----- Christmas lights: a string across the top, bulbs blink in turns ----- */
  (function () {
    const SZ = 4;
    const sag = [0,0,1,1,1,2,2,2,2,2,2,3,3,2,2,2,2,2,2,1,1,1,0,0];
    const bulbX = [3, 11, 19];
    const BRIGHT = ["#ff5a4a", "#ffd45a", "#6fe08a"], DIM = ["#7a2a24", "#7a6325", "#2f6b40"];
    const rect = (x, y, w, h, c) => `<rect x="${x * SZ}" y="${y * SZ}" width="${w * SZ}" height="${h * SZ}" fill="${c}"/>`;
    function tile(id, lit) {
      let r = "";
      sag.forEach((y, x) => { r += rect(x, y, 1, 1, "#2f6b4a"); });
      bulbX.forEach((x, i) => {
        const y = sag[x];
        r += rect(x, y + 1, 1, 1, "#8a6d2a") + rect(x, y + 2, 2, 2, lit.includes(i) ? BRIGHT[i] : DIM[i]);
      });
      return `<pattern id="${id}" width="${24 * SZ}" height="${9 * SZ}" patternUnits="userSpaceOnUse">${r}</pattern>`;
    }
    const svg = document.getElementById("lights");
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.innerHTML = `<defs>${tile("la", [0, 2])}${tile("lb", [1])}</defs>` +
      `<rect width="100%" height="100%" fill="url(#la)"/>` +
      `<rect class="blink" width="100%" height="100%" fill="url(#lb)"/>`;
  })();
})();
