var readSMS = 0;
var pwa = 'web';
var tryCount = 0;
var uagent = navigator.userAgent;
var domain = window.location.hostname;
var testing = 0;
var truecallerRequestId = '';
var pollingCount = 0;
var cMappingId;
var pId;
var origin = window.location.origin;
document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById("DateOfBirth").setAttribute("max", today);
    document.getElementById("AniversaryLabel").setAttribute("max", today);
});

if (uagent.indexOf('AppContainer') !== -1) {
    pwa = 'paytm';
    $('.paymentsBlock').hide();
    $('.linkBlock').hide();
    var truecallerBTNElement = document.getElementById('truecallerBTN');
    var truecallerOrElement = document.getElementById('truecallerOr');

    if (truecallerBTNElement) {
        truecallerBTNElement.style.display = 'none';
    }
    if (truecallerOrElement) {
        truecallerOrElement.style.display = 'none';
    }
    if (document.getElementById("foot") != null) {
        document.getElementById("foot").innerHTML = "Made with Love in India by <a style='color:#fff'> Uengage</a>";
    }

}

function scrollFunction() {
    var mybutton = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
if (document.querySelector('.wrapper-menu')) {
    var wrapperMenu = document.querySelector('.wrapper-menu');

    wrapperMenu.addEventListener('click', function() {
        wrapperMenu.classList.toggle('open');
    });

}

if ('OTPCredential' in window) {
    window.addEventListener('DOMContentLoaded', e => {
        // alert("hhhh"); 
        const pId = "<?php echo $pId;?>";
        const input = document.querySelector('input[autocomplete="one-time-code"]');
        if (!input) return;
        const ac = new AbortController();
        //      const form = input.closest('form');
        //      if (form) {
        //        form.addEventListener('submit', e => {
        //          ac.abort();
        // alert
        //        });
        // }
        // alert(pId);
        // alert(pId);
        if (readSMS == 1) {
            navigator.credentials.get({
                otp: {
                    transport: ['sms']
                },
                signal: ac.signal
            }).then(otp => {
                // alert(pId);
                // alert(otp.code);
                input.value = otp.code;
                validateOTP(pId);
                //  if (form) form.submit();
                // console.log(otp);
            }).catch(err => {
                console.log(err);
            });
        }

    });
}

var gtm_items = [];
var value;

$(document).ready(function() {

    $('.current_currency').html(function(index, oldHtml) {
       
        return currency + '' + oldHtml ;
    });

    if (localStorage.getItem('userdata') &&
        localStorage.getItem('userdata') != '' &&
        localStorage.getItem('business') &&
        localStorage.getItem('business') != '' && typeof showCartIcon != 'undefined' && showCartIcon == 1) {

        var businessId = JSON.parse(localStorage.getItem('business'));
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];
        var post_param = {};
        post_param.businessId = businessId;
        post_param.contactMappingId = contactMappingId;
        var url = window.location.origin + "/client/getItemsCount";
        $.ajax({
            url: url,
            type: "POST",
            data: post_param,
            dataType: "json",
            async: false,
            success: function(response) {


                // Fetch the status and qty values
                var status = response.status;
                if (status == 1) {
                    var result= response.result;
                    if(typeof pId != 'undefined' &&  pId == 7175){
                    $.each(result, function(index, res) {
                        var a= {};
                        a['item_id']= res.ppItemId;
                        a['itemName']= res.itemName;
                        a['quantity']= res.qty;
                        gtm_items.push(a);
                    });
                    }else{
                        $.each(result, function(index, res) {
                            var a= {};
                            a['item_id']= res.itemId;
                            a['itemName']= res.itemName;
                            a['quantity']= res.qty;
                            gtm_items.push(a);
                        });
                    }
                    value = result.reduce((total, item) => total + parseInt(item.price), 0);
                    var qty = result.reduce((total, item) => total + parseInt(item.qty), 0);
                    if(qty > 0)
                    {
                        $('#cart_icons').removeClass('d-none');
                        $('#cartsItemCounts').html(qty);
                        $('body .search-icon-dv > span').text(qty);
                    }else {
                        $('#cart_icons').removeClass('d-none');
                        $('#cartsItemCounts').html("0");
                        // $('body .search-icon-dv').hide();
                        $('body .search-icon-dv > span').text(0);

                    } 
                }else {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html("0");
                    // $('body .search-icon-dv').hide();

                }
            }
        });

    } else {

        if (localStorage.getItem('itemList') && localStorage.getItem('itemList') != '' 
        && localStorage.getItem('business') && localStorage.getItem('business') != '' && typeof showCartIcon != 'undefined' && showCartIcon == 1) {
            var jsonArray = JSON.parse(localStorage.getItem('itemList'));
            var businessId = JSON.parse(localStorage.getItem('business'));
            const matchingObject = jsonArray.find(obj => obj.bId == businessId);

            if (matchingObject) {
                let qtySum = matchingObject.items.reduce((total, item) => total + item.qty, 0);
                value = matchingObject.items.reduce((total, item) => total + parseFloat(item.sp), 0);
                    if(pId == 7175){
                        matchingObject.items.forEach(item => {
                            const itemId = item.itemId;
                            const index = gtm_items.findIndex(existingItem => existingItem.item_id === itemId);

                            if (index === -1) {
                                gtm_items.push({
                                    item_id: itemId,
                                    item_name: item.itemName,
                                    quantity: parseInt(item.qty),
                                });
                            } else {
                                gtm_items[index].quantity += parseInt(item.qty);
                            }
                        });
                        }else{
                        matchingObject.items.forEach(item => {
                            const itemId = item.itemId;
                            const index = gtm_items.findIndex(existingItem => existingItem.item_id === itemId);

                            if (index === -1) {
                                gtm_items.push({
                                    item_id: itemId,
                                    item_name: item.itemName,
                                    quantity: parseInt(item.qty),
                                });
                            } else {
                                gtm_items[index].quantity += parseInt(item.qty);
                            }
                        });
                        }
                if (qtySum > 0) {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html(qtySum);
                    $('body .search-icon-dv > span').text(qtySum);
                } else {
                    $('#cart_icons').removeClass('d-none');
                    $('#cartsItemCounts').html("0");
                    
                    $('body .search-icon-dv > span').text(0);
                    // $('body .search-icon-dv').hide();

                }

            }



        }

    }

    $('#search-modal').on('shown.bs.modal', function() {
        $('#searchText').focus();
    })

    $('#faqsmodal').on('shown.bs.modal', function() {

        if(typeof webengage_tag == "function"){

            webengage.track("Link Clicked",{
                "Link Clicked" : "FAQs"
            });
        }
    });

    $('#raseaconcern').on('shown.bs.modal', function() {

        if(typeof webengage_tag == "function"){

            webengage.track("Link Clicked",{
                "Link Clicked" : "Raise a Concern"
            });
        }
    });

    $('.emailLink').on('click', function(event) {
        if(typeof webengage_tag == "function"){

            webengage.track("Contact Clicked",{
                "Medium" : "Email",
                "Value" :  outlet_email
            });
        }
    });

    $('.mobileLink').on('click', function(event) {
        if(typeof webengage_tag == "function"){

            webengage.track("Contact Clicked",{
                "Medium" : "Phone",
                "Value" :  outlet_contact
            });
        }
    });


    $('.fb_link').on('click', function(event) {
        if(typeof webengage_tag == "function"){

            webengage.track("Social Media Viewed",{
                "Platform" : "Facebook"
            });
        }
    });

    $('.ig_link').on('click', function(event) {
        if(typeof webengage_tag == "function"){

            webengage.track("Social Media Viewed",{
                "Platform" : "Instagram"
            });
        }
    });
    
    

    $(".search-btn").click(function() {
        $("#search-bar").slideToggle("fast");
        $('#searchText').focus();
    });

    $("section").click(function() {
        $(".navbar-collapse").removeClass("show");

    });

    $("section").click(function() {
        $(".wrapper-menu").removeClass("open");
    });

    // $(".nav-icon").click(function(){
    //    $(this).toggleClass("nav-icon-active")
    // });

    $(".btn-left-menu").click(function() {
        $(".left-panel").css("height", "100%");
    });
    $(".menu-close").click(function() {
        $(".left-panel").css("height", "0");
    });



    // $(".od-right .order-option a").click(function(e){
    //    $(".order-option a").removeClass("active");
    //    $(this).addClass("active");
    // });
    $('.qty-increase').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($('#qty-input').val());
        $('#qty-input').val(quantity + 1);
        $(".price").text(price * 2);
    });
    $('.qty-decrease').click(function(e) {
        e.preventDefault();
        var quantity = parseInt($('#qty-input').val());
        if (quantity > 0) {
            $('#qty-input').val(quantity - 1);
        }
    });

    if (/android/i.test(uagent)) {
        $('#android_detect').removeClass('d-none');
    }else{
        $('#android_detect').addClass('d-none');
    }

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        $('#ios_detect').removeClass('d-none');
    }else{
        $('#ios_detect').addClass('d-none');
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
    if(typeof enable_active_reservations != 'undefined' && enable_active_reservations == 1 && typeof pId !== 'undefined' && pId !== null){
        if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != undefined) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            var contactMappingId = userData['contactMappingId'];
            var token = userData['token'];
            $.ajax({
                url: origin + `/client/getReservationList?contactMappingId=${contactMappingId}&pId=${pId}&businessId=${pId}`,
                type: "GET",
                headers: {
                    'TOKEN': token
                },
                dataType: "json",
                success: function(result) {
                    if (result['status'] == 1 && result['list'].length > 0) {
                        var currentTime = new Date();
                       
                        var feed = result['list'];
                        if (feed.length > 0) {
                            
                           
                            var reservationHTML = '';

                            for (var i = 0; i < result['list'].length; i++) {
                                var dataDetail = result['list'][i];
                                var scheduledAt = new Date(dataDetail['scheduledAt']).getTime();
                              
                            
                                const scheduledDate = new Date(scheduledAt);
                                const twoHoursLater = new Date(scheduledAt + 2 * 60 * 60 * 1000);
                                var status = parseInt(dataDetail['status'], 10);
                                var statusDiv = '';
                                var ctaOptions = ``;
                                var downPrompt = ``;
                                var url = origin + "/past-reservations/" + dataDetail.appointmentId;
                            
                                if (currentTime < twoHoursLater) {
                                    if (status == -1) {
                                        ctaOptions = ` 
                                            <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                          
                                        `;
                                        downPrompt = ` <div class="reservation-bottom"><p class="mb-0">Waiting for confirmation from the outlet</p></div>`;
                                    }
                            
                                    if (dataDetail.uengage_pay == 1) {
                                        if (currentTime >= scheduledAt && currentTime <= twoHoursLater) {
                                            downPrompt = ` <div class="reservation-bottom"><p class="mb-0">Pay bill between ${formatTime(scheduledDate)} to ${formatTime(twoHoursLater)}</p></div>`;
                                            ctaOptions = `<a class="direction-btn" href="/direct-pay/${dataDetail.slug}">Direct Pay</a>`;
                                        } else {
                                            if (status != -1 && status != 3) {
                                                downPrompt = ` <div class="reservation-bottom"><p class="mb-0">Pay bill between ${formatTime(scheduledDate)} to ${formatTime(twoHoursLater)}</p></div>`;
                                            }
                                            ctaOptions = ` 
                                                <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                              
                                            `;
                                        }
                                    } else {
                                        ctaOptions = ` 
                                            <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                          
                                        `;
                                    }
                            
                                    switch (status) {
                                        case -1:
                                            statusDiv = `<span class="process">Pending</span>`;
                                            break;
                                        case 0:
                                            statusDiv = `<span class="process" style="background-color: #e4f7e4;color:#00A953;">Confirmed</span>`;
                                            break;
                                        case 1:
                                            statusDiv = `<span class="process" style="background-color: #e4f7e4;color:#00A953;">Served</span>`;
                                            break;
                                        case 3:
                                            statusDiv = `<span class="process" style="background-color: ##FBF4F3;color:#ff4444;">Rejected</span>`;
                                            break;
                                        case 4:
                                            statusDiv = `<span class="process">Noshow</span>`;
                                            break;
                                        default:
                                            statusDiv = `<span class="process">Pending</span>`;
                                            break;
                                    }
                            
                                    var data = `
                                    <div class="reservation-card">
                        <div class="reservation-card-start">
                            <div class="reservation-top d-flex">
                                <div class="reservation-left">
                                    <p class="level-one-para mb-2 d-flex align-items-center"><span><svg fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_138_433)"><path clip-rule="evenodd" d="M4.33725 0.729126H9.66273C9.99521 0.729116 10.2775 0.729107 10.5108 0.753227C10.7592 0.77891 10.9888 0.834677 11.2056 0.968709C11.4225 1.10274 11.575 1.28312 11.7091 1.4938C11.835 1.69169 11.9612 1.94419 12.1099 2.24159L12.1195 2.26081C12.1252 2.27215 12.1304 2.28373 12.135 2.29553L12.9538 4.36528C13.0512 4.61156 13.1592 4.9188 13.1908 5.23321C13.2231 5.5548 13.1787 5.92321 12.9268 6.24273C12.7206 6.5041 12.434 6.70028 12.1042 6.79366V12.3958H12.8334C13.075 12.3958 13.2709 12.5917 13.2709 12.8333C13.2709 13.0749 13.075 13.2708 12.8334 13.2708H1.16669C0.925062 13.2708 0.729187 13.0749 0.729187 12.8333C0.729187 12.5917 0.925062 12.3958 1.16669 12.3958H1.89585V6.79369C1.56596 6.70032 1.27934 6.50413 1.07321 6.24273C0.821233 5.9232 0.776915 5.55479 0.809209 5.2332C0.840781 4.9188 0.948746 4.61155 1.04617 4.36528L1.86495 2.29553C1.86961 2.28373 1.87479 2.27215 1.88046 2.26081L1.89008 2.24156C2.03876 1.94418 2.165 1.69168 2.2909 1.4938C2.42496 1.28312 2.5775 1.10274 2.79437 0.968708C3.01123 0.834677 3.24079 0.77891 3.48918 0.753227C3.72247 0.729107 4.00477 0.729116 4.33725 0.729126ZM10.5 6.35098C10.696 6.55858 10.9467 6.71388 11.2292 6.79376V12.3958H8.89585L8.89585 10.7728C8.89586 10.5163 8.89587 10.295 8.87941 10.1134C8.86201 9.92139 8.82348 9.73125 8.72001 9.55204C8.60482 9.35252 8.43913 9.18683 8.2396 9.07164C8.0604 8.96817 7.87026 8.92964 7.67823 8.91223C7.49665 8.89578 7.27537 8.89578 7.01883 8.89579H6.98122C6.72468 8.89578 6.50339 8.89578 6.32181 8.91223C6.12978 8.92964 5.93964 8.96817 5.76044 9.07164C5.56091 9.18683 5.39522 9.35252 5.28003 9.55204C5.17656 9.73125 5.13803 9.92139 5.12063 10.1134C5.10417 10.295 5.10418 10.5163 5.10419 10.7728L5.10419 12.3958H2.77085V6.79373C3.05326 6.71384 3.30401 6.55855 3.49997 6.35098C3.79245 6.66078 4.20696 6.85413 4.66664 6.85413C5.12631 6.85413 5.54083 6.66078 5.8333 6.35098C6.12578 6.66078 6.54029 6.85413 6.99997 6.85413C7.45965 6.85413 7.87416 6.66078 8.16664 6.35098C8.45911 6.66078 8.87363 6.85413 9.3333 6.85413C9.79298 6.85413 10.2075 6.66078 10.5 6.35098ZM5.97919 12.3958H8.02085V10.7916C8.02085 10.511 8.02043 10.3297 8.00799 10.1924C7.99608 10.0611 7.976 10.0134 7.96224 9.98954C7.92384 9.92304 7.86861 9.86781 7.8021 9.82941C7.77827 9.81565 7.73059 9.79556 7.59925 9.78366C7.4619 9.77121 7.28067 9.77079 7.00002 9.77079C6.71937 9.77079 6.53814 9.77121 6.40079 9.78366C6.26945 9.79556 6.22177 9.81565 6.19794 9.82941C6.13143 9.86781 6.0762 9.92304 6.0378 9.98954C6.02404 10.0134 6.00396 10.0611 5.99205 10.1924C5.97961 10.3297 5.97919 10.511 5.97919 10.7916V12.3958ZM3.93747 5.24996C3.93747 5.65267 4.26393 5.97913 4.66664 5.97913C5.06934 5.97913 5.3958 5.65267 5.3958 5.24996C5.3958 5.00834 5.59168 4.81246 5.8333 4.81246C6.07493 4.81246 6.2708 5.00834 6.2708 5.24996C6.2708 5.65267 6.59726 5.97913 6.99997 5.97913C7.40268 5.97913 7.72914 5.65267 7.72914 5.24996C7.72914 5.00834 7.92501 4.81246 8.16664 4.81246C8.40826 4.81246 8.60414 5.00834 8.60414 5.24996C8.60414 5.65267 8.9306 5.97913 9.3333 5.97913C9.73601 5.97913 10.0625 5.65267 10.0625 5.24996C10.0625 5.00834 10.2583 4.81246 10.5 4.81246C10.7416 4.81246 10.9375 5.00834 10.9375 5.24996C10.9375 5.65267 11.2639 5.97913 11.6666 5.97913C11.8988 5.97913 12.1055 5.87114 12.2397 5.7009C12.3062 5.61663 12.3383 5.50134 12.3202 5.32062C12.3013 5.13273 12.2319 4.91906 12.1402 4.68715L11.3284 2.6351C11.1722 2.32282 11.0679 2.11599 10.9709 1.96353C10.8775 1.81687 10.8107 1.75324 10.7456 1.71303C10.6805 1.67282 10.5937 1.64147 10.4208 1.62359C10.2378 1.60467 10.001 1.60413 9.64122 1.60413H4.35877C3.99896 1.60413 3.76217 1.60467 3.57917 1.62359C3.40626 1.64147 3.31944 1.67282 3.25438 1.71303C3.18932 1.75324 3.12245 1.81687 3.02913 1.96353C2.93212 2.11599 2.82776 2.32282 2.67159 2.6351L1.85982 4.68715C1.76808 4.91907 1.6987 5.13273 1.67983 5.32063C1.66168 5.50135 1.69382 5.61665 1.76028 5.70092C1.89451 5.87114 2.10116 5.97913 2.3333 5.97913C2.73601 5.97913 3.06247 5.65267 3.06247 5.24996C3.06247 5.00834 3.25835 4.81246 3.49997 4.81246C3.74159 4.81246 3.93747 5.00834 3.93747 5.24996Z" fill="#222222" fill-rule="evenodd"></path></g><defs><clipPath id="clip0_138_433"><rect fill="white" height="14" width="14"></rect></clipPath></defs></svg></span> ${dataDetail['locality']}, ${dataDetail['city']}</p>
                                    <p class="mb-2 align-items-center d-flex level-two-para">${formatReserveDateTime(dataDetail['scheduledAt'])}</p>
                                    <div class="d-flex align-items-center">
                                        <p class="mb-0 level-three-para"> ${dataDetail['pax'] > 1 ? dataDetail['pax'] + ' Guests' : dataDetail['pax'] + ' Guest'}</p> <p class="d-inline-block ml-2 level-three-para mb-0">| ${statusDiv}</p> 
                                    </div>
                                </div>
                                <div class="reservation-right text-right">
                                   ${ctaOptions}
                                    <div class="anker-btns-home">
                                        <a class="call-btn mr-1" href="tel:${dataDetail['outletContact']}"><span>Call</span></a>
                                        <a class="call-btn ml-1" href="${url}"><span>Details</span></a>
                                    </div>
                                </div>
                            </div>
                            
                                    ${downPrompt}
                            
                        </div>
                    </div>
                                    
                   `;
                                    reservationHTML += data;
                                }
                            }
                            
                            if(reservationHTML.trim() !== ''){
                                $('#show_active_reservations').show();
                                $('#getReservationSiderOverview').html(reservationHTML);
                            }
                            
                        }
                    }else{
                        $('#show_active_reservations').hide();
                    }
                }
            });
        }else{
            $('#show_active_reservations').hide();
        }
    }
});
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
function formatReserveDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);

    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const time = date.toLocaleString('en-US', options);

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });

    return `${time}, ${day} ${month}`;
}

