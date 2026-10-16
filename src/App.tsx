import { useEffect, useState } from "react";
import "./App.css";
import {
    getTrades,
    createTrade,
    getSignals,
    generateSignal,
    getLatestPrice,
    Trade,
    Signal,
    Market,
} from "./api";

function App() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [signals, setSignals] = useState<Signal[]>([]);
    const [symbol, setSymbol] = useState("AAPL");
    const [market, setMarket] = useState<Market>("stock");
    const [side, setSide] = useState<"buy" | "sell">("buy");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(100);

    const loadData = async () => {
        const [t, s] = await Promise.all([getTrades(), getSignals()]);
        setTrades(t);
        setSignals(s);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateTrade = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTrade = await createTrade({
            symbol,
            side,
            quantity,
            price,
        });
        setTrades((prev) => [newTrade, ...prev]);
    };

    const handleGenerateSignal = async () => {
        const signal = await generateSignal(symbol, market);
        setSignals((prev) => [signal, ...prev]);
    };

    const handleFetchPrice = async () => {
        const result = await getLatestPrice(symbol, market);
        setPrice(result.price);
    };

    return (
       <div style={{ padding: "1rem", maxWidth: "900px", margin: "0 auto" }}>
           <h1>AI Trading Dashboard (Demo)</h1>

           <section style={{ marginBottom: "2rem" }}>
               <h2>Generate AI Signal</h2>
               <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                   <input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        placeholder="Symbol (AAPL, BTCUSDT, etc.)"
                    />
                   <select
                        value={market}
                        onChange={(e) => setMarket(e.target.value as Market)}
                    >
                       <option value="stock">Stock</option>
                       <option value="crypto">Crypto</option>
                   </select>
                   <button onClick={handleGenerateSignal}>Generate Signal</button>
                   <button type="button" onClick={handleFetchPrice}>
                        Get Latest Price
                   </button>
               </div>
               <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    For stocks, use tickers like  <b>AAPL</b>,  <b>TSLA</b>. For crypto,
                    use Binance symbols like  <b>BTCUSDT</b>,  <b>ETHUSDT</b>. This is a
                    simple moving-average strategy for demo only (NOT financial advice).
               </p>
           </section>

           <section style={{ marginBottom: "2rem" }}>
               <h2>Create Paper Trade (Manual)</h2>
               <form
                    onSubmit={handleCreateTrade}
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                   <input
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    />
                   <select
                        value={side}
                        onChange={(e) => setSide(e.target.value as "buy" | "sell")}
                    >
                       <option value="buy">Buy</option>
                       <option value="sell">Sell</option>
                   </select>
                   <input
                        type="number"
                        value={quantity}
                        min={0}
                        step={0.01}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                   <input
                        type="number"
                        value={price}
                        min={0}
                        step={0.01}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                   <button type="submit">Save Trade</button>
               </form>
           </section>

           <section style={{ marginBottom: "2rem" }}>
               <h2>Latest Signals</h2>
               <table border={1} cellPadding={6}>
                   <thead>
                       <tr>
                           <th>ID</th>
                           <th>Symbol</th>
                           <th>Prediction</th>
                           <th>Recommendation</th>
                           <th>Time</th>
                       </tr>
                   </thead>
                   <tbody>
                        {signals.map((s) => (
                           <tr key={s.id}>
                               <td>{s.id}</td>
                               <td>{s.symbol}</td>
                               <td>{s.prediction.toFixed(4)}</td>
                               <td>{s.recommendation}</td>
                               <td>{new Date(s.created_at).toLocaleString()}</td>
                           </tr>
                        ))}
                   </tbody>
               </table>
           </section>
           <section>
               <h2>Trade History</h2>
               <table border={1} cellPadding={6}>
                   <thead>
                       <tr>
                           <th>ID</th>
                           <th>Symbol</th>
                           <th>Side</th>
                           <th>Qty</th>
                           <th>Price</th>
                           <th>Time</th>
                       </tr>
                   </thead>
                   <tbody>
                        {trades.map((t) => (
                           <tr key={t.id}>
                               <td>{t.id}</td>
                               <td>{t.symbol}</td>
                               <td>{t.side}</td>
                               <td>{t.quantity}</td>
                               <td>{t.price}</td>
                               <td>{new Date(t.created_at).toLocaleString()}</td>
                           </tr>
                        ))}
                   </tbody>
               </table>
           </section>
       </div>
    );
}

export default App;