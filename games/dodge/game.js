const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
const W = cv.width, H = cv.height;
let player, rocks, score, over, keys = {}, touchDir = 0, last = 0;

function reset() {
  player = { x: W / 2, y: H - 50, r: 14 };
  rocks = [];
  score = 0;
  over = false;
}

addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (over && (e.key === " " || e.key === "Enter")) reset();
});
addEventListener("keyup", (e) => (keys[e.key] = false));
cv.addEventListener("pointerdown", (e) => {
  if (over) return reset();
  const rect = cv.getBoundingClientRect();
  touchDir = e.clientX - rect.left < rect.width / 2 ? -1 : 1;
});
addEventListener("pointerup", () => (touchDir = 0));

function loop(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0);
  last = t;
  if (!over) {
    const dir = (keys.ArrowLeft ? -1 : 0) + (keys.ArrowRight ? 1 : 0) || touchDir;
    player.x = Math.max(player.r, Math.min(W - player.r, player.x + dir * 320 * dt));
    score += dt;
    if (Math.random() < dt * (1.5 + score * 0.25)) {
      rocks.push({ x: Math.random() * W, y: -20, r: 10 + Math.random() * 16, v: 150 + Math.random() * 100 + score * 8 });
    }
    for (const r of rocks) {
      r.y += r.v * dt;
      if (Math.hypot(r.x - player.x, r.y - player.y) < r.r + player.r - 3) over = true;
    }
    rocks = rocks.filter((r) => r.y < H + 40);
  }

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ff6b6b";
  for (const r of rocks) { ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = "#ffcc33";
  ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(score.toFixed(1) + " 秒", 12, 32);
  if (over) {
    ctx.textAlign = "center";
    ctx.font = "bold 40px system-ui";
    ctx.fillText("ゲームオーバー", W / 2, H / 2 - 10);
    ctx.font = "18px system-ui";
    ctx.fillText("スペース / タップでリトライ", W / 2, H / 2 + 28);
  }
  requestAnimationFrame(loop);
}

reset();
requestAnimationFrame(loop);
