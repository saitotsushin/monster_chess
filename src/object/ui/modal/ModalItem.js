

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
      this.scene.game.config.width/2,
      0,
      'spritesheet',
      'window_item'
    );
    this.Window.setVisible(false)
    this.container.add(
    [
      this.Window,
    ]);
    this.container.x = this.scene.game.config.width/2;
    this.container.y = 198;
    this.container.depth = 200;
    // this.container.setVisible(false);
    this.close();
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
  open(){
    this.container.setVisible(true);

  }
  close(){
    this.container.setVisible(false);

  }
}
  