function checkout() {

    var slug = localStorage.getItem('slug');
    var orderType = localStorage.getItem('orderType');

    if(gtm_items .length > 0){
        if (typeof gtm_tag == "function") {

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "view_cart",
                'ecommerce': {
                    'currency': "INR",
                    'value': value,
                    'items': gtm_items
                }
            });
        }
    }
    if(slug == '' || slug == null){
        slug = 'online-order';
        window.location.href = "/" + slug;
        return;
    }
    if (slug.startsWith('order/')) {
        window.location.href = "/" + slug;
    }else if (slug.startsWith('reservation/')) {
        window.location.href = "/" + slug;
    }else if(orderType == 5){
        window.location.href = "/reservation/" + slug;
    } else {
        window.location.href = "/order/" + slug;
    }
}

(function(window, $) {
    $(function() {
        $('.btn').on('click', function(event) {
            // event.preventDefault();
            var $btn = $(this),
                $div = $('<div/>'),
                btnOffset = $btn.offset(),
                xPos = event.pageX - btnOffset.left,
                yPos = event.pageY - btnOffset.top;
            $div.addClass('ripple-effect');
            $div
                .css({
                    height: $btn.height(),
                    width: $btn.height(),
                    top: yPos - ($div.height() / 2),
                    left: xPos - ($div.width() / 2),
                    background: $btn.data("ripple-color") || "#fff"
                });
            $btn.append($div);
            window.setTimeout(function() {
                $div.remove();
            }, 2000);
        });
    });
})(window, jQuery);


