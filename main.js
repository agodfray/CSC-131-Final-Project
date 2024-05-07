function toggleCalculator() {
    var calculatorBody = document.getElementById('calculator-body');
    if (calculatorBody.style.display === 'none') {
        calculatorBody.style.display = 'block';
    } else {
        calculatorBody.style.display = 'none';
    }
}

//calculator
const display = document.getElementById("display");

function appendToDisplay(input){
    display.value += input;
}

function clearDisplay(){
    display.value ="";
}
function calculate(){
    try{ display.value = eval(display.value);
    }
    catch(error){
        display.value = "Error";
    }
}
const draggableDiv = document.getElementById('calculator');

// Initialize the position variables

let offsetX = 0;
let offsetY = 0;
let mouseX = 0;
let mouseY = 0;
isMouseDown = false;

// Mouse down event
draggableDiv.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    offsetX = draggableDiv.offsetLeft - e.clientX;
    offsetY = draggableDiv.offsetTop - e.clientY;
});

// Mouse move event
document.addEventListener('mousemove', (e) => {
    if(!isMouseDown) return;
    e.preventDefault(); 
    mouseX = e.clientX + offsetX;
    mouseY = e.clientY + offsetY;
    draggableDiv.style.left = mouseX + 'px';
    draggableDiv.style.top = mouseY + 'px';
});

// Mouse up event
document.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});

// Checks for previously saved text notes and attaches handlers when the page loads.
function checkEdits() {
    if(localStorage.userEdits != null) {
        document.querySelector("#myNotes").innerHTML = localStorage.userEdits;
    }
    attachNoteHandlers();
}


// Creates and saves a new text note.
function newElement() {
    let inputValue = document.querySelector("#myInput").value;
    if (inputValue.trim() === '') {
        alert("Please write something!");
        return;
    }

    // Splits input to use the first line as a title.
    let lines = inputValue.split('\n');
    let titleText = lines[0];
    let contentText = lines.slice(1).join('\n');

    // Creates the note element with a close button and hidden content.
    let note = document.createElement("div");
    note.className = "note";

    let titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    

    let title = document.createElement("h2");
    title.textContent = titleText;
    
    
    let closeSpan = document.createElement("span");
    closeSpan.textContent = "\u00D7"; // Close button
    closeSpan.className = "close";
    closeSpan.onclick = function() {
        note.style.display = "none"; // Deletes note visually
        saveNotes(); // Updates localStorage
    };

    titleContainer.appendChild(title);
    titleContainer.appendChild(closeSpan);
    titleContainer.style.display = "flex";

    let content = document.createElement("p");
    content.textContent = contentText;
    content.style.display = "none"; // Hidden by default

    title.addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
    });

    note.appendChild(titleContainer);
    note.appendChild(content);

    document.querySelector("#myNotes").appendChild(note);
    document.querySelector("#myInput").value = '';

    saveNotes();
}

// Saves all notes to local storage.
function saveNotes() {
    localStorage.userEdits = document.querySelector("#myNotes").innerHTML;
}

// Clears the input field for new notes.
function clearElement() {
    document.querySelector("#myInput").value = '';
}

// Attaches handlers to each note for expand/collapse and deletion.
function attachNoteHandlers() {
    document.querySelectorAll("#myNotes .close").forEach(button => {
        button.onclick = function() {
            this.parentElement.style.display = 'none';
            saveNotes();
        };
    });

    document.querySelectorAll("#myNotes h2").forEach(title => {
        title.onclick = function() {
            let content = this.nextElementSibling;
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        };
    });
}

// Loads drawing notes when the page loads.
function loadDrawing() {
    let drawings = JSON.parse(localStorage.getItem('drawings'));
    if (drawings) {
        Object.keys(drawings).forEach(title => {
            let note = document.createElement("div");
            note.className = "note";

            let titleContainer = document.createElement("div");
            titleContainer.className = "title-container";

            let titleElement = document.createElement("h2");
            titleElement.textContent = title;
            titleElement.onclick = function() {
                localStorage.setItem('currentDrawing', drawings[title]);
                window.location.href = 'whiteboard.html'; // Opens the drawing in whiteboard
            };

            let closeSpan = document.createElement("span");
            closeSpan.textContent = "\u00D7";
            closeSpan.className = "close";
            closeSpan.onclick = function() {
                delete drawings[title];
                localStorage.setItem('drawings', JSON.stringify(drawings));
                note.style.display = "none"; // Deletes note visually
            };

            titleContainer.appendChild(titleElement);
            titleContainer.appendChild(closeSpan);
            titleContainer.style.display = "flex";

            note.appendChild(titleContainer);
            document.querySelector("#saved-notes").appendChild(note);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkEdits();
    loadDrawing();
});


