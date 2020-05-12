
import ItemData     from '../../../data/ItemData';
// import item         from '../../item/item';

export default class ItemGroup {
  constructor(config) {
    this.scene = config.scene;
    this.addGroup = config.addGroup;
    this.playerItemData = config.itemData;
    this.playerType = config.playerType;
    this.itemBaseGroup;
    this.create();
  }
  create(mode){
    
    this.ItemData = new ItemData();

    // let playeritemList;
    let bombHeight = 0;
    let itemGroup;
    let itemList = this.ItemData.itemList;
    let sprite;
    let _this = this;
    
    bombHeight = 182;
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
            x: i * 20 + 40,
            y: bombHeight,
            key: 'spritesheet',
            frame: item.key,
            groupIndex: i
          });
          // if(mode === "player2"){
          //   sprite.removeInteractive();
          //   // sprite.alpha = 0;
          // }
          sprite.pos = {
            X: 0,
            Y: 0
          }
          sprite.depth = 120;
          sprite.setted = false;
          sprite.itemIndex = i;
          sprite.setVisible(false);
          sprite.setInteractive();
          sprite.on('pointerdown', function (pointer) {
            if(!this.setted){
              _this.scene.touchItem(this.pos,this.itemIndex);
            }
            // return this.pos;
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
          i * 20 + 40,
          bombHeight,
          'spritesheet',
          'panel_item'
        );
        sprite.depth = 110;
        sprite.setVisible(false);

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
}