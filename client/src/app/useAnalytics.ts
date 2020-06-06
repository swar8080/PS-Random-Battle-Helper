/**
 * @prettier
 */
import * as React from "react";

const IS_ENABLED = !!process.env.REACT_APP_ENABLE_GA;

const useAnalytics = () => {
    const isFirstSearch = React.useRef(true);

    const trackSearchChange = (search: Common.PokemonSummarySearchInputs) => {
        if (IS_ENABLED){
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
    }

    return {trackSearchChange}
}

const trackException = (err: Error, fatal: boolean = false, stack?: string) => {
    if (IS_ENABLED){
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
}

export {useAnalytics, trackException}