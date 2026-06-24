let chart = null;

async function loadTicker(ticker)
{
    const response =
        await fetch(`./data/${ticker}.json`);

    if (!response.ok)
    {
        throw new Error(
            `Failed to load ${ticker}.json`
        );
    }

    return await response.json();
}

function createDataset(label, data)
{
    return {
        label: label,
        data: data,
        pointRadius: 0,
        borderWidth: 1.5
    };
}

async function drawChart()
{
    const ticker =
        document.getElementById("ticker").value;

    const data =
        await loadTicker(ticker);

    const labels =
        data.map(x =>
            x.Date.substring(0, 10)
        );

    const close =
        data.map(x => x.Close);

    const ma10 =
        data.map(x => x.MA10);

    const ma25 =
        data.map(x => x.MA25);

    const ma50 =
        data.map(x => x.MA50);

    const ma100 =
        data.map(x => x.MA100);

    const ma200 =
        data.map(x => x.MA200);

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
                labels: labels,

                datasets:
                [
                    createDataset(
                        "Close",
                        close
                    ),

                    createDataset(
                        "MA10",
                        ma10
                    ),

                    createDataset(
                        "MA25",
                        ma25
                    ),

                    createDataset(
                        "MA50",
                        ma50
                    ),

                    createDataset(
                        "MA100",
                        ma100
                    ),

                    createDataset(
                        "MA200",
                        ma200
                    )
                ]
            },

            options:
            {
                responsive: true,

                interaction:
                {
                    mode: "index",
                    intersect: false
                },

                plugins:
                {
                    legend:
                    {
                        display: true
                    }
                }
            }
        }
    );

    updateSummary(data);
}

function updateSummary(data)
{
    const latest =
        data[data.length - 1];

    const signal =
        latest.Close > latest.MA200
        ? "BUY"
        : "SELL";

    document.getElementById(
        "summary"
    ).innerHTML =
    `
    <b>Close</b>: ${latest.Close.toFixed(2)}
    <br>

    <b>MA200</b>: ${latest.MA200.toFixed(2)}
    <br>

    <b>Signal</b>: ${signal}
    `;
}

document
    .getElementById("loadButton")
    .addEventListener(
        "click",
        drawChart
    );

drawChart();
