/**
 * @prettier
 */
import * as React from "react";

const useAnalytics = () => {
    const isFirstSearch = React.useRef(true);

    const trackSearchChange = (search: Client.PokemonSummarySearchInputs) => {
        if (!isFirstSearch.current){
            window.ga("send", {
                hitType: "event",
                eventCategory: "search-gen",
                eventAction: "change",
                eventLabel: search.generation
            });
        }
        isFirstSearch.current = false;
    }

    return {trackSearchChange}
}

const trackException = (err: Error, fatal: boolean = false, stack?: string) => {
    let description = err.message;
    const stackTrace = stack || err.stack;
    if (stackTrace){
        description += " " + stackTrace;
    }
    
    window.ga("send", "exception", {
        exDescription: description,
        exFatal: fatal
    })
}

export {useAnalytics, trackException}