// Rate data array for filling in info box
var rateListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    populateMysqlTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/rates', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.id + '</td>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.rate + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML
        // table
        $('#rateList table tbody').html(tableContent);
    });
};

function populateMysqlTable() {
    var mtableContent = '';

    $.getJSON( '/mysqlrates', function( data ) {
        $each(data, fucntion(){
            mtableContent += '<tr>';
            mtableContent += '<td>' + this.id '</td>';
            mtableContent += '<td>' + this.name '</td>';
            mtableContent += '<td>' + this.rate '</td>';
            mtableContent += '</tr>';
        });
        $('#mysqlRateList table tbody').html(mtableContent);
    });
};
