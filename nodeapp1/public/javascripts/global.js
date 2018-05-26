
// Functions =============================================================
function precisionRound( number, precision ){
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

// Populate dropdown list items
function populateListItems() {
    $.getJSON('/list', function( data ) {
        $.each(data, function(){
            // Add dropdown list options with name and value
            addOption("sel_name", this.name, this.id);
            addOption("sel_portf", this.name, this.id);
        });
    });
}

function addOption(select_id, text, id) {
    let select = document.getElementById(select_id);
    select.options[select.options.length] = new Option(text, id);
}

function getSelectedDate() {
    return document.getElementById("fromdate").value;
}
function showContent( content ) {
    var x = document.getElementById( content );
    x.style.display = "block";
}

function hideContent( content ) {
    var x = document.getElementById( content );
    x.style.display = "none";
}

function getDataset( bond_selected_JSON_array, dataType ){
    return bond_selected_JSON_array.map( obj => {
        return obj[dataType];
    });
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
