/**
 * @prettier
 */

import * as React from "react";

interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = (props: AppHeaderProps) => {
    return (
        <div className="appheader">
            <div>Pokemon Showdown Random Battle Helper</div>
        </div>
    );
};

export default AppHeader;
