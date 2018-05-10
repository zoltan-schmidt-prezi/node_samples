function chartInit(ctx){

    let default_content = {
        type: 'line',
        data: {
            labels: ''
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            year: 'YYYY'
//                            day: 'MMM D'
                        }
                    }
                }],
                yAxes: [{
                    id: 'A',
                    ticks: {
                        beginAtZero:false
                    },
                    position: 'left'
                },{
                    id: 'B',
                    position: 'right'
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(100, 100, 100)',
                }
            }
        }
    }

    let ratesChart = new Chart(ctx, default_content);
    return ratesChart;
}

function chartAddLabel(chart, label) {
    chart.data.labels = label;
}

function chartAddDataset(chart, data) {
    chart.data.datasets.push(data);
    chart.update();
}

function chartResetData(chart) {
    chart.data.labels.pop();
    while (chart.data.datasets.length > 0) {
        chart.data.datasets.pop();
    }
    chart.update();
}

