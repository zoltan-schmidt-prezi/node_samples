// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the rate table on initial page load
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
                add_option("sel_name", this.name, this.id);
            });
        });
}

// Fill table with data
function populateMysqlTable( bond_selected ) {
    var mtableContent = '';

    $.getJSON( '/mysqlrates/' + bond_selected, function( data ) {
        $.each(data, function(){
            mtableContent += '<tr>';
            mtableContent += '<td>' + this.id + '</td>';
            mtableContent += '<td>' + this.name + '</td>';
            mtableContent += '<td>' + this.rate + '</td>';
            mtableContent += '</tr>';
        });
        $('#mysqlRateList table tbody').html(mtableContent);
    });
};

function add_option(select_id, text, id) {
    var select = document.getElementById(select_id);
    select.options[select.options.length] = new Option(text, id);
}
