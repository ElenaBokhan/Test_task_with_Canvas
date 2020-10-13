let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let box = [];
let boxWithCircles = [];
let widthBox = 100;
let rad = 15;
let flag = false;
let flagMove = true;
let bonds = [];
let orderClick = 1;
let startX, startY;
let numBlock = 1;
let numCircles = 1;

canvas.onmousedown = onDown;
canvas.onmouseup = onUp;
canvas.onmousemove = onMove;

render();

function render() {
    ctx.clearRect(0, 0, 750, 800);
    ctx.beginPath();
    for (let i = 0; i < box.length; i++) {
        ctx.fillStyle = "#0a99ff";
        ctx.rect(box[i].x, box[i].y, widthBox, widthBox);
        ctx.fill();
        renderArc(box[i].x, box[i].y, box[i].num);
    }
    renderBond();
};
function renderArc(x, y, num) {
    let arrX = [x + 50, x + 50, x, x + 100];
    let arrY = [y, y + 100, y + 50, y + 50];


    for (let i = 0; i < boxWithCircles.length; i++) {
        for (let j = 0; j < arrX.length; j++) {
            if (boxWithCircles[i].num == num * 4 - j) {
                boxWithCircles[i].x = arrX[arrX.length - 1 - j];
                boxWithCircles[i].y = arrY[arrY.length - 1 - j];
            }
        }
    }

    ctx.fillStyle = "#ffe216";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    for (let i = 0; i < arrX.length; i++) {
        ctx.beginPath();
        ctx.arc(arrX[i], arrY[i], rad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
    }
}
function renderBond() {
    let bonds = boxWithCircles.filter(item => item.isClicked == true);
    bonds.sort(function (a, b) { return a.orderClick - b.orderClick });
    for (let i = 0; i < bonds.length; i++) {
        if (i == 0 || i % 2 == 0) {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(bonds[i].x, bonds[i].y);            
        } else {           
            ctx.lineTo(bonds[i].x, bonds[i].y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}
canvas.onmousedown = onDown;
canvas.onmouseup = onUp;
canvas.onmousemove = onMove;

function onDown(event) {

    let x = event.offsetX;
    let y = event.offsetY;
    flagMove = true;

    for (let i = 0; i < boxWithCircles.length; i++) {
        if (Math.abs(x - boxWithCircles[i].x) <= rad && Math.abs(y - boxWithCircles[i].y) <= rad) {
            if (boxWithCircles[i].isClicked == false) {
                boxWithCircles[i].isClicked = true;
                boxWithCircles[i].orderClick = orderClick;
                orderClick++;
            } else {
                boxWithCircles[i].isClicked = false;
                if (boxWithCircles[i].orderClick % 2 == 0) {
                    let order = boxWithCircles[i].orderClick;
                    boxWithCircles.forEach(item => {
                        if (item.orderClick == order - 1) {
                            item.isClicked = false
                        }
                    })
                }
                else {
                    let order = boxWithCircles[i].orderClick;
                    boxWithCircles.forEach(item => {
                        if (item.orderClick == order + 1) {
                            item.isClicked = false;
                        }
                    })
                }
            }
            render();
            flagMove = false;
        }
    }
    for (let i = 0; i < box.length; i++) {
        if (x > box[i].x && x < box[i].x + widthBox && y > box[i].y && y < box[i].y + widthBox) {
            box[i].isDraggble = true;
            flagMove = false;
        }
    }
    if (flagMove) {
        box.push({ x: x, y: y, num: numBlock, isDraggble: false });
        boxWithCircles.push({ x: x + 50, y: y, num: numCircles++, isClicked: false, parent: numBlock });
        boxWithCircles.push({ x: x + 50, y: y + 100, num: numCircles++, isClicked: false, parent: numBlock });
        boxWithCircles.push({ x: x, y: y + 50, num: numCircles++, isClicked: false, parent: numBlock });
        boxWithCircles.push({ x: x + 100, y: y + 50, num: numCircles++, isClicked: false, parent: numBlock });
        numBlock++;
        render();
    }

    startX = x;
    startY = y;
    flag = true;
}

function onMove(event) {
    if (flag) {
        let newX = event.offsetX;
        let newY = event.offsetY;

        let dx = newX - startX;
        let dy = newY - startY;

        for (let i = 0; i < box.length; i++) {
            if (box[i].isDraggble == true) {
                box[i].x += dx;
                box[i].y += dy;
            }
        }
        render();
        startX = newX;
        startY = newY;
        flagMove = true;
    }
}

function onUp() {
    flag = false;
    for (let i = 0; i < box.length; i++) {
        box[i].isDraggble = false;
    }
    flagMove = true;
}
