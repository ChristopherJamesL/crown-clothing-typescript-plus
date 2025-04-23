import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "../../store/root-reducer";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";;

export function renderWithProviders(
    ui,
    {
        preloadedState = {},
        store = createStore(rootReducer, preloadedState),
        ...renderOptions
    } = {}
) {
    const Wrapper = ({ children }) => {
        return (
            <Provider store={store} >
                <BrowserRouter>{children}</BrowserRouter>
            </Provider>
        )
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}