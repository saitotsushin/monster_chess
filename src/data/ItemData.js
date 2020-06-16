import Bomb    from '../object/item/Bomb';
import Portion from '../object/item/Portion';
import Reflect from '../object/item/Reflect';
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
      },
      {
        key: "item_reflect",
        className: Reflect
      }
    ];
  }
}