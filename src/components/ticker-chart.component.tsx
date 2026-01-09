// TradingViewWidget.jsx
import React, { useEffect, useRef } from 'react';
import {observer} from "mobx-react";
import {NullableUndefinedString} from "../utils/nullable-types";

export const  TradingViewWidgetComponent: React.FC<{symbol: NullableUndefinedString}> = observer((props) => {
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(
        () => {

            console.log("Chart for " + props.symbol);
            if(!props.symbol) return;

            const existingScript = document.getElementById("tradingview_widget_script");
            if(existingScript) {
                existingScript.remove();
            }

            const script = document.createElement("script");
            script.id = "tradingview_widget_script";
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "allow_symbol_change": false,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "D",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "NASDAQ:${props.symbol}",
          "theme": "light",
          "timezone": "Etc/UTC",
          "backgroundColor": "#ffffff",
          "gridColor": "rgba(46, 46, 46, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
            container.current?.appendChild(script);
        },
        [props.symbol]
    );

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>

            <div className="tradingview-widget-copyright">
                <a href={`https://www.tradingview.com/symbols/NASDAQ-${props.symbol}/`} rel="noopener nofollow" target="_blank">
                    <span className="blue-text">{props.symbol} stock chart</span>
                </a>
                <span className="trademark"> by TradingView</span>
            </div>
        </div>
    );
})

//export default memo(TradingViewWidgetComponent);
