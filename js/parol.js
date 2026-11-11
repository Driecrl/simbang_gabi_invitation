/* Pixel art drawn from simple grids: the parol (lantern) and the church. */
(function () {
  const COLORS = { Y: "#e3b448", L: "#f3d98b", C: "#f6efdc", R: "#c9473b", S: "#e3b448", "#": "#06130d", W: "#f3d98b" };

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
})();