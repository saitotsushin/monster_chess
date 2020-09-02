export default class LoadGameData {
  constructor() {
    /*======================
    自分のデータ
    ======================*/
    this.chessLayoutData = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [1,2,3,0,0],
      [4,5,0,0,0]
      // [0,0,0,0,0],
      // [0,0,0,0,0],
      // [0,0,0,0,0],
      // [0,0,1,0,0],
      // [0,0,0,0,0]      
    ];    
    this.chessDataMaster = [
      // 'chess_3',
      ['chess_1',3],
      ['chess_2',3],
      ['chess_3',3],
      ['chess_4',4],
      ['chess_5',5]
    ];
    this.chessData = [
      'chess_1',
      'chess_2',
      'chess_3',
      'chess_4',
      'chess_5'
    ];    
    this.itemData = [
      "item_bomb",
      "item_portion",
      "item_reflect"
    ];
    this.stockData = [
      "chess_1",
      "chess_2",
      "chess_3",
      "chess_4",
      "chess_5"
    ];    
    /*======================
    相手のデータ
    ======================*/
    this.chessLayoutData2 = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [3,2,1,0,0],
      [5,4,0,0,0]
      // [0,0,0,0,0],
      // [0,0,0,0,0],
      // [0,0,0,0,0],
      // [0,0,1,0,0],
      // [0,0,0,0,0]      
    ];
    this.chessData2 = [
      // 'chess_3',
      'chess_1',
      'chess_2',
      'chess_3',
      'chess_4',
      'chess_5'
    ];
    this.itemData2 = [
      "item_reflect",
      "item_reflect",
      "item_reflect"
    ];
    /*======================
    ステージデータ
    ======================*/    
    this.mapData = {
      "map1": [
        [1,0,1,0,1],
        [0,1,0,1,0],
        [1,0,1,0,1],
        [0,1,0,1,0],
        [1,0,1,0,1]        
      ]
    }      
  }
}