import { useContext, useRef, useState } from 'react';
import Box from './Box';
import { CommonContext } from './context/CommonContext';
import { BoxFamily, BoxInteraction, BoxType, Collision } from './types/types';
import Styles from './styles/styles.module.css';



// 0 혹은 1을 리턴합니다
const RandomCheck = () => Boolean(Math.round(Math.random()));


function App() {

  const makingBoxAction = (MAX_COLUMN : number, MAX_ROW : number) => {

    const array : BoxType[] = new Array();
    const length = MAX_COLUMN * MAX_ROW;
    const collosion = Collision.Left + Collision.Right + Collision.Up + Collision.Down;
  
    const getCollision = (box : BoxType) => {
      let number = 0;
      if(box.collision & Collision.Up){
        number++;
      }
      if(box.collision & Collision.Down){
        number++;
      }
      if(box.collision & Collision.Left){
        number++;
      }
      if(box.collision & Collision.Right){
        number++;
      }
      return number;
    }
  
    for(let idx = 0; idx < length; idx++){
  
      const row : number = parseInt(`${(idx) / MAX_COLUMN}`);
      const col = (idx - row * MAX_COLUMN);

      const boxType : BoxType = {
        no : idx,
        row: row,
        col: col,
        collision: collosion,
        family : null,
        isFinal : false,
        getCollision : () => getCollision(boxType),
      } 

      
      boxType.family = {
        no : boxType.no,
        members : [boxType]
      }
      
  
      array.push(boxType);
  
    }
  

    return array;
  }

  console.log('렌더링');
  const context = useContext(CommonContext);
  const boxHandler = useRef<BoxInteraction[]>([]);
  const [boxGroup,SetBoxGroup] = useState<BoxType[]>(() => makingBoxAction(context.MAX_COLUMN,context.MAX_ROW));
  const [ready,SetReady] = useState(false);
  const [clear,SetClear] = useState(false);
  const moveObject = useRef<BoxType>();
  
 // 원본
 /*
  const readyAction = () => {

    const currentBoxGroup = boxGroup;
    let familyGroup : BoxFamily[]= [];

    let row = 0;

    while(true){

      if(row == context.MAX_ROW){
        break;
      }


      if(row != context.MAX_ROW-1){
        // 우선 같은 행 배열을 무작위하게 선택해 합칩니다.
        for(let col = 0; col < context.MAX_COLUMN; col++){
          const column = currentBoxGroup[col + (row * context.MAX_COLUMN)];

          if(column.family == null){
            column.family = {
              no : column.no,
              members : [column]
            }
            familyGroup.push(column.family);
          
          }

  
          if(column.col+1 == context.MAX_COLUMN) continue;
          if(!RandomCheck()) continue;

          const siblingColumn = currentBoxGroup[column.no + 1];

     
          column.family.members.push(siblingColumn);
          siblingColumn.family = column.family;

          column.collision -= Collision.Right;
          siblingColumn.collision -= Collision.Left;
          
        }

      
        let idx = 0;
        const familyLength = familyGroup.length;
        // 합친후, 같이 연결된 가족중 최소 1개 이상의 구멍을 냅니다
        while(true){

          if(idx == familyLength){
            break;
          }

          const family = familyGroup[idx];
          let check = false;

          while(true){

            family.members.map(obj => {

              if(RandomCheck()){
                
                const siblingColumn = currentBoxGroup[obj.no + context.MAX_COLUMN];
        
                obj.collision -= Collision.Down;

                siblingColumn.collision -= Collision.Up;
                check = true;
              }
                
            });

            if(check){
              break;
            }

          }

          idx++;
        }
       
        
       
      }else{
        // 마지막 작업
        for(let col = 0; col < context.MAX_COLUMN; col++){
          const column = currentBoxGroup[col + (row * context.MAX_COLUMN)];

          if(col != context.MAX_COLUMN-1){

            const siblingColumn = currentBoxGroup[col+1 + (row * context.MAX_COLUMN)];
            column.collision -= Collision.Right;
            siblingColumn.collision -= Collision.Left;

          }

        }

        // 도착점을 만듭니다.
        let base = 3;
        
        while(true){
          const columns = currentBoxGroup.filter( obj => obj.getCollision() > base && obj.row != context.MAX_ROW-1 );
          if(columns.length < 1){
            base -= 1;
            continue;
          }
          const maxRow = columns.map(obj => obj.row).reduce( (a,b) => {
            return a > b ? a : b;
          });
          const sameRowColumns = columns.filter( obj => obj.row == maxRow );

          const finalColumn = sameRowColumns.reduce( (a,b) => {
            return a.col > b.col ? a : b;
          });

          finalColumn.isFinal = true;
          currentBoxGroup[finalColumn.no] = finalColumn;

          break;
        }
       

      }

    
      
      familyGroup = [];
      row++;
      
    }

    
    MoveAction(0,0);
    SetBoxGroup(currentBoxGroup);
    SetReady(!ready);
  }
  */

  //수정중
  const readyAction = () => {

    const currentBoxGroup = boxGroup;

    // 같은 행의 배열을 담는 배열입니다.
    let familyGroup : BoxFamily[]= new Array();

    let row = 0;

    //
    const RemoveFamily = (a : BoxFamily) => {
      const idx = familyGroup.findIndex( obj => obj.no == a.no );
      if(idx > -1){
        familyGroup.splice(idx,1);
      }
    }

    // 왼쪽에서 오른쪽을 뚫습니다. 만약 같은 배열일경우 false를 반환합니다. 
    // 성공적으로 뚫고나면 같은 배열에 넣습니다.
    const LeftToRight = (a : BoxType) : boolean => {

      const siblingColumn = currentBoxGroup[a.no + 1];

      if(siblingColumn.family?.no == a.family?.no){
        return false;
      }

      let targetFamily = a.family as BoxFamily;
      RemoveFamily(targetFamily);
      let siblingFamily = siblingColumn.family as BoxFamily;
      RemoveFamily(siblingFamily);
  
      const concatMembers : BoxType[] = targetFamily?.members.concat(siblingFamily?.members as []) as BoxType[];
      const concatFamily : BoxFamily = {
        no : a.family?.no as number,
        members : concatMembers
      }

      a.collision -= Collision.Right;
      siblingColumn.collision -= Collision.Left;

      concatFamily.members.map(obj => {
        obj.family = concatFamily;
        currentBoxGroup[obj.no] = obj;
      })

      familyGroup.push(concatFamily);

      return true;
    }

    // 오른쪽에서 왼쪽을 뚫습니다. 만약 같은 배열일경우 false를 반환합니다. 
    // 성공적으로 뚫고나면 같은 배열에 넣습니다.
    const RightToLeft = (a : BoxType) : boolean  => {
      const siblingColumn = currentBoxGroup[a.no - 1];

      if(siblingColumn.family?.no == a.family?.no){
        return false;
      }

      let targetFamily = a.family as BoxFamily;
      RemoveFamily(targetFamily);
      let siblingFamily = siblingColumn.family as BoxFamily;
      RemoveFamily(siblingFamily);

      const concatMembers : BoxType[] = targetFamily?.members.concat(siblingFamily?.members as []) as BoxType[];
      const concatFamily : BoxFamily = {
        no : siblingColumn.family?.no as number,
        members : concatMembers
      }

      a.collision -= Collision.Left;
      siblingColumn.collision -= Collision.Right;

      concatFamily.members.map(obj => {
        obj.family = concatFamily;
        currentBoxGroup[obj.no] = obj;
      })

      familyGroup.push(concatFamily);
 
      return true;
    }

    while(true){

      if(row == context.MAX_ROW){
        break;
      }

      if(row != context.MAX_ROW-1){

        for(let col = 0; col < context.MAX_COLUMN; col++){

          const column = currentBoxGroup[col + (row * context.MAX_COLUMN)];
          const family = column.family as BoxFamily;

          // 우선 배열을 넣어 초기화합니다...
          // familyGroup 에 없다면 추가합니다 
          if(familyGroup.findIndex(obj => obj.no == family.no) == -1){
            familyGroup.push(family);
          }
         
          if(column.col == 0){
            if(RandomCheck()){
              LeftToRight(column);
            }
            continue;
          }

          if(column.col+1 == context.MAX_COLUMN){
            if(RandomCheck()){
              RightToLeft(column);
            }
            continue;
          }


          if(RandomCheck()){
            LeftToRight(column);
          } 
          
          if(RandomCheck()){
            RightToLeft(column);
          }
          
        }

        let idx = 0;
        const familyLength = familyGroup.length;
        
        // 합친후, 같이 연결된 가족중 최소 1개 이상의 구멍을 냅니다
        while(true){

          if(idx == familyLength){
            break;
          }

          let family = familyGroup[idx];
          let check = false;

          // 인접한 벽이 같은 배열이면 안되므로, 같은 배열인지 체크하기위해 빈 배열을 선언합니다
          const targetFamily : BoxFamily = {
            no : -1,
            members : [],
          }

          while(true){

            family.members.map((obj,idx) => {

              if(idx == 0){
                targetFamily.no = obj.no;
              }
    
              if(RandomCheck()){
                
                const siblingColumn = currentBoxGroup[obj.no + context.MAX_COLUMN]; 
                
                obj.collision -= Collision.Down;
                siblingColumn.collision -= Collision.Up;

                currentBoxGroup[obj.no] = obj;
                currentBoxGroup[siblingColumn.no] = siblingColumn;

                targetFamily.members.push(siblingColumn);
                siblingColumn.family = targetFamily;
             
                check = true;

              }
                
            });

            if(check){
              break;
            }

          }

          idx++;
        }
        
       
        
       
      }else{
        // 마지막 작업
      
        for(let col = 0; col < context.MAX_COLUMN; col++){
          const column = currentBoxGroup[col + (row * context.MAX_COLUMN)];

          if(column.col == 0){
            LeftToRight(column);
            continue;
          }

          if(column.col == context.MAX_COLUMN-1){
            RightToLeft(column);
            continue;
          }

          LeftToRight(column);
          RightToLeft(column);

        }

        // 도착점을 만듭니다.
        // row가 높으면서 충돌지점이 많은 ( 벽이 많은 ) 컬럼을 고릅니다.
        let base = 3;
        
        while(true){
          const columns = currentBoxGroup.filter( obj => obj.getCollision() > base);
          if(columns.length < 1){
            base -= 1;
            continue;
          }
          const maxRow = columns.map(obj => obj.row).reduce( (a,b) => {
            return a > b ? a : b;
          });
          const sameRowColumns = columns.filter( obj => obj.row == maxRow );

          const finalColumn = sameRowColumns.reduce( (a,b) => {
            return a.col > b.col ? a : b;
          });

          finalColumn.isFinal = true;
          currentBoxGroup[finalColumn.no] = finalColumn;

          break;
        }
       

      }


      familyGroup = [];
      row++;
      
    }

    
    MoveAction(0,0);
    SetBoxGroup(currentBoxGroup);
    SetReady(!ready);
  }

  const MoveAction = (col : number,row : number) => {

    if(moveObject.current == null){

      const findObject = boxGroup.find( obj => obj.col == col && obj.row == row );

      if(findObject){
        moveObject.current = findObject;
        boxHandler.current[findObject.no].Explorer();
      }

    }else{

      const findObject = boxGroup.find( obj => obj.col == col && obj.row == row );

      if(findObject){
        boxHandler.current[moveObject.current.no].Leave();
        moveObject.current = findObject;
        boxHandler.current[findObject.no].Explorer();
      }

    }

  }

  const ClearAction = () => {
    SetClear(true);
  }

  return (
    <div id={Styles.boxContainer} style={{width: context.MAX_COLUMN * context.BOX_WIDTH,height : context.MAX_ROW * context.BOX_WIDTH}}>
      {
        boxGroup.map((obj) => {
          return <Box Clear={ClearAction} Move={MoveAction} key={obj.no} col={obj.col} row={obj.row} collision={obj.collision} isFinal={obj.isFinal} ref={refOjbect => (boxHandler.current[obj.no] = refOjbect as BoxInteraction)}/>
        })
      }
      {
        !ready && 
        <div id={Styles.readyBox}>
            <button onClick={readyAction}>시작</button>
        </div> 
      }
      {
        clear && 
        <div id={Styles.clearBox}>
            <p>클리어 하셨습니다!</p>
        </div> 
      }
    </div>
  );
}

export default App;
