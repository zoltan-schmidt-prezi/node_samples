
// Dropdown selection change
$('#sel_portf').change(function() {
    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get the name of the selected bond in the dropdown
    let selected_name = $(this).find('option:selected').text();

    for(i=0; i<5; i++){
        chartResetData(charts_portf[i]);
    }

    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            var calc = calculateOnePortfolio( result, result_portf );
            for (i=0; i<calc.length; i++){
                chartAddLabel(charts_portf[i], getDataset(result, 'date'));
                chartSetTitle(charts_portf[i], selected_name);
                
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
                chartAddDataset(charts_portf[i], portfolioDataset);
            }
        });
    });
});
