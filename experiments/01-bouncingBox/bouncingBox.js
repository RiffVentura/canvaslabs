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

    mainApp.box = initBox();

    console.log(mainApp);

    window.requestAnimationFrame(gameLoop)
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
    mainApp.box.render()
}


function clearView() {
    mainApp.context.fillStyle = mainApp.backgroundColor;
    mainApp.context.fillRect(0, 0, mainApp.ctxWidth, mainApp.ctxHeight);
}

function initBox() {
    const limits = {
        left: 0,
        top: 0,
        right: mainApp.ctxWidth,
        down: mainApp.ctxHeight,
    };

    let directionX = 1;
    let directionY = 1;

    return {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        color: 'red',
        speed: 2,
        update: function () {
            this.x = this.x + 1 * this.speed * directionX;
            if (this.x > limits.right) {
                directionX = -1;
            }
            if (this.x < limits.left) {
                directionX = 1;
            }
            this.y = this.y + 1 * this.speed * directionY;
            if (this.y > limits.down) {
                directionY = -1;
            }
            if (this.y < limits.top) {
                directionY = 1;
            }
        },
        render: function () {
            let ctx = mainApp.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
        //TODO getCenter
        //TODO randomColors onBounce
    }
}