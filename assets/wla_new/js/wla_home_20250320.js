/*Inline Slick Slider Js*/
$(document).ready(function() {
    setTimeout(() => {
        const citySelector = document.getElementById('citySelector');
        const outletSelector = document.getElementById('outletSelector');

        if (citySelector) {
            citySelector.value = ""; 
        }

        if (outletSelector) {
            outletSelector.value = ""; 
            outletSelector.innerHTML = '<option value="" selected disabled hidden>Select Locality</option>';      
        }
    }, 500); 
    function mySlick(elems) {
        elems.each(function() {
            var current = $(this);
            let myOption = eval('({' + current.attr("data-option") + '})');
            current.slick(myOption);
        });
    }
    mySlick($("[data-slick]"));

    $('#search_pincode').on('keyup change', function() {
        var pincode = $(this).val();

        if (pincode === '') {
            
            $('#errorpincode_text').html('');
            $('#notService_imagepincode').hide();
        }
    });

    if (localStorage.getItem('orderType')) {
        var orderType = localStorage.getItem('orderType');
        // Update the button text based on the orderType value
        if (orderType == 2) {
            $('#textlocationmodal').html('');
            $('#textlocationmodal').html('Enter the pickup location');
        } else {
            $('#textlocationmodal').html('');
            $('#textlocationmodal').html('Enter the delivery location');
        }
    } else {
        // Default text if orderType is not set
        $('#textlocationmodal').html('');
        $('#textlocationmodal').html('Enter the delivery location');
    }


    $('#locationfetchmodal').on('show.bs.modal', function() {
        // Check if orderType is stored in localStorage
        if (localStorage.getItem('orderType')) {
            var orderType = localStorage.getItem('orderType');
            // Update the button text based on the orderType value
            if (orderType == 2) {
                $('#enterAddressButton').html('');
                $('#enterAddressButton').html('Enter the pickup location');
                $('#searchitem_locality_new').attr('placeholder', 'Enter the pickup location');
            } else {
                $('#enterAddressButton').html('');
                $('#enterAddressButton').html('Enter the delivery location');
                $('#searchitem_locality_new').attr('placeholder', 'Enter the delivery location');

            }
        } else {
            // Default text if orderType is not set
            $('#enterAddressButton').html('');
            $('#enterAddressButton').html('Enter the delivery location');
            $('#searchitem_locality_new').attr('placeholder', 'Enter the delivery location');
        }
    });

    $('#locationfetchoutletmodal').on('show.bs.modal', function() {
        // Check if orderType is stored in localStorage
        if (localStorage.getItem('orderType')) {
            var orderType = localStorage.getItem('orderType');
            // Update the button text based on the orderType value
            if (orderType == 2) {
                $('#enterAddressButtontext').html('Enter the pickup location');
            } else {
                $('#enterAddressButtontext').html('Enter the delivery location');
            }
        } else {
            // Default text if orderType is not set
            $('#enterAddressButtontext').html('Enter the delivery location');
        }
    });


    $('#enteraddress').on('show.bs.modal', function() {
        // Check if orderType is stored in localStorage

        $('#locationfetchoutletmodal').modal('hide');
        if (localStorage.getItem('orderType')) {
            var orderType = localStorage.getItem('orderType');
            // Update the button text based on the orderType value
            if (orderType == 2) {
                $('#search_locality_new').attr('placeholder', 'Enter the pickup location');
            } else {
                $('#search_locality_new').attr('placeholder', 'Enter the delivery location');
            }
        } else {
            // Default text if orderType is not set
            $('#search_locality_new').attr('placeholder', 'Enter the delivery location');
        }
    });


});

/* Banner Init slick slider + animation (3)*/
$(".banner-slide").slick({
    dots: true,
    arrows: false,

    autoplay: true,
    autoplaySpeed: 1500,
    infinite: true,
    lazyLoad: "progressive",
    slidesToShow: 2,
    slidesToScroll: 1,
    speed: 1500,
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
            }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ]
});
$(".bannerSlider").slick({
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand",
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    pauseOnHover: true,
    fade: false,
    responsive: [{
        breakpoint: 768,
        settings: {
            speed: 200,
            pauseOnHover: true,
        }
    }]
});
/*
$(".app-screen-slide").slick({
    arrows: false,
    autoplay: true,
    dots: true,
    fade: true
});
*/

$(".storiessection").slick({
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand",
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    pauseOnHover: true,
    fade: false,
   prevArrow: '<button class="slide-arrow prev-arrow"><i class="las la-angle-left"></i></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><i class="las la-angle-right"></i></button>',
    responsive: [
      {
      breakpoint: 768,
      settings: {
      slidesToShow: 1,
        speed: 200,
      arrows: false,
        pauseOnHover: true,
      }
      }
    ]
});

// Listen for the modal show event


$(document).on('click', '.theo-banner-click', function() {

    var bannerId = String($(this).data('banner-id')) || 'Unknown ID';

    if (typeof webengage_tag == "function") {
        webengage.track("Banner Clicked", {
            "Banner ID": bannerId
        });
    }
});


function changeOrderType(type) {
    localStorage.setItem('orderType', type);
    document.getElementById('businessCards').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function() {

    if (pId == 6424) {
        localStorage.setItem('orderType', 1);
    }
});