$(document).ready(function() {
    if(localStorage.getItem("userdata") && localStorage.getItem("userdata") != '' && localStorage.getItem("userdata") != null){

        $('body #payBtn').show();
        $('body #reservation_button').show();
    }else{
        $('body #loginBtnPay').show();
        $('body #reservation_button_check_login').show();
    }

    if (typeof(Storage) !== "undefined") {
        if (!localStorage.getItem('userdata') || localStorage.getItem('userdata') == '') {
            $('body #lgBtn').show();
            $('body #loginBtn').hide();
            $('.accountdvlogin').show();
            $('#welLgBTN').hide();
            $('.accountdv').hide();
            $('.walletShow').hide();
            $('.walletGuest').show();
            $('#showRaiseConcern').hide();
        } else {
            $('body #lgBtn').hide();
            $('body #loginBtn').show();
            $('.accountdvlogin').hide();
            var userData = JSON.parse(localStorage.getItem('userdata'));
            $('#welLgBTN').show();
            $('.accountdv').show();
            $('.walletShow').show();
            $('.walletGuest').hide();
            $('#showRaiseConcern').show();
            //  $('#welLgBTN').html('Welcome '+userData.name)

        }
    } else {
        $('#lgBtn').show();
        $('#showRaiseConcern').hide();
        $('.accountdvlogin').show();
    }

});




// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    $('html,body').animate({
        scrollTop: 0
    }, 'slow');

}

function openLogin() {

    if(typeof webengage_tag == "function"){

        webengage.track("Link Clicked",{
            "Link Clicked" : "Login"
        });
    }

    if (pwa == 'paytm') {
        //   alert("paytm");
        tryCount = 0;
        paytmLogin();
    } else {
        $('#mobileNo').val('');
        $('#email_Id').val('');
        $('#validateOTP, #OTP').hide();
        $('#sendOTP').show();
        $('#resendOTP').hide();
        $(".submit_btn").addClass("disable");
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

}

function checkLogin(ecomm, cBID) {
    if (!localStorage.getItem('userdata') || localStorage.getItem('userdata') == '') {
        openLogin();
        return;
    } else {
        if (ecomm == 1) {
            var url = window.location.origin + "/checkout/" + cBID + "/1";
            window.location.href = url;
            return;
        }

    }

}

$('#mobileNo, #OTP').keypress(function(e) {
    return isNumber(e);
});



function sendOTP(pId) {
    var mobileNo = $('#mobileNo').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }
    var recaptchaResponse='';
    if(reCaptcha==1){
        recaptchaResponse = grecaptcha.getResponse();

        if (!recaptchaResponse) {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("Please complete the reCAPTCHA.");
            errormodalhide();
            return;
        }
    }else{
        recaptchaResponse='';
    }
    
    var url = origin + "/client/login/" + mobileNo + "/" + pId ;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: {"recaptchaResponse": recaptchaResponse},
        success: function(result) {
            
                if(result.status == 0){
                    $('#promonotapplied').modal('show');
                    $('#promonotmsg').html(result.msg);
                    errormodalhide();
                    if(result['msg'] != 'Cannot Resend OTP Again.Please wait for sometime'){
                        return;
                    }
                }
                readSMS = 1;
                $('#enter_number').html(mobileNo);
                $('#verifyotp').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#verifyotp').modal('show');
                $('#loginModal').modal('hide');
                $('#validateOTP').show();
                setTimeout(function() {
                    $('#resendOTP').show()
                }, 30000);
                $('#sendOTP').hide();
                $('#OTP').show();
                $('#truecallerOr').hide();
                $('#truecallerBTN').hide();
                //$('#mobileNo').attr('readonly',true);
                if (result['status'] == 0){
                    $('#promonotapplied').modal('show');
                    $('#promonotmsg').html(result['msg']);
                    errormodalhide();
                }else{
                    /*$('#promoapplied').modal('show');
                    $('.promors').html(result['msg']);
                    setTimeout(function() {
                        $('#promoapplied').modal('hide')
                    }, 2500);*/
                }

                if (typeof gtag == "function") {

                    // console.log(tag);
                    gtag('event', 'send_otp');
                }

                // $('#closeLoginModal').hide();
                //setTimeout(function() { $('#resendOTP').show(); }, 60000);
            
        }
    });
}

function sendEmailOTP(pId) {
    var email_Id = $('#email_Id').val();
    if (email_Id == '') {
        //   showAlert('');
        $('#errorMessageLogin').html('');
        $('#errorMessageLogin').html("Kindly Enter Valid Email Id");
        $("#danger-alert-login").fadeTo(2000, 500).slideUp(500, function() {
            $("#danger-alert-login").slideUp(500);
        });
        return false;
        //   return false;
    }
    var url = origin + "/email_login/login?email=" + email_Id + "&businessId=" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
           if (result['status'] == 0) {
                //   showAlert();
                $('#verifyotp').modal('hide');
               $('#loginModal').modal('show');
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            } else {
                $('#email_enter').html(email_Id);
                $('#emailverifyotp').modal('show');
                $('#emailverifyotp').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#loginModal').modal('hide');
                cMappingId = result['contactIdMappingId'];
                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
            }
        }
    });
}

function resendOTP(pId) {
    var mobileNo = $('#mobileNo').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }
    var mobileNo = $('#mobileNo').val();
    var url = origin + "/client/login/" + mobileNo + "/" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            } else {

                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
            }
        }
    });

}

function errormodalhide() {
    setTimeout(function() {
        $('#promonotapplied').modal('hide')
    }, 2500);
}

let userClickedWalletGuest = false;

// Add a click event listener to the element with class "walletGuest"
$('.walletGuest').click(function() {
  
  userClickedWalletGuest = true;
  openLogin();
});

function validateOTP(pId) {

    if (window.SMS) {
        document.addEventListener('onSMSArrive', function(e) {
            var sms = e.data;
            // Check if the SMS message contains an OTP code
            var otpRegex = /(\d{6})/;
            var match = sms.body.match(otpRegex);
            if (match) {
                var code = match[1];
                $('#OTP').val(code).trigger('keyup');
            }
        });
    }

    var mobileNo = $('#mobileNo').val();
    var OTP = '';
    $('.passcode-wrapper input').each(function() {
        OTP += $(this).val();
    });
    //var OTP = $('#OTP').val();
    if (mobileNo == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobileNo.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide()
        return false;
    }

    if (OTP == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter OTP.");
        errormodalhide();
        return false;
    }

    if (OTP.length != 6) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("OTP should be 6 digits only.");
        errormodalhide()
        return false;
    }


    var url = origin + "/client/validateMobileByOTP/" + mobileNo + "/" + OTP + "/" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                // Show error modal
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            }
             else {
                $('#promoapplied').modal('show');
                $('.promors').html('Login Successful');
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
                if (typeof gtag == "function") {

                    // console.log(tag);
                    gtag('event', 'login_success');
                }


                if (typeof fbq == "function") {
                    fbq('track', 'CompleteRegistration');
                }

                

                

                readSMS = 0;
                var userdata = {
                        contactId: result['rows']['contactId'],
                        token: result['rows']['token'],
                        contactMappingId: result['rows']['contactMappingId'],
                        mobile: mobileNo,
                        name: result['rows']['name'],
                        email: result['rows']['email'],
                        dob: result['rows']['dob'],
                        gender: result['rows']['gender'],
                        anniversary: result['rows']['anniversary'],
                        married: result['rows']['married']
                    }
                    // userdata=;

                    if (typeof webengage_tag == "function") {

                        if(result['rows']['newUser'] == 1){

                            webengage.track("Customer Registered",{
                                "Phone Number" : mobileNo
                            });

                        }
                        webengage.user.login('+91'+ mobileNo);
                        webengage.user.setAttribute('we_phone', '+91'+ mobileNo);
                        if(userdata.email != null && userdata.email != '' && userdata.email != "null"){
                            webengage.user.setAttribute('we_email', userdata.email);
                        }
                        if(userdata.gender != null && userdata.gender != '' && userdata.gender != "null"){
                            var gender = userdata.gender.toLowerCase();
                            webengage.user.setAttribute('we_gender', gender);
                        }
                        if(userdata.dob != null && userdata.dob != '' && userdata.dob != "null"){
                            webengage.user.setAttribute('we_birth_date', userdata.dob);
                        }
                        if(userdata.anniversary != null && userdata.anniversary != '' && userdata.anniversary != "null"){
                            webengage.user.setAttribute('we_anniversary_date', userdata.anniversary);
                        }
                        if(userdata.name != null && userdata.name != '' && userdata.name != "null"){
                            webengage.user.setAttribute('we_first_name', userdata.name);
                        }

                        webengage.user.setAttribute('we_whatsapp_opt_in', true);
                    }

                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#mobileNo').val('');
                $('#validateOTP, #OTP').hide();
                $('#sendOTP').show();
                $('#resendOTP').hide();
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletGuest').hide();
                $('.walletShow').show();
                $('body #loginBtnPay').hide();
                $('body #payBtn').show();
                $('body #reservation_button_check_login').hide();
                $('body #reservation_button').show();

                if(result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == "null"){
                    document.getElementById("namevalue").innerText = "User";
                }else{
                    document.getElementById("namevalue").innerText = result['rows']['name'];
                }
                
                document.getElementById("emailvalue").innerText = result['rows']['email'];



                if ((result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == 'user' || result['rows']['name'] == 'User') && !localStorage.getItem('userProfile')) {
                    if (result['rows']['email'] != null && result['rows']['email'] != 'null' && result['rows']['email'] != '') {
                        $('#uEmail').val(userdata['email']);
                    }
                    $('#updateProfileModal_new').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    localStorage.setItem('userProfile',true);
                }

                if (userClickedWalletGuest) {
                    window.location.href = origin + '/wallet';
                  }

                if (window.location.href.endsWith("wallet")) {
                    // Refresh the page
                    location.reload();
                }

                if (window.location.pathname.indexOf("nps") > -1) {
                    checkFormSubmitted();
                }

                if(localStorage.getItem('userdata').length > 0){
                    $('#loginBtn').show();
                    $('#lgBtn').addClass('d-none');
                }
                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1) {
                    add_to_cart('add', '');
                }
                if (window.location.href.indexOf("checkout") > -1) {
                    add_to_cart_login();
                    location.reload();
                }
                if (typeof gtag === "function") {

                    gtag('event', 'otp_validated', {
                        'event_category': 'otp_validated',
                        'event_label': 'OTP Validated',  // Label describing the button
                        'value': 1  // Optional: you can pass a value if needed
                    });
                }
            }
        }
    });
}

