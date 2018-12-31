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
        this.inputController = {
            'left': 0,
            'right': 0,
        };
        this.inputMapper = {
            'LEFT': 'left',
            'RIGHT': 'right',
            'A': 'left',
            'D': 'right'
        };
        this.inputKey = {
            '37': 'LEFT',
            '39': 'RIGHT',
            '65': 'A',
            '68': 'D',
        }
    }
    start() {
        this.bindInputs();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    gameLoop(timestamp) {
        let deltaTime = Math.min(1, (timestamp - this.lastTimestamp) / 1000);
        this.lastTimestamp = timestamp;
        this.handleInput();
        while (deltaTime > this.frameStep) {
            deltaTime -= this.frameStep;
            this.update(this.frameStep);
        }
        this.update(deltaTime);
        this.render();
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }
    handleInput() {
        this.gameWorld.player.dx = this.inputController.right - this.inputController.left;
    }
    update(dt) {
        this.gameWorld.update(dt);
    }
    render() {
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.width, this.height);
        this.gameWorld.render(this.context);
    }
    bindInputs() {
        document.addEventListener('keydown', (e) => { return this.onkey(e, e.keyCode, 1); }, false);
        document.addEventListener('keyup', (e) => { return this.onkey(e, e.keyCode, 0); }, false);
    }
    onkey(event, keyCode, pressed) {
        //event.preventDefault();
        if (!this.inputKey.hasOwnProperty(keyCode)) //only listen to mapped keys ingore everything else
            return;
        this.inputController[this.inputMapper[this.inputKey[keyCode]]] = pressed;
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
        this.player = new Player(450, this.playerLine, 50, 50, this);
    }
    update(dt) {
        this.player.update(dt);
    }
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.moveTo(this.bounds.x, this.playerLine);
        ctx.lineTo(this.bounds.x + this.bounds.w, this.playerLine);
        ctx.stroke();
        ctx.closePath();

        this.player.render(ctx);
    }
    getLimits() {
        return { 'left': this.bounds.x, 'right': this.bounds.x + this.bounds.w };
    }
}

class Entity {
    constructor(x, y, width, height, gameWorld) {
        this.gameWorld = gameWorld;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'black';
        this.dx = 0;
        this.dy = 0;
        this.speed = 1000;
    }
    update(dt) {

    }
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    }
}

class Player extends Entity {
    constructor(x, y, w, h, gameWorld) {
        super(x, y, w, h, gameWorld);
        this.color = 'blue';
    }
    update(dt) {
        this.x += this.dx * dt * this.speed;
        const limits = this.gameWorld.getLimits();
        if (this.x - this.width / 2 < limits.left) {
            this.x = limits.left + this.width / 2;
        }
        if (this.x + this.width / 2 > limits.right) {
            this.x = limits.right - this.width / 2;
        }
    }
}