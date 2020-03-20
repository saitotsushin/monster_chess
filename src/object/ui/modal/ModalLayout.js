

export default class ModalLayout extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);

    this.scene = config.scene;

    this.target;

    this.textData = {
      lead: "駒を選択してステージに配置",
      yes: "完了",
      no: "いいえ"
    };
    
    let baseRect = new Phaser.Geom.Rectangle(0, 0, this.scene.game.config.width, 100);
    let base = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );  
    base.fillRectShape(baseRect);
    base.alpha = 0.75;

    this.container = this.scene.add.container();
    this.setVisible(false);
    this.container.setVisible(false);


    this.container.x = 0;
    this.container.y = 60;

    this.container.depth = 100; 

    this.mordalText = this.scene.add.text(
      20,
      10,
      this.textData.lead,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes = this.scene.add.text(
      20,
      80,
      this.textData.yes,
      { font: '10px Courier', fill: '#FFFFFF' }
    );
    this.btn_yes.alpha = 0.3;

    this.setCompleteFlg = false;

    this.btn_yes.setInteractive();
    this.btn_yes.on('pointerdown', function (pointer) {
      if(this.setCompleteFlg === false){
        return
      }
      this.close();
      this.setYes();         
    },this);

    this.btn_no = this.scene.add.text(
      100,
      25,
      this.textData.no,
      { font: '10px Courier', fill: '#CCC' }
    );
    this.btn_no.setVisible(false);

    this.btn_no.setInteractive();

    this.btn_no.on('pointerdown', function (pointer) {   
      this.close();
      this.setNo();         
    },this);
    this.mordalText.depth = 101;

    this.container.add(
      [
        base,
        this.mordalText,
        this.btn_yes,
        this.btn_no
      ]
    );

    this.layoutChessModalGroup = this.scene.add.group();

  }
  /*============
  モーダル
  ============*/
  setComplete(){
    this.btn_yes.alpha = 1;
    this.setCompleteFlg = true;
  }
  setYes(){
    let manager = this.scene.ModalManager;
    let group = this.layoutChessModalGroup.children.entries;
    // this.scene.StageManager.layoutChessGroup = group;
    for(var i = 0; i < group.length; i++){
      let object = group[i];
      this.scene.StageManager.layoutChessGroup.add(object);
    }    
    this.layoutChessModalGroup.children.entries.forEach(
      (sprite,index) => {
        sprite.removeInteractive();
      }
    );    

    manager.modalYes();
  }
  setNo(){
    let manager = this.scene.ModalManager;
    manager.modalNo();
  }
  open(status){

    let getLayoutChessGroup = this.scene.PlayerManager.player1ChessGroup.children.entries;
    for(var i = 0; i < getLayoutChessGroup.length; i++){
      let object = getLayoutChessGroup[i];
      this.layoutChessModalGroup.add(object);
    }
    this.layoutChessModalGroup.children.entries.forEach(
      (sprite,index) => {
        // sprite.setVisible(false);
        sprite.x = index * 30 + 40;
        sprite.y = 110;
        sprite.depth = 105;
        sprite.setInteractive();
      }
    );     

    this.mordalText.setText(this.textData.lead);
    this.btn_yes.setText(this.textData.yes);
    this.btn_no.setText(this.textData.no);

    this.setVisible(true);
    this.container.setVisible(true);
    this.scene.ModalManager.openModal = this;

  }
  close(){
    this.setVisible(false);
    this.container.setVisible(false);
    this.scene.ModalManager.openModal = "";
  }
}
  