document.addEventListener('keydown', function(event) {
    var enterKey = 'Enter';
    if (event.key === enterKey) {
      var firstModal = document.getElementById('loginModal');
      var secondModal = document.getElementById('verifyotp');
      var thirdModal = document.getElementById('emailverifyotp');
      var activeElement = document.activeElement;
    
    if (firstModal.style.display === 'block' && activeElement.id === 'email_Id') {
      event.preventDefault(); // Prevent form submission by Enter key press
      sendEmailOTP(pId); // Call the sendEmailOTP function
    }else if (firstModal.style.display === 'block') {
        event.preventDefault(); // Prevent form submission by Enter key press
        sendOTP(pId); // Call the sendOTP function
    } else if (secondModal.style.display === 'block') {
        event.preventDefault(); // Prevent form submission by Enter key press
        validateOTP(pId); // Call the validateOTP function
    }else if (thirdModal.style.display === 'block') {
        event.preventDefault(); // Prevent form submission by Enter key press
        validateEmailOTP(pId); // Call the validateOTP function
    }
    }
  });

  document.addEventListener('keydown', function(event) {
    var enterKey = 'Enter';

    if (event.key === enterKey) {
      event.preventDefault();
    }
  });

function validateEmailOTP(pId) {

    var OTP = $('#OTP').val();

    if (OTP == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter OTP.");
        errormodalhide();
    }
    
    var url = origin + "/email_login/verifyotp?contactMappingId=" + cMappingId + "&otp=" + OTP;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
            } else {
                var userdata = {
                        contactId: result['rows']['contactId'],
                        token: result['rows']['token'],
                        contactMappingId: result['rows']['contactMappingId'],
                        mobile: '',
                        name: result['rows']['name'],
                        email: result['rows']['email'],
                        dob: result['rows']['dob'],
                        gender: result['rows']['gender'],
                        anniversary: result['rows']['anniversary'],
                        married: result['rows']['married']
                    }
                    // userdata=;
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('#emailverifyotp').modal('hide');
                $('.walletGuest').hide();
                $('.walletShow').show();
            
                if ((result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == 'user' || result['rows']['name'] == 'User') && !localStorage.getItem('userProfile')) {
                    if (result['rows']['email'] != null && result['rows']['email'] != 'null' && result['rows']['email'] != '') {
                        $('#uEmail').val(userdata['email']);
                    }
                    $('#updateProfileModal_new').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    localStorage.setItem('userProfile',true);
                }

                if(result['rows']['name'] == '' || result['rows']['name'] == null || result['rows']['name'] == "null"){
                    document.getElementById("namevalue").innerText = "User";
                }else{
                    document.getElementById("namevalue").innerText = result['rows']['name'];
                }

                
                document.getElementById("emailvalue").innerText = result['rows']['email'];

                if (userClickedWalletGuest) {
                    window.location.href = origin+ '/wallet';
                  }

                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1  && window.location.href.indexOf("/") == -1) {
                    add_to_cart('add', '');
                }
            }
        }
    });
}

function verifyPassword(pId) {
    // var email_Id=$('#email_Id').val();
    var EmailPassword = encodeURIComponent($('#EmailPassword').val());
    var url = origin + "/email_login/verifypassword?contactMappingId=" + cMappingId + "&password=" + EmailPassword + "&businessId=" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result['status'] == 0) {

                $('#errorMessageLogin').html('');
                $('#errorMessageLogin').html(result['msg']);
                $("#danger-alert-login").fadeTo(2000, 500).slideUp(500, function() {
                    $("#danger-alert-login").slideUp(500);
                });
                return false;
            } else {
                // readSMS=0;
                var userdata = {
                        contactId: result['rows']['contactId'],
                        token: result['rows']['token'],
                        contactMappingId: result['rows']['contactMappingId'],
                        mobile: '',
                        name: result['rows']['name'],
                        email: result['rows']['email'],
                        dob: result['rows']['dob'],
                        gender: result['rows']['gender'],
                        anniversary: result['rows']['anniversary'],
                        married: result['rows']['married']
                    }
                    // userdata=;
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || (window.location.href.indexOf("order/") > -1)) && window.location.href.indexOf("online-order") == -1) {
                    add_to_cart('add', '');
                }
            }
        }
    });
}


function updateProfileEmail(pId) {
    if ($('#EUpdateName').val() == '') {
        alert("Name is Mandatory!");
        return false;
    }
    if ($('#EUpdatePassword').val() == '') {
        alert("Password is Mandatory!");
        return false;
    }
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var params = 'contactMappingId=' + userData['contactMappingId'] +
        '&businessId=' + pId + '&name=' + $('#EUpdateName').val() + '&password=' + $('#EUpdatePassword').val();

    $.ajax({
        type: 'POST',
        url: origin + "/email_login/addinfo?" + params,
        // data	: {"email":value},
        dataType: "json",
        headers: {
            'token': userData['token']
        },
        async: false

    }).done(function(response) {
        if (response['status'] == 1) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            userData['name'] = $('#EUpdateName');
            localStorage.setItem('userdata', JSON.stringify(userData));
            $('#updateProfileModal').modal('hide');

        }

    });
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

$(".tspace").on("keyup", function() {
    var length = $.trim($(this).val()).length;
    if (length == 0) {
        $(this).val("");
    } else {
        $(this).val($(this).val().trimLeft(""));
    }
})

$('.block-start-space').keypress(function(e) {
    if ($(this).val() == '') {
        if (!/[0-9a-zA-Z-]/.test(String.fromCharCode(e.which)))
            return false;
    }
})

$(document).on('keydown', '#uEmail', function(e) {
    if (e.which === 32) {
        return false;
    }
});

function isNumber(evt) {
    let iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;

    return true;
}

// trim space
$(".block-start-space").on("keyup", function() {
    var length = $.trim($(this).val()).length;
    if (length == 0) {
        $(this).val("");
    } else {
        $(this).val($(this).val().trimLeft(""));
    }
})

function skipModal(){
    $('#updateProfileModal_new').modal('hide');
    if (window.location.href.indexOf("checkout") > -1) {
        openPayment();
    }
}

function uProfileUpdate(pId) {
    if ($('#FullName').val() == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please Enter Full Name");
        errormodalhide();
        return false;
    }

    var emailId = $('#EmailAddress').val();

    if(emailId != '' && emailId != null){
        if (validateEmail(emailId) == false) {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("Please enter valid Email Address");
            errormodalhide();
            return false;
        }
    }

    

    var gender = '';
    if ($('input[name="gender"]:checked').val() != undefined) {
        gender = $('input[name="gender"]:checked').val();
    }
    if(pId == 7175 && gender == ''){
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please select gender");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2000);
        return false;
    }
    var dob = '';
    if ($('#DateOfBirth').val() != undefined) {
        dob = $('#DateOfBirth').val();
    }
    var married = '';
    var anniversary = '';
    if ($('#AniversaryLabel').val() != undefined) {
        anniversary = $('#AniversaryLabel').val();
        married = 1;
    }

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var params = 'contactMappingId=' + userData['contactMappingId'] + '&token=' + userData['token'] +
        '&contactId=' + userData['contactId'] + '&businessId=' + pId + '&name=' + $('#FullName').val() +
        '&email=' + emailId + "&gender=" + gender + "&dob=" + dob + "&married=" + married + "&anniversary=" + anniversary;

    $.ajax({
        type: 'GET',
        url: origin + "/client/updateProfile?" + params,
        // data	: {"email":value},
        dataType: "json",
        async: false

    }).done(function(response) {
        if (response['status'] == 1) {
            var userData = JSON.parse(localStorage.getItem('userdata'));
            userData['name'] = $('#FullName').val();
            userData['email'] = $('#EmailAddress').val();
            userData['dob'] = $('#DateOfBirth').val();
            userData['gender'] = gender;
            userData['anniversary'] = $('#AniversaryLabel').val();
            document.getElementById("namevalue").innerText = $('#FullName').val();
            document.getElementById("emailvalue").innerText = $('#EmailAddress').val();
            localStorage.setItem('userdata', JSON.stringify(userData));
            if(typeof webengage_tag == "function"){

                if(userData['dob'] != null && userData['dob'] != '' && userData['dob'] != "null"){
                    var c_dob = new Date(userData['dob']);
                }else{
                    var c_dob ='';
                }

                if(userData['anniversary'] != null && userData['anniversary'] != '' && userData['anniversary'] != "null"){
                    var c_ann = new Date(userData['anniversary']);
                }else{
                    var c_ann = '';
                }

                webengage.track("Form Filled",{
                    "Phone Number" : userData['mobile'],
                    "Email" : userData['email'],
                    "First Name" : userData['name'],
                    "Birth Date" : c_dob,
                    "Anniversary Date" : c_ann
                });

                if(userData['anniversary'] != null && userData['anniversary'] != '' && userData['anniversary'] != "null"){
                    webengage.user.setAttribute('we_anniversary_date', userData['anniversary']);
                }

                if(userData['dob'] != null && userData['dob'] != '' && userData['dob'] != "null"){
                    webengage.user.setAttribute('we_birth_date', userData['dob']);
                }

                

            }
            $('#updateProfileModal_new').modal('hide');
            $('#promoapplied').modal('show');
            $('.promors').html(response['msg']);
            setTimeout(function() {
                $('#promoapplied').modal('hide')
            }, 2500);
            if (window.location.href.indexOf("checkout") > -1) {
                openPayment();
            }


        }

    });
}

