## Custom OrderBook 
### Description:
- Websocket Data via Cryptofacilities api
- Utilizes Webworkers to not overload the main UI thread
- Supports high volatility by batching orderbook data and sending to the frontend every 1500ms
- Supports all Evergreen browsers
- Run's smoothly on low-end devices, tested with 6x slowdown CPU throttling
- Mobile Responsive
- Built with typescript
- Test coverage for expensive webworker methods

### Production build:
https://cryptofacilities-orderbook.vercel.app/
