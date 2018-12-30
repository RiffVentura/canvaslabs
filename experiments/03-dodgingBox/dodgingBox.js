window.addEventListener('load', function () {
    const game = new Game(document.getElementById('mainCanvas'));
    game.start();
}, false);


class Game {
    constructor(canvasNode) {
        this.canvas = canvasNode;
        this.context = canvasNode.getContext('2d');
        this.height = canvasNode.height;
        this.width = canvasNode.width;
        this.lastTimestamp = performance.now();
        this.frameStep = 1 / 60;
        this.gameWorld = new GameWorld(this);
    }
    start() {
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    gameLoop(timestamp) {
        let deltaTime = Math.min(1, (timestamp - this.lastTimestamp) / 1000);
        this.lastTimestamp = timestamp;
        while (deltaTime > this.frameStep) {
            deltaTime -= this.frameStep;
            this.update(this.frameStep);
        }
        this.update(deltaTime);
        this.render();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(dt) {
        // console.log(dt);
        this.gameWorld.update(dt);
    }
    render() {
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.width, this.height);
        this.gameWorld.render(this.context);
    }
}

class GameWorld {
    constructor(game) {
        this.game = game;
        this.bounds = {
            x: 300,
            y: 0,
            w: 300,
            h: 600
        };

        this.playerLine = 450;
        this.player = new Player(450,this.playerLine,50,50);
    }
    update(dt) {


    }
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.moveTo(this.bounds.x,this.playerLine);
        ctx.lineTo(this.bounds.x+this.bounds.w,this.playerLine);
        ctx.stroke();
        ctx.closePath();

        this.player.render(ctx);
    }
}

class Entity {
    constructor(x, y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'black';
    }
    update(dt) {

    }
    render(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x -this.width / 2, this.y -this.height / 2, this.width, this.height);

    }
}

class Player extends Entity {
    constructor(x,y,w,h) {
        super(x,y,w,h);
        this.color =  'blue';
    }
}