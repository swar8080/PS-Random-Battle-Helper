/**
 * @prettier
 */

import React from "react";
import ReactDOM from "react-dom";
import AppErrorBoundary from './app/AppErrorBoundary';
import App from "./app/App";
import { IS_IE } from "./app/util/browserDetection";

if (!IS_IE) {
    ReactDOM.render(
        <React.StrictMode>
            <AppErrorBoundary>
                <App />
            </AppErrorBoundary>
        </React.StrictMode>,
        document.getElementById("root")
    );
} else {
  document.write("This website does not support Internet Explorer");
}
