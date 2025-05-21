// helpers/seatGenerator.js
function generateSeatMap(rows, columns) {
    const A = 'A'.charCodeAt(0);
    const seatMap = [];

    const midLeft = Math.floor(columns / 2) - 1;
    const midRight = midLeft + 1;

    for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < columns; col++) {
            const letter = String.fromCharCode(A + col);
            let type;
            if (col === 0 || col === columns - 1) {
                type = "window";
            } else if (col === midLeft || col === midRight) {
                type = "aisle";
            } else {
                type = "middle";
            }
            const zone = row === 1 ? 'accessible' : (row === rows ? 'VIP' : 'standard');

            seatMap.push({
                row,
                column: letter,
                type,
                zone,
                status: "available",
                assignedTo: null
            });
        }
    }

    return seatMap;
}

module.exports = { generateSeatMap };
