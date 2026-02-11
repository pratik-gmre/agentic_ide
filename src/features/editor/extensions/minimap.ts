


import {showMinimap} from "@replit/codemirror-minimap"

const createMinimap = ()=>{
    const dom = document.createElement("div")
    return {dom}
}

export const Minimap = ()=>{
return showMinimap.compute(["doc"],()=>{
    return {
        create : createMinimap

    }
})
}