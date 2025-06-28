function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateColors() {
  const palette = document.getElementById('palette');
  palette.innerHTML = ''; // Clear old colors

  for (let i = 0; i < 6; i++) {
    const color = getRandomColor();
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;

    const code = document.createElement('div');
    code.className = 'color-code';
    code.innerText = color;

    colorBox.appendChild(code);

    // Copy to clipboard on click
    colorBox.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      code.innerText = "Copied!";
      setTimeout(() => {
        code.innerText = color;
      }, 1000);
    });

    palette.appendChild(colorBox);
  }
}

// Generate on load
generateColors();
