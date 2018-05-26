var chart_pf_collections;
var pf_sum = {'date': '', 'calculated': 0};
var collection_sum = [];

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
            fetchOnePortfolioOnDate(date);
        });
    });
});

// Functions =============================================================

function fetchOnePortfolioOnDate(pfdate){
    getPortfolioForDate(pfdate).then(function(result_portf_d){
        let color = chartRandomColor();
        result_portf_d.forEach(function(element) {
            getOneBondDataFromServer( element.id ).then(function(result){

                chartAddLabel(chart_pf_collections, getDataset(result, 'date'));
                let calc = calculateOnePortfolioPerDate( result, element );
                    
                let portfolioDataset = {
                    label: result[0].name,
                    yAxisID: 'B',
                    data: getDataset(calc, 'calculated'), //portfolio
                    borderColor: [
                        color
                    ],
                    backgroundColor: color,
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false,
                    lineTension: 0
                }
                chartAddDataset(chart_pf_collections, portfolioDataset);

                //Calculate Current Value
                let currval = calculateOnePortfolioCurrentValue(result, element);
                pf_sum.calculated += currval.calculated;
                pf_sum.date = currval.date
                populateCollectionTable(pf_sum);

                //Calculate historical data
                temp = calculateAllPortfolioValue(calc, collection_sum);
                collection_sum = temp;
                console.log(collection_sum);
                //populateCollectionHistoryTable(collection_sum);
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

function calculateOnePortfolioCurrentValue( rateData, portfolioData ){
    return {"date": rateData[rateData.length - 1].date,
            "calculated": portfolioData.quantity * rateData[rateData.length - 1].rate};
}

function calculateAllPortfolioValue( oneDataset, sum ){
    for(i=0;i<oneDataset.length;i++){
        if(sum[i] === undefined){
            sum[i] = {'date': oneDataset[i].date, 'calculated': oneDataset[i].calculated};
        }
        else {
            if(oneDataset[i].calculated === undefined){}
            else {
                sum[i].calculated += oneDataset[i].calculated;
            }
        }
    }
    return sum;
}

function populateCollectionTable( collectionTotalValue ) {
    let mtableContent = '';
    
    //Fill table with data

        mtableContent += '<tr>';
        mtableContent += '<td>' + collectionTotalValue.date.split('T')[0] + '</td>';
        mtableContent += '<td>' + precisionRound(collectionTotalValue.calculated, 2) + ' HUF' + '</td>';
        mtableContent += '</tr>';
    $('#collectionsumtable table tbody').html(mtableContent);
}

function populateCollectionHistoryTable( collectionHistoryValue ){

    let mtableContent = $('#collectionhistorytable table tbody').innerHTML;
    
    //Fill table with data

        mtableContent += '<tr>';
        mtableContent += '<td>' + collectionHistoryValue.date.split('T')[0] + '</td>';
        mtableContent += '<td>' + precisionRound(collectionHistoryValue.calculated, 2) + ' HUF' + '</td>';
        mtableContent += '</tr>';
    $('#collectionhistorytable table tbody').html(mtableContent);
}
