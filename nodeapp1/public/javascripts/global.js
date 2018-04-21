// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the rate table on initial page load
    document.getElementById("tabletitle").textContent = "Rate table & charts";
    populateListItems();
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
            //mtableContent += '<td>' + this.id + '</td>';
            //mtableContent += '<td>' + this.name + '</td>';
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
