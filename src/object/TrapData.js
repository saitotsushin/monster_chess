import Bomb from './trap/Bomb';
import Portion from './trap/Portion';
export default class TrapData {
  constructor() {
    this.trapList = [
      {
        key: "bomb",
        className: Bomb
      },
      {
        key: "portion",
        className: Portion
      }
    ];
    this.player1_TrapList = [
      "bomb",
      "portion"
    ];
    this.player2_TrapList = [
      "bomb",
      "bomb"
    ];
  }
}