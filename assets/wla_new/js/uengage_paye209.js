var outletLatitude;
var outletLongitude;
const radius = 100; 

$( document ).ready(function() {
     outletLatitude = localStorage.getItem('outletLat');
     outletLongitude = localStorage.getItem('outletLong');

    checkLocationPermission()
    document.getElementById('requestLocationBtn').addEventListener('click', function() {
        requestLocationAccess(); // Ask for location permission again when button is clicked
    });

  });
  

  function checkLocationPermission() {
    // Use navigator.permissions.query to check permission status
    navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        if (result.state === 'granted') {
            // If permission is granted, get the user's location
            navigator.geolocation.getCurrentPosition(function(position) {
                var userLatitude = position.coords.latitude;
                var userLongitude = position.coords.longitude;
            
                var distance = calculateDistance(userLatitude, userLongitude, outletLatitude, outletLongitude);
                // if (distance >= 1000) {
                //     console.log("Distance between user and outlet: " + (distance / 1000).toFixed(2) + " km");
                // } else {
                //     console.log("Distance between user and outlet: " + distance.toFixed(2) + " meters");
                // }
                if (distance > radius) { 
                // Show distance on the webpage
                $('#awayKm').html(distance >= 1000 
                    ? `You're ${(distance / 1000).toFixed(2)} km away from this location `
                    : `You're ${distance.toFixed(2)} meters away from this location `);
                $('.away-kms').show();
                }
            });
        } else if (result.state === 'prompt') {
            // If permission is 'prompt', request location access
            requestLocationAccess();
        } else if (result.state === 'denied') {
            // If permission is denied, show the error message
            // $('#contentWarn').show();

            // document.getElementById('errorMessage').style.display = 'block';
            // document.getElementById('requestLocationBtn').style.display = 'block'; // Show button to try again
        }
    }).catch(function(err) {
        console.error("Error checking permission: " + err);
    });
}

// Function to request location permission
function requestLocationAccess() {
    $('.spinner').show();
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // If location is allowed and we have position
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;
          
          
            var distance = calculateDistance(userLatitude, userLongitude, outletLatitude, outletLongitude);
            // if (distance >= 1000) {
            //     console.log("Distance between user and outlet: " + (distance / 1000).toFixed(2) + " km");
            // } else {
            //     console.log("Distance between user and outlet: " + distance.toFixed(2) + " meters");
            // }
            if (distance > radius) { 
            // Show distance on the webpage
            $('#awayKm').html(distance >= 1000 
                ? `You're ${(distance / 1000).toFixed(2)}km away from this location `
                : `You're ${distance.toFixed(2)} meters away from this location `);
            $('.away-kms').show();
            }
            $('.spinner').hide();

            $('#contentWarn').hide();
            $('#formDiv').show();

        },
        function(error) {
            $('.spinner').hide();
            // Handle error if permission is denied
            if (error.code === error.PERMISSION_DENIED) {
                // $('#contentWarn').show();

                alert("Location permission denied. Please enable it for better experience.");
            } else {
                alert("Error occurred while getting location: " + error.message);
            }
        }
    );
}
// Function to calculate distance between two lat-lon pairs using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const phi1 = lat1 * Math.PI / 180; // Convert degrees to radians
    const phi2 = lat2 * Math.PI / 180; // Convert degrees to radians
    const deltaPhi = (lat2 - lat1) * Math.PI / 180; // Difference in latitudes
    const deltaLambda = (lon2 - lon1) * Math.PI / 180; // Difference in longitudes

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
}

// Function to check if user is within 100m radius of outlet
function isUserWithinRadius(userLat, userLon, outletLat, outletLon, radius) {
    const distance = calculateDistance(userLat, userLon, outletLat, outletLon);
    return distance <= radius;
}



function proceedToPay(){
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var contactId =  userData['contactId'];
    var token = userData['token'];
    var mobileNo = userData['mobile'];
    var itemId = $('#itemId').val();
    var finalOrderAmount = $('#originalPrice').val();  // Assuming totalAmount is an input field
    var orderType = 3; // You can set this dynamically if needed
    var businessId = $('#cBID').val();
    $.ajax({
        url: "/wla/createUengagePayCart", // Replace with the actual API endpoint
        type: "POST",
        dataType: "json",  // Expecting JSON response from the server
        data: {
            contactMappingId: contactMappingId,
            token: token,
            mobileNo: mobileNo,
            itemId: itemId,
            orderAmount: finalOrderAmount,
            businessId: businessId,
            orderType: orderType
        },
        success: function(result) {
            if (result['status'] == 0) {
                alert(result['msg']);  // Display the error message if status is 0
             
            } else {
                var params = [];
                params["userId"] = contactId;
                params["businessId"] = businessId;
                params["token"] = token;
                params["mode"] = 'native';
                params["contactMappingId"] = contactMappingId;
                params["orderId"] = result['orderId'];
                params["orderType"] = orderType;
                openPost(origin + '/pay/initiate/native', params);
            }
        }
    });
}
function openPost(url, variables) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    form.setAttribute("target", "_self");
    form.setAttribute("hidden", "hidden");
    for (variable in variables) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("name", variable);
        hiddenField.setAttribute("value", variables[variable]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}