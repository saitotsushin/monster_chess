

export default class ModalItem{
  constructor(config) {

    this.scene = config.scene;
    this.create();
  }
  create(){
    this.container = this.scene.add.container();
    /*=====================
    window
    =====================*/
    this.Window = this.scene.add.sprite(
      0,
      0,
      'spritesheet',
      'window_base'
    );
    this.ModalWindowItemText = this.scene.add.text(
      this.scene.game.config.width/2 * -1 + 45, 
      -12,
      ['発火！！'],
      {
      fontFamily: 'font1',
      color: '#FFFFFF',
      fontSize: 10,
      lineSpacing: 0
     }
    );     
    /*=================
    
    -------------------*/
    this.itemSprite = this.scene.add.sprite(
      this.scene.game.config.width/2 * -1 + 24,
      0,
      'spritesheet',
      'item_bomb'
    );
    this.itemBase = this.scene.add.sprite(
      this.scene.game.config.width/2 * -1 + 24,
      0,
      'spritesheet',
      'panel_item'
    );
    this.itemBase.alpha = 0.3;
    
    // this.Window.setVisible(false)
    this.container.add(
    [
      this.Window,
      this.ModalWindowItemText,
      this.itemBase,
      this.itemSprite
    ]);
    // this.Window.setVisible(false);
    this.container.x = this.scene.game.config.width/2;
    this.container.y = 0;
    this.container.depth = 200;
    this.container.alpha = 0;
    // this.container.setVisible(false);
    this.close();
    // this.open();
  }
  /*============
  モーダル
  ============*/
  setYes(){
    this.scene.StageManager.moveChess(
      this.scene.PlayerManager.selectedChess,
      this.scene.StageManager.nextChessPos
    );
    this.close();
  }
  setNo(){
    this.container.setVisible(false);
  }
  open(item,chess){
    this.container.setVisible(true);
    this.itemSprite.setTexture('spritesheet',item.frame.name);
    this.ModalWindowItemText.setText([item.charaName,'発火！！'])
    let openTween = this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: 24,
      ease: 'liner',
      duration: 200,
      delay: 400,
      repeat: 0,
      completeDelay: 600,
      onComplete: function () {
        let closeTween = this.scene.tweens.add({
          targets: this.container,
          alpha: 0,
          y: -10,
          ease: 'liner',
          duration: 200,
          delay: 400,
          repeat: 0,
          onComplete: function () {
            item.firing(chess);
          },
          callbackScope: this
        });        
        // this.container.setVisible(false);
        // this.HP_text.setText(this.status.hp);
        // if(status === "explode"){
        //   this.anims.play('anime_explode');
        //   this.icon_enemy.setVisible(false); 
        //   this.icon_king.setVisible(false);  
        // }
      },
      callbackScope: this
    });    
  }
  close(){
    this.container.setVisible(false);
  }

}
  