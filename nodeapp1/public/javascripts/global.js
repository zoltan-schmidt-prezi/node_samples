var queryDataDate = new Array();
var queryDataRate = new Array();

console.log("console");

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the rate table on initial page load
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

});

// Dropdown selection change
$('#sel_name').change(function() {
    //populateMysqlTable( $(this).find('option:selected').attr('value') );
    getOneBondDataFromServer( $(this).find('option:selected').attr('value') );
});

// Functions =============================================================

function populateListItems() {
        $.getJSON('/list', function( data ) {
            $.each(data, function(){
                // Add dropdown list options with name and value
                add_option("sel_name", this.name, this.id);
            });
        });
}

function getOneBondDataFromServer( bond_selected_ID ) {
    queryRateSeriesData = [];
    let promise = new Promise((resolve, reject) => {
        $.getJSON( 'mysqlrates/' + bond_selected_ID, function( data ) {
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
            resolve("success");
        });
    });
    promise.then((successMessage) => {
        populateTable(queryRateSeriesData);
        return queryRateSeriesData;
    });
}

// Fill table with data
function populateTable( bond_selected_JSON_array ) {
    var mtableContent = '';
    var tableTitle = '';
    
    //Set table title only once
    tableTitle = bond_selected_JSON_array[0].name;
    document.getElementById("tabletitle").textContent = "Rate table & charts for '" + tableTitle + "'";
    
    //Fill table with data
    for (i=0;i<bond_selected_JSON_array.length;i++) {
        console.log(bond_selected_JSON_array[i].name); 

        mtableContent += '<tr>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].date + '</td>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].rate + '</td>';
        mtableContent += '<td>' + bond_selected_JSON_array[i].currency + '</td>';
        mtableContent += '</tr>';
    }
    $('#mysqlRateList table tbody').html(mtableContent);
    console.log("table populated")
}

function add_option(select_id, text, id) {
    var select = document.getElementById(select_id);
    select.options[select.options.length] = new Option(text, id);
}

function renderChart(){
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: queryDataDate, //date
            datasets: [{
                label: 'exchange rate',
                data: queryDataRate, //rate
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
            }
        }
    });
}

function clearChartData() {
    queryDataDate = [];
    queryDataRate = [];
}