var initialAddressCount = 2;
var d = "";
var pincode_data = "";
$(document).ready(function(){
    if(isMaps==1){
        var inputElement = document.getElementById("search_locality");
        if(inputElement){
            inputElement.addEventListener("input", debounce(function() {
                var inputValue = inputElement.value;
                if (inputValue.length >= 2) {
                    renderAutocomplete();
                }
            
            },300));
        }

        var inputElements_new = document.getElementById("search_locality_new");
        if(inputElements_new){
            inputElements_new.addEventListener("input", debounce(function() {
                var inputValue = inputElements_new.value;
                if (inputValue.length >= 2) {
                    renderAutocomplete();
                }
            
            },300));
        }

        var inputElements_item = document.getElementById("searchitem_locality_new");
        if(inputElements_item){
            inputElements_item.addEventListener("input", debounce(function() {
                var inputValue = inputElements_item.value;
                if (inputValue.length >= 2) {
                    renderAutocomplete();
                }
            
            },300));
        }
    } 
    if(localStorage.getItem('userdata') && localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != '' && typeof enable_address != 'undefined' && enable_address == 1){
        $('#show_pincodelogin').hide();
            var userData = JSON.parse(localStorage.getItem('userdata'));
            var contactMappingId = userData['contactMappingId'];
            var token = userData['token'];
            var url = origin + '/client/getDeliveryAddress/' + pId + '/' + contactMappingId + '/' + token
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function(result) {
                        
                        if (result['rows'] != null && result['rows'].length > 0 && result.status == 1) {
                            var remainingRowCount = result['rows'].length - initialAddressCount;

                            if(result['rows'].length == 1){
                                var resultLength= result['rows'].length;
                            }else{
                                var resultLength= initialAddressCount;
                            }
                            
                            for (var i = 0; i < resultLength; i++) {
                                let addressType = 'Home';
                                if (result['rows'][i]['addressType'] == 1) {
                                    addressType = 'Home';
                                } else if (result['rows'][i]['addressType'] == 2) {
                                    addressType = 'Office';
                                } else if (result['rows'][i]['addressType'] == 3) {
                                    addressType = 'Other';
                                }

                                var address_data = result['rows'][i];
                                    d += '<div class="saved-address-nw-div d-flex align-items-center" onclick="locateNearestOutlet('+ address_data['contactMappingId'] +','+ address_data['parentBusinessId'] +', '+ address_data['latitude'] +', '+ address_data['longitude'] +')">';
                                    d += '<div class="saved-address-nw-one">';
                                    d += '<span style="background-color: #fff; width: 40px; height: 40px; line-height: 40px; display: inline-block; text-align: center; border-radius: 5px; font-size: 24px; box-shadow: 0px 1px 2px #00000029 !important; color: var(--main-bg-color);"><i class="las la-map-marker" style="color: var(--main-bg-color);"></i></span>';
                                    d += '</div>';
                                    d += '<div class="saved-address-nw-two pl-3">';
                                    d += '<h4 class="mb-1">'+ addressType +'</h4>';
                                    d += '<p class="mb-0" style="line-height: initial;">'+ result['rows'][i]['addressLine1'] +','+ result['rows'][i]['addressLine2'] +'</p>';
                                    d += '</div>';
                                    d += '<div class="saved-address-nw-three text-right" style="color: var(--main-bg-color); font-size: 18px;">';
                                    d +=  '<i class="las la-angle-right"></i>';
                                    d += '</div>';
                                    d += '</div>';

                                    if (remainingRowCount > 0) {
                                        var resultJSON = JSON.stringify(result);
                                        
                                        d += "<div id='viewMoreButton' onclick='showMoreAddresses(" + resultJSON + ")' ><span style='color: var(--main-bg-color);font-weight: 500;border-bottom: 1px solid var(--main-bg-color);cursor:pointer;'>View More</span></div>";
                                    }
                                    
                                    pincode_data += '<div class="saved-address-nw-div d-flex align-items-center" onclick="handlePincodeApiCall('+ address_data['pinCode'] +')">';
                                    pincode_data += '<div class="saved-address-nw-one">';
                                    pincode_data += '<span style="background-color: #fff; width: 40px; height: 40px; line-height: 40px; display: inline-block; text-align: center; border-radius: 5px; font-size: 24px; box-shadow: 0px 1px 2px #00000029 !important; color: var(--main-bg-color);"><i class="las la-map-marker" style="color: var(--main-bg-color);"></i></span>';
                                    pincode_data += '</div>';
                                    pincode_data += '<div class="saved-address-nw-two pl-3">';
                                    pincode_data += '<h4 class="mb-1">'+ addressType +'</h4>';
                                    pincode_data += '<p class="mb-0" style="line-height: initial;">'+ result['rows'][i]['addressLine1'] +','+ result['rows'][i]['addressLine2'] +'</p>';
                                    pincode_data += '</div>';
                                    pincode_data += '<div class="saved-address-nw-three text-right" style="color: var(--main-bg-color); font-size: 18px;">';
                                    pincode_data +=  '<i class="las la-angle-right"></i>';
                                    pincode_data += '</div>';
                                    pincode_data += '</div>';

                                    if ( i == 1) {
                                        var resultJSON = JSON.stringify(result);
                                        
                                        pincode_data += "<div id='viewMoreButtonPincode' onclick='showMoreAddresses(" + resultJSON + ")' ><span style='color: var(--main-bg-color);font-weight: 500;border-bottom: 1px solid var(--main-bg-color);cursor:pointer;'>View More</span></div>";
                                    }

                            }
                            var add_ress = document.getElementById('show_save_address');
                            if(add_ress){
                                $('#show_save_address').show();
                                $('#saved_address_list').html('');
                                $('#saved_address_list').html(d);
                                $('#viewMoreButton').removeClass('d-none');
                                $('#location_emptyImage').addClass('d-none');
                            }else{
                                $('#show_save_address').hide();
                                $('#location_emptyImage').removeClass('d-none');
                            }
                            
                            var add_ress = document.getElementById('show_pincode_save_address');
                            if(add_ress){
                                $('#show_pincode_save_address').show();
                                $('#saved_pincode_address_list').html('');
                                $('#saved_pincode_address_list').html(pincode_data);
                                $('#viewMoreButton').removeClass('d-none');
                            }else{
                                $('#show_pincode_save_address').hide();
                            }

                        } else {
                            $('#show_save_address').hide();
                            $('#location_emptyImage').show();
                            $('#show_pincode_save_address').hide();
                        }                    
        
                }
            });
            }else{
                $('#show_pincodelogin').show();   
    }
});


function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

var origin = window.location.origin;
var city_stores = [];
var order_selected_tab = 1;

function showMoreAddresses(result) {
    
    for (var i = initialAddressCount; i < result['rows'].length; i++) {
        let addressType = 'Home';
        if (result['rows'][i]['addressType'] == 1) {
            addressType = 'Home';
        } else if (result['rows'][i]['addressType'] == 2) {
            addressType = 'Office';
        } else if (result['rows'][i]['addressType'] == 3) {
            addressType = 'Other';
        }

        var address_data = result['rows'][i];

        d += '<div class="saved-address-nw-div d-flex align-items-center" onclick="locateNearestOutlet('+ address_data['contactMappingId'] +','+ address_data['parentBusinessId'] +', '+ address_data['latitude'] +', '+ address_data['longitude'] +')">';
        d += '<div class="saved-address-nw-one">';
        d += '<span style="background-color: #fff; width: 40px; height: 40px; line-height: 40px; display: inline-block; text-align: center; border-radius: 5px; font-size: 24px; box-shadow: 0px 1px 2px #00000029 !important; color: var(--main-bg-color);"><i class="las la-map-marker" style="color: var(--main-bg-color);"></i></span>';
        d += '</div>';
        d += '<div class="saved-address-nw-two pl-3">';
        d += '<h4 class="mb-1">' + addressType + '</h4>';
        d += '<p class="mb-0" style="line-height: initial;">' + result['rows'][i]['addressLine1'] + ',' + result['rows'][i]['addressLine2'] + '</p>';
        d += '</div>';
        d += '<div class="saved-address-nw-three text-right" style="color: var(--main-bg-color); font-size: 18px;">';
        d += '<i class="las la-angle-right"></i>';
        d += '</div>';
        d += '</div>';

        pincode_data += '<div class="saved-address-nw-div d-flex align-items-center" onclick="handlePincodeApiCall('+ address_data['pinCode'] +')">';
        pincode_data += '<div class="saved-address-nw-one">';
        pincode_data += '<span style="background-color: #fff; width: 40px; height: 40px; line-height: 40px; display: inline-block; text-align: center; border-radius: 5px; font-size: 24px; box-shadow: 0px 1px 2px #00000029 !important; color: var(--main-bg-color);"><i class="las la-map-marker" style="color: var(--main-bg-color);"></i></span>';
        pincode_data += '</div>';
        pincode_data += '<div class="saved-address-nw-two pl-3">';
        pincode_data += '<h4 class="mb-1">' + addressType + '</h4>';
        pincode_data += '<p class="mb-0" style="line-height: initial;">' + result['rows'][i]['addressLine1'] + ',' + result['rows'][i]['addressLine2'] + '</p>';
        pincode_data += '</div>';
        pincode_data += '<div class="saved-address-nw-three text-right" style="color: var(--main-bg-color); font-size: 18px;">';
        pincode_data += '<i class="las la-angle-right"></i>';
        pincode_data += '</div>';
        pincode_data += '</div>';
    }    

    $('#saved_address_list').html(d);
    $('#viewMoreButton').addClass('d-none');

    $('#saved_pincode_address_list').html(pincode_data);
    $('#viewMoreButtonPincode').addClass('d-none');
}

