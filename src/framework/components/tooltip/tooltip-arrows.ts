import styled from "styled-components";
import {CSS_TOOLTIP_ARROW_SIZE, CSS_VAR_TOOLTIP_BACKGROUND_COLOR} from "./tootip-css-constants";

const CSS_TOOLTIP_ARROW_POSITION = `calc(-1 * ${CSS_TOOLTIP_ARROW_SIZE}px)`;
const CSS_TOOLTIP_ARROW_WIDTH = `${CSS_TOOLTIP_ARROW_SIZE - 4}px`;
const CSS_TOOLTIP_ARROW_HEIGHT = `${CSS_TOOLTIP_ARROW_SIZE}px`;

const TooltipArrowBox = styled.div`
    position: absolute;
    width: 0;
    height: 0;
`

export const TooltipArrowPointingDownBox = styled(TooltipArrowBox)`
    bottom: ${CSS_TOOLTIP_ARROW_POSITION};
    border-left: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-right: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-top: ${CSS_TOOLTIP_ARROW_HEIGHT} solid var(${CSS_VAR_TOOLTIP_BACKGROUND_COLOR});
`

export const TooltipArrowPointingUpBox = styled(TooltipArrowBox)`
    top: ${CSS_TOOLTIP_ARROW_POSITION};
    border-left: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-right: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-bottom: ${CSS_TOOLTIP_ARROW_HEIGHT} solid var(${CSS_VAR_TOOLTIP_BACKGROUND_COLOR});
`

export const TooltipArrowPointingLeftBox = styled(TooltipArrowBox)`
    left: ${CSS_TOOLTIP_ARROW_POSITION};
    border-top: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-bottom: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-right: ${CSS_TOOLTIP_ARROW_HEIGHT} solid var(${CSS_VAR_TOOLTIP_BACKGROUND_COLOR});
`

export const TooltipArrowPointingRightBox = styled(TooltipArrowBox)`
    right: ${CSS_TOOLTIP_ARROW_POSITION};
    border-top: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-bottom: ${CSS_TOOLTIP_ARROW_WIDTH} solid transparent;
    border-left: ${CSS_TOOLTIP_ARROW_HEIGHT} solid var(${CSS_VAR_TOOLTIP_BACKGROUND_COLOR});
`