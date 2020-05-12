import Bomb    from '../object/item/Bomb';
import Portion from '../object/item/Portion';
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
  }
}