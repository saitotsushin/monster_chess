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
      5,
      'bitmapFont',
      'TEAM',
      10
    );
    /*テキスト：コスト*/
    this.costNow = this.scene.add.bitmapText(
      110,
      22,
      'bitmapFont',
      this.scene.registry.list.chessCost,
      10
    );
    /*テキスト：コスト*/
    this.costSlash = this.scene.add.bitmapText(
      113,
      28,
      'bitmapFont',
      '/',
      10
    );
    /*テキスト：コスト*/
    this.costMax = this.scene.add.bitmapText(
      118,
      29,
      'bitmapFont',
      '8',
      10
    );


    this.cosePanel = this.scene.add.sprite(
      120,
      26,
      'spritesheet',
      'cost_panel'
    );
    /*==============================
    ボタン：チーム編集
    ------------------------------*/        
    this.btnTeamEdit = this.scene.add.sprite(
      54,
      5,
      'spritesheet',
      'btn_edit'
    );
    this.btnTeamEdit.setInteractive();
    this.btnTeamEdit.setOrigin(0,0);

    this.btnTeamEdit.on('pointerdown', () => {

      if(this.scene.MODE === "FIN"){
        this.registry.list.chessMap = this.scene.teamGroup;
        this.scene.MODE = "";
        return;
      }

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

        

      }else{
        /*------------------------
        編集前
        ------------------------*/
        this.scene.MODE = "EDIT";
        this.btnTeamEdit.setTexture('spritesheet','btn_edit_fin');

        this.btnTeamEdit.alpha = 0.4;    
      }
    },this); 

    // this.setTeamChessGroup();

  }
  /*==============================
  チームに設定されているチェスたち
  ------------------------------*/   
  setTeamChessGroup(setting){
    let chessList = setting.chessList;
    let playerChessList;
    let group;
    let sprite;
    playerChessList = setting.chessData;
    group = this.playerTeamChessGroup;

    for(var i = 0; i < playerChessList.length; i++){
      chessList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          
          sprite = new Chess({
            scene: this.scene,
            x: i * 20 + 20,
            y: 30,
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

          sprite.charaName = item.key;

          this.scene.setCost += sprite.cost;

          this.costNow.setText(this.scene.setCost);


          group.add(sprite);
          let base = this.scene.add.sprite(
            i * 20 + 20,
            30,
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
