/* ============================================================
   SIMULADOR RADIOLÓGICO — kV · mA · mAs
   ============================================================ */

const kvInput  = document.getElementById('kv-input');
const maInput  = document.getElementById('ma-input');
const masInput = document.getElementById('t-input');   // terceiro slider agora é mAs

const kvDisplay  = document.getElementById('kv-display');
const maDisplay  = document.getElementById('ma-display');
const masSliderDisplay = document.getElementById('t-display');   // exibe o mAs do slider
const masDisplay = document.getElementById('mas-display');       // exibe tempo derivado

const masSub = document.getElementById('mas-sub');

const canvas = document.getElementById('spectrum-canvas');
const ctx    = canvas.getContext('2d');

const REF_KV  = 80;
const REF_MAS = 20;

/* ============================================================
   UTILITÁRIOS
   ============================================================ */
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function setBar(id, pct, metaText) {
  const fill = document.getElementById('bar-' + id);
  const meta = document.getElementById('meta-' + id);
  fill.style.width = clamp(pct, 2, 100) + '%';
  if (meta) meta.textContent = metaText;
}

/* ============================================================
   LÓGICA PRINCIPAL
   ============================================================ */
function update() {
  const kv  = +kvInput.value;
  const ma  = +maInput.value;
  const mas = +masInput.value;

  // Tempo derivado
  const t = mas / ma;

  /* --- Displays --- */
  kvDisplay.textContent         = kv;
  maDisplay.textContent         = ma;
  masSliderDisplay.textContent  = mas;
  masDisplay.textContent        = t < 0.001 ? '<0.001' : t.toFixed(3);

  /* --- Nota sobre o tempo derivado --- */
  if (t < 0.005)      masSub.textContent = 'Exposição muito curta — risco de artefatos';
  else if (t < 0.05)  masSub.textContent = 'Tempo rápido — boa para reduzir borramento';
  else if (t < 0.5)   masSub.textContent = 'Faixa clínica comum';
  else if (t < 1)     masSub.textContent = 'Tempo longo — cuidado com borramento de movimento';
  else                masSub.textContent = 'Tempo muito longo — risco de borramento significativo';

  /* ---- Dose relativa (∝ kV^2.5 × mAs) ---- */
  const doseRel = ((kv / REF_KV) ** 2.5) * (mas / REF_MAS) * 100;

  /* ---- Barras de efeito ---- */
  const quantPct = clamp((mas / 200) * 100, 2, 100);
  setBar('quant', quantPct, `${mas} mAs → ${Math.round(quantPct)}% do máx.`);

  const energyPct = ((kv - 40) / 110) * 100;
  setBar('energy', energyPct, `Emáx = ${kv} keV`);

  const penetPct = energyPct;
  const penetLabel = kv < 60 ? 'Baixa penetração' : kv < 90 ? 'Penetração moderada' : 'Alta penetração';
  setBar('penet', penetPct, penetLabel);

  const contrastPct = 100 - energyPct;
  const contrastLabel = kv < 65 ? 'Contraste alto' : kv < 90 ? 'Contraste moderado' : 'Contraste baixo';
  setBar('contrast', contrastPct, contrastLabel);

  const densityRaw = ((mas / 100) * 0.65 + (kv / 150) * 0.35) * 100;
  setBar('density', clamp(densityRaw, 2, 100), `${Math.round(clamp(densityRaw, 2, 100))}% do máx.`);

  const dosePct = clamp((doseRel / 300) * 100, 2, 100);
  setBar('dose', dosePct, `~${Math.round(doseRel)}% da referência`);

  drawSpectrum(kv, mas);
}

/* ============================================================
   DESENHO DO ESPECTRO
   ============================================================ */
