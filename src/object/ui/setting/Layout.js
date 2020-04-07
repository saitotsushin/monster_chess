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
      55,
      'bitmapFont',
      'LAYOUT',
      10
    );    
    /*ボタン：レイアウト編集*/
    this.btnLayoutEdit = this.scene.add.sprite(
      90,
      60,
      'spritesheet',
      'btn_edit'
    );
    this.btnLayoutEdit.setInteractive();
    
    this.btnLayoutEdit.on('pointerdown', () => {
     
      if(this.scene.EDIT_STATUS !== 'FIN'){
        return;
      }
      if(this.scene.MODE !== "LAYOUT"){
        this.scene.MODE = "LAYOUT";
        this.setLayoutGroup();
        this.setLayoutChessToStage(); 
        this.btnLayoutEdit.setTexture('spritesheet','btn_edit_fin');
      }else{
        this.scene.setStageArr();
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
  }
  setLayoutGroup(){
    let baseHeight = 82;
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
      if(5 < i && i < 12){
        if(i % 2 === 1){
          panel = "panel_layout_2";
        }else{
          panel = "panel_layout_1";
        }
      }else{
        if(i % 2 === 1){
          panel = "panel_layout_1";
        }else{
          panel = "panel_layout_2";
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
        this.touchLayoutTile(sprite);
      });
      this.StageLayoutTileGroup.add(sprite);
    }

  }
  setLayoutChessToStage(){
    let getKey = "";
    this.layoutedChesses = this.teamGroup;
    for(var i = 0; i < this.layoutedChesses.length;i++){
      getKey = this.layoutedChesses[i];
      let sprite = this.add.sprite(
        i * 36 + 20,
        216,
        getKey
      );
      sprite.depth = 20;
      sprite.setInteractive();
      sprite.tilePos = {
        X: i,
        Y: 5
      }
      sprite.on('pointerdown', () => {
        this.touchLayoutChess(sprite);
      }); 
      this.StageLayoutChessGroup.add(sprite)

    }
  }
}
