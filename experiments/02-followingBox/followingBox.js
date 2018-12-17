const mainApp = {};
window.addEventListener('load', function () {
    startApp();
}, false);

function startApp() {
    mainApp.canvas = document.getElementById('mainCanvas');
    mainApp.context = mainApp.canvas.getContext('2d');

    mainApp.deltaTime = 0;
    mainApp.lastTimestamp = 0;
    mainApp.backgroundColor = "#d1e5e1";
    mainApp.ctxWidth = mainApp.canvas.width;
    mainApp.ctxHeight = mainApp.canvas.height;

    mainApp.cursor = initCursor();
    mainApp.box = initBox();

    configureInputs(mainApp);
    window.requestAnimationFrame(gameLoop)
}

function configureInputs(app) {
    mainApp.canvas.oncontextmenu = (e) => { e.preventDefault(); }; //disable right click on canvas

    mainApp.canvas.addEventListener('mousedown', (e) => {
        mainApp.cursor.x = Math.trunc(e.layerX);
        mainApp.cursor.y = Math.trunc(e.layerY);
        mainApp.box.setDestination(mainApp.cursor.x, mainApp.cursor.y);
    }, false);
}
function gameLoop(timestamp) {
    mainApp.deltaTime = timestamp - mainApp.lastTimestamp;
    mainApp.lastTimestamp = timestamp;


    update(mainApp.deltaTime);
    render();

    window.requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    mainApp.box.update();

}

function render() {
    clearView();
    mainApp.box.render();
    mainApp.cursor.render();

}


function clearView() {
    mainApp.context.fillStyle = mainApp.backgroundColor;
    mainApp.context.fillRect(0, 0, mainApp.ctxWidth, mainApp.ctxHeight);
}
function initCursor() {

    return {
        x: 0,
        y: 0,
        render: function () {
            let ctx = mainApp.context;
            ctx.beginPath();
            ctx.fillStyle = 'lime';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.arc(mainApp.cursor.x, mainApp.cursor.y, 6, 0, (Math.PI / 180) * 360, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath()

        },
    };
}

function initBox() {
    const limits = {
        left: 0,
        top: 0,
        right: mainApp.ctxWidth,
        down: mainApp.ctxHeight,
    };

    let destination = {x:0,y:0};
    let directionVec2 = {x:0,y:0};

    const colors = ['green', 'red', 'black', 'blue', 'indigo', 'orange'];

    let boxState = 'ARRIVED';

    return {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        radius: 16,
        color: 'red',
        speed: 3,
        update: function () {
            if(boxState === 'ARRIVED') {
                return;
            }
            this.x = this.x + 1 * this.speed * directionVec2.x;
            this.y = this.y + 1 * this.speed * directionVec2.y;
           
            if(equalsVec2({x:this.x,y:this.y},destination)) {
                boxState = 'ARRIVED'
                this.x = destination.x;
                this.y = destination.y;
                this.color = 'lime';
            }

        },
        render: function () {
            let ctx = mainApp.context;
            
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x -this.width / 2, this.y -this.height / 2, this.width, this.height)


            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.arc(this.x, this.y, 6, 0, (Math.PI / 180) * 360, false);
            ctx.stroke();
            ctx.closePath()

        },
        setDestination: function (x, y) {

             destination.x = x; 
             destination.y = y;
            
             directionVec2.x = x - this.x;
             directionVec2.y = y - this.y;
             directionVec2 =normalizeVec2(directionVec2);
             boxState = 'MOVING'
             this.color = 'orange';
            }
    };
}

function normalizeVec2(vec2) {
    length = lengthVec2(vec2);
    return {x: vec2.x/length, y: vec2.y/length};
}

function lengthVec2(vec2) {
    return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)
}

function equalsVec2(vecA,vecB) {
    const THRESHOLD = 2;

    const closeX = THRESHOLD >= Math.abs(vecA.x - vecB.x)
    const closeY = THRESHOLD >= Math.abs(vecA.y - vecB.y)
    
    return closeX &&  closeY;
}