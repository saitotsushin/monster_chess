export default class GameAnimations{
  constructor(config) {

    this.scene = config.scene;

    this.create();
  }
  create(){

    /*------------------
    爆発
    ------------------*/
    this.scene.anims.create({
      key: 'anime_explode',
      frames: this.scene.anims.generateFrameNumbers('anime_explode', { start: 0, end: 5 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    });
    /*------------------
    攻撃：通常
    ------------------*/
    this.scene.anims.create({
      key: 'anime_attack',
      frames: this.scene.anims.generateFrameNumbers('anime_attack', { start: 0, end: 5 }),
      frameRate: 16,
      repeat: 0,
      hideOnComplete: true
    }); 
    /*攻撃のsprite*/
    this.scene.StageManager.AnimeAttack = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'chess_shadow'//ダミー//cursor_item
    );
    this.scene.StageManager.AnimeAttack.depth = 200;
  }
}
