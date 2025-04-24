import { screen, fireEvent } from "@testing-library/react";
import * as reactRedux from 'react-redux';
import Navigation from '../navigation.component';
import { renderWithProviders } from "../../../utils/test/test.utils";
import { signOutStart } from "../../../store/user/user.action";

describe('Navigation tests', () => {
    test('It should render a Sign In link if there is no current user', () => {
        renderWithProviders(
                <Navigation />, 
            {
            preloadedState: {
                user: {
                    currentUser: null
                }
            }
        })
        const signInLinkElement = screen.getByText(/sign in/i);
        expect(signInLinkElement).toBeInTheDocument();
    });

    test('It render a Sign Out link and not a Sign In link if there is a currentUser', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        })
        const signInLinkElement = screen.queryByText(/sign in/i);
        expect(signInLinkElement).toBeNull();

        const signOutLinkElement = screen.getByText(/sign out/i);
        expect(signOutLinkElement).toBeInTheDocument();
    });

    test('Does not render the cart dropdown when isCartOpen is false', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: false,
                    cartItems: []
                }
            }
        })
        const cartDropdownElement = screen.queryByText(/go to checkout/i);
        expect(cartDropdownElement).toBeNull();
    });

    test('Renders the cart dropdown when isCartOpen is true', () => {
        renderWithProviders(<Navigation />, {
            preloadedState: {
                cart: {
                    isCartOpen: true,
                    cartItems: []
                }
            }
        })
        const cartDropdownElement = screen.getByText(/go to checkout/i);
        expect(cartDropdownElement).toBeInTheDocument();
    });

    test('It should dispatch signOutStart action when clicking on the Sign Out link', async () => {
        const mockDispatch = jest.fn();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        })

        const signOutLinkElement = screen.getByText(/sign out/i);
        expect(signOutLinkElement).toBeInTheDocument();
        
        await fireEvent.click(signOutLinkElement);
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(signOutStart());

        mockDispatch.mockClear();
    });
})