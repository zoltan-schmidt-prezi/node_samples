var queryDataDate = new Array();
var queryDataRate = new Array();

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the rate table on initial page load
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

});

// Dropdown selection change
$('#sel_name').change(function() {
    populateMysqlTable( $(this).find('option:selected').attr('value') );
    renderChart();
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

// Fill table with data
function populateMysqlTable( bond_selected ) {
    var mtableContent = '';
    var tableTitle = '';

    $.getJSON( '/mysqlrates/' + bond_selected, function( data ) {
        queryDataDate = [];
        queryDataRate = [];
        $.each(data, function(){

            queryDataDate.push(this.date);
            queryDataRate.push(this.rate);

            tableTitle = this.name;
            mtableContent += '<tr>';
            mtableContent += '<td>' + this.date + '</td>';
            mtableContent += '<td>' + this.rate + '</td>';
            mtableContent += '<td>' + this.currency + '</td>';
            mtableContent += '</tr>';
        });
        $('#mysqlRateList table tbody').html(mtableContent);
        document.getElementById("tabletitle").textContent = "Rate table & charts for '" + tableTitle + "'";
    });
};

function add_option(select_id, text, id) {
    var select = document.getElementById(select_id);
    select.options[select.options.length] = new Option(text, id);
}

function renderChart(){

console.log(queryDataDate);
console.log(queryDataRate);
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: queryDataDate,//[1500,1600,1700,1750,1800], //date
        datasets: [{
            label: 'exchange rate',
            data: queryDataRate,//[12, 19, 3, 5, 2, 3], //rate
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
