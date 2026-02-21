import React, {useCallback, useEffect, useState} from "react";
import {ResizeObserver} from "@juggle/resize-observer";

export function useElementScrollHeight(ref: React.RefObject<any>) {
    const getHeight = useCallback(() => {
        const element = ref.current;
        if(element) {
            return element.scrollHeight;
        } else {
            return 0;
        }
    }, [ref])
    const [scrollHeight, setScrollHeight] = useState(getHeight());

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setScrollHeight(getHeight());
        });

        if(ref.current) {
            resizeObserver.observe(ref.current)
        }

        return () => {
            resizeObserver.disconnect();
        }

    }, [ref, getHeight]);

    return scrollHeight;
}