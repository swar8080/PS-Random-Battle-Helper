/**
 * @prettier
 */

import * as React from "react";
import "./AppHeader.scss";

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = (props: AppHeaderProps) => {
    return (
        <div className="appheader">
            <div>Pokemon Showdown Random Battle Helper</div>
            <a
                href="https://github.com/swar8080/PS-Random-Battle-Helper"
                target="_blank"
                rel="noopener noreferrer"
                title="View on Github"
            >
                <img className="appheader__githubLogo" src="github-logo.png" alt="Github" />
            </a>
        </div>
    );
};

export default AppHeader;
