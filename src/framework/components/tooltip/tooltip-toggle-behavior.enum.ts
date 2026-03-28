export enum TooltipToggleBehaviorEnum {
    /**
     * When the mouse enters the target element the tool tip is shown and when the mouse leaves target element
     * On mobile mouse enter occurs when the element is clicked and the tooltip is closed when user clicks somewhere outside.
     */
    OnTargetMouseEnterLeave,
    /**
     * The tooltip is shown/closed when the target element is clicked
     */
    OnTargetClick
}
