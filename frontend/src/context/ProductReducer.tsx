export interface ProductReducer {
    byStock: boolean;
    byRating: number;
    byShipping: boolean;
    sort?: string;
    searchQuery: string;
}

export const productReducerInitialState: ProductReducer = {
    byStock: false,
    byRating: 0,
    byShipping: false,
    searchQuery: ""
}

type ProductReducerActions = 
    {type: "SORT_BY_PRICE", payload: string} | 
    {type: "FILTER_BY_STOCK"} |
    {type: "FILTER_BY_RATING", payload: number} |
    {type: "FILTER_BY_SEARCH", payload: string} |
    {type: "FILTER_BY_SHIPPING"} | 
    {type: "CLEAR_ALL_FILTERS"}

export const ProductReducer = (state: ProductReducer, action: ProductReducerActions) => {

    switch(action.type){
        case "SORT_BY_PRICE":
            return {...state, sort: action.payload}
        case "FILTER_BY_STOCK":
            return {...state, byStock: !state.byStock}
        case "FILTER_BY_RATING":
            return {...state, byRating: action.payload}
        case "FILTER_BY_SEARCH":
            return {...state, searchQuery: action.payload}
        case "FILTER_BY_SHIPPING":
            return {...state, byShipping: !state.byShipping}
        case "CLEAR_ALL_FILTERS":
            return productReducerInitialState
        default:
            return state;
    }
}