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
    this.chessData = [
      // 'chess_3',
      'chess_1',
      'chess_2',
      'chess_3',
      'chess_4',
      'chess_5'
    ];
    this.itemData = [
      "item_bomb",
      "item_bomb",
      "item_portion"
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
      [1,2,3,0,0],
      [4,5,0,0,0]
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
      "item_bomb",
      "item_bomb",
      "item_portion"
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