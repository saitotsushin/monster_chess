import * as Func from '../common/Func';
export function getPoint(chess1,chess2,count){
  /*
  chess1: 自分の駒
  chess2: 相手の駒
  count: 何回目のロジックか
  ===
  |ポイント| 条件         |
  |40P    |１回目で倒せたら|
  |30P    |１回目で倒せない|
  |20P    |１回目で倒せたら|
  |10P    |１回目で倒せない|
  ※防御力＞攻撃力の場合、ランダムで0か1をダメージとして与えるので実際に倒せるかは厳密にしない。
  */
 let point = 0;
 let hp = chess1.status.hp;
//  let saveHp = chess1.status.hp;

  //相手の駒を倒せるか
  let damage = chess1.status.power - chess2.status.difence;
  if(damage <= 0){
    damage = Func.getRandomInt(0,1);
  }
  hp -= damage;
  if(hp <= 0){
    point = 40;
  }else{
    point = 30;
  }
  if(count === 1){
    point -= 20;
  }
  return point;
}
export function search(data){

  let checkPoint = data[0][0][0];
  let checkData = data[0][0];

  for(var i = 0; i < data.length;i++){
    for(var k = 0; k < data[i].length;k++){//chess毎
      if(checkPoint < data[i][k][0].evaluationPoint){
        checkPoint = data[i][k][0].evaluationPoint;
        checkData = data[i][k];
      }
    }
  }
  return checkData;
}