function drawSpectrum(kv, mas) {
  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.clientWidth;
  const H   = canvas.clientHeight;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const GRID_COLOR  = 'rgba(255,255,255,0.06)';
  const AXIS_COLOR  = 'rgba(255,255,255,0.2)';
  const LABEL_COLOR = 'rgba(155,163,184,0.9)';

  const PAD = { top: 18, right: 20, bottom: 46, left: 52 };
  const gW  = W - PAD.left - PAD.right;
  const gH  = H - PAD.top  - PAD.bottom;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#07090f';
  ctx.fillRect(0, 0, W, H);

  /* Grade */
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth   = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (gH / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + gW, y); ctx.stroke();
  }
  for (let i = 0; i <= 5; i++) {
    const x = PAD.left + (gW / 5) * i;
    ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + gH); ctx.stroke();
  }

  /* Eixos */
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top);
  ctx.lineTo(PAD.left, PAD.top + gH);
  ctx.lineTo(PAD.left + gW, PAD.top + gH);
  ctx.stroke();

  /* Labels */
  ctx.fillStyle = LABEL_COLOR;
  ctx.font = `11px 'IBM Plex Mono', monospace`;
  ctx.textAlign = 'right';
  ctx.fillText('Int.', PAD.left - 6, PAD.top + 8);
  ctx.textAlign = 'center';
  ctx.fillText('Energia (keV)', PAD.left + gW / 2, H - 6);

  const ticks = [0, 20, 40, 60, 80, 100].map(pct => Math.round(kv * pct / 100));
  ticks.forEach((val, i) => {
    const x = PAD.left + (gW / 5) * i;
    ctx.textAlign = 'center';
    ctx.fillText(val, x, PAD.top + gH + 16);
  });

  const scaleY = Math.min(1, mas / 100);
  const toX = (e)    => PAD.left + (e / kv) * gW;
  const toY = (norm) => PAD.top  + gH - norm * gH * 0.92 * scaleY;

  /* Bremsstrahlung */
  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const e    = (i / 300) * kv;
    const norm = Math.max(0, (1 - e / kv) * Math.sqrt(e / kv + 0.01));
    pts.push({ x: toX(e), y: toY(norm) });
  }

  ctx.beginPath();
  ctx.moveTo(PAD.left, PAD.top + gH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(toX(kv), PAD.top + gH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(PAD.left, 0, PAD.left + gW, 0);
  grad.addColorStop(0,   'rgba(56,189,248,0.08)');
  grad.addColorStop(0.6, 'rgba(56,189,248,0.18)');
  grad.addColorStop(1,   'rgba(56,189,248,0.04)');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth   = 1.5;
  ctx.lineJoin    = 'round';
  ctx.stroke();

  /* Radiação característica W */
  [{ e: 59, label: 'Kα', height: 0.62 }, { e: 67, label: 'Kβ', height: 0.42 }].forEach(({ e, label, height }) => {
    if (e >= kv) return;
    const x  = toX(e);
    const y0 = PAD.top + gH;
    const y1 = PAD.top + gH - height * gH * 0.85 * scaleY;

    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1);
    ctx.strokeStyle = 'rgba(167,139,250,0.2)'; ctx.lineWidth = 8; ctx.stroke();

    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1);
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.fillStyle = '#a78bfa';
    ctx.font = `500 11px 'IBM Plex Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y1 - 5);
    ctx.fillStyle = 'rgba(167,139,250,0.65)';
    ctx.font = `10px 'IBM Plex Mono', monospace`;
    ctx.fillText(`${e} keV`, x, y1 - 17);
  });

  /* Emáx */
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.moveTo(PAD.left + gW, PAD.top);
  ctx.lineTo(PAD.left + gW, PAD.top + gH);
  ctx.strokeStyle = 'rgba(248,113,113,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(248,113,113,0.8)';
  ctx.font = `10px 'IBM Plex Mono', monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(`Emáx = ${kv} keV`, PAD.left + gW - 4, PAD.top + 14);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
[kvInput, maInput, masInput].forEach(el => el.addEventListener('input', update));

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => drawSpectrum(+kvInput.value, +masInput.value), 100);
});

update();
