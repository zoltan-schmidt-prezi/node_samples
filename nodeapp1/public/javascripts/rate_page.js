var chart_rates;

// DOM Ready =============================================================

$(document).ready(function() {

    // Populate the dropdown list on initial page load
    hideContent("wrapper");
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

    // Init exchange charts on page
    var ctx = document.getElementById("myChart");
    chart_rates = chartInit(ctx);
    chartSetTitle(chart_rates, "Please select a bond");

});

// Functions =============================================================

// Dropdown selection change
$('#sel_name').change(function() {
    //Get the id of the selected bond in the dropdown
    let selected_option =  $(this).find('option:selected').attr('value');

    //Get the name of the selected bond in the dropdown
    let selected_name = $(this).find('option:selected').text();
    chartSetTitle(chart_rates, selected_name);
    
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
        chartResetData(chart_rates);
        chartAddLabel(chart_rates, getDataset(result, 'date'));
        chartAddDataset(chart_rates, rateDataset);
    });
    showContent("wrapper");
});


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
