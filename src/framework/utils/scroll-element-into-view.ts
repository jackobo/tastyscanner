import {Check} from "./type-checking";


export function scrollElementIntoViewSmooth(element: any, options?: ScrollIntoViewOptions): void {
    if(!Check.isFunction(element?.scrollIntoView)) {
        return;
    }

    options = {
        behavior: "smooth",
        block: "center",
        inline: "nearest",
        ...options
    };
    element.scrollIntoView(options);

}


export function scrollElementIntoViewLazySmooth(element: any, options?: ScrollIntoViewOptions, millisecondsDelay?: number): Promise<void> {
    if(!element) {
        return Promise.resolve();
    }

    return new Promise<void>(resolve => setTimeout(() => {
        if(element.current) {
            scrollElementIntoViewSmooth(element.current, options)
        } else {
            scrollElementIntoViewSmooth(element, options)
        }

        resolve();

    }, millisecondsDelay ?? 500));
}
