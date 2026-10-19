import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export type Market = "stock" | "crypto";
export interface Trade {
    id: number;
    symbol: string;
    side: "buy" | "sell";
    quantity: number;
    price: number;
    created_at: string;
}

export interface Signal {
    id: number;
    symbol: string;
    prediction: number;
    recommendation: "buy" | "sell" | "hold" | string;
    created_at: string;
}

export async function getTrades(): Promise<Trade[]> {
    const res = await axios.get(`${API_BASE}/trades`);
    return res.data;
}

export async function createTrade(payload: Omit<Trade, "id" | "created_at">) {
    const res = await axios.post(`${API_BASE}/trades`, payload);
    return res.data as Trade;
}

export async function getSignals(symbol?: string): Promise<Signal[]> {
    const res = await axios.get(`${API_BASE}/signals`, {
        params: symbol ? { symbol } : {},
    });
    return res.data;
}

export async function generateSignal(
    symbol: string,
    market: Market
): Promise<Signal> {
    const res = await axios.post(`${API_BASE}/signals`, {
        symbol,
        market,
    });
    return res.data;
}

export async function getLatestPrice(symbol: string, market: Market) {
    const res = await axios.get(`${API_BASE}/price`, {
        params: { symbol, market },
    });
    return res.data as { symbol: string; market: Market; price: number };
}