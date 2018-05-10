var chart;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the dropdown list on initial page load
    hideContent("wrapper");
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();
    var ctx = document.getElementById("myChart");
    chart = chartInit(ctx);
});

// Dropdown selection change
$('#sel_name').change(function() {
    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get all the data related to the selected bond
    getOneBondDataFromServer( selected_option ).then( function(result) {
        //populate the rate table on selection change
        populateTable(result);
        //Generate chart on x=date, y=rate

//TEST TEST TEST
        getOnePortfolioDataFromServer( selected_option ).then( function(result_portf) {
            var calc = calculateOnePortfolio( result, result_portf );
            var rateDataset = {
                label: 'Exchange rate',
                yAxisID: 'A',
                data:  getDataset(result, 'rate'), //rate
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                backgroundColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                fill: false,
                lineTension: 0
            }
            var portfolioDataset = {
                label: 'Portfolio',
                yAxisID: 'B',
                data: getDataset(calc, 'calculated'), //portfolio
                borderColor: [
                'rgba(178, 9, 164, 1)'
                ],
                backgroundColor: 'rgba(178, 9, 164, 1)',
                borderWidth: 1,
                fill: false,
                lineTension: 0
            }

            chartResetData(chart);
            chartAddLabel(chart, getDataset(result, 'date'));
            chartAddDataset(chart, rateDataset);
            chartAddDataset(chart, portfolioDataset);
        });
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
    queryRateSeriesData = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON( 'rates/' + bond_selected_ID, function( data ) {
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
    queryPortfolioSeriesData = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON( 'portfolio/' + bond_selected_ID, function( data ) {
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

function calculateOnePortfolio( rateData, portfolioData ){
    var portfolioDataset = []
    if (portfolioData.length == 0){
       return portfolioDataset;
    }
    else {
        for (i=0; i<rateData.length; i++){
            if (portfolioData[0].buydate <= rateData[i].date){
                portfolioDataset.push({"date": rateData[i].date, "calculated": portfolioData[0].quantity *
    rateData[i].rate});
            }
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
