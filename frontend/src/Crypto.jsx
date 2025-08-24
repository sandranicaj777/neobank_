import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  CreditCard,
  User,
  Settings,
  RefreshCcw,
  Search,
  X,
  Coins,
  Bell,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./Dashboard.css";
import "./LightMode.css";
import "./Crypto.css";

const API = "http://localhost:8080";

const DEFAULT_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
];

const SYMBOL_TO_ID = {
  BTC: "bitcoin",
  ETH: "ethereum",
  ADA: "cardano",
  XRP: "ripple",
  DOGE: "dogecoin",
  XLM: "stellar",
  SAROS: "saros-finance",
};

const ID_TO_SYMBOL = {
  BITCOIN: "BTC",
  ETHEREUM: "ETH",
  CARDANO: "ADA",
  RIPPLE: "XRP",
  DOGECOIN: "DOGE",
  SOLANA: "SOL",
  STELLAR: "XLM",
  "SAROS-FINANCE": "SAROS",
};

const normalizeSymbol = (s) =>
  ID_TO_SYMBOL[(s || "").toUpperCase()] || (s || "").toUpperCase();

const FALLBACK_LOGOS = {
  BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  ADA: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  XRP: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
};


const PIE_COLORS = ["#22d3ee", "#60a5fa", "#7c3aed", "#ec4899", "#22c55e"];


