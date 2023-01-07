import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { RouterProvider } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { router } from './App';
import store from "./store/store";

import './index.scss';

const theme = createTheme({
    palette: {
        primary: {
            main: "#00a1b6",
        },
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </Provider>
);