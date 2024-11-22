import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    category: string
    brand: string
    priceRange: [number, number]
    rating: number
    currentPage: number
    itemsPerPage: number
    view: 'grid' | 'list'
}

const initialState: FilterState ={
    category: 'all',
    brand: 'all',
    priceRange: [0, 1000],
    rating: 0,
    currentPage: 1,
    itemsPerPage: 9,
    view: 'grid'
}

const filterSlice = createSlice({
    name :"filters",
    initialState,
    reducers:{
        setCategory : (state, action:PayloadAction<string>) =>{
            state.category = action.payload
        },
        setBrand: (state, action:PayloadAction<string>) =>{
            state.brand = action.payload
        },
        setPriceRange: (state, action: PayloadAction<[number, number]>) => {
            state.priceRange = action.payload
        },
        setRating: (state, action: PayloadAction<number>) => {
            state.rating = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
          },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload
            state.currentPage = 1
        },
        setView: (state, action: PayloadAction<'grid' | 'list'>) => {
            state.view = action.payload
        },
        clearFilters: (state) =>{
            state.category = '';
            state.brand =''
            state.priceRange = [0, 500];
            state.rating = 0
        }
    }
})

export const {
    setCategory,
    setBrand,
    setPriceRange,
    setRating,
    setCurrentPage,
    setItemsPerPage,
    setView,
    clearFilters
  } = filterSlice.actions
export default filterSlice.reducer;