var chart_pf_collections;

// DOM Ready =============================================================

$(document).ready(function() {

    //Init full portfolio chart
    var ctx_full = document.getElementById("myPortfolio");
    chart_pf_collections = chartInit(ctx_full);
    chartSetTitle(chart_pf_collections, "Complete portfolio");
    chartUpdateStacked(chart_pf_collections);    

    //Populate merged portfolio
    getAllPortfolioDates().then( function(dates) {
        dates.forEach(function(date){
            fetchOnePortfolio(date);
        });
    });
});

// Functions =============================================================

function fetchOnePortfolio(pfdate){
    color = chartRandomColor();
    getPortfolioForDate(pfdate).then(function(result_portf_d){
        result_portf_d.forEach(function(element) {
            getOneBondDataFromServer( element.id ).then(function(result){
                chartAddLabel(chart_pf_collections, getDataset(result, 'date'));
                let calc = calculateOnePortfolioPerDate( result, element );
                    
                let portfolioDataset = {
                    label: 'Portfolio ',
                    yAxisID: 'B',
                    data: getDataset(calc, 'calculated'), //portfolio
                    borderColor: [
                        color
                    ],
                    backgroundColor: color,
                    borderWidth: 1,
                    fill: false,
                    lineTension: 0
                }
                chartAddDataset(chart_pf_collections, portfolioDataset);
            });
        });    
    });
}

function getAllPortfolioDates() {
    let res = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON('/count', function( data) {
            $.each(data, function(){
                res.push(this);
            });
            resolve(res);
        });
    });
    return promise;
}

function getPortfolioForDate(pfdate){
    let res = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON('/list/' + pfdate.buydate.split('T')[0], function( data ) {
            $.each(data, function(){
                res.push(this);
            });
            resolve(res);
        });
    });
    return promise;
}

function calculateOnePortfolioPerDate( rateData, portfolioData ){
    singlePortfolioDataset = [];
    for(i=0;i<rateData.length;i++){
        if (portfolioData.buydate > rateData[i].date){
            singlePortfolioDataset.push({"date": rateData[i].date, "calcualted": null});
        }
        else {
            singlePortfolioDataset.push({"date": rateData[i].date, "calculated": portfolioData.quantity * rateData[i].rate});
        }
    }
    return singlePortfolioDataset;
}
