

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
    this.StageHeadCenter = this.scene.add.text(
      this.scene.game.config.width/2 - 10,
      6,
      ['TURN'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0,
      align: 'center'
     }
    );    
    this.player1Turn = this.scene.add.text(
      10,
      6,
      ['YOU'],
      {
      fontFamily: 'font1',
      color: '#000000',
      fontSize: 10,
      lineSpacing: 0
     }
    );
    this.player2Turn = this.scene.add.text(
      this.scene.game.config.width - 10,
      6,
      ['CPU'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0,
      align: 'right'
     }
    ); 
    this.player2Turn.setOrigin(1,0)
    // this.player2Turn.setOrigin(1,0).setRightAlign();    
  }
  changeHead(mode){
    if(mode === 'PLAYER1'){
      this.player1Turn.setColor('#000000');
      this.player2Turn.setColor('#FFFFFF');
      this.StageHead.setTexture('spritesheet','stage_head_player1');
    }
    if(mode === 'PLAYER2'){
      this.player2Turn.setColor('#000000');
      this.player1Turn.setColor('#FFFFFF');      
      this.StageHead.setTexture('spritesheet','stage_head_player2');
    }
  }
}
  