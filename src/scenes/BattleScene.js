import GameManager     from '../object/battle/GameManager';
import LoadGameData     from '../data/LoadGameData';

class BattleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BattleScene'
    });
    this.GameManager = new GameManager({
      scene: this
    });
    this.LoadGameData = new LoadGameData({
      scene: this
    });
    this.stageMap = "map1";//ステージマップの指定
    // this.STATUS = {
    //   STAGE: {
    //     MODE: ""
    //   }
    // }
  }
  create(){

    // this.STATUS = "";//play or menu
    this.loadPlayerData();
    this.initScene();


    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '8px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);
    this.debugText.alpha = 0.8;

  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        // 'gameMode: ' + this.scene.registry.list.gameMode
        // 'STA.P1.CNT:'+this.StageManager.STATUS.PLAYER1.CHESS_COUNT+'|STA.P2.CNT:'+this.StageManager.STATUS.PLAYER2.CHESS_COUNT,
      ]
    );
  }
  /*==============================
  プレイヤーデータロード
  ------------------------------*/  
  loadPlayerData(){
    /*自分のデータ*/
    this.registry.list.layoutData = this.LoadGameData.layoutData;
    this.registry.list.chessData  = this.LoadGameData.chessData;
    this.registry.list.itemData  = this.LoadGameData.itemData;
    // this.registry.list.itemMap  = this.LoadGameData.itemMap;
    /*相手のデータ*/
    this.registry.list.layoutData2 = this.LoadGameData.layoutData2;
    this.registry.list.chessData2  = this.LoadGameData.chessData2;    
    this.registry.list.itemData2  = this.LoadGameData.itemData2;
    // this.registry.list.itemMap2  = this.LoadGameData.itemMap2;
  }
  /*==============================
  初期化
  ------------------------------*/
  initScene(){
    this.GameManager.initScene({
      map: this.stageMap,
      chessData: this.registry.list.chessData,
      layoutData: this.registry.list.layoutData
    });
  }
  touchStage(pos){
    this.GameManager.touchStage(pos);
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(pos,index){
    console.log("touchItem pos="+pos+"/index="+index)
    this.GameManager.touchItem(pos,index);
  }
  /*==============================
  アイテム設置
  ------------------------------*/   
  touchCanPutTile(pos,index){
    console.log("touchCanPutTile");
    this.GameManager.touchCanPutTile(pos,index);
  }   
  /*==============================
  レイアウト完了
  ------------------------------*/   
  layoutFin(){
    this.GameManager.layoutFin();
  }
  /*==============================
  レイアウト完了
  ------------------------------*/  
  startGame(){
    this.GameManager.startGame();
  }
  /*==============================
  攻撃完了
  ------------------------------*/  
  actionChess(mode,status){
    if(mode === "MOVE"){
      this.GameManager.STATUS.MOVE = "FIN";
      this.GameManager.actionChessMove(status)
    }
    if(mode === "ATTACK"){
      this.GameManager.STATUS.ATTACK = "FIN";
      this.GameManager.actionChessAction(status)
    }     
  }
  /*==============================
  アイテム、インフォのウインドウ表示
  ------------------------------*/   
  menuWindow(mode,status){
    this.GameManager.menuWindow(mode,status);
  } 
  /*==============================
  アイテムをステージに配置する
  ------------------------------*/
  updateStageTrap(mode){
    this.GameManager.updateStageTrap(mode);
  } 

  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    this.GameManager.turnFin();
  }
  /*==============================
  ゲームオーバー
  ------------------------------*/   
  gameover(){
    this.GameManager.gameover()
  }
}

export default BattleScene;
