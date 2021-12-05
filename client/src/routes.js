import Admin from "./pages/Admin";
import {
    ADMIN_ROUTE,
    BOOK_ROUTE,
    LOGIN_ROUTE,
    MAIN_ROUTE,
    READING_ROUTE,
    REGISTRATION_ROUTE,
    USER_ROUTE
} from "./utils/consts";
import Main from "./pages/Main";
import Auth from "./pages/Auth";
import BookPage from "./pages/BookPage";
import UserPage from "./pages/UserPage";
import Reading from "./pages/Reading";

export const authRoutes = [
    {
        path: USER_ROUTE + '/:id',
        Component: UserPage
    },
    {
        path: READING_ROUTE + '/:id',
        Component: Reading
    },
    {
        path: BOOK_ROUTE + '/:id',
        Component: BookPage
    }
]

export const moderRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    }
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    }
]