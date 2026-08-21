const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const scale = 30; // גודל התאים בלוח
const rows = canvas.height / scale; // מספר השורות
const columns = canvas.width / scale; // מספר העמודות

//// לוח המשחק
let board = Array.from({ length: rows }, () => Array(columns).fill(0));

//// צורות טטריס
const pieces = [
    // T
    [[1, 1, 1], [0, 1, 0]],
    // I
    [[1, 1, 1, 1]],
    // O
    [[1, 1], [1, 1]],
    // L
    [[1, 0, 0], [1, 1, 1]],
    // Z
    [[1, 1, 0], [0, 1, 1]]


let currentPiece;
let currentPosition = { x: 0, y: 0 };

//// פונקציה ליצירת צורה חדשה
function newPiece() {
    currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPosition = { x: Math.floor(columns / 2) - Math.floor(currentPiece[0].length / 2), y: 0 };
}

//// פונקציה לציור הלוח
function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] > 0) {
                context.fillStyle = 'blue';
                context.fillRect(c * scale, r * scale, scale, scale);
            }
        }
    }
}

//// פונקציה לציור הצורה הנוכחית
function drawPiece() {
    currentPiece.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) {
                context.fillStyle = 'red';
                context.fillRect((currentPosition.x + c) * scale, (currentPosition.y + r) * scale, scale, scale);
            }
        });
    });
}

//// פונקציה לעדכון המשחק
function update() {
    currentPosition.y++;
    if (collision()) {
        currentPosition.y--;
        merge();
        clearRows();
        newPiece();
    }
    draw();
}

//// פונקציה לבדוק אם יש התנגשות
function collision() {
    return currentPiece.some((row, r) => {
        return row.some((value, c) => {
            if (value) {
                const newX = currentPosition.x + c;
                const newY = currentPosition.y + r;
                return newX < 0 || newX >= columns || newY >= rows || board[newY][newX] > 0;
            }
            return false;
        });
    });
}

//// פונקציה למזג את הצורה הנוכחית ללוח
function merge() {
    currentPiece.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) {
                board[currentPosition.y + r][currentPosition.x + c] = 1;
            }
        });
    });
}

//// פונקציה לנקות שורות מלאות
function clearRows() {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r].every(value => value > 0)) {
            board.splice(r, 1);
            board.unshift(Array(columns).fill(0));
        }
    }
}

//// פונקציה לציור הכל
function draw() {
    drawBoard();
    drawPiece();
}

// אתחול המשחק
newPiece();
setInterval(update, 1000 / 2); // עדכון כל חצי שנייה
