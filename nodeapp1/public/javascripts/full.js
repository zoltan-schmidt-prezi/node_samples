
// Dropdown selection change
function loadPortfolioItem(selected_option, selected_name) {
    color = [chartRandomColor(), chartRandomColor()];
    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        chartAddLabel(chart_full, getDataset(result, 'date'));
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            var calc = calculateOnePortfolio( result, result_portf );
            for (i=0; i<calc.length; i++){
                console.log( getDataset(calc[i], 'calculated') );
                var portfolioDataset = {
                    label: (selected_name + " " + (i+1)),
                    yAxisID: 'B',
                    data: getDataset(calc[i], 'calculated'), //portfolio
                    borderColor: [
                    //'rgba(178, 9, 164, 1)'
                    color[i]
                    ],
                    backgroundColor: color[i],//'rgba(178, 9, 164, 1)',
                    borderWidth: 1,
                    fill: false,
                    lineTension: 0
                }
                chartAddDataset(chart_full, portfolioDataset);
            }
        });
    });
};
