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

    // Define the grid for the OMR card
    const rows = 20;  // Number of rows
    const cols = 5;   // Number of columns
    const margin = 20; // Margin around the grid
    const rowHeight = (img.height - margin * 2) / rows;
    const colWidth = (img.width - margin * 2) / cols;

    const result = [];

    for (let i = 0; i < rows; i++) {
        let selectedOption = -1; // -1 indicates no selection
        for (let j = 0; j < cols; j++) {
            const region = {
                x: margin + j * colWidth,
                y: margin + i * rowHeight,
                width: colWidth,
                height: rowHeight
            };

            if (isRegionMarked(region)) {
                selectedOption = j + 1; // Option numbers are 1-based
                break; // Stop checking after finding the first marked option
            }
        }
        result.push({
            row: i + 1,
            selectedOption: selectedOption
        });
    }

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = result.map(res => 
        `Row ${res.row}: Selected Option ${res.selectedOption === -1 ? 'None' : res.selectedOption}<br>`
    ).join('');
}

function isRegionMarked(region) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(region.x, region.y, region.width, region.height);
    const data = imageData.data;

    let blackPixelCount = 0;
    let totalPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r < 50 && g < 50 && b < 50) {
            blackPixelCount++;
        }
        totalPixels++;
    }

    // Determine if the region is marked based on pixel count
    return blackPixelCount > (totalPixels * 0.1); // Adjust threshold as needed
}
