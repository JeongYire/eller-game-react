import { MutableRefObject, Ref } from "react"

type CommonContextType = {
    MAX_ROW : number,
    MAX_COLUMN : number,
    BOX_WIDTH : number,
    BOX_HEIGHT : number
}

type BoxType = {
    no : number,
    col : number,
    row : number,
    family : BoxFamily | null,
    collision : number,
    isFinal : boolean,
    getCollision: () => number,
}

type BoxInteraction = {
    Explorer : () => void,
    Leave : () => void,
}

type BoxFamily = {
    no : number,
    members : BoxType[]
}

enum Collision{
    Up = 8
    ,Down = 4
    ,Left = 2
    ,Right = 1
}



export {Collision};
export type { CommonContextType, BoxType, BoxFamily, BoxInteraction };