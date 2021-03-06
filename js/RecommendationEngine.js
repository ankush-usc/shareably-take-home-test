/* Computation logic: For easy hosting for the take home test, I am adding all the logic in js, or else I wopuld have moved this to server
(like Java Rest Service) and then exposed an API to get the data.*/

var ad_data_obj = {};
/* Below values can be moved to a constants file, for better readability, having it in single file for now, for easy and quick development */

var dates = ["2019-01-25", "2019-01-26", "2019-01-27", "2019-01-28", "2019-01-29", "2019-01-30", "2019-01-31"];
var dateCounter = 0;
var keyCounter = 0;
var adKeys = [];
var totalBudget = 0;
var BucketPerformance = [{ "bucket": "A", "probableProfit": 0 }, { "bucket": "B", "probableProfit": 0 }, { "bucket": "C", "probableProfit": 0 }, { "bucket": "D", "probableProfit": 0 }];
var currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/* Variables for HTML updates */
var colHeaderData = [
    { name: "id", title: "AD-ID" },
    { name: "oldBudget", title: "Old Budget" },
    { name: "ROI", title: "ROI" },
    { name: "clickFactor", title: "Click Factor" },
    { name: "totalPoints", title: "Priority Points Earned" },
    { name: "newBudget", title: "New Budget" },
    { name: "bucketID", title: "BucketID" }
];
var actualFieldNames = ["id", "oldBudget", "ROI", "clickFactor", "totalPoints", "newBudget", "bucketID"];
var dataSet = [];


function getAggregatedData() {
    getCampaignLogs();
}


function computeTotalBudget() {
    adKeys = Object.keys(ad_data_obj);
    getTotalBudget();
}

function getTotalBudget() {
    if (keyCounter >= adKeys.length) {
        compute_ROI_ClickFactor(ad_data_obj);
        return;
    }
    $.ajax({
            type: 'GET',
            url: '../getBudget.php?adID=' + adKeys[keyCounter]
        })
        .done(function(data) {
            jsonData = JSON.parse(data);
            ad_data_obj[adKeys[keyCounter]].oldBudget = jsonData.budget;
            totalBudget += jsonData.budget;
            keyCounter++;
            getTotalBudget();
        })
        .fail(function(data) {
            // show any errors
            console.log(data);
            return null;
        });
}

function getCampaignLogs() {
    if (dateCounter >= dates.length) {
        computeTotalBudget();
        return;
    }
    $.ajax({
            type: 'GET',
            url: '../getData.php?date=' + dates[dateCounter]
        })
        .done(function(data) {
            jsonData = JSON.parse(data);
            for (var i = 0; i < jsonData.length; i++) {
                if (!ad_data_obj.hasOwnProperty(jsonData[i].id)) {
                    ad_data_obj[jsonData[i].id] = { "impressions": 0, "clicks": 0, "revenue": 0, "spend": 0, "ROI": 0, "clickFactor": 0, "id": jsonData[i].id, "totalPoints": 0, "newBudget": 0, "oldBudget": 0, "bucketID": "" };
                }
                ad_data_obj[jsonData[i].id].impressions += (jsonData[i].impressions == undefined ? 0 : jsonData[i].impressions);
                ad_data_obj[jsonData[i].id].clicks += (jsonData[i].clicks == undefined ? 0 : jsonData[i].clicks);
                ad_data_obj[jsonData[i].id].revenue += (jsonData[i].revenue == undefined ? 0 : jsonData[i].revenue);
                ad_data_obj[jsonData[i].id].spend += (jsonData[i].spend == undefined ? 0 : jsonData[i].spend);
            }
            dateCounter++;
            getCampaignLogs();
        })
        .fail(function(data) {
            // show any errors
            console.log(data);
            return null;
        });

}

function compute_ROI_ClickFactor() {
    var keys = Object.keys(ad_data_obj)
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        ad_data_obj[key].ROI = (ad_data_obj[key].revenue - ad_data_obj[key].spend) / ad_data_obj[key].spend;
        ad_data_obj[key].clickFactor = ad_data_obj[key].clicks / ad_data_obj[key].impressions;
    }

    var roi_cf_values = Object.values(ad_data_obj);

    roi_cf_values = sortByKey(roi_cf_values, "ROI");

    /* assign ROI points */
    assignROIPoints(roi_cf_values);

    /* Sort based on click factor and assign points */
    roi_cf_values = sortByKey(roi_cf_values, "clickFactor");

    assignCFPoints(roi_cf_values);

    /* sort based on totalPoints and add the final new budget */
    roi_cf_values = sortByKey(roi_cf_values, "totalPoints");

    roi_cf_values = assignNewBudgetAndUpdateMainJSON(roi_cf_values);
    writeToTable(roi_cf_values);
    drawBucketContributionChart();
}

