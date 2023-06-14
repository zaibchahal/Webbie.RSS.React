import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppConst } from '../../common/RssData/constants';
import { IBrandProps } from '../../services/POS/brandService';
import { ICategoryProps } from '../../services/POS/categoryService';
import { IProductProps } from '../../services/POS/productService';

const InitialState = {
    Brands: [{} as IBrandProps],
    Categories: [{} as ICategoryProps],
    Products: [{} as IProductProps],

};
export const ProductsSlice = createSlice({
    name: AppConst.Slices.Bank,
    initialState: InitialState,
    reducers: {
        LoadBrands: (state, action) => {
            state.Brands = action.payload;
        },
        LoadCategories: (state, action) => {
            state.Categories = action.payload;
        },
        LoadProducts: (state, action) => {
            state.Products = action.payload;
        },
        ClearProducts: (state) => {
            state.Products = [];
        },
    }
});

// Action creators are generated for each case reducer function
export const { LoadProducts, LoadBrands, LoadCategories, ClearProducts } = ProductsSlice.actions;
export default ProductsSlice.reducer;
