// script.js

const palette = document.getElementById('palette');
const formatSelect = document.getElementById('formatSelect');
let lockedColors = Array(6).fill(false);
let currentColors = [];

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`.toUpperCase();
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

function generateColors() {
  palette.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    if (!lockedColors[i]) currentColors[i] = getRandomColor();
    const format = formatSelect.value;
    let displayColor = currentColors[i];

    if (format === 'rgb') displayColor = hexToRgb(currentColors[i]);
    else if (format === 'hsl') displayColor = hexToHsl(currentColors[i]);

    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = currentColors[i];

    const code = document.createElement('div');
    code.className = 'color-code';
    code.innerText = displayColor;

    const lock = document.createElement('div');
    lock.className = 'lock';
    lock.innerText = lockedColors[i] ? '🔒' : '🔓';
    lock.onclick = (e) => {
      e.stopPropagation();
      lockedColors[i] = !lockedColors[i];
      generateColors();
    };

    box.appendChild(code);
    box.appendChild(lock);

    box.addEventListener('click', () => {
      navigator.clipboard.writeText(currentColors[i]);
      showToast(`${currentColors[i]} copied!`);
    });

    palette.appendChild(box);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function downloadPalette() {
  const data = currentColors.join('\n');
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'palette.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function savePalette() {
  const saved = JSON.parse(localStorage.getItem('savedPalettes')) || [];
  saved.push([...currentColors]);
  localStorage.setItem('savedPalettes', JSON.stringify(saved));
  showToast('Palette saved!');
}

function viewSavedPalettes() {
  const saved = JSON.parse(localStorage.getItem('savedPalettes')) || [];
  if (!saved.length) return alert('No saved palettes!');
  let list = 'Saved Palettes:\n\n';
  saved.forEach((palette, i) => {
    list += `${i + 1}: ${palette.join(', ')}\n`;
  });
  alert(list);
}

// Initial load
generateColors();
