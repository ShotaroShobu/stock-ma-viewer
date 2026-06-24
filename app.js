let chart = null;

async function loadTicker(ticker)
{
    const response = await fetch(`./data/${ticker}.json`);

    if (!response.ok)
    {
        throw new Error(`Cannot load ${ticker}.json`);
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

function addDataset(
    datasets,
    checkboxId,
    label,
    values
)
{
    const checkbox =
        document.getElementById(checkboxId);

    if (checkbox.checked)
    {
        datasets.push(
            createDataset(
                label,
                values
            )
        );
    }
}

function updateSummary(data, ticker)
{
    const latest =
        data[data.length - 1];

    const signal =
        latest.Close > latest.MA200
            ? "BUY"
            : "SELL";

    const diff =
        (
            (latest.Close - latest.MA200)
            / latest.MA200
        ) * 100;

    document.getElementById(
        "summary"
    ).innerHTML =
    `
    <h3>${ticker}</h3>

    <div>
        Close: ${latest.Close.toFixed(2)}
    </div>

    <div>
        MA200: ${latest.MA200.toFixed(2)}
    </div>

    <div>
        Difference: ${diff.toFixed(2)}%
    </div>

    <div>
        Signal:
        <strong>${signal}</strong>
    </div>
    `;
}

async function drawChart()
{
    try
    {
        document.getElementById(
            "status"
        ).innerHTML = "Loading...";

        const ticker =
            document.getElementById(
                "ticker"
            ).value;

        const period =
            document.getElementById(
                "period"
            ).value;

        let data =
            await loadTicker(ticker);

        if (period !== "all")
        {
            data =
                data.slice(
                    -Number(period)
                );
        }

        const labels =
            data.map(
                x => x.Date.substring(0, 10)
            );

        const close =
            data.map(
                x => x.Close
            );

        const ma10 =
            data.map(
                x => x.MA10
            );

        const ma25 =
            data.map(
                x => x.MA25
            );

        const ma50 =
            data.map(
                x => x.MA50
            );

        const ma100 =
            data.map(
                x => x.MA100
            );

        const ma200 =
            data.map(
                x => x.MA200
            );

        const datasets = [];

        datasets.push(
            createDataset(
                "Close",
                close
            )
        );

        addDataset(
            datasets,
            "showMA10",
            "MA10",
            ma10
        );

        addDataset(
            datasets,
            "showMA25",
            "MA25",
            ma25
        );

        addDataset(
            datasets,
            "showMA50",
            "MA50",
            ma50
        );

        addDataset(
            datasets,
            "showMA100",
            "MA100",
            ma100
        );

        addDataset(
            datasets,
            "showMA200",
            "MA200",
            ma200
        );

        if (chart)
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
                    datasets: datasets
                },

                options:
                {
                    responsive: true,

                    interaction:
                    {
                        mode: "index",
                        intersect: false
                    },

                    scales:
                    {
                        x:
                        {
                            ticks:
                            {
                                maxTicksLimit: 12
                            }
                        }
                    },

                    plugins:
                    {
                        legend:
                        {
                            display: true
                        },

                        zoom:
                        {
                            pan:
                            {
                                enabled: true,
                                mode: "x"
                            },

                            zoom:
                            {
                                wheel:
                                {
                                    enabled: true
                                },

                                pinch:
                                {
                                    enabled: true
                                },

                                mode: "x"
                            }
                        }
                    }
                }
            }
        );

        updateSummary(
            data,
            ticker
        );

        document.getElementById(
            "status"
        ).innerHTML = "";
    }
    catch (error)
    {
        console.error(error);

        document.getElementById(
            "status"
        ).innerHTML =
            error.message;
    }
}

document
    .getElementById("loadButton")
    .addEventListener(
        "click",
        drawChart
    );

drawChart();
