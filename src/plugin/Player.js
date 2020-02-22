export default class Player {
  constructor(gameScene) {
    this.scene = gameScene.scene;

    this.selectedChess = "";

    this.selectedTrap = {
      object: "",
      X: 0,
      Y: 0
    };
  }

}