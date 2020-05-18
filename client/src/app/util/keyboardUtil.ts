import {KeyboardEvent} from 'react';


export function onEnterKeyPressed(event: KeyboardEvent, ifPressed: () => void){
    onKeyPressed(event, "Enter", ifPressed);
}

function onKeyPressed(event: KeyboardEvent, keyName: string, ifPressed: () => void){
    if (event.key === keyName){
        ifPressed();
    }
}
