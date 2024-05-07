// Set up the canvas and context for drawing.
let canvas = document.getElementById('whiteboard');
let ctx = canvas.getContext('2d');
let painting = false; // Track if the paint operation is active.

// Start painting when the mouse is pressed down.
function startPosition(e) {
    painting = true;
    draw(e);
}

// Stop painting when the mouse button is released.
function finishedPosition() {
    painting = false;
    ctx.beginPath(); // Reset the current path.
}

// Get the position of the mouse relative to the canvas.
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Draw on the canvas based on mouse position.
function draw(e) {
    if (!painting) return;
    const pos = getMousePos(canvas, e);
    ctx.lineWidth = 5; // Set the width of the stroke.
    ctx.lineCap = 'round'; // Set the style of the stroke endings.
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke(); // Perform the drawing.
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = document.getElementById('colorPicker').value;
}

// Event listeners for mouse interactions on the canvas.
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

// Clear the entire canvas.
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Adjust the canvas size to fit the window.
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas); // Adjust canvas size when window is resized.
resizeCanvas();

// Save the current canvas drawing with a title.
function saveDrawing() {
    let dataURL = canvas.toDataURL('image/png'); // Convert canvas to data URL.
    let title = prompt("Enter a title for your drawing:");
    if (title) {
        let drawings = JSON.parse(localStorage.getItem('drawings')) || {};
        drawings[title] = dataURL;
        localStorage.setItem('drawings', JSON.stringify(drawings));
        window.location.href = 'index.html'; // Redirect back to notes page.
    } else {
        alert("You must enter a title to save your drawing.");
    }
}

// Load an existing drawing into the canvas.
function loadExistingDrawing() {
    let existingDrawing = localStorage.getItem('currentDrawing');
    if (existingDrawing) {
        let img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0); // Draw the image onto the canvas.
        };
        img.src = existingDrawing;
    }
}

// Initialize canvas on page load based on existing drawing.
window.onload = function() {
    if (localStorage.getItem('currentDrawing')) {
        loadExistingDrawing();
    } else {
        clearCanvas();
    }
};