function locateNearestOutlet(contactMappingId,pId,lat,lng){

    var url= origin + '/client/getNearestOpenOutlet';

    $.ajax({
  
        url: url,
        type: "POST",
        data: {
            contactMappingId: contactMappingId,
            parentBusinessId: pId,
            latitude: lat,
            longitude: lng
      },
        success: function(response) {
            
            response = JSON.parse(response);
            if(response.status == 1){
                openOrderPage(response.address['slug'],response.address['locality'],response.address['city']);
            }

        }
    });

}

function showOutletNew(select, pId) {
    $('.spinner').show();
    var url = origin + '/client/getStores?city=' + select.value + '&parentBusinessId=' + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {
                alert(result['msg']);
            } else {
                var list = result['loca_list'];
                city_stores = list;
                var option = '<option value="" selected disabled hidden>Select Locality</option>';
                for (var i = 0; i < city_stores.length; i++) {
                    option += '<option value="' + city_stores[i]['id'] + '">' + city_stores[i]['locality'] + '</option>';
                }
                $('body #outletSelector').removeClass('disabled');
                $('body #outletSelector').html('');
                $('body #outletSelector').html(option);
            }
            $('.spinner').hide();

        }
    });
}

function showOutletList(select, pId) {
    $('.spinner').show();
    var url = origin + '/client/getStores?city=' + select + '&parentBusinessId=' + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {
                alert(result['msg']);
                $('#cityList').show();
            } else {
                $('#cityList').hide();
                var list = result['loca_list'];
                city_stores = list;
                var option = '';
                for (var i = 0; i < list.length; i++) {
                    option += '<li style="cursor: pointer;" class="list-item" onclick="openDeliveryOrderPage(' + list[i]['id'] + ' , ' + list[i]['locality'] + ')">';
                    option += '<a class="list-item-link btn-next">';
                    option += '<span class="store-lists">';
                    option += '<span class="d-flex justify-content-between w-100">';
                    option += '<span style="padding-right: 10px;">' + list[i]['locality'] + '</span>';
                    option += '<span><i class="las la-angle-right"></i></span>';
                    option += '</span>';
                    option += '</span>';
                    option += '</a>';
                    option += '</li>';
                }
                $('#outletList_new').html('');
                $('#outletList_new').html(option);
                $('#outletList_new').show();
                
            }
            $('.spinner').hide();

        }
    });
}



function changeOrderType_tab(orderType) {
    order_selected_tab = orderType;

    if ( orderType==1 || orderType == 3 || orderType ==4) {
        localStorage.setItem('orderType', orderType);
    }

    if (orderType == 2) {
        $('#textlocationmodal').html('');
        $('#textlocationmodal').html('Enter the pickup location');
    } else {
        $('#textlocationmodal').html('');
        $('#textlocationmodal').html('Enter the delivery location');
    }
    
}

function openDeliveryOrderPage(select,locality = '') {
    if(locality != ''){
        var bId = select;
    }else{
        var bId = select.value;
    }



    var index = city_stores.findIndex(e => e.id == bId);

    if (index > -1) {
        if (order_selected_tab == 1) {
            if (city_stores[index]['onlineOrdersDelivery'] == 0) {
                $('#outletListSearch').hide();
                $('#outletListSearchSelect').show();
                $('#outletListSearchSelect').html('');
                $('#outletListSearchSelect').html('<div class="col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                    '<span>' +
                    '<p class="font-weight-bold text-danger mb-0">Delivery Is Closed</p>' +
                    'This store is not accepting delivery orders select nearest store.' +
                    '</span>' +
                    '</div></div>');
            } else {
                window.location.href = "order/" + city_stores[index]['web_slug'];
            }
        } else if (order_selected_tab == 2) {
            if (city_stores[index]['onlineOrdersSelfPickup'] == 0) {
                $('#outletListSearch').hide();
                $('#outletListSearchSelect').show();
                $('#outletListSearchSelect').html('');
                $('#outletListSearchSelect').html('<div class=""col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                    '<span>' +
                    '<p class="font-weight-bold text-danger mb-0">Pickup Is Closed</p>' +
                    'This store is not accepting pickup orders select nearest store.' +
                    '</span>' +
                    '</div></div>');
            } else {
                window.location.href = "order/" + city_stores[index]['web_slug'];
            }
        }

    }

    return false;



}

