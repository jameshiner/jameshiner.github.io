class Coin {
    constructor(startCell, diameter) {
        const { position } = startCell;
        this.startCell = startCell;
        this.position = createVector(position.x + cellSize / 2, position.y + cellSize / 2);
        this.diameter = diameter;
        this.collected = false;
    }

    show() {
        const {
            diameter,
            position: { x, y },
        } = this;
        if (!this.collected) {
            strokeWeight(3);
            stroke(153, 101, 21);
            fill(255, 223, 0);
            ellipse(x, y, diameter, diameter);
        }
    }

    collidesWith(agent) {
        const { position: { x: ballPosX, y: ballPosY }, diameter } = this;
        const { position: { x: agentPosX, y: agentPosY }, height: agentHeight, width: agentWidth } = agent;
        const radiusSquared = (diameter / 2) ** 2;

        const newX1 = Math.sqrt(radiusSquared - (agentPosY - ballPosY) ** 2) + ballPosX;
        const newX2 = Math.sqrt(radiusSquared - (agentPosY + agentHeight - ballPosY) ** 2) + ballPosX;

        const newY1 = Math.sqrt(radiusSquared - (agentPosX - ballPosX) ** 2) + ballPosY;
        const newY2 = Math.sqrt(radiusSquared - (agentPosX + agent.width - ballPosX) ** 2) + ballPosY;

        if (
            (newX1 > agentPosX && newX1 < agentPosX + agentWidth) ||
            (newX2 > agentPosX && newX2 < agentPosX + agentWidth) ||
            (newY1 > agentPosY && newY1 < agentPosY + agentHeight) ||
            (newY2 > agentPosY && newY2 < agentPosY + agentHeight)
        ) {
            return true;
        }
        return false;
    }
}