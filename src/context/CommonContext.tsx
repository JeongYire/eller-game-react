import { createContext } from "react";
import { CommonContextType } from "../types/types";

const CommonContext = createContext<CommonContextType>({MAX_COLUMN : 20,MAX_ROW : 15,BOX_WIDTH : 50,BOX_HEIGHT : 50});


export { CommonContext };