import Menu            from '../ui/battle/Menu';
import Turn            from '../ui/battle/Turn';
import CreateTouchTile from './stage/CreateTouchTile';
import ModalAttack     from '../ui/modal/ModalAttack';
import ModalMove       from '../ui/modal/ModalMove';
import ModalItem       from '../ui/modal/ModalItem';
import ModalItemSet    from '../ui/modal/ModalItemSet';
import ChessInfoWindow from '../ui/setting/ChessInfoWindow';
import StageOverlay    from './stage/StageOverlay';

import ItemGroup from '../ui/battle/ItemGroup';
import StageItemTile from '../ui/battle/StageItemTile';

// import ModalMove       from '../ui/modal/ModalMove';

export default class UIManager {
  constructor(gameScene) {
    this.scene = gameScene.scene;
    // this.playerChessGroup = this.scene.add.group();
    // this.create();
    this.Cursor;
    this.CursorItem;
    this.ItemGroup;
    this.ItemGroup2;
    this.StageItemTile;
    this.selectedItem;
    this.selectedItemPos = {
      intPos: {},
      worldPos: {}
    };
  }

  /*==============================
  初期化
  ------------------------------*/     
  initScene(){
    this.StageOverlay = new StageOverlay({
      scene: this.scene
    });  
    this.StageOverlay.initScene();  


    this.Menu = new Menu({
      scene: this.scene
    });  
    this.Menu.initScene();  

    /*カーソル*/
    this.Cursor = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'cursor'
    );
    this.Cursor.setVisible(false);
    this.Cursor.depth = 200;

