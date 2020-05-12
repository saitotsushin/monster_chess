export default class PlayerManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.player1ChessGroup = this.scene.add.group();
    this.player2ChessGroup = this.scene.add.group();

  }

}