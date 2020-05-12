import Bomb from '../object/item/Bomb';
export default class StageData {
  constructor() {
    this.tilePropMap = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];

    this.stageCanSetArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];
    this.map1 = [
      [1,1,1,1,1,1],
      [1,2,3,1,1,1],
      [1,1,1,1,1,1],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];
    this.itemList = {
      bomb: {
        key: "bomb",
        class: Bomb
      }
    };
    this.player1_itemList = [
      this.itemList.bomb,
      this.itemList.bomb
    ]
  }
}