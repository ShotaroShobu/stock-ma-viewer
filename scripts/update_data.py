from pathlib import Path
import pandas as pd
import yfinance as yf

TICKERS = [
    "QQQ",
    "SPY",
    "SOXX",
    "^N225",
]

OUTPUT_DIR = Path("data")
OUTPUT_DIR.mkdir(exist_ok=True)

for ticker in TICKERS:

    print(f"download {ticker}")

    df = yf.download(
        ticker,
        period="10y",
        auto_adjust=True,
        progress=False,
        multi_level_index=False
    )

    if df.empty:
        continue

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)

    df["MA10"] = df["Close"].rolling(10).mean()
    df["MA25"] = df["Close"].rolling(25).mean()
    df["MA50"] = df["Close"].rolling(50).mean()
    df["MA100"] = df["Close"].rolling(100).mean()
    df["MA200"] = df["Close"].rolling(200).mean()

    df.reset_index(inplace=True)

    output_file = OUTPUT_DIR / f"{ticker}.json"

    df.to_json(
        output_file,
        orient="records",
        date_format="iso",
    )

    print(f"saved {output_file}")
