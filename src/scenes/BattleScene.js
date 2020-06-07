import GameManager    from '../object/battle/GameManager';
import GameAnimations from '../utils/GameAnimations';
import ClearGame      from '../object/ui/ClearGame';

class BattleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'BattleScene'
    });


  
    this.stageMap = "map1";//ステージマップの指定
    this.STATUS = {
      GAME_MODE: "",
      STAGE_MODE: "",
      WIN_PLAYER: "",
      PLAYER1: {
        CHESS_COUNT: 0,
      },
      PLAYER2: {
        CHESS_COUNT: 0,
      }
    };
    this.ClearGame;

    this.chessMapData = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    this.chessMapData2 = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    this.itemMap = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    this.itemMap2 = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];     
  }
  create(){
    /*背景色*/
    this.cameras.main.setBackgroundColor('#FFFFFF');    
    this.GameManager = new GameManager({
      scene: this
    });
    
    /*=====================
    registryデータの読み込み
    =====================*/
    for(var i = 0; i < this.registry.list.chessLayoutData.length; i++){
      for(var k = 0; k < this.registry.list.chessLayoutData[i].length; k++){
        if(this.registry.list.chessLayoutData[i][k] !== 0){
          this.chessMapData[i][k] = this.registry.list.chessLayoutData[i][k];
        }
      }
    }
    /*=====================
    相手のレイアウトは逆順にして配置
    =====================*/
    for(var i = 0; i < this.registry.list.chessLayoutData2.length; i++){
      this.registry.list.chessLayoutData2[i].reverse();
    }
    this.registry.list.chessLayoutData2.reverse();

    for(var i = 0; i < this.registry.list.chessLayoutData2.length; i++){
      for(var k = 0; k < this.registry.list.chessLayoutData2[i].length; k++){
        if(this.registry.list.chessLayoutData2[i][k] !== 0){
          this.chessMapData2[i][k] = this.registry.list.chessLayoutData2[i][k];
        }
      }
    }
    this.registry.list.chessMapData2 = this.registry.list.chessLayoutData2;

    this.ClearGame = new ClearGame({
      scene: this
    });

    this.STATUS.GAME_MODE = this.registry.list.gameMode;
    this.initScene();

    /*==================
    アニメーション
    ==================*/
    this.GameAnimations = new GameAnimations({
      scene: this
    }); 

  }

  /*==============================
  初期化
  ------------------------------*/
  initScene(){
    this.GameManager.initScene({
      map: this.stageMap,
      chessData: this.registry.list.chessData,
      chessMapData: this.chessMapData
    });
  }
  /*==============================
  ステージのタッチ
  ------------------------------*/    
  touchStage(pos){
    this.GameManager.touchStage(pos);
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(pos,index){
    this.GameManager.touchItem(pos,index);
  }
  /*==============================
  アイテム設置
  ------------------------------*/   
  touchCanPutTile(pos,index){
    this.GameManager.touchCanPutTile(pos,index);
  }
  /*==============================
  インフォタイルのタッチ
  ------------------------------*/   
  touchInfoTile(pos){
    this.GameManager.touchInfoTile(pos);
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
  ゲームクリア
  ------------------------------*/    
  clearGame(){
    this.ClearGame.open();
  }  
  /*==============================
  移動・攻撃完了
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
  ステージのモード変更
  ------------------------------*/   
  chengeStageMode(mode){
    this.STATUS.STAGE_MODE = "FIN";
  }
  /*==============================
  アイテム、インフォのウインドウ表示
  ------------------------------*/   
  // menuWindow(mode,status){
  //   this.GameManager.menuWindow(mode,status);
  // } 
  /*==============================
  アイテムウインドウ
  ------------------------------*/
  itemWindow(mode,window,status){
    /* 
      mode: ADD / XX
      window: ITEM / 
      status: OPEN / CLOSE
    */
    if(mode === "YES"){
      this.GameManager.updateStageTrap('ADD');
    }
    if(mode === "NO"){
      this.GameManager.setItemCancel();
    }
    this.GameManager.menuWindow(window,status); 
  }
  /*==============================

  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    this.GameManager.turnFin();
  }
  /*==============================
  ターンチェンジ
  ------------------------------*/    
  turnChange(){
    this.STATUS.STAGE_MODE = "";    
    this.GameManager.turnChange();
  }
  /*==============================
  チェスの削除
  ------------------------------*/    
  removeChess(chess){
    this.GameManager.removeChess(chess);
  }  
  /*==============================
  ゲームオーバー
  ------------------------------*/   
  gameover(){
    this.GameManager.gameover()
  }
}

export default BattleScene;
