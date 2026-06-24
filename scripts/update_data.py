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
    progress=False
)

if df.empty:
    print(f"{ticker}: no data")
    continue

df.reset_index(inplace=True)

output_file = OUTPUT_DIR / f"{ticker}.json"

df.to_json(
    output_file,
    orient="records",
    date_format="iso"
)

print(f"saved {output_file}")