/* function to sory object in descending order based on submitted key */
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });

}

function drawBucketContributionChart() {
    var chartObject = new Morris.Bar({
        element: 'bar-chart',
        resize: true,
        data: BucketPerformance,
        barColors: ['#3cb44b'],
        xkey: ['bucket'],
        ykeys: ['probableProfit'],
        labels: ['Bucket Contribution'],
        hideHover: true,
        preUnits: '$',
        yLabelFormat: function(y) { return currencyFormat.format(y); },
        behaveLikeLine: true
    });
}

/* click factor has 35% weightage */

function assignCFPoints(roi_cf_values) {
    var total_Ad_count = roi_cf_values.length;

    /* The logic uses needs four buckets - top 25% gets 40 points each, next 50% gets 20 points, and last 25% bucket gets 10 points */
    for (var i = 0; i < total_Ad_count; i++) {
        if (i <= (0.15 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 35;
        }
        else if (i <= (0.30 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 23;
        }
        else if (i <= (0.50 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 18;
        }
        else if (i <= (0.75 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 12;
        }
        else {
            roi_cf_values[i].totalPoints += 8;
        }
    }

    return roi_cf_values;
}

/* ROI has 65% weightage */

function assignROIPoints(roi_cf_values) {
    var total_Ad_count = roi_cf_values.length;

    /* The logic uses needs four buckets - top 25% gets 60 points each, next 50% gets 40 points, and last 25% bucket gets 20 points */
    for (var i = 0; i < total_Ad_count; i++) {
        if (i <= (0.15 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 65;
        }
        else if (i <= (0.30 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 50;
        }
        else if (i <= (0.50 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 35;
        }
        else if (i <= (0.75 * total_Ad_count)) {
            roi_cf_values[i].totalPoints += 25;
        }
        else {
            roi_cf_values[i].totalPoints += 12;
        }
    }

    return roi_cf_values;
}


function assignNewBudgetAndUpdateMainJSON(roi_cf_values) {
    var total_Ad_count = roi_cf_values.length;

    var simulation1_baseObject = JSON.parse(JSON.stringify(roi_cf_values));
    var simulation1_res_json = getBudgetSimulationResults([50, 25, 15, 10], simulation1_baseObject);


    var simulation2_baseObject = JSON.parse(JSON.stringify(roi_cf_values));
    var simulation2_res_json = getBudgetSimulationResults([50, 30, 15, 5], simulation2_baseObject);


    var simulation3_baseObject = JSON.parse(JSON.stringify(roi_cf_values));
    var simulation3_res_json = getBudgetSimulationResults([40, 30, 20, 10], simulation3_baseObject);


    if (simulation1_res_json.predictedProfit >= simulation2_res_json.predictedProfit && simulation1_res_json.predictedProfit >= simulation3_res_json.predictedProfit) {
        $('#p_profit').html("|| [New Budget Probable Profit: $" + simulation1_res_json.predictedProfit.toFixed(2) + "]");
        populateBucketPerformanceObject(simulation1_res_json);
        return simulation1_baseObject;
    }
    else if (simulation2_res_json.predictedProfit >= simulation3_res_json.predictedProfit) {
        $('#p_profit').html("|| [New Budget Probable Profit: $" + simulation2_res_json.predictedProfit.toFixed(2) + "]");
        populateBucketPerformanceObject(simulation2_res_json);
        return simulation2_baseObject;
    }
    else {
        $('#p_profit').html("|| [New Budget Probable Profit: $" + simulation3_res_json.predictedProfit.toFixed(2) + "]");
        populateBucketPerformanceObject(simulation3_res_json)
        return simulation3_baseObject;
    }
}

function populateBucketPerformanceObject(simulation_json) {
    BucketPerformance[0].probableProfit = simulation_json.bucketA;
    BucketPerformance[1].probableProfit = simulation_json.bucketB;
    BucketPerformance[2].probableProfit = simulation_json.bucketC;
    BucketPerformance[3].probableProfit = simulation_json.bucketD;
}

function getBudgetSimulationResults(budgetArray, baseJSON) {
    var total_Ad_count = baseJSON.length;
    var predictedProfit = 0;
    var individualBucketBudget = [];
    var originalProfit = 0;
    var individualBucketsProfits = { "bucketA": 0, "bucketB": 0, "bucketC": 0, "bucketD": 0, "predictedProfit": 0 };
    /* calculate individual budget for each of the campaigns in the buckets */
    individualBucketBudget[0] = ((budgetArray[0] * totalBudget) / 100) / (0.20 * total_Ad_count);
    individualBucketBudget[1] = ((budgetArray[1] * totalBudget) / 100) / (0.30 * total_Ad_count);
    individualBucketBudget[2] = ((budgetArray[2] * totalBudget) / 100) / (0.25 * total_Ad_count);
    individualBucketBudget[3] = ((budgetArray[3] * totalBudget) / 100) / (0.25 * total_Ad_count);;

    for (var i = 0; i < total_Ad_count; i++) {
        originalProfit += baseJSON[i].revenue - baseJSON[i].spend;
        if (i <= (0.20 * total_Ad_count)) {
            baseJSON[i].newBudget = individualBucketBudget[0];
            baseJSON[i].bucketID = "A";
            individualBucketsProfits.bucketA += individualBucketBudget[0] * baseJSON[i].ROI;
            individualBucketsProfits.predictedProfit += individualBucketBudget[0] * baseJSON[i].ROI;
        }
        else if (i <= (0.50 * total_Ad_count)) {
            baseJSON[i].newBudget = individualBucketBudget[1];
            baseJSON[i].bucketID = "B";
            individualBucketsProfits.bucketB += individualBucketBudget[1] * baseJSON[i].ROI;
            individualBucketsProfits.predictedProfit += individualBucketBudget[1] * baseJSON[i].ROI;
        }
        else if (i <= (0.75 * total_Ad_count)) {
            baseJSON[i].newBudget = individualBucketBudget[2];
            baseJSON[i].bucketID = "C";
            individualBucketsProfits.bucketC += individualBucketBudget[2] * baseJSON[i].ROI;
            individualBucketsProfits.predictedProfit += individualBucketBudget[2] * baseJSON[i].ROI;
        }
        else {
            baseJSON[i].newBudget = individualBucketBudget[3];
            baseJSON[i].bucketID = "D";
            individualBucketsProfits.bucketD += individualBucketBudget[3] * baseJSON[i].ROI;
            individualBucketsProfits.predictedProfit += individualBucketBudget[3] * baseJSON[i].ROI;;
        }
    }
    $('#o_profit').html("[Old Profit: $" + originalProfit.toFixed(2) + "]");
    return JSON.parse(JSON.stringify(individualBucketsProfits));
}

$(document).ready(function() {
    getAggregatedData();
});

function writeToTable(tabledata) {
    fieldNames = actualFieldNames;
    dataSet = [];
    for (var y = 0; y < tabledata.length; y++) {
        var elementArray = [];
        for (var i = 0; i < fieldNames.length; i++) {
            if (fieldNames[i].indexOf("newBudget") != -1) {
                elementArray.push("<span class='badge " + getDataPointColor(tabledata[y][fieldNames[i]], tabledata[y]["oldBudget"]) + "'>" + tabledata[y][fieldNames[i]]);
            }
            else if (fieldNames[i].indexOf("ROI") != -1 || fieldNames[i].indexOf("clickFactor") != -1) {
                elementArray.push(tabledata[y][fieldNames[i]].toFixed(3));
            }
            else {
                elementArray.push(tabledata[y][fieldNames[i]]);
            }
        }
        dataSet.push(elementArray);
    }
    logsTable = $('#logsTable').DataTable({
        "destroy": true, // cannot reinitialize , got to delete completely and initialize
        "scrollX": true,
        data: dataSet,
        columns: colHeaderData
    });
    $('#logsTableRefresh').hide();
}

/* Displays new budget with green background if it has increased, grey is its equal and red if it has decreased */

function getDataPointColor(curValue, tarValue) {
    var comparisionResult = parseFloat(curValue, 10) > parseFloat(tarValue, 10);
    if (comparisionResult) {
        return 'bg-green';
    }
    else if (parseFloat(curValue, 10) == parseFloat(tarValue, 10)) {

    }
    else {
        return 'bg-red';
    }
}