function showAlert(msg) {
    $('#errorMessage').html('');
    $('#errorMessage').html(msg);
    $("#danger-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#danger-alert").slideUp(500);
    });
}

function logout() {
    localStorage.clear();
    if(typeof webengage_tag == "function"){

        webengage.track("Link Clicked",{
            "Link Clicked" : "Logout"
        });

        webengage.user.logout();
    }
    window.location.href = '/';
}


function searchExpand() {
    var dev = document.getElementById('searchBar');
    var style = window.getComputedStyle(dev);
    if (style.display == 'none') {
        $('#searchBar').show();
        $('#search').focus();
    } else {
        $('#searchBar').hide();
    }

}

function closeSearch() {
    if ($('#search').val() == '') {
        $('#searchBar').hide();
    }

}

function profile() {

    window.location.href = '/profile';
}

function storeCityPage(city) {
    window.location.href = '/store-locator/' + city;
}

function storeDetailsPage(city, slug) {
    window.location.href = '/store-locator/' + city + "/" + slug;
}

function orderPage(slug) {
    window.location.href = '/order/' + slug;
}

function redirectPage(page) {
    window.location.href = page;
}

function call(phoneNo) {
    window.open("tel:" + phoneNo);
}

function truecallerLogin(pId) {
    let requestNonce = pId + '-' + Math.floor(Math.random() * 100000000);; // random number of length 8 to 64 characters
    window.location = "truecallersdk://truesdk/web_verify?" +
        "type=btmsheet&" +
        "requestNonce=" + requestNonce +
        "&partnerKey=" + truecaller_key +
        "&partnerName=" + encodeURI(businessName) +
        "&lang=en&loginPrefix=placeorder&loginSuffix=login&ctaPrefix=proceedwith&ctaColor=%230099ff&ctaTextColor=%23ffffff&btnShape=Round&skipOption=Later";

    setTimeout(function() {

        if (document.hasFocus()) {
            alert("Oops! Truecaller Not Installed");

        } else {
            truecallerRequestId = requestNonce;
            $('#truecallerModal').modal('show');
            getTruecallerLoginStatus();
        }
    }, 600);
}

function paytmLogin() {
    JSBridge.call('paytmFetchAuthCode', {
        clientId: paytm_mId,
    }, function(result) {
        // alert(JSON.stringify(result))
        getPaytmAuthCode(result);
    });
}

function tryPaytmLogin() {
    $('.paytmConsentModal').modal('hide');
    paytmLogin();
}

function popoutPaytm() {
    JSBridge.call('popWindow');
}

$('#loginModal').on('show.bs.modal', function() {
    setTimeout(() => {
        $('#mobileNo').trigger('focus');
    }, 1000);

})

$('#verifyotp').on('show.bs.modal', function() {
    setTimeout(() => {
        $('#OTP').trigger('focus');
    }, 1000);

})

$('#verifyotp').on('hidden.bs.modal', function () {
    $('#OTP').val('');
    $('#validateOTP').addClass('disable');
});

function getPaytmAuthCode(res) {
    // alert(JSON.stringify(res));
    if (res['error'] == -1 || res['error'] == -2) {
        // alert(tryCount);
        //  tryCount++;
        //  if(tryCount>3){
        //      JSBridge.call('popWindow');
        //  }else{
        //    //   $('#main-loader1').hide();
        //     $('.paytmConsentModal').modal('show');
        //  }

    } else if (res['error'] != undefined) {
        alert("Unable to Fetch the Login Details");
        setTimeout(function() {
            window.location.href = "#/home-feed";
        }, 1700);
    } else {
        // alert("https://www.uengage.in/client/getAuthCodePaytm"+pId);
        //  $('#main-loader1').show();
        $.ajax({
            type: 'GET',
            url: "https://www.uengage.in/client/getAuthCodePaytm/" + pId,
            data: {
                "authCode": JSON.stringify(res)
            },
            async: false

        }).done(function(data) {
            //  alert(data)
            data = JSON.parse(data);

            //   $('#main-loader1').hide();
            if (data.status == 1) {
                var userdata = {
                        contactId: data.rows.contactId,
                        token: data.rows.token,
                        contactMappingId: data.rows.contactMappingId,
                        mobile: data.rows.mobileNo,
                        name: data.rows.name,
                        email: data.rows.email,
                        gender: data.rows.gender,
                        anniversary: data.rows.anniversary,
                        married: data.rows.married,
                        dob: data.rows.dob
                    }
                    // alert(data.rows.name);
                    // var db1 = getLocalStorage();
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                // $('#main-loader1').hide();
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || window.location.href.indexOf("order/") > -1) && window.location.href.indexOf("online-order") == -1) {
                    if (pId == 6156) {
                        add_to_cart('add', '');
                    } else {
                        add_to_cart('view', '');
                    }

                }
            } else {
                JSBridge.call('popWindow');
                // window.location.href = "https://pwa.uen.io/#/login";
            }

        });
    }
}

function getEmailId(userdata) {
    swal("Kindly enter the Email Id:", {
            content: "input",
        })
        .then((value) => {
            // alert(value);
            if (value == '') {
                swal({
                    title: "Login is mandatory to proceed?",
                    icon: "warning",
                    buttons: false,
                    timer: 1500
                })
                getEmailId(userdata);
            } else {

                var businessId = "5";
                var params = 'contactId=' + userdata.contactId + '&contactMappingId=' + userdata.contactMappingId +
                    '&businessId=' + businessId + '&token=' + userdata.token;
                // alert(params);
                $.ajax({
                    type: 'POST',
                    url: "https://www.uengage.in/client/updateProfile?" + params,
                    data: {
                        "email": value
                    },
                    // headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                    async: false

                }).done(function(response) {
                    // alert("ss");
                    // alert(response);
                    data = JSON.parse(response);
                    // alert(data);
                    $scope.loading = false;

                    if (response.data.status == 0) {

                        if (response.data.msg == 'Invalid Token') {
                            $location.path('/logout');
                        }

                    } else {
                        swal({
                            title: "Successfully Updated",
                            text: response.data.msg,
                            timer: 1500,
                            button: false,
                            showConfirmButton: false,
                            icon: "success"
                        });
                        var db1 = getLocalStorage();
                        userdata.email = value;
                        //   alert(userdata);
                        db1.setItem('userdata', JSON.stringify(userdata));
                        $('#main-loader1').hide();
                    }


                });
            }
        });
}


function getTruecallerLoginStatus() {

    if (pollingCount == 10) {
        closePolling();
        // alert("Oops! Not Able to fetch the Details");
        $('#truecallerModal').modal('hide');
        return false;
    } else {
        $.ajax({
            type: 'GET',
            url: "https://" + domain + "/client/getTrueCallerStatus",
            data: {
                "requestId": truecallerRequestId,
                "pId": pId
            },
            async: false

        }).done(function(data) {
            data = JSON.parse(data);
            if (data.status == 1) {
                $('#truecallerModal').modal('hide');
                closePolling();
                var userdata = {
                        contactId: data.rows.contactId,
                        token: data.rows.token,
                        contactMappingId: data.rows.contactMappingId,
                        mobile: data.rows.mobileNo,
                        name: data.rows.name,
                        email: data.rows.email,
                        gender: data.rows.gender,
                        anniversary: data.rows.anniversary,
                        married: data.rows.married,
                        dob: data.rows.dob
                    }
                    // alert(data.rows.name);
                    // var db1 = getLocalStorage();
                localStorage.setItem('userdata', JSON.stringify(userdata));
                localStorage.setItem('token', userdata.token);
                $('#loginModal').modal('hide');
                $('#verifyotp').modal('hide');
                $('#menu-total').show();
                $('#loginBTN').hide();
                $('#cartBTN').show();
                $('#loginDIV').hide();
                $('#lgBtn').hide();
                $('.accountdvlogin').hide();
                $('#cartArea').show();
                $('#welLgBTN').show();
                $('#showRaiseConcern').show();
                $('.accountdv').show();
                $('.walletShow').show();
                $('.walletGuest').hide();
                if (((window.location.href.indexOf("reservation/") > -1) || window.location.href.indexOf("order/") > -1) && window.location.href.indexOf("online-order") == -1 ) {
                    add_to_cart('add', '');
                }

                $('#promoapplied').modal('show');
                $('.promors').html('Login Successful');
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);

            } else if (data.status == -1) {
                closePolling();
                $('#truecallerModal').modal('hide');
                $('#promoapplied').modal('hide');
                return false;

            } else {
                pollingCount++;
                setTimeout(function() {
                        getTruecallerLoginStatus();
                    },
                    1000);
            }
        });
    }
}




