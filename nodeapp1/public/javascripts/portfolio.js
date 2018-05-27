var fromdate_pf = '2018-03-14';

// DOM Ready =============================================================

$(document).ready(function() {

    //Init 5 portf charts
/*    for(i=0; i<2; i++){
        ctx_portf_arr.push(document.getElementById("myPortfolio"+i));
        chart_pf_single.push(chartInit(ctx_portf_arr[i]));
        chartSetTitle(chart_pf_single[i], "Please select a bond");
    }*/
    document.getElementById("fromdate_p").value = fromdate_pf;
});

// Functions =============================================================

// Date picker selection change
document.getElementById("fromdate_p").onchange = function(){
    var event_p = new Event('change');
    document.getElementById("sel_portf").dispatchEvent(event_p);
}

// Dropdown selection change
$('#sel_portf').change(function() {
    //Get fromdate
    let fromdate = getSelectedDate("fromdate_p");

    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get the name of the selected bond in the dropdown
    let selected_name = $(this).find('option:selected').text();

    removeCharts("wrapper_pf");

    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option, fromdate ).then( function(result) {
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            if(result_portf == 0) {
                insertNoData("wrapper_pf", "No portfolio found!");
            }
            else {
                var ctx_portf_arr = [];
                var chart_pf_single = [];
                for(i=0; i<result_portf.length; i++) {
                    let ins = insertChart("wrapper_pf", i);
                    ctx_portf_arr.push(ins);
                    chart_pf_single.push(chartInit(ctx_portf_arr[i]));
                    chartSetTitle(chart_pf_single[i], "Please select a bond");
                }
                var calc = calculateOnePortfolioPerBond( result, result_portf );
                for (i=0; i<calc.length; i++){
                    labels = getDataset(result, 'date');
                    chartAddLabel(chart_pf_single[i], labels);
                    chartSetTitle(chart_pf_single[i], selected_name);

                    //Add current bond
                    var portfolioDataset = {
                        label: 'Portfolio ' + (i + 1),
                        yAxisID: 'B',
                        data: getDataset(calc[i], 'calculated'), //portfolio
                        borderColor: [
                        'rgba(178, 9, 164, 1)'
                        ],
                        backgroundColor: 'rgba(178, 9, 164, 1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        fill: false,
                        lineTension: 0
                    }
                    chartAddDataset(chart_pf_single[i], portfolioDataset);

                    //Add baseline for current bond
                    let baseline = new Array(labels.length);
                    baseline.fill(result_portf[i].cost);
                    
                    var baselineDataset = {
                        label: 'Baseline ' + (i + 1),
                        yAxisID: 'B',
                        data: baseline,
                        borderColor: [
                        'rgba(30,255,30,1)'
                        ],
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                        pointHitRadius: 10
                    }
                    chartAddDataset(chart_pf_single[i], baselineDataset);
                }
            }
        });
    });
});


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
