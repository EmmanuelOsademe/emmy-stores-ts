import {useState, useEffect, useReducer, createContext} from "react";
import {Product} from "../../../backend/src/resources/product/product.model";
import { CartReducer, IReducer, initialiseCart } from "./CartReducer";

interface ContextProviderProps {
    children: React.ReactNode;
}


const useValue = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [baseUrl, setBaseUrl] = useState<String>("http://localhost:5000/api/v1");
    

    // Reducers
    const [cartState, cartDispatch] = useReducer(CartReducer, initialiseCart());

    useEffect(() => {
        fetch(`${baseUrl}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))
    }, [])


    return {
        baseUrl, products, cartState, cartDispatch
    }
}

export const Context = createContext({} as ReturnType<typeof useValue>);

export const ContextProvider = ({children}: ContextProviderProps) => {
    return (
        <Context.Provider value={useValue()}>{children}</Context.Provider>
    )
}