function closePolling() {
    pollingCount = 0;
    truecallerRequestId = '';
}



function searchOutletViaPincode(pId) {
    var pincode = $('.pincodeArea').val();
    if (pincode == '' || pincode.length < 3) {
        $(".outleterrormsg").html("Please enter 3 digit of postcode or suburb");
        $(".outleterror").fadeTo(2000, 500).slideUp(500, function() {
            $(".outleterror").slideUp(500);
        });
        return false;
    }

    var params = 'areaId=' + pincode + '&parentBusinessId=' + pId;

    $.ajax({
        type: 'GET',
        url: "https://" + domain + "/email_login/GetAssignedBusiness?" + params,
        async: false,
        dataType: "json",

    }).done(function(data) {
        var bName = ''
        if (data['status'] == 1) {
            if (data['data'].length > 0) {
                for (var i = 0; i < data['data'].length; i++) {
                    bName += '<div class="col-md-4"><div class="card-inner">';
                    bName += '<div class="card-top"><h3>' + data['data'][i]['locality'] + ',' + data['data'][i]['locality'] + '</h3></div>';
                    bName += '<div class="card-middle"><ul class="card-uln">';
                    bName += '<li><i class="las la-map-marker"></i></li>';
                    bName += '<li>' + data['data'][i]['address'] + '</li></ul>';
                    bName += '<ul class="card-uln"><li><i class="las la-phone"></i></li><li>' + data['data'][i]['contactNumber'] + '</li></ul>';
                    var orderType = "";
                    if (data['data'][i]['onlineOrdersDelivery'] == 1) {
                        if (orderType == '') {
                            orderType = 'Delivery';
                        }
                    }
                    if (data['data'][i]['onlineOrdersSelfPickup'] == 1) {
                        if (orderType == '') {
                            orderType = 'Pickup';
                        } else {
                            orderType += ',Pickup';
                        }
                    }
                    bName += '<ul class="card-uln"><li><i class="las la-utensils"></i></li><li>' + orderType + '</li></ul>';
                    bName += '</div><div class="card-footerr"><ul class="footer-btns"><li><a href="tel:' + data['data'][i]['contactNumber'] + '">Call</a>';
                    bName += '</li><li><a target="_blank" href="https://www.google.com/maps/@' + data['data'][i]['latitude'] + ',' + data['data'][i]['longitude'] + '">Navigate</a></li>';
                    bName += '<li><a href="https://' + domain + '/order/' + data['data'][i]['slug'] + '" class="redd">order</a></li>';
                    bName += '</ul></div></div></div>';
                }

                $('.businessCards').html(bName);

            } else {
                $('.businessCards').html('<span id="noOutelet">Oops! No Outlet Found Near Area.</span>');
            }
        }


    });

}



if (typeof truecaller_key != "undefined" && truecaller_key != '') {
    // testing=1;
    const socialMediaAgents = [
        'Instagram',
        'FBAN', // Facebook
        'FBAV', // Facebook
        'Twitter',
        'Snapchat'
    ];

    const isSocialMediaApp = socialMediaAgents.some(agent => uagent.includes(agent));

    // testing=1;
    if(isSocialMediaApp) {
        // testing=0;
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');
    
        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'none';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'none';
        }
    
    }else if (/android/i.test(uagent)) {
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');

        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'block';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'block';
        }
    }else {
        // testing=0;
        var truecallerBTNElement = document.getElementById('truecallerBTN');
        var truecallerOrElement = document.getElementById('truecallerOr');
    
        if (truecallerBTNElement) {
            truecallerBTNElement.style.display = 'none';
        }
        if (truecallerOrElement) {
            truecallerOrElement.style.display = 'none';
        }
    
    }

} else {
    // testing=0;
    var truecallerBTNElement = document.getElementById('truecallerBTN');
    var truecallerOrElement = document.getElementById('truecallerOr');

    if (truecallerBTNElement) {
        truecallerBTNElement.style.display = 'none';
    }
    if (truecallerOrElement) {
        truecallerOrElement.style.display = 'none';
    }

}


var oPoolingCount = 0;

function checkOrderStatus(orderId, pId) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var mobileNo = userData['mobile'];
    var url = origin + "/client/getOrderStatus?contactMappingId=" + contactMappingId + "&mobileNo=" + mobileNo + "&token=" + token + "&parentBusinessId=" + pId + "&orderId=" + orderId;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            if (data['status'] == 0) {
                if (oPoolingCount != 6) {
                    oPoolingCount++;
                    setInterval(function() {
                        checkOrderStatus(orderId, pId)
                    }, 5000);
                } else {
                    var redirectUrl = origin + "/payment-error/" + data['id'];
                    window.location.href = redirectUrl;
                }
            } else {
                $('.success-warning').hide();
                $('.success-img').show();

                var redirectUrl = origin + "/past-order";
                setTimeout(function() {
                    window.location.href = redirectUrl;
                }, 3000);



            }
        },
        error: function() {
            alert('error handling here');
        }
    });
}


function isEmail(email) {
    var EmailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return EmailRegex.test(email);
}


$(document).ready(function() {
    $(document).on('click', '.myDiv', function() {
        $('body').addClass('myBackground');
        $('.uengageoverlay').addClass('active');
        $('.sidenav').addClass('active');
		$('.newbtnspant').addClass('closebtn');
    })
    $(document).on('click', '.closebtn', function() {
        $('body').removeClass('myBackground');
        $('.uengageoverlay').removeClass('active');
        $('.sidenav').removeClass('active');
		$('.newbtnspant').addClass('myDiv');
		$('.newbtnspant').removeClass('closebtn');
    })
});
$(document).click(function(event) {
    if (!$(event.target).closest(".sidenav,.myDiv").length) {
        $("body").find(".sidenav").removeClass("active");
        $("body").find(".uengageoverlay").removeClass("active");
        $("html").find("body").removeClass("myBackground");
    }
});


if (window.history && window.history.pushState) {
    $('.modal').on('show.bs.modal', function(e) {
        window.history.pushState('forward', null);
    });

    $('.menu-top').on('.top-open.menu', function(e) {
        window.history.pushState('forward', null, './.modal');
    });

    $(window).on('popstate', function() {
        $('.modal').modal('hide');
        //$('.menu-top').hide();
        $(".modal-body").scrollTop(0);
    });
}

$("[data-dismiss='modal']").click(function() {
    $(".modal-body").scrollTop(0);
});

$('a.download-btn').click(function() {
    $(this).blur();
});

/*New Header*/
$("#menu-showhide").click(function() {
    $(".site-nav .navbar-collapse").toggleClass("menu-show");
    $("body").toggleClass("body-overflow");
});
$("#menu-showhide-normal").click(function() {
    $(".site-nav .navbar-collapse").toggleClass("menu-show");
    $("body").toggleClass("body-overflow");
});
$("section").click(function() {
    $(".site-nav .navbar-collapse").removeClass("menu-show");
    $("body").removeClass("body-overflow");
});
/*New Header*/

$(document).ready(function() {
    $(document).on('click', '.animatebtn', function(e) {
        $btn = $(this);
        var $offset = $(this).offset();
        $span = $('<span/>');
        var x = e.pageX - $offset.left
        var y = e.pageY - $offset.top;
        $span.addClass('ripple');
        $span.css({
            top: y + 'px',
            left: x + 'px',
        });
        $btn.append($span);
        window.setTimeout(function() {
            $span.remove();
        }, 2200);
    });

});

/*mobile number validation*/
$("#mobileNo").keyup(function(event) {
    var fieldValue = event.target.value;
    if (fieldValue.length == 10) {
        $("#sendOtpBtn").removeClass("disable");
    } else {
        $("#sendOtpBtn").addClass("disable");
    }
});
$("#email_Id").keyup(function(event) {
        $("#sendEmailOTP").removeClass("disable");
});
/*mobile number validation*/

/*login modal otp validation js*/
function handleOTPInput(event, pId) {
    const otpValue = $('#OTP').val();
    const $submitButton = $('#validateOTP');
    var input = event.target.value;

    // Check if input is exactly 6 digits
    if (input.length === 6) {
        $submitButton.removeClass('disable');
        validateOTP(pId); // Auto-submit when 6 digits entered
        // 🔒 Disable the OTP input field 
        $('#OTP').prop('disabled', true);
        // ⏱️ Optionally re-enable it after some time (e.g., 30 seconds)
        setTimeout(function() {
            $('#OTP').prop('disabled', false);
        }, 1500); // 15 seconds
    } else {
        $submitButton.addClass('disable');
    }
}

function submitOTP(pId) {
    validateOTP(pId); // Just calls the same function
}

/*OTP button disabled validation*/
$(document).ready(function () {
    const $otpInput = $('#OTP');
    const $submitButton = $('#validateOTP');

    // Ensure button is disabled initially
    $submitButton.addClass('disable');

    $otpInput.on('input', function () {
        const otp = $otpInput.val();
        if (otp.length === 6) {
            $submitButton.removeClass('disable');
        } else {
            $submitButton.addClass('disable');
        }
    });
});
/*OTP button disabled validation*/
/*login modal otp validation js*/

