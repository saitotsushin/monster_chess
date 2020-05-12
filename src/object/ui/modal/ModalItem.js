

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
      'window_blank'
    );
    this.container.add(
    [
      this.Window,
    ]);
    this.container.x = 52;
    this.container.y = 186;
    this.container.depth = 100;
    this.container.setVisible(false);
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
    console.log("modal item open")
    this.container.setVisible(true);
    // this.scene.itemManager.itemPlayer1Group.children.entries.forEach(
    //   (sprite) => {
    //     /*ステージに設置されていたら何もしない*/
    //     if(sprite.setted === false){
    //       sprite.setVisible(true);
    //     }
    //   }
    // );
    // this.scene.itemManager.itemBaseGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.setVisible(true);
    //   }
    // );
  }
  close(){
    this.container.setVisible(false);

    // this.container.setVisible(false);
    // this.scene.itemManager.itemPlayer1Group.children.entries.forEach(
    //   (sprite) => {
    //     /*ステージに設置されていたら何もしない*/
    //     if(sprite.setted === false){
    //       sprite.setVisible(false);
    //     }
    //   }
    // );
    // this.scene.itemManager.itemBaseGroup.children.entries.forEach(
    //   (sprite) => {
    //     sprite.setVisible(false);
    //   }
    // );
  }
}
  