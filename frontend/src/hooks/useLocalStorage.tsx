import {useState, useEffect} from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)){
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key);
        if(jsonValue != null){
            return JSON.parse(jsonValue);
        }

        if(typeof initialValue === 'function'){
            return (initialValue as () => T)();
        }else{
            return initialValue;
        }
    })

    return [value, setValue] as [typeof value, typeof setValue];
}