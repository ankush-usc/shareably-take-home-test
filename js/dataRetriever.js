/* Data fields to display for the table */
var colHeaderData = [
    { name: "id", title: "AD-ID" },
    { name: "impressions", title: "Impressions" },
    { name: "spend", title: "Spend" },
    { name: "revenue", title: "Revenue" },
    { name: "clicks", title: "Clicks" }
];
var actualFieldNames = ["id", "impressions", "spend", "revenue", "clicks"];
var dataSet = [];
var logsTable;

$(document).ready(function() {
    $('#logsTableRefresh').hide();
    getCampaignLogs("2019-01-25");
    $('.select2').select2();

    $('#dateSelection').on('select2:select', function(e) {
        dateUpdated();
    });
});

/* Display campaign records based on selected date */

function dateUpdated() {
    $('#Date').html("Date: " + $('#dateSelection').val());
    getCampaignLogs($('#dateSelection').val());
}

function getCampaignLogs(date) {

    if (date == "") {
        $("#viewAlertDiv").children('div').remove();
        alertMsg = alertDanger.replace("{alert-msg}", "Date required!");
        $("#viewAlertDiv").append(alertMsg);
        return false;
    }
    else {
        $("#viewAlertDiv").children('div').remove();
        $('#logsTableRefresh').show();

        $.ajax({
                type: 'GET',
                url: '../getData.php?date=' + date
            })
            .done(function(data) {
                $('#logsTableRefresh').hide();
                jsonData = JSON.parse(data);
                console.log(jsonData);

                writeToTable(jsonData);
            })
            .fail(function(data) {
                // show any errors
                console.log(data);
                $('#logsTableRefresh').hide();
            });
    }
}

function writeToTable(tabledata) {
    fieldNames = actualFieldNames;
    dataSet = [];
    for (var y = 0; y < tabledata.length; y++) {
        var elementArray = [];
        for (var i = 0; i < fieldNames.length; i++) {
            elementArray.push(tabledata[y][fieldNames[i]]);
        }
        dataSet.push(elementArray);
    }
    logsTable = $('#logsTable').DataTable({
        "destroy": true, // cannot reinitialize , got to delete completely and initialize
        "scrollX": true,
        data: dataSet,
        columns: colHeaderData
    });
}
