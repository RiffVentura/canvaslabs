function drawScreen(context) {
    //draws rectangles
    context.fillStyle = '#000000';
    context.strokeStyle = '#ff00ff';
    context.lineWidth = 2;
    context.fillRect(10, 10, 40, 40);
    context.strokeRect(0, 0, 60, 60);
    context.clearRect(20, 20, 20, 20);

    //path strokes
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.lineCap = 'square';
    context.beginPath();
    context.moveTo(200, 90);
    context.lineTo(300, 90);
    context.lineTo(300, 150);
    context.stroke();

    //path triangle
    context.fillStyle = '#fff000';
    context.moveTo(400, 300);
    context.lineTo(400, 150);
    context.lineTo(300, 225);
    context.lineTo(400, 300);
    context.lineCap = 'round';
    context.stroke();
    context.closePath()

    //arc
    context.strokeStyle = '#ff00ff';
    context.beginPath();
    context.arc(400, 400, 100, (Math.PI / 180) * 0, (Math.PI / 180) * 240, false);
    context.stroke();
    context.closePath()

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(100, 200);
    context.arcTo(350, 350, 100, 100, 50)

    //Bezier Curves
    context.strokeStyle = 'blue';
    context.moveTo(600, 300);
    context.quadraticCurveTo(500, 350, 600, 400);

    context.moveTo(150,300);
    context.bezierCurveTo(160,400,200,175,300,300);

    context.stroke();
    context.closePath()
}