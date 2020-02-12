import Monster from '../sprites/character/Monster';
export default class SetChess {
  constructor(config) {
    this.player1_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];

    /*
    |key|class|
    */
    this.ownChesses = [
      ["monster1",Monster],
      ["monster2",Monster],
      ["monster3",Monster],
      ["monster4",Monster],
      ["monster5",Monster]
    ];

    this.setCount = 0;

    this.setMaxCount = this.ownChesses.length;

    this.scene = config.scene;
    this.player1ChessArea = this.scene.add.group();
    this.createArea();
    this.createChess();

    this.scene.stageStatus = "SET_CHESS";

    this.chessStatusObject = this.scene.add.sprite(40,40,"set_area");
    this.chessStatusText = this.scene.add.text(60, 50, '', { font: '10px Courier', fill: '#FFFFFF' });

    this.selectedChess;

  }
  // メソッド
  createArea() {
    let area;
    let key = "set_area";
    for(var i = 0; i < this.player1_Arr.length; i++){
      for(var k = 0; k < this.player1_Arr[i].length; k++){
        area = this.scene.add.sprite(20,20,key);
        area.x = k * this.scene.map.tileWidth + this.scene.map.tileWidth/2 + this.scene.stageLayer.x;
        area.y = i * this.scene.map.tileHeight + this.scene.map.tileHeight/2 + this.scene.stageLayer.y;
        if(this.player1_Arr[i][k] === 0){
          area.setVisible(false);
        }
        this.player1ChessArea.add(area);
      }
    }
  }
  createChess() {
    let chessObject;
    let className;
    let keyName;
    let _this = this;

    for(var i = 0; i < this.ownChesses.length; i++){
      keyName = this.ownChesses[i][0];
      className = this.ownChesses[i][1];
      chessObject = new className({
        scene: this.scene,
        x: this.scene.stageLayer.x + i*this.scene.map.tileWidth + this.scene.map.tileWidth/2,
        y: this.scene.stageLayer.y + this.scene.map.tileHeight*2.5,
        key: keyName,
        type: "player1"
      });   
      chessObject.setInteractive();
      chessObject.on('pointerdown', function (pointer) {
        _this.setChessStatus(this);
        _this.selectedChess = this;
      });
      this.scene.player1ChessGroup.add(chessObject);   
    }
  }
  setChessStatus(chess){
    let texture = chess.texture.key;
    this.chessStatusText.setText(
      [
        'HP      :'+chess.status.hp,
        'POWER   :'+chess.status.power,
        'DEFENSE :'+chess.status.defense,
      ]
    );
    this.chessStatusObject.setTexture(texture);
  }
  deployPosition(pos){
    /*
    配置がX:1.5,Y:2.5など初期値は0.5ずらしているので
    配置している->整数チェックOK
    配置していない->整数チェックNG
    で判定している。
    UIを変更する時は注意！
     */
    console.log("pos f",pos);
    let beforePosChess = this.scene.stageManager.getPositionInt(this.selectedChess.x,this.selectedChess.y);
    console.log("beforePosChess",beforePosChess);
    if(Number.isInteger(beforePosChess.X) 
      && Number.isInteger(beforePosChess.Y)){
        console.log("this.player1_Arr[beforePosChess.Y][beforePosChess.X]",this.player1_Arr[beforePosChess.Y][beforePosChess.X])
      this.scene.stageData.player1_Arr[beforePosChess.Y][beforePosChess.X] = 0;
    }
    

    let X = pos.x;
    let Y = pos.y;
    this.scene.stageData.player1_Arr[Y][X] = 1;
    this.selectedChess.x = this.scene.stageLayer.x + X*this.scene.map.tileWidth + this.scene.map.tileWidth/2;
    this.selectedChess.y = this.scene.stageLayer.y + Y*this.scene.map.tileHeight + this.scene.map.tileHeight/2;
    this.setCount = 0;

    this.scene.player1ChessGroup.children.entries.forEach(
      (chess,index) => {
        let posChess = this.scene.stageManager.getPositionInt(chess.x,chess.y);
        //整数チェック
        if(Number.isInteger(posChess.X)
           && Number.isInteger(posChess.Y)
           && this.player1_Arr[posChess.Y][posChess.X] === 1
        ){

          console.log("posChess",posChess);

          this.setCount++;

        }
        
      }
    ,this);
    if(this.setCount === this.setMaxCount){
      console.log("セット完了");
      this.scene.stageStatus = "SET_CHESS_FIN";
      this.scene.conformMordal.setMessage({
        text: "配置はこれで良いですか？",
        yes: "はい",
        no: "いいえ"
      });
      this.scene.conformMordal.open();
      this.scene.stageManager.mode = "set_fin";
    }
    /*表示ステータスのリセット */
    this.chessStatusText.setText(
      [
        '',
        '',
        ''
      ]
    );
    this.chessStatusObject.setTexture("set_area"); 
  }
  finSet(){

    this.scene.player1ChessGroup.children.entries.forEach(
      (chess,index) => {
        chess.removeInteractive();
      }
    ,this);
    this.player1ChessArea.children.entries.forEach(
      (area,index) => {
        area.setVisible(false);
      }
    ,this);

    this.chessStatusObject.setVisible(false);
     
  }
}