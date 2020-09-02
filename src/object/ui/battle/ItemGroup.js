
import ItemData     from '../../../data/ItemData';
// import item         from '../../item/item';

export default class ItemGroup {
  constructor(config) {
    this.scene = config.scene;
    this.addGroup = config.addGroup;
    this.playerItemData = config.itemData;
    this.playerType = config.playerType;
    this.itemBaseGroup;
    this.beforePos = {
      x: 0,
      y: 0
    };
    this.itemIndex = 0;
    this.setted = false;
    this.create();
  }
  create(mode){
    /*カーソル*/
    this.title = this.scene.add.sprite(
      14,
      194,
      'spritesheet',
      'text_item'
    );   
    this.title.depth = 2; 
    this.ItemData = new ItemData();

    // let playeritemList;
    let bombHeight = 0;
    let itemGroup;
    let itemList = this.ItemData.itemList;
    let sprite;
    let _this = this;
    
    bombHeight = 194;
    itemGroup = this.addGroup;

    /*================
    トラップの設置
    ================*/
    for(var i = 0; i < this.playerItemData.length;i++){
      // frame: item.key,
      // key: 'spritesheet'
      itemList.filter(function(item, index){
        if(item.key === this.playerItemData[i]){
          sprite = new item.className({
            scene: this.scene,
            x: i * 32 + 32 + 16,
            y: bombHeight,
            key: 'spritesheet',
            frame: item.key,
            groupIndex: i + 1
          });
          // if(mode === "player2"){
          //   sprite.removeInteractive();
          //   // sprite.alpha = 0;
          // }
          sprite.pos = {
            X: 0,
            Y: 0
          }
          // sprite.alpha = 0.3;
          sprite.depth = 120;
          sprite.setted = false;
          sprite.isStage = false;
          sprite.itemIndex = i;
          sprite.setVisible(false);
          sprite.on('pointerdown', function (pointer) {
            _this.beforePos.x = this.x;
            _this.beforePos.y = this.y;
            _this.itemIndex = this.itemIndex;
            _this.scene.touchItem(this.pos,this.itemIndex);
          });          
          itemGroup.add(sprite);

        }
      },this);

    }
    /*================
    下地の作成。
    ================*/
    // if(mode === "player1"){
      this.itemBaseGroup = this.scene.add.group();
      /*ベース */
      for(var i = 0; i < 3;i++){
        let sprite = this.scene.add.sprite(
          i * 32 + 32 + 16,
          bombHeight,
          'spritesheet',
          'panel_item'
        );
        sprite.depth = 110;
        sprite.alpha = 0.1;

        this.itemBaseGroup.add(sprite)
    
      }
    // }
    /*================
    スタート
    ================*/    
    // this.hide();

  }
  show(){
    this.addGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    ); 
    this.itemBaseGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );  
  }
  // showActive(){
  //   this.addGroup.children.entries.forEach(
  //     (sprite) => {
  //       sprite.alpha = 1;
  //     }
  //   ); 
  // }  
  setItemCancel(){
    let item = this.addGroup.children.entries[this.itemIndex];
    item.x = this.beforePos.x;
    item.y = this.beforePos.y;
    item.isStage = false;
    item.depth = 120;
  }
  hide(){
    this.addGroup.children.entries.forEach(
      (sprite) => {
        if(!sprite.setted){
          sprite.setVisible(false);
        }
      }
    ); 
    this.itemBaseGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );  
  }
  removeGroupInteractive(){
    this.addGroup.children.entries.forEach(
      (sprite) => {
        sprite.removeInteractive();
      }
    );
  } 
  addGroupInteractive(){
    this.addGroup.children.entries.forEach(
      (sprite) => {
        if(!sprite.setted){
          sprite.setInteractive();
        } 
      }
    );
  }   
}