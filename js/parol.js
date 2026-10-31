/* ---------- Parol: 8-point star with tassel ---------- */
(function drawParol() {
  const cx = 60, cy = 70, outer = 56, inner = 26, points = 8;
  let pts = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    pts += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  document.getElementById("parol").innerHTML = `
    <line x1="60" y1="0" x2="60" y2="14" stroke="#e3b448" stroke-width="2"/>
    <polygon points="${pts}" fill="#e3b448" stroke="#f3d98b" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="17" fill="#f6efdc"/>
    <circle cx="${cx}" cy="${cy}" r="8" fill="#b3392f"/>
    <line class="tail" x1="50" y1="128" x2="46" y2="180"/>
    <line class="tail" x1="60" y1="128" x2="60" y2="186"/>
    <line class="tail" x1="70" y1="128" x2="74" y2="180"/>`;
})();