export default function Crypto() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const [theme, setTheme] = useState("dark");
  const [watchlist, setWatchlist] = useState(DEFAULT_COINS);
  const [logos, setLogos] = useState({});
  const [fiatBalance, setFiatBalance] = useState(0);
  const [tickers, setTickers] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTimer = useRef();

  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState("BUY");
  const [tradeSymbol, setTradeSymbol] = useState("BTC");
  const [tradeUsd, setTradeUsd] = useState("100");
  const [tradeMsg, setTradeMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const railRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setTheme("light");
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      await Promise.all([loadMe(), loadHoldings(), loadOrders()]);
      await refreshPrices();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const id = setInterval(() => {
      refreshPrices();
    }, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlist, holdings]);

  const loadMe = async () => {
    try {
      const r = await axios.get(`${API}/api/auth/me`, auth);
      setFiatBalance(r.data?.balance ?? 0);
    } catch (e) {
      console.error(e);
    }
  };

  const loadHoldings = async () => {
    try {
      const r = await axios.get(`${API}/api/crypto/me/holdings`, auth);
      const map = {};
      for (const h of r.data || []) {
        const sym = normalizeSymbol(h.symbol);
        const qty = Number(h.quantity || 0);
        map[sym] = (map[sym] || 0) + qty;
      }
      const rows = Object.entries(map).map(([symbol, quantity]) => ({
        symbol,
        quantity,
      }));
      setHoldings(rows);
      setLogos((prev) =>
        rows.reduce(
          (acc, r) => ({
            ...acc,
            [r.symbol]: acc[r.symbol] || FALLBACK_LOGOS[r.symbol],
          }),
          prev
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    try {
      const r = await axios.get(`${API}/api/crypto/me/orders`, auth);
    const arr = (r.data || []).map((o) => ({
        id: o.id,
        symbol: normalizeSymbol(o.symbol),
        side: o.side,
        quantity: Number(o.quantity),
        price: Number(o.price),
        quoteAmount: Number(o.quoteAmount),
        status: o.status,
        createdAt: o.createdAt,
      }));
      setOrders(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
    }
  };

  const refreshPrices = async () => {
    try {
      setLoadingPrices(true);
      const params = new URLSearchParams();
      const idSet = new Set(watchlist.map((c) => c.id));
      holdings.forEach((h) => {
        const id = SYMBOL_TO_ID[h.symbol];
        if (id) idSet.add(id);
      });
      Array.from(idSet).forEach((id) => params.append("symbols", id));

      const r = await axios.get(`${API}/api/crypto/tickers`, { ...auth, params });
      const list = (r.data?.tickers || []).map((t) => ({
        symbol: String(t.symbol || "").toUpperCase(),
        price: Number(t.price),
        change24hPercent: Number(t.change24hPercent),
        high24h: Number(t.high24h),
        low24h: Number(t.low24h),
        image: t.image,
      }));
      setTickers(list);
      setLastUpdated(new Date());

      const next = { ...logos };
      for (const t of list) {
        if (t.image) next[t.symbol] = t.image;
      }
      for (const c of watchlist) {
        if (!next[c.symbol] && FALLBACK_LOGOS[c.symbol])
          next[c.symbol] = FALLBACK_LOGOS[c.symbol];
      }
      setLogos(next);
    } catch (e) {
      console.error("tickers failed", e);
      setTickers([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  const priceBy = useMemo(
    () => Object.fromEntries(tickers.map((t) => [t.symbol, t.price])),
    [tickers]
  );

  const analytics = useMemo(() => {
    const avgCost = {};
    const position = {};
    for (const o of [...orders].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )) {
      const s = o.symbol;
      position[s] = position[s] || 0;
      avgCost[s] = avgCost[s] || 0;
      if (o.side === "BUY") {
        const newQty = position[s] + o.quantity;
        const newCost =
          (position[s] * avgCost[s] + o.quoteAmount) / (newQty || 1);
        position[s] = newQty;
        avgCost[s] = newCost;
      } else if (o.side === "SELL") {
        position[s] = Math.max(0, position[s] - o.quantity);
        if (position[s] === 0) avgCost[s] = 0;
      }
    }

    const rows = holdings.map((h) => {
      const s = h.symbol;
      const qty = Number(h.quantity || 0);
      const cp = priceBy[s] ?? 0;
      const ac = avgCost[s] ?? 0;
      const mv = qty * cp;
      const upl = (cp - ac) * qty;
      const uplPct = ac > 0 ? ((cp - ac) / ac) * 100 : 0;
      return {
        symbol: s,
        qty,
        avgCost: ac,
        currentPrice: cp,
        marketValue: mv,
        upl,
        uplPct,
      };
    });

    const totalMV = rows.reduce((a, b) => a + b.marketValue, 0);
    const totalCost = rows.reduce((a, b) => a + b.avgCost * b.qty, 0);
    const totalUPL = totalMV - totalCost;
    const totalUPLPct = totalCost > 0 ? (totalUPL / totalCost) * 100 : 0;

    return { rows, totalMV, totalUPL, totalUPLPct };
  }, [holdings, orders, priceBy]);

  const totalPortfolioValue = useMemo(
    () => fiatBalance + analytics.totalMV,
    [fiatBalance, analytics.totalMV]
  );

  const pieData = useMemo(() => {
    const arr = holdings
      .map((h) => ({
        name: h.symbol,
        value: (priceBy[h.symbol] || 0) * Number(h.quantity || 0),
      }))
      .filter((x) => x.value > 0);
    const total = arr.reduce((a, b) => a + b.value, 0) || 1;
    return arr.map((x) => ({ ...x, pct: (x.value / total) * 100 }));
  }, [holdings, priceBy]);

  const fmt = (n, d = 2) =>
    n === null || n === undefined
      ? "-"
      : Number(n).toLocaleString(undefined, { maximumFractionDigits: d });
  const changeClass = (n) => (Number(n) >= 0 ? "pos" : "neg");

  const openTrade = (symbol, side) => {
    setTradeSymbol(symbol);
    setTradeSide(side);
    setTradeUsd("100");
    setTradeMsg("");
    setTradeOpen(true);
  };

  const submitTrade = async () => {
    if (!tradeSymbol) return;
    const usd = parseFloat(tradeUsd);
    if (!(usd > 0)) {
      setTradeMsg("Enter an amount greater than 0");
      return;
    }
    if (usd < 0.01) {
      setTradeMsg("Minimum is $0.01");
      return;
    }
    const coinFromWatch = watchlist.find((c) => c.symbol === tradeSymbol);
    const symbolId =
      coinFromWatch?.id || SYMBOL_TO_ID[tradeSymbol] || tradeSymbol.toLowerCase();

    try {
      setSubmitting(true);
      setTradeMsg("");
      const r = await axios.post(
        `${API}/api/crypto/order`,
        { symbol: symbolId, side: tradeSide, quoteAmount: usd },
        auth
      );
      setTradeMsg(
        `${tradeSide} filled: ${r.data.quantity} ${r.data.symbol} @ $${fmt(
          r.data.price,
          2
        )}`
      );
      await Promise.all([loadMe(), loadHoldings(), loadOrders()]);
      await refreshPrices();
    } catch (e) {
      const m = e?.response?.data?.message || e?.message || "Order failed";
      setTradeMsg(m);
    } finally {
      setSubmitting(false);
    }
  };

  const runSearch = (val) => {
    const q = val;
    setSearchText(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      try {
        setSearchOpen(true);
        const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(
          q.trim()
        )}`;
        const r = await axios.get(url);
        const coins = (r.data?.coins || []).slice(0, 10).map((c) => ({
          id: c.id,
          symbol: (c.symbol || "").toUpperCase(),
          name: c.name,
          logo: c.large || c.thumb,
        }));
        setSearchResults(coins);
      } catch (e) {
        console.error("search failed", e);
        setSearchResults([]);
      }
    }, 250);
  };

  const pickSearchCoin = (coin) => {
    setWatchlist([{ id: coin.id, symbol: coin.symbol, name: coin.name }]);
    setLogos((prev) => ({ ...prev, [coin.symbol]: coin.logo }));
    setSearchOpen(false);
    setSearchText(coin.name);
    refreshPrices();
  };

  const resetWatchlist = () => {
    setWatchlist(DEFAULT_COINS);
    setSearchText("");
    setSearchResults([]);
    setSearchOpen(false);
    refreshPrices();
  };

  const CoinCard = ({ c }) => {
    const t = tickers.find((x) => x.symbol === c.symbol);
    const supported = Boolean(t);
    const price = t?.price ?? 0;
    const chg = t?.change24hPercent ?? 0;
    const imgFromTicker = t?.image;
    const logoUrl =
      imgFromTicker || logos[c.symbol] || FALLBACK_LOGOS[c.symbol] || "/coin.svg";
    return (
      <div className={`coin-card ${!supported ? "dim" : ""}`}>
        <div className="coin-head">
          <img
            className="coin-logo"
            src={logoUrl}
            alt={c.symbol}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/coin.svg";
            }}
          />
          <div className="coin-sym">
            <div className="coin-sym-top">{c.symbol}</div>
            <div className="coin-name">{c.name}</div>
          </div>
        </div>
        <div className="coin-price">${fmt(price, 2)}</div>
        <div className={`coin-chg ${changeClass(chg)}`}>
          {chg >= 0 ? "+" : ""}
          {fmt(chg, 2)}% Today
        </div>
        <div className="trade-actions">
          <div className="btn-row">
            <button
              className="btn buy"
              disabled={!supported}
              onClick={() => openTrade(c.symbol, "BUY")}
            >
              Buy
            </button>
            <button
              className="btn sell"
              disabled={!supported}
              onClick={() => openTrade(c.symbol, "SELL")}
            >
              Sell
            </button>
          </div>
          {!supported && (
            <div className="hint" style={{ marginTop: 6, opacity: 0.7 }}>
              Not supported
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`dashboard ${theme === "light" ? "light-mode" : ""}`}>
      <aside className="sidebar">
        <img
          src={theme === "light" ? "/DarkModeLogo.png" : "/logo.png"}
          alt="NeoBank Logo"
          className="sidebar-logo-img"
        />
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">
              <Home className="icon" /> Overview
            </Link>
          </li>
          <li>
            <Link to="/transactions">
              <CreditCard className="icon" /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/account">
              <User className="icon" /> Account
            </Link>
          </li>
          <li className="active">
            <Link to="/crypto">
              <Coins className="icon" /> Crypto
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <Settings className="icon" /> Settings
            </Link>
          </li>
        </ul>
      </aside>

      <div className="main">
        <header className="header">
          <div className="header-right">
            <Bell className="notif-icon" />
          </div>
        </header>

        <main className="content">
          <div className="content-box crypto-box">
            <h2 className="screen-title">Crypto</h2>

            <div className="search-bar">
              <div
                className="search-input-wrap"
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              >
                <Search size={16} className="search-icon" />
                <input
                  className="search-input"
                  value={searchText}
                  onChange={(e) => runSearch(e.target.value)}
                  placeholder="Search coin (e.g., Bitcoin, ETH, XRP)"
                  onFocus={() => searchText && setSearchOpen(true)}
                />
                {searchText && (
                  <button
                    className="btn icon-btn"
                    onClick={resetWatchlist}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                {searchOpen && searchResults.length > 0 && (
                  <div className="search-dropdown">
                    {searchResults.map((r) => (
                      <button
                        key={r.id}
                        className="search-item"
                        onMouseDown={() => pickSearchCoin(r)}
                      >
                        <img
                          src={r.logo || "/coin.svg"}
                          alt={r.symbol}
                          className="search-logo"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/coin.svg";
                          }}
                        />
                        <div className="search-meta">
                          <div className="search-name">{r.name}</div>
                          <div className="search-sym">{r.symbol}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="updated-pill">
                <button
                  className="btn ghost small"
                  onClick={refreshPrices}
                  disabled={loadingPrices}
                >
                  <RefreshCcw size={14} /> {loadingPrices ? "Refreshing" : "Refresh"}
                </button>
                <span className="muted">
                  {lastUpdated
                    ? `Updated ${Math.max(
                        1,
                        Math.round((new Date() - lastUpdated) / 1000)
                      )}s ago`
                    : ""}
                </span>
              </div>
            </div>

            <div className="section-title">Market</div>
            <div className="carousel-wrap">
              <div className="cards rail five" ref={railRef}>
                {watchlist.map((c) => (
                  <div key={c.symbol} className="card-slot">
                    <CoinCard c={c} />
                  </div>
                ))}
                {watchlist.length === 0 && (
                  <div className="empty-card">
                    <p>No coins yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid-3">
              <div className="panel">
                <div className="panel-title">Portfolio</div>
                {pieData.length > 0 ? (
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={2}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="legend">
                      {pieData.map((p, i) => (
                        <div key={i} className="legend-item">
                          <span
                            className="dot"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          {p.name} {fmt(p.pct, 1)}%
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty">No holdings yet</div>
                )}
              </div>

              <div className="panel kpi">
                <div className="panel-title">Total Value</div>
                <div className="big">${fmt(totalPortfolioValue, 2)}</div>
                <div className={`kpi-chg ${changeClass(analytics.totalUPLPct)}`}>
                  {fmt(analytics.totalUPLPct, 2)} %
                </div>
                <div className="hint">Cash + crypto value</div>
              </div>

              <div className="panel kpi">
                <div className="panel-title">Total P/L</div>
                <div className="big">${fmt(analytics.totalUPL, 2)}</div>
                <div className={`kpi-chg ${changeClass(analytics.totalUPLPct)}`}>
                  {(analytics.totalUPLPct >= 0 ? "+" : "") +
                    fmt(analytics.totalUPLPct, 2)}
                  %
                </div>
                <div className="hint">Unrealized (WAC)</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Holdings</div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Quantity</th>
                      <th>Avg. Price</th>
                      <th>Current Price</th>
                      <th>Market Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.rows.map((r) => (
                      <tr key={r.symbol}>
                        <td className="sym">
                          <img
                            className="coin-logo"
                            src={logos[r.symbol] || FALLBACK_LOGOS[r.symbol] || "/coin.svg"}
                            alt={r.symbol}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/coin.svg";
                            }}
                          />
                          {r.symbol}
                        </td>
                        <td>{fmt(r.qty, 8)}</td>
                        <td>${fmt(r.avgCost, 2)}</td>
                        <td>${fmt(r.currentPrice, 2)}</td>
                        <td>${fmt(r.marketValue, 2)}</td>
                      </tr>
                    ))}
                    {analytics.rows.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty">
                          No positions
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">Order History</div>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Side</th>
                      <th>Symbol</th>
                      <th>Qty</th>
                      <th>USD Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                        <td>{o.side}</td>
                        <td>{o.symbol}</td>
                        <td>{fmt(o.quantity, 8)}</td>
                        <td>${fmt(o.quoteAmount, 2)}</td>
                        <td>{o.status}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {tradeOpen && (
        <div className="modal-backdrop" onClick={() => setTradeOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-title ${tradeSide === "BUY" ? "buy" : "sell"}`}>
              {tradeSide} {tradeSymbol}
            </div>
            <div className="modal-body">
              <label className="field-label">Amount (USD)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={tradeUsd}
                onChange={(e) => setTradeUsd(e.target.value)}
                className="field-input"
              />
              <div className="quick-row">
                {[100, 250, 500, 1000].map((amt) => (
                  <button key={amt} className="chip" onClick={() => setTradeUsd(String(amt))}>
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="estimates">
                <div>
                  <span className="muted">Est. Price</span>
                  <div>${fmt(priceBy[tradeSymbol], 2)}</div>
                </div>
                <div>
                  <span className="muted">Est. Qty</span>
                  <div>
                    {fmt(
                      (Number(tradeUsd || 0) / (priceBy[tradeSymbol] || 1)) || 0,
                      8
                    )}{" "}
                    {tradeSymbol}
                  </div>
                </div>
              </div>

              {tradeMsg && <div className="trade-msg" style={{ marginTop: 8 }}>{tradeMsg}</div>}
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setTradeOpen(false)}>
                Close
              </button>
              <button
                className={`btn ${tradeSide === "BUY" ? "buy" : "sell"}`}
                onClick={submitTrade}
                disabled={submitting}
              >
                {submitting ? "Placing..." : `${tradeSide}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
