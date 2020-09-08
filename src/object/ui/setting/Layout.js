import Chess from '../menu/Chess';

export default class Layout{
  constructor(config) {

    this.scene = config.scene;

  }
  create(){
    this.StageLayoutTileGroup = this.scene.add.group();
    this.StageLayoutChessGroup = this.scene.add.group();
    this.LayoutContainer = this.scene.add.container(0, 0);
    /*タイトル：lAYOUT*/
    this.titleLayout = this.scene.add.bitmapText(
      10,
      12,
      'bitmapFont',
      'LAYOUT',
      10
    );    
    /*ボタン：レイアウト編集*/
    this.btnLayoutEdit = this.scene.add.sprite(
      92,
      17,
      'spritesheet',
      'btn_edit'
    );
    this.btnLayoutEdit.setInteractive();
    
    this.btnLayoutEdit.on('pointerdown', () => {

      if(this.scene.EDIT_STATUS !== "LAYOUT"){
        this.scene.EDIT_STATUS = "LAYOUT";
        this.btnLayoutEdit.setTexture('spritesheet','btn_edit_fin');
      }else{
        this.scene.EDIT_STATUS = "";
        this.btnLayoutEdit.setTexture('spritesheet','btn_edit');
      }

    },this); 
    
    this.LayoutContainer.add(
      [
        this.btnLayoutEdit,
        this.titleLayout
      ]
    );

    this.setLayoutGroup();
    // this.setLayoutChessToStage(); 
    this.scene.ChessInfoWindow.btnChessInfoWindowClose.setVisible(false)
  }
  setLayoutGroup(){
    let baseHeight = 38;
    let addHeight = 20;
    let n = 0;
    let tileX = 0;
    let tileY = 0;
    let panel = "";

    for(var i = 0; i < 18; i++){
      if(i % 6 === 0 && i !== 0){
        baseHeight += addHeight;
        tileX = 0;
        tileY++;
      }
    
      if(0 <= i && i < 6){//1行目
        if(i % 2 === 1){
          panel = "panel_layout_1";
        }else{
          panel = "panel_layout_2";
        }
      }
      if(6 <= i && i < 12){//2行目
        if(i % 2 === 1){
          panel = "panel_layout_2";
        }else{
          panel = "panel_layout_1";
        }
      }
      let sprite = this.scene.add.sprite(
        tileX * addHeight + 20,
        baseHeight,
        'spritesheet',
        panel
      );
      sprite.setInteractive();
      sprite.depth = 10;
      sprite.tileIndex = i;
      sprite.tilePos = {
        X: tileX,
        Y: tileY + 5
      }
      tileX++;
      let _this = this;
      sprite.on('pointerdown', () => {
        this.scene.touchLayoutTile(sprite);
      });
      this.StageLayoutTileGroup.add(sprite);
    }

  }
  setLayoutChessToStage(setting){
    let getKey = "";
    let layoutedChesses = setting.chessData;
    let chessDataList = setting.chessDataList;
    for(var i = 0; i < layoutedChesses.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === layoutedChesses[i]){
          let sprite = new Chess({
            scene: this.scene,
            x:i * 20 + 20,
            y: 38,
            frame: item.key,
            key: 'spritesheet'
          }); 
          sprite.depth = 20;
          sprite.setInteractive();
          sprite.tilePos = {
            X: i,
            Y: 5
          }
          sprite.status = item.status;
          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );
          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.charaName = item.key;

          sprite.on('pointerdown', () => {
            this.scene.touchLayoutChess(sprite);
          }); 
          this.StageLayoutChessGroup.add(sprite)
        }
      },this);
    }
  }
}