    /*カーソル アイテム用*/
    this.CursorItem = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'cursor_item'
    );
    this.CursorItem.setVisible(false);
    this.CursorItem.depth = 200;

    /*ウインドウ*/
    this.ModalAttack = new ModalAttack({
      scene: this.scene
    }); 
    this.ModalMove = new ModalMove({
      scene: this.scene
    });
    this.ModalItem = new ModalItem({
      scene: this.scene
    });
    this.ModalItemSet = new ModalItemSet({
      scene: this.scene
    });
    /*ターン表示*/
    this.Turn = new Turn({
      scene: this.scene
    });    
    /*攻撃のsprite*/
    this.AnimeAttack = this.scene.add.sprite(
      20,
      184,
      'spritesheet',
      'chess_shadow'//ダミー//cursor_item
    );
    this.AnimeAttack.depth = 200;
  }      
  
  startGame(){
    this.createTouchTile();
    this.createChessInfoWindow();
    this.Menu.show();
  }
  /*==============================
  タッチタイルの生成
  ------------------------------*/    
  createTouchTile(){
    this.CreateTouchTile = new CreateTouchTile({
      scene   : this.scene,
      mapData : this.scene.GameManager.StageManager.CreateStage.mapData,
      mapTile : this.scene.GameManager.StageManager.CreateStage.mapTile,
      layer   : this.scene.GameManager.StageManager.CreateStage.layer
    });
  }
  /*==============================
  ステージタッチ時
  ------------------------------*/
  showCusor(pos){
    this.Cursor.x = pos.x;
    this.Cursor.y = pos.y;
    this.Cursor.setVisible(true);
  }
  /*==============================
  アイテムタッチ時
  ------------------------------*/
  showCusorItem(pos){
    if(this.selectedItem.isStage){
      return false;
    }
    this.CursorItem.x = pos.x;
    this.CursorItem.y = pos.y;
    this.CursorItem.setVisible(true);
  }  
  /*==============================
  ウィンドウの表示
  ------------------------------*/
  openWindow(mode){
    if(mode === "MOVE"){
      this.ModalMove.open();
    }
    if(mode === "ATTACK"){
      this.ModalAttack.open();      
    }    
  } 
  closeWindow(mode){
    if(mode === "MOVE"){
      this.ModalMove.close();
    }
    if(mode === "ATTACK"){
      this.ModalAttack.close();      
    }    
  }   
  /*==============================
  自分のターン完了
  ------------------------------*/   
  turnFin(){
    // this.Cursor.setVisible(false);
    this.Menu.btnChangeStatus('TURN_FIN');
    this.Turn.changeHead(this.scene.STATUS.TURN);
  }
  /*==============================
  アイテムのウインドウ表示
  ------------------------------*/   
  menuItemOpen(){
    this.ModalItem.open();
  }
  menuItemShow(){
    this.ItemGroup.show();
  }
  // menuItemActive(){
  //   this.ItemGroup.showActive();
  // }
  menuItemClose(){
    // this.ModalItem.close();
    // this.Menu.itemClose();
  }

  /*==============================
  インフォのウインドウ表示
  ------------------------------*/   
  menuInfoOpen(){
    this.Menu.infoOpen();
    this.ChessInfoWindow.showTile();
    this.ChessInfoWindow.showCanPutTile({
      
    });    
  }
  menuInfoClose(){
  }

  /*==============================
  インフォのウインドウ表示
  ------------------------------*/   
  infoWindowOpen(chess){
  }  
  /*==============================
  アイテム、インフォのウインドウ非表示
  ------------------------------*/   
  menuClose(){
    /*アイテムのクローズ*/
    this.Menu.BtnItem.hide();
    this.StageItemTile.hide();
    this.CursorItem.setVisible(false);
    this.selectedItem = "";
  }   
  /*==============================
  ウィンドウの表示
  ------------------------------*/
  fin(mode){
    if(mode === "MOVE"){
      
    }
    if(mode === "ATTACK"){
      
    } 
    this.Menu.btnChangeStatus('FIN');   
  }
  /*==============================
  インフォグループの生成
  ------------------------------*/
  createChessInfoWindow(setting){
    this.ChessInfoWindow = new ChessInfoWindow({
      scene   : this.scene,
      mapData : this.scene.GameManager.StageManager.CreateStage.mapData,
      mapTile : this.scene.GameManager.StageManager.CreateStage.mapTile,
      layer   : this.scene.GameManager.StageManager.CreateStage.layer
    });      
  }  
  /*==============================
  アイテムグループの生成
  ------------------------------*/
  createItemGroup(setting){
    if(setting.playerType === "player1"){
      this.ItemGroup = new ItemGroup({
        scene: this.scene,
        addGroup: setting.addGroup,//追加するグループ
        itemData: setting.itemData,//アイテムデータ
        playerType: setting.playerType
      });  
    }else{
      this.ItemGroup2 = new ItemGroup({
        scene: this.scene,
        addGroup: setting.addGroup,//追加するグループ
        itemData: setting.itemData,//アイテムデータ
        playerType: setting.playerType
      });  
    }
  }
  /*==============================
  アイテムを配置できるステージの生成
  ------------------------------*/
  createItemStage(){
    this.StageItemTile = new StageItemTile({
      scene   : this.scene,
      mapData : this.scene.GameManager.StageManager.CreateStage.mapData,
      mapTile : this.scene.GameManager.StageManager.CreateStage.mapTile,
      layer   : this.scene.GameManager.StageManager.CreateStage.layer
    });
  }
  /*==============================
  アイテム選択中
  ------------------------------*/   
  touchItem(pos,index){
    this.selectedItem = this.ItemGroup.addGroup.children.entries[index];
    let worldPos = {
      x: this.selectedItem.x,
      y: this.selectedItem.y
    };
    this.showCusorItem(worldPos);
    this.StageItemTile.show();

    this.StageItemTile.showCanPutTile({
      map: this.scene.chessMapData,
      itemMap: this.scene.itemMap
    });
    // this.Menu.touchItem();

  }
  /*==============================
  アイテムの選択：キャンセル
  ------------------------------*/   
  setItemCancel(){
    this.selectedItem = "";
    this.CursorItem.setVisible(false);
    this.StageItemTile.hide();
    this.ItemGroup.setItemCancel();
  }  

  /*==============================
  アイテムの設置
  ------------------------------*/   
  touchCanPutTile(pos,index){
    this.selectedItemPos.intPos = pos.intPos;//移動後の位置を保存。
    this.selectedItemPos.worldPos = pos.worldPos;//移動後の位置を保存。
    this.ModalItemSet.open();

  }
  /*==============================
  アイテムの設置
  ------------------------------*/   
  updateStageTrap(mode){
    if(this.selectedItem){
      if(mode === "ADD"){
        /*======
        マスクの追加
        ========*/  
        // this.mask = this.scene.make.image({
        //   x: this.x,
        //   y: this.y,
        //   frame: "mask_15x10",
        //   key: 'spritesheet',
        //   add: false
        // });
        // var mask = maskImage.createBitmapMask();

        // // this.mask.scaleX = 1;
        // // this.mask.scaleY = 1;
        // // this.maskImage = new Phaser.Display.Masks.BitmapMask(this.scene, this.mask);
        
        // this.scene.setMask(this.selectedItem); 
        // var shape2 = this.scene.add.graphics().fillRect(
        //   this.selectedItemPos.worldPos.x,
        //   this.selectedItemPos.worldPos.y - 13,
        //   15,
        //   11
        // );
        // shape2.depth = 100;
        // shape2.fillStyle(0xFFFFFF, 1.0);
        var shape1 = this.scene.make.graphics().fillRect(
          this.selectedItemPos.worldPos.x,
          this.selectedItemPos.worldPos.y - 14,
          15,
          11
        );
        var geomask1 = shape1.createGeometryMask();
        this.selectedItem.setMask(geomask1);
        // this.selectedItem.alpha = 0.2;
        this.selectedItem.x = this.selectedItemPos.worldPos.x + 8;
        this.selectedItem.y = this.selectedItemPos.worldPos.y - 6;
        this.selectedItem.depth = 10;
        this.selectedItem.item_frame.setVisible(true);
        this.selectedItem.item_frame.depth = 9;
        this.selectedItem.item_frame.x = this.selectedItemPos.worldPos.x + 1;
        this.selectedItem.item_frame.y = this.selectedItemPos.worldPos.y + 1;
        this.selectedItem.removeInteractive();
        this.selectedItem.setted = true;
      }

    }else{
      alert("選択中のアイテムがありません。")
    }
  }  
  /*==============================
  アイテムの発火
  ------------------------------*/   
  itemFiring(item,chess){
    this.scene.STATUS.ANIME = true;
    this.ModalItem.open(item,chess);
  }  
}