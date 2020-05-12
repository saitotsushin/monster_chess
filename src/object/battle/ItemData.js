import Bomb from './item/Bomb';
import Portion from './item/Portion';
export default class itemData {
  constructor() {
    this.itemList = [
      {
        key: "item_bomb",
        className: Bomb
      },
      {
        key: "item_portion",
        className: Portion
      }
    ];
    this.player1_itemList = [
      "item_bomb",
      "item_bomb",
      "item_portion"
    ];
    this.player2_itemList = [
      "item_bomb",
      "item_bomb",
      "item_portion"
    ];
  }
}