import Bomb from './trap/Bomb';
import Portion from './trap/Portion';
export default class TrapData {
  constructor() {
    this.trapList = [
      {
        key: "item_bomb",
        className: Bomb
      },
      {
        key: "item_portion",
        className: Portion
      }
    ];
    this.player1_TrapList = [
      "item_bomb",
      "item_portion"
    ];
    this.player2_TrapList = [
      "item_bomb",
      "item_bomb"
    ];
  }
}