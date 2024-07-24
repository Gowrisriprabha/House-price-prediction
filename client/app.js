function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    var sqft = document.getElementById("uiSqft").value;
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations").value;

    var payload = {
        total_sqft: parseFloat(sqft),
        location: location,
        bhk: bhk,
        bath: bathrooms
    };

    console.log("Sending payload:", payload);

    $.ajax({
        url: "http://127.0.0.1:5000/predict_home_price",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function(data) {
            console.log("Response data:", data);
            if (data.estimated_price) {
                document.getElementById("uiEstimatedPrice").innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
            } else {
                document.getElementById("uiEstimatedPrice").innerHTML = "<h2>Error estimating price</h2>";
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Request failed:", textStatus, errorThrown);
            console.log("Response Text:", jqXHR.responseText);
            document.getElementById("uiEstimatedPrice").innerHTML = "<h2>Error estimating</h2>";
        }
    });
}


function onPageLoad() {
    console.log("Document loaded");
    var url = "http://127.0.0.1:5000/get_location_names";
    $.get(url, function(data, status) {
        console.log("Got response for get_location_names request");
        if (data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;
