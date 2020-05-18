/**
 * @prettier
 */

import React from "react";
import { trackException } from "./useAnalytics";

interface AppErrorBoundaryProps {
    children: JSX.Element;
}

export default class AppErrorBoundary extends React.Component<AppErrorBoundaryProps> {
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        trackException(error, true);
    }

    render() {
        return this.props.children;
    }
}
