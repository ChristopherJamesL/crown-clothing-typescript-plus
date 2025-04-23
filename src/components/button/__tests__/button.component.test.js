import { render, screen } from '@testing-library/react';
import Button, { BUTTON_TYPE_CLASSES } from '../button.component';

describe('button tests', () => {
    test('should render base button when nothing is passed', () => {
        render(<Button/>);

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveStyle('background-color: black');
    })

    test('should render google sign-in button when buttonType is google', () => {
        render(<Button buttonType={BUTTON_TYPE_CLASSES.google} />);

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveStyle('background-color: #4285f4')
    })

    test('should render inverted button when buttonType is inverted', () => {
        render(<Button buttonType={BUTTON_TYPE_CLASSES.inverted} />)

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveStyle('background-color: white');
    })

    test('should be disabled if isLoading is true', () => {
        render(<Button isLoading={true} />);

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeDisabled();
    })
})