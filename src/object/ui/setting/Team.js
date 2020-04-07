import Chess from '../menu/Chess';

export default class Team{
  constructor(config) {

    this.scene = config.scene;

  }
  create(){
    this.playerTeamChessGroup = this.scene.add.group();
    /*タイトル：TEAM*/
    this.titleTeam = this.scene.add.bitmapText(
      10,
      12,
      'bitmapFont',
      'TEAM',
      10
    );
    /*==============================
    ボタン：チーム編集
    ------------------------------*/        
    this.btnTeamEdit = this.scene.add.sprite(
      54,
      11,
      'spritesheet',
      'btn_edit'
    );
    this.btnTeamEdit.setInteractive();
    this.btnTeamEdit.setOrigin(0,0);

    this.btnTeamEdit.on('pointerdown', () => {

      if(this.scene.EDIT_STATUS === "CONTINUE"){
        return;
      }else{
        this.scene.EDIT_STATUS = "CONTINUE";
      }
      if(this.scene.MODE === "EDIT"){
        /*------------------------
        編集中
        ------------------------*/
        this.scene.MODE = "INFO";
        this.scene.EDIT_STATUS = "";
        this.btnTeamEdit.setTexture('spritesheet','btn_edit');
        this.scene.hideStockChess();
        this.scene.showLayoutTile();
        
        // this.StockChessContainer.setVisible(false);
        // this.LayoutContainer.setVisible(true);
      }else{
        /*------------------------
        編集前
        ------------------------*/
        this.scene.MODE = "EDIT";
        this.btnTeamEdit.setTexture('spritesheet','btn_edit_fin');
        this.scene.showStockChess();
        this.scene.hideLayoutTile();
        this.btnTeamEdit.alpha = 0.4;
        // this.StockChessContainer.setVisible(true);
        // this.LayoutContainer.setVisible(false);        
      }
    },this); 

    this.setTeamChessGroup();

  }
  /*==============================
  チームに設定されているチェスたち
  ------------------------------*/   
  setTeamChessGroup(){
    let chessDataList = this.scene.ChessManager.ChessData.chessList;
    let playerChessList;
    let group;
    let sprite;
    playerChessList = this.scene.PlayerData.player1_ChessList;
    group = this.playerTeamChessGroup;

    for(var i = 0; i < playerChessList.length; i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          
          sprite = new Chess({
            scene: this.scene,
            x: i * 20 + 20,
            y: 40,
            frame: item.key,
            key: 'spritesheet'
          });

          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.type = "team";

          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;

          sprite.status = item.status;

          sprite.tileIndex = i;

          sprite.depth = 12;

          sprite.name = item.key;

          // sprite.setted = false;

          this.scene.setCost += sprite.cost;

          this.scene.textCost.setText('コスト:'+this.scene.setCost+'/'+this.scene.MAX_COST);


          group.add(sprite);
          let base = this.scene.add.sprite(
            i * 20 + 20,
            40,
            'spritesheet',
            'panel_add_team_1'
          );
          base.setInteractive();
          base.tileIndex = i;
          let _this = this;
          base.on('pointerdown', () => {
            _this.scene.touchAddTile(base)
          });
        }

      },this);

    }

  }
}
