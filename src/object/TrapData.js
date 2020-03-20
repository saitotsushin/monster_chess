import Bomb from './trap/Bomb';

export default class TrapData {
  constructor() {
    this.trapList = [
      {
        key: "bomb",
        className: Bomb
      }
    ];
    this.player1_TrapList = [
      "bomb"
    ];
    this.player2_TrapList = [
      "bomb",
      "bomb"
    ];
  }
}