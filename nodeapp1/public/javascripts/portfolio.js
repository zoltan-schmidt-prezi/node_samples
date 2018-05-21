var chart_pf_single = [];

// DOM Ready =============================================================

$(document).ready(function() {

    //Init 5 portf charts
    var ctx_portf_arr = [];
    for(i=0; i<5; i++){
        ctx_portf_arr.push(document.getElementById("myPortfolio"+i));
        chart_pf_single.push(chartInit(ctx_portf_arr[i]));
        chartSetTitle(chart_pf_single[i], "Please select a bond");
    }
});

// Functions =============================================================

// Dropdown selection change
$('#sel_portf').change(function() {
    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get the name of the selected bond in the dropdown
    let selected_name = $(this).find('option:selected').text();

    for(i=0; i<5; i++){
        chartResetData(chart_pf_single[i]);
    }

    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            var calc = calculateOnePortfolioPerBond( result, result_portf );
            console.log( result_portf );
            for (i=0; i<calc.length; i++){
                labels = getDataset(result, 'date');
                chartAddLabel(chart_pf_single[i], labels);
                chartSetTitle(chart_pf_single[i], selected_name);

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
                chartAddDataset(chart_pf_single[i], portfolioDataset);
                let baseline = new Array(labels.length);
                baseline.fill(result_portf[i].cost);
                console.log(baseline);
                
                var baselineDataset = {
                    label: 'Baseline ' + (i + 1),
                    yAxisID: 'B',
                    data: baseline,
                    borderColor: [
                    'rgba(30,255,30,1)'
                    ],
                    backgroundColor: 'rgba(30,255,30,1)',
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 0,
                    lineTension: 0
                }
                chartAddDataset(chart_pf_single[i], baselineDataset);
            }
        });
    });
});

function getOnePortfolioDataFromServer( bond_selected_ID ) {
    let promise = new Promise((resolve, reject) => {
        $.getJSON( 'portfolio/' + bond_selected_ID, function( data ) {
            queryPortfolioSeriesData = [];
            $.each(data, function(){
                //get and store data
                singlePortfolioJSON = {
                    "id": this.id,
                    "buydate": this.buydate,
                    "quantity": this.quantity,
                    "costperbond": this.costperbond,
                    "cost": this.cost
                };
                queryPortfolioSeriesData.push(singlePortfolioJSON);
            });
            resolve(queryPortfolioSeriesData);
        });
    });
    return promise;
}

function calculateOnePortfolioPerBond( rateData, portfolioData ){
    var portfolioDataset = []
    var singlePortfolioDataset = []
    if (portfolioData.length == 0){
       return portfolioDataset;
    }
    else {
        // Iterate over all every portfolio item for a single bond
        for (pf=0; pf<portfolioData.length; pf++){
            //Calculate value for every date after buydate
            for (i=0; i<rateData.length; i++){
                if (portfolioData[pf].buydate > rateData[i].date){
                    singlePortfolioDataset.push({"date": rateData[i].date, "calcualted": null});
                }
                else {
                    singlePortfolioDataset.push({"date": rateData[i].date, "calculated": portfolioData[pf].quantity * rateData[i].rate});
                }
            }
            portfolioDataset.push(singlePortfolioDataset);
            singlePortfolioDataset = [];
        }
        return portfolioDataset;
    }
}
