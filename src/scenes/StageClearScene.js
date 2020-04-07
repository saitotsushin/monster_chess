import ChessManager from '../object/ChessManager';
import PlayerData from '../object/PlayerData';
class StageClearScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'StageClearScene'
    });
    /*プレイヤーデータの読み込み*/
    this.PlayerData = new PlayerData({
      scene: this.scene
    });
    this.ChessManager = new ChessManager({
      scene: this
    });

  }
  create(){
    this.btnOK = this.add.text(
      120,
      180,
      '(GET)',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnOK.setInteractive();
    this.btnOK.on('pointerdown', () => {

      if(this.selectedChess){
        this.PlayerData.stockChesses.push(this.selectedChess.name);
        // this.scene.start('MainScene');
      }
      
      // this.scene.start('MainScene');

    },this);
    this.btnBack = this.add.text(
      20,
      180,
      '(back)',
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btnBack.setInteractive();
    this.btnBack.on('pointerdown', () => {

      this.scene.start('MainScene');

    },this);
    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(
      0,
      0,
      32,
      32
    );
    this.marker.depth = 10;
    this.selectedChess = "";
    this.playerChessGroup = this.add.group();

    this.setPlayerGroup();
  }
  setPlayerGroup(){
    let chessDataList = this.ChessManager.ChessData.chessList;
    let playerChessList;
    let group;
    // let sprite;
    playerChessList = this.PlayerData.player2_ChessList;
    group = this.playerChessGroup;

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          let sprite = this.add.sprite(
            i * 30 + 20,
            60,
            item.key
          );

          sprite.name = item.key;

          sprite.setInteractive();
          sprite.on('pointerdown', () => {
            this.touchChess(sprite);
          });
          group.add(sprite);

        }

      },this);

    }

  }
  touchChess(chess){
    this.selectedChess = chess;
    this.marker.x = chess.x - 16;
    this.marker.y = chess.y - 16;  
  }

}

export default StageClearScene;
