
import { StateEffect,StateField } from "@codemirror/state"
import { Decoration,DecorationSet,EditorView , ViewPlugin , ViewUpdate , WidgetType,keymap } from "@codemirror/view"




const setSuggestionEffect = StateEffect.define<string | null>()
const suggestionState = StateField.define<string | null>({
    create(){
        return " "
    },
    update(value,transaction){
        for (const effect of transaction.effects){
            if(effect.is(setSuggestionEffect)){
                return effect.value
            }
        }
        return value
    },
})


const renderPlugin =  ViewPlugin.fromClass(class{
    decorations:DecorationSet;

    constructor(view:EditorView){
        this.decorations = this.build(view)
    }

    update(update:ViewUpdate){

        const suggestionChanged = update.transactions.some((transaction)=> transaction.effects.some((effect)=>effect.is(setSuggestionEffect)
    
    
   
    ))
     if(update.docChanged || update.selectionSet || suggestionChanged){
        this.decorations = this.build(update.view)
    }
    }

    build(view:EditorView){
        const suggestion = view.state.field(suggestionState)
        if(!suggestion){
            return Decoration.none;
        }



        const cursor = view.state.selection.main.head;
        return Decoration.set({
            Decoration.widget({
                widget: new SuggestionWidget(suggestion)
            })
        })
    }
})

export const Suggestion = (fileName:string)=>[
    suggestionState,
    renderPlugin,
]