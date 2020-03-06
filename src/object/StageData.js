import Bomb from '../object/Trap/Bomb';
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
    this.trapList = {
      bomb: {
        key: "bomb",
        class: Bomb
      }
    };
    this.player1_TrapList = [
      this.trapList.bomb,
      this.trapList.bomb
    ]
  }
}