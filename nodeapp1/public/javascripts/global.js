var chart;
var chart_full;
var charts_portf = [];


// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the dropdown list on initial page load
    hideContent("wrapper");
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

    // Init exchange charts on page
    var ctx = document.getElementById("myChart");
    chart = chartInit(ctx);
    chartSetTitle(chart, "Please select a bond");

    //Init full portfolio chart
    var ctx_full = document.getElementById("myPortfolio");
    chart_full = chartInit(ctx_full);
    chartSetTitle(chart_full, "Complete portfolio");
    chartUpdateStacked(chart_full);    
    //Init 5 portf charts
    var ctx_portf_arr = [];
    for(i=0; i<5; i++){
        ctx_portf_arr.push(document.getElementById("myPortfolio"+i));
        charts_portf.push(chartInit(ctx_portf_arr[i]));
        chartSetTitle(charts_portf[i], "Please select a bond");
    }
    //Populate merged portfolio
    getAllPortfolioDates().then( function(dates) {
        dates.forEach(function(date){
            fetchOnePortfolio(date);
        });
    });
});

// Dropdown selection change
$('#sel_name').change(function() {
    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get the name of the selected bond in the dropdown
    let selected_name = $(this).find('option:selected').text();
    chartSetTitle(chart, selected_name);
    
    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        //populate the rate table on selection change
        populateTable(result);
        //Generate chart on x=date, y=rate

        var rateDataset = {
            label: 'Exchange rate',
            yAxisID: 'B',
            data:  getDataset(result, 'rate'), //rate
            borderColor: [
                'rgba(255, 159, 64, 1)'
            ],
            backgroundColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            fill: false,
            lineTension: 0
        }
        chartResetData(chart);
        chartAddLabel(chart, getDataset(result, 'date'));
        chartAddDataset(chart, rateDataset);
    });
    showContent("wrapper");
});

// Functions =============================================================

function populateListItems() {
    $.getJSON('/list', function( data ) {
        $.each(data, function(){
            // Add dropdown list options with name and value
            add_option("sel_name", this.name, this.id);
            add_option("sel_portf", this.name, this.id);
        });
    });
}


function fetchOnePortfolio(pfdate){
    color = chartRandomColor();
    getPortfolioForDate(pfdate).then(function(result_portf_d){
        result_portf_d.forEach(function(element) {
            getOneBondDataFromServer( element.id ).then(function(result){
                chartAddLabel(chart_full, getDataset(result, 'date'));
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
                chartAddDataset(chart_full, portfolioDataset);
            });
        });    
    });
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

function showContent( content ) {
    var x = document.getElementById( content );
    x.style.display = "block";
}

function hideContent( content ) {
    var x = document.getElementById( content );
    x.style.display = "none";
}
// Get all data for one bond from Database
function getOneBondDataFromServer( bond_selected_ID ) {
    let promise = new Promise((resolve, reject) => {
        $.getJSON( 'rates/' + bond_selected_ID, function( data ) {
            queryRateSeriesData = [];
            $.each(data, function(){
                //get and store data
                singleRateJSON = {
                    "id": this.id,
                    "name": this.name,
                    "date": this.date,
                    "rate": this.rate,
                    "updated": this.updated,
                    "currency": this.currency,
                    "sum": this.sum
                };
                queryRateSeriesData.push(singleRateJSON);
            });
            resolve(queryRateSeriesData);
        });
    });
    return promise;
}

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

// Fill table with data
function populateTable( bond_selected_JSON_array ) {
    let mtableContent = '';
    
    //Set table title only once
    let = tableTitle = bond_selected_JSON_array[0].name;
    document.getElementById("tabletitle").textContent = "Rate table & charts for '" + tableTitle + "'";
    
    //Fill table with data
    for (i=0;i<bond_selected_JSON_array.length;i++) {

        mtableContent += '<tr>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].date + '</td>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].rate + '</td>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].currency + '</td>';
        mtableContent += '</tr>';
    }
    $('#mysqlRateList table tbody').html(mtableContent);
}

function add_option(select_id, text, id) {
    let select = document.getElementById(select_id);
    select.options[select.options.length] = new Option(text, id);
}

function getDataset( bond_selected_JSON_array, dataType ){
    return bond_selected_JSON_array.map( obj => {
        return obj[dataType];
    });
}
