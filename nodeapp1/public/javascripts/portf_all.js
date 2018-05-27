var fromdate_all_pf = '2018-03-14';
var ctx_pf_all_arr = [];
var chart_pf_all = [];
var canvas_index = 0;

// DOM Ready =============================================================

$(document).ready(function() {
    getValidPortfolios().then( function(list) {
        list.forEach( function(element){
            //Get all the data related to the selected bond
            getOneBondDataFromServer( element.id, fromdate_all_pf ).then( function(result) {
                getOnePortfolioDataFromServer( element.id ).then( function(result_portf) {
                    var calc = calculateOnePortfolioPerBond( result, result_portf );
                    for (i=0; i<calc.length; i++){
                        //init chart
                        let ins = insertChart("wrapper_pf_all", canvas_index);
                        ctx_pf_all_arr.push(ins);
                        chart_pf_all.push(chartInit(ctx_pf_all_arr[canvas_index]));

                        //add datasets
                        labels = getDataset(result, 'date');
                        chartAddLabel(chart_pf_all[canvas_index], labels);
                        chartSetTitle(chart_pf_all[canvas_index], element.name);

                        //Add current bond
                        var portfolioDataset = {
                            label: element.name,
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
                        chartAddDataset(chart_pf_all[canvas_index], portfolioDataset);

                        //Add baseline for current bond
                        let baseline = new Array(labels.length);
                        baseline.fill(result_portf[i].cost);
                        
                        var baselineDataset = {
                            label: 'Baseline for ' + element.name,
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
                        chartAddDataset(chart_pf_all[canvas_index], baselineDataset);
                        canvas_index = canvas_index + 1;                
                    }
                });
            });
        });
    });
});

// Functions =============================================================



function getValidPortfolios() {
    let res = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON('/list_all', function( data) {
            $.each(data, function(){
                res.push(this);
            });
            resolve(res);
        });
    });
    return promise;
}
