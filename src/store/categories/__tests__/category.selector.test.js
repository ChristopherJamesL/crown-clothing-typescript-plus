import {selectCategories, selectCategoriesIsLoading, selectCategoriesMap} from '../category.selector';

const mockState = {
    categories: {
        categories: [
            {
                title: 'mens',
                imageUrl: 'test',
                items: [
                    {id: 1, name: 'Product 1'},
                    {id: 2, name: 'Product 2'}
                ]
            },
            {
                title: 'womens',
                imageUrl: 'test2',
                items: [
                    {id: 3, name: 'Product 3'},
                    {id: 4, name: 'Product 4'}
                ]
            }
        ],
        isLoading: false
    }
};

describe('Category Selector Tests', () => {
    test('selectCategories should return the categoriesData', () => {
        const categoriesSlice = selectCategories(mockState);
        expect(categoriesSlice).toEqual(mockState.categories.categories);
    });

    test('selectCategoriesIsLoading should return isLoading state', () => {
        const isLoading = selectCategoriesIsLoading(mockState);
        expect(isLoading).toEqual(false);
    });

    test('selectCategoriesMap should convert the items array into the appropriate map', () => {
        const expectedCategoriesMap = {
            mens: [
                {id: 1, name: 'Product 1'},
                {id: 2, name: 'Product 2'}
            ],
            womens: [
                {id: 3, name: 'Product 3'},
                {id: 4, name: 'Product 4'}
            ]
        }

        const categoriesMap = selectCategoriesMap(mockState);
        expect(categoriesMap).toEqual(expectedCategoriesMap);
    })
})

