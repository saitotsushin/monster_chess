

export default class StageManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    this.layer = gameScene.scene.stageLayer;
    this.map = gameScene.scene.map;
    this.selectedChess = "";
    this.enemyChess = "";
    this.mode = "";
    this.touchedPos = {
      x: 0,
      y: 0
    }
    this.beforeChessPos = {
      x: 0,
      y: 0
    }
    
  }
  /*==============================
  ステージの初期化
  ==============================*/    
  initStage(stageArr){
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        stageArr[i][k] = {
          object: ""
        };
      }
    }
  }
  /*==============================
  駒の初期化
  ==============================*/    
  initSetChess(group,stageArr){
    let count = 0;
    let pos = {
      x: 0,
      y: 0
    };
    for(var i = 0; i < stageArr.length; i++){//縦：y
      for(var k = 0; k < stageArr[i].length; k++){//横：x
        if(stageArr[i][k] !== 0){
          pos = this.getPositionNumber(k,i);
          group.children.entries[count].x = pos.x;
          group.children.entries[count].y = pos.y;
          group.children.entries[count].MoveArea.setPostion(k,i);

          this.setProperty(k,i,"object",group.children.entries[count])
          
          count++;
        }
      }
    }
  }
  /*==============================
  ステージ上のX,Yを返す
  ==============================*/    
  getPositionNumber(x,y){
    let pos = {
      x: 0,
      y: 0
    };

    pos.x = this.layer.x + this.map.tileWidth * x + this.map.tileWidth/2;
    pos.y = this.layer.y + this.map.tileHeight * y + this.map.tileHeight/2;

    return pos;

  }
  setProperty(x,y,prop,data){
    let stageArr = this.scene.stageData.tilePropertyArr[y][x];

    switch(prop){
      case 'object':
        stageArr.object = data;
        break;
      default:
        console.log('no prop');
    }
  }
  touchedTile(x,y){
    let tile = this.scene.stageData.tilePropertyArr[y][x];
    if(tile.object.type === "player1"){
      if(this.selectedChess){
        this.selectedChess.MoveArea.hideAll();
      }
      tile.object.MoveArea.showAll();        
      this.selectedChess = tile.object;
      this.beforeChessPos.x = x;
      this.beforeChessPos.y = y;
    }


    
    if(this.selectedChess){
      if(this.selectedChess.areaArr[y][x] === 1){
        console.log('%c移動しますか？', 'color: #000;background-color:yellow;');
        this.scene.conformMordal.setMessage({
          text: "移動しますか？",
          yes: "はい",
          no: "いいえ"
        });
        this.scene.conformMordal.open();
        this.mode = "move";
      }
      if(this.selectedChess.areaArr[y][x] === 2){
        if(tile.object.type === "player2"){
          console.log('%c攻撃しますか？', 'color: #FFF;background-color:red;');
          this.enemyChess = tile.object;
          this.scene.conformMordal.setMessage({
            text: "攻撃しますか？",
            yes: "はい",
            no: "いいえ"
          });
          this.scene.conformMordal.open();
          this.mode = "attack";
        }else{
          this.scene.conformMordal.close();
          this.mode = "";          
        }
      }
      if(this.selectedChess.areaArr[y][x] === 3){
        if(tile.object.type === "player2"){
          console.log('%c攻撃しますか？', 'color: #FFF;background-color:red;');
          this.enemyChess = tile.object;
          this.scene.conformMordal.setMessage({
            text: "攻撃しますか？",
            yes: "はい",
            no: "いいえ"
          });
          this.scene.conformMordal.open();
          this.mode = "attack";
        }else{
          console.log('%c移動しますか？', 'color: #000;background-color:yellow;');
          this.scene.conformMordal.setMessage({
            text: "移動しますか？",
            yes: "はい",
            no: "いいえ"
          });
          this.scene.conformMordal.open();
          this.mode = "move";     
        }
      }
      if(this.selectedChess.areaArr[y][x] === 0){
        this.scene.conformMordal.close();
        this.mode = "";     
      }
      this.touchedPos = {
        x: x,
        y: y
      }
    }
  }
  setModalYes(){
    console.log('%c「はい」が押されました。', 'color: #000;background-color:yellow;');
    if(this.mode === "attack"){
      this.chessAttack(); 
    }
    if(this.mode === "move"){
      this.chessMove(); 
    }
  }
  setModalNo(){
    console.log('%c「いいえ」が押されました。', 'color: #000;background-color:yellow;');
    this.mode = "";
  }
  chessAttack(){
    let damage = this.selectedChess.status.power - this.enemyChess.status.difence;
    if(damage <= 0){
      damage = this.scene.getRandomInt(0,1);
    }
    this.enemyChess.status.hp -= damage;
  }
  chessMove(){
    
    let setPos = this.getPositionNumber(this.touchedPos.x,this.touchedPos.y);
    this.selectedChess.x = setPos.x;
    this.selectedChess.y = setPos.y;
    this.scene.stageData.tilePropertyArr[this.beforeChessPos.y][this.beforeChessPos.x].object = "";
    this.scene.stageData.tilePropertyArr[this.touchedPos.y][this.touchedPos.x].object = this.selectedChess;
    this.selectedChess.MoveArea.setPostion(this.touchedPos.x,this.touchedPos.y);
    this.selectedChess.MoveArea.hideAll();
    
    this.searchAttackArea();
  }
  searchAttackArea(){
    /*player2の駒を検索する */
    let player1ChessArr = this.getPlayer1Chess();
    let getNextStepArr = [];

    this.scene.player2ChessGroup.children.entries.forEach(
      (chess,index) => {
        let check = this.getCanAttackChess(chess,player1ChessArr);
        if(check){
          getNextStepArr.push(this.getCanAttackChess(chess,player1ChessArr));     
        }
      }
    ,this);

    //攻撃エリアになかったら、移動した先で攻撃できるか
    if(getNextStepArr.length === 0){
      this.scene.player2ChessGroup.children.entries.forEach(
        (chess,index) => {
          getNextStepArr.push(this.getCanMoveToAttackChess(chess,player1ChessArr));        
        }
      ,this);
    }
    console.log("getNextStepArr",getNextStepArr)
    
  }
  getPlayer1Chess(){
    let arr = [];
    for(var i = 0; i < this.scene.stageData.tilePropertyArr.length; i++){
      for(var k = 0; k < this.scene.stageData.tilePropertyArr[i].length; k++){
        if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player1"){
          arr.push({
            object: this.scene.stageData.tilePropertyArr[i][k].object,
            X: k,
            Y: i
          })
        }
      }
    }
    return arr;
  }
  getCanAttackChess(chess,player1ChessArr,pos){
    let checkArr = [];
    let moveArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    // let count = 0;
    if(pos){
      // console.log("chess.areaArr",chess.areaArr);
      chess.MoveArea.setPostionGroup(
        pos.X,
        pos.Y,
        chess.areaGroup,
        chess.areaMapBase,
        moveArr,
        "shift"
      )
    }else{
      moveArr = chess.areaArr;
    }
    for(var i = 0; i < player1ChessArr.length; i++){
      if(moveArr[player1ChessArr[i].Y][player1ChessArr[i].X] === 2 
        || moveArr[player1ChessArr[i].Y][player1ChessArr[i].X] === 3 ){
          console.log("moveArr",moveArr)
        
        checkArr.push({
          object: chess,
          target: player1ChessArr[i],
        })
      }
    }
    if(checkArr.length > 0){
      return checkArr;
    }else{
      return;
    }
  }
  getCanMoveToAttackChess(chess,player1ChessArr){
    let checkArr = [];
    let check;
    let pos = {
      X: 0,
      Y: 0
    };
    for(var i = 0; i < chess.areaArr.length; i++){
      for(var k = 0; k < chess.areaArr[i].length; k++){
        if(chess.areaArr[i][k] === 1 || chess.areaArr[i][k] === 3){
          console.log(chess.areaArr[i][k])
          pos.X = k;
          pos.Y = i;
          check = this.getCanAttackChess(chess,player1ChessArr,pos);
          
          if(check){
            console.log(check)
            checkArr.push(check);
          }
          
        }
      }
    }
    if(checkArr.length > 0){
      return checkArr;
    }else{
      return;
    }
    // chess.MoveArea.showAll();
  }
}