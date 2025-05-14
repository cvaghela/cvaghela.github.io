// var stores ;
// function openOrderPage(storeSlug){
//    if(storeSlug!=''){
//       window.location.href="order/"+storeSlug;
//    }
// }

function openOrderPage(storeSlug, locality = "", city = "") {
    if (locality != '' && city != '') {

        if(typeof webengage_tag == "function"){

            webengage.track("Location Selected", {
                "City" : city,
                "Locality" : locality
            });
        }
        
        let obj = { 'locality': locality, 'city': city, 'slug': storeSlug };
        let r_search = JSON.parse(localStorage.getItem('r_search'));
        if (r_search) {
            let newObj = r_search.filter((element) => {
                if (element.locality != obj.locality || element.city != obj.city) {
                    return element;
                }
            });

            newObj.unshift(obj);
            let result = newObj.slice(0, 2);

            if (r_search.length > 0) {
                localStorage.setItem('r_search', JSON.stringify(result));
            } else {
                localStorage.setItem('r_search', JSON.stringify([obj]));
            }

        } else {
            localStorage.setItem('r_search', JSON.stringify([obj]));
        }
    }

    if (storeSlug != '') {
        window.location.href = "order/" + storeSlug;
    }
}

function showOutlet(city) {
    var url = window.location.origin + "/client/getCityStores?city=" + city + "&parentBusinessId=" + pId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {

            if (result['status'] == 1) {
                var outlets = result['stores'];
                if (outlets.length == 1) {
                    openOrderPage(escapeString(outlets[0]['web_slug']),escapeString(outlets[0]['locality']),escapeString(outlets[0]['city']));
                } else {
                    var list = "";
                    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="137" height="105" viewBox="0 0 137 105" fill="none" style="    height: auto;width: 100%;max-width: 20px;margin-top: 5px;">'
                    +'<path d="M135.677 96.2259L105.111 56.1305C103.284 53.7349 100.447 52.3303 97.4355 52.3303H39.8462C36.8343 52.3303 33.9973 53.7349 32.1707 56.1305L1.60783 96.2259C-0.96268 99.5987 1.44127 104.457 5.68288 104.457H131.602C135.843 104.454 138.247 99.5959 135.677 96.2259Z" fill="url(#paint0_linear_22_329)"></path>'
                    +'<path d="M3.32887 96.3092C2.52108 96.3092 1.77158 96.5479 1.14144 96.956C-0.612942 100.257 1.74104 104.454 5.68285 104.454H131.602C135.543 104.454 137.897 100.257 136.143 96.956C135.513 96.5479 134.763 96.3092 133.956 96.3092H3.32887Z" fill="#C9CDD3"></path>'
                    +'<path d="M55.5219 72.9498L77.3906 96.3092H68.4521L49.0984 75.7618L55.5219 72.9498Z" fill="white"></path>'
                    +'<path d="M101.014 53.0242C99.8895 52.5745 98.6792 52.333 97.4383 52.333H86.3291L9.37212 86.041L1.60786 96.2259C1.4885 96.3841 1.38301 96.5451 1.28308 96.7062L101.014 53.0242Z" fill="#FEE379"></path>'
                    +'<path d="M1.28589 96.7062L49.0984 75.7618L68.4521 96.3092L1.28589 96.7062Z" fill="#8AD0FF"></path>'
                    +'<path d="M9.37219 86.041L86.3291 52.333H39.8463C36.8344 52.333 33.9974 53.7376 32.1709 56.1332L9.37219 86.041Z" fill="#83CDAC"></path>'
                    +'<path d="M116.023 70.4459L113.661 67.348L99.2704 73.6382L86.0903 59.5587L79.7529 62.3346L92.9274 76.4086L68.6409 87.0237L71.4223 89.9357L95.67 79.3399L111.557 96.3092H120.492L102.013 76.5668L116.023 70.4459Z" fill="#C9CDD3"></path>'
                    +'<path opacity="0.3" d="M106.446 57.8821L105.111 56.1305C103.284 53.7349 100.447 52.3303 97.4355 52.3303H68.6409V74.3489L106.446 57.8821Z" fill="url(#paint1_linear_22_329)"></path>'
                    +'<path d="M65.3514 1.21994C54.3532 2.69118 45.9449 11.5047 44.9206 22.5529C44.2155 30.1534 47.0858 37.0988 52.0436 41.9122C53.9534 43.7665 55.7272 45.7458 57.3539 47.8333C61.9703 53.7543 65.1321 60.6775 66.7671 68.0031L68.0829 73.8992C68.1412 74.1629 68.3744 74.3489 68.6436 74.3489C68.9129 74.3489 69.1461 74.1629 69.2044 73.8992L70.6007 67.6311C72.1885 60.5081 75.2337 53.771 79.6918 47.9943C81.2824 45.9345 83.0257 43.9941 84.9327 42.2092C89.5713 37.8649 92.4722 31.6857 92.4722 24.8264C92.4694 10.5831 79.9777 -0.739864 65.3514 1.21994Z" fill="var(--main-bg-color)"></path>'
                    +'<path d="M73.8642 31.9243C76.7489 29.0397 76.7489 24.3627 73.8642 21.478C70.9795 18.5933 66.3025 18.5933 63.4179 21.478C60.5332 24.3627 60.5332 29.0397 63.4179 31.9243C66.3025 34.809 70.9795 34.809 73.8642 31.9243Z" fill="white"></path>'
                    +'<defs>'
                    +'<linearGradient id="paint0_linear_22_329" x1="11.1765" y1="44.1508" x2="109.502" y2="125.881" gradientUnits="userSpaceOnUse">'
                    +'<stop stop-color="#F6F8FF"></stop>'
                    +'<stop offset="1" stop-color="#DEE0ED"></stop>'
                    +'</linearGradient>'
                    +'<linearGradient id="paint1_linear_22_329" x1="113.736" y1="39.1252" x2="64.0912" y2="69.4172" gradientUnits="userSpaceOnUse">'
                    +'<stop></stop>'
                    +'<stop offset="1"></stop>'
                    +'</linearGradient>'
                    +'</defs>'
                    +'</svg>';
                    for (var i = 0; i < outlets.length; i++) {
                        if(outlets[i]['comingSoonFlag'] == 1){
                            list += '<div class="oulets-divs"><div class="top-divs"><div class="top-divs-right"><p><span>'+svg+'</span> <span>' + outlets[i]['locality'] + ',' + outlets[i]['city'] + '</span></p><div class="bottom-oulets-dvs">';
                            list += '<div><span style="font-size:9px !important">Coming Soon</span></div></div></div></div></div>';
                        }else{
                            list += '<div class="oulets-divs" onclick=\'openOrderPage("'+ escapeString (outlets[i]['web_slug'])+'","'+ escapeString(outlets[i]['locality'])+'","'+ escapeString(outlets[i]['city'])+'")\'><div class="top-divs"><div class="top-divs-right"><p><span>'+svg+'</span> <span>' + outlets[i]['locality'] + ',' + outlets[i]['city'] + '</span></p><div class="bottom-oulets-dvs">';
                            list += '<div><span>Order Now</span></div></div></div></div></div>';
                        }
                        
                    }

                    $('#outletList').html('');
                    $('#outletList').html(list);

                    $('#outletSelectors').modal('show');
                }
            } else {
                alert(result['msg']);
            }
        }
    });
}


