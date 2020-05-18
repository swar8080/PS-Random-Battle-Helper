/**
 * @prettier
 */

import * as React from 'react';
import './AppHeader.scss';

interface AppHeaderProps {

}

const AppHeader: React.FC<AppHeaderProps> = (props: AppHeaderProps) => {
    return (
        <div className="appheader">Pokemon Showdown Random Battle Helper</div>
    );
};

export default AppHeader;