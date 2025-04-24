import { screen } from "@testing-library/react";
import Category from "../category.component";
import { renderWithProviders } from "../../../utils/test/test.utils";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ category: 'mens' })
}))

describe('Category Tests', () => {
    test('It should render a spinner if isLoading is true', () => {
        renderWithProviders(<Category />, {
            preloadedState: {
                categories: {
                    categories: [],
                    isLoading: true
                }
            }
        })
        const spinnerElement = screen.getByTestId('spinner');
        expect(spinnerElement).toBeInTheDocument();
    });

    test('It should render products if isLoading is false and there are items present', () => {
        renderWithProviders(<Category />, {
            preloadedState: {
                categories: {
                    categories: [
                        {
                            title: 'mens',
                            items: [
                                {id: 1, name: "Product 1"},
                                {id: 2, name: 'Product 2'}
                            ]
                        }
                    ],
                    isLoading: false
                }
            }
        })
        const spinnerElement = screen.queryByTestId('spinner');
        expect(spinnerElement).toBeNull();

        const product1Element = screen.getByText(/product 1/i);
        expect(product1Element).toBeInTheDocument();
    })
})