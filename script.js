document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const uploadSection = document.getElementById("uploadSection");
  const upload = document.getElementById("upload");
  const canvas = document.getElementById("pookalam");
  const ctx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("downloadBtn");

  startBtn.addEventListener("click", () => {
    document.querySelector(".hero").style.display = "none";
    uploadSection.classList.add("active");
  });

  function drawPetal(x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, size / 2, size / 3, size, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  function animateCircularPookalam(img) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = canvas.width / 2 - 10;
    const rings = 60;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0, img.width, img.height);
    const data = tempCtx.getImageData(0, 0, img.width, img.height).data;

    let ring = 0, petalIndex = 0, petalsInRing = 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.clip();

    function placePetal() {
      if (ring >= rings) {
        ctx.restore();
        downloadBtn.style.display = "inline-block";
        return;
      }

      const radius = (ring / rings) * maxRadius;
      const petalSize = 4 + (ring / rings) * 8;

      if (petalIndex === 0) {
        petalsInRing = Math.floor((2 * Math.PI * radius) / (petalSize * 0.6)) + 8;
      }

      const angle = (petalIndex / petalsInRing) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const imgX = Math.floor(x - centerX + img.width / 2);
      const imgY = Math.floor(y - centerY + img.height / 2);

      if (imgX >= 0 && imgX < img.width && imgY >= 0 && imgY < img.height) {
        const idx = (imgY * img.width + imgX) * 4;
        const color = `rgb(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]})`;
        drawPetal(x, y, petalSize, color, Math.random() * Math.PI * 2);
      }

      petalIndex++;
      if (petalIndex >= petalsInRing) { petalIndex = 0; ring++; }

      setTimeout(placePetal, 1);
    }
    placePetal();
  }

  upload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    upload.style.display = "none";
    canvas.style.display = "block";
    canvas.width = 700;
    canvas.height = 700;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animateCircularPookalam(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "my-pookalam.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});



















