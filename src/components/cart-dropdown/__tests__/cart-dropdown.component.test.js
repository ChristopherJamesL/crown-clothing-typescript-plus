import { screen, fireEvent } from "@testing-library/react";
import CartDropdown from "../cart-dropdown.component";
import { renderWithProviders } from "../../../utils/test/test.utils";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate
    }
});

describe('Cart Dropdown tests', () => {
    test('It should render empty message if no products are present', () => {
        renderWithProviders(<CartDropdown />, {
            preloadedState: {
                cart: {
                    cartItems: []
                }
            }
        })
        const emptyMessage = screen.getByText(/your cart is empty/i);
        expect(emptyMessage).toBeInTheDocument();
    });

    test('It should render items in dropdown if items are present', () => {
        renderWithProviders(<CartDropdown />, {
            preloadedState: {
                cart: {
                    cartItems: [
                        { id: 1, name: 'ItemA', imageUrl: 'test', price: 10, quantity: 1 },
                        { id: 2, name: 'ItemB', imageUrl: 'test1', price: 20, quantity: 2 },
                    ]                    
                }
            }
        })
        const item1 = screen.getByText(/itema/i);
        const item2 = screen.getByText(/itemb/i);
        expect(screen.queryByText(/your cart is empty/i)).toBe(null);
        expect(item1).toBeInTheDocument();
        expect(item2).toBeInTheDocument();
    });

    test('Go to checkout button should navigate to checkout page', () => {
       renderWithProviders(<CartDropdown />, {
        preloadedState: {
            cart: {
                cartItems: [],
            }
        }
       })
       const button = screen.getByRole(/button/i);
       fireEvent.click(button);
       expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });
})