import { createSelector } from 'reselect';

const businessList = state => state.businessReducer.businessList;

export const getCategories = createSelector(
    [ businessList ],
    (businessList) => {
        businessList.map(business => {
            const categoryIds = [];
            const categories = [];

            if (!categoryIds.includes(business.category._id)) {
              categories.push(business.category);
              categoryIds.push(business.category._id);
            }

            return categories;
        });
    }
)