/*Profile Signup button disabled validation*/
$(document).ready(function () {
    $('body #FullName').on('input', function () {
        // Check if the input field has any text
        if ($.trim($(this).val()) !== '') {
            $('.submit_btn').removeClass('disable').prop('disabled', false);
        } else {
            $('.submit_btn').addClass('disable').prop('disabled', true);
        }
    });
});
/*Profile Signup button disabled validation*/

    if (window.location.pathname == '/') {
      localStorage.removeItem('orderType');
      localStorage.setItem('orderType',1);
      var citySelected = $("#citySelector").val();
      if (citySelected) {
        $("#citySelector").val("");
      }
    }


    function changeDelivery()
    {
        localStorage.setItem('orderType',1);
        orderType = 1;
        $('.divNav').hide();
        $('#delivery-tab').addClass('active');
        $('input[name="optradio"]:checked').val();
        $('#pickup-tab').removeClass('active');
        $('#inCarTag').removeClass('active');
        $('#dineInTag').removeClass('active');
        $('#dine-in-tab').removeClass('active');
        $('#car-tab').removeClass('active');
        $('#pickup').removeClass('show active');
        $('#delivery').addClass('show active');
        $('#nav-home').show();
        $('#nav-home').attr("style", "display: flex");
        $('#nav-mobile-home').show();
        $('#deliveryLi').show();
        $('#slot_type_now').html(`Delivery Slot`);
        $('#slot_type_later').text(`Delivery Slot`);
        $('#selectslot').text('Select Delivery Slot');
        $('#bogoModalTitle').text('Choose delivery timings');
        $('#slotModal .slot-option-txt').text('Deliver');
        $('#chk_del').attr("style", "display: inline-block");
        $('#chk_pickup').attr("style", "display: none");
        $('#chk_dine').attr("style", "display: none");
        $('#chk_incar').attr("style", "display: none");
        $('#textlocationmodal').html('');
        $('#textlocationmodal').html('Enter the delivery location');
        if (window.location.href.indexOf("checkout") > -1) {
            add_to_cart();
        }
    }

    function selectPickUp(){

        orderType = 2;
        $('.order-type a').removeClass('active');
        localStorage.setItem('orderType',orderType);
        $('#addAddressDiv').hide();
        $('input[name="optradio"]:checked').val();
        $('.divNav').hide();
        $('#nav-profile').attr("style", "display: flex");
        $('.navtb').removeClass('active');
        $('#delivery-tab').removeClass('active');
        $('#pickup-tab').addClass('active');
        $('#dine-in-tab').removeClass('active');
        $('#car-tab').removeClass('active');
        $('#pickup').addClass('active');
        $('#delivery').removeClass('active');
        $('#dineInTag').removeClass('active');
        $('#inCarTag').removeClass('active');
        $('#slot_type_now').html(`Pickup Slot`);
        $('#slot_type_later').text(`Pickup Slot`);
        $('#selectslot').text('Select Pickup Slot');
        $('#bogoModalTitle').text('Choose pickup timings');
        $('#slotModal .slot-option-txt').text('Pickup');
        $('#pickup-tab').tab('show');
        $('#pickup').addClass('show active');
        $('#delivery').removeClass('show active');
        $('#freedel').attr("style", "display: none");
        $('#amountdel').attr("style", "display: none");
        $('#chk_pickup').attr("style", "display: inline-block");
        $('#chk_del').attr("style", "display: none");
        $('#chk_dine').attr("style", "display: none");
        $('#chk_incar').attr("style", "display: none");
        $('#textlocationmodal').html('');
        $('#textlocationmodal').html('Enter the pickup location');
        if (window.location.href.indexOf("checkout") > -1) {
            add_to_cart();
        }
            
    }

function changeDineIn(){
    orderType = 3;
    $('.order-type a').removeClass('active');
    localStorage.setItem('orderType',orderType);
    $('input[name="optradio"]:checked').val();
    $('.divNav').hide();
    $('#addAddressDiv').hide();
    $('.navtb').removeClass('active');
    $('#nav-contact').attr("style", "display: flex");
    $('#delivery-tab').removeClass('active');
	$('#pickup-tab').removeClass('active');
    $('#dine-in-tab').addClass('active');
    $('#car-tab').removeClass('active');
    $('#pickup').removeClass('active');
    $('#delivery').removeClass('active');
    $('#dineInTag').addClass('active');
    $('#inCarTag').removeClass('active');
    $('#dine-in-tab').tab('show');
    $('#freedel').attr("style", "display: none");
    $('#amountdel').attr("style", "display: none");
    $('#tabNOSelected').show();
    $('#select_table').show();
    // $('#selecttable').show();
    $('#tabNO').hide();
     $('#chk_dine').attr("style", "display: inline-block");
    $('#chk_pickup').attr("style", "display: none");
        $('#chk_del').attr("style", "display: none");
        $('#chk_incar').attr("style", "display: none");
    if (window.location.href.indexOf("checkout") > -1) {
        add_to_cart();
    }
}

function changeInCar()
{
	localStorage.setItem('orderType',4);
    orderType = 4;
    $('.divNav').hide();
	$('#delivery-tab').removeClass('active');
    $('input[name="optradio"]:checked').val();
	$('#pickup-tab').removeClass('active');
    $('#addAddressDiv').hide();
    $('#dine-in-tab').removeClass('active');
    $('#car-tab').addClass('active');
    $('#pickup').removeClass('active');
    $('#delivery').removeClass('active');
    $('#dineInTag').removeClass('active');
    $('#inCarTag').addClass('active');
    $('#nav-car').attr("style", "display: flex");
    $('#slot_type_now').html(`Delivery Slot`);
    $('#slot_type_later').text(`Delivery Slot`);
    $('#selectslot').text('Select Delivery Slot');
    $('#bogoModalTitle').text('Choose delivery timings');
    $('#slotModal .slot-option-txt').text('Deliver');
    $('#chk_incar').attr("style", "display: inline-block");
    $('#chk_dine').attr("style", "display: none");
    $('#chk_pickup').attr("style", "display: none");
    $('#chk_del').attr("style", "display: none");
    $('#freedel').attr("style", "display: none");
    $('#amountdel').attr("style", "display: none");
    if (window.location.href.indexOf("checkout") > -1) {
        navigator.geolocation.getCurrentPosition(GetCoords, GetError);
        add_to_cart();
    }
}


/*footer sticky*/
function footerAlign() {
  $('footer').css('height', 'auto');
  var footerHeight = $('footer').outerHeight();
  $('body').css('padding-bottom', footerHeight);
  $('footer').css('height', footerHeight);
}
$(document).ready(function(){
  footerAlign();
});
$( window ).resize(function() {
  footerAlign();
});
/*footer sticky*/

/*Inline Slick Slider Js*/
$(document).ready(function() {
    function mySlick(elems) {
        elems.each(function() {
            var current = $(this);
            let myOption = eval('({' + current.attr("data-option") + '})');
            // current.slick(myOption);
            current.not('.slick-initialized').slick(myOption);
        });
    }
    mySlick($("[data-slick]"));
});
/*Inline Slick Slider Js*/

$('#showRaiseConcern, #faqmodalneww').on('click', function(e) {
    $('body').removeClass('myBackground');
    $('.uengageoverlay').removeClass('active');
    $('.sidenav').removeClass('active');
    $('.newbtnspant').addClass('myDiv');
    $('.newbtnspant').removeClass('closebtn');
});


