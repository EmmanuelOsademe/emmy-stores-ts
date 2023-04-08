import {useEffect, useRef, useState} from 'react';

export const useEffectOnce = (effect: () => void | (() => void)) => {
    
    const effectFunction = useRef<() => void | (() => void)>(effect);
    const destroyFunction = useRef<void | (() => void)>();
    const effectCalled = useRef(false);
    const rendered = useRef(false);
    const [, setVal] = useState<number>(0);

    if(effectCalled.current){
        rendered.current = true;
    }

    useEffect(() => {
        //Only execute the effect the first time around
        if(!effectCalled.current){
            destroyFunction.current = effectFunction.current();
            effectCalled.current = true;
        }

        // This forces one render after the effect is run
        setVal((val) => val + 1);

        return () => {
            // If the component did not render since the useEffect was called, we  know its the dummy React Cycle
            if(!rendered.current){
                return;
            }

            // Otherwise, this is not a dummy destroy, so call the destroy function
            if(destroyFunction.current){
                destroyFunction.current();
            }
        }
    }, [])
}