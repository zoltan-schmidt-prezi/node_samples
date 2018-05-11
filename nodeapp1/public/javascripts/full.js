
// Dropdown selection change
function loadPortfolioItem(selected_option) {

    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        console.log(result);
/*        chartAddLabel(chart_full, getDataset(result, 'date'));
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            var calc = calculateOnePortfolio( result, result_portf );
            for (i=0; i<calc.length; i++){
                
                console.log( getDataset(calc[i], 'calculated') );

                var portfolioDataset = {
                    label: 'Portfolio ' + (i + 1),
                    yAxisID: 'B',
                    data: getDataset(calc[i], 'calculated'), //portfolio
                    borderColor: [
                    'rgba(178, 9, 164, 1)'
                    ],
                    backgroundColor: 'rgba(178, 9, 164, 1)',
                    borderWidth: 1,
                    fill: false,
                    lineTension: 0
                }
                chartAddDataset(chart_full, portfolioDataset);
            }
        });*/
    });
};
