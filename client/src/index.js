import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserLibrary from "./library/UserLibrary";
import BookLibrary from "./library/BookLibrary";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserLibrary(),
        library: new BookLibrary(),
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);