function get_location(location) {
    var lat = location.coords.latitude;
    var long = location.coords.longitude;

    var storedValue = localStorage.getItem("searchLocalityInput");
    if (storedValue) {
        localStorage.removeItem("searchLocalityInput");
    }
    var locationValues = [lat, long];
    localStorage.setItem("searchLocalityInput", JSON.stringify(locationValues));
    
    $.ajax({
        url: origin + '/client/locateNearestStore?businessId=' + pId + '&lat=' + lat + '&lng=' + long,
        type: 'GET',
        dataType: 'JSON',
        success: function(data) {
            let list = '';
            let order_type;
            if (localStorage.getItem('orderType') && (localStorage.getItem('orderType') == 2)) {
                order_type = 'Pickup';
            } else {
                order_type = 'Delivery';
            }
            if (data['status'] == 1) {
                let outlets = data['data'];
                if (outlets.length > 0) {
                        for (var i = 0; i < outlets.length; i++) {
                            var outlet_dis = (outlets[i]['distance']) <= 1 ? "km" : "kms";
                            list+='<li>'+
                            '<div class="d-flex mb-3 align-items-center" onclick=\'openOrderPage("' + outlets[i]['web_slug'] + '","'+ outlets[i]['locality'] +'","'+ outlets[i]['city'] +'")\' style="border: 1px solid var(--main-bg-color); padding: 5px; border-radius: 5px; overflow: hidden; position:relative; cursor: pointer;">'+
                                '<div class="img-second">';

                                    if(pId != 7175){
                                        if(outlets[i]['show_brand_name'] == 1){
                                            list +='<h4 class="mt-0 mb-0" style="border: none; color: var(--main-bg-color);">' + outlets[i]['name'] + '</h4>';
                                        }
                                    }
                                    
                                    list += '<p class="mb-0" style="max-width: 210px;font-weight: 700;">' + outlets[i]['locality'] + ', ' + outlets[i]['city'] + '</p>';
                                    if (outlets[i]['ecomm'] == 1 || outlets[i]['localityMapping'] == 4) {
        
                                    } else {
        
                                        list += '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial;"><i class="las la-map-marker-alt"  style="font-size: 13px; color: #000 ;"></i>' + outlets[i]['distance'] + ' ' + outlet_dis + ' away</p>';
                                    }
                                    if (outlets[i]['onlineDeliveryTime'] != null && outlets[i]['onlineDeliveryTime'] != '') {
                                        if (outlets[i]['ecomm'] == 1 || outlets[i]['localityMapping'] == 4) {
                                            outlets[i]['onlineDeliveryTime'] = minToDays(outlets[i]['onlineDeliveryTime']);
                                            list += '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial; margin-left: 5px;"><i class="las la-biking" style="font-size: 13px; color: #000;"></i>Delivery: ' + outlets[i]['onlineDeliveryTime'] + '</p>';
        
                                        } else {
                                            list += '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial; margin-left: 5px;"><i class="las la-biking" style="font-size: 13px; color: #000;"></i>' + outlets[i]['onlineDeliveryTime'] + '  Delivery</p>';
        
                                        }
                                    }
                                list += '</div>'+
                                '<div class="img-third">';
                                if(pId == 7175){
                                    list +='<span style="color:#000">Order Online</span>';
                                }else{
                                    list +='<span>Order Online</span>';
                                }
                            list+='</div>'+
                            '</div>'+
                        '</li>';
                    }
                        $('body #nearbyoutlets').modal('show');
                        var outlet_type= order_type + ' Outlet' + (outlets.length !== 1 ? 's' : '');
                        $('#outlet_orderType').html(outlet_type);
                        $('#nearOutlet_List').html('');
                        $('#nearOutlet_List').html(list);
                        var message = outlets.length + ' Outlet' + (outlets.length !== 1 ? 's' : '') + ' Found';
                        $('#outlet_count').html(message);
                        $('#outletListSearch').hide();
                        $('#locationfetchoutletmodal').modal('hide');
                } else {
                    $('#order_details').addClass('d-none');
                    $('body #nearbyoutlets').modal('hide');
                    $('#outletListSearch').show();
                    $('#outletListSearchSelect').hide();
                    $('#outletListSearch').html('');
                    $('#error-msg-show-text').html( order_type +' Is Closed');
                    $('#outletListSearch').html('<div class="col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                    '<span>' +
                    '<p class="font-weight-bold text-danger mb-0">'+ order_type +' Is Closed</p>' +
                    'This store is not accepting delivery orders select nearest store.' +
                    '</span>' +
                    '</div></div>');
                }
            } else {
                $('#order_details').addClass('d-none');
                $('body #nearbyoutlets').modal('hide');
                $('#outletListSearchSelect').hide();
                $('#outletListSearch').show();
                $('#outletListSearch').html('');
                $('#error-msg-show-text').html('Location is Not Serviceable');
                $('#outletListSearch').html('<div class="col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                '<span>' +
                '<p class="font-weight-bold text-danger mb-0">Location is Not Serviceable For '+ order_type + '</p>' +
                '</span>' +
                '</div></div>');
                if (typeof gtag === "function") {

                    gtag('event', 'location_not_serviceable', {
                        'event_category': 'Trying to access location',
                        'event_label': 'Location Not Serviceable',  // Label describing the button
                        'value': 1  // Optional: you can pass a value if needed
                    });
                }
            }

            $('.spinner').hide();
        }
    });
}
function minToDays(min) {
    let days = Math.floor((min) / 1440);
    let remainingTime = parseInt((min) - Math.floor((days * 1440)));
    let hours = Math.floor((remainingTime / 60));
    let remainingMin = Math.floor(remainingTime - (hours * 60));
    return days + ' Business Days';
}
function CurrentAddress(onlineDeliveryOn) {
    // alert('aksjdf');return;
    if (typeof gtag === "function") {

        gtag('event', 'trying_acces_location', {
            'event_category': 'Trying to access location',
            'event_label': 'Trying to fetch current location of user',  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    if (typeof fbq === "function") {

        fbq('trackCustom', 'trying_acces_location', {
            action:"Trying to access location", // Add the user's location dynamically
            timestamp: new Date().toISOString()
        });
    }
    $('.spinner').show();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(get_location, get_error);
    }
}

function get_error(error) {
    var errorMessage = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            if (typeof gtag === "function") {

                gtag('event', 'location_permission_denied', {
                    'event_category': 'Trying to access location',
                    'event_label': 'User deined the permission to access location',  // Label describing the button
                    'value': 1  // Optional: you can pass a value if needed
                });
            }

            if (typeof fbq === "function") {

                fbq('trackCustom', 'location_permission_denied', {
                    action:"Location Permission denied", // Add the user's location dynamically
                    timestamp: new Date().toISOString()
                });
            }
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case 0:
            errorMessage = "Geolocation is not supported by this browser.";
            break;
        case 2:
            errorMessage = "Internet connection is offline.";
            break;
        default:
            errorMessage = "An unknown error occurred.";
            break;
    }

    $('#order_details').addClass('d-none');
    $('#outletListSearchSelect').hide();
    $('#outletListSearch').show();
    $('#outletListSearch').html('');
    $('#outletListSearch').html('<div><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
        '<span>' +
        '<p class="font-weight-bold text-danger mb-0">' + errorMessage + '</p>' +
        '</span>' +
        '</div></div>');
    $('#error-msg-show-text').html(errorMessage);
    $('.spinner').hide();
}

function openOrderPage(storeSlug,locality = '' , city = '') {
    // alert(val);
    if (storeSlug != '') {
        // var storeId=$('#store').val();
        if(typeof webengage_tag == "function"){

            webengage.track("Location Selected", {
                "City" : city,
                "Locality" : locality
            });
        }
        window.location.href = "order/" + storeSlug;
    }

}

let isGoogleMapsLoaded = false;


function renderAutocomplete() {

    if (!isGoogleMapsLoaded) {
        if (typeof google !== 'object' || typeof google.maps !== 'object') {
            // Check if the script tag already exists
            var existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
            if (!existingScript) {
                var script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + maps_keys + '&libraries=places&callback=initMap';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        } else {
            initMap(); // If google.maps is already loaded, directly initialize the map
        } 
        isGoogleMapsLoaded = true;
    }
}

function initMap(){
    var options = {
        // types: ['(regions)'],
        componentRestrictions: {
            country: "IN"
        },
        fields: ["address_components", "geometry.location", "formatted_address", "name"]
    };

    const sessionToken = new google.maps.places.AutocompleteSessionToken(); // Use session token

    var search_id = document.getElementById('search_locality');
    if(search_id){
        autocomplete = new google.maps.places.Autocomplete((search_id), options);
        //  autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
        autocomplete.setOptions({ sessionToken });
        autocomplete.addListener('place_changed', getAddress);
    }

    var search_new= document.getElementById('search_locality_new');
    let order_type;
        if (localStorage.getItem('orderType') && (localStorage.getItem('orderType') == 2)) {
            order_type = 'pickup';
        } else {
            order_type = 'delivery';
        }
    
    $('#select_order').html(order_type);
    if(search_new){
        autocompleteSearchNew = new google.maps.places.Autocomplete((search_new), options);
        //  autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
        autocompleteSearchNew.setOptions({ sessionToken });
        autocompleteSearchNew.addListener('place_changed', getAddressList);
    }

    var search_new_item= document.getElementById('searchitem_locality_new');
    if(search_new_item){
        autocompleteSearchNewItem = new google.maps.places.Autocomplete((search_new_item), options);
        autocompleteSearchNewItem.setOptions({ sessionToken });
        autocompleteSearchNewItem.addListener('place_changed', getItemAddressList);
    }
}

function getAddress() {
    var place = autocomplete.getPlace();

    if (place && place.geometry && place.geometry.location) {
    $.ajax({
        url: origin + '/client/locateNearestStore?businessId=' + pId + '&lat=' + place.geometry.location.lat() + '&lng=' + place.geometry.location.lng(),
        type: 'GET',
        dataType: 'JSON',
        success: function(data) {
            let list = '';
            let order_type;
            if (localStorage.getItem('orderType') && (localStorage.getItem('orderType') == 2)) {
                order_type = 'Pickup';
            } else {
                order_type = 'Delivery';
            }
            if (data['status'] == 1) {
                let outlets = data['data'];
               
                if (outlets.length > 0) {
                    for (var i = 0; i < outlets.length; i++) {
                        var outlet_dis = (outlets[i]['distance']) <= 1 ? "km" : "kms";
                        list+='<li>'+
                            '<div class="d-flex mb-3 align-items-center" onclick=\'openOrderPage("' + outlets[i]['web_slug'] + '","'+ outlets[i]['locality'] +'","'+ outlets[i]['city'] +'")\' style="border: 1px solid var(--main-bg-color); padding: 5px; border-radius: 5px; overflow: hidden;position:relative;cursor:pointer;">'+
                                '<div class="img-second">';
                                if(pId != 7175){
                                    if(outlets[i]['show_brand_name'] == 1){
                                        list +='<h4 class="mt-0 mb-0" style="border: none; color: var(--main-bg-color);">' + outlets[i]['name'] + '</h4>';
                                    }
                                }
                                    list +='<p class="mb-0" style="max-width: 210px;font-weight: 700;">' + outlets[i]['locality'] + ', ' + outlets[i]['city'] + '</p>'+
                                    '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial;"><i class="las la-map-marker-alt"  style="font-size: 13px; color: #000;"></i>'+ outlets[i]['distance'] + ' ' + outlet_dis +' away</p>';
                                    if(outlets[i]['onlineDeliveryTime']!= null && outlets[i]['onlineDeliveryTime'] != ''){
                                        list += '<p class="mb-0" style="font-size: 12px;display: inline-block;margin-top: 5px;line-height: initial;margin-left: 5px;"><i class="las la-biking" style="font-size: 13px; color: #000;"></i>'+ outlets[i]['onlineDeliveryTime'] +' mins Delivery</p>';
                                    }
                                list +='</div>'+
                                '<div class="img-third">';
                                    if(pId == 7175){
                                        list +='<span style="color:#000">Order Online</span>';
                                    }else{
                                        list +='<span>Order Online</span>';
                                    }
                                    
                            
                            list+='</div>'+
                            '</div>'+
                        '</li>';
                    }
                    $('body #nearbyoutlets').modal('show');
                    var outlet_type= order_type + ' Outlet' + (outlets.length !== 1 ? 's' : '');
                    $('#outlet_orderType').html(outlet_type);
                    $('#nearOutlet_List').html('');
                    $('#nearOutlet_List').html(list);
                    var message = outlets.length + ' Outlet' + (outlets.length !== 1 ? 's' : '') + ' Found';
                    $('#outlet_count').html(message);
                

                } else {
                    $('body #nearbyoutlets').modal('hide');
                    $('#order_details').addClass('d-none');
                    $('#outletListSearchSelect').hide();
                    $('#outletListSearch').show();
                    $('#outletListSearch').html('');
                  $('#outletListSearch').html('<div class="col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                    '<span>' +
                    '<p class="font-weight-bold text-danger mb-0">'+ order_type +' Is Closed</p>' +
                    'This store is not accepting delivery orders select nearest store.' +
                    '</span>' +
                    '</div></div>');
                }
            } else {
                $('body #nearbyoutlets').modal('hide');
                $('#order_details').addClass('d-none');
                $('#outletListSearch').show();
                $('#outletListSearchSelect').hide();
                $('#outletListSearch').html('');
                $('#outletListSearch').html('<div class="col-md-4 col-xs-12 pt-2"><div class="d-inline-block p-2" style="background-color: #e7e7e7; border-radius: 5px;">' +
                '<span>' +
                '<p class="font-weight-bold text-danger mb-0">Location is Not Serviceable For '+ order_type + '</p>' +
                '</span>' +
                '</div></div>');
                
                if (typeof gtag === "function") {

                    gtag('event', 'location_not_serviceable', {
                        'event_category': 'location_not_serviceable',
                        'event_label': 'Location Not Serviceable' + outlets[i]['locality'] + ', ' + outlets[i]['city'] ,  // Label describing the button
                        'value': 1  // Optional: you can pass a value if needed
                    });
                }
                if (typeof fbq === "function") {

                    fbq('trackCustom', 'location_not_serviceable', {
                        action:"Location Not Serviceable" +  outlets[i]['locality'] + ', ' + outlets[i]['city'] , // Add the user's location dynamically
                        timestamp: new Date().toISOString()
                    });
                }
            }

            $('.spinner').hide();
        }
    });
}

}
if ($(window).width() <= 767) {
    $('.class-move-two').append($('.movetwo'));
}

function getAddressList() {
    var place = autocompleteSearchNew.getPlace();

    if (place && place.geometry && place.geometry.location) {
    $.ajax({
        url: origin + '/client/locateNearestStore?businessId=' + pId + '&lat=' + place.geometry.location.lat() + '&lng=' + place.geometry.location.lng(),
        type: 'GET',
        dataType: 'JSON',
        success: function(data) {
            let list = '';
            let order_type;
            if (localStorage.getItem('orderType') && (localStorage.getItem('orderType') == 2)) {
                order_type = 'pickup';
            } else {
                order_type = 'delivery';
            }
            
            if (data['status'] == 1) {
                let outlets = data['data'];
               
                if (outlets.length > 0) {

                    var storedValue = localStorage.getItem("searchLocalityInput");
                    if (storedValue) {
                        localStorage.removeItem("searchLocalityInput");
                    }
                    // Assuming you have two values, lat and lng
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();

                    // Create an array to store both values
                    var locationValues = [lat, lng];

                    // Convert the array to a JSON string and store it in localStorage
                    localStorage.setItem("searchLocalityInput", JSON.stringify(locationValues));
                    
                    for (var i = 0; i < outlets.length; i++) {
                        var outlet_dis = (outlets[i]['distance']) <= 1 ? "km" : "kms";
                        list+='<li>'+
                        '<div class="d-flex mb-3 align-items-center" onclick=\'openOrderPage("' + outlets[i]['web_slug'] + '","'+ outlets[i]['locality'] +'","'+ outlets[i]['city'] +'")\' style="border: 1px solid var(--main-bg-color); padding: 5px; border-radius: 5px; overflow: hidden; position:relative;cursor:pointer;">';
                            list += '<div class="img-second">';
                            
                            if(pId != 7175){
                                if(outlets[i]['show_brand_name'] == 1){
                                    list +='<h4 class="mt-0 mb-0" style="border: none; color: var(--main-bg-color);">' + outlets[i]['name'] + '</h4>';
                                }
                            }

                            list += '<p class="mb-0" style="max-width: 210px;font-weight: 700;">' + outlets[i]['locality'] + ', ' + outlets[i]['city'] + '</p>'+
                                '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial;"><i class="las la-map-marker-alt"  style="font-size: 13px; color: #000 ;"></i>'+ outlets[i]['distance'] + ' ' +  outlet_dis +' away</p>';
                                if(outlets[i]['onlineDeliveryTime']!= null && outlets[i]['onlineDeliveryTime'] != ''){
                                    list += '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial; margin-left: 5px;"><i class="las la-biking" style="font-size: 13px; color: #000;"></i>'+ outlets[i]['onlineDeliveryTime'] +' mins Delivery</p>';
                                }
                            list += '</div>'+
                            '<div class="img-third">';
                            if(pId == 7175){
                                list +='<span style="color:#000">Order Online</span>';
                            }else{
                                list +='<span>Order Online</span>';
                            }
                        list+='</div>'+
                        '</div>'+
                    '</li>';
                    }
                    $('.outlet_newList').removeClass('d-none');
                    $('#location_emptyImage').addClass('d-none');
                    $('#notService_image').addClass('d-none');
                    $('#deliveryclose_img').addClass('d-none');
                    $('#pickupclose_img').addClass('d-none');
                    var outlet_type= outlets.length + ' ' + order_type + ' outlet' + (outlets.length !== 1 ? 's' : '') + ' found';
                    $('#outlet_orderTypeList').html(outlet_type);
                    $('#nearOutlet_Lists').html('');
                    $('#nearOutlet_Lists').html(list);
                    var message = 'Select Locality';
                    $('#outlet_countList').html(message);                   
                

                } else {
                    $('#location_emptyImage').addClass('d-none');
                    $('.outlet_newList').addClass('d-none');
                    $('#notService_image').addClass('d-none');

                    if(order_type == 1){
                        $('#deliveryclose_img').removeClass('d-none');
                    }else if(order_type == 2){
                        $('#pickupclose_img').removeClass('d-none');
                    }
                }
            } else {
                $('#location_emptyImage').addClass('d-none');
                $('.outlet_newList').addClass('d-none');
                $('#notService_image').removeClass('d-none');
                $('#deliveryclose_img').addClass('d-none');
                $('#pickupclose_img').addClass('d-none');
            }

            $('.spinner').hide();
        }
    });
}

}

function getItemAddressList() {
    var place = autocompleteSearchNewItem.getPlace();
    if (place && place.geometry && place.geometry.location) {
    $.ajax({
        url: origin + '/client/getStoresList/?businessId=' + pId + '&lat=' + place.geometry.location.lat() + '&lng=' + place.geometry.location.lng() + '&slug=' + fetchSlug,
        type: 'GET',
        dataType: 'JSON',
        success: function(data) {
            let list = '';
            
            if (data['status'] == 1) {
                let outlets = data['data'];
               
                if (outlets.length > 0) {

					var storedValue = localStorage.getItem("searchLocalityInput");
                    if (storedValue) {
                        localStorage.removeItem("searchLocalityInput");
                    }
                    // Assuming you have two values, lat and lng
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();

                    // Create an array to store both values
                    var locationValues = [lat, lng];

                    // Convert the array to a JSON string and store it in localStorage
                    localStorage.setItem("searchLocalityInput", JSON.stringify(locationValues));
					
                    for (var i = 0; i < outlets.length; i++) {
                        var outlet_dis = (outlets[i]['distance']) <= 1 ? "km" : "kms";
                        list+='<li>'+
                            '<div class="d-flex mb-3 align-items-center" onclick=\'openOrderItemPage("' + outlets[i]['web_slug'] + '","' + outlets[i]['locality'] + '","' + outlets[i]['city'] + '")\' style="border: 1px solid var(--main-bg-color); padding: 5px; border-radius: 5px; overflow: hidden; position:relative;cursor:pointer;">'+
                                '<div class="img-second">';
									if(pId != 7175){
										list+= '<h4 class="mt-0 mb-0" style="border: none; color: #000;">' + outlets[i]['name'] + '</h4>';
									}
                                    list+= '<p class="mb-0" style="max-width: 210px;font-weight: 700;">' + outlets[i]['locality'] + ', ' + outlets[i]['city'] + '</p>'+
                                    '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial;"><i class="las la-map-marker-alt"  style="font-size: 13px; color: #000;"></i>'+ outlets[i]['distance'] + ' ' +  outlet_dis +' away</p>';
                                    if(outlets[i]['onlineDeliveryTime']!= null && outlets[i]['onlineDeliveryTime'] != ''){
                                        list += '<p class="mb-0" style="font-size: 12px; display: inline-block; margin-top: 5px; line-height: initial; margin-left: 5px;"><i class="las la-biking" style="font-size: 13px; color: #000;"></i>'+ outlets[i]['onlineDeliveryTime'] +' mins Delivery</p>';
                                    }
                                list += '</div>'+
                                '<div class="img-third">'+
                                    '<span style="color:#000">Order Online</span>';
                            
                            list+='</div>'+
                            '</div>'+
                        '</li>';
                    }
                    $('.outletitem_newList').removeClass('d-none');
                    $('#locationitem_emptyImage').addClass('d-none');
                    $('#notServiceitem_image').addClass('d-none');
                    var outlet_type= outlets.length + ' outlet' + (outlets.length !== 1 ? 's' : '') + ' found';
                    $('#outletitem_orderTypeList').html(outlet_type);
                    $('#nearOutletitem_Lists').html('');
                    $('#nearOutletitem_Lists').html(list);
                    var message = 'Select Locality';
                    $('#outletitem_countList').html(message);                   
                

                } else {
                    $('#locationitem_emptyImage').addClass('d-none');
                    $('.outletitem_newList').addClass('d-none');
                    $('#notServiceitem_image').removeClass('d-none');
                }
            } else {
                $('#locationitem_emptyImage').addClass('d-none');
                $('.outletitem_newList').addClass('d-none');
                $('#notServiceitem_image').removeClass('d-none');
            }

            $('.spinner').hide();
        }
    });
}

}

$('#enteraddress').on('hidden.bs.modal', function () {
    $('.outlet_newList').addClass('d-none');
    $('#location_emptyImage').removeClass('d-none');
    $('#search_locality_new').val('');
    $('#notService_image').addClass('d-none');
});


$(document).ready(function(){
    
    if (typeof pId !== 'undefined' && pId !== null && typeof enable_story != 'undefined' && enable_story == 1) {
        var story='';
        var parentBusinessId = pId;
        var businessId = pId;
        var url= origin +'/client/getStories';
        $.ajax({
    
            url: url,
            type: "POST",
            data: {
                contactMappingId: null,
                parentBusinessId: parentBusinessId,
                businessId: businessId
            },
            success: function(response) {
                var responses=JSON.parse(response);
                var result= responses.stories;
            if(result.length != 0)
            {
                
                for(var i=0 ; i < result.length ; i++)
                {
                    
                story+='<div class="stories-outer text-center">';
                    if(result[i].pageCount !=0){
                    var url=decodeURIComponent(result[i].id);
                    story+='<a href="'+origin+'/wla/storyCardPage?slug='+url+'" target="_blank">';
                    }
                
                story+='<div class="stories-card">';
                story+='<div class="stories-image">';
                story+='<img src="'+result[i].image+'" alt="'+result[i].title +'" width="484" height="272">';
                story+='</div>';
                story+='<h4>'+ result[i].title+'</h4>';
                story+='</div>';
                story+='</a>';
                story+='</div>';
                $('#storyList').html('');
                $('#storyList').html(story);
                $('#story_widget').removeClass('d-none');
                }
                
                
            }else{
                $('#story_widget').addClass('d-none');
            }
            
            }
        });

      
    }

    if(typeof enable_active != 'undefined' && enable_active == 1 && typeof pId !== 'undefined' && pId !== null){
        
        if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != undefined) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            var contactMappingId = userData['contactMappingId'];
            var url = origin + "/client/getActiveOrderData/" + pId + "/" + contactMappingId + "/" + userData['mobile'];
    
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    "token": userData['token']
                },
                success: function(result) {
                    if (result['status'] == 1) {

                        var feedB = '';
                        var feed = result['active_orders'];
                        if (feed.length > 0) {
                            $('#show_active_orders').show();
                            for (var k = 0; k < feed.length; k++) {

                                var orders = feed[k];

                                var url = origin + "/past-order/" + orders['orderId'];

                                feedB += '<div class="offers-slider-start">';
                                feedB += '<div class="a-order-div">';
                                feedB += '<div class="order-header">';
                                feedB += '<span>Active Order: #'+ orders['orderId'] +'</span>';
                                feedB += '</div>';
                                feedB += '<div class="order-body">';
                                feedB += '<div class="row w-100 m-0">';
                                if (orders.invoicedAt == null) {
                                    oInvoicedAT = '<div class="order-tracking current"><span class="is-complete"></span><p>Received</p></div>';
                                } else {
                                    oInvoicedAT = '<div class="order-tracking completed"><span class="is-complete"></span><p>Received<br><span>' + moment(orders.invoicedAt).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.acceptedTime == null) {
                                    if (orders.cancelledTime == null) {
                                        oacceptedTime = '<div class="order-tracking current"><span class="is-complete"></span><p>Accepted</p></div>';
                                    } else {
                                        if (orders.acceptedTime == null) {
                                            oacceptedTime = '';
                                        } else {
                                            oacceptedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Accepted<br><span>' + moment(orders.acceptedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    oacceptedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Accepted<br><span>' + moment(orders.acceptedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.preparedTime == null) {
                                    if (orders.cancelledTime == null) {
                                        if (orders.acceptedTime != null) {
                                            opreparedTime = '<div class="order-tracking current"><span class="is-complete"></span><p>Prepared</p></div>';
                                        } else {
                                            opreparedTime = '<div class="order-tracking"><span class="is-complete"></span><p>Prepared</p></div>';
                                        }
    
                                    } else {
                                        if (orders.preparedTime == null) {
                                            opreparedTime = '';
                                        } else {
                                            opreparedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Prepared<br><span>' + moment(orders.preparedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    opreparedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Prepared<br><span>' + moment(orders.preparedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.dispatchedTime == null) {
                                    if (orders.cancelledTime == null) {
                                        if (orders.preparedTime != null) {
                                            odispatchedTime = '<div class="order-tracking current"><span class="is-complete"></span><p>Dispatched</p></div>';
                                        } else {
                                            odispatchedTime = '<div class="order-tracking"><span class="is-complete"></span><p>Dispatched</p></div>';
                                        }
    
                                    } else {
                                        if (orders.dispatchedTime == null) {
                                            odispatchedTime = '';
                                        } else {
                                            odispatchedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Dispatched<br><span>' + moment(orders.dispatchedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    odispatchedTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Dispatched<br><span>' + moment(orders.dispatchedTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.deliveredTime == null) {
                                    if (orders.cancelledTime == null) {
                                        if (orders.dispatchedTime != null) {
                                            odeliveredTime = '<div class="order-tracking current"><span class="is-complete"></span><p>Delivered</p></div>';
                                        } else if (orders.orderType == 4 && orders.preparedTime != null) {
                                            odeliveredTime = '<div class="order-tracking current"><span class="is-complete"></span><p>Delivered</p></div>';
                                        } else {
                                            odeliveredTime = '<div class="order-tracking"><span class="is-complete"></span><p>Delivered</p></div>';
                                        }
    
                                    } else {
                                        if (orders.deliveredTime == null) {
                                            odeliveredTime = '';
                                        } else {
                                            odeliveredTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Delivered<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    odeliveredTime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Delivered<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.deliveredTime == null) {
                                    if (orders.cancelledTime == null) {
                                        if (orders.preparedTime != null) {
                                            opickeduptime = '<div class="order-tracking current"><span class="is-complete"></span><p>Picked Up</p></div>';
                                        } else {
                                            opickeduptime = '<div class="order-tracking"><span class="is-complete"></span><p>Picked Up</p></div>';
                                        }
    
                                    } else {
                                        if (orders.deliveredTime == null) {
                                            opickeduptime = '';
                                        } else {
                                            opickeduptime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Picked Up<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    opickeduptime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Picked Up<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.deliveredTime == null) {
                                    if (orders.cancelledTime == null) {
                                        if (orders.preparedTime != null) {
                                            oservedat = '<div class="order-tracking current"><span class="is-complete"></span><p>Served</p></div>';
                                        } else {
                                            oservedat = '<div class="order-tracking"><span class="is-complete"></span><p>Served</p></div>';
                                        }
    
                                    } else {
                                        if (orders.deliveredTime == null) {
                                            oservedat = '';
                                        } else {
                                            oservedat = '<div class="order-tracking completed"><span class="is-complete"></span><p>Served<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                        }
                                    }
                                } else {
                                    oservedat = '<div class="order-tracking completed"><span class="is-complete"></span><p>Served<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.cancelledTime == null) {
                                    ocancelledTime = '<div class="order-tracking"><span class="is-complete"></span><p>Cancelled</p></div>';
                                } else {
                                    ocancelledTime = '<div class="order-tracking cancelled"><span class="is-complete"></span><p>Cancelled<br><span>' + moment(orders.cancelledTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                }
    
                                if (orders.orderType == 1) {
                                    if (orders.cancelledTime == null) {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odispatchedTime + '' + odeliveredTime + '';
                                    } else {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odispatchedTime + '' + ocancelledTime + '';
                                    }
                                } else if (orders.orderType == 2) {
                                    if (orders.cancelledTime == null) {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + opickeduptime + '';
                                    } else {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                                    }
                                } else if (orders.orderType == 3) {
                                    if (orders.cancelledTime == null) {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + oservedat + '';
                                    } else {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                                    }
                                } else if (orders.orderType == 4) {
                                    if (orders.cancelledTime == null) {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odeliveredTime + '';
                                    } else {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                                    }
                                }
                                feedB += '</div>';
                                feedB += '<ul class="order-buttons">';
                                if(orders.contactNumber != 'NULL' && orders.contactNumber != undefined){
                                    feedB += '<li>';
                                    feedB += '<a href="tel:' + orders.contactNumber + '"><i class="las la-phone"></i> Call Outlet</a>';
                                    feedB += '</li>';
                                } 
                                
                                feedB += '<li>';
                                feedB += '<a href="'+ url +'">View Order</a>'; 
                                feedB += '</li>';
                                feedB += '</ul>'; 
                                feedB += '</div>';
                                feedB += '</div>';
                                feedB += '</div>';
                            }

                            $('#getOrderSiderOverview').html('');
                            $('#getOrderSiderOverview').html(feedB);
                        }
                    }else{
                        $('#show_active_orders').hide();
                    }
                }
            });
        }else{
            $('#show_active_orders').hide();
        }
    }
});


    $(function(){$(".topmove").click(function(){
            $("html,body").animate({scrollTop:$(".top").offset().top},"1000");
            $(".gps-btn-outer").addClass("gps-animation");
            setTimeout(function(){
            $(".gps-btn-outer").removeClass("gps-animation");
            }, 3000);
        })
    })
    $("html").addClass("top");

    function postMessageToPlayer(player, command) {
        if (!player || !command || !player.contentWindow) return;
        player.contentWindow.postMessage(JSON.stringify(command), "*");
    }
    
    function playYouTubeVideo(player, control) {
        switch (control) {
            case "play":
                postMessageToPlayer(player, {
                    "event": "command",
                    "func": "mute"
                });
                postMessageToPlayer(player, {
                    "event": "command",
                    "func": "playVideo"
                });
                break;
            case "pause":
                postMessageToPlayer(player, {
                    "event": "command",
                    "func": "pauseVideo"
                });
                break;
        }
    }
    
    
    function playVideo(video, control) {
        if (video) {
            control === "play" ? video.play() : video.pause();
        }
    }
    
    function playPauseVideo(slick, control) {
        const currentSlide = slick.find(".slick-current");
        if (currentSlide.length === 0) return;
    
        const player = currentSlide.find("iframe").get(0);
    
                playYouTubeVideo(player, control);
    }
    
    
    
    // DOM Ready
    $(document).ready(function() {


        if (typeof pId !== 'undefined'){
            
            if(pId == 7175){
    
                $(".getStoresList").click(function() {
        
                fetchSlug= $(this).data('slug');
                });
        
            }
        }
        else{
            $(".getStoresList").click(function() {
    
            var origin = window.location.origin;
            fetchSlug= $(this).data('slug');
    
            var url= origin + '/client/getStoresName';
            var data='';
            $.ajax({
    
            url:url,
            method:'POST',
            data:{
                slug: $(this).data('slug'),
                pId : pId
            },
    
            success: function(response) {
                var result= JSON.parse(response);
                
                if(result.status == 1)
                {
                    data += '<option value="" selected>Select City</option>';
                if (result.stores) {
                const cities = [...new Set(result.stores.map(store => store.city))];
                var i;
    
                    for (i = 0; i < cities.length; i++) {
                    data += '<option value="' + cities[i] + '">' + cities[i] + '</option>';
                    }
    
    
                }
                $('#citySelector').html('');
                $('#citySelector').html(data);
                }
                
            }
    
            });
    
            });
        }
    
       $("#enterAddressButton").click(function() {
        // Hide the "getStoreList" modal
          $("#locationfetchmodal").modal("hide");
        });
        
        $('#enteraddressItem').on('hidden.bs.modal', function () {
            $('.outletitem_newList').addClass('d-none');
            $('#locationitem_emptyImage').removeClass('d-none');
            $('#notServiceitem_image').addClass('d-none');
            $('#searchitem_locality_new').val('');
        });
        
        $('#locationfetchmodal').on('hidden.bs.modal', function () {
            $('#error-msg-show').addClass('d-none');
        });


        $('.video').each(function(el){
            var _this = $(this);
            _this.on('mouseover', function(ev) {
         
              _this[0].src += "&autoplay=1";
              ev.preventDefault();
        
            });
          });
    
        const slideWrapper = $(".main-slider");
    
        if(slideWrapper.length > 0)
        {
            // Initialize
            slideWrapper.on("init", function (slick) {
                const slickSlider = $(slick.$slider);
                setTimeout(function () {
                    playPauseVideo(slickSlider, "play");
                }, 1000);
            });
    
            slideWrapper.on("beforeChange", function (event, slick) {
                const slickSlider = $(slick.$slider);
                playPauseVideo(slickSlider, "pause");
            });
    
            slideWrapper.on("afterChange", function (event, slick) {
                const slickSlider = $(slick.$slider);
                playPauseVideo(slickSlider, "play");
            });
        }
    });

    function openModalAndToggleTab()
    {
		var orderType = localStorage.getItem('orderType');
  		if(orderType != 2){
				$('#pickuploca').html('');
				$('#pickupcity').html('');
				$('#pickupbusi').html('the outlet.');
				$('#pickupmodal').modal('show');
		}
    }

    function openPromoModal(index) {

        if (typeof promoCodes !== 'undefined'){
            var promoCode= promoCodes;
    
            var pData= promoCode[index];
            var l = '' + pData.code + '';
        
            var promodetail = '<h4>' + pData.title + '</h4>';
            if (pData.description != null && pData.description != 'null' && pData.description != '') {
                promodetail += '<p>' + pData.description + '</p>';
            }
        
        
            $('#copytxt').html("");
            $('#copytxt').val(l);
            $('#promo-d').html("");
            $('#promo-d').html(promodetail);
        
            $('#promomodal').modal('show');
        }
        
    }
    
    /*Promo Code*/
    function copyText() {
        /* Get the text field */
        var copyText = document.getElementById("copytxt");
            copyText.select();
    
            /* Copy the text inside the text field */
            document.execCommand("copy");
        
            /* Alert the copied text */
            $('#suceess').modal('show');
            $('#sucess-msg').html('Promo Code Copied!');
            setTimeout(function() {
                $('#suceess').modal('hide')
            }, 2000);
        
            // copyText.select(false);
            copyText.blur();
            window.getSelection().removeAllRanges();
        
        
    
    }

    function expand_detail_description(id) {
		$('.less_desc' + id).addClass('d-none');
		$('.more_desc' + id).removeClass('d-none');
	}

	function collapse_detail_description(id) {
		$('.less_desc' + id).removeClass('d-none');
		$('.more_desc' + id).addClass('d-none');
	}

    function openOrderItemPage(storeSlug,locality = '',city = '') {
        if (storeSlug != '') {
            
            const dataId = fetchSlug;
            
            if(typeof webengage_tag == "function"){

                webengage.track("Location Selected", {
                    "City" : city,
                    "Locality" : locality
                });
            }

            var url = origin + "/order/" + storeSlug + "?itemid=" + dataId;
            window.location.href = url;
        }

    }


    function CurrentItemAddress() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getitem_location, getitem_error);
        }
    }

    function getitem_error(error) {
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
        }
        $('#error-msg-show').removeClass('d-none');
        $('#error-msg-show').html(errorMessage);

    }

    function getitem_location(location) {

        $('#error-msg-show').addClass('d-none');
        var lat = location.coords.latitude;
        var long = location.coords.longitude;

        var storedValue = localStorage.getItem("searchLocalityInput");
        if (storedValue) {
            localStorage.removeItem("searchLocalityInput");
        }

        var locationValues = [lat, long];

        localStorage.setItem("searchLocalityInput", JSON.stringify(locationValues));

        const itemSlug = fetchSlug;

        $.ajax({
            url: origin + '/client/locateOneNearestStore?businessId=' + pId + '&lat=' + lat + '&lng=' + long + '&itemSlug=' + itemSlug ,
            type: 'GET',
            dataType: 'JSON',
            success: function(data) {
                if (data['status'] == 1) {
                    let outlets = data['data'];
                    if (outlets.length > 0) {
                    
                        openOrderItemPage(outlets[0]['web_slug'],outlets[0]['locality'],outlets[0]['city']);
                        $('#locationfetchmodal').modal('hide');

                    } 
                }else{
                    $('#error-msg-show').removeClass('d-none');
                    $('#error-msg-show').html(data['error']);
                }

            }
        });
    }

function handlePincodeApiCall(pincode_data = '') {
        if(pincode_data == ''){
          var pincode = $('#search_pincode').val();
          var pincodePattern = /^\d{6}$/;
    
          if(pincode == '' || !pincodePattern.test(pincode)){
            $('#notService_imagepincode').show();
            $('#errorpincode_text').html('');
            $('#errorpincode_text').html('Please enter a valid pincode');
            return false;
          }

        }else{
            var pincode = pincode_data;
        }
        
    
            $.ajax({
                url: origin + '/client/matchPinCodeData',
                type: 'POST',
                data: { pincode: pincode , businessId: pId},
                dataType:"json",
                success: function(response) {
                    
                    if(response['status'] == 1 && response['data']['pincodeData'] != false && response['data']['pincodeData']?.length > 0){
                        var data = response?.data;
                        $('#notService_imagepincode').hide();
                        $('#search_pincode').val('');
                        $('#notService_image').hide();
                        $('#location_emptyImage').hide();
                        var slug = data['businessData'][0]['slug'];
                        $('#enterpincode').modal('hide');
                        window.location.href = origin + '/order/' + slug;
                    }else{
                        $('#notService_imagepincode').show();
                        $('#errorpincode_text').html('');
                        $('#errorpincode_text').html('Not Delivering to this area');
                    }
    
                },
                error: function(error) {
                    $('#notService_imagepincode').hide();
                    alert('Error:', error);
                }
            });
        
    }

    $('#enterpincode').on('hidden.bs.modal', function () {
        $('#search_pincode').val('');
        $('#notService_imagepincode').hide();
    });
    

        $('.your-slider-class').on('init', function(event, slick) {
            $(this).removeClass('invisible');
        })

        $('.your-slider-class').on('init', function(event, slick) {
            $(this).removeClass('invisible');
        })

/*navigation dropdown navbar*/
$(document).ready(function(){	
    if ($(window).width() <= 991) {
    $(".site-nav .fl").on('click', function(event) {
        var $fl = $(this);
        $(this).parent().siblings().find('.submenu').slideUp();
        $(this).parent().siblings().find('.fl').addClass('la-angle-right');       
        if($fl.hasClass('la-angle-right')){
        $fl.removeClass('la-angle-right').addClass('la-angle-down');
        }else{
        $fl.removeClass('la-angle-down').addClass('la-angle-right');
        }
        $fl.next(".submenu").slideToggle();
    });
    }
});
/*navigation dropdown navbar*/