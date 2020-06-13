/**
 * @prettier
 */

import * as React from "react";

interface AppFooterProps {}

const AppFooter: React.FC<AppFooterProps> = (props: AppFooterProps) => {
    return (
        <>
            <div className="appfooter__padding"></div>
            <div className="appfooter">
                <a
                    href="https://www.smogon.com/forums/threads/random-battle-helper-moves-items-abilities-stats-and-type-weaknesses.3665162/"
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    className="appfooter-link-with-icon"
                >
                    <img src='smogon-favicon.png' alt=''/>
                    <span>Report a bug or add a suggestion</span>
                </a>
                <div className="appfooter__divider"></div>
                <a
                    href="https://github.com/swar8080/PS-Random-Battle-Helper"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on Github"
                    tabIndex={-1}
                    className="appfooter-link-with-icon"
                >
                    <img src="github-logo.png" alt="Github" />
                    <span>View on Github</span>
                </a>
            </div>
        </>
    );
};

export default AppFooter;
