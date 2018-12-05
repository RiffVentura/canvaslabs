function drawScreen(context) {
    context.fillStyle = '#aaaaaa';
    context.fillRect(0, 0, 200, 200);
    context.fillStyle = '#000000';
    context.font = '20px _sans';
    context.textBaseline = 'top';
    context.fillText("Canvas!", 0, 0);
}