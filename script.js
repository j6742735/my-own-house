document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('applyButton').addEventListener('click', applyCoordinates);
document.getElementById('processButton').addEventListener('click', processOMR);

let startX, startY, currentX, currentY;
let drawing = false;
const regions = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            displayImage(img);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function displayImage(img) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const regionsContainer = document.getElementById('regionsContainer');
    regionsContainer.style.width = `${img.width}px`;
    regionsContainer.style.height = `${img.height}px`;

    // Set up event listeners for drawing regions
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawRegion);
    canvas.addEventListener('mouseup', endDrawing);
}

function startDrawing(event) {
    startX = event.offsetX;
    startY = event.offsetY;
    drawing = true;
}

function drawRegion(event) {
    if (!drawing) return;

    currentX = event.offsetX;
    currentY = event.offsetY;

    const regionsContainer = document.getElementById('regionsContainer');
    regionsContainer.innerHTML = ''; // Clear existing regions

    const div = document.createElement('div');
    div.className = 'region';
    div.style.left = `${Math.min(startX, currentX)}px`;
    div.style.top = `${Math.min(startY, currentY)}px`;
    div.style.width = `${Math.abs(currentX - startX)}px`;
    div.style.height = `${Math.abs(currentY - startY)}px`;
    regionsContainer.appendChild(div);
}

function endDrawing() {
    if (!drawing) return;

    regions.push({
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY)
    });
    drawing = false;
}

function applyCoordinates() {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '';

    regions.forEach((region, index) => {
        resultElement.innerHTML += `Region ${index + 1}: ${JSON.stringify(region)}<br>`;
    });

    // You can now use these regions to process the OMR card.
    console.log(regions);
}

function processOMR() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const resultElement = document.getElementById('result');

    const rows = 20;  // Number of rows
    const cols = 5;   // Number of columns
    const margin = 20; // Margin around the grid
    const rowHeight = (canvas.height - margin * 2) / rows;
    const colWidth = (canvas.width - margin * 2) / cols;

    const results = [];

    regions.forEach((region, index) => {
        const x = region.x;
        const y = region.y;
        const width = region.width;
        const height = region.height;

        let selectedOption = -1; // -1 indicates no selection

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const optionRegion = {
                    x: margin + j * colWidth,
                    y: margin + i * rowHeight,
                    width: colWidth,
                    height: rowHeight
                };

                if (isOverlap(region, optionRegion)) {
                    if (isRegionMarked(optionRegion)) {
                        selectedOption = j + 1; // Option numbers are 1-based
                        break;
                    }
                }
            }
            if (selectedOption !== -1) break;
        }

        results.push({
            region: index + 1,
            selectedOption: selectedOption
        });
    });

    resultElement.innerHTML = results.map(res => 
        `Region ${res.region}: Selected Option ${res.selectedOption === -1 ? 'None' : res.selectedOption}<br>`
    ).join('');
}

function isOverlap(region1, region2) {
    return !(region2.x > region1.x + region1.width ||
             region2.x + region2.width < region1.x ||
             region2.y > region1.y + region1.height ||
             region2.y + region2.height < region1.y);
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
