
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
                    position: 'left',
		    display: false
                },{
                    id: 'B',
                    position: 'right'
                }]
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'rgb(100, 100, 100)',
                    usePointStyle: true
                }
            },
            tooltips: {
                mode: 'label'
            }
        }
    }

    let ratesChart = new Chart(ctx, default_content);
    return ratesChart;
}

function chartSetTitle(chart, title) {
    chart.options.title.display = 'true';
    chart.options.title.text = title;
    chart.update();
}

function chartAddLabel(chart, label) {
    chart.data.labels = label;
}

function chartAddDataset(chart, data) {
    chart.data.datasets.push(data);
    chart.update();
}

function chartUpdateStacked(chart) {
    chart.options.scales.yAxes[1].stacked = 'true';
    chart.update();
}

function chartRandomColor() {
    let r = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    color = 'rgb(' + r + ',' + b + ',' + g + ')';
    return color;
}

function chartResetData(chart) {
    chart.data.labels.pop();
    while (chart.data.datasets.length > 0) {
        chart.data.datasets.pop();
    }
    chart.update();
}

