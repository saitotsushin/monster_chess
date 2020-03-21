

export default class ModalWindow extends Phaser.Physics.Arcade.Sprite{
  constructor(config) {
    super(config.scene);

    this.scene = config.scene;

    this.target;

    // this.CHESS_STATUSlText = "テキスト";
    this.textData = {
      lead: "デフォルトテキスト",
      yes: "はい",
      no: "いいえ"
    };
    
    let baseRect = new Phaser.Geom.Rectangle(0, 0, this.scene.game.config.width/2, 40);
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
    this.container.y = this.scene.game.config.height - baseRect.height - 20;
    // this.container.y = 280;

    this.container.depth = 100; 

    this.mordalText = this.scene.add.text(
      10,
      10,
      this.textData.lead,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes = this.scene.add.text(
      10,
      25,
      this.textData.yes,
      { font: '10px Courier', fill: '#FFFFFF' }
    );

    this.btn_yes.setInteractive();
    this.btn_yes.on('pointerdown', function (pointer) {
      this.close();
      this.setYes();         
    },this);

    this.btn_no = this.scene.add.text(
      50,
      25,
      this.textData.no,
      { font: '10px Courier', fill: '#CCC' }
    );

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
    this.messageData = [
      {
        key: 'ATTACK',
        lead: '攻撃しますか？',
        yes: 'はい',
        no: 'いいえ'
      },
      {
        key: 'MOVE',
        lead: '移動しますか？',
        yes: 'はい',
        no: 'いいえ'
      },
      {
        key: 'LAYOUT_AUTO',
        lead: '自動配置しますか？',
        yes: 'はい',
        no: 'いいえ'
      },
      {
        key: 'SELECTED_TRAP',
        lead: 'トラップを配置しますか？',
        yes: 'はい',
        no: 'いいえ'
      },
      {
        key: 'FIN',
        lead: '完了しますか？',
        yes: 'はい',
        no: 'いいえ'
      }
    ]

  }
  /*============
  モーダル
  ============*/
  setYes(){
    let manager = this.scene.ModalManager;
    manager.modalYes();
  }
  setNo(){
    let manager = this.scene.ModalManager;
    manager.modalNo();
  }
  open(status){
    this.messageData.filter(function(item, index){
      if (item.key == status){
        this.mordalText.setText(item.lead);
        this.btn_yes.setText(item.yes);
        this.btn_no.setText(item.no);
      }
    },this);

    this.setVisible(true);
    this.container.setVisible(true);
    this.container.x = 0;
    // this.mordalText.x = 0;
    // this.mordalText.y = 0;
    this.scene.ModalManager.openModal = this;

  }
  close(){
    this.setVisible(false);
    this.container.setVisible(false);
    this.scene.ModalManager.openModal = "";
  }
}
  