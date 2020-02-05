

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
      if(this.selectedChess.moveAreaArr[y][x] === 1){
        console.log('%c移動しますか？', 'color: #000;background-color:yellow;');
        this.scene.conformMordal.setMessage({
          text: "移動しますか？",
          yes: "はい",
          no: "いいえ"
        });
        this.scene.conformMordal.open();
        this.mode = "move";
      }
      if(this.selectedChess.attackAreaArr[y][x] === 1 && tile.object.type === "player2"){
        console.log('%c攻撃しますか？', 'color: #FFF;background-color:red;');
        this.enemyChess = tile.object;
        this.scene.conformMordal.setMessage({
          text: "攻撃しますか？",
          yes: "はい",
          no: "いいえ"
        });
        this.scene.conformMordal.open();
        this.mode = "attack";
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
    // this.selectedChess.attack(this.enemyChess);
    let damage = this.selectedChess.status.power - this.enemyChess.status.difence;
    if(damage <= 0){
      damage = this.scene.getRandomInt(0,1);
    }
    this.enemyChess.status.hp -= damage;
    console.log(this.enemyChess.status.hp)
  }
  chessMove(){
    // this.selectedChess.move(this.this.touchedPos);
    let setPos = this.getPositionNumber(this.touchedPos.x,this.touchedPos.y);
    this.selectedChess.x = setPos.x;
    this.selectedChess.y = setPos.y;
    this.scene.stageData.tilePropertyArr[this.beforeChessPos.y][this.beforeChessPos.x].object = "";
    this.scene.stageData.tilePropertyArr[this.touchedPos.y][this.touchedPos.x].object = this.selectedChess;
    this.selectedChess.MoveArea.setPostion(this.touchedPos.x,this.touchedPos.y);
    this.selectedChess.MoveArea.hideAll();
    console.log(this.selectedChess.moveAreaArr);
    this.searchAttackArea();
  }
  searchAttackArea(){
    /*player2の駒を検索する */
    let playerChessArr = [];
    let check = ""
    for(var i = 0; i < this.scene.stageData.tilePropertyArr.length; i++){
      for(var k = 0; k < this.scene.stageData.tilePropertyArr[i].length; k++){
        if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player2"){

          console.log(this.scene.stageData.tilePropertyArr[i][k].object.type);

          check = this.getCanAttackChess(this.scene.stageData.tilePropertyArr[i][k].object);

          if(check){
            playerChessArr.push(this.getCanAttackChess(this.scene.stageData.tilePropertyArr[i][k].object));
          }else{
            /*移動する*/
          }


        }
      }
    }
    console.log("playerChessArr",playerChessArr)
  }
  getCanAttackChess(chess){
    /*攻撃エリアに相手の駒があるかチェックして盤の位置を返す*/
    for(var i = 0; i < chess.attackAreaArr.length; i++){
      for(var k = 0; k < chess.attackAreaArr[i].length; k++){
        if(chess.attackAreaArr[i][k] === 1){

          if(this.scene.stageData.tilePropertyArr[i][k].object.type === "player1"){
            return this.scene.stageData.tilePropertyArr[i][k];
          }
        }
      }
    }
    return "";
  }
}