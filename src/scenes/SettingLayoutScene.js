
import PlayerData from '../object/PlayerData';
import ChessManager from '../object/ChessManager';
import FooterMenu from '../object/ui/setting/FooterMenu';
import Layout from '../object/ui/setting/Layout';
import ChessInfoWindow from '../object/ui/setting/ChessInfoWindow';


class SettingLayoutScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'SettingLayoutScene'
    });
    /*プレイヤーデータの読み込み*/
    this.PlayerData = new PlayerData({
      scene: this.scene
    });
    this.ChessManager = new ChessManager({
      scene: this
    });


    this.selectedChess;
    this.selectedTile;

    this.teamGroup = [0,0,0];
    // this.teamGroup = this.PlayerData.player1_ChessList;

    this.MODE = "INFO";
    this.EDIT_STATUS = "";//CONTINUE or FIN
    this.EDIT_CHESS_STATUS = "";

    this.selectedLayoutChess = "";
    this.MAX_COST = 8;
    this.setCost = 0;

    

  }
  create(){

    this.EDIT_STATUS = "";

    this.teamGroup = this.registry.list.player1_ChessList;

    this.player1Auto_Arr = this.PlayerData.player1Auto_Arr;

    /*=================
    レイアウト編集
    =================*/
    this.FooterMenu = new FooterMenu({
      scene: this
    });
    this.FooterMenu.create();

    this.ChessInfoWindow = new ChessInfoWindow({
      scene: this
    });
    this.ChessInfoWindow.create();

    this.Layout = new Layout({
      scene: this
    });
    this.Layout.create();



    /*背景*/
    this.cameras.main.setBackgroundColor('#eeeeee');

    /*=================
    レイアウト編集
    =================*/
    this.layoutedChesses = [
      "chess_1",
      "chess_2",
      "chess_3",
    ];

    /*=================
    カーソル
    =================*/
    this.Cursor = this.add.sprite(
      20,
      40,
      'spritesheet',
      'cursor'
    );
    this.Cursor.setVisible(false);
    this.Cursor.depth = 50;

  
    /*==============================
    デバッグ
    ==============================*/
    // this.debugText = this.add.text(10, 120, '', { font: '10px Courier', fill: '#000' });
    // this.debugText.depth = 100;
    // this.debugText.setScrollFactor(0,0);
    // this.debugText.alpha = 0.8;    
    // this.setTeamChessGroup();
    // this.setStockChessGroup();
    /*------------------------------
    デバッグ END
    ==============================*/

    this.loadLayout();


  }
  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    // this.debugText.setText(
    //   [
    //     'EDIT_STATUS :'+this.EDIT_STATUS,
    //     'MODE        :'+this.MODE,
    //   ]
    // );

    /*------------------------------
    デバッグ END
    ==============================*/
  }


  touchLayoutChess(layoutChess){

    this.ChessInfoWindow.setChessInfo(layoutChess)
    if(this.EDIT_STATUS !== 'LAYOUT'){
      return;
    }
    /*カーソルの更新 */
    this.Cursor.setVisible(true);
    this.Cursor.x = layoutChess.x;
    this.Cursor.y = layoutChess.y;

    this.selectedLayoutChess = layoutChess;

  }
  touchLayoutTile(layoutTile){
    if(this.selectedLayoutChess){
      /*レイアウトの配列の更新 */
      /*削除*/
      this.player1Auto_Arr[this.selectedLayoutChess.tilePos.Y][this.selectedLayoutChess.tilePos.X] = 0;
      /*更新*/
      this.player1Auto_Arr[layoutTile.tilePos.Y][layoutTile.tilePos.X] = this.selectedLayoutChess.layoutIndex;

      /*選択したチェスの更新 */
      this.selectedLayoutChess.x = layoutTile.x;
      this.selectedLayoutChess.y = layoutTile.y;
      this.selectedLayoutChess.tilePos = layoutTile.tilePos;

      /*カーソルの更新 */
      this.Cursor.setVisible(true);
      this.Cursor.x = layoutTile.x;
      this.Cursor.y = layoutTile.y;

      /*移動ごとに保存*/
      this.registry.list.player1Auto_Arr = this.player1Auto_Arr;

    }
  }
  loadLayout(){

    let StageLayoutChessGroup = this.Layout.StageLayoutChessGroup.children.entries;

    for(var i = 0; i < this.player1Auto_Arr.length; i++){
      for(var k = 0; k < this.player1Auto_Arr[i].length; k++){
        let count = this.player1Auto_Arr[i][k];
        if(count !== 0){
          StageLayoutChessGroup[count - 1].x = k * 20 + 20;
          StageLayoutChessGroup[count - 1].y = i * 20 + 38 - 100;
          StageLayoutChessGroup[count - 1].tilePos.X = k;
          StageLayoutChessGroup[count - 1].tilePos.Y = i;
          StageLayoutChessGroup[count - 1].layoutIndex = count;
  
        }
      }
    }
    
  }

  /*==============================
  表示・非表示
  ------------------------------*/   
  /*ストックの駒
  ------------------------------*/
  showChessInfoWindow(){
    this.ChessInfoWindow.ChessInfoContainer.setVisible(true);
    this.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );
  }

  hideChessInfoWindow(){
    this.ChessInfoWindow.ChessInfoContainer.setVisible(false);
    this.ChessInfoWindow.ChessInfoMoveGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );
  }
}

export default SettingLayoutScene;
