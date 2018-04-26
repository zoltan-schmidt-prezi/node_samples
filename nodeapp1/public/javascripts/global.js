
// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the dropdown list on initial page load
    hideContent("wrapper");
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

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
        renderChart( getDataset(result, 'date'), getDataset(result, 'rate') );
    });
    showContent("wrapper");
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
            resolve(queryRateSeriesData);
        });
    });
    return promise;
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

function renderChart(x_axis, y_axis){
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x_axis, //date
            datasets: [{
                label: 'exchange rate',
                data: y_axis, //rate
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                backgroundColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                fill: false,
                lineTension: 0
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            year: 'YYYY'
//                            day: 'MMM D'
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(100, 100, 100)',
                }
            }
        }
    });
}