function testLocality() {
    var searchString = $('#searchcity').val().toLowerCase();
    var limit = $('#limit_result').val();
    var searchItemsArr = [];
    if (searchString.length <= 2) {
        $('.cities').show();
        $('.searchcities').hide();
    } else {
        $('.cities').hide();
        $('.searchcities').show();
        let get_params = "";
        if (limit > 0) {
            get_params = "&limit=" + limit;
        }
        $.ajax({
            type: "GET",
            url: window.location.origin + "/client/searchLocality?parentBusinessId=" + pId + "&locality=" + searchString + get_params,
            dataType: "json",
            success: function(result) {
                if (result['status'] == 1) {
                    var outlets = result['localities'];
                    var list = "";
                    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="137" height="105" viewBox="0 0 137 105" fill="none" style="    height: auto;width: 100%;max-width: 20px;margin-top: 5px;">'
                    +'<path d="M135.677 96.2259L105.111 56.1305C103.284 53.7349 100.447 52.3303 97.4355 52.3303H39.8462C36.8343 52.3303 33.9973 53.7349 32.1707 56.1305L1.60783 96.2259C-0.96268 99.5987 1.44127 104.457 5.68288 104.457H131.602C135.843 104.454 138.247 99.5959 135.677 96.2259Z" fill="url(#paint0_linear_22_329)"></path>'
                    +'<path d="M3.32887 96.3092C2.52108 96.3092 1.77158 96.5479 1.14144 96.956C-0.612942 100.257 1.74104 104.454 5.68285 104.454H131.602C135.543 104.454 137.897 100.257 136.143 96.956C135.513 96.5479 134.763 96.3092 133.956 96.3092H3.32887Z" fill="#C9CDD3"></path>'
                    +'<path d="M55.5219 72.9498L77.3906 96.3092H68.4521L49.0984 75.7618L55.5219 72.9498Z" fill="white"></path>'
                    +'<path d="M101.014 53.0242C99.8895 52.5745 98.6792 52.333 97.4383 52.333H86.3291L9.37212 86.041L1.60786 96.2259C1.4885 96.3841 1.38301 96.5451 1.28308 96.7062L101.014 53.0242Z" fill="#FEE379"></path>'
                    +'<path d="M1.28589 96.7062L49.0984 75.7618L68.4521 96.3092L1.28589 96.7062Z" fill="#8AD0FF"></path>'
                    +'<path d="M9.37219 86.041L86.3291 52.333H39.8463C36.8344 52.333 33.9974 53.7376 32.1709 56.1332L9.37219 86.041Z" fill="#83CDAC"></path>'
                    +'<path d="M116.023 70.4459L113.661 67.348L99.2704 73.6382L86.0903 59.5587L79.7529 62.3346L92.9274 76.4086L68.6409 87.0237L71.4223 89.9357L95.67 79.3399L111.557 96.3092H120.492L102.013 76.5668L116.023 70.4459Z" fill="#C9CDD3"></path>'
                    +'<path opacity="0.3" d="M106.446 57.8821L105.111 56.1305C103.284 53.7349 100.447 52.3303 97.4355 52.3303H68.6409V74.3489L106.446 57.8821Z" fill="url(#paint1_linear_22_329)"></path>'
                    +'<path d="M65.3514 1.21994C54.3532 2.69118 45.9449 11.5047 44.9206 22.5529C44.2155 30.1534 47.0858 37.0988 52.0436 41.9122C53.9534 43.7665 55.7272 45.7458 57.3539 47.8333C61.9703 53.7543 65.1321 60.6775 66.7671 68.0031L68.0829 73.8992C68.1412 74.1629 68.3744 74.3489 68.6436 74.3489C68.9129 74.3489 69.1461 74.1629 69.2044 73.8992L70.6007 67.6311C72.1885 60.5081 75.2337 53.771 79.6918 47.9943C81.2824 45.9345 83.0257 43.9941 84.9327 42.2092C89.5713 37.8649 92.4722 31.6857 92.4722 24.8264C92.4694 10.5831 79.9777 -0.739864 65.3514 1.21994Z" fill="var(--main-bg-color)"></path>'
                    +'<path d="M73.8642 31.9243C76.7489 29.0397 76.7489 24.3627 73.8642 21.478C70.9795 18.5933 66.3025 18.5933 63.4179 21.478C60.5332 24.3627 60.5332 29.0397 63.4179 31.9243C66.3025 34.809 70.9795 34.809 73.8642 31.9243Z" fill="white"></path>'
                    +'<defs>'
                    +'<linearGradient id="paint0_linear_22_329" x1="11.1765" y1="44.1508" x2="109.502" y2="125.881" gradientUnits="userSpaceOnUse">'
                    +'<stop stop-color="#F6F8FF"></stop>'
                    +'<stop offset="1" stop-color="#DEE0ED"></stop>'
                    +'</linearGradient>'
                    +'<linearGradient id="paint1_linear_22_329" x1="113.736" y1="39.1252" x2="64.0912" y2="69.4172" gradientUnits="userSpaceOnUse">'
                    +'<stop></stop>'
                    +'<stop offset="1"></stop>'
                    +'</linearGradient>'
                    +'</defs>'
                    +'</svg>';
                    if (outlets.length > 0) {
                        for (var i = 0; i < outlets.length; i++) {
                            list += '<div class="col-lg-4 col-md-6 col-12 mb-3"><div class="oulets-divs" onclick=\'openOrderPage("'+ escapeString(outlets[i]['web_slug'])+'","'+ escapeString(outlets[i]['locality'])+'","'+ escapeString(outlets[i]['city'])+'")\'><div class="top-divs"><div class="top-divs-right"><p><span>'+svg+'</span> <span>' + outlets[i]['locality'] + ',' + outlets[i]['city'] + '</span></p><div class="bottom-oulets-dvs">';

                            // if (outlets[i]['onlineOrdersDelivery'] == 1) {
                            //     list += '<i class="la la-biking"></i>';
                            // }
                            // if (outlets[i]['onlineOrdersSelfPickup'] == 1) {
                            //     list += '<i class="la la-people-carry"></i>';
                            // }
                            // if (outlets[i]['dineInOrders'] == 1) {
                            //     list += '<i class="la la-utensils"></i>';
                            // }
                            // if (outlets[i]['inCarOrders'] == 1) {
                            //     list += '<i class="la la-car-side"></i>';
                            // }

                            list += '<div><span>Order Now</span></div></div></div></div></div></div>';
                        }
                    } else {
                        list += '<div class="col-12 text-center"><span style="color:#000; font-size: 18px;">No Result Found For <b>"' + searchString + '"</b></span></div>';
                    }

                    $('#outletListSearchs').html('');
                    $('#outletListSearchs').html(list);
                } else {
                    alert(result['msg']);
                }
            },
            error: function(request) {
                //if the request fails, log what happened
                alert(JSON.stringify("Error: " + request));
            }
        });
    }
}

