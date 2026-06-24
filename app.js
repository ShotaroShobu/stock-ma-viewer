let chart = null;

function movingAverage(values, period)
{
    const result = [];

    for(let i = 0; i < values.length; i++)
    {
        if(i < period - 1)
        {
            result.push(null);
            continue;
        }

        let sum = 0;

        for(let j = i - period + 1; j <= i; j++)
        {
            sum += values[j];
        }

        result.push(sum / period);
    }

    return result;
}

async function loadData()
{
    const ticker =
        document.getElementById("ticker").value;

    const url =
        `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=5y&interval=1d`;

    const response =
        await fetch(url);

    const json =
        await response.json();

    const result =
        json.chart.result[0];

    const timestamps =
        result.timestamp;

    const closes =
        result.indicators.quote[0].close;

    const labels =
        timestamps.map(
            t => new Date(t * 1000)
                    .toISOString()
                    .substring(0,10)
        );

    const datasets = [
        {
            label: ticker,
            data: closes,
            borderWidth: 2
        }
    ];

    const maMap =
    {
        10: document.getElementById("ma10"),
        25: document.getElementById("ma25"),
        50: document.getElementById("ma50"),
        100: document.getElementById("ma100"),
        200: document.getElementById("ma200")
    };

    Object.entries(maMap).forEach(
        ([period, checkbox]) =>
        {
            if(checkbox.checked)
            {
                datasets.push(
                {
                    label: `${period}MA`,
                    data: movingAverage(
                        closes,
                        Number(period)
                    ),
                    pointRadius: 0
                });
            }
        }
    );

    if(chart)
    {
        chart.destroy();
    }

    chart = new Chart(
        document.getElementById("chart"),
        {
            type: "line",
            data:
            {
                labels,
                datasets
            }
        }
    );

    const latestPrice =
        closes[closes.length - 1];

    const ma200 =
        movingAverage(closes, 200);

    const latestMA200 =
        ma200[ma200.length - 1];

    const signal =
        latestPrice > latestMA200
        ? "BUY"
        : "SELL";

    document.getElementById("status").innerHTML =
        `
        Current Price : ${latestPrice.toFixed(2)}<br>
        MA200 : ${latestMA200.toFixed(2)}<br>
        Signal : ${signal}
        `;
}

loadData();
