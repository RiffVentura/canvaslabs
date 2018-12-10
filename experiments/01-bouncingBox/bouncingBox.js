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

    const colors = ['green','red','black','blue','indigo','orange'];
    let colorIdx = -1;

    return {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
        radius: 16,
        color: 'red',
        speed: 2,
        update: function () {
            let bounce = false;

            this.x = this.x + 1 * this.speed * directionX;
            if ( this.centerX() + this.radius > limits.right) {
                directionX = -1;
                bounce = true;
            }
            if (this.centerX() - this.radius < limits.left) {
                directionX = 1;
                bounce = true;
            }
            this.y = this.y + 1 * this.speed * directionY;
            if (this.centerY() + this.radius > limits.down) {
                directionY = -1;
                bounce = true;
            }
            if (this.centerY() - this.radius < limits.top) {
                directionY = 1;
                bounce = true;
            }

            if(bounce){
                this.color = colors[++colorIdx % colors.length];
            }
        },
        render: function () {
            let ctx = mainApp.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height)
            
            
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.arc(this.centerX(), this.centerY(), 6, 0, (Math.PI / 180) * 360, false);
            ctx.stroke();
            ctx.closePath()

        },
        centerX: function() { return this.x + this.width/2 },
        centerY: function() { return this.y + this.height/2 },
    };
}