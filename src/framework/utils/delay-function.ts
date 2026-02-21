/**
 * Used to introduce a delay in case we want to slow down a specific operation
 * @param executionStartTime - when the specific operation started
 * @param totalDelayInMS - the total amount of time we want for the operation to execute
 */
export function delay(executionStartTime: number, totalDelayInMS: number): Promise<void> {
    const executionTime = Date.now() - executionStartTime;
    if (executionTime < totalDelayInMS) {
        return new Promise<void>((resolve => setTimeout(() => resolve(), totalDelayInMS - executionTime)));
    } else {
        return Promise.resolve();
    }
}
