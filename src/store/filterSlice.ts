import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
  subcategory: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  currentPage: number;
  itemsPerPage: number;
  view: 'grid' | 'list';
  sortBy?: string;
}

const initialState: FilterState = {
  category: '',
  subcategory: '',
  brand: '',
  priceRange: [0, 100000],
  rating: 0,
  currentPage: 1,
  itemsPerPage: 12,
  view: 'grid',
  sortBy: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSubcategory: (state, action: PayloadAction<string>) => {
      state.subcategory = action.payload;
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setView: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.view = action.payload;
    },
    clearFilters: (state) => {
      return { ...initialState, view: state.view };
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  setCategory,
  setSubcategory,
  setBrand,
  setPriceRange,
  setRating,
  setCurrentPage,
  setItemsPerPage,
  setView,
  clearFilters,
  setSortBy,
} = filterSlice.actions;

export default filterSlice.reducer;