function escapeString(str) {
    return str.replace(/'/g, "\\").replace(/"/g, '\\');
}

// var stores='<?php echo json_encode($stores); ?>';
// //  stores=JSON.parse(stores);
// function openOrderPage(storeSlug){
//    // alert(val);
//    if(storeSlug!=''){
//       // var storeId=$('#store').val();
//       window.location.href="order/"+storeSlug;
//    }

// }

// function showOutlet(city){
//    var outlets=JSON.parse(stores).filter(e=>e.city==city);
//    console.log(outlets);
//    if(outlets.length==1){

//       openOrderPage(outlets[0]['web_slug']);
//    }else{   
//       var list="";
//       for(var i=0;i<outlets.length;i++){
//          list+='<div class="row m-1 p-1" style="background: var(--main-bg-color);border-radius:5px;min-height: 4em;opacity: 1;" onclick=\'openOrderPage("'+outlets[i]['web_slug']+'")\'>';
//          list+='<div class="col-8" style="text-align: left;color: #fff !important;">';
//          list+='<span style="font-size: 16px;color: #fff;font-family: ProximaNova;">';
//          list+= outlets[i]['locality']+',' + outlets[i]['city']+'</span>';
//          list+= '<div style="text-align: left;font-size: 1.25em;    color: #c3c3c3;">';
//          if(outlets[i]['onlineOrdersDelivery']==1){
//             list+='<i class="la la-biking"></i>';
//          }
//          if(outlets[i]['onlineOrdersSelfPickup']==1){
//             list+='<i class="la la-people-carry"></i>';
//          }
//          if(outlets[i]['dineInOrders']==1){
//             list+='<i class="la la-utensils"></i>';
//          }
//          if(outlets[i]['inCarOrders']==1){
//             list+='<i class="la la-car-side"></i>';
//          }
//          list+='</div>  </div>';
//          list+='<div class="col-4" style="vertical-align: middle;display: block;">';
//          list+='<button id="orderNowBTN" class="btn btn-primary orderBtn">Order Now</button></div>';
//          list+='</div>';
//       }

//       $('#outletList').html('');
//       $('#outletList').html(list);

//       $('#outletSelector').modal('show');


//    }
// }