import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterPage from "./pages/RouterPage";
import {Provider} from "react-redux";
import store from "./store";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <RouterPage/>
        </DevSupport>
    </Provider>
);

