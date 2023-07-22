import {useState, useEffect, useReducer, createContext} from "react";
import { CartReducer, IReducer, initialiseCart } from "./CartReducer";
import { IAddress } from "../interface/address";
import { ProductReducer, productReducerInitialState } from "./ProductReducer";
import { useEffectOnce } from "../hooks/useEffectOnce";

interface ContextProviderProps {
    children: React.ReactNode;
}

const useValue = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const [products, setProducts] = useState<any[]>([]);
    const [user, setUser] = useState<any>(undefined);

    // Reducers
    const [cartState, cartDispatch] = useReducer(CartReducer, initialiseCart());
    const [productFilterState, productFilterDispatch] = useReducer(ProductReducer, productReducerInitialState)

    useEffectOnce(() => {
        fetch(`${baseUrl}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))
    })

    /*useEffect(() => {
        fetch(`${baseUrl}/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))
    }, [])*/

    // Subtotal cost of cart Items
    const [subTotal, setSubTotal] = useState<number>(() => {
        if(cartState.cart.length > 0){
            return cartState.cart.reduce((acc, curr) => acc + ((products.find(prod => prod._id === curr.productId) as any)?.price * curr.quantity), 0)
        }else{
            return 0;
        }
    });
    const [deliveryOption, setDeliveryOption] = useState<'home-delivery' | 'pickup'>('home-delivery');
    const [shippingFee, setShippingFee] = useState<number>(1000);
    const [tax, setTax] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(subTotal+shippingFee);
    const [deliveryAddress, setDeliveryAddress] = useState<IAddress>({
        houseAddress: user?.address.houseAddress,
        city: user?.address.city,
        country: user?.address.country
    })


    return {
        baseUrl, products, cartState, cartDispatch, user, setUser, deliveryOption, setDeliveryOption, deliveryAddress,
        setDeliveryAddress, shippingFee, setShippingFee, tax, setTax, totalCost, setTotalCost, subTotal, setSubTotal,
        productFilterDispatch, productFilterState
    }
}

export const Context = createContext({} as ReturnType<typeof useValue>);

export const ContextProvider = ({children}: ContextProviderProps) => {
    return (
        <Context.Provider value={useValue()}>{children}</Context.Provider>
    )
}