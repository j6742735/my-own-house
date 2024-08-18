document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            processImage(img);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function processImage(img) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let blackPixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        // RGBA values
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Simple check for black pixels
        if (r < 50 && g < 50 && b < 50) {
            blackPixelCount++;
        }
    }
    
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Black pixels count: ${blackPixelCount}`;
}
