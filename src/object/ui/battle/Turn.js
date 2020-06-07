

export default class Turn{
  constructor(config) {

    this.scene = config.scene;
    this.create();
  }
  create(){
    this.container = this.scene.add.container();
    /*=====================
    StageHead
    =====================*/
    this.StageHead = this.scene.add.sprite(
      this.scene.game.config.width/2,
      10,
      'spritesheet',
      'stage_head_player1'
    );
    this.player1Turn = this.scene.add.bitmapText(
      2,
      6,
      'bitmapFont',
      'YOU',
      10
    );      
    this.player2Turn = this.scene.add.bitmapText(
      this.scene.game.config.width - 10,
      6,
      'bitmapFont',
      'CPU',
      10
    );
    this.player2Turn.setOrigin(1,0).setRightAlign();    
  }
  changeHead(mode){
    if(mode === 'player1'){
      this.StageHead.setTexture('spritesheet','stage_head_player1');
    }
    if(mode === 'player2'){
      console.log("mode",mode)
      this.StageHead.setTexture('spritesheet','stage_head_player2');
    }
  }
}
  