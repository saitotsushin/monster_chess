export default class PlayerData {
  constructor() {
    this.stockChesses = [
      "chess_1",
      "chess_2",
      "chess_3",
      "chess_4",
      "chess_5"
    ];
    this.player1_ChessList = [
      "chess_1",
      // "chess_4",
      // "chess_3",
      // "chess_4",
      // "chess_5"
    ];
    this.player2_ChessList = [
      "chess_1",
      // "chess_2",
      // "chess_3",
      // "chess_4",
      // "chess_5"
    ]
    //初期の配置で使用
    this.player1_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    this.player1Auto_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    //初期の配置で使用
    this.player2_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    this.player2Auto_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,1,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];


  }
}