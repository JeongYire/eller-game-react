import React, { forwardRef, Ref, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { CommonContext } from './context/CommonContext';
import Styles from './styles/styles.module.css';
import { BoxInteraction, Collision, CommonContextType } from './types/types';



export default forwardRef((props : { col : number, row : number, collision : number, isFinal : boolean, Move : (col : number,row : number) => void, Clear : () => void },ref : Ref<BoxInteraction>) => {

 
    const collision = props.collision;
    const context = useContext<CommonContextType>(CommonContext);
    const [explorer,SetExplorer] = useState(false);
    const [here,SetHere] = useState(false);
    const isClear = here && props.isFinal;

    if(here && !isClear){
        window.onkeydown = (e) => {
            const key = e.key.toUpperCase();
            if(!(collision & Collision.Up)){
                if(key == 'W' || key == 'ARROWUP'){
                    props.Move(props.col,props.row - 1);
                }
            }
            if(!(collision & Collision.Down)){
                if(key == 'S' || key == 'ARROWDOWN'){
                    props.Move(props.col,props.row + 1);
                }
            }
            if(!(collision & Collision.Left)){
                if(e.key == 'A' || key == 'ARROWLEFT'){
                    props.Move(props.col - 1,props.row);
                }
            }
            if(!(collision & Collision.Right)){
                if(e.key == 'D'  || key == 'ARROWRIGHT'){
                    props.Move(props.col + 1,props.row );
                }
            }
        }
    }

    useEffect(() => {
        if(here && props.isFinal){
            console.log('클리어!');
            props.Clear();
        }

        
 
        window.addEventListener('keydown',(event : KeyboardEvent) => {
            if(event.key == 'W'){
				
			}
            if(event.key == 'W'){
				
			}
            if(event.key == 'W'){
				
			}
            if(event.key == 'W'){
				
			}
        })

    },[here])

    useImperativeHandle(ref,() => ({
        Explorer : () => {
            SetExplorer(true);
            SetHere(true);
        },
        Leave : () => {
            SetHere(false);
        }
    }))

    const style : React.CSSProperties = {  
        borderTop : collision & Collision.Up && '1px solid black'
        ,borderBottom : collision & Collision.Down ? '1px solid black' : 'none'
        ,borderLeft : collision & Collision.Left ? '1px solid black' : 'none'
        ,borderRight : collision & Collision.Right ? '1px solid black' : 'none'
        ,backgroundColor : props.isFinal && !explorer ? 'orange' : explorer ? 'white' : 'black'
    } 

    return (
        <div className={Styles.outerBox} style={{width : context.BOX_WIDTH,height : context.BOX_HEIGHT}}>
            <div id={props.isFinal ? Styles.final : ''} className={Styles.innerBox} style={style}>
                    {
                        !isClear && here && !(collision & Collision.Left) && <span className={Styles.arrow} style={{left : 0}} onClick={() => props.Move(props.col - 1, props.row)}>{'◁'}</span>
                    }
                    {
                        !isClear && here && !(collision & Collision.Right) && <span className={Styles.arrow} style={{right : 0}} onClick={() => props.Move(props.col + 1, props.row)}>{'▷'}</span>
                    }
                    {
                        !isClear && here && !(collision & Collision.Down) && <span className={Styles.arrow} style={{bottom : 0}} onClick={() => props.Move(props.col, props.row + 1)}>{'▽'}</span>
                    }
                    {
                        !isClear && here && !(collision & Collision.Up) && <span className={Styles.arrow} style={{top : 0}} onClick={() => props.Move(props.col, props.row - 1)}>{'△'}</span>
                    } 
                    {
                        here && <span>옷</span>
                    }   
            </div>
        </div>
    )
});