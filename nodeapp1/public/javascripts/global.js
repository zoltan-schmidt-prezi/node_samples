// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the rate table on initial page load
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();

    renderChart();
});

// Dropdown selection change
$('#sel_name').change(function() {
    populateMysqlTable( $(this).find('option:selected').attr('value') );
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
        $.each(data, function(){
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
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

}
