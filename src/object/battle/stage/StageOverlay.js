export default class StageOverlay{
  constructor(config) {
    this.scene = config.scene;
  }
  initScene(){

    this.overlayArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, -16, this.scene.game.config.width, this.scene.game.config.height);
    this.overlayArea.fillRectShape(this.rect);
    this.overlayArea.alpha = 0.9;
    this.overlayArea.setScrollFactor(0);
    this.overlayArea.depth = 1000;
    this.floorNumber = this.scene.add.text(
      10,
      40, 
      ['ダンジョン',this.scene.registry.list.floorNumber+'F'],
      {
        fontFamily: 'font1',
        color: '#FFFFFF',
        fontSize: 10,
        lineSpacing: 0,
        align: 'center',
        wordWrap: { 
          width: this.scene.game.config.width
        }
      }
    ); 
    // this.floorNumber.depth = 1001;
    this.container = this.scene.add.container();
    this.container.add(
      [
        // this.overlapArea1,
        this.floorNumber
      ]
    );
    this.container.depth = 1001;

    this.fadeOverlay();
  }
  fadeOverlay(){
    let Tween = this.scene.tweens.add({
      targets: this.overlayArea,
      alpha: 0,
      x: this.scene.game.config.width/2,
      ease: 'liner',
      duration: 400,
      delay: 400,
      repeat: 0,
      completeDelay: 600,
      onComplete: function () {
      },
      callbackScope: this
    }); 
    let Tween2 = this.scene.tweens.add({
      targets: this.floorNumber,
      alpha: 0,
      x: this.scene.game.config.width/10,
      ease: 'liner',
      duration: 400,
      delay: 300,
      repeat: 0,
      completeDelay: 600,
      onComplete: function () {
      },
      callbackScope: this
    });        
  }
}