function openConcernList(pId)
{
    if(localStorage.getItem('userdata') && localStorage.getItem('userdata') != null){
        
        var pId = pId;
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];

        var url = origin + "/support/getConcernType/" + contactMappingId + "/" + pId;

        $.ajax({
            url : url,
            type : "GET",
            dataType: "json",
            success: function(result) {

                if(result['status'] == 1){
                    var list = '';
                   
                    $.each(result['concern_types'], function(index, res) {

                        // list += '<div class="consern-list" id="'+ res['id'] +'" onclick="showConcernData('+ res['id'] +', \'' + res['name'].replace(/'/g, "\\'") + '\')">';
                        if(res['id']==9){
                        list += '<div class="card" id="'+ res['id'] +'"><div class="card-header"  id="headingOne"><h2 class="mb-0">	<button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"  onclick="showConcernData('+ res['id'] +', \'' + res['name'].replace(/'/g, "\\'") + '\')">	<span>'+  res['name'].replace(/'/g, "\\'") +'</span> <span><i class="las la-angle-down"></i></span></button></h2>	</div><div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample" style="">				<div class="card-body">	<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>	<div class="main-bg-oyt">						<div><div class="form-group showarrow mb-0" id="order_list" style="" onclick="showOrderListData('+pId+')"><label class="label-p">Your Order ID</label><div class="main-bg"><div class="input-group">	<input type="text" class="form-control" id="order-id" placeholder="Choose order from list" readonly >	</div>											</div></div></div><div class="text-center text-md-left mt-3 mt-md-0">			<button type="button" onclick ="submitConcern('+pId+')" class="btn btn-primary btn-next animatebtn">Submit</button></div>	</div></div>						</div>					</div>';
                        }else if(res['id']==10){
                            list +=`	<div class="card" id="`+ res['id'] +`">
						<div class="card-header" id="headingTwo">
							<h2 class="mb-0">
								<button class="btn btn-link btn-block text-left collapsed" onclick="showConcernData(` + res['id'] + `, '` + res['name'].replace(/'/g, "\\'") + `');" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								<span>`+ res['name'] +`</span> <span><i class="las la-angle-down"></i></span>
								</button>
							</h2>
						</div>
						<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
							<div class="card-body">
								<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>
								<div class="main-bg-oyt">
									<div>
										<div class="form-group showarro0w mb-3" id="outlet_list" style="" onclick="showOutletListData(`+pId+`)">
											 <label class="label-p">Select Outlet</label>
											 <div class="main-bg">
												 <div class="input-group">
													<input type="text" class="form-control" id="select-outlet" placeholder="Outlet" readonly >
												 </div>
											 </div>
										</div>
										
										<div class="form-group mb-0" id="concern_comment" style="">
											 <div class="main-bg">
												 <div class="input-group">
													<textarea class="form-control" id="comments-text" placeholder="Comments" rows="4" cols="50" ></textarea>
												 </div>
											 </div>
										  </div>
									</div>
									<div class="text-center text-md-left mt-3 mt-md-0">
										<button type="button" onclick ="submitConcern(`+pId+`)" class="btn btn-primary btn-next animatebtn">Submit</button>
									</div>
								</div>
							</div>
						</div>
					</div>`;
                        }
                        else if(res['id']==11){
                            list +=`<div class="card" id="` + res['id'] + `">
						<div class="card-header" id="headingThree">
							<h2 class="mb-0">
								<button onclick="showConcernData(` + res['id'] + `, '` + res['name'].replace(/'/g, "\\'") + `');" class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
								<span>`+res['name']+`</span> <span><i class="las la-angle-down"></i></span>
								</button>
							</h2>
						</div>
						<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
							<div class="card-body">
								<p class="plight">We are really sorry for this experience. You can check refund status or raise a concern, we will try to resolve this as soon as possible.</p>
								<div class="main-bg-oyt">
									<div>
										<div class="form-group mb-0" id="concern_comment" style="">
											 <label class="label-p">Add Comment</label>
											 <div class="main-bg">
												 <div class="input-group">
													<textarea id="comments" class="form-control" placeholder="Comments" rows="4" cols="50"></textarea>
												 </div>
                                     
											</div>
										</div>
									</div>
									<div class="text-center text-md-left mt-3 mt-md-0">
										<button type="button" onclick ="submitConcern(`+pId+`)"  class="btn btn-primary btn-next animatebtn">Submit</button>
									</div>
								</div>
							</div>
						</div>
					</div>`;
                        }
                    });


                    $('#accordionExample').html('');
                    $('#accordionExample').html(list);
                }else{
                    $('#other-inputs').modal('hide');
                }
            }
    
        });
    }
    
}

function showConcernData(id,name){

    if(id == 9){
        $('#order_list').show();
        $('#outlet_list').hide();
        $('#concern_comment').hide();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    }else if(id == 10){
        $('#order_list').hide();
        $('#outlet_list').show();
        $('#concern_comment').show();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    }else if(id == 11){
        $('#order_list').hide();
        $('#outlet_list').hide();
        $('#concern_comment').show();
        $('#refund-status').val(name);
        $('#concern-type-id').val(id);
        $('#other-inputs').modal('hide');
        $('#error-msg-concern').hide();
    }
}

function showOrderListData(pId){

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var mobile = userData['mobile'];
    var action = 'close_order';
    var params = 'mobile=' + mobile + '&parentBusinessId=' + pId + '&contactMappingId=' +
        contactMappingId + '&businessId=' + pId + '&token=' + token + '&action=' + action;
    var url = '' + origin + '/pay/getOrderInfo?' + params;

        $.ajax({
            url : url,
            type : "GET",
            dataType: "json",
            success: function(result) {
            if(result['rows'].length > 0){
                if(result['status'] == 1){

                    var list = '';
                    $('#othertype_title').html("Select Order");
                    if(result['rows'].length > 0){
                        $('#order_list').show();
                        $.each(result['rows'], function(index, res) {

                            list += '<div class="consern-list" id="'+ res['id'] +'" onclick="selectOrderData('+ res['id'] +')">';
                            list += '<div>';
                            list += '<b> #' + res['id'] + '</b>';
                            list += '<p class="mb-0">';
                            list += res['locality'];
                            list += '</p>';
                            list += '<span style="color: #7b7b7b;">';
                            list += res['startTime'];
                            list += '</span>';
                            list += '</div>';
                            list += '<div>';
                            list += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
                            list += '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 6C18.75 5.58579 18.4142 5.25 18 5.25H9C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H16.1893L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L17.25 7.81066V15C17.25 15.4142 17.5858 15.75 18 15.75C18.4142 15.75 18.75 15.4142 18.75 15V6Z" fill="#1C274C"/>';
                            list += '</svg>';
                            list += '</div>';
                            list += '</div>';
                        });
    
    
                        $('#concern_type').html('');
                        $('#concern_type').html(list);
                        $('#other-inputs').modal('show');
                        $('#error-msg-concern').hide();
                    }else{
                        $('#other-inputs').modal('hide');
                        $('#error-msg-concern').html("No Past Orders Found!");
                        $('#error-msg-concern').show();
                        $('#order_list').hide();
                    }

                }else{
                    $('#other-inputs').modal('hide');
                    $('#error-msg-concern').html(result['msg']);
                    $('#error-msg-concern').show();
                }

            }
            else{
                $('#promonotapplied').modal('show');

                $('#promonotmsg').html(`No orders yet! Why not start by placing one?`);
                setTimeout(() => {
                    $('#promonotapplied').modal('hide');
                    
                }, 2500);
                return;
            }
        }
        });
}

function showOutletListData(pId){

    var pId = pId;
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var mobile = userData['mobile'];

        var url = origin + "/client/getAllStores/" + pId + "?mobile=" + mobile ;

        $.ajax({
            url : url,
            type : "GET",
            dataType: "json",
            headers: {
                'token': userData['token']
            },
            success: function(result) {

                if(result['status'] == 1){

                    var list = '';
                    $('#othertype_title').html("Select Outlet");
                    $.each(result['stores'], function(index, res) {

                        list += '<div class="consern-list" id="'+ res['id'] +'" onclick="selectOutletData(\'' + res['locality'].replace(/'/g, "\\'") + '\' , \'' + res['city'].replace(/'/g, "\\'") + '\')">';
                        list += '<div>';
                        list += res['locality'] + ',' + res['city'];
                        list += '</div>';
						list += '<div>';
						list += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">';
						list += '<path fill-rule="evenodd" clip-rule="evenodd" d="M18.75 6C18.75 5.58579 18.4142 5.25 18 5.25H9C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H16.1893L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L17.25 7.81066V15C17.25 15.4142 17.5858 15.75 18 15.75C18.4142 15.75 18.75 15.4142 18.75 15V6Z" fill="#1C274C"/>';
						list += '</svg>';
						list += '</div>';
					    list += '</div>';
                    });


                    $('#concern_type').html('');
                    $('#concern_type').html(list);
                    $('#other-inputs').modal('show');
                    $('#error-msg-concern').hide();
                    
                }else{
                    $('#other-inputs').modal('hide');
                    $('#error-msg-concern').html(result['msg']);
                    $('#error-msg-concern').show();
                }
            }
        });

}

function selectOutletData(locality,city){
    $('#select-outlet').val(locality + '-' + city);
    $('#other-inputs').modal('hide');
}

function selectOrderData(id){
    $('#order-id').val(id);
    $('#other-inputs').modal('hide');
}

function submitConcern(pId) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var concernType = $('#concern-type-id').val();
    // Collecting the concern details

    if(concernType == 9){
        var concernDetails = [
            $('#order-id').val(),
        ];
        if($('#order-id').val()=='' || $('#order-id').val()==null){
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`Please select an Order ID.`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');
                
            }, 2000);
            return;
        }
    }else if(concernType == 10){
        var concernDetails = [
            $('#select-outlet').val(),
            $('#comments-text').val()
        ];
        if($('#select-outlet').val()=='' || $('#select-outlet').val()==null){
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please select an outlet.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');
                
            }, 2000);
            return;
        }
        if($('#comments-text').val()=='' || $('#comments-text').val()==null){
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please add a comment.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');
                
            }, 2000);
            return;
        }
    }else if(concernType == 11){
        var concernDetails = [
            $('#comments').val()
        ];
        if($('#comments').val()=='' || $('#comments').val()==null){
            $('#promonotapplied').modal('show');

            $('#promonotmsg').html(`<p>Please add a comment.</p>`);
            setTimeout(() => {
                $('#promonotapplied').modal('hide');
                
            }, 2000);
            return;
        }
    }

    // Convert the array to a comma-separated string
    var concernDetailsString = concernDetails.join(', ');

    var url = origin + "/support/raiseConcern/" + pId + "/" + contactMappingId;

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: {
            token : token,
            concernType: concernType,
            concern_details: concernDetailsString
        },
        success: function(result) {
            if (result['status'] == 1) {
                // Handle success
                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide');
                    $('#raseaconcern').modal('hide');
                    var form = $('#raise_concernform')[0];
                        form.reset();

                        // Reset checkboxes, radio buttons, and select options
                        $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
                        $(form).find('select').prop('selectedIndex', 0);
                        
                        // Reset any additional elements
                        $('#error-msg-concern').hide();
                        $('#refund-status').val('');
                        $('#order_list').hide();
                        $('#outlet_list').hide();
                        $('#concern_comment').hide();
                }, 2500);
            } else {
                // Handle error
                $('#promonotapplied').modal('show');

                $('#promonotmsg').html(`${result['msg']}`);

                setTimeout(() => {
                    $('#promonotapplied').modal('hide');
                    
                }, 2000);
                return;
                
            }
        },
        error: function(xhr, status, error) {
            console.error('Error occurred:', error);
        }
    });
}



$('#raseaconcern').on('show.bs.modal', function () {
    var form = $('#raise_concernform')[0];
    form.reset();
    openConcernList(pId);
    $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
    $(form).find('select').prop('selectedIndex', 0);
    $('#error-msg-concern').hide();
    $('#refund-status').val('');
    // $('#order_list').hide();
    // $('#outlet_list').hide();
    // $('#concern_comment').hide();
});

$('#raseaconcern').on('hide.bs.modal', function () {
    var form = $('#raise_concernform')[0];
    form.reset();
    
    $(form).find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
    $(form).find('select').prop('selectedIndex', 0);
    $('#error-msg-concern').hide();
    $('#refund-status').val('');
    // $('#order_list').hide();
    // $('#outlet_list').hide();
    // $('#concern_comment').hide();
});

/*himanshu 20-11-24 customization modal js*/
if ($(window).width() <= 991) {
    $('.ride-side-move').append($('.right-side-modal'));
}
$('#customisable-item-modal .modal-body').scroll(function() {
	if($(window).width() < 991) {
  if ($(this).scrollTop() > 0){
	  $('.fixedbackbtnsupper').addClass("whiteline");
  } else {
    $('.fixedbackbtnsupper').removeClass("whiteline");
  }
  }
});
$('#single-item-modal .modal-body').scroll(function() { 
  if ($(this).scrollTop() > 0){
	  $('.fixedbackbtnsupper').addClass("whiteline");
  } else {
    $('.fixedbackbtnsupper').removeClass("whiteline");
  }
});

/*IN THE CASE OF NESTED MODAL MAKE BODY NON SCROLLABLE*/
    $(document).on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
    });
    
    $(document).on('hidden.bs.modal', function () {
        if ($('.modal.show').length === 0) {
        $('body').removeClass('modal-open');
        }
    });
/*IN THE CASE OF NESTED MODAL MAKE BODY NON SCROLLABLE*/

/*himanshu 20-11-24 customization modal js*/