import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserLibrary from "./library/UserLibrary";
import BookLibrary from "./library/BookLibrary";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const audience = process.env.REACT_APP_AUTH0_AUDIENCE

export const Context = createContext(null)

ReactDOM.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: audience
        }}
    >
        <Context.Provider value={{
            user: new UserLibrary(),
            library: new BookLibrary(),
        }}>
            <App />
        </Context.Provider>
    </Auth0Provider>,
    document.getElementById('root')
);