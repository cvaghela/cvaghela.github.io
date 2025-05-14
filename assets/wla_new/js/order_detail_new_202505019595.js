var origin = window.location.origin;
var cart = "";
var item = {};
var templates;
var parentId;
var itemTemplates;
var wizTemplates = [];
var menu;
var menuFull;
var orderId = 0;
var menuSearch = [];
var address;
var orderType = '';
var templateList;
var qty = 0;
var sp = 0;
var geocoder;
var res = [];
var addressServicable = 1;
var main_temp = [];
var promoCode = [];
var distRes = [];
var checkFoodType = [];
var image_layout = 1;
var checkedState = [];
var store_itemId = [];
var cloud_brandId;
var aiFlag = 0;
var gtag_items = JSON.parse(localStorage.getItem('gtag_items')) || [];
var gTotal = JSON.parse(localStorage.getItem('gTotal')) || 0;
var modalSwitch = 1;
$(document).ready(function() {


    var inputDateElement = document.getElementById('inputDate');
    if (inputDateElement) {
        inputDateElement.addEventListener('input', function(e) {
            var selectedDate = e.target.value;
            updateTimeSlots(selectedDate);
        });
    }
    var i = {};

    if (isCloud == 1) {
        $('.append_order').addClass('cloud-kitchen');
    } else {
        $('.append_order').removeClass('cloud-kitchen');
    }

    localStorage.setItem('business', businessId);
    localStorage.setItem('slug',slug);
    
    if (outlet_open != 1) {
        $('#outlet_closed').show();

    } else {
        $('#outlet_closed').hide();
        // let inactiveTypes = [];

        // if (deliveryActive == 0) {
        //     inactiveTypes.push('delivery');
        // }
        // if (pickupActive == 0) {
        //     inactiveTypes.push('pickup');
        // }
        // if (dineActive == 0) {
        //     inactiveTypes.push('dine-in');
        // }
        // if (incarActive == 0) {
        //     inactiveTypes.push('in-car');
        // }

        // if (inactiveTypes.length === 4) {
        //     document.getElementById('orderType_closed').style.display = 'block';
        //     document.getElementById('order_closed').innerHTML = 'Not accepting orders for now';
        // } else if (inactiveTypes.length > 0) {
        //     document.getElementById('orderType_closed').style.display = 'block';
        //     document.getElementById('order_closed').innerHTML = 'Not accepting ' + inactiveTypes.join(', ') + ' orders for now';
        // }
    }

        
    // var banner_view = localStorage.getItem('ipl_popup');
    // var lastViewTime = localStorage.getItem('last_ipl_view_time');
    
    // var twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // if(pId == 7175){
    //     var currentTime = new Date().getTime();
    //     var currentHour = new Date().getHours();
    //     if (!banner_view || (currentTime - lastViewTime >= twentyFourHours)) {
    //         if (currentHour >= 20) {
    //             $('#banner_image').html('');
    //             $('#banner_image').html('<a data-dismiss="modal"><img src="'+ origin +'/assets/wla_new/img/theobroma_banner/ipl-banner.jpg" alt="IPL Banner" width="800" height="800"></a>');
    //             $('#modal-banner').modal("show");
    //             localStorage.setItem('ipl_popup', true);
    //             localStorage.setItem('last_ipl_view_time', currentTime);
    //         }
        
    //     }
    // }


    if (!localStorage.getItem('itemList') || localStorage.getItem('itemList') == '') {

        var j = {};
        j['bId'] = businessId;
        j['items'] = [];
        var finalArr = [];
        finalArr.push(j);
        // console.log(JSON.stringify(j));
        localStorage.setItem('itemList', JSON.stringify(finalArr));
        // console.log(localStorage.getItem('itemList'));
        
        // localStorage.setItem('itemNew',JSON.stringify(j));
    } else {
        
        // console.log(localStorage.getItem('itemList'),'hgfdfh');
        if (JSON.parse(localStorage.getItem('itemList'))[0] == undefined || JSON.parse(localStorage.getItem('itemList'))[0]['bId'] == undefined) {
            var j = {};
            j['bId'] = businessId;
            j['items'] = [];
            var finalArr = [];
            finalArr.push(j);
            // console.log(JSON.stringify(j));
            localStorage.setItem('itemList', JSON.stringify(finalArr));
            i['items'] = [];
        } else {
            var arra = JSON.parse(localStorage.getItem('itemList'));
            var index = arra.findIndex(e => e.bId == businessId);
            if (index == -1) {
                var j = {};
                j['bId'] = businessId;
                j['items'] = [];
                arra.push(j);
                localStorage.setItem('itemList', JSON.stringify(arra));
                i['items'] = [];
            } else {
                i['items'] = arra[index]['items'];
                item = arra[index]['items'];
                //  add_to_cart("add",'',0);
            }

        }


    }

    if(localStorage.getItem("userdata") && localStorage.getItem("userdata") != '' && localStorage.getItem("userdata") != null){
        getWalletData();
    }


    $(document).on("scroll", onScroll);
    var icon = '<img src="' + origin + '/assets/wla_new/img/add_to_cart.png" style="    margin-top: 7em;">';
    // $('.cartDiv').hide();
    // $('#cartEmptyDiv').show();
    // $('#cartDiv').hide();
    // $('#dev-menu-orders-list').html('');
    // $('#dev-menu-orders-list').html(icon);






    $('.colarea').scroll(function() {
        var scrollDistance = 0;
        $('.page-section').each(function(i) {
            // alert(i);
            if ($(this).position().top <= scrollDistance) {

                $('.navigation a.active').removeClass('active');
                $('.navigation a').eq(i).addClass('active');
            }
        });
    }).scroll();


        var staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '.json?nocache=' + (new Date()).getTime();
    

    if (isCloud == 1) {
        if (!localStorage.getItem('brand_modal')) {
            localStorage.setItem('brand_modal', 1);
            $("#change-brand").modal('show');
        }
        $('#cloud_brand').show();
        $('#change_brand').show();
        $('.change_brand').show();
        $('.brand-toggle').addClass('d-block');
        $('.veg-toggle-two').addClass('d-block');
        cloud_brandId = brandId;
        staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '_' + brandId + '.json?nocache=' + (new Date()).getTime();
        
        
        getBrandList(businessId);
        if (brand_id) {

            fetchBrandMenu(brand_id);
        }


    } else {
        $('#cloud_brand').hide();
        $('#change_brand').hide();
        $('.brand-toggle').hide();
        $('.veg-toggle-two').hide();
    }



    parentId = pId;
    //Veg non-veg checkbox

    $('input[name="chkBestSeller"]').click(function() {

        if (cloud_brandId && isCloud == 1) {
        
            staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '_' + cloud_brandId + '.json?nocache=' + (new Date()).getTime();
            
            
            $.getJSON(staticUrl, function(data) {
                renderMenu(data);
            });
        } else {
            $.getJSON(staticUrl, function(data) {
                renderMenu(data);
            });
        }

    });

    if(categoryId == 4){
        localStorage.setItem('orderType',5);
    }

    $.getJSON(staticUrl, function(data) {
        $('.spinner').show();
        if (data.status == 0 && !data.rows) {
            $('.spinner').hide();
            $('#coming_menu').show();
            $('.wla-main-section').hide();
            return false;
        } else {
            $('.spinner').hide();
            $('.wla-main-section').show();
            $('#coming_menu').hide();
        }
        if (data.rows.reviews != undefined) {
            $('.ratings').show();
            $('#rateSpan').html(data.rows.reviews.avg_rating + " <i class='las la-star' aria-hidden='true'></i> ");
            $('#totalReviewSpan').html(data.rows.reviews.rating_count + " Reviews");
        } else {
            $('.ratings').hide();
        }
        if (data.status == 0) {
            var html = "<div style=' margin-top: 7em;text-align: left;font-size:1.5em;color:#000;'>"

                +
                "<span> Outlet is currently Closed</span></div>";
            $('#itemList').html("");
            $('#itemList').html(html);
            $('.spinner').hide();
        } else {

            var fssaino = data.rows.business;
            var d = "";
            if (data.rows.business.image_layout != undefined) {
                image_layout = data.rows.business.image_layout;
            }

            var manufactured_address =  data.rows?.business?.manufactured_address;
            var manufactured_fssai =  data.rows?.business?.manufactured_fssai;
            if (manufactured_address != null && manufactured_address != "null" && manufactured_address != undefined && manufactured_address != '') {
                $('#manufAddress').html(manufactured_address);
                $('#manufaAddress').show();
            }else{
                $('#manufaAddress').hide();
            }

            if (manufactured_fssai != null && manufactured_fssai != "null" && manufactured_fssai != undefined && manufactured_fssai != '') {
                $('#manufFssai').html(manufactured_fssai);
                $('#manufaFssai').show();
                $('#manufaFssai').attr("style", "display: flex;padding: 0.5em;align-items: center;");
                $('#hide_fssai').hide();
            }else{
                $('#manufaFssai').hide();
                $('#hide_fssai').show();
            }

            $('#outltname').html(data.rows.business.name + '- ' + data.rows.business.locality + ', ' + data.rows.business.city);


            promoCodes = data.rows.promos;
            // console.log(promoCodes);
            
            var p = "";

            // if (typeof data.rows.business.currency !== 'undefined' && data.rows.business.currency != 'INR') {
            //     currency = '<i class="las la-dollar-sign"></i>';
            // }

            if (data.rows.business.pureVegetarian == 1) {
                $('.non-veg-switcher').hide();
                $('.veg-flag-span').show();
                $('#vegMoreInfo').show();
                $('#pureVegOnly').show();
                $('#pureVegOnly_mob').show();
                $('#vegNonBoth').hide();
                $('#vegNonBoth_mob').hide();
            } else {
                $('.non-veg-switcher').show();
                $('.veg-flag-span').hide();
                $('#vegMoreInfo').hide();
                $('#pureVegOnly').hide();
                $('#pureVegOnly_mob').hide();
                if(brand_id){
                    if (brand_id == 336 || brand_id == 337 || brand_id == 338) {
                        $('#vegNonBoth').hide();
                        $('#vegNonBoth_mob').hide();
                    }else{
                        $('#vegNonBoth').show();
                        $('#vegNonBoth_mob').show();
                    }
                }else{
                    $('#vegNonBoth').show();
                    $('#vegNonBoth_mob').show();
                }
                
                
                
            }
            
            if (promoCodes && promoCodes != null && promoCodes != '' && promoCodes != 'null' && promoCodes.length > 0) {
                //$('.offers-slider').html('');
                var free = 0;
                $('.coupon-slider').html('');
                $('.coupon-slider-text').show();
                for (var i = 0; i < promoCodes.length; i++) {
                    var text = promoCodes[i]['title'];

                    if (text.length > 51) {
                        text = text.substr(0, text.lastIndexOf(' ', 50)) + '...';
                    }
                    p += '<div class="coupen-card" onclick="openPromoModal(' + i + ');">';
                    p += '<div class="promo-dv">';
                    p += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="68" viewBox="0 0 454 68" fill="none"><rect x="214" y="21" width="29" height="26" fill="#fff"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 31.7002H0V34.582H210.372V31.7002ZM242.072 34.582H453.884V31.7002H242.072V34.582Z" fill="url(#paint0_linear_2462_1113)"></path><g filter="url(#filter0_i_2462_1113)"><path fill-rule="evenodd" clip-rule="evenodd" d="M221.286 11.2869H232.601C243.269 11.2869 248.603 11.2869 251.917 14.5928C254.199 16.869 254.91 20.1003 255.131 25.366C255.175 26.4102 255.197 26.9324 255.002 27.2807C254.807 27.629 254.028 28.0638 252.472 28.9332C250.742 29.8988 249.574 31.7438 249.574 33.861C249.574 35.9782 250.742 37.8232 252.472 38.7888C254.028 39.6582 254.807 40.0929 255.002 40.4413C255.197 40.7896 255.175 41.3118 255.131 42.356C254.91 47.6216 254.199 50.853 251.917 53.1292C248.603 56.4351 243.269 56.4351 232.601 56.4351H221.286C210.618 56.4351 205.284 56.4351 201.969 53.1292C199.688 50.853 198.977 47.6216 198.755 42.356C198.712 41.3118 198.69 40.7896 198.885 40.4413C199.08 40.0929 199.858 39.6582 201.415 38.7888C203.144 37.8232 204.313 35.9782 204.313 33.861C204.313 31.7438 203.144 29.8988 201.415 28.9332C199.858 28.0638 199.08 27.629 198.885 27.2807C198.69 26.9324 198.712 26.4102 198.755 25.366C198.977 20.1003 199.688 16.869 201.969 14.5928C205.284 11.2869 210.618 11.2869 221.286 11.2869ZM236.954 23.8992C237.783 24.7257 237.783 26.0657 236.954 26.8922L219.982 43.8228C219.153 44.6492 217.81 44.6492 216.981 43.8228C216.153 42.9963 216.153 41.6563 216.981 40.8298L233.954 23.8992C234.783 23.0728 236.126 23.0728 236.954 23.8992ZM234.04 43.7372C235.602 43.7372 236.869 42.4738 236.869 40.9154C236.869 39.357 235.602 38.0936 234.04 38.0936C232.478 38.0936 231.211 39.357 231.211 40.9154C231.211 42.4738 232.478 43.7372 234.04 43.7372ZM219.896 29.6283C221.458 29.6283 222.725 28.365 222.725 26.8066C222.725 25.2482 221.458 23.9848 219.896 23.9848C218.334 23.9848 217.067 25.2482 217.067 26.8066C217.067 28.365 218.334 29.6283 219.896 29.6283Z" fill="var(--main-bg-color)"></path></g><defs><filter id="filter0_i_2462_1113" x="193.082" y="0" width="69.7227" height="69.7224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="2" dy="2"></feOffset><feGaussianBlur stdDeviation="3"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_2462_1113"></feBlend></filter><linearGradient id="paint0_linear_2462_1113" x1="39.6248" y1="34.5839" x2="420.743" y2="34.5839" gradientUnits="userSpaceOnUse"><stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop><stop offset="0.25" stop-color="var(--main-bg-color)"></stop><stop offset="0.74" stop-color="var(--main-bg-color)"></stop><stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop></linearGradient></defs></svg>';
                    p += '<div class="coupon-discription">';
                    p += '<h2>' + text + '</h2>';
                    p += '<p class="mb-0">Use Code ' + promoCodes[i]['code'] + '</p>';
                    p += '</div>';
                    p += '</div>';
                    p += '</div>';
                }

                // if(parentId==7175){
                //     p += '<div class="coupen-card">';
                //     p += '<div class="promo-dv">';
                //     p += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="68" viewBox="0 0 454 68" fill="none"><rect x="214" y="21" width="29" height="26" fill="#fff"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 31.7002H0V34.582H210.372V31.7002ZM242.072 34.582H453.884V31.7002H242.072V34.582Z" fill="url(#paint0_linear_2462_1113)"></path><g filter="url(#filter0_i_2462_1113)"><path fill-rule="evenodd" clip-rule="evenodd" d="M221.286 11.2869H232.601C243.269 11.2869 248.603 11.2869 251.917 14.5928C254.199 16.869 254.91 20.1003 255.131 25.366C255.175 26.4102 255.197 26.9324 255.002 27.2807C254.807 27.629 254.028 28.0638 252.472 28.9332C250.742 29.8988 249.574 31.7438 249.574 33.861C249.574 35.9782 250.742 37.8232 252.472 38.7888C254.028 39.6582 254.807 40.0929 255.002 40.4413C255.197 40.7896 255.175 41.3118 255.131 42.356C254.91 47.6216 254.199 50.853 251.917 53.1292C248.603 56.4351 243.269 56.4351 232.601 56.4351H221.286C210.618 56.4351 205.284 56.4351 201.969 53.1292C199.688 50.853 198.977 47.6216 198.755 42.356C198.712 41.3118 198.69 40.7896 198.885 40.4413C199.08 40.0929 199.858 39.6582 201.415 38.7888C203.144 37.8232 204.313 35.9782 204.313 33.861C204.313 31.7438 203.144 29.8988 201.415 28.9332C199.858 28.0638 199.08 27.629 198.885 27.2807C198.69 26.9324 198.712 26.4102 198.755 25.366C198.977 20.1003 199.688 16.869 201.969 14.5928C205.284 11.2869 210.618 11.2869 221.286 11.2869ZM236.954 23.8992C237.783 24.7257 237.783 26.0657 236.954 26.8922L219.982 43.8228C219.153 44.6492 217.81 44.6492 216.981 43.8228C216.153 42.9963 216.153 41.6563 216.981 40.8298L233.954 23.8992C234.783 23.0728 236.126 23.0728 236.954 23.8992ZM234.04 43.7372C235.602 43.7372 236.869 42.4738 236.869 40.9154C236.869 39.357 235.602 38.0936 234.04 38.0936C232.478 38.0936 231.211 39.357 231.211 40.9154C231.211 42.4738 232.478 43.7372 234.04 43.7372ZM219.896 29.6283C221.458 29.6283 222.725 28.365 222.725 26.8066C222.725 25.2482 221.458 23.9848 219.896 23.9848C218.334 23.9848 217.067 25.2482 217.067 26.8066C217.067 28.365 218.334 29.6283 219.896 29.6283Z" fill="var(--main-bg-color)"></path></g><defs><filter id="filter0_i_2462_1113" x="193.082" y="0" width="69.7227" height="69.7224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="2" dy="2"></feOffset><feGaussianBlur stdDeviation="3"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_2462_1113"></feBlend></filter><linearGradient id="paint0_linear_2462_1113" x1="39.6248" y1="34.5839" x2="420.743" y2="34.5839" gradientUnits="userSpaceOnUse"><stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop><stop offset="0.25" stop-color="var(--main-bg-color)"></stop><stop offset="0.74" stop-color="var(--main-bg-color)"></stop><stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop></linearGradient></defs></svg>';
                //     p += '<div class="coupon-discription">';
                //     p += '<h4>25% OFF after 8PM</h4>';
                //     p += '<p class="mb-0">on sandwiches, savouries, croissants and danishes</p>';
                //     p += '</div>';
                //     p += '</div>';
                //     p += '</div>';
                // }

                if (onlineOrdersMinValue && onlineOrdersMinValue != 0 && onlineOrdersMinValue < 2000 && parentId != 28289 && parentId != 31763 && deliveryActive ==1) {
                    free = 1;
                    p += '<div class="coupen-card" id="free-table-mode" style="cursor: unset;">';
                    p += '<div class="promo-dv">';
                    p += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="48" viewBox="0 0 454 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 22H0V24.8818H210.372V22ZM242.072 24.8818H453.884V22H242.072V24.8818Z" fill="url(#paint0_linear_2491_1126)"></path><ellipse cx="226.774" cy="23.7747" rx="22.3338" ry="22.3338" fill="#fff"></ellipse><g filter="url(#filter0_i_2491_1126)"><path d="M214.933 21.2981H216.689V20.1274H214.933V21.2981Z" fill="var(--main-bg-color)"></path><path d="M237.176 22.3693V19.0562C236.833 19.1769 236.536 19.401 236.326 19.6978C236.116 19.9945 236.003 20.3491 236.003 20.7128C236.003 21.0764 236.116 21.431 236.326 21.7278C236.536 22.0245 236.833 22.2487 237.176 22.3693Z" fill="var(--main-bg-color)"></path><path d="M233.97 20.3447C233.802 20.1843 233.589 20.0798 233.36 20.0454V20.0513C233.129 20.0299 232.896 20.0558 232.675 20.1274C232.35 20.275 232.086 20.5306 231.928 20.8507C231.77 21.1708 231.728 21.5357 231.808 21.8835C232.724 21.9187 233.633 21.7171 234.448 21.2981L234.296 20.941C234.252 20.7133 234.138 20.505 233.97 20.3447Z" fill="var(--main-bg-color)"></path><path d="M230.238 14.5498C230.295 14.4567 230.376 14.3814 230.474 14.3323V14.3382C230.609 14.2613 230.731 14.1646 230.837 14.0513C230.408 13.4262 230.17 12.6901 230.152 11.9323H229.046C228.718 11.9323 228.404 12.0625 228.172 12.2941C227.941 12.5257 227.81 12.8399 227.81 13.1675V15.4094L227.898 15.4855C227.941 15.4807 227.984 15.4807 228.027 15.4855C228.829 15.8016 229.449 15.8543 229.783 15.6318C229.895 15.5358 229.986 15.4174 230.049 15.2844C230.113 15.1513 230.148 15.0065 230.152 14.8591C230.151 14.7501 230.181 14.6429 230.238 14.5498Z" fill="var(--main-bg-color)"></path><path d="M224.759 8.8805C224.116 9.52305 223.742 10.3861 223.713 11.2943V11.3001C223.701 12.1386 223.99 12.9535 224.527 13.5976C225.063 14.2418 225.813 14.6726 226.64 14.8123V13.1675C226.641 12.5299 226.895 11.9188 227.346 11.468C227.797 11.0171 228.408 10.7632 229.046 10.7616H230.69C230.552 9.94284 230.128 9.19958 229.494 8.66378C228.859 8.12797 228.055 7.83427 227.225 7.83481H227.172C226.264 7.86408 225.401 8.23796 224.759 8.8805Z" fill="var(--main-bg-color)"></path><path d="M228.825 18.0782C228.083 17.0269 227.379 16.0299 225.469 16.0299C221.522 16.0299 220.836 22.0288 220.787 22.4607L220.786 22.4688V23.0542H225.697C225.886 22.2442 226.27 21.4926 226.815 20.865L226.868 20.8298C226.597 20.516 226.354 20.1791 226.142 19.823C226.09 19.7573 226.053 19.6812 226.033 19.5999C226.013 19.5186 226.011 19.434 226.027 19.3518C226.042 19.2696 226.075 19.1917 226.124 19.1233C226.172 19.0549 226.234 18.9977 226.306 18.9554C226.379 18.9132 226.459 18.8869 226.542 18.8784C226.626 18.8699 226.71 18.8793 226.789 18.9061C226.868 18.9328 226.941 18.9762 227.002 19.0334C227.063 19.0906 227.111 19.1603 227.143 19.2376C227.513 19.8826 228.015 20.4429 228.614 20.8825C229.214 21.322 229.9 21.6311 230.626 21.7898C230.572 21.1623 230.722 20.5342 231.053 19.9986C230 19.7001 229.368 18.8572 228.829 18.0845L228.825 18.0782Z" fill="var(--main-bg-color)"></path><path d="M220.786 24.2249V25.2844C220.787 25.5231 220.741 25.7597 220.651 25.981H223.713C224.101 25.9662 224.488 26.0318 224.85 26.1736C225.212 26.3155 225.541 26.5306 225.815 26.8053C226.09 27.0801 226.305 27.4087 226.447 27.7705C226.589 28.1323 226.655 28.5195 226.64 28.9078V30.0785H228.981V27.1517C228.981 24.26 226.171 24.2249 226.054 24.2249H220.786Z" fill="var(--main-bg-color)"></path><path d="M218.521 35.6867C219.154 36.2223 219.957 36.5167 220.786 36.5175C221.616 36.5167 222.418 36.2223 223.051 35.6867C223.684 35.151 224.107 34.4085 224.246 33.5907H223.046C222.911 34.0867 222.617 34.5246 222.208 34.8368C221.8 35.149 221.3 35.3181 220.786 35.3181C220.272 35.3181 219.772 35.149 219.364 34.8368C218.956 34.5246 218.661 34.0867 218.527 33.5907H217.327C217.465 34.4085 217.888 35.151 218.521 35.6867Z" fill="var(--main-bg-color)"></path><path d="M221.365 34.0106C221.542 33.9101 221.689 33.7654 221.793 33.5907H219.779C219.883 33.7654 220.03 33.9101 220.207 34.0106C220.383 34.1112 220.583 34.164 220.786 34.164C220.989 34.164 221.189 34.1112 221.365 34.0106Z" fill="var(--main-bg-color)"></path><path d="M215.998 28.5624C215.371 29.7571 215.007 31.0727 214.933 32.42H226.054C225.674 31.9134 225.469 31.2972 225.469 30.6639V28.9078C225.482 28.6739 225.445 28.4399 225.361 28.2211C225.277 28.0023 225.148 27.8036 224.983 27.6379C224.817 27.4722 224.618 27.3433 224.4 27.2596C224.181 27.1758 223.947 27.1391 223.713 27.1517H218.404C217.912 27.1435 217.427 27.2708 217.003 27.5196C216.579 27.7684 216.231 28.1292 215.998 28.5624Z" fill="var(--main-bg-color)"></path><path d="M227.385 32.0963C227.68 32.3059 228.034 32.419 228.396 32.42H230.152C230.348 32.4186 230.543 32.4049 230.737 32.379C230.742 32.2259 230.714 32.0736 230.656 31.9319C230.598 31.7901 230.512 31.6619 230.401 31.5556C230.291 31.4492 230.16 31.3671 230.016 31.3143C229.873 31.2616 229.719 31.2394 229.567 31.2493H226.745C226.866 31.5908 227.089 31.8867 227.385 32.0963Z" fill="var(--main-bg-color)"></path><path d="M231.861 31.9868C231.967 31.9154 232.063 31.8308 232.148 31.7351C232.462 31.2855 232.586 30.7302 232.493 30.1898L230.843 23.0132C229.684 22.8542 228.59 22.3805 227.682 21.6435C227.67 21.6659 227.656 21.6874 227.641 21.7079C227.293 22.1287 227.036 22.617 226.886 23.142C227.832 23.2835 228.691 23.7729 229.295 24.5145C229.899 25.2562 230.205 26.1966 230.152 27.1517V30.1605C230.589 30.2539 230.987 30.479 231.293 30.8055C231.599 31.132 231.797 31.5443 231.861 31.9868Z" fill="var(--main-bg-color)"></path><path d="M232.054 23.0542L233.664 29.9498C233.736 30.3797 233.721 30.8197 233.62 31.2438C233.52 31.668 233.336 32.0678 233.079 32.42H235.122L237.674 28.8376L234.911 22.3986C234.023 22.8387 233.045 23.0633 232.054 23.0542Z" fill="var(--main-bg-color)"></path><path d="M237.925 32.42H238.932C239.088 32.42 239.236 32.4816 239.346 32.5914C239.456 32.7012 239.518 32.8501 239.518 33.0053C239.518 33.1606 239.456 33.3095 239.346 33.4193C239.236 33.529 239.088 33.5907 238.932 33.5907H237.925C238.054 33.8139 238.253 33.9883 238.491 34.0869C238.729 34.1856 238.993 34.2029 239.242 34.1362C239.491 34.0695 239.711 33.9225 239.868 33.718C240.025 33.5136 240.11 33.2631 240.11 33.0053C240.11 32.7476 240.025 32.4971 239.868 32.2927C239.711 32.0882 239.491 31.9412 239.242 31.8745C238.993 31.8078 238.729 31.8251 238.491 31.9237C238.253 32.0224 238.054 32.1968 237.925 32.42Z" fill="var(--main-bg-color)"></path><path d="M236.761 32.1332L236.556 32.42H236.673C236.696 32.3226 236.725 32.2268 236.761 32.1332Z" fill="var(--main-bg-color)"></path><path d="M236.667 35.6867C237.301 36.2223 238.103 36.5167 238.932 36.5175C239.864 36.5175 240.757 36.1475 241.416 35.4888C242.074 34.8302 242.444 33.9368 242.444 33.0053C242.444 32.0739 242.074 31.1805 241.416 30.5219C240.757 29.8632 239.864 29.4932 238.932 29.4932H238.634L237.387 31.2493C237.769 30.9111 238.251 30.7069 238.759 30.6678C239.268 30.6286 239.776 30.7566 240.205 31.0324C240.634 31.3081 240.961 31.7165 241.137 32.1954C241.313 32.6742 241.328 33.1974 241.179 33.6854C241.03 34.1733 240.726 34.5993 240.313 34.8985C239.9 35.1978 239.4 35.3539 238.89 35.3432C238.38 35.3325 237.887 35.1555 237.487 34.8392C237.087 34.5228 236.801 34.0845 236.673 33.5907H235.473C235.611 34.4085 236.034 35.151 236.667 35.6867Z" fill="var(--main-bg-color)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M226.775 47.5493C239.905 47.5493 250.549 36.9051 250.549 23.7747C250.549 10.6443 239.905 0 226.775 0C213.644 0 203 10.6443 203 23.7747C203 36.9051 213.644 47.5493 226.775 47.5493ZM238.739 28.3225H238.932C239.834 28.3216 240.716 28.581 241.474 29.0694C242.231 29.5577 242.832 30.2544 243.203 31.0757C243.575 31.897 243.701 32.8081 243.568 33.6995C243.434 34.5909 243.046 35.4249 242.45 36.1012C241.854 36.7775 241.076 37.2675 240.208 37.5122C239.341 37.757 238.421 37.7462 237.559 37.4812C236.698 37.2161 235.931 36.708 235.351 36.0179C234.771 35.3278 234.403 34.485 234.29 33.5907H225.428C225.278 34.7157 224.725 35.748 223.871 36.4956C223.017 37.2433 221.921 37.6555 220.786 37.6555C219.651 37.6555 218.555 37.2433 217.701 36.4956C216.847 35.748 216.294 34.7157 216.144 33.5907H214.347C214.192 33.5907 214.043 33.529 213.933 33.4193C213.823 33.3095 213.762 33.1606 213.762 33.0053C213.749 31.2846 214.151 29.5861 214.933 28.0532C215.116 27.721 215.347 27.4173 215.617 27.1517H212.691C212.216 27.151 211.759 26.9687 211.414 26.6423C211.069 26.3158 210.862 25.8698 210.835 25.3956H208.494C208.338 25.3956 208.189 25.334 208.08 25.2242C207.97 25.1144 207.908 24.9655 207.908 24.8103C207.908 24.655 207.97 24.5061 208.08 24.3964C208.189 24.2866 208.338 24.2249 208.494 24.2249H210.835V23.0542H209.664C209.509 23.0542 209.36 22.9925 209.25 22.8828C209.141 22.773 209.079 22.6241 209.079 22.4688C209.079 22.3136 209.141 22.1647 209.25 22.0549C209.36 21.9452 209.509 21.8835 209.664 21.8835H212.591C212.746 21.8835 212.895 21.9452 213.005 22.0549C213.115 22.1647 213.176 22.3136 213.176 22.4688C213.176 22.6241 213.115 22.773 213.005 22.8828C212.895 22.9925 212.746 23.0542 212.591 23.0542H212.006V24.2249H213.176C213.332 24.2249 213.481 24.2866 213.59 24.3964C213.7 24.5061 213.762 24.655 213.762 24.8103C213.762 24.9655 213.7 25.1144 213.59 25.2242C213.481 25.334 213.332 25.3956 213.176 25.3956H212.006C212.03 25.5616 212.114 25.7128 212.243 25.8207C212.371 25.9286 212.535 25.9856 212.702 25.981H218.919C219.103 25.981 219.279 25.9084 219.409 25.7791C219.54 25.6497 219.614 25.474 219.615 25.2903V20.824C219.615 20.7325 219.597 20.6419 219.562 20.5574C219.527 20.4729 219.476 20.3961 219.411 20.3314C219.347 20.2667 219.27 20.2154 219.185 20.1804C219.101 20.1454 219.01 20.1274 218.919 20.1274H217.859V21.8893C217.859 22.0446 217.798 22.1935 217.688 22.3032C217.578 22.413 217.429 22.4747 217.274 22.4747H214.347C214.192 22.4747 214.043 22.413 213.933 22.3032C213.823 22.1935 213.762 22.0446 213.762 21.8893V20.1332H212.702C212.586 20.1324 212.471 20.1609 212.369 20.2162C212.267 20.2714 212.18 20.3516 212.117 20.4493C212.032 20.5798 211.899 20.6712 211.747 20.7036C211.595 20.736 211.437 20.7066 211.306 20.622C211.176 20.5374 211.084 20.4045 211.052 20.2524C211.02 20.1004 211.049 19.9417 211.134 19.8113C211.302 19.5487 211.535 19.3328 211.809 19.1835C212.083 19.0342 212.39 18.9562 212.702 18.9567H218.919C219.165 18.9565 219.408 19.005 219.635 19.0994C219.862 19.1939 220.069 19.3324 220.242 19.5069C220.851 17.6689 222.039 15.5499 224.298 14.9996C224.155 14.8866 224.018 14.7654 223.889 14.6367C223.452 14.1959 223.107 13.672 222.876 13.0959C222.645 12.5198 222.531 11.9032 222.542 11.2826C222.566 10.0652 223.06 8.90433 223.921 8.04334C224.782 7.18234 225.943 6.68805 227.161 6.66409C227.781 6.65556 228.397 6.77039 228.973 7.0019C229.548 7.23342 230.072 7.577 230.514 8.0127C230.955 8.4484 231.306 8.96752 231.545 9.53992C231.785 10.1123 231.908 10.7266 231.908 11.347C231.911 11.4983 231.856 11.6451 231.753 11.7564C231.651 11.8678 231.509 11.935 231.358 11.944C231.368 12.4178 231.499 12.8812 231.738 13.2904C231.862 13.4061 231.956 13.5501 232.012 13.7102C232.069 13.8703 232.085 14.0416 232.06 14.2094C232.006 14.4221 231.91 14.6219 231.777 14.7968C231.644 14.9717 231.478 15.1183 231.287 15.2279C231.244 15.5037 231.147 15.7682 231.002 16.0062C230.856 16.2443 230.665 16.4513 230.439 16.6152C230.141 16.8081 229.798 16.9191 229.444 16.9372L229.789 17.423C230.48 18.3772 230.919 18.9625 231.908 18.9625H232.417C232.78 18.8681 233.158 18.8443 233.529 18.8923C233.823 18.9308 234.105 19.0291 234.359 19.1811C234.612 19.3331 234.832 19.5357 235.005 19.7762C235.2 19.1986 235.57 18.6964 236.064 18.3396C236.559 17.9828 237.152 17.7893 237.762 17.786C237.917 17.786 238.066 17.8476 238.176 17.9574C238.285 18.0672 238.347 18.2161 238.347 18.3713V23.0542C238.347 23.2094 238.285 23.3583 238.176 23.4681C238.066 23.5779 237.917 23.6396 237.762 23.6396C237.37 23.6343 236.984 23.5507 236.626 23.3937L238.739 28.3225Z" fill="var(--main-bg-color)"></path></g><defs><filter id="filter0_i_2491_1126" x="203" y="0" width="49.5498" height="49.5493" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="2" dy="2"></feOffset><feGaussianBlur stdDeviation="3"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_2491_1126"></feBlend></filter><linearGradient id="paint0_linear_2491_1126" x1="39.6248" y1="24.8837" x2="420.743" y2="24.8837" gradientUnits="userSpaceOnUse"><stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop><stop offset="0.25" stop-color="var(--main-bg-color)"></stop><stop offset="0.74" stop-color="var(--main-bg-color)"></stop><stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop></linearGradient></defs></svg>';
                    p += '<div class="coupon-discription">';
                    p += '<h2>Free Delivery</h2>';
                    p += '<p class="mb-0">on orders above '+currency+'' + onlineOrdersMinValue + '</p>';
                    p += '</div>';
                    p += '</div>';
                    p += '</div>';
                }

                if(promoCodes.length == 1 && free == 1){
                $('.simpleslider').addClass('onlytwo');
            }else if(promoCodes.length == 2 && free == 1){
                $('.simpleslider').addClass('onlythree');
            }else if(promoCodes.length == 1 && free == 0){
                $('.simpleslider').addClass('onlyone');
            }else if(promoCodes.length == 2 && free == 0){
                $('.simpleslider').addClass('onlytwo');
            }else if(promoCodes.length == 3 && free == 0){
                $('.simpleslider').addClass('onlythree');
            }
                // if(pId == 7175){

                //     p += '<div class="coupen-card" id="free-table-mode" style="cursor: unset;">';
                //     p += '<div class="promo-dv">';
                //     p += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="68" viewBox="0 0 454 68" fill="none">';
                //     p += '<path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 31.7002H0V34.582H210.372V31.7002ZM242.072 34.582H453.884V31.7002H242.072V34.582Z" fill="url(#paint0_linear_4310_1075)"></path>';
                //     p += '<g filter="url(#filter0_i_4310_1075)">';
                //     p += '<path fill-rule="evenodd" clip-rule="evenodd" d="M221.285 11.287H232.6C243.268 11.287 248.602 11.287 251.916 14.593C254.198 16.8692 254.909 20.1005 255.13 25.3662C255.174 26.4104 255.196 26.9325 255.001 27.2809C254.806 27.6292 254.027 28.064 252.471 28.9334C250.741 29.899 249.573 31.7439 249.573 33.8612C249.573 35.9784 250.741 37.8233 252.471 38.7889C254.027 39.6584 254.806 40.0931 255.001 40.4415C255.196 40.7898 255.174 41.3119 255.13 42.3562C254.909 47.6218 254.198 50.8532 251.916 53.1294C248.602 56.4353 243.268 56.4353 232.6 56.4353H221.285C210.617 56.4353 205.283 56.4353 201.968 53.1294C199.687 50.8532 198.976 47.6218 198.754 42.3562C198.711 41.3119 198.689 40.7898 198.884 40.4415C199.079 40.0931 199.857 39.6584 201.414 38.7889C203.143 37.8233 204.312 35.9784 204.312 33.8612C204.312 31.7439 203.143 29.899 201.414 28.9334C199.857 28.064 199.079 27.6292 198.884 27.2809C198.689 26.9325 198.711 26.4104 198.754 25.3662C198.976 20.1005 199.687 16.8692 201.968 14.593C205.283 11.287 210.617 11.287 221.285 11.287ZM236.953 23.8994C237.782 24.7259 237.782 26.0659 236.953 26.8923L219.981 43.8229C219.152 44.6494 217.809 44.6494 216.98 43.8229C216.152 42.9965 216.152 41.6565 216.98 40.83L233.953 23.8994C234.782 23.0729 236.125 23.0729 236.953 23.8994ZM234.039 43.7374C235.601 43.7374 236.868 42.474 236.868 40.9156C236.868 39.3572 235.601 38.0938 234.039 38.0938C232.477 38.0938 231.21 39.3572 231.21 40.9156C231.21 42.474 232.477 43.7374 234.039 43.7374ZM219.895 29.6285C221.457 29.6285 222.724 28.3652 222.724 26.8068C222.724 25.2483 221.457 23.985 219.895 23.985C218.333 23.985 217.066 25.2483 217.066 26.8068C217.066 28.3652 218.333 29.6285 219.895 29.6285Z" fill="var(--main-bg-color)"></path>';
                //     p += '</g>';
                //     p += '<defs>';
                //     p += '<filter id="filter0_i_4310_1075" x="193.082" y="0" width="69.7227" height="69.7224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">';
                //     p += '<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>';
                //     p += '<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>';
                //     p += '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>';
                //     p += '<feOffset dx="2" dy="2"></feOffset>';
                //     p += '<feGaussianBlur stdDeviation="3"></feGaussianBlur>';
                //     p += '<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>';
                //     p += '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>';
                //     p += '<feBlend mode="normal" in2="shape" result="effect1_innerShadow_4310_1075"></feBlend>';
                //     p += '</filter>';
                //     p += '<linearGradient id="paint0_linear_4310_1075" x1="39.6248" y1="34.5839" x2="420.743" y2="34.5839" gradientUnits="userSpaceOnUse">';
                //     p += '<stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop>';
                //     p += '<stop offset="0.25" stop-color="var(--main-bg-color)"></stop>';
                //     p += '<stop offset="0.74" stop-color="var(--main-bg-color)"></stop>';
                //     p += '<stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop>';
                //     p += '</linearGradient>';
                //     p += '</defs>';
                //     p += '</svg>';

                //     p += '<div class="coupon-discription">';
                // 	p += '<h4>Earn Brownie Points</h4>';
                // 	p += '<p class="mb-0">1 Brownie Point = '+currency+'1</p>';
                // 	p += '</div>';
                //     p += '</div>';
                // 	p += '</div>';
                // }
                $('.offers-slider').html(p);
                $('.offerDiv').show();

            } else {
                if((onlineOrdersMinValue && onlineOrdersMinValue != 0 && onlineOrdersMinValue < 2000) || pId == 7175){
                    var k = '';
                if (onlineOrdersMinValue && onlineOrdersMinValue != 0 && onlineOrdersMinValue < 2000 && parentId != 28289 && parentId != 31763 && deliveryActive ==1) {
                    k += '<div class="coupen-card" id="free-table-mode" style="cursor: unset;">';
                    k += '<div class="promo-dv">';
                    k += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="48" viewBox="0 0 454 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 22H0V24.8818H210.372V22ZM242.072 24.8818H453.884V22H242.072V24.8818Z" fill="url(#paint0_linear_2491_1126)"></path><ellipse cx="226.774" cy="23.7747" rx="22.3338" ry="22.3338" fill="#fff"></ellipse><g filter="url(#filter0_i_2491_1126)"><path d="M214.933 21.2981H216.689V20.1274H214.933V21.2981Z" fill="var(--main-bg-color)"></path><path d="M237.176 22.3693V19.0562C236.833 19.1769 236.536 19.401 236.326 19.6978C236.116 19.9945 236.003 20.3491 236.003 20.7128C236.003 21.0764 236.116 21.431 236.326 21.7278C236.536 22.0245 236.833 22.2487 237.176 22.3693Z" fill="var(--main-bg-color)"></path><path d="M233.97 20.3447C233.802 20.1843 233.589 20.0798 233.36 20.0454V20.0513C233.129 20.0299 232.896 20.0558 232.675 20.1274C232.35 20.275 232.086 20.5306 231.928 20.8507C231.77 21.1708 231.728 21.5357 231.808 21.8835C232.724 21.9187 233.633 21.7171 234.448 21.2981L234.296 20.941C234.252 20.7133 234.138 20.505 233.97 20.3447Z" fill="var(--main-bg-color)"></path><path d="M230.238 14.5498C230.295 14.4567 230.376 14.3814 230.474 14.3323V14.3382C230.609 14.2613 230.731 14.1646 230.837 14.0513C230.408 13.4262 230.17 12.6901 230.152 11.9323H229.046C228.718 11.9323 228.404 12.0625 228.172 12.2941C227.941 12.5257 227.81 12.8399 227.81 13.1675V15.4094L227.898 15.4855C227.941 15.4807 227.984 15.4807 228.027 15.4855C228.829 15.8016 229.449 15.8543 229.783 15.6318C229.895 15.5358 229.986 15.4174 230.049 15.2844C230.113 15.1513 230.148 15.0065 230.152 14.8591C230.151 14.7501 230.181 14.6429 230.238 14.5498Z" fill="var(--main-bg-color)"></path><path d="M224.759 8.8805C224.116 9.52305 223.742 10.3861 223.713 11.2943V11.3001C223.701 12.1386 223.99 12.9535 224.527 13.5976C225.063 14.2418 225.813 14.6726 226.64 14.8123V13.1675C226.641 12.5299 226.895 11.9188 227.346 11.468C227.797 11.0171 228.408 10.7632 229.046 10.7616H230.69C230.552 9.94284 230.128 9.19958 229.494 8.66378C228.859 8.12797 228.055 7.83427 227.225 7.83481H227.172C226.264 7.86408 225.401 8.23796 224.759 8.8805Z" fill="var(--main-bg-color)"></path><path d="M228.825 18.0782C228.083 17.0269 227.379 16.0299 225.469 16.0299C221.522 16.0299 220.836 22.0288 220.787 22.4607L220.786 22.4688V23.0542H225.697C225.886 22.2442 226.27 21.4926 226.815 20.865L226.868 20.8298C226.597 20.516 226.354 20.1791 226.142 19.823C226.09 19.7573 226.053 19.6812 226.033 19.5999C226.013 19.5186 226.011 19.434 226.027 19.3518C226.042 19.2696 226.075 19.1917 226.124 19.1233C226.172 19.0549 226.234 18.9977 226.306 18.9554C226.379 18.9132 226.459 18.8869 226.542 18.8784C226.626 18.8699 226.71 18.8793 226.789 18.9061C226.868 18.9328 226.941 18.9762 227.002 19.0334C227.063 19.0906 227.111 19.1603 227.143 19.2376C227.513 19.8826 228.015 20.4429 228.614 20.8825C229.214 21.322 229.9 21.6311 230.626 21.7898C230.572 21.1623 230.722 20.5342 231.053 19.9986C230 19.7001 229.368 18.8572 228.829 18.0845L228.825 18.0782Z" fill="var(--main-bg-color)"></path><path d="M220.786 24.2249V25.2844C220.787 25.5231 220.741 25.7597 220.651 25.981H223.713C224.101 25.9662 224.488 26.0318 224.85 26.1736C225.212 26.3155 225.541 26.5306 225.815 26.8053C226.09 27.0801 226.305 27.4087 226.447 27.7705C226.589 28.1323 226.655 28.5195 226.64 28.9078V30.0785H228.981V27.1517C228.981 24.26 226.171 24.2249 226.054 24.2249H220.786Z" fill="var(--main-bg-color)"></path><path d="M218.521 35.6867C219.154 36.2223 219.957 36.5167 220.786 36.5175C221.616 36.5167 222.418 36.2223 223.051 35.6867C223.684 35.151 224.107 34.4085 224.246 33.5907H223.046C222.911 34.0867 222.617 34.5246 222.208 34.8368C221.8 35.149 221.3 35.3181 220.786 35.3181C220.272 35.3181 219.772 35.149 219.364 34.8368C218.956 34.5246 218.661 34.0867 218.527 33.5907H217.327C217.465 34.4085 217.888 35.151 218.521 35.6867Z" fill="var(--main-bg-color)"></path><path d="M221.365 34.0106C221.542 33.9101 221.689 33.7654 221.793 33.5907H219.779C219.883 33.7654 220.03 33.9101 220.207 34.0106C220.383 34.1112 220.583 34.164 220.786 34.164C220.989 34.164 221.189 34.1112 221.365 34.0106Z" fill="var(--main-bg-color)"></path><path d="M215.998 28.5624C215.371 29.7571 215.007 31.0727 214.933 32.42H226.054C225.674 31.9134 225.469 31.2972 225.469 30.6639V28.9078C225.482 28.6739 225.445 28.4399 225.361 28.2211C225.277 28.0023 225.148 27.8036 224.983 27.6379C224.817 27.4722 224.618 27.3433 224.4 27.2596C224.181 27.1758 223.947 27.1391 223.713 27.1517H218.404C217.912 27.1435 217.427 27.2708 217.003 27.5196C216.579 27.7684 216.231 28.1292 215.998 28.5624Z" fill="var(--main-bg-color)"></path><path d="M227.385 32.0963C227.68 32.3059 228.034 32.419 228.396 32.42H230.152C230.348 32.4186 230.543 32.4049 230.737 32.379C230.742 32.2259 230.714 32.0736 230.656 31.9319C230.598 31.7901 230.512 31.6619 230.401 31.5556C230.291 31.4492 230.16 31.3671 230.016 31.3143C229.873 31.2616 229.719 31.2394 229.567 31.2493H226.745C226.866 31.5908 227.089 31.8867 227.385 32.0963Z" fill="var(--main-bg-color)"></path><path d="M231.861 31.9868C231.967 31.9154 232.063 31.8308 232.148 31.7351C232.462 31.2855 232.586 30.7302 232.493 30.1898L230.843 23.0132C229.684 22.8542 228.59 22.3805 227.682 21.6435C227.67 21.6659 227.656 21.6874 227.641 21.7079C227.293 22.1287 227.036 22.617 226.886 23.142C227.832 23.2835 228.691 23.7729 229.295 24.5145C229.899 25.2562 230.205 26.1966 230.152 27.1517V30.1605C230.589 30.2539 230.987 30.479 231.293 30.8055C231.599 31.132 231.797 31.5443 231.861 31.9868Z" fill="var(--main-bg-color)"></path><path d="M232.054 23.0542L233.664 29.9498C233.736 30.3797 233.721 30.8197 233.62 31.2438C233.52 31.668 233.336 32.0678 233.079 32.42H235.122L237.674 28.8376L234.911 22.3986C234.023 22.8387 233.045 23.0633 232.054 23.0542Z" fill="var(--main-bg-color)"></path><path d="M237.925 32.42H238.932C239.088 32.42 239.236 32.4816 239.346 32.5914C239.456 32.7012 239.518 32.8501 239.518 33.0053C239.518 33.1606 239.456 33.3095 239.346 33.4193C239.236 33.529 239.088 33.5907 238.932 33.5907H237.925C238.054 33.8139 238.253 33.9883 238.491 34.0869C238.729 34.1856 238.993 34.2029 239.242 34.1362C239.491 34.0695 239.711 33.9225 239.868 33.718C240.025 33.5136 240.11 33.2631 240.11 33.0053C240.11 32.7476 240.025 32.4971 239.868 32.2927C239.711 32.0882 239.491 31.9412 239.242 31.8745C238.993 31.8078 238.729 31.8251 238.491 31.9237C238.253 32.0224 238.054 32.1968 237.925 32.42Z" fill="var(--main-bg-color)"></path><path d="M236.761 32.1332L236.556 32.42H236.673C236.696 32.3226 236.725 32.2268 236.761 32.1332Z" fill="var(--main-bg-color)"></path><path d="M236.667 35.6867C237.301 36.2223 238.103 36.5167 238.932 36.5175C239.864 36.5175 240.757 36.1475 241.416 35.4888C242.074 34.8302 242.444 33.9368 242.444 33.0053C242.444 32.0739 242.074 31.1805 241.416 30.5219C240.757 29.8632 239.864 29.4932 238.932 29.4932H238.634L237.387 31.2493C237.769 30.9111 238.251 30.7069 238.759 30.6678C239.268 30.6286 239.776 30.7566 240.205 31.0324C240.634 31.3081 240.961 31.7165 241.137 32.1954C241.313 32.6742 241.328 33.1974 241.179 33.6854C241.03 34.1733 240.726 34.5993 240.313 34.8985C239.9 35.1978 239.4 35.3539 238.89 35.3432C238.38 35.3325 237.887 35.1555 237.487 34.8392C237.087 34.5228 236.801 34.0845 236.673 33.5907H235.473C235.611 34.4085 236.034 35.151 236.667 35.6867Z" fill="var(--main-bg-color)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M226.775 47.5493C239.905 47.5493 250.549 36.9051 250.549 23.7747C250.549 10.6443 239.905 0 226.775 0C213.644 0 203 10.6443 203 23.7747C203 36.9051 213.644 47.5493 226.775 47.5493ZM238.739 28.3225H238.932C239.834 28.3216 240.716 28.581 241.474 29.0694C242.231 29.5577 242.832 30.2544 243.203 31.0757C243.575 31.897 243.701 32.8081 243.568 33.6995C243.434 34.5909 243.046 35.4249 242.45 36.1012C241.854 36.7775 241.076 37.2675 240.208 37.5122C239.341 37.757 238.421 37.7462 237.559 37.4812C236.698 37.2161 235.931 36.708 235.351 36.0179C234.771 35.3278 234.403 34.485 234.29 33.5907H225.428C225.278 34.7157 224.725 35.748 223.871 36.4956C223.017 37.2433 221.921 37.6555 220.786 37.6555C219.651 37.6555 218.555 37.2433 217.701 36.4956C216.847 35.748 216.294 34.7157 216.144 33.5907H214.347C214.192 33.5907 214.043 33.529 213.933 33.4193C213.823 33.3095 213.762 33.1606 213.762 33.0053C213.749 31.2846 214.151 29.5861 214.933 28.0532C215.116 27.721 215.347 27.4173 215.617 27.1517H212.691C212.216 27.151 211.759 26.9687 211.414 26.6423C211.069 26.3158 210.862 25.8698 210.835 25.3956H208.494C208.338 25.3956 208.189 25.334 208.08 25.2242C207.97 25.1144 207.908 24.9655 207.908 24.8103C207.908 24.655 207.97 24.5061 208.08 24.3964C208.189 24.2866 208.338 24.2249 208.494 24.2249H210.835V23.0542H209.664C209.509 23.0542 209.36 22.9925 209.25 22.8828C209.141 22.773 209.079 22.6241 209.079 22.4688C209.079 22.3136 209.141 22.1647 209.25 22.0549C209.36 21.9452 209.509 21.8835 209.664 21.8835H212.591C212.746 21.8835 212.895 21.9452 213.005 22.0549C213.115 22.1647 213.176 22.3136 213.176 22.4688C213.176 22.6241 213.115 22.773 213.005 22.8828C212.895 22.9925 212.746 23.0542 212.591 23.0542H212.006V24.2249H213.176C213.332 24.2249 213.481 24.2866 213.59 24.3964C213.7 24.5061 213.762 24.655 213.762 24.8103C213.762 24.9655 213.7 25.1144 213.59 25.2242C213.481 25.334 213.332 25.3956 213.176 25.3956H212.006C212.03 25.5616 212.114 25.7128 212.243 25.8207C212.371 25.9286 212.535 25.9856 212.702 25.981H218.919C219.103 25.981 219.279 25.9084 219.409 25.7791C219.54 25.6497 219.614 25.474 219.615 25.2903V20.824C219.615 20.7325 219.597 20.6419 219.562 20.5574C219.527 20.4729 219.476 20.3961 219.411 20.3314C219.347 20.2667 219.27 20.2154 219.185 20.1804C219.101 20.1454 219.01 20.1274 218.919 20.1274H217.859V21.8893C217.859 22.0446 217.798 22.1935 217.688 22.3032C217.578 22.413 217.429 22.4747 217.274 22.4747H214.347C214.192 22.4747 214.043 22.413 213.933 22.3032C213.823 22.1935 213.762 22.0446 213.762 21.8893V20.1332H212.702C212.586 20.1324 212.471 20.1609 212.369 20.2162C212.267 20.2714 212.18 20.3516 212.117 20.4493C212.032 20.5798 211.899 20.6712 211.747 20.7036C211.595 20.736 211.437 20.7066 211.306 20.622C211.176 20.5374 211.084 20.4045 211.052 20.2524C211.02 20.1004 211.049 19.9417 211.134 19.8113C211.302 19.5487 211.535 19.3328 211.809 19.1835C212.083 19.0342 212.39 18.9562 212.702 18.9567H218.919C219.165 18.9565 219.408 19.005 219.635 19.0994C219.862 19.1939 220.069 19.3324 220.242 19.5069C220.851 17.6689 222.039 15.5499 224.298 14.9996C224.155 14.8866 224.018 14.7654 223.889 14.6367C223.452 14.1959 223.107 13.672 222.876 13.0959C222.645 12.5198 222.531 11.9032 222.542 11.2826C222.566 10.0652 223.06 8.90433 223.921 8.04334C224.782 7.18234 225.943 6.68805 227.161 6.66409C227.781 6.65556 228.397 6.77039 228.973 7.0019C229.548 7.23342 230.072 7.577 230.514 8.0127C230.955 8.4484 231.306 8.96752 231.545 9.53992C231.785 10.1123 231.908 10.7266 231.908 11.347C231.911 11.4983 231.856 11.6451 231.753 11.7564C231.651 11.8678 231.509 11.935 231.358 11.944C231.368 12.4178 231.499 12.8812 231.738 13.2904C231.862 13.4061 231.956 13.5501 232.012 13.7102C232.069 13.8703 232.085 14.0416 232.06 14.2094C232.006 14.4221 231.91 14.6219 231.777 14.7968C231.644 14.9717 231.478 15.1183 231.287 15.2279C231.244 15.5037 231.147 15.7682 231.002 16.0062C230.856 16.2443 230.665 16.4513 230.439 16.6152C230.141 16.8081 229.798 16.9191 229.444 16.9372L229.789 17.423C230.48 18.3772 230.919 18.9625 231.908 18.9625H232.417C232.78 18.8681 233.158 18.8443 233.529 18.8923C233.823 18.9308 234.105 19.0291 234.359 19.1811C234.612 19.3331 234.832 19.5357 235.005 19.7762C235.2 19.1986 235.57 18.6964 236.064 18.3396C236.559 17.9828 237.152 17.7893 237.762 17.786C237.917 17.786 238.066 17.8476 238.176 17.9574C238.285 18.0672 238.347 18.2161 238.347 18.3713V23.0542C238.347 23.2094 238.285 23.3583 238.176 23.4681C238.066 23.5779 237.917 23.6396 237.762 23.6396C237.37 23.6343 236.984 23.5507 236.626 23.3937L238.739 28.3225Z" fill="var(--main-bg-color)"></path></g><defs><filter id="filter0_i_2491_1126" x="203" y="0" width="49.5498" height="49.5493" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dx="2" dy="2"></feOffset><feGaussianBlur stdDeviation="3"></feGaussianBlur><feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="shape" result="effect1_innerShadow_2491_1126"></feBlend></filter><linearGradient id="paint0_linear_2491_1126" x1="39.6248" y1="24.8837" x2="420.743" y2="24.8837" gradientUnits="userSpaceOnUse"><stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop><stop offset="0.25" stop-color="var(--main-bg-color)"></stop><stop offset="0.74" stop-color="var(--main-bg-color)"></stop><stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop></linearGradient></defs></svg>';

                    k += '<div class="coupon-discription">';
                    k += '<h2>Free Delivery</h2>';
                    k += '<p class="mb-0">on orders above '+currency+'' + onlineOrdersMinValue + '</p>';
                    k += '</div>';
                    k += '</div>';
                    k += '</div>';

                }

                // if (pId == 7175) {
                    //     k += '<div class="coupen-card" id="free-table-mode" style="cursor: unset;">';
                //     k += '<div class="promo-dv">';
                //     k += '<svg xmlns="http://www.w3.org/2000/svg" width="454" height="68" viewBox="0 0 454 68" fill="none">';
                //     k += '<path fill-rule="evenodd" clip-rule="evenodd" d="M210.372 31.7002H0V34.582H210.372V31.7002ZM242.072 34.582H453.884V31.7002H242.072V34.582Z" fill="url(#paint0_linear_4310_1075)"></path>';
                //     k += '<g filter="url(#filter0_i_4310_1075)">';
                //     k += '<path fill-rule="evenodd" clip-rule="evenodd" d="M221.285 11.287H232.6C243.268 11.287 248.602 11.287 251.916 14.593C254.198 16.8692 254.909 20.1005 255.13 25.3662C255.174 26.4104 255.196 26.9325 255.001 27.2809C254.806 27.6292 254.027 28.064 252.471 28.9334C250.741 29.899 249.573 31.7439 249.573 33.8612C249.573 35.9784 250.741 37.8233 252.471 38.7889C254.027 39.6584 254.806 40.0931 255.001 40.4415C255.196 40.7898 255.174 41.3119 255.13 42.3562C254.909 47.6218 254.198 50.8532 251.916 53.1294C248.602 56.4353 243.268 56.4353 232.6 56.4353H221.285C210.617 56.4353 205.283 56.4353 201.968 53.1294C199.687 50.8532 198.976 47.6218 198.754 42.3562C198.711 41.3119 198.689 40.7898 198.884 40.4415C199.079 40.0931 199.857 39.6584 201.414 38.7889C203.143 37.8233 204.312 35.9784 204.312 33.8612C204.312 31.7439 203.143 29.899 201.414 28.9334C199.857 28.064 199.079 27.6292 198.884 27.2809C198.689 26.9325 198.711 26.4104 198.754 25.3662C198.976 20.1005 199.687 16.8692 201.968 14.593C205.283 11.287 210.617 11.287 221.285 11.287ZM236.953 23.8994C237.782 24.7259 237.782 26.0659 236.953 26.8923L219.981 43.8229C219.152 44.6494 217.809 44.6494 216.98 43.8229C216.152 42.9965 216.152 41.6565 216.98 40.83L233.953 23.8994C234.782 23.0729 236.125 23.0729 236.953 23.8994ZM234.039 43.7374C235.601 43.7374 236.868 42.474 236.868 40.9156C236.868 39.3572 235.601 38.0938 234.039 38.0938C232.477 38.0938 231.21 39.3572 231.21 40.9156C231.21 42.474 232.477 43.7374 234.039 43.7374ZM219.895 29.6285C221.457 29.6285 222.724 28.3652 222.724 26.8068C222.724 25.2483 221.457 23.985 219.895 23.985C218.333 23.985 217.066 25.2483 217.066 26.8068C217.066 28.3652 218.333 29.6285 219.895 29.6285Z" fill="var(--main-bg-color)"></path>';
                //     k += '</g>';
                //     k += '<defs>';
                //     k += '<filter id="filter0_i_4310_1075" x="193.082" y="0" width="69.7227" height="69.7224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">';
                //     k += '<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>';
                //     k += '<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>';
                //     k += '<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>';
                //     k += '<feOffset dx="2" dy="2"></feOffset>';
                //     k += '<feGaussianBlur stdDeviation="3"></feGaussianBlur>';
                //     k += '<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>';
                //     k += '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>';
                //     k += '<feBlend mode="normal" in2="shape" result="effect1_innerShadow_4310_1075"></feBlend>';
                //     k += '</filter>';
                //     k += '<linearGradient id="paint0_linear_4310_1075" x1="39.6248" y1="34.5839" x2="420.743" y2="34.5839" gradientUnits="userSpaceOnUse">';
                //     k += '<stop stop-color="var(--main-bg-color)" stop-opacity="0"></stop>';
                //     k += '<stop offset="0.25" stop-color="var(--main-bg-color)"></stop>';
                //     k += '<stop offset="0.74" stop-color="var(--main-bg-color)"></stop>';
                //     k += '<stop offset="1" stop-color="var(--main-bg-color)" stop-opacity="0"></stop>';
                //     k += '</linearGradient>';
                //     k += '</defs>';
                //     k += '</svg>';

                //     k += '<div class="coupon-discription">';
                // 	k += '<h4>Earn Brownie Points</h4>';
                // 	k += '<p class="mb-0">1 Brownie Point = '+currency+'1</p>';
                // 	k += '</div>';
                //     k += '</div>';
                // 	k += '</div>';
                // } 

                if(k != ''){
                    $('.offerDiv').show();
                    $('.offers-slider').html(k);
                    $('.simpleslider').addClass('onlyone');
                }else{
                    $('.offerDiv').hide();
                    $('.simpleslider').removeClass('onlyone');
                }
                
            }else {
                    $('.offerDiv').hide();
                }
            }


            if (!brand_id) {
                main_temp = data.rows.templates;
                renderMenu(data);
            }

            // $('.spinner').hide();
        }

    });
    orderType = localStorage.getItem('orderType');

    if (orderType != null && orderType > 0 && orderType != "") {
        const disable_elems = Array.from(document.querySelectorAll('.order-type a.disabled'));
        if (disable_elems.length > 0) {
            let newAr = disable_elems.filter((item) => {
                if (item.getAttribute('option_type') == orderType) {
                    return item;
                }
            });

            if (newAr.length > 0) {
                option_active_inactive();
            } else {
                if ($('.order-type a[option_type=' + orderType + ']').hasClass('disabled') == false) {
                    $('.order-type a[option_type=' + orderType + ']').addClass('active');
                    let orderTypeElement = $('.order-type a[option_type=' + orderType + ']');
                    let orderTypeId = $('.order-type a[option_type=' + orderType + ']').attr('id');
                    localStorage.setItem('orderType',orderType);
                    setOrderType(orderType, orderTypeId,orderTypeElement);
                } else {
                    modalSwitch = 0;
                    option_active_inactive();
                }
            }

        } else {
            option_active_inactive();
        }
    } else {
        option_active_inactive();
    }

    function option_active_inactive() {
        orderType = localStorage.getItem('orderType');
        if (orderType != null && orderType > 0 && orderType != "") {
            if ($('.order-type a[option_type=' + orderType + ']').hasClass('disabled') == false) {
                $('.order-type a[option_type=' + orderType + ']').addClass('active');
                let orderTypeElement = $('.order-type a[option_type=' + orderType + ']');
                let orderTypeId = $('.order-type a[option_type=' + orderType + ']').attr('id');
                setOrderType(orderType, orderTypeId,orderTypeElement);
            }else{
                modalSwitch = 0;
                const find_active = document.querySelectorAll('.order-type a.active');
                if (find_active.length == 0) {
                    const enable_elems = document.querySelectorAll('.order-type a:not(.disabled)');
                    const total_options = enable_elems.length;
                    if (total_options > 0) {

                        var orderType = enable_elems[0].getAttribute('option_type');
                        localStorage.setItem('orderType',orderType);
                        enable_elems[0].click();
                        enable_elems[0].classList.add('active');
                    }
                }
            }
        } else {
            const find_active = document.querySelectorAll('.order-type a.active');
            if (find_active.length == 0) {
                const enable_elems = document.querySelectorAll('.order-type a:not(.disabled)');
                const total_options = enable_elems.length;
                if (total_options > 0) {
                    var orderType = enable_elems[0].getAttribute('option_type');
                    localStorage.setItem('orderType',orderType);
                    enable_elems[0].click();
                    enable_elems[0].classList.add('active');
                }
            }
        }
    }

    function checkUrl() {
        let query = window.location.search;
        let arr = query.substring(1).split("&");
        if (arr.length > 1) {
            // $('a#dineInTag').remove();
            tableId = 0;
            localStorage.setItem('tableId', 0);
            return false;
        } else {
            let prm = arr[0].split('=');
            if (prm[0] == 't' && !isNaN(prm[1])) {
                tableId = prm[1];
                localStorage.setItem('tableId', prm[1]);
                $('a#dineInTag').addClass('active');
                $('a#dineInTag').removeClass('disabled');
                $('a#dineInTag').show();
                $('a#dineInTag').siblings().remove();
                $('#chk_dine').attr("style", "display: inline-block");
                $('.tableNameDisplay').show();
                $('.cart-center').addClass('table-toggle-space');
                $("#openTableModaldelivery").hide();
                $('#mobileTableModaldelivery').attr("style", "display: none !important");
                $(".table-mode").hide();
                modalSwitch = 0;
                // $(document).on('DOMNodeInserted', function(event) {
                //     var targetElement = $('#free-table-mode');
                //     if (targetElement.length) {
                //         targetElement.hide();
                //     }
                // });
                var observer = new MutationObserver(function(mutationsList) {
                
                    mutationsList.forEach(mutation => {
                
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => { // Debugging line
                
                                if (node.id === 'free-table-mode') { // Debugging line
                                    node.style.display = 'none'; // Using vanilla JS for visibility
                                    // Optionally disconnect the observer if you no longer need it
                                    // observer.disconnect();
                                }
                            });
                        }
                    });
                });
                
                // Start observing the document body or a more specific parent element
                observer.observe(document.body, { childList: true, subtree: true });

                if (!localStorage.getItem('openModaltable')) {
                    $('#tablemodal').modal('show');
                    $("#dinemodal").modal('hide');
                    
                    localStorage.setItem('openModaltable', 1);
                }
                return true;
            } else {
                tableId = 0;
                localStorage.setItem('tableId', 0);
                $('.tableNameDisplay').hide();
                $('.cart-center').removeClass('table-toggle-space');
                $('#tablemodal').modal('hide');
                $("#openTableModaldelivery").show();
                $(".table-mode").show();
                $("#dinemodal").modal('hide');
                // $(document).on('DOMNodeInserted', function(event) {
                //     var targetElement = $('#free-table-mode');
                //     if (targetElement.length) {
                //         targetElement.show();
                //     }
                // });
                var observer = new MutationObserver(function(mutationsList) {
                
                    mutationsList.forEach(mutation => {
                
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => { // Debugging line
                
                                if (node.id === 'free-table-mode') { // Debugging line
                                    node.style.display = 'block'; // Using vanilla JS for visibility
                                    // Optionally disconnect the observer if you no longer need it
                                    // observer.disconnect();
                                }
                            });
                        }
                    });
                });
                
                // Start observing the document body or a more specific parent element
                observer.observe(document.body, { childList: true, subtree: true });
                return false;
            }
        }
    }

    var uri = checkUrl();

    if (uri == true) {
        $('#orderTypeTop').html('');
        $('#orderTypeTop').html('<i class="la la la-utensils" style="font-size: 1.5em;line-height: 0em;"></i> Dine In');
        $('.deliveringTo').html();
        $('.deliveringTo').html(address);
        if (dineActive == 1) {
            setOrderType(3, 'dineInTag',this);
        }
        $('#delAddTag').hide();
        $('#pickAddTag').hide();
    } else {

        // localStorage.getItem('orderType') == 3 ? localStorage.setItem('orderType', 1) : '';
        if (localStorage.getItem('orderType') == 1 && localStorage.getItem('lat') && localStorage.getItem('lat') != '' && $('.order-type a[option_type=' + 1 + ']').hasClass('disabled') == false) {
            $('#orderTypeTop').html('');
            $('#orderTypeTop').html('<i class="la la-biking" style="font-size: 1.5em;line-height: 0em;"></i> Delivering To');
            $('.deliveringTo').html();
            $('.deliveringTo').html(localStorage.getItem('formatted_Address'));
            $('#pickAddTag').hide();
            $('#delAddTag').show();
            if(deliveryOnlineActive == 1 && deliveryActive == 1){
                    setOrderType(1, 'delivery-tab',this);
            }

            // getDeliveryDetails();
        } else if (localStorage.getItem('orderType') == 2 && $('.order-type a[option_type=' + 2 + ']').hasClass('disabled') == false) {
            $('#orderTypeTop').html('');
            $('#orderTypeTop').html('<i class="la la-people-carry" style="font-size: 1.5em;line-height: 0em;"></i> Pick Up');
            $('.deliveringTo').html();
            $('.deliveringTo').html(address);
            if (pickupActive == 1) {
                setOrderType(2, 'pickup-tab',this);
            }

            $('#delAddTag').hide();
            $('#pickAddTag').show();
        } else if (localStorage.getItem('orderType') == 3 && $('.order-type a[option_type=' + 3 + ']').hasClass('disabled') == false) {
            $('#orderTypeTop').html('');
            $('#orderTypeTop').html('<i class="la la la-utensils" style="font-size: 1.5em;line-height: 0em;"></i> Dine In');
            $('.deliveringTo').html();
            $('.deliveringTo').html(address);
            if (dineActive == 1) {
                setOrderType(3, 'dineInTag',this);
            }
            $('#delAddTag').hide();
            $('#pickAddTag').hide();

        } else if (localStorage.getItem('orderType') == 4 && $('.order-type a[option_type=' + 4 + ']').hasClass('disabled') == false) {
            $('#orderTypeTop').html('');
            $('#orderTypeTop').html('<i class="la la la-utensils" style="font-size: 1.5em;line-height: 0em;"></i> In Car');
            $('.deliveringTo').html();
            $('.deliveringTo').html(address);
            if (dineActive == 1) {
                setOrderType(4, 'inCarTag',this);
            }

            $('#delAddTag').hide();
            $('#pickAddTag').hide();
        }
    }

    getOrderSiderOverview();

    var cart = i['items'];
    groupItems(cart);

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    if (myParam != 'null' && myParam != null) {
        setTimeout(function() {
            scrollToSection(myParam);
        }, 500);
    }
    if (item_id != 'null' && item_id != null && /^\d+$/.test(item_id)) {
        setTimeout(function() {
            scrollToItems(item_id);
        }, 500);
    }
});

function groupItems(cart) {
    if (cart != undefined && cart.length > 0) {
        var c = "";
        var i = 0;
        var sp = 0;
        cart.forEach(obj => {
            var index = res.findIndex(e => e.itemId == obj.itemId);
            if (index == -1) {
                res.push(obj);
                distRes.push(obj);
                if ($('#div-' + obj['itemId']).length > 0) {
                    $('#btn-' + obj['itemId']).hide();
                    $('#div-' + obj['itemId']).show();
                    $('#feabtn-' + obj['itemId']).hide();
                    $('#feadiv-' + obj['itemId']).show();
                    $('#qty-input-' + obj['itemId']).val(obj['qty']);
                    $('#feaqty-input-' + obj['itemId']).val(obj['qty']);

                } else {
                    $('#btn-' + obj['pId']).hide();
                    $('#div-' + obj['pId']).show();
                    $('#feabtn-' + obj['pId']).hide();
                    $('#feadiv-' + obj['pId']).show();
                    var q = cart.filter(e => e.pId == obj['pId']).reduce((total, obj) => parseInt(obj.qty) + total, 0);
                    $('#qty-input-' + obj['pId']).val(q);
                    $('#feaqty-input-' + obj['pId']).val(q);

                }

            } else {

                if ($('#btn-' + obj['itemId']).length > 0) {


                    if ($('#div-' + obj['itemId']).length > 0) {
                        $('#btn-' + obj['itemId']).hide();
                        $('#div-' + obj['itemId']).show();
                        $('#feabtn-' + obj['itemId']).hide();
                        $('#feadiv-' + obj['itemId']).show();
                        var q = parseInt($('#qty-input-' + obj['itemId']).val()) + 1;
                        $('#qty-input-' + obj['itemId']).val(q);
                        $('#feaqty-input-' + obj['itemId']).val(q);
                    }

                } else {

                    if ($('#div-' + obj['parentId']).length > 0) {
                        $('#btn-' + obj['parentId']).hide();
                        $('#div-' + obj['parentId']).show();
                        $('#feabtn-' + obj['parentId']).hide();
                        $('#feadiv-' + obj['parentId']).show();
                        var q = res.filter(e => e.parentId == obj['parentId']).reduce((total, obj) => parseInt(obj.qty) + parseInt(total), 0)
                        $('#qty-input-' + obj['parentId']).val(q);
                        $('#feaqty-input-' + obj['parentId']).val(q);
                    }
                }

                if (obj['subItems'] == '') {
                    index = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);
                    if (index != -1) {
                        res[index]['qty'] = parseFloat(res[index]['qty']) + parseFloat(1);
                        res[index]['sp'] = parseFloat(res[index]['sp']) + parseFloat(obj['itemPrice']);
                    } else {
                        res.push(obj);
                        distRes.push(obj);
                    }

                } else {

                    index = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);

                    if (index != -1) {
                        res[index]['qty'] = parseFloat(res[index]['qty']) + parseFloat(1);
                        res[index]['sp'] = parseFloat(res[index]['sp']) + parseFloat(obj['itemPrice']);
                        var t = 0;
                        obj['subItems'].forEach(o1 => {

                        if(obj['viewType'] == 3)
                        {
                            if(res[index]['subItems'][t] ?.subItems)
                            {
                                var k = res[index]['subItems'][t]['subItems'].length;
                                for (var i = 0; i < k; i++) {
                                res[index]['subItems'][t]['subItems'][i]['sp'] = (parseFloat(res[index]['subItems'][t]['subItems'][i]['sp']) + parseFloat(o1['subItems'][i]['itemPrice'])).toString();
                                }
                                t++;
                            }
                            
                        }else{
                            res[index]['subItems'][t]['sp'] = (parseFloat(res[index]['subItems'][t]['sp']) + parseFloat(o1['itemPrice'])).toString();
                            t++;
                        }
                        });

                    } else {

                        res.push(obj);
                        distRes.push(obj);
                    }
                }


            }
        });

        res.forEach(obj => {
            if (obj['viewType'] != 2) {
                sp += +obj['sp'];
            }

            $('.cartDiv').show();
            $('#emptyCartDiv').hide();
            $('#cartBTN').show();
            $('#emptyCart').hide();
            c += '<div class="cart-items-outer"><div class="row">';
            if(outlet_open !=1){
                c += '<div class="col-12 cart-lft-btn"><div>';
            }else{
                c += '<div class="col-8 cart-lft-btn"><div>';
            }

            if (obj['vegNonvegBoth'] == 'veg') {
                c += '<div class="veg-flag">';
                c += '<span></span>';
                c += '</div>';
            } else if (obj['vegNonvegBoth'] == 'non-veg') {
                c += '<div class="non-vegflag">';
                c += '<span></span>';
                c += '</div>';
            }

            c += '</div>';
            if (obj['parentName'] != null && obj['parentName'] != "") {
                c += '<div><p class="item-small-hd">' + obj['parentName'] + '-' + obj['itemName'] + '</p>';
            } else {
                c += '<div><p class="item-small-hd">' + obj['itemName'] + '</p>';
            }

            if (obj['viewType'] != 2 && obj['viewType'] != 3) {
                c += '<p class="item-price"><span>' + obj['qty'] + ' x ' + currency + ' ' + + Math.round(obj['itemPrice']) + '</span><b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(obj['sp']) + '</b> </p>';
            }
            if (obj['viewType'] == 3) {
                c += '<p class="item-price"><b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(obj['sp']) + '</b> </p>';
            }
            c += '</div></div>';
            if(outlet_open != 1){
                c += '<div class="col-12 cart-rgt-btn">';
            }else{
                c += '<div class="col-4 cart-rgt-btn">';
            }
            c += '<div class="cart-new-btn">';
            c += '<div class="quantity-btn"><div class="_29Y5Z" id="qty_minus" onclick="update_item(1,' + obj['itemId'] + ',0,' + obj['itemId'] + ',' + obj['customization'] + ')"></div>';
            c += '<input type="hidden" id="act_sel_8360" value="update" class="1"><input type="text" id="del-' + obj['itemId'] + '" class=" _2zAXs qtyVal" readonly="" value="' + obj['qty'] + '">';
            c += '<div class="_1ds9T" id="qty_plus" onclick="update_item(2,' + obj['itemId'] + ',0,' + obj['itemId'] + ',' + obj['customization'] + ')">+</div></div>'
            c += '<div class="y9uHb theo-toggle" id="upbar'+ obj['itemId'] + '"style="display:none"></div>';
            c += '</div>';
            c += '<div class="available-next d-none"><div style="text-align: center; border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 95%;bottom: 0px;left: 10px;">Next available at '+ end_hour +'</div></div>';
            c += '</div>';
            c += '</div>';
            c += '</div>';
            c += '</div>';
            if (obj['subItems'].length > 0) {
                for (var j = 0; j < obj['subItems'].length; j++) {
                    sp += +obj['subItems'][j]['sp'];
                    c += '<div class="additional">';
                    c += '<div class="row">';
                    c += '<div class="col-8 cart-lft-btn">';
                    c += '<div>';
                    if (obj['subItems'][j]['vegNonvegBoth'] == 'veg') {
                        c += '<div class="veg-flag">';
                        c += '<span></span>';
                        c += '</div>';
                    } else if (obj['subItems'][j]['vegNonvegBoth'] == 'non-veg') {
                        c += '<div class="non-vegflag">';
                        c += '<span></span>';
                        c += '</div>';
                    }
                    c += '</div>';
                    c += '<div>';
                    c += '<p class="item-small-hd">' + obj['subItems'][j]['sectionName'] + ':</b> ' + obj['subItems'][j]['itemName'] + '</p>';
                    c += '</div>';
                    c += '</div>';
                    if(outlet_open != 1){
                        c += '<div class="col-12 cart-rgt-btn">';
                    }else{
                        c += '<div class="col-4 cart-rgt-btn">';
                    }
                    if (obj['subItems'][j]['subTotal'] == undefined) {
                        c += '<p class="item-price">' + currency + ' ' + Math.round(obj['subItems'][j]['sp']) + '</p>';
                    } else {
                        c += '<p class="item-price">' + currency + ' ' + Math.round(obj['subItems'][j]['subTotal']) + '</p>';
                    }


                    // c += '<p class="item-price">' + currency + ' ' + obj['subItems'][j]['subTotal'] + '</p>';
                    c += '</div>';
                    c += '</div></div>';
                    if (obj['subItems'] && obj['subItems'][j]?.subItems && obj['subItems'][j]?.subItems.length > 0) {
                        for (var m = 0; m < obj['subItems'][j]['subItems'].length; m++) {
                            sp += +obj['subItems'][j]['subItems'][m]['sp'];
                            c += '<div class="additional">';
                            c += '<div class="row">';
                            c += '<div class="col-8 cart-lft-btn">';
                            c += '<div>';
                            if (obj['subItems'][j]['subItems'][m]['vegnonvegboth'] == 'veg') {
                                c += '<div class="veg-flag">';
                                c += '<span></span>';
                                c += '</div>';
                            } else if (obj['subItems'][j]['subItems'][m]['vegnonvegboth'] == 'non-veg') {
                                c += '<div class="non-vegflag">';
                                c += '<span></span>';
                                c += '</div>';
                            }
                            c += '</div>';
                            c += '<div>';
                            c += '<p class="item-small-hd">' + obj['subItems'][j]['subItems'][m]['sectionName'] + ':</b> ' + obj['subItems'][j]['subItems'][m]['itemName'] + '</p>';
                            c += '</div>';
                            c += '</div>';
                            c += '<div class="col-4 cart-rgt-btn">';
                            if (obj['subItems'][j]['subItems'][m]['subTotal'] == undefined) {
                                c += '<p class="item-price">' + currency + ' ' + Math.round(obj['subItems'][j]['subItems'][m]['sp']) + '</p>';
                            } else {
                                c += '<p class="item-price">' + currency + ' ' + Math.round(obj['subItems'][j]['subItems'][m]['subTotal']) + '</p>';
                            }


                            c += '</div>';
                            c += '</div></div>';

                        }
                    }
                }
            }
            c += '</div>';

            i++;

        });

        $('#cartDisplay').html('');
        $('#cartDisplay').html(c);


        $('#cartItemCount').html(cart.length);
        $('body .search-icon-dv > span').text(cart.length);
        $('#cartAmountCount').html(' ' + cart.length + ' ' + (cart.length == 1 ? 'item' : 'items'));


        $('#itemSpan').html('');
        $('#itemSpan').html('<span class="fa-stack" data-count="' + qty + '" style="left: -0.5em;"></span>');
        $('.subTotalSpan').html('');
        $('.subTotalSpan').html(currency + ' ' + parseFloat(sp).toFixed(2));
        $('.totalSpan').html('');
        $('.totalSpan').html(currency + ' ' + parseFloat(sp).toFixed(2));
        $('.price-checkout').attr("style", "display: block !important");
        if (outlet_open != 1) {
            $('.cart-new-btn').addClass('d-none');
            $('.price-checkout').addClass('disabled');
            $('.price_mobile').addClass('disabled');
            $('.order-type').addClass('disabled');
            $('.available-next').removeClass('d-none');
        } else {
            $('.cart-new-btn').removeClass('d-none');
            $('.price-checkout').removeClass('disabled');
            $('.price_mobile').removeClass('disabled');
            $('.order-type').removeClass('disabled');
            $('.available-next').addClass('d-none');
        }
        $('#showViewCart').show();
    } else {
        // c = '<img src="' + window.location.origin + '/assets/wla_new/img/add_to_cart.png">';
        c = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
            '<g><path d="M167.48,326.6c8.21,21.97,27.89,35.58,50.39,35.58c58.81,0,117.63,0.01,176.44,0.02c2.92,0,5.86-0.1,8.74,0.21   c11.74,1.29,20.14,9.49,21.68,20.96c1.89,14.14-3.74,25.46-15.23,29.78c-2.93,1.1-6.29,1.48-9.45,1.48   c-62.65,0.08-125.3,0.39-187.95-0.08c-33.49-0.25-58.57-17.01-77.45-43.61c-12.26-17.28-20.69-36.62-25.68-57.14   c-5.32-21.89-9.5-44.05-13.98-66.14c-4.48-22.1-8.76-44.24-13.01-66.38c-4.17-21.69-8.16-43.42-12.29-65.12   c-3.04-15.97-6.08-31.95-9.39-47.87c-0.35-1.7-2.23-3.77-3.88-4.39c-12.03-4.57-24.2-8.75-36.29-13.16   C9.85,46.99,3.77,36.37,4.71,24.11C5.64,11.96,13.44,2.35,24.23,0.34c2.06-0.38,4.41-0.53,6.37,0.07   C49.8,6.25,69,12.13,88.09,18.35c6.72,2.19,11.52,7.13,13.96,13.78c3.32,9.06,6.32,18.25,9.16,27.47c1.04,3.37,2.72,4.61,6.24,4.6   c89.06-0.14,178.13-0.19,267.19-0.24c27.79-0.02,55.59-0.14,83.38,0.11c6.69,0.06,13.51,0.79,20.03,2.26   c12.12,2.72,18.08,10.7,19.21,23.23c0.85,9.4-2.65,17.83-5.08,26.47c-4.95,17.55-10.27,35-15.44,52.49   c-5.82,19.7-11.7,39.38-17.47,59.09c-5.77,19.71-11.4,39.46-17.19,59.17c-3.23,10.98-7.66,21.35-16.09,29.53   c-7,6.8-15.47,9.62-25.08,9.63c-29.64,0.02-59.27,0.14-88.91,0.13c-49.44-0.01-98.88-0.09-148.32-0.1   C171.76,325.96,169.86,326.34,167.48,326.6z M290.11,199.41c-32.5,0.21-59.17,14.2-82.07,36.44c-2.28,2.22-3.72,6.13-4.01,9.4   c-0.57,6.35,2.62,11.44,8.42,14.06c5.72,2.59,11.34,1.67,16.34-2.46c5.78-4.77,11.32-9.96,17.59-14   c24.17-15.58,49.54-18.39,76.03-6c10.68,4.99,19.76,12.17,28.41,20.06c6.25,5.7,15.16,5.42,20.77-0.21   c5.78-5.8,6.18-14.76,0.09-20.68C349.03,214.02,322.7,199.98,290.11,199.41z M330.16,162.48c0.06,11.68,9.76,21.39,21.37,21.39   c11.72,0,21.86-10.16,21.69-21.76c-0.16-11.52-10.11-21.41-21.59-21.45C339.92,140.61,330.1,150.59,330.16,162.48z M249.36,162.48   c0.04-11.81-9.92-21.88-21.58-21.82c-11.5,0.06-21.47,9.97-21.58,21.45c-0.11,11.66,9.92,21.73,21.68,21.76   C239.41,183.89,249.32,174.02,249.36,162.48z"></path>' +
            '<path d="M345.73,471.92c0.02-22.05,17.72-39.48,39.97-39.36c22.03,0.12,39.54,17.93,39.4,40.07   c-0.15,21.85-17.75,39.33-39.63,39.37C363.05,512.04,345.7,494.54,345.73,471.92z"></path>' +
            '<path d="M266.1,472.44c-0.05,22.28-17.49,39.6-39.77,39.52c-22.21-0.08-39.66-17.69-39.48-39.86c0.18-22.4,17.5-39.6,39.81-39.53   C248.93,432.63,266.16,450.05,266.1,472.44z"></path>' +
            '</g></svg><h4 class="wla-outlet-name-md mb-2 mt-3 font-weight-bold" style="font-size: 22px;">Your Cart is Empty</h4>';
            if(categoryId == 4){
                c += '<p class="mb-0">Add Service Now!</p>';
            }else{
                c += '<p class="mb-0">We Know Your Food Cravings. Add Your Favorite Meal Now!</p>';
            }
            

        $('#cartDisplay').html('');
        $('#cartDisplay').html(c);
        // $('.cartDiv').hide();
        $('#cartItemCount').html(0);
        $('#emptyCartDiv').show();
        $('#cartBTN').hide();
        $('#emptyCart').show();
        $('.subTotalSpan').html('');
        $('.subTotalSpan').html(currency + ' ' + parseFloat(sp).toFixed(2));
        $('.totalSpan').html('');
        $('.totalSpan').html(currency + ' ' + parseFloat(sp).toFixed(2));
        $('.price-checkout').attr("style", "display: none !important");
        $('.cart-count-add').show();
        $('.quantity-btn').hide();
        $('#showViewCart').hide();
        if (outlet_open != 1) {
            $('.cart-new-btn').addClass('d-none');
            $('.price-checkout').addClass('disabled');
            $('.price_mobile').addClass('disabled');
            $('.order-type').addClass('disabled');
            $('.available-next').removeClass('d-none');
        } else {
            $('.cart-new-btn').removeClass('d-none');
            $('.price-checkout').removeClass('disabled');
            $('.price_mobile').removeClass('disabled');
            $('.order-type').removeClass('disabled');
            $('.available-next').addClass('d-none');
        }
    }
}


function open_combo(itemId, sectionId, parentId, viewType){

    item = {};
    if(menuSearch.length > 0){
        var sectionList = menuSearch.filter(e => e.sectionId == sectionId);
        var itemList;
        if (parentId == 0) {
            itemList = sectionList[0].items.filter(e => e.id == itemId);
            if(itemList[0].variant_count > 0)
            {
                itemList = itemList[0].variants.filter(e => e.parentId == itemId);
            }
        } else {
            var pList = sectionList[0].items.filter(e => e.id == parentId);
            itemList = pList[0].variants.filter(e => e.id == itemId);
        }
        // console.log(itemList);
        
        var wSteps = itemList[0].templates;

        var itemName = itemList[0].itemName;

        var wL = "";
        $('#comboModalTitle').html('');
        $('#comboModalTitle').html(itemName);

        item['itemId'] = itemId;
        item['itemName'] = itemName;
        item['parentItemId'] = 0;
        item['qty'] = 1;
        item['sp'] = parseInt(itemList[0].sp);
        item['itemPrice'] = parseInt(itemList[0].sp);
        item['viewType'] = itemList[0].viewType;
        item['subItems'] = [];
        item['description'] = '';
        item['customization'] = 0;
        item['sectionName'] = sectionList[0].sectionName;
        var list = '';
        var firstElememnt = [];
        var button_text = false;
        var k_value = '';

        for (var k = 0; k < wSteps.length; k++) {
            var topArrList = [];
            var tempPizzaId = wSteps[k]?.templateId
            var toppingIds = wSteps[k]?.toppingPP
            wizTemplates[k] = wSteps[k]?.tempCond;

            var pizzaList = templateList.filter(e => e.templateId == tempPizzaId)[0];
            if (toppingIds != null && toppingIds != '') {
                var toppList = toppingIds.split(',');
                for (var j = 0; j < toppList.length; j++) {
                    topArrList.push(templateList.filter(e => e.templateId == parseInt(toppList[j]))[0]);
                }
            }

            if(k ==0 ){
                list += '<li role="presentation" class="first active" id="combo-'+ k +'">';
                list += '<a href="#wizard-combo-p-'+ k +'" data-toggle="tab" onclick="comboWizard('+ k +')" aria-controls="#wizard-combo-p-'+ k +'" role="tab" aria-expanded="true">';
                list += '<span class="lower-tab">';
                    if(wSteps[k]?.headerName != null && wSteps[k]?.headerName != 'null' && wSteps[k]?.headerName != ''){
                        list += '<span>'+ wSteps[k]?.headerName +'</span>';
                    }
                
                list += '<span>Step '+ (k + 1) +' of ' + (wSteps.length) +'</span>';
                list += '</span>';
                list += '</a>';
                list += '</li>';
                wL += '<div class="tab-pane active" role="tabpanel" id="wizard-combo-p-'+ k +'">';
            }else{
                list += '<li role="presentation" class="first d-none" id="combo-'+ k +'">';
                list += '<a href="#wizard-combo-p-'+ k +'" data-toggle="tab" onclick="comboWizard('+ k +')" aria-controls="#wizard-combo-p-'+ k +'" role="tab" aria-expanded="true">';
                list += '<span class="lower-tab">';
                if(wSteps[k]?.headerName != null && wSteps[k]?.headerName != 'null' && wSteps[k]?.headerName != ''){
                    list += '<span>'+ wSteps[k]?.headerName +'</span>';
                }
                list += '<span>Step '+ (k + 1) +' of ' + (wSteps.length) +'</span>';
                list += '</span>';
                list += '</a>';
                list += '</li>';
                wL += '<div class="tab-pane" role="tabpanel" id="wizard-combo-p-'+ k +'">';
            }

            wL += '<div class="inner-start">';
            wL += '<div class="common-options">';
            wL += "<div id=toping_append_combo" + k + "></div>";
            wL += "<div id=pizza_name_combo" + k + ">";
            if(pizzaList != undefined && pizzaList != ''){
                var minQtySet=0;
                for (var i = 0; i < pizzaList.template.length; i++) {
                    wL += '<ul class="items-row" id="topCombo-'+ k +pizzaList.template[i].id+'">';
                    wL += '<li>';

                    var itemselect_type = wSteps.filter(e => e.templateId == pizzaList.template[i].sectionId);
                    var minQty = 0;
                    var maxQty = 0;
                    var quantity_desc = '';
                    if(itemselect_type && itemselect_type.length > 0){
                        minQty  = itemselect_type[0]['minQty'];
                        maxQty  = itemselect_type[0]['maxQty'];

                        
                        if (minQty > 1 && maxQty != 0) {
                            quantity_desc = "checkbox";
                        } else if (minQty == 1 && maxQty == 1) {
                            quantity_desc = "radio";
                        } else if (minQty == 1 && maxQty > 1) {
                            quantity_desc = "checkbox";
                        } else {
                            quantity_desc = "radio";
                        }
                    }

                    if(quantity_desc == "checkbox"){
                        wL += '<div class="checkbox-outer">';
                        // if (i == 0) {
                            // wL += '<input type="checkbox" id="wiz_combo_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group-combo' + k + '"' +
                            //     'onclick="changeWizardItemCombo(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')">';
                        
                        // } else {
                            var checked='';
                            itemName=pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '');
                            if(minQty>0 && minQtySet!=minQty){
                                
                                wL += '<input type="checkbox"  id="wiz_combo_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group-combo' + k + '"' +
                                    'onclick="changeWizardItemCombo(' + pizzaList.template[i].id + ',' + k + ',\'' + itemName + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')" checked>';
                            }else{
                                itemName=pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '');
                                wL += '<input type="checkbox" id="wiz_combo_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group-combo' + k + '"' +
                                    'onclick="changeWizardItemCombo(' + pizzaList.template[i].id + ',' + k + ',\'' + itemName + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')">';
                            }
                            
                           
                            if(minQty>0 && minQtySet!=minQty){
                                // var id='wiz_combo_' + k + '_' + pizzaList.template[i].id;
                                // document.getElementById(id).checked = true;
                                // document.querySelectorAll('input[type="checkbox"]').checked = true;
                                // console.log(pizzaList.template[i].id,'   ',k);
                                changeWizardItemCombo(pizzaList.template[i].id,k,itemName, pizzaList.template[i].sp , pizzaList.template[i].sectionId, quantity_desc,minQty,maxQty,1);
                                minQtySet++;
                            }    
                        // }
                    }else{
                        wL += '<div class="radio-outer">';
                        if (i == 0 && minQty>0) {
                            wL += '<input type="radio" checked id="wiz_combo_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group-combo' + k + '"' +
                                'onclick="changeWizardItemCombo(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')">';
                            
                            changeWizardItemCombo(pizzaList.template[i].id,k, pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, ''), pizzaList.template[i].sp , pizzaList.template[i].sectionId, quantity_desc,minQty,maxQty);
                        } else {
                            wL += '<input type="radio" id="wiz_combo_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group-combo' + k + '"' +
                                'onclick="changeWizardItemCombo(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')" >';
                        }
                    }
                        wL += ' <label for="wiz_combo_' + k + '_' + pizzaList.template[i].id + '">';
                        wL += '<div class="item-discription-main">';
                        if (pizzaList.template[i].image != null && pizzaList.template[i].image != '') {
                            wL += '<div class="item-nw-placeholder">';
                            wL += '<img src="https://cdn.uengage.io/uploads/' + pId + '/' + pizzaList.template[i].image + '" alt="' + pizzaList.template[i].itemName + '" width="63" height="63">';
                            if (pizzaList.template[i].vegNonvegBoth == 'veg') {
                                wL += '<div class="veg-flag flag-top"><span></span></div>';
                            }else if (pizzaList.template[i].vegNonvegBoth == 'non-veg') {
                                wL += '<div class="non-vegflag flag-top"><span></span></div>';
                            }
                            
                            wL += '</div>';
                            wL += '<span class="item-name">';
                        }else{
                            if (pizzaList.template[i].vegNonvegBoth == 'veg') {
                                wL += '<div><div class="veg-flag flag-top"><span></span></div></div>';
                            }else if (pizzaList.template[i].vegNonvegBoth == 'non-veg') {
                                wL += '<div><div class="non-vegflag flag-top"><span></span></div></div>';
                            }
                            wL += '<span class="item-name" style="max-width:90%;">';
                        }

                    
                        wL += '<div>' + pizzaList.template[i].itemName + '</div>';
                        wL += '<span class="item-price">' + currency + ' ' + Math.round(pizzaList.template[i].sp) + '</span>';
                        wL += '</span>';
                        wL += '</div>';
                        wL += '</label>'; 
                        wL += '</div>'; 
                        wL += '</li>';
                        wL += '</ul>';
                }
            }
            wL += '</div>';
            wL += '</div>';
            wL += '</div>';
            wL += '<div class="bogo_modal">';
            if (k == 0) {
                wL += '<ul class="list-inline pull-right" id= "combo' + k + '">';
                wL += '<div class="tool_tip_combo d-none" id="toast-combo' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
                wL += '<li><span class="btn btn-primary next-step animatebtn" id="combo-custom-button' + k + '" onclick="combostepWizard(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,' + maxQty + ');">Customization</span></li>';
                wL += '</ul>';
            } else if (k > 0 && k < wSteps.length - 1) {
                wL += '<ul class="list-inline pull-right" id= "combo' + k + '">';
                wL += '<div class="tool_tip_combo d-none" id="toast-combo' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
                wL += '<li style="width: auto; padding-right: 12px;"><span class="btn btn-primary prev-step animatebtn" onclick="prevComboWizardStep();">Previous</span></li>';
                wL += '<li><span class="btn btn-primary next-step animatebtn" onclick="nextComboWizardStep(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Next</span></li>';
                wL += '</ul>';
            }
            if (k == wSteps.length - 1) {
                wL += '<ul class="list-inline pull-right" id= "combo' + k + '">';
                wL += '<div class="tool_tip_combo d-none right" id="toast-combo' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
                wL += '<li style="width: auto; padding-right: 12px;"><span class="btn btn-primary prev-step animatebtn" onclick="prevComboWizardStep();">Previous</span></li>';
                wL += '<li><span class="btn btn-primary next-step animatebtn" id="combo-custom-button' + k + '" onclick="combostepWizard(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Customization</span></li>';
                wL += '</ul>';
            }
            wL += '</div>';
            if (topArrList.length === 0) {
                button_text = true;
                k_value = k;
            }

            wL += ' <div id="append_btns_combo' + k + '"></div>';
            wL += '</div>';
        }

        wL += ' <div class="clearfix"></div>';

        $('#comboModalTab').html(list);
        $('#comboModal').modal('show');

        $('#combo_tab').html('');
        $('#combo_tab').html(wL);

        for (var t = 0; t < firstElememnt.length; t++) {
            $('#' + firstElememnt[t]).prop("checked", true);
        }

        if (button_text == true) {
            button_change_combo(k_value);
        }
        if (outlet_open != 1) {
            $('.cart-new-btn').addClass('d-none');
            $('.bogo_modal').addClass('disabled');
            $('.available-next').removeClass('d-none');
        } else {
            $('.cart-new-btn').removeClass('d-none');
            $('.bogo_modal').removeClass('disabled');
            $('.available-next').addClass('d-none');
        }
    }
}

function open_wizard(itemId, sectionId, parentId, viewType) {

    item = {};
    var sectionList = menuSearch.filter(e => e.sectionId == sectionId);
    var itemList;
    if (parentId == 0) {
        itemList = sectionList[0].items.filter(e => e.id == itemId);
        if(itemList[0].variant_count > 0)
        {
            itemList = itemList[0].variants.filter(e => e.parentId == itemId);
        }
    } else {
        var pList = sectionList[0].items.filter(e => e.id == parentId);
        // console.log(pList);
        itemList = pList[0].variants.filter(e => e.id == itemId);
    }
    var wSteps;
    if (viewType == 2) {
        wSteps = itemList[0].templates;
    } else {
        wSteps = itemList[0].wizardSteps;
    }

    var itemName = itemList[0].itemName;

    var wL = "";
    $('#bogoModalTitle').html('');
    $('#bogoModalTitle').html(itemName);

    item['itemId'] = itemId;
    item['itemName'] = itemName;
    item['parentItemId'] = 0;
    item['qty'] = 1;
    item['sp'] = parseInt(itemList[0].sp);
    item['itemPrice'] = parseInt(itemList[0].sp);
    item['viewType'] = itemList[0].viewType;
    item['vegNonvegBoth'] = itemList[0].vegNonvegBoth;
    item['subItems'] = [];
    item['description'] = itemList[0]['description'];
    item['customization'] = 0;
    item['sectionName'] = sectionList[0].sectionName;
    item['sectionId'] = sectionList[0].sectionId;

    if(typeof webengage_tag == "function"){

        var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + itemList[0].image;

        webengage.track("Product Viewed", {
          "Product Name" : item['itemName'] ,
          "Product ID"   : String(item['itemId']) ,
          "Category Name"   : item['sectionName'] ,
          "Category ID"    : item['sectionId'],
          "Price" : parseFloat(item['sp']),
          "Description" :  itemList[0].description ,
          "Image URL": image,
          "Type" :  itemList[0].vegNonvegBoth
        });
    }

    var list = '';
    var firstElememnt = [];
    var button_text = false;
    var k_value = '';
    // var firstItem;
    for (var k = 0; k < wSteps.length; k++) {
        var topArrList = [];
        var tempPizzaId;
        var toppingIds;
        if (viewType == 2) {
            tempPizzaId = wSteps[k]?.templateId
            toppingIds = wSteps[k]?.toppingPP
            wizTemplates[k] = wSteps[k]?.tempCond;
        } else {
            tempPizzaId = wSteps[k]?.pizzaTemplateId;
            toppingIds = wSteps[k]?.customisationTemplateId;
            wizTemplates[k] = wSteps[k]?.templates;

        }

        var pizzaList = templateList.filter(e => e.templateId == tempPizzaId)[0];
        if (toppingIds != null && toppingIds != '') {
            var toppList = toppingIds.split(',');
            for (var j = 0; j < toppList.length; j++) {
                topArrList.push(templateList.filter(e => e.templateId == parseInt(toppList[j]))[0]);
            }
        }
        if (k == 0) {
            list += '<li role="presentation" class="first active not-selected-items" id="bogo-'+k+'">';
            list += '<a href="#wizard-p-' + k + '" data-toggle="tab" onclick="pizzaWizard(' + k + ')" aria-controls="#wizard-p-' + k + '" role="tab" aria-expanded="true">';
            list += '<span class="lower-tab" id="sidebar-dynamic' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item <span class="d-block mt-1" style="font-weight: 600;"></span></span>';
            list += '</a> </li>';
            wL += '<div class="tab-pane active" role="tabpanel" id="wizard-p-' + k + '"><div class="inner-start" ><div class="common-options" >';

        } else {

            list += '<li role="presentation" class="first disabled not-selected-items" id="bogo-'+k+'">';
            list += '<a href="#wizard-p-' + k + '" data-toggle="tab" onclick="pizzaWizard(' + k + ')" aria-controls="#wizard-p-' + k + '" role="tab" aria-expanded="true">';
            list += '<span class="lower-tab" id="sidebar-dynamic' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item <span class="d-block mt-1" style="font-weight: 600;"></span></span>';
            list += '</a> </li>';
            wL += '<div class="tab-pane" role="tabpanel" id="wizard-p-' + k + '"><div class="inner-start"> <div class="common-options" >';
        }
        wL += "<div id=toping_append" + k + "></div>";
        wL += "<div id=pizza_name" + k + ">";

        if(pizzaList != undefined && pizzaList != ''){
            for (var i = 0; i < pizzaList.template.length; i++) {

                wL += '<ul class="items-row" id="topBogo-'+ k +pizzaList.template[i].id+'">';
                wL += '<li>';

                var itemselect_type = wSteps.filter(e => e.templateId == pizzaList.template[i].sectionId);
                var minQty = 0;
                var maxQty = 0;
                var quantity_desc = '';
                if(itemselect_type && itemselect_type.length > 0){
                    minQty  = itemselect_type[0]['minQty'];
                    maxQty  = itemselect_type[0]['maxQty'];

                    
                    if (minQty > 1 && maxQty != 0) {
                        quantity_desc = "checkbox";
                    } else if (minQty == 1 && maxQty == 1) {
                        quantity_desc = "radio";
                    } else if (minQty == 1 && maxQty > 1) {
                        quantity_desc = "checkbox";
                    } else {
                        quantity_desc = "radio";
                    }
                }

                if(quantity_desc == "checkbox"){
                    wL += '<div class="checkbox-outer">';
                    if (i == 0) {
                        wL += '<input type="checkbox" id="wiz_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group' + k + '"' +
                            'onclick="changeWizardItem(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')">';
        
                    } else {
                        wL += '<input type="checkbox" id="wiz_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group' + k + '"' +
                            'onclick="changeWizardItem(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')" >';
                    }
                }else{
                    wL += '<div class="radio-outer">';
                    if (i == 0) {
                        wL += '<input type="radio" id="wiz_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group' + k + '"' +
                            'onclick="changeWizardItem(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')">';
        
                    } else {
                        wL += '<input type="radio" id="wiz_' + k + '_' + pizzaList.template[i].id + '"  name="radio-group' + k + '"' +
                            'onclick="changeWizardItem(' + pizzaList.template[i].id + ',' + k + ',\'' + pizzaList.template[i].itemName.replace(/["']/g, '').replace(/-/g, '') + '\',' + pizzaList.template[i].sp + ',' + pizzaList.template[i].sectionId + ', \'' + quantity_desc + '\','+ minQty +','+ maxQty +')" >';
                    }
                }
    
                wL += ' <label for="wiz_' + k + '_' + pizzaList.template[i].id + '">';
                wL += '<div class="item-discription-main">';
                wL += '<div class="item-nw-placeholder">';
                if (pizzaList.template[i].image != null && pizzaList.template[i].image != '') {
                    
                    wL += '<img src="https://cdn.uengage.io/uploads/' + pId + '/' + pizzaList.template[i].image + '" alt="' + pizzaList.template[i].itemName + '" width="63" height="63">';
                    
                
                }else{
                    wL += '<img src="https://static.uengage.in/uploads/1/image-341933-1673851041.jpeg" alt="' + pizzaList.template[i].itemName + '" width="63" height="63">';
                }
                if (pizzaList.template[i].vegNonvegBoth == 'veg') {
                    wL += '<div class="veg-flag flag-top"><span></span></div>';
                } else if (pizzaList.template[i].vegNonvegBoth == 'non-veg') {
                    wL += '<div class="non-vegflag flag-top"><span></span></div>';
                }
                wL += '</div><span class="item-name" style="display: block;">';
                wL += '<div>' + pizzaList.template[i].itemName + '</div>';
    
                if (pizzaList.template[i].description && pizzaList.template[i].description != null && pizzaList.template[i].description != '' && pizzaList.template[i].description != 'null') {
                    var ellipsis_pizza = '<span class="expand_details" onclick="expand_detail_description(' + pizzaList.template[i].id + ')" style="font-weight: 400;">...Read more</span>';
                    var expand_less_pizza = '<span class="expand_details" onclick="collapse_detail_description(' + pizzaList.template[i].id + ')" style="font-weight: 400;">...Read less</span>';
                    var maxLength = 40;
                    var text = $.trim(pizzaList.template[i].description);
                    if (text.length > maxLength) {
                        text_sub = text.substring(0, maxLength);
                        wL += '<span class=" font-weight-light font-size mt-1 less_desc' + pizzaList.template[i].id + '" style="font-size: 12px;line-height: initial; display:block;">(' + text_sub.substring(0, text.lastIndexOf(" ")) + ellipsis_pizza + ')</span>';
                        wL += '<span class="d-none font-weight-light font-size mt-1 more_desc' + pizzaList.template[i].id + '" style="font-size: 12px;line-height: initial;display:block;">(' + text + expand_less_pizza + ')</span>';
                    } else {
                        wL += '<span class="d-block font-weight-light font-size mt-1" style="font-size: 12px;line-height: initial;">(' + text + ')</span>';
                    }
                }
                wL += '</span>';
                wL += '<span class="item-price">' + currency + ' ' + Math.round(pizzaList.template[i].sp) + '</span></div>';
                wL += '</label> </div> </li></ul>';
    
                
            }
        }else{
            alert('Item is Currently Not Available');
            return false;
        }
        


        wL += '</div></div></div><div class="bogo_modal">';
        if (k == 0) {
            wL += '<ul class="list-inline pull-right" id= "pizza' + k + '">';
            wL += '<div class="tool_tip d-none" id="toast' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
            wL += '<li><span class="btn btn-primary next-step animatebtn" id="custom-button' + k + '" onclick="customWizard(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Customization</span></li>';
            wL += '</ul>';
        } else if (k > 0 && k < wSteps.length - 1) {
            wL += '<ul class="list-inline pull-right" id= "pizza' + k + '">';
            wL += '<div class="tool_tip d-none" id="toast' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
            wL += '<li><span class="btn btn-primary prev-step animatebtn" onclick="prevWizardStep();">Previous</span></li>';
            wL += '<li><span type="button" class="btn btn-primary next-step" onclick="nextWizardStep(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Next</span></li>';
            wL += '</ul>';
        }
        if (k == wSteps.length - 1) {
            wL += '<ul class="list-inline pull-right" id= "pizza' + k + '">';
            wL += '<div class="tool_tip d-none right" id="toast' + k + '">Select your  ' + (parseInt(k) + 1) + nth(k + 1) + ' Item</div>';
            wL += '<li><span class="btn btn-primary prev-step animatebtn" onclick="prevWizardStep();">Previous</span></li>';
            wL += '<li><span class="btn btn-primary next-step" id="custom-button' + k + '" onclick="customWizard(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Customization</span></li>';
            wL += '</ul>';
        }
        wL += '</div>'
        if (topArrList.length === 0) {
            button_text = true;
            k_value = k;
        }

        wL += ' <div id="append_btns' + k + '"></div>';
        // }
        wL += '</div>'

    }

    wL += ' <div class="clearfix"></div>';

    $('#bogoModalTab').html('');
    $('#bogoModalTab').html(list);



    $('#bogo_tab').html('');
    $('#bogo_tab').html(wL);
    $('#bogoModal').modal('show');

    if (button_text == true) {
        button_change(k_value);
    }
    // setTimeout(function(){ 
    for (var t = 0; t < firstElememnt.length; t++) {
        $('#' + firstElememnt[t]).prop("checked", true);
    }

    if (outlet_open != 1) {
        $('.cart-new-btn').addClass('d-none');
        $('.bogo_modal').addClass('disabled');
        $('.available-next').removeClass('d-none');
    } else {
        $('.cart-new-btn').removeClass('d-none');
        $('.bogo_modal').removeClass('disabled');
        $('.available-next').addClass('d-none');
    }

}

function button_change(k) {
    
    for(var i=0 ; i < k ; i++){
        $('#custom-button' + i).text('Next');
    }
    $('#custom-button' + k).text('Order Now');
}

function button_change_combo(k) {
    
    for(var i=0 ; i < k ; i++){
        $('#combo-custom-button' + i).text('Next');
    }
    $('#combo-custom-button' + k).text('Finish');
}

function pizzaWizard(k) {
    if (k == 0) {
        var radioId = $('input[type=radio][name=radio-group' + k + ']:checked').attr('id');
        if (radioId == '' || radioId == null) {
            $("#toast" + k + "").removeClass("d-none");
            return false;
        } else {
            $("#toast" + k + "").addClass("d-none");
            $("#bogo-" + (k + 1) + "").removeClass("disabled");
        }
        $(".topping-list" + k + "").addClass("d-none");
        $("#toping" + k + "").addClass("d-none");
        $("#pizza_name" + k + "").removeClass("d-none");
        $("#pizza" + k + "").removeClass("d-none");
    } else if (k == 1) {
        var radioId = $('input[type=radio][name=radio-group' + k + ']:checked').attr('id');
        if (radioId == '' || radioId == null) {
            $("#toast" + k + "").removeClass("d-none");
            return false;
        } else {
            $("#toast" + k + "").addClass("d-none");
        }
        $("#toping" + k + "").addClass("d-none");
        $(".topping-list" + k + "").addClass("d-none");
        $("#pizza_name" + k + "").removeClass("d-none");
        $("#pizza" + k + "").removeClass("d-none");
    }
}

function comboWizard(k) {
    if (k == 0) {
        var radioId = $('input[type=radio][name=radio-group-combo' + k + ']:checked').attr('id');
        if (radioId == '' || radioId == null) {
            $("#toast-combo" + k + "").removeClass("d-none");
            return false;
        } else {
            $("#toast-combo" + k + "").addClass("d-none");
            $("#Bogo-" + (k + 1) + "").removeClass("disabled");
        }
        $(".topping-list" + k + "").addClass("d-none");
        $("#toping" + k + "").addClass("d-none");
        $("#pizza_name" + k + "").removeClass("d-none");
        $("#pizza" + k + "").removeClass("d-none");
    } else if (k == 1) {
        var radioId = $('input[type=radio][name=radio-group-combo' + k + ']:checked').attr('id');
        if (radioId == '' || radioId == null) {
            $("#toast-combo" + k + "").removeClass("d-none");
            return false;
        } else {
            $("#toast-combo" + k + "").addClass("d-none");
        }
        $("#toping" + k + "").addClass("d-none");
        $(".topping-list" + k + "").addClass("d-none");
        $("#pizza_name" + k + "").removeClass("d-none");
        $("#pizza" + k + "").removeClass("d-none");
    }
}


function customWizard(k,quantity_desc = '',minQty = '',maxQty = '') {
    if(quantity_desc == "checkbox"){
        var radioId = $('input[type=checkbox][name=radio-group' + k + ']:checked').attr('id');
    }else{
        var radioId = $('input[type=radio][name=radio-group' + k + ']:checked').attr('id');
    }
    if (radioId == '' || radioId == null) {
        $("#toast" + k + "").removeClass("d-none");
        return false;
    } else {
        $("#toast" + k + "").addClass("d-none");
        $("#bogo-" + (k + 1) + "").removeClass("disabled");
    }

    

    var val = radioId.split('_');
    var itemId = val[2];
    var toping = '';
    var templateId = [];
    var templateArr = [];
    var topArrList = [];

    var sectionId = '';
    for (var i = 0; i < item['subItems'].length; i++) {
        if (item['subItems'][i]['itemId'] == itemId) {
            sectionId = item['subItems'][i]['sectionId'];
            break;
        }
    }

    // Validate minQty condition before proceeding
    var selectedItems = item['subItems'].filter(function(subItem) {
        return subItem.sectionId === sectionId;
    });

    if (selectedItems.length < minQty) {
        alert('You must select at least ' + minQty + ' items for this section.');
        return false;
    }

    for (var i = 0; i < main_temp.length; i++) {
        var temp = main_temp[i].template.filter(e => e.id == itemId);
        if (temp.length != 0) {
            templateArr = temp;
        }
    }
    if (templateArr.length > 0) {
        for (var i = 0; i < templateArr.length; i++) {
            var arr = templateArr[i]?.templateId;
            if (arr != null && arr != '') {
                templateId = arr.split(',');
            }
        }
    }

    if (templateId == '' || templateId == "0") {
        for (var i = 0; i < wizTemplates[k]?.length; i++) {
            templateId.push(wizTemplates[k][i]['addOnId'])
        }
    }

    var allEmptyValues = true;
    $.each(templateId, function(index, value) {
        if (value !== "" && value !== "0") {
            allEmptyValues = false;
            return false; // Exit the loop early
        }
    });

    if (allEmptyValues == true) {
        if (k == 0) {
            nextWizardStep(k,quantity_desc,minQty,maxQty);
            return false;
        } else {
            add_wizard();
            return false;
        }
    }

    toping += '<div class="topping-list' + k + '">';
    for (var i = 0; i < templateId.length; i++) {



        topArrList = main_temp.filter(e => e.templateId == templateId[i]);

        if (topArrList.length != 0) {
            var topArr = topArrList[0].template;
            var tId = templateId[i];

            var inde = wizTemplates[k].findIndex(e => e.addOnId == tId);
            if (inde != -1) {
                var min = wizTemplates[k][inde]['addon_item_selection_min'];
                var max = wizTemplates[k][inde]['addon_item_selection_max'];
            } else {
                var min = 0;
                var max = 0;
            }
            for (var t = 0; t < topArr.length; t++) {

                if (topArr[t]['items'].length == 0) {
                    if (t == 0) {
                        toping += '<div class="inner-option-start" > <p>' + topArr[t]['sectionName'] + '</p>';
                    }

                    if (min == 1 && max == 1) {
                        if (t == 0) {
                            addwizTopp(topArr[t]["id"], k, topArr[t]['itemName'].replace("'", ""), sp, topArr[t]['sectionId']);

                            toping += '<ul class="items-row" id="bogoTopping-'+ k +topArr[t]["id"]+'"><li>';
                            toping += '<div class="radio-outer">';
                            toping += '<input name ="temp-' + k + '-' + templateId + '" checked id="topp-' + k + '-' + topArr[t]['id'] + '" type="radio"' +
                                'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                            toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                            toping += '<div class="item-discription-main">';
                            toping += '<span class="item-name">';
                            toping += '<div>';
                            if (topArr[t]['vegNonvegBoth'] == 'veg') {
                                toping += '<div class="veg-flag"><span></span></div>';
                            } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                                toping += '<div class="non-vegflag"><span></span></div>';
                            }
                            toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                            toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                            toping += '</div></label></div></li></ul>';
                        } else {
                            toping += '<ul class="items-row" id="bogoTopping-'+ k + topArr[t]["id"]+'"><li>';
                            toping += '<div class="radio-outer">';
                            toping += '<input name ="temp-' + k + '-' + templateId + '" id="topp-' + k + '-' + topArr[t]['id'] + '" type="radio"' +
                                'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                            toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                            toping += '<div class="item-discription-main">';
                            toping += '<span class="item-name">';
                            toping += '<div>';
                            if (topArr[t]['vegNonvegBoth'] == 'veg') {
                                toping += '<div class="veg-flag"><span></span></div>';
                            } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                                toping += '<div class="non-vegflag"><span></span></div>';
                            }
                            toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                            toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                            toping += '</div></label></div></li></ul>';
                        }

                    } else {

                        toping += '<ul class="items-row" id="bogoTopping-'+ k + topArr[t]["id"]+'"><li>';
                        toping += '<div class="checkbox-outer">';
                        toping += '<input class="styled-checkbox" id="topp-' + k + '-' + topArr[t]['id'] + '" type="checkbox"' +
                            'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                        toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                        toping += '<div class="item-discription-main">';
                        toping += '<span class="item-name">';
                        toping += '<div>';
                        if (topArr[t]['vegNonvegBoth'] == 'veg') {
                            toping += '<div class="veg-flag"><span></span></div>';
                        } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                            toping += '<div class="non-vegflag"><span></span></div>';
                        }
                        toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                        toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                        toping += '</div></label></div></li></ul>';
                    }

                    if (t == topArr.length - 1) {
                        toping += '</div>';
                    }
                } else {
                    toping += '<div class="inner-option-start"> <p>' + topArr[t]['itemName'] + '</p>';
                    for (var it = 0; it < topArr[t]['items'].length; it++) {
                        var tempDetail = topArr[t]['items'][it];

                        toping += '<ul class="items-row" id="bogoTopping-'+ k + tempDetail["id"]+'"><li>';
                        toping += '<div class="checkbox-outer">';
                        toping += '<input class="styled-checkbox" id="topp-' + k + '-' + tempDetail['id'] + '" type="checkbox"' +
                            'onclick="addwizTopp(' + tempDetail["id"] + ',' + k + ',\'' + tempDetail['itemName'].replace("'", "") + '\',' + tempDetail['sp'] + ',' + tempDetail['sectionId'] + ')" value="' + tempDetail['id'] + '">';
                        toping += '<label for="topp-' + k + '-' + tempDetail['id'] + '">';
                        toping += '<div class="item-discription-main">';
                        toping += '<span class="item-name">';
                        toping += '<div>';
                        if (tempDetail['vegNonvegBoth'] == 'veg') {
                            toping += '<div class="veg-flag"><span></span></div>';
                        } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                            toping += '<div class="non-vegflag"><span></span></div>';
                        }
                        toping += '</div><div>' + tempDetail['itemName'] + '</div></span>';
                        toping += '<span class="item-price"> ' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                        toping += '</div></label></div></li></ul>';

                    }

                    toping += '</div>';
                }
            }

        }
    }
    toping += "</div>";
    var topings = '';
    if (k == 0) {
        topings += '<ul class="list-inline pull-right" id= "toping' + k + '">';
        topings += '<li><span class="btn btn-primary prev-step animatebtn" id="previous_item' + k + '" value =' + k + ' onclick="prevWizardStep(' + k + ');">Previous</span></li>';
        topings += '<li><span class="btn btn-primary next-step animatebtn" onclick="nextWizardStep(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Continue</span></li>';
        topings += '</ul>';


    } else {
        topings += '<ul class="list-inline pull-right" id= "toping' + k + '">';
        topings += '<li><span class="btn btn-primary prev-step animatebtn" id="previous_item' + k + '" value =' + k + ' onclick="prevWizardStep(' + k + ');">Previous</span></li>';
        topings += '<li><span class="btn btn-primary next-step animatebtn" onclick="add_wizard();">Order Now</span></li>';
        topings += '</ul>';
    }


    $("#toping_append" + k + "").html(toping);
    $("#append_btns" + k + "").html(topings);
    $("#pizza_name" + k + "").addClass("d-none");
    $("#pizza" + k + "").addClass("d-none");
    $('input[type="checkbox"]').click(function() {

        checkedState[$(this).attr('id')] = $(this).is(':checked');
    });

    if (store_itemId.length != 0) {
        $.map(store_itemId, function(value, indexInArray) {
            if (value == itemId) {

                $('input[type="checkbox"]').each(function() {
                    var id = $(this).attr('id');
                    if (checkedState.hasOwnProperty(id)) {
                        $(this).prop('checked', checkedState[id]);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
            }
        });

    }
    store_itemId.push(itemId);
}

function combostepWizard(k,quantity_desc = '',minQty = '',maxQty = '') {
    if(quantity_desc == "checkbox"){
        var radioId = $('input[type=checkbox][name=radio-group-combo' + k + ']:checked').attr('id');
    }else{
        var radioId = $('input[type=radio][name=radio-group-combo' + k + ']:checked').attr('id');
    }
    
    if (minQty>0 && (radioId == '' || radioId == null)) {
        $("#toast-combo" + k + "").removeClass("d-none");
        return false;
    } else {
        $("#toast-combo" + k + "").addClass("d-none");
        $("#combo-" + (k + 1) + "").removeClass("disabled");
    }

    if(radioId!=undefined){
    var val = radioId.split('_');
    var itemId = val[3];
    var toping = '';
    var templateId = [];
    var templateArr = [];
    var topArrList = [];

    var sectionId = '';
    for (var i = 0; i < item['subItems'].length; i++) {
        if (item['subItems'][i]['itemId'] == itemId) {
            sectionId = item['subItems'][i]['sectionId'];
            break;
        }
    }

    // Validate minQty condition before proceeding
    var selectedItems = item['subItems'].filter(function(subItem) {
        return subItem.sectionId === sectionId;
    });


    if (selectedItems.length < minQty) {
        alert('You must select at least ' + minQty + ' items for this section.');
        return false;
    }

    for (var i = 0; i < main_temp.length; i++) {
        var temp = main_temp[i].template.filter(e => e.id == itemId);
        if (temp.length != 0) {
            templateArr = temp;
        }
    }
    if (templateArr.length > 0) {
        for (var i = 0; i < templateArr.length; i++) {
            var arr = templateArr[i]?.templateId;
            if (arr != null && arr != '') {
                templateId = arr.split(',');
            }
        }
    }

    if (templateId == '' || templateId == "0") {
        for (var i = 0; i < wizTemplates[k]?.length; i++) {
            templateId.push(wizTemplates[k][i]['addOnId'])
        }
    }
    }

    var allEmptyValues = true;
    $.each(templateId, function(index, value) {
        if (value !== "" && value !== "0") {
            allEmptyValues = false;
            return false; // Exit the loop early
        }
    });

    if (allEmptyValues == true) {
        if (k == 0) {
            nextComboWizardStep(k,quantity_desc,minQty,maxQty);
            return false;
        } else {
            add_wizard();
            return false;
        }
    }

    toping += '<div class="topping-list' + k + '">';
    for (var i = 0; i < templateId.length; i++) {



        topArrList = main_temp.filter(e => e.templateId == templateId[i]);

        if (topArrList.length != 0) {
            var topArr = topArrList[0].template;
            var tId = templateId[i];

            var inde = wizTemplates[k].findIndex(e => e.addOnId == tId);
            if (inde != -1) {
                var min = wizTemplates[k][inde]['addon_item_selection_min'];
                var max = wizTemplates[k][inde]['addon_item_selection_max'];
            } else {
                var min = 0;
                var max = 0;
            }
            for (var t = 0; t < topArr.length; t++) {

                if (topArr[t]['items'].length == 0) {
                    if (t == 0) {
                        toping += '<div class="inner-option-start" > <p>' + topArr[t]['sectionName'] + '</p>';
                    }

                    if (min == 1 && max == 1) {
                        if (t == 0) {
                            addwizTopp(topArr[t]["id"], k, topArr[t]['itemName'].replace("'", ""), sp, topArr[t]['sectionId']);

                            toping += '<ul class="items-row" id="bogoTopping-'+ k +topArr[t]["id"]+'"><li>';
                            toping += '<div class="radio-outer">';
                            toping += '<input name ="temp-' + k + '-' + templateId + '" checked id="topp-' + k + '-' + topArr[t]['id'] + '" type="radio"' +
                                'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                            toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                            toping += '<div class="item-discription-main">';
                            toping += '<span class="item-name">';
                            toping += '<div>';
                            if (topArr[t]['vegNonvegBoth'] == 'veg') {
                                toping += '<div class="veg-flag"><span></span></div>';
                            } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                                toping += '<div class="non-vegflag"><span></span></div>';
                            }
                            toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                            toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                            toping += '</div></label></div></li></ul>';
                        } else {
                            toping += '<ul class="items-row" id="bogoTopping-'+ k + topArr[t]["id"]+'"><li>';
                            toping += '<div class="radio-outer">';
                            toping += '<input name ="temp-' + k + '-' + templateId + '" id="topp-' + k + '-' + topArr[t]['id'] + '" type="radio"' +
                                'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                            toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                            toping += '<div class="item-discription-main">';
                            toping += '<span class="item-name">';
                            toping += '<div>';
                            if (topArr[t]['vegNonvegBoth'] == 'veg') {
                                toping += '<div class="veg-flag"><span></span></div>';
                            } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                                toping += '<div class="non-vegflag"><span></span></div>';
                            }
                            toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                            toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                            toping += '</div></label></div></li></ul>';
                        }

                    } else {

                        toping += '<ul class="items-row" id="bogoTopping-'+ k + topArr[t]["id"]+'"><li>';
                        toping += '<div class="checkbox-outer">';
                        toping += '<input class="styled-checkbox" id="topp-' + k + '-' + topArr[t]['id'] + '" type="checkbox"' +
                            'onclick="addwizTopp(' + topArr[t]["id"] + ',' + k + ',\'' + topArr[t]['itemName'].replace("'", "") + '\',' + topArr[t]['sp'] + ',' + topArr[t]['sectionId'] + ')" value="' + topArr[t]['id'] + '">';
                        toping += '<label for="topp-' + k + '-' + topArr[t]['id'] + '">';
                        toping += '<div class="item-discription-main">';
                        toping += '<span class="item-name">';
                        toping += '<div>';
                        if (topArr[t]['vegNonvegBoth'] == 'veg') {
                            toping += '<div class="veg-flag"><span></span></div>';
                        } else if (topArr[t]['vegNonvegBoth'] == 'non-veg') {
                            toping += '<div class="non-vegflag"><span></span></div>';
                        }
                        toping += '</div><div>' + topArr[t]['itemName'] + '</div></span>';
                        toping += '<span class="item-price"> ' + currency + ' ' + Math.round(topArr[t]['sp']) + '</span>';
                        toping += '</div></label></div></li></ul>';
                    }

                    if (t == topArr.length - 1) {
                        toping += '</div>';
                    }
                } else {
                    toping += '<div class="inner-option-start"> <p>' + topArr[t]['itemName'] + '</p>';
                    for (var it = 0; it < topArr[t]['items'].length; it++) {
                        var tempDetail = topArr[t]['items'][it];

                        toping += '<ul class="items-row" id="bogoTopping-'+ k + tempDetail["id"]+'"><li>';
                        toping += '<div class="checkbox-outer">';
                        toping += '<input class="styled-checkbox" id="topp-' + k + '-' + tempDetail['id'] + '" type="checkbox"' +
                            'onclick="addwizTopp(' + tempDetail["id"] + ',' + k + ',\'' + tempDetail['itemName'].replace("'", "") + '\',' + tempDetail['sp'] + ',' + tempDetail['sectionId'] + ')" value="' + tempDetail['id'] + '">';
                        toping += '<label for="topp-' + k + '-' + tempDetail['id'] + '">';
                        toping += '<div class="item-discription-main">';
                        toping += '<span class="item-name">';
                        toping += '<div>';
                        if (tempDetail['vegNonvegBoth'] == 'veg') {
                            toping += '<div class="veg-flag"><span></span></div>';
                        } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                            toping += '<div class="non-vegflag"><span></span></div>';
                        }
                        toping += '</div><div>' + tempDetail['itemName'] + '</div></span>';
                        toping += '<span class="item-price"> ' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                        toping += '</div></label></div></li></ul>';

                    }

                    toping += '</div>';
                }
            }

        }
    }
    toping += "</div>";
    var topings = '';
    if (k == 0) {
        topings += '<ul class="list-inline pull-right" id= "toping' + k + '">';
        topings += '<li><span class="btn btn-primary prev-step animatebtn" id="previous_item_combo' + k + '" value =' + k + ' onclick="prevWizardStep(' + k + ');">Previous</span></li>';
        topings += '<li><span class="btn btn-primary next-step animatebtn" onclick="nextWizardStep(' + k + ', \'' + quantity_desc + '\','+ minQty +' ,'+ maxQty +');">Continue</span></li>';
        topings += '</ul>';


    } else {
        topings += '<ul class="list-inline pull-right" id= "toping' + k + '">';
        topings += '<li><span class="btn btn-primary prev-step animatebtn" id="previous_item_combo' + k + '" value =' + k + ' onclick="prevWizardStep(' + k + ');">Previous</span></li>';
        topings += '<li><span class="btn btn-primary next-step animatebtn" onclick="add_wizard();">Order Now</span></li>';
        topings += '</ul>';
    }


    $("#toping_append" + k + "").html(toping);
    $("#append_btns" + k + "").html(topings);
    $("#pizza_name" + k + "").addClass("d-none");
    $("#pizza" + k + "").addClass("d-none");
    $('input[type="checkbox"]').click(function() {

        checkedState[$(this).attr('id')] = $(this).is(':checked');
    });

    if (store_itemId.length != 0) {
        $.map(store_itemId, function(value, indexInArray) {
            if (value == itemId) {

                $('input[type="checkbox"]').each(function() {
                    var id = $(this).attr('id');
                    if (checkedState.hasOwnProperty(id)) {
                        $(this).prop('checked', checkedState[id]);
                    } else {
                        $(this).prop('checked', false);
                    }
                });
            }
        });

    }
    store_itemId.push(itemId);
}

function addwizTopp(toppId, step, itemName, sp, sectionId) {
    // console.log(toppId);
    if (item['subItems'][step]['subItems'] != undefined) {
        var index = item['subItems'][step]['subItems'].findIndex(e => e.itemId == toppId);
        var indexT = wizTemplates[step].findIndex(e => e.addOnId == sectionId);

        if (indexT != -1) {
            var min = wizTemplates[step][indexT]['addon_item_selection_min'];
            var max = wizTemplates[step][indexT]['addon_item_selection_max'];
        } else {
            var min = 0;
            var max = 0;
        }
        var topps = item['subItems'][step]['subItems'].filter(e => e.sectionId == sectionId);
        if (index == -1) {
            if (topps.length > 0 && max == 1 && min == 1) {
                item['subItems'][step]['subItems'].splice(index, 1);
                // alert("You can select max "+max+" items");
                // $("input[name='wiz"+toppId+"']:checkbox").prop('checked',false);
                var obj = {};
                obj['itemId'] = toppId;
                obj['parentItemId'] = 0;
                obj['qty'] = 1;
                obj['sectionId'] = sectionId;
                obj['sectionName'] = main_temp.filter(e => e.templateId == sectionId)[0]['template'][0]['sectionName'];
                obj['sp'] = sp.toString();
                obj['itemPrice'] = sp.toString();
                obj['itemName'] = itemName;
                item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
                item['customization']=1;
                item['subItems'][step]['subItems'].push(obj);
                $('#bogoTopping-'+ step + toppId).addClass('active');
                // $("input[name='"+toppingId+"']:checkbox").prop('checked',false);
                return false;
            } else if (topps.length > 0 && max > 0) {

                if (topps.length < max) {
                    var obj = {};
                    obj['itemId'] = toppId;
                    obj['parentItemId'] = 0;
                    obj['qty'] = 1;
                    obj['sectionId'] = sectionId.toString();
                    obj['sectionName'] = main_temp.filter(e => e.templateId == sectionId)[0]['template'][0]['sectionName'];
                    obj['sp'] = sp.toString();
                    obj['itemPrice'] = sp.toString();
                    obj['itemName'] = itemName;
                    item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
                    item['customization']=1;
                    item['subItems'].push(obj);
                    $('#bogoTopping-'+ step + toppId).addClass('active');
                    // itemTemplates.push(obj);
                } else {
                    alert("You can select max " + max + " items");
                    $("input[name='" + toppingId + "']:checkbox").prop('checked', false);
                    return false;
                }


            } else {
                var obj = {};
                obj['itemId'] = toppId;
                obj['parentItemId'] = 0;
                obj['qty'] = 1;
                obj['sectionId'] = sectionId;
                obj['sectionName'] = main_temp.filter(e => e.templateId == sectionId)[0]['template'][0]['sectionName'];
                obj['sp'] = sp.toString();
                obj['itemPrice'] = sp.toString();
                obj['itemName'] = itemName;
                item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
                item['customization']=1;
                item['subItems'][step]['subItems'].push(obj);
                $('#bogoTopping-'+ step + toppId).addClass('active');
                //   itemTemplates.push(obj);
            }
        } else {
            item['subItems'][step]['subItems'].splice(index, 1);
            $('#bogoTopping-'+ step + toppId).removeClass('active');
        }


        // // console.log(min+'--'+max);
        // if (index == -1) {
        //    var obj = {};
        //    obj['itemId'] = toppId;
        //    obj['parentItemId'] = 0;
        //    obj['qty'] = 1;
        //    obj['itemName']=itemName;
        //    obj['itemPrice']=sp;
        //    obj['sp']=sp;
        //    obj['sectionId']=sectionId;
        //    item['subItems'][step]['subItems'].push(obj);
        // } else {

        // }
    } else {
        var obj = {};
        obj['itemId'] = toppId;
        obj['parentItemId'] = 0;
        obj['qty'] = 1;
        obj['itemName'] = itemName;
        obj['itemPrice'] = sp;
        obj['sp'] = sp;
        obj['sectionId'] = sectionId;
        obj['sectionName'] = main_temp.filter(e => e.templateId == sectionId)[0]['template'][0]['sectionName'];
        item['subItems'][step]['subItems'] = [];
        item['customization']=1;
        item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
        item['subItems'][step]['subItems'].push(obj);
        $('#bogoTopping-'+ step + toppId).addClass('active');

    }
}
let basePrice = 0;
let selectedToppings = [];
let previousToppingPrice=0;
function updateBasePrice(newBasePrice) {
    basePrice = newBasePrice;
    calculateTotalPrice();
}

// Calculate total price dynamically
function calculateTotalPrice() {
    const toppingPrice = selectedToppings.reduce((acc, curr) => acc + curr.price, 0);
    const totalPrice = basePrice + toppingPrice;
    updatePriceUI(totalPrice);
}

// Update the UI to reflect the current total price
function updatePriceUI(price) {
    $('#totalSpanCustom').html(currency + ' ' + parseFloat(price).toFixed(2));
}
window.addEventListener('storage', function (e) {
    if (e.key === 'selectedToppings') {
        selectedToppings = JSON.parse(e.newValue) || [];
        calculateTotalPrice();
    }
});
// Handle variant selection changes (radio button)
$(document).on('change', 'input[name="newAddType"]', function () {
    const price = parseFloat($(this).data('price')) || 0;
    selectedToppings = [];
    previousToppingPrice=0;
    updateBasePrice(price);
});

$(document).on('change', '.topping-radio', function () {
    const newToppingPrice = parseFloat($(this).data('price')) || 0;  // Get the price of the newly selected topping

    // If there was a previous topping selection, deduct its price
    if (previousToppingPrice > 0) {
        basePrice -= previousToppingPrice;  // Deduct the previous topping price
    }

    // Update the base price with the new selected topping price
    basePrice += newToppingPrice;

    // Update the previous topping price
    previousToppingPrice = newToppingPrice;

    // Recalculate the total price
    calculateTotalPrice();
});
// Handle topping selection changes (checkbox)
$(document).on('change', '.styled-checkbox', function () {
    const toppingId = $(this).val();
    const toppingPrice = parseFloat($(this).data('price')) || 0;

    if ($(this).is(':checked')) {
        selectedToppings.push({ id: toppingId, price: toppingPrice });
    } else {
        selectedToppings = selectedToppings.filter(topping => topping.id !== toppingId);
    }

    calculateTotalPrice();
});
function syncModalState() {
    // Set the default variant as selected
    const defaultVariant = $('input[name="newAddType"]:checked');
    if (defaultVariant.length) {
        const price = parseFloat(defaultVariant.data('price')) || 0;
        updateBasePrice(price);
    }else{
     const price = parseFloat($('#totalSpanCustom').attr('data-price'));
     updateBasePrice(price);
     }
    

    // Pre-check toppings if saved in localStorage
    selectedToppings = JSON.parse(localStorage.getItem('selectedToppings')) || [];
    $('.styled-checkbox').each(function () {
        const toppingId = $(this).val();
        const toppingPrice = parseFloat($(this).data('price')) || 0;
        if (selectedToppings.some(topping => topping.id === toppingId)) {
            $(this).prop('checked', true);
        } else {
            $(this).prop('checked', false);
        }
    });
    

    // Update the price based on default selections
    calculateTotalPrice();
}
$('#customisable-item-modal').on('show.bs.modal', function () {
    syncModalState();
});

function showVariant(variantId, sectionId) {
    // $('.spinner').show();
    if (typeof gtag === "function") {

        gtag('event', 'product_selected', {
            'event_category': 'Product Selected',
            'event_label': 'Product selected by user',  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    itemTemplates = "";
    item = {};
    var url = origin + "/petPooja/getItemDetails?sectionId=" + sectionId + "&itemId=" + variantId + "&businessId=" + businessId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            $('#totalSpanCustom').attr('data-price', result['rows']['menu'][0]['sp']);
            if (result['rows']['menu'].length == 0) {
                alert("Item is Currently Not Available");
                $('.spinner').hide();
                return false;
            }
            
            menu = result['rows']['menu'][0];
            if (menu['image'] != null && menu['image'] != '') {
                    var imgTag = '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + menu['image'] + '" alt="' + menu['itemName'] + '" class="zoom" width="345" height="250"></img>';
                
                
            } else {
                var imgTag='<img src="' + bLogo + '" alt="Logo" class="zoom" style="filter: grayscale(0.9);" width="345" height="250"></img>';
            }

            $('#imgprofile_variant').html('');
            $('#imgprofile_variant').html(imgTag);
            $('#imgprofile_variant').show();

            var flagName = '';
            
            if (menu['vegNonvegBoth'] == 'veg') {
                flagName = '<div class="veg-flag"> <span></span> </div>';
            } else if (menu['vegNonvegBoth'] == 'non-veg') {
                flagName += '<div class="non-vegflag"> <span></span> </div>';
            }

            if(menu?.recommended && menu['recommended'] == 1){
                flagName += '<span class="tag-bestseller"><span>Bestseller</span></span>';
            }

            if(menu?.newItem && menu['newItem'] != 0 ){
                flagName += '<span class="tag-new"><span>New</span></span>';
            }

            if(menu?.custom_tags && menu['custom_tags'] != null)
                {
                    var tagsArray = menu['custom_tags'].split(',');
                    tagsArray.forEach(element => {
                        if (pId == 7175) {
                            flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                        } else {
                            flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                        }
                        
                    });
                    
                }

            flagName += '</div>';
            $('#flagdata').html('');
            $('#flagdata').html(flagName);
            $('#variantName').html('');
            $('#variantName').html(menu['itemName']);
            if (menu['description'] != null && menu['description'] != "null" && menu['description'] != "") {
                // Split the description into words
                const description = menu['description'];
                const words = description.split(' ');
            
                // Check if the description exceeds 15 words
                if (words.length > 15) {
                    // Extract the first 15 words
                    const truncatedDescription = words.slice(0, 15).join(' ') + '...';
            
                    // Populate the variant description with truncated text and add "Read More"
                    $('#variantDesc').html(`
                        <div class="short-text d-none d-lg-block">
                            ${truncatedDescription} 
                            <div class="someElement" >Read More</div>
                        </div>
                        <div class="full-text" style="display: none;">
                            ${description}
                            <div class="someElement" ></div>
                        </div>
                        <div class="mobile-case d-block d-lg-none">
                            ${description}
                            <div class="someElement"></div>
                        </div>
                    `);
            
                    // Handle toggling between truncated and full description
                    $(document).on('mouseenter', '#variantDesc .someElement', function () {
                        const shortText = $('#variantDesc .short-text');
                        const fullText = $('#variantDesc .full-text');
            
                        
                            fullText.show();
                      
                    });
                    $(document).on('mouseleave', '#variantDesc .someElement', function () {
                        const shortText = $('#variantDesc .short-text');
                        const fullText = $('#variantDesc .full-text');
            
                        
                            fullText.hide();
                      
                    });
                } else {
                    // If the description is within 15 words, display it as-is
                    $('#variantDesc').html(description);
                }
            }
            templates = result['rows']['templates'];
            var num = parseFloat(menu["avgRating"]);
            if (num != undefined && num > 3) {
                var rat = Math.ceil(num);
                var itemList = '<div class="d-flex" style="margin-bottom: 5px;">';
                for (var a = 0; a < rat; a++) {
                    itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
                }
                itemList += '</div>';
                $('#variantRating').html(itemList);
                $('#variantRating').removeClass('d-none');
            }else{
                $('#variantRating').addClass('d-none');
            }
            if (menu['variant_count'] > 0) {
                const share = e => {
                    if (navigator.share) {
                        navigator
                        .share({
                            title: menu['itemName'],
                            text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                            url: result['sharing_url']
                        })
                        // .then(() => console.log("thanks for share"))
                        .catch(error => console.log("error", 'Browser does not support share'));
                    }
                };
            
                document.getElementById("sharingItem").addEventListener("click", share);

                var sp_arr = menu['variants'].map(function(el) {
                    return el.sp
                });

                var sp_varinat= Math.round(Math.min(...sp_arr));

                var mrp_arr = menu['variants'].map(function(el) {
                    return el.mrp
                });
                
                var mrp_varinat= Math.round(Math.min(...mrp_arr));

                var varinat_price = '<p class="price-p">';
                if (Math.round(mrp_varinat) != Math.round(sp_varinat) && Math.round(mrp_varinat) != 0) {
                    varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(mrp_varinat) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
                } else {
                    varinat_price += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
                }
                varinat_price +='</p>';
                if(aiFlag == 1){
                    varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
                }
                $('#variantPrice').html(varinat_price);
                $('.spinner').show();
                menu['variants'] = menu['variants'].sort((a, b) => a.sp - b.sp);
                item['itemId'] = menu['variants'][0]['id'];
                item['parentItemId'] = 0;
                item['pId'] = menu['variants'][0]['parentId'];
                item['qty'] = 1;
                item['subItems'] = [];
                item['sp'] = menu['variants'][0]['sp'];
                item['itemPrice'] = menu['variants'][0]['sp'];
                item['parentName'] = menu['itemName'];
                item['itemName'] = menu['variants'][0]['itemName'];
                item['description'] = menu['description'];
                item['customization'] = 0;
                item['sectionName'] = menu['sectionName'];
                item['sectionId'] = menu['sectionId'];
                item['image'] = menu['image'];
                item['vegNonvegBoth'] = menu['vegNonvegBoth'];
                // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
                // $('#itemSelectError-' + item['itemId']).hide();
                var variantType = '<div class="inner-options common-options"><div class="inner-option-start pizza-options"><p class="text-center position-relative new-seprator mb-2"><span>Variants</span></p> <div class="pizza-radios">';
                for (var i = 0; i < menu['variants'].length; i++) {
                    if (i == 0) {

                        variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + ")' class='radio-outer position-relative'>";
                        variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" name="newAddType" value="' + menu['variants'][i]['id'] + '" data-price="'+ menu['variants'][i]['sp'] +'" checked="">';
                        variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                        variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                       
                        if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                            variantType += '<span><span class="name-moddd">' +menu['variants'][i]['itemName']+'</span></span><span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span></span>';
                        } else {
                            variantType += '<span><span class="name-moddd">' +menu['variants'][i]['itemName']+'<span></span></span><span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span></span>';
                        }
                        variantType += '</span></span>';
                        // console.log(menu);
                        if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                            variantType += '<span class = "pizza-img text-right"></span>';
                        }

                        variantType += '<span> </label> </div>';

                    } else {
                        variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + ")' class='radio-outer position-relative'>";
                        variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" name="newAddType" value="' + menu['variants'][i]['id'] + '" data-price="'+ menu['variants'][i]['sp'] +'" >';
                        variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                        variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                        variantType += '<span> <span class = "name-moddd" >' + menu['variants'][i]['itemName'] + '<span></span></span>';
                        if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        } else {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        }
                        variantType += '</span>';

                        if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                            variantType += '<span class = "pizza-img text-right"><img src = "' + menu['variants'][i]['variant_icon'] + '"></span>';
                        }

                        variantType += '</span> </label> </div>';

                    }

                }
                variantType += '</div></div></div>';
                if (menu['variants'][0]['templateId'] != 0) {

                    var temps = menu['variants'][0]['templates'];



                    itemTemplates = menu['variants'][0]['templates'];
                    variantType += '<div id="topping">';
                    for (var k = 0; k < temps.length; k++) {

                        var temp = templates.filter(e => e.templateId == temps[k]['templateId']);

                        if (temp.length > 0) {

                            if (temp[0]['template'].length > 0) {
                                var minQty = temps[k]['minQty'];
                                var maxQty = temps[k]['maxQty'];
                                variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                                var quantity_desc;
                                if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                                    quantity_desc = 'Please select any ' + maxQty + '  option';
                                } else if (minQty == 0 && maxQty != 0) {
                                    quantity_desc = 'You can choose up to ' + maxQty + ' option(s)';
                                } else if (minQty != 0 && maxQty != 0) {
                                    quantity_desc = 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                                } else if (minQty != 0 && maxQty == 0) {
                                    quantity_desc = 'Select a minimum of ' + minQty;
                                }

                                if (quantity_desc != null && quantity_desc != '') {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                                } else {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                                }
                                variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none; background-color:#fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                                if(item_variant_template==2){
                                    
                                    variantType += `<div class="modal-new-variants">`; // Start the modal-new-variants wrapper
                                    var imageUrl;
                                    for (var t = 0; t < temp[0]['template'].length; t++) {
                                        if(temp[0]['template'][t]['image']== null){
                                            imageUrl=bLogo;
                                        }else{
                                            imageUrl = "https://cdn.uengage.io/uploads/" + parentId + "/" + temp[0]['template'][t]['image'];

                                        }
                                    
                                        if (minQty == 1 && maxQty == 1) {
                                            if (t == 0) {
                                                variantType += `
                                                    <div class="radio-button-one active" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input data-price=${Math.round(temp[0]['template'][t]['sp'])} checked="checked" class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                                addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);
                                            } else {
                                                variantType += `
                                                    <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input data-price=${Math.round(temp[0]['template'][t]['sp'])} class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                            }
                                        } else {
                                            if (temp[0]['template'][t]['items'].length == 0) {
                                                variantType += `
                                                    <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input data-price="${Math.round(temp[0]['template'][t]['sp'])}"  class="styled-checkbox" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temp[0]['template'][t]['id']}" value="${temp[0]['template'][t]['id']}" type="checkbox">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                   
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                            } else {
                                                variantType += `
                                                    <div class="col-12 p-1">
                                                        <span style="color: #000; border-bottom: 1.5px solid #000; padding-bottom: 4px;">${temp[0]['template'][t]['itemName']}</span>
                                                    </div>`;
                                                for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                    var tempDetail = temp[0]['template'][t]['items'][k];
                                                    variantType += `
                                                        <div class="checkbox-button-one" id="topping-${tempDetail['sectionId']}-${tempDetail['id']}">
                                                            <input  data-price="${Math.round(temp[0]['template'][t]['sp'])}" class="styled-checkbox" onclick="addTopping(${variantId}, ${tempDetail['id']}, ${tempDetail['sectionId']})" 
                                                                id="${tempDetail['id']}" name="${tempDetail['id']}" value="${tempDetail['id']}" type="checkbox">
                                                            <label class="btn btn-default" for="${tempDetail['id']}">
                                                                <span class="radio-text">
                                                                    <span class="radio-image">
                                                                        <img src="${tempDetail['imageUrl']}" alt="${tempDetail['itemName']}" width="40" height="40">
                                                                    </span>
                                                                    <span class="radio-title">
                                                                      
                                                                        <div>${tempDetail['itemName']}</div>
                                                                    </span>
                                                                    <span class="radio-price">${currency} ${Math.round(tempDetail['sp'])}</span>
                                                                </span>
                                                            </label>
                                                        </div>`;
                                                }
                                            }
                                        }
                                    }
                                    
                                    variantType += `</div>`; // Close the modal-new-variants wrapper
                                    
                                    
                                    
                                      
                                    
                                }else{
                                for (var t = 0; t < temp[0]['template'].length; t++) {

                                    if (minQty == 1 && maxQty == 1) {
                                        if (t == 0) {
                                            variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input data-price="'+ Math.round(temp[0]['template'][t]['sp']) +'"  checked="checked" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }

                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                            addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                        } else {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input  data-price="'+ Math.round(temp[0]['template'][t]['sp']) +'" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                        }
                                    } else {
                                        if (temp[0]['template'][t]['items'].length == 0) {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="checkbox-outer">';
                                            variantType += '<input data-price="'+Math.round(temp[0]['template'][t]['sp']) +'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            // variantType+='<div class="veg-flag"> <span></span></div>';
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';



                                        } else {
                                            variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                            for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                var tempDetail = temp[0]['template'][t]['items'][k];
                                                variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+tempDetail['id']+'">';
                                                variantType += '<li><div class="checkbox-outer">';
                                                variantType += '<input data-price="'+Math.round(temp[0]['template'][t]['sp']) +'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                                variantType += '<label for="' + tempDetail['id'] + '">';
                                                variantType += '<div class="item-discription-main">';
                                                variantType += '<span class="item-name"><div>';
                                                if (tempDetail['vegNonvegBoth'] == 'veg') {
                                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                                } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                                }
                                                // variantType+='<div class="veg-flag"> <span></span></div>';
                                                variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                                variantType += '</div></label> </div></li></ul>';
                                            }

                                        }

                                    }
                                }
                            }
                                variantType += '</div></div>';
                            }
                            $('#variantCustom').removeClass('d-none');
                        }else{
                            $('#variantCustom').addClass('d-none');
                        }


                    }
                    variantType += '</div>';
                }

                // variantType+='</div>';
                $('#variantBody').html('');
                $('#variantBody').html(variantType);
                $('#customisable-item-modal').modal('show');
                $('.modal-content').animate({
                    scrollTop: 0
                }, 'slow');
                $('#customisable-item-modal').on('shown.bs.modal', function() {
                    setTimeout(function() {
                            $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
                    }, 1000);
                });

                var gtm_items = [{
                    'item_id': menu['id'],
                    'item_name': menu['itemName'],
                    'quantity': 1,
                    'price' : parseFloat(sp_varinat),
                    'item_category' : menu['sectionName'],
                    'location_id' : postalCode
                }];
                
                if(typeof gtm_tag == 'function'){
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        'event': "view_item",
                        'ecommerce': {
                            'currency': "INR",
                            'value': parseFloat(sp_varinat),
                            'items': gtm_items
                        }
                    });
                }

                if(typeof webengage_tag == "function"){
                    
                    if (menu['image'] != null && menu['image'] != '') {
                        var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'];
                    } else {
                        var image= bLogo;
                    }
                    webengage.track("Product Viewed", {
                      "Product Name" : menu['itemName'] ,
                      "Product ID"   : String(menu['id']) ,
                      "Category Name"   : menu['sectionName'] ,
                      "Category ID"    : menu['sectionId'],
                      "Price" : parseFloat(sp_varinat),
                      "Description" :  menu['description'] ,
                      "Image URL": image,
                      "Type" :  menu['vegNonvegBoth']
                    });
                }
                

            } else {
                item['itemId'] = menu['id'];
                item['parentItemId'] = 0;
                item['qty'] = 1;
                item['subItems'] = [];
                item['pId'] = menu['parentId'];
                item['sp'] = menu['sp'];
                item['itemPrice'] = menu['sp'];
                item['parentName'] = '';
                item['itemName'] = menu['itemName'];
                item['description']=menu['description'];
                item['customization'] = 0;
                item['sectionName'] = menu['sectionName'];
                item['sectionId'] = menu['sectionId'];
                item['image'] = menu['image'];
                item['vegNonvegBoth'] = menu['vegNonvegBoth'];
                // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
                // $('#itemSelectError-' + item['itemId']).hide();
                if (menu['templateId'] != null && menu['templateId'] != 0 && menu['templateId'] != "null") {
                    const share = e => {
                        if (navigator.share) {
                            navigator
                            .share({
                                title: menu['itemName'],
                                text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                                url: result['sharing_url']
                            })
                            // .then(() => console.log("thanks for share"))
                            .catch(error => console.log("error", 'Browser does not support share'));
                        }
                    };
                
                    document.getElementById("sharingItem").addEventListener("click", share);
                    $('.spinner').show();
                    itemTemplates = menu['templates'];
                    var available_templates = result['rows']['templates'];

                    if (available_templates.length > 0) {
                        const availableTemplateIds = available_templates.map(template => String(template.templateId));
                        const commonTemplates = itemTemplates.filter(template => availableTemplateIds.includes(String(template.templateId)));
                        itemTemplates = commonTemplates;
                    }

                
                    var variantType = '';
                    var varinat_price = '<p class="price-p">';
                    if (Math.round(menu['mrp']) != Math.round(menu['sp']) && Math.round(menu['mrp']) != 0) {
                        varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['mrp']) + '</s></small>' + currency + ' ' + Math.round(menu['sp']) + '';
                    } else {
                        varinat_price += '' + currency + ' ' + Math.round(menu['sp']) + '';
                    }
                        varinat_price+='</p>';
                        if(aiFlag == 1){
                            varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
                        }
                    $('#variantPrice').html(varinat_price);
                    //var variantType='<div class="inner-options common-options"><div class="inner-option-start"><p>Customisation</p></div></div>';
                    var temps = menu['templates'];
                    for (var k = 0; k < temps.length; k++) {
                        var temp = templates.filter(e => e.templateId == temps[k]['templateId']);
                        if (temp.length > 0) {

                            if (temp[0]['template'].length > 0) {
                                var minQty = temps[k]['minQty'];
                                var maxQty = temps[k]['maxQty'];
                                variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                                var quantity_desc = '';
                                if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                                    quantity_desc += 'Please select any ' + maxQty + '  option';
                                } else if (minQty == 0 && maxQty != 0) {
                                    quantity_desc += 'You can choose up to ' + maxQty + ' option(s)';
                                } else if (minQty != 0 && maxQty != 0) {
                                    quantity_desc += 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                                } else if (minQty != 0 && maxQty == 0) {
                                    quantity_desc += 'Select a minimum of ' + minQty;
                                }
                                if (quantity_desc != null && quantity_desc != '') {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                                } else {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                                }
                                variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none;background-color: #fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                                // variantType+="<div class='col-12 m-0' style='background:#ececec;font-size:1.2em;    border-left: 5px solid #000;'><span>"+temp[0]['template'][0]['itemName']+"</span></div>";
                                //  variantType+="<div class='col-12 m-0 p-2' style='color:#000;font-size:1.2em;    border-bottom: 1.5px solid #fff;background:#ececec'><span>"+temp[0]['template'][0]['sectionName']+"</span></div>";
                                if(item_variant_template==2){
                                    
                                    variantType += `<div class="modal-new-variants">`; // Start the modal-new-variants wrapper
                                    var imageUrl;
                                    for (var t = 0; t < temp[0]['template'].length; t++) {
                                        if(temp[0]['template'][t]['image']== null){
                                            imageUrl=bLogo;
                                        }else{
                                            imageUrl = "https://cdn.uengage.io/uploads/" + parentId + "/" + temp[0]['template'][t]['image'];

                                        }
                                    
                                        if (minQty == 1 && maxQty == 1) {
                                            if (t == 0) {
                                                variantType += `
                                                    <div class="radio-button-one active" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input  data-price="${Math.round(temp[0]['template'][t]['sp'])}" checked="checked" class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                                addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);
                                            } else {
                                                variantType += `
                                                    <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input data-price="${Math.round(temp[0]['template'][t]['sp'])}" class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                            }
                                        } else {
                                            if (temp[0]['template'][t]['items'].length == 0) {
                                                variantType += `
                                                    <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                                        <input data-price="${Math.round(temp[0]['template'][t]['sp'])}" class="styled-checkbox" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                            id="${temp[0]['template'][t]['id']}" name="${temp[0]['template'][t]['id']}" value="${temp[0]['template'][t]['id']}" type="checkbox">
                                                        <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                            <span class="radio-text">
                                                                <span class="radio-image">
                                                                    <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                                </span>
                                                                <span class="radio-title">
                                                                   
                                                                    <div>${temp[0]['template'][t]['itemName']}</div>
                                                                </span>
                                                                <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                            </span>
                                                        </label>
                                                    </div>`;
                                            } else {
                                                variantType += `
                                                    <div class="col-12 p-1">
                                                        <span style="color: #000; border-bottom: 1.5px solid #000; padding-bottom: 4px;">${temp[0]['template'][t]['itemName']}</span>
                                                    </div>`;
                                                for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                    var tempDetail = temp[0]['template'][t]['items'][k];
                                                    variantType += `
                                                        <div class="checkbox-button-one" id="topping-${tempDetail['sectionId']}-${tempDetail['id']}">
                                                            <input data-price="${Math.round(tempDetail['sp'])}" class="styled-checkbox" onclick="addTopping(${variantId}, ${tempDetail['id']}, ${tempDetail['sectionId']})" 
                                                                id="${tempDetail['id']}" name="${tempDetail['id']}" value="${tempDetail['id']}" type="checkbox">
                                                            <label class="btn btn-default" for="${tempDetail['id']}">
                                                                <span class="radio-text">
                                                                    <span class="radio-image">
                                                                        <img src="${tempDetail['imageUrl']}" alt="${tempDetail['itemName']}" width="40" height="40">
                                                                    </span>
                                                                    <span class="radio-title">
                                                                      
                                                                        <div>${tempDetail['itemName']}</div>
                                                                    </span>
                                                                    <span class="radio-price">${currency} ${Math.round(tempDetail['sp'])}</span>
                                                                </span>
                                                            </label>
                                                        </div>`;
                                                }
                                            }
                                        }
                                    }
                                    
                                    variantType += `</div></div></div>`; // Close the modal-new-variants wrapper
                                    
                                    
                                    
                                      
                                    
                                }else{
                                for (var t = 0; t < temp[0]['template'].length; t++) {

                                    if (minQty == 1 && maxQty == 1) {
                                        if (t == 0) {
                                            variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input data-price="' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio" checked="checked" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }

                                            variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                            addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                        } else {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input data-price="' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                        }
                                    } else {
                                        if (temp[0]['template'][t]['items'].length == 0) {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="checkbox-outer">';
                                            variantType += '<input data-price="' + Math.round(temp[0]['template'][t]['sp']) + '" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            // variantType+='<div class="veg-flag"> <span></span></div>';
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';



                                        } else {
                                            variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                            for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                var tempDetail = temp[0]['template'][t]['items'][k];
                                                variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+ tempDetail['id'] +'">';
                                                variantType += '<li><div class="checkbox-outer">';
                                                variantType += '<input data-price=" ' + Math.round(tempDetail['sp']) + '" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                                variantType += '<label for="' + tempDetail['id'] + '">';
                                                variantType += '<div class="item-discription-main">';
                                                variantType += '<span class="item-name"><div>';
                                                if (tempDetail['vegNonvegBoth'] == 'veg') {
                                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                                } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                                }
                                                // variantType+='<div class="veg-flag"> <span></span></div>';
                                                variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                                variantType += '</div></label> </div></li></ul>';
                                            }

                                        }

                                    }


                                }
                                variantType += '</div></div>';
                            }
                        }
                            $('#variantCustom').removeClass('d-none');
                        }else{
                            $('#variantCustom').addClass('d-none');
                        }
                    }
                    //  variantType+='</div>';
                    $('#variantBody').html('');
                    $('#variantBody').html(variantType);
                    $('#customisable-item-modal').modal('show');
                    $('.modal-content').animate({
                        scrollTop: 0
                    }, 'slow');
                    $('#customisable-item-modal').on('shown.bs.modal', function() {
                        setTimeout(function() {
                                $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
                        }, 1000);
                    });
                    
                    var gtm_items = [{
                        'item_id': menu['id'],
                        'item_name': menu['itemName'],
                        'quantity': 1,
                        'price' : parseFloat(menu['sp']),
                        'item_category' : menu['sectionName'],
                        'location_id' : postalCode
                    }];
                    
                    if(typeof gtm_tag == 'function'){
                        dataLayer.push({ ecommerce: null });
                        dataLayer.push({
                            'event': "view_item",
                            'ecommerce': {
                                'currency': "INR",
                                'value': parseFloat(menu['sp']),
                                'items': gtm_items
                            }
                        });
                    }

                    if(typeof webengage_tag == "function"){

                        if (menu['image'] != null && menu['image'] != '') {
                            var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'] ;
                        } else {
                            var image = bLogo ;
                        }
                        webengage.track("Product Viewed", {
                          "Product Name" : menu['itemName'] ,
                          "Product ID"   : String(menu['id']) ,
                          "Category Name"   : menu['sectionName'] ,
                          "Category ID"    : menu['sectionId'],
                          "Price" : parseFloat(menu['sp']),
                          "Description" :  menu['description'] ,
                          "Image URL": image,
                          "Type" :  menu['vegNonvegBoth']
                        });
                    }

                } else {
                    add_to_cart('add', '', 0);
                    $('#feabar' + item['itemId']).show();
                    setTimeout(function() {
                        $('#feabar' + item['itemId']).fadeOut('fast');
                    }, 1000);
                    $('#bar' + item['itemId']).show();
                    setTimeout(function() {
                        $('#bar' + item['itemId']).fadeOut('fast');
                    }, 1000);
                    $('#upbar' + item['itemId']).show();
                    $('.cart-new-btn').addClass('not-active-all');
                    setTimeout(function() {
                        $('#upbar' + item['itemId']).fadeOut('fast');
                        $('.cart-new-btn').removeClass('not-active-all');
                    }, 1000);
                }


            }

            if (outlet_open != 1) {
                $('.add-btn').addClass('d-none');
                $('.available-next').removeClass('d-none');
            } else {
                $('.add-btn').removeClass('d-none');
                $('.available-next').addClass('d-none');
            }
            setTimeout(() => {
                $(".spinner").fadeOut('slow');
            }, 1);
        }
    });
}

function getItemDetailssss(variantId, sectionId) {
    //$('.spinner').show();
    $('#viewItemImage').modal('hide');
    $('#single-item-modal').modal('hide');
    if (typeof gtag === "function") {

        gtag('event', 'product_selected', {
            'event_category': 'Product Selected',
            'event_label': 'Product selected by user',  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    itemTemplates = "";
    item = {};
    var url = origin + "/petPooja/getItemDetails?sectionId=" + sectionId + "&itemId=" + variantId + "&businessId=" + businessId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {

            if (result['rows']['menu'].length == 0) {
                alert("Item is Currently Not Available");
                $('.spinner').hide();
                return false;
            }

            menu = result['rows']['menu'][0];
            if (menu['image'] != null && menu['image'] != '') {
                    var imgTag = '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + menu['image'] + '" alt="' + menu['itemName'] + '" class="zoom" width="345" height="250"></img>';
                
                
            } else {
                var imgTag='<img src="' + bLogo + '" alt="Logo" class="zoom" style="filter: grayscale(0.9);" width="345" height="250"></img>';
            }

            $('#imgprofile_variant').html('');
            $('#imgprofile_variant').html(imgTag);
            $('#imgprofile_variant').show();

            var flagName = '';
            flagName += '<div class="d-flex align-items-center mb-2">';
            if (menu['vegNonvegBoth'] == 'veg') {
                flagName = '<div class="veg-flag"> <span></span> </div></div>';
            } else if (menu['vegNonvegBoth'] == 'non-veg') {
                flagName += '<div class="non-vegflag"> <span></span> </div></div>';
            }

            if(menu?.recommended && menu['recommended'] == 1){
                flagName += '<span class="tag-bestseller"><span>Bestseller</span></span>';
            }

            if(menu?.newItem && menu['newItem'] != 0 ){
                flagName += '<span class="tag-new"><span>New</span></span>';
            }

            if(menu?.custom_tags && menu['custom_tags'] != null)
                {
                    var tagsArray = menu['custom_tags'].split(',');
                    tagsArray.forEach(element => {
                        if (pId == 7175) {
                            flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                        } else {
                            flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                        }
                        
                    });
                    
                }

            flagName += '</div>';
            $('#flagdata').html('');
            $('#flagdata').html(flagName);
            $('#variantName').html('');
            $('#variantName').html(menu['itemName']);
            if(menu['description'] != null && menu['description'] != "null" && menu['description'] != ""){
                $('#variantDesc').html(menu['description']);
            }
            templates = result['rows']['templates'];
            var num = parseFloat(menu["avgRating"]);
            if (num != undefined && num > 3) {
                var rat = Math.ceil(num);
                var itemList = '<div class="d-flex" style="margin-bottom: 5px;">';
                for (var a = 0; a < rat; a++) {
                    itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
                }
                itemList += '</div>';
                $('#variantRating').html(itemList);
                $('#variantRating').removeClass('d-none');
            }else{
                $('#variantRating').addClass('d-none');
            }
            if (menu['variant_count'] > 0) {
                const share = e => {
                    if (navigator.share) {
                        navigator
                        .share({
                            title: menu['itemName'],
                            text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                            url: result['sharing_url']
                        })
                        // .then(() => console.log("thanks for share"))
                        .catch(error => console.log("error", 'Browser does not support share'));
                    }
                };
            
                document.getElementById("sharingItem").addEventListener("click", share);

                var sp_arr = menu['variants'].map(function(el) {
                    return el.sp
                });

                var sp_varinat= Math.round(Math.min(...sp_arr));

                var mrp_arr = menu['variants'].map(function(el) {
                    return el.mrp
                });
                
                var mrp_varinat= Math.round(Math.min(...mrp_arr));

                var varinat_price = '<p class="price-p">';
                if (Math.round(mrp_varinat) != Math.round(sp_varinat) && Math.round(mrp_varinat) != 0) {
                    varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(mrp_varinat) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
                } else {
                    varinat_price += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
                }
                varinat_price +='</p>';
                if(aiFlag == 1){
                    varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
                }
                $('#variantPrice').html(varinat_price);
                $('.spinner').show();
                menu['variants'] = menu['variants'].sort((a, b) => a.sp - b.sp);
                item['itemId'] = menu['variants'][0]['id'];
                item['parentItemId'] = 0;
                item['pId'] = menu['variants'][0]['parentId'];
                item['qty'] = 1;
                item['subItems'] = [];
                item['sp'] = menu['variants'][0]['sp'];
                item['itemPrice'] = menu['variants'][0]['sp'];
                item['parentName'] = menu['itemName'];
                item['itemName'] = menu['variants'][0]['itemName'];
                item['description'] = menu['description'];
                item['customization'] = 0;
                item['sectionName'] = menu['sectionName'];
                item['sectionId'] = menu['sectionId'];
                item['image'] = menu['image'];
                item['vegNonvegBoth'] = menu['vegNonvegBoth'];
                // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
                // $('#itemSelectError-' + item['itemId']).hide();
                var variantType = '<div class="inner-options common-options"><div class="inner-option-start"><p>Variants</p> <div class="pizza-radios">';
                for (var i = 0; i < menu['variants'].length; i++) {
                    if (i == 0) {

                        variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + ")'>";
                        variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" name="newAddType" value="' + menu['variants'][i]['id'] + '" checked="">';
                        variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                        variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                        variantType += '<span> <span class = "d-block pb-3" >' + menu['variants'][i]['itemName'] + '</span>';
                        if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        } else {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        }
                        variantType += '</span>';

                        if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                            variantType += '<span class = "pizza-img text-right"><img src = "' + menu['variants'][i]['variant_icon'] + '"></span>';
                        }

                        variantType += '<span> </label> </div>';

                    } else {
                        variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + ")'>";
                        variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" name="newAddType" value="' + menu['variants'][i]['id'] + '" >';
                        variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                        variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                        variantType += '<span> <span class = "d-block pb-3" >' + menu['variants'][i]['itemName'] + '</span>';
                        if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        } else {
                            variantType += '<span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span>';
                        }
                        variantType += '</span>';

                        if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                            variantType += '<span class = "pizza-img text-right"><img src = "' + menu['variants'][i]['variant_icon'] + '"></span>';
                        }

                        variantType += '<span> </label> </div>';

                    }

                }
                variantType += '</div></div></div>';
                if (menu['variants'][0]['templateId'] != 0) {

                    var temps = menu['variants'][0]['templates'];



                    itemTemplates = menu['variants'][0]['templates'];
                    variantType += '<div id="topping">';
                    for (var k = 0; k < temps.length; k++) {

                        var temp = templates.filter(e => e.templateId == temps[k]['templateId']);

                        if (temp.length > 0) {

                            if (temp[0]['template'].length > 0) {
                                var minQty = temps[k]['minQty'];
                                var maxQty = temps[k]['maxQty'];
                                variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                                var quantity_desc;
                                if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                                    quantity_desc = 'Please select any ' + maxQty + '  option';
                                } else if (minQty == 0 && maxQty != 0) {
                                    quantity_desc = 'You can choose up to ' + maxQty + ' option(s)';
                                } else if (minQty != 0 && maxQty != 0) {
                                    quantity_desc = 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                                } else if (minQty != 0 && maxQty == 0) {
                                    quantity_desc = 'Select a minimum of ' + minQty;
                                }

                                if (quantity_desc != null && quantity_desc != '') {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                                } else {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                                }
                                variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none; background-color:#fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                                for (var t = 0; t < temp[0]['template'].length; t++) {

                                    if (minQty == 1 && maxQty == 1) {
                                        if (t == 0) {
                                            variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input data-price="' + Math.round(temp[0]['template'][t]['sp']) + '" checked="checked" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }

                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                            addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                        } else {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                        }
                                    } else {
                                        if (temp[0]['template'][t]['items'].length == 0) {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                            variantType += '<li><div class="checkbox-outer">';
                                            variantType += '<input data-price="'+ Math.round(temp[0]['template'][t]['sp']) +'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            // variantType+='<div class="veg-flag"> <span></span></div>';
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';



                                        } else {
                                            variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                            for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                var tempDetail = temp[0]['template'][t]['items'][k];
                                                variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+tempDetail['id']+'">';
                                                variantType += '<li><div class="checkbox-outer">';
                                                variantType += '<input data-price="'+ Math.round(tempDetail['sp']) +'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                                variantType += '<label for="' + tempDetail['id'] + '">';
                                                variantType += '<div class="item-discription-main">';
                                                variantType += '<span class="item-name"><div>';
                                                if (tempDetail['vegNonvegBoth'] == 'veg') {
                                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                                } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                                }
                                                // variantType+='<div class="veg-flag"> <span></span></div>';
                                                variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                                variantType += '</div></label> </div></li></ul>';
                                            }

                                        }

                                    }
                                }
                                variantType += '</div></div>';
                            }
                            $('#variantCustom').removeClass('d-none');
                        }else{
                            $('#variantCustom').addClass('d-none');
                        }


                    }
                    variantType += '</div>';
                }

                // variantType+='</div>';
                $('#variantBody').html('');
                $('#variantBody').html(variantType);
                $('#customisable-item-modal').modal('show');
                $('.modal-content').animate({
                    scrollTop: 0
                }, 'slow');
                $('#customisable-item-modal').on('shown.bs.modal', function() {
                    setTimeout(function() {
                            $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
                    }, 1000);
                });

                var gtm_items = [{
                    'item_id': menu['id'],
                    'item_name': menu['itemName'],
                    'quantity': 1,
                    'price' : parseFloat(sp_varinat),
                    'item_category' : menu['sectionName'],
                    'location_id' : postalCode
                }];
                
                if(typeof gtm_tag == 'function'){
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        'event': "view_item",
                        'ecommerce': {
                            'currency': "INR",
                            'value': parseFloat(sp_varinat),
                            'items': gtm_items
                        }
                    });
                }

                if(typeof webengage_tag == "function"){
                    
                    if (menu['image'] != null && menu['image'] != '') {
                        var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'];
                    } else {
                        var image= bLogo;
                    }
                    webengage.track("Product Viewed", {
                      "Product Name" : menu['itemName'] ,
                      "Product ID"   : String(menu['id']) ,
                      "Category Name"   : menu['sectionName'] ,
                      "Category ID"    : menu['sectionId'],
                      "Price" : parseFloat(sp_varinat),
                      "Description" :  menu['description'] ,
                      "Image URL": image,
                      "Type" :  menu['vegNonvegBoth']
                    });
                }
                

            } else {
                item['itemId'] = menu['id'];
                item['parentItemId'] = 0;
                item['qty'] = 1;
                item['subItems'] = [];
                item['pId'] = menu['parentId'];
                item['sp'] = menu['sp'];
                item['itemPrice'] = menu['sp'];
                item['parentName'] = '';
                item['itemName'] = menu['itemName'];
                item['description']=menu['description'];
                item['customization'] = 0;
                item['sectionName'] = menu['sectionName'];
                item['sectionId'] = menu['sectionId'];
                item['image'] = menu['image'];
                item['vegNonvegBoth'] = menu['vegNonvegBoth'];
                // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
                // $('#itemSelectError-' + item['itemId']).hide();
                if (menu['templateId'] != null && menu['templateId'] != 0 && menu['templateId'] != "null") {
                    const share = e => {
                        if (navigator.share) {
                            navigator
                            .share({
                                title: menu['itemName'],
                                text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                                url: result['sharing_url']
                            })
                            // .then(() => console.log("thanks for share"))
                            .catch(error => console.log("error", 'Browser does not support share'));
                        }
                    };
                
                    document.getElementById("sharingItem").addEventListener("click", share);
                    $('.spinner').show();
                    itemTemplates = menu['templates'];
                    var available_templates = result['rows']['templates'];

                    if (available_templates.length > 0) {
                        const availableTemplateIds = available_templates.map(template => String(template.templateId));
                        const commonTemplates = itemTemplates.filter(template => availableTemplateIds.includes(String(template.templateId)));
                        itemTemplates = commonTemplates;
                    }

                
                    var variantType = '';
                    var varinat_price = '<p class="price-p">';
                    if (Math.round(menu['mrp']) != Math.round(menu['sp']) && Math.round(menu['mrp']) != 0) {
                        varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['mrp']) + '</s></small>' + currency + ' ' + Math.round(menu['sp']) + '';
                    } else {
                        varinat_price += '' + currency + ' ' + Math.round(menu['sp']) + '';
                    }
                        varinat_price+='</p>';
                        if(aiFlag == 1){
                            varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
                        }
                    $('#variantPrice').html(varinat_price);
                    //var variantType='<div class="inner-options common-options"><div class="inner-option-start"><p>Customisation</p></div></div>';
                    var temps = menu['templates'];
                    for (var k = 0; k < temps.length; k++) {
                        var temp = templates.filter(e => e.templateId == temps[k]['templateId']);
                        if (temp.length > 0) {

                            if (temp[0]['template'].length > 0) {
                                var minQty = temps[k]['minQty'];
                                var maxQty = temps[k]['maxQty'];
                                variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                                var quantity_desc = '';
                                if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                                    quantity_desc += 'Please select any ' + maxQty + '  option';
                                } else if (minQty == 0 && maxQty != 0) {
                                    quantity_desc += 'You can choose up to ' + maxQty + ' option(s)';
                                } else if (minQty != 0 && maxQty != 0) {
                                    quantity_desc += 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                                } else if (minQty != 0 && maxQty == 0) {
                                    quantity_desc += 'Select a minimum of ' + minQty;
                                }
                                if (quantity_desc != null && quantity_desc != '') {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                                } else {
                                    variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                                }
                                variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none;background-color: #fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                                // variantType+="<div class='col-12 m-0' style='background:#ececec;font-size:1.2em;    border-left: 5px solid #000;'><span>"+temp[0]['template'][0]['itemName']+"</span></div>";
                                //  variantType+="<div class='col-12 m-0 p-2' style='color:#000;font-size:1.2em;    border-bottom: 1.5px solid #fff;background:#ececec'><span>"+temp[0]['template'][0]['sectionName']+"</span></div>";
                                for (var t = 0; t < temp[0]['template'].length; t++) {

                                    if (minQty == 1 && maxQty == 1) {
                                        if (t == 0) {
                                            variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input class="topping-radio" checked="checked" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }

                                            variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                            addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                        } else {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="radio-outer">';
                                            variantType += '<input  class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';
                                        }
                                    } else {
                                        if (temp[0]['template'][t]['items'].length == 0) {

                                            variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                            variantType += '<li><div class="checkbox-outer">';
                                            variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                            variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                            variantType += '<div class="item-discription-main">';
                                            variantType += '<span class="item-name"><div>';
                                            if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                                variantType += '<div class="veg-flag"> <span></span> </div>';
                                            } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                                variantType += '<div class="non-vegflag"> <span></span> </div>';
                                            }
                                            // variantType+='<div class="veg-flag"> <span></span></div>';
                                            variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                            variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                            variantType += '</div></label> </div></li></ul>';



                                        } else {
                                            variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                            for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                                var tempDetail = temp[0]['template'][t]['items'][k];
                                                variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+ tempDetail['id'] +'">';
                                                variantType += '<li><div class="checkbox-outer">';
                                                variantType += '<input data-price="' + Math.round(tempDetail['sp']) + '" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                                variantType += '<label for="' + tempDetail['id'] + '">';
                                                variantType += '<div class="item-discription-main">';
                                                variantType += '<span class="item-name"><div>';
                                                if (tempDetail['vegNonvegBoth'] == 'veg') {
                                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                                } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                                }
                                                // variantType+='<div class="veg-flag"> <span></span></div>';
                                                variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                                variantType += '</div></label> </div></li></ul>';
                                            }

                                        }

                                    }


                                }
                                variantType += '</div></div>';
                            }
                            $('#variantCustom').removeClass('d-none');
                        }else{
                            $('#variantCustom').addClass('d-none');
                        }
                    }
                    //  variantType+='</div>';
                    $('#variantBody').html('');
                    $('#variantBody').html(variantType);
                    $('#customisable-item-modal').modal('show');
                    $('.modal-content').animate({
                        scrollTop: 0
                    }, 'slow');
                    $('#customisable-item-modal').on('shown.bs.modal', function() {
                        setTimeout(function() {
                                $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
                        }, 1000);
                    });
                    
                    var gtm_items = [{
                        'item_id': menu['id'],
                        'item_name': menu['itemName'],
                        'quantity': 1,
                        'price' : parseFloat(menu['sp']),
                        'item_category' : menu['sectionName'],
                        'location_id' : postalCode
                    }];
                    
                    if(typeof gtm_tag == 'function'){
                        dataLayer.push({ ecommerce: null });
                        dataLayer.push({
                            'event': "view_item",
                            'ecommerce': {
                                'currency': "INR",
                                'value': parseFloat(menu['sp']),
                                'items': gtm_items
                            }
                        });
                    }

                    if(typeof webengage_tag == "function"){

                        if (menu['image'] != null && menu['image'] != '') {
                            var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'] ;
                        } else {
                            var image = bLogo ;
                        }
                        webengage.track("Product Viewed", {
                          "Product Name" : menu['itemName'] ,
                          "Product ID"   : String(menu['id']) ,
                          "Category Name"   : menu['sectionName'] ,
                          "Category ID"    : menu['sectionId'],
                          "Price" : parseFloat(menu['sp']),
                          "Description" :  menu['description'] ,
                          "Image URL": image,
                          "Type" :  menu['vegNonvegBoth']
                        });
                    }

                } else {
                    add_to_cart('add', '', 0);
                    $('#feabar' + item['itemId']).show();
                    setTimeout(function() {
                        $('#feabar' + item['itemId']).fadeOut('fast');
                    }, 1000);
                    $('#bar' + item['itemId']).show();
                    setTimeout(function() {
                        $('#bar' + item['itemId']).fadeOut('fast');
                    }, 1000);
                    $('#upbar' + item['itemId']).show();
                    $('.cart-new-btn').addClass('not-active-all');
                    setTimeout(function() {
                        $('#upbar' + item['itemId']).fadeOut('fast');
                        $('.cart-new-btn').removeClass('not-active-all');
                    }, 1000);
                }


            }

            if (outlet_open != 1) {
                $('.add-btn').addClass('d-none');
                $('.available-next').removeClass('d-none');
            } else {
                $('.add-btn').removeClass('d-none');
                $('.available-next').addClass('d-none');
            }
            setTimeout(() => {
                $(".spinner").fadeOut('slow');
            }, 1);
        }
    });
}

function changeWizardItem(itemId, step, itemName, sp, sectionId, item_type,minQty = '',maxQty = '') {
    $('#bogo-'+ step).removeClass('not-selected-items');
    var obj = {};
    obj['itemId'] = itemId;
    obj['parentItemId'] = 0;
    obj['itemName'] = itemName;
    obj['qty'] = 1;
    if (item['viewType'] == 2) {
        obj['sp'] = parseInt(sp);
    } else {
        obj['sp'] = 0;
    }

    obj['itemPrice'] = parseInt(sp);
    obj['sectionId'] = sectionId;
    obj['sectionName'] = '';
    obj['step'] = step;
    const filtered = main_temp.filter(e => e.templateId == sectionId);
    if (filtered.length > 0) {
        const firstTemplate = filtered[0].template;
        if (firstTemplate.length > 0) {
            obj['sectionName'] = firstTemplate[0].sectionName;
        }
    }

    // Clear previously checked items if any
    if (item['subItems'].length > 0 && item['subItems'][step] && item['subItems'][step]['subItems'] && item['subItems'][step]['subItems'].length > 0) {
        item['subItems'][step]['subItems'].forEach(element => {
            $("input[name='" + element['itemId'] + "']:checkbox").prop('checked', false);
            $("#topp-" + step + "-" + element['itemId']).prop('checked', false);
        });
    }

    $("#toast" + step).addClass("d-none");
    $("#bogo-" + (step + 1)).removeClass("disabled");
    $('ul[id^="topBogo-'+ step +'"]').removeClass('active');
    $('#topBogo-'+ step +itemId).addClass('active');
    
    // Update sp and itemPrice if necessary
    if (sp > item['sp']) {
        item['sp'] = parseInt(sp);
        item['itemPrice'] = parseInt(sp);
    }

    // Handle checkbox and radio logic
    if (item_type === "checkbox") {
        var checkbox = document.getElementById('wiz_' + step + '_' + itemId);
        if (checkbox.checked) {
            // Check if the item already exists in subItems array

            if(maxQty != ''){
                var selectedCount = item['subItems'].reduce(function(count, subItem) {
                    if (subItem.sectionId === sectionId) {
                        return count + subItem.qty;
                    }
                    return count;
                }, 0);
                // Check if selecting this item would exceed maxQty for this sectionId
                if (selectedCount >= maxQty && item_type === "checkbox") {
                    alert('You cannot select more than ' + maxQty + ' items for this section.');
                    document.getElementById('wiz_' + step + '_' + itemId).checked = false;
                    return; // Exit function without selecting the item
                }
            }
            
            
            var exists = item['subItems'].some(function(subItem) {
                return subItem.itemId === itemId;
            });
            if (!exists) {
                item['subItems'].push(obj); // Add item if not already in array
            }
        } else {
            // Remove the unchecked item from subItems array
            item['subItems'] = item['subItems'].filter(function(subItem) {
                return subItem.itemId !== itemId;
            });
        }

        var sidebarItems = [];
        if (item['subItems'].length > 0 && item['subItems'][step]) {
            sidebarItems = item['subItems'].filter(function(subItem) {
                return subItem.sectionId == sectionId;
            }).map(function(subItem) {
                return subItem.itemName; // Assuming itemName is a string here
            });
        }

        // Display sidebar content
        if (sidebarItems.length > 0) {
            $("#sidebar-dynamic" + step).html(sidebarItems.join(', '));
        } else {
            $("#sidebar-dynamic" + step).html("Select your "+ (step + 1) +"st item "); // Fallback to itemName if sidebarItems is empty
        }

    } else { // assuming item_type is "radio"
        var indexToReplace = item['subItems'].findIndex(function(subItem) {
            return subItem.step === step;
        });
        if (indexToReplace !== -1) {
            item['subItems'][indexToReplace] = obj;
        } else {
            item['subItems'].push(obj); // If not found, push the new item
        }
        $("#sidebar-dynamic" + step).html(itemName);
    }


    // Additional logic for viewType == 3
    if (item['viewType'] == 3 && item['subItems'][1]) {
        if (item['subItems'][0]['sp'] > item['subItems'][1]['sp']) {
            item['subItems'][1]['sp'] = 0;
            item['subItems'][0]['itemPrice'] = 0;
        } else if (item['subItems'][0]['sp'] == item['subItems'][1]['sp']) {
            item['subItems'][1]['sp'] = 0;
            item['subItems'][0]['itemPrice'] = 0;
        } else {
            item['subItems'][0]['sp'] = 0;
            item['subItems'][0]['itemPrice'] = 0;
        }
    }
}


function changeWizardItemCombo(itemId, step, itemName, sp, sectionId, item_type,minQty = '',maxQty = '',overrider=0) {
    var obj = {};
    obj['itemId'] = itemId;
    obj['parentItemId'] = 0;
    obj['itemName'] = itemName;
    obj['qty'] = 1;
    if (item['viewType'] == 2) {
        obj['sp'] = parseInt(sp);
    } else {
        obj['sp'] = 0;
    }

    obj['itemPrice'] = parseInt(sp);
    obj['sectionId'] = sectionId;
    obj['sectionName'] = '';
    obj['step'] = step;
    const filtered = main_temp.filter(e => e.templateId == sectionId);
    if (filtered.length > 0) {
        const firstTemplate = filtered[0].template;
        if (firstTemplate.length > 0) {
            obj['sectionName'] = firstTemplate[0].sectionName;
        }
    }
    if (item['subItems'].length > 0 && item['subItems'][step] && item['subItems'][step]['subItems'] && item['subItems'][step]['subItems'].length > 0) {
        item['subItems'][step]['subItems'].forEach(element => {
            $("input[name='" + element['itemId'] + "']:checkbox").prop('checked', false);
            $("#topp-" + step + "-" + element['itemId']).prop('checked', false);
        });
    }

    
    $("#toast-combo" + step).addClass("d-none");
    $("#combo-" + (step + 1)).removeClass("disabled");
    $('ul[id^="topCombo-'+ step +'"]').removeClass('active');
    $('#topCombo-'+ step +itemId).addClass('active');
    if (sp > item['sp']) {
        item['sp'] = parseInt(sp);
        item['itemPrice'] = parseInt(sp);
    }
    // item['subItems'][step] = obj;
    // Handle checkbox and radio logic
    if (item_type === "checkbox") {
        var id = 'wiz_combo_' + step + '_' + itemId;
        // console.log(id);
        var checkbox = document.getElementById('wiz_combo_' + step + '_' + itemId);
        
        if (overrider==0) {
            if(checkbox.checked){
                if(maxQty != ''){
                    var selectedCount = item['subItems'].reduce(function(count, subItem) {
                        if (subItem.sectionId === sectionId) {
                            return count + subItem.qty;
                        }
                        return count;
                    }, 0);
                    // Check if selecting this item would exceed maxQty for this sectionId
                    if (selectedCount >= maxQty && item_type === "checkbox") {
                        alert('You cannot select more than ' + maxQty + ' items for this section.');
                        document.getElementById('wiz_combo_' + step + '_' + itemId).checked = false;
                        return; // Exit function without selecting the item
                    }
                }
                
                
                var exists = item['subItems'].some(function(subItem) {
                    return subItem.itemId === itemId;
                });
                if (!exists) {
                    item['subItems'].push(obj); // Add item if not already in array
                }
            }else {
                // Remove the unchecked item from subItems array
                item['subItems'] = item['subItems'].filter(function(subItem) {
                    return subItem.itemId !== itemId;
                });
            }
            // Check if the item already exists in subItems array

           
        }else if(overrider=1){
            var exists = item['subItems'].some(function(subItem) {
                return subItem.itemId === itemId;
            });
            if (!exists) {
                item['subItems'].push(obj); // Add item if not already in array
            }   
        }

        var sidebarItems = [];
        if (item['subItems'].length > 0 && item['subItems'][step]) {
            sidebarItems = item['subItems'].filter(function(subItem) {
                return subItem.sectionId == sectionId;
            }).map(function(subItem) {
                return subItem.itemName; // Assuming itemName is a string here
            });
        }

    } else { // assuming item_type is "radio"
        var indexToReplace = item['subItems'].findIndex(function(subItem) {
            return subItem.step === step;
        });
        if (indexToReplace !== -1) {
            item['subItems'][indexToReplace] = obj;
        } else {
            item['subItems'].push(obj); // If not found, push the new item
        }
        $("#sidebar-dynamic" + step).html(itemName);
    }

    var existingItem = $('#selected_combo li').eq(step);

    if (item_type === "checkbox") {
        // Check if there are multiple items selected
        var selectedItems = $('input[type="checkbox"]:checked').map(function() {
            return $(this).next('label').find('.item-name > div').text(); // Assuming the label contains the item name
        }).get();

        if (selectedItems.length > 0) {
            // If there are multiple selected items, handle each one
            if (existingItem.length > 0) {
                // Item exists for this step, update its content by adding the selected items
                existingItem.find('.tags-div-inner span:first-child').html(selectedItems.join(', '));
            } else {
                // Item doesn't exist for this step, append new items
                selectedItems.forEach(function(item) {
                    var selectItem = '<li>';
                    selectItem += '<div class="tags-div-inner"><span>' + item + '</span> <span><a href="javascript:void(0);" onclick="goToWizardStep(' + step + ')">Change</a></span></div>';
                    selectItem += '</li>';
                    $("#selected_combo").append(selectItem);
                });
            }
        }
    }else{
            if (existingItem.length > 0) {
                // Item exists for this step, update its content
                existingItem.find('.tags-div-inner span:first-child').text(itemName);
            } else {
                // Item doesn't exist for this step, append new item
                var selectItem = '<li>';
                selectItem += '<div class="tags-div-inner"><span>'+ itemName + '</span> <span><a href="javascript:void(0);" onclick="goToWizardStep(' + step +')">Change</a></span></div>';
                selectItem += '</li>';
                $("#selected_combo").append(selectItem);
            }
        }
}
 
function goToWizardStep(stepIndex) {
    // Remove active class from all tabs and panes
    $('#comboModalTab li').removeClass('active').addClass('d-none');
    $('.tab-pane').removeClass('active');
    

    // Show the correct tab based on stepIndex
    $('#combo-' + stepIndex).addClass('active').removeClass('d-none');
    $('#wizard-combo-p-' + stepIndex).addClass('active').removeClass('d-none');
}

function add_wizard() {
    add_to_cart('add', '', 0);
    $('#w-modal').modal('hide');
    $('#bogoModal').modal('hide');
    $('#comboModal').modal('hide');
    item = {};
    checkedState = {};
    return false;

}

function addTopping(variantId, toppingId, sectionId) {
    // console.log(itemTemplates);
    // console.log(item['subItems']);
    var sp = main_temp.filter(e => e.templateId == sectionId)[0]['template'].filter(t => t.id == toppingId)[0]['sp'];
    var itemName = main_temp.filter(e => e.templateId == sectionId)[0]['template'].filter(t => t.id == toppingId)[0]['itemName'];
    var vegNonvegBoth= main_temp.filter(e => e.templateId == sectionId)[0]['template'].filter(t => t.id == toppingId)[0]['vegNonvegBoth'];
    //  console.log(sp+'--'+itemName);
    var index = item['subItems'].findIndex(e => e.itemId == toppingId);

    if (index == -1) {
        var indexS = item['subItems'].findIndex(e => e.sectionId == sectionId);
        var indexT = itemTemplates.findIndex(e => e.templateId == sectionId);
        //   if(main_temp.length>0){
        var sectionName = main_temp.filter(e => e.templateId == sectionId)[0]['template'][0]['sectionName'];
        //   }else{
        // var sectionName=itemTemplates[indexT]['parentName'];
        //   }

        if (indexT != -1) {
            var min = itemTemplates[indexT]['minQty'];
            var max = itemTemplates[indexT]['maxQty'];
        } else {
            var min = 0;
            var max = 0;
        }
        var topps = item['subItems'].filter(e => e.sectionId == sectionId);
        //  console.log(topps);

        if (topps.length > 0 && max == 1 && min == 1) {
            item['subItems'].splice(indexS, 1);
            // itemTemplates.splice(indexS,1);
            var obj = {};
            obj['itemId'] = toppingId;
            obj['parentItemId'] = 0;
            obj['qty'] = 1;
            obj['sectionId'] = sectionId.toString();
            obj['sp'] = sp.toString();
            obj['itemPrice'] = sp.toString();
            obj['itemName'] = itemName;
            obj['sectionName'] = sectionName;
            obj['vegNonvegBoth']=vegNonvegBoth;
            item['customization'] = 1;
            item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
            item['subItems'].push(obj);
            $('ul[id^="topping-'+ sectionId +'"]').removeClass('active');
            $('#topping-'+ sectionId +'-' + toppingId).addClass('active');
            // itemTemplates.push(obj);
        } else if (topps.length > 0 && max > 0) {

            if (topps.length < max) {
                var obj = {};
                obj['itemId'] = toppingId;
                obj['parentItemId'] = 0;
                obj['qty'] = 1;
                obj['sectionId'] = sectionId.toString();
                obj['sp'] = sp.toString();
                obj['itemPrice'] = sp.toString();
                obj['itemName'] = itemName;
                obj['sectionName'] = sectionName;
                obj['vegNonvegBoth']=vegNonvegBoth;
                item['customization'] = 1;
                item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
                item['subItems'].push(obj);
                $('#topping-'+ sectionId +'-'+ toppingId).addClass('active');
                // itemTemplates.push(obj);
            } else {
                alert("You can select max " + max + " items");
                $("input[name='" + toppingId + "']:checkbox").prop('checked', false);
                return false;
            }


        } else {
            var obj = {};
            obj['itemId'] = toppingId;
            obj['parentItemId'] = 0;
            obj['qty'] = 1;
            obj['sectionId'] = sectionId.toString();
            obj['sp'] = sp.toString();
            obj['itemPrice'] = sp.toString();
            obj['itemName'] = itemName;
            obj['sectionName'] = sectionName;
            obj['vegNonvegBoth']=vegNonvegBoth;
            item['customization'] = 1;
            item['description'] = item['description'] ? item['description'] + '+ ' + itemName : '+ ' + itemName;
            item['subItems'].push(obj);
            $('#topping-'+ sectionId +'-' + toppingId).addClass('active');
            //   itemTemplates.push(obj);
        }


    } else {


    var toppingElement = $('#topping-' + sectionId + '-' + toppingId);

        if (toppingElement.find('input[type="checkbox"]').length > 0) {

            item['subItems'].splice(index, 1);
            toppingElement.removeClass('active');
        }
    }

}

function add_to_cart(action, itemId, inp = 0 ,barid,customise) {
    //$('.spinner').show();
    $('#upbar' + barid).show();
    $('.cart-new-btn').addClass('not-active-all');
    $('#feabar' + barid).show();
    $('#bar' + barid).show();
    if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
        // item
        add_to_cart_wl(action, itemId,barid);
        //  return false;
    } else {
        // i['items']=[];
        if (action == 'add' && !jQuery.isEmptyObject(item)) {
            var validate = 0;
            if (itemTemplates != undefined && itemTemplates != '') {
                var mandTopp = itemTemplates.filter(e => e.minQty != 0);
                // console.log(mandTopp);
                if (mandTopp.length == 0) {
                    validate = 1;
                }
                for (var k = 0; k < mandTopp.length; k++) {
                    var count = 0;
                    let index = item['subItems'].filter(ex => ex.sectionId == mandTopp[k]['templateId']);
                    count = index.length;

                    if (count < mandTopp[k]['minQty']) {
                        $('#itemSelectError' + mandTopp[k]['templateId']).show();
                        $('#item-error'+ mandTopp[k]['templateId']).html('Kindly Select Atleast ' + mandTopp[k]['minQty'] + ' Item to Proceed');
                        var targetElement = document.getElementById('itemSelectError' + mandTopp[k]['templateId']);
                        targetElement.scrollIntoView({
                            behavior: 'smooth', // or 'auto' for immediate scrolling
                            block: 'start'      // or 'end', 'center', 'nearest'
                        });
                        setTimeout(function() {
                            $('#itemSelectError' + mandTopp[k]['templateId']).fadeOut('fast');
                        }, 3000);
                        //alert('Kindly Select Atleast ' + mandTopp[k]['minQty'] + ' Item to Proceed');
                        validate = 0;
                        $('.spinner').hide();
                        // alert("Kindly select atlest 1 Pizza");
                        return false;
                    } else {
                        validate = 1;
                        $('#itemSelectError' + mandTopp[k]['templateId']).hide();
                    }

                }
            }

        }
        var i = {};
        if (localStorage.getItem('itemList') && localStorage.getItem('itemList') != '') {
            // console.log(localStorage.getItem('itemList'));
            var arr1 = JSON.parse(localStorage.getItem('itemList'));
            // console.log(arr1);
            var index1 = arr1.findIndex(e => e.bId == businessId);
            // console.log(arr1[index1]['items']);
            if (arr1[index1]['items']) {
                i['items'] = arr1[index1]['items'];
            } else {
                i['items'] = [];
            }

        } else {
            i['items'] = [];
        }

        if (!jQuery.isEmptyObject(item) && action == 'add') {
            var t = 0;
            localStorage.setItem('slug', slug);
            localStorage.setItem('business', businessId);
            i['items'].push(item);
        if(item['parentName'] != '' && item['parentName'] != null )
        {
            $('#bar'+item['pId']).show();
            setTimeout(function() {
                $('.y9uHb').fadeOut('fast');
            }, 1000);
        }else{
            $('#bar'+item['itemId']).show();
            setTimeout(function() {
                $('.y9uHb').fadeOut('fast');
            }, 1000);
        }
        var existingItem = gtag_items.find(existing => existing.item_id == item['itemId']);
                if (existingItem) {
                    existingItem.quantity += item['qty'];
                    existingItem.price = parseFloat(existingItem.price) + parseFloat(item['sp']);
                } else {
                    var a = {};
                    a["item_id"] = item['itemId'];
                    a["item_name"] = item['itemName'];
                    a["quantity"]=item['qty'];
                    a["price"]=item['sp'];
                    a['item_category'] = item['sectionName'];
                    a['location_id']= postalCode;
                    gtag_items.push(a);
                }
                
                let sp = parseFloat(item['sp']);
                gTotal += sp;
                t++;
            
            if (typeof gtag == "function") {

                gtag('event', 'add_to_cart', {
                    'value': parseFloat(gTotal),
                    'currency': 'INR',
                    'items': gtag_items
                });
            }

            if (typeof gtm_tag == "function") {

                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    'event': "add_to_cart",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(gTotal),
                        'items': gtag_items
                    }
                });
            }

            if (typeof webengage_tag == "function") {
                var item_data = item; // Access the main item
                var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + item_data['image'];
            
                // Check if the main item has subItems and if the array length is greater than 0
                if (Array.isArray(item_data['subItems']) && item_data['subItems'].length > 0) {
                    // Initialize variables to store the concatenated values
                    var subitemNames = '';
                    var totalSubitemPrice = parseFloat(item_data['itemPrice']); // Start with the main item price
                    var subitemDescriptions = item_data['description'] || ''; // Start with the main item description
            
                    // Loop through the subItems array to append the names, prices, and descriptions
                    item_data['subItems'].forEach(function(subItem) {
                        subitemNames += ' + ' + subItem['itemName'];
                        totalSubitemPrice += parseFloat(subItem['itemPrice']);
                        if (subItem['itemDesc']) {
                            subitemDescriptions += ' ' + subItem['itemDesc'];
                        }
                    });
            
                    // Update the main item with the concatenated subitem information
                    item_data['itemName'] += subitemNames;
                    item_data['itemPrice'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                    item_data['description'] = subitemDescriptions;
                }
            
                // Track the updated data
                webengage.track("Added To Cart", {
                    "Product Name" : item_data['itemName'],
                    "Product ID" : String(item_data['itemId']),
                    "Category Name" : item_data['sectionName'],
                    "Category ID" : item_data['sectionId'],
                    "Price" : parseFloat(item_data['itemPrice']),
                    "Description" : item_data['description'],
                    "Image URL" : image,
                    "Type" : item_data['vegNonvegBoth'],
                    "City" : city,
                    "Locality" : locality,
                    "Quantity" : item_data['qty'],
                    "Store ID" : businessId
                });
            }

            localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
            localStorage.setItem('gTotal', JSON.stringify(gTotal));
                if (typeof fbq == "function") {
                    fbq('track', 'AddToCart');
                }
        }

        if (action == 'delete') {
            var data = i['items'];

            if(customise != undefined)
            {
                var index = data.findIndex(e => {
                    if (e.itemId == itemId && e.customization === customise) {
                    var matchingItem = data.find(item => item.itemId == itemId && item.customization === customise);
                    if (matchingItem) {
                        return JSON.stringify(e.subItems) === JSON.stringify(matchingItem.subItems);
                    }
                    }
                });
            }else{
                var index = data.findIndex(e => {
                    if (e.pId) {
                        if (e.pId == itemId) {
                            return e.pId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.pId == itemId).subItems);
                        } else {
                            return e.itemId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.itemId == itemId).subItems);
                        }
                    } else {
                        return e.itemId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.itemId == itemId).subItems);
                    }
                });
            }

            var foundItem = res.find(objec => objec.itemId == itemId);
            var gtm_items;
            var gtmTotal;

            if (foundItem) {
                var foundIndex = gtag_items.findIndex(obj => obj.item_id == foundItem.itemId);

                if (foundIndex !== -1) {
                    if (gtag_items[foundIndex].quantity > 1) {
                        gtag_items[foundIndex].quantity--;
                        gtag_items[foundIndex].price = parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['itemPrice']);
                        gTotal = gTotal - foundItem['itemPrice'];

                        gtm_items = [{
                            'item_id': gtag_items[foundIndex].item_id,
                            'item_name': gtag_items[foundIndex].item_name,
                            'quantity':  gtag_items[foundIndex].quantity,
                            'price' : gtag_items[foundIndex].price,
                            'item_category' : gtag_items[foundIndex].item_category,
                            'location_id' : postalCode
                        }];

                        gtmTotal = gtag_items[foundIndex].price;
                    } else {
                        
                        gtm_items = [{
                            'item_id': gtag_items[foundIndex].item_id,
                            'item_name': gtag_items[foundIndex].item_name,
                            'quantity':  0,
                            'price' : parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['itemPrice']),
                            'item_category' : gtag_items[foundIndex].item_category,
                            'location_id' : postalCode
                        }];
                        gtmTotal = parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['itemPrice']);
                        gtag_items.splice(foundIndex, 1);
                        gTotal = gTotal - foundItem['itemPrice'];
                    }
                    localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
                    localStorage.setItem('gTotal', JSON.stringify(gTotal));
                }
            }

            if (typeof webengage_tag == "function") {

                var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + foundItem['image'];
                
                // Check if foundItem has subItems and if the array length is greater than 0
                if (Array.isArray(foundItem['subItems']) && foundItem['subItems'].length > 0) {
                    // Initialize variables to store the concatenated values
                    var subitemNames = '';
                    var totalSubitemPrice = parseFloat(foundItem['sp']); // Start with the main item price
                    var subitemDescriptions = foundItem['description'] || ''; // Start with the main item description
            
                    // Loop through the subItems array to append the names, prices, and descriptions
                    foundItem['subItems'].forEach(function(subItem) {
                        subitemNames += ' + ' + subItem['itemName'];
                        totalSubitemPrice += parseFloat(subItem['sp']);
                        if (subItem['itemDesc']) {
                            subitemDescriptions += ' ' + subItem['itemDesc'];
                        }
                    });
            
                    // Update the main item with the concatenated subitem information
                    foundItem['itemName'] += subitemNames;
                    foundItem['sp'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                    foundItem['description'] = subitemDescriptions;
                }
            
                // Track the updated data
                webengage.track("Removed From Cart", {
                    "Product Name" : foundItem['itemName'],
                    "Product ID" : String(foundItem['itemId']),
                    "Category Name" : foundItem['sectionName'],
                    "Category ID" : foundItem['sectionId'],
                    "Price" : parseFloat(foundItem['sp']),
                    "Description" : foundItem['description'],
                    "Image URL" : image,
                    "Type" : foundItem['vegNonvegBoth']
                });
            }
            
            if (typeof gtag == "function") {
                gtag('event', 'remove_from_cart', {
                    'value': parseFloat(gTotal),
                    'currency': 'INR',
                    'items': gtag_items
                });
            }
            if (typeof gtm_tag == "function") {

                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    'event': "remove_from_cart",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(gtmTotal),
                        'items': gtm_items
                    }
                });
            }
            if (typeof fbq == "function") {
                fbq('track', 'RemoveFromCart');
            }
        
            sp = Number(qty) - 1;
            if (index !== -1) {
                if (i['items'][index]['qty'] > 1) {
                    i['items'][index]['qty'] -= 1;
                } else {
                    i['items'].splice(index, 1);
                }
            }
            let t = 0;
            i['items'].filter((j) => (j.itemId == itemId) ? t++ : 0);
            if (t == 0) {
                $('#btn-' + itemId).show();
                $('#div-' + itemId).hide();
                $('#feabtn-' + itemId).show();
                $('#feadiv-' + itemId).hide();
            }
            localStorage.setItem('slug', slug);
            localStorage.setItem('business', businessId);
        }
        if (action == 'update') {
            // console.log(i['items'])
            var t = 0;
            var data = i['items'];

            if(customise != undefined)
            {
                var index = data.findIndex(e => {
                    if (e.itemId == itemId && e.customization === customise) {
                    var matchingItem = data.find(item => item.itemId == itemId && item.customization === customise);
                    if (matchingItem) {
                        return JSON.stringify(e.subItems) === JSON.stringify(matchingItem.subItems);
                    }
                    }
                });
            }else{
            var index = data.findIndex(e => {
                if (e.pId) {
                    if (e.pId == itemId) {
                        return e.pId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.pId == itemId).subItems);
                    } else {
                        return e.itemId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.itemId == itemId).subItems);
                    }
                } else {
                    return e.itemId == itemId && JSON.stringify(e.subItems) == JSON.stringify(data.find(sub => sub.itemId == itemId).subItems);
                }
            });
        }
            var obj = i['items'][index];
            sp = Number(qty) + 1;
            i['items'].push(obj);
            localStorage.setItem('slug', slug);
            localStorage.setItem('business', businessId);

            var foundItem = res.find(objec => objec.itemId == itemId);
            if (foundItem) {
                        var existingItem = gtag_items.find(existing => existing.item_id == foundItem['itemId']);
                        if (existingItem) {
                            existingItem.quantity = foundItem['qty'] + 1;
                            existingItem.price = parseFloat(existingItem.price) + parseFloat(foundItem['itemPrice']);
                            let sp = parseFloat(foundItem['itemPrice']);
                            gTotal += sp;
                        }
                        t++;
            }
            if (typeof webengage_tag == "function") {

                var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + foundItem['image'];
                
                // Check if foundItem has subItems and if the array length is greater than 0
                if (Array.isArray(foundItem['subItems']) && foundItem['subItems'].length > 0) {
                    // Initialize variables to store the concatenated values
                    var subitemNames = '';
                    var totalSubitemPrice = parseFloat(foundItem['sp']); // Start with the main item price
                    var subitemDescriptions = foundItem['description'] || ''; // Start with the main item description
            
                    // Loop through the subItems array to append the names, prices, and descriptions
                    foundItem['subItems'].forEach(function(subItem) {
                        subitemNames += ' + ' + subItem['itemName'];
                        totalSubitemPrice += parseFloat(subItem['sp']);
                        if (subItem['itemDesc']) {
                            subitemDescriptions += ' ' + subItem['itemDesc'];
                        }
                    });
            
                    // Update the main item with the concatenated subitem information
                    foundItem['itemName'] += subitemNames;
                    foundItem['sp'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                    foundItem['description'] = subitemDescriptions;
                }
            
                // Track the updated data
                webengage.track("Added To Cart", {
                    "Product Name" : foundItem['itemName'],
                    "Product ID" : String(foundItem['itemId']),
                    "Category Name" : foundItem['sectionName'],
                    "Category ID" : foundItem['sectionId'],
                    "Price" : parseFloat(foundItem['sp']),
                    "Description" : foundItem['description'],
                    "Image URL" : image,
                    "Type" : foundItem['vegnonvegboth'],
                    "City" : city,
                    "Locality" : locality,
                    "Quantity" : foundItem['qty'],
                    "Store ID" : businessId
                });
            }

            if (typeof gtag == "function") {


                gtag('event', 'add_to_cart', {
                    'value': parseFloat(gTotal),
                    'currency': 'INR',
                    'items': gtag_items
                });
            }
            if (typeof gtm_tag == "function") {

                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    'event': "add_to_cart",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(gTotal),
                        'items': gtag_items
                    }
                });
            }

            localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
            localStorage.setItem('gTotal', JSON.stringify(gTotal));
            if (typeof fbq == "function") {
                fbq('track', 'AddToCart');
            }
        }
        if (!localStorage.getItem('itemList') || localStorage.getItem('itemList') == '') {
            var j = {};
            j['bId'] = businessId;
            j['items'] = i['items'];
            var finalArr = [];
            finalArr.push(j);
            // console.log(JSON.stringify(j));
            localStorage.setItem('itemList', JSON.stringify(finalArr));
        } else {
            var arr = JSON.parse(localStorage.getItem('itemList'));
            var index = arr.findIndex(e => e.bId == businessId);
            arr[index]['items'] = i['items'];
            localStorage.setItem('itemList', JSON.stringify(arr));
        }

        $('.spinner').hide();
        $('#customisable-item-modal').modal('hide');
        qty = 0;
        var sp = 0;
        var c = "";

        res = [];
        distRes = [];

        if (i['items'].length == 0) {
            // c = '<img src="' + origin + '/assets/wla_new/img/add_to_cart.png">';

            c = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
                '<g><path d="M167.48,326.6c8.21,21.97,27.89,35.58,50.39,35.58c58.81,0,117.63,0.01,176.44,0.02c2.92,0,5.86-0.1,8.74,0.21   c11.74,1.29,20.14,9.49,21.68,20.96c1.89,14.14-3.74,25.46-15.23,29.78c-2.93,1.1-6.29,1.48-9.45,1.48   c-62.65,0.08-125.3,0.39-187.95-0.08c-33.49-0.25-58.57-17.01-77.45-43.61c-12.26-17.28-20.69-36.62-25.68-57.14   c-5.32-21.89-9.5-44.05-13.98-66.14c-4.48-22.1-8.76-44.24-13.01-66.38c-4.17-21.69-8.16-43.42-12.29-65.12   c-3.04-15.97-6.08-31.95-9.39-47.87c-0.35-1.7-2.23-3.77-3.88-4.39c-12.03-4.57-24.2-8.75-36.29-13.16   C9.85,46.99,3.77,36.37,4.71,24.11C5.64,11.96,13.44,2.35,24.23,0.34c2.06-0.38,4.41-0.53,6.37,0.07   C49.8,6.25,69,12.13,88.09,18.35c6.72,2.19,11.52,7.13,13.96,13.78c3.32,9.06,6.32,18.25,9.16,27.47c1.04,3.37,2.72,4.61,6.24,4.6   c89.06-0.14,178.13-0.19,267.19-0.24c27.79-0.02,55.59-0.14,83.38,0.11c6.69,0.06,13.51,0.79,20.03,2.26   c12.12,2.72,18.08,10.7,19.21,23.23c0.85,9.4-2.65,17.83-5.08,26.47c-4.95,17.55-10.27,35-15.44,52.49   c-5.82,19.7-11.7,39.38-17.47,59.09c-5.77,19.71-11.4,39.46-17.19,59.17c-3.23,10.98-7.66,21.35-16.09,29.53   c-7,6.8-15.47,9.62-25.08,9.63c-29.64,0.02-59.27,0.14-88.91,0.13c-49.44-0.01-98.88-0.09-148.32-0.1   C171.76,325.96,169.86,326.34,167.48,326.6z M290.11,199.41c-32.5,0.21-59.17,14.2-82.07,36.44c-2.28,2.22-3.72,6.13-4.01,9.4   c-0.57,6.35,2.62,11.44,8.42,14.06c5.72,2.59,11.34,1.67,16.34-2.46c5.78-4.77,11.32-9.96,17.59-14   c24.17-15.58,49.54-18.39,76.03-6c10.68,4.99,19.76,12.17,28.41,20.06c6.25,5.7,15.16,5.42,20.77-0.21   c5.78-5.8,6.18-14.76,0.09-20.68C349.03,214.02,322.7,199.98,290.11,199.41z M330.16,162.48c0.06,11.68,9.76,21.39,21.37,21.39   c11.72,0,21.86-10.16,21.69-21.76c-0.16-11.52-10.11-21.41-21.59-21.45C339.92,140.61,330.1,150.59,330.16,162.48z M249.36,162.48   c0.04-11.81-9.92-21.88-21.58-21.82c-11.5,0.06-21.47,9.97-21.58,21.45c-0.11,11.66,9.92,21.73,21.68,21.76   C239.41,183.89,249.32,174.02,249.36,162.48z"></path>' +
                '<path d="M345.73,471.92c0.02-22.05,17.72-39.48,39.97-39.36c22.03,0.12,39.54,17.93,39.4,40.07   c-0.15,21.85-17.75,39.33-39.63,39.37C363.05,512.04,345.7,494.54,345.73,471.92z"></path>' +
                '<path d="M266.1,472.44c-0.05,22.28-17.49,39.6-39.77,39.52c-22.21-0.08-39.66-17.69-39.48-39.86c0.18-22.4,17.5-39.6,39.81-39.53   C248.93,432.63,266.16,450.05,266.1,472.44z"></path>' +
                '</g></svg><h4 class="wla-outlet-name-md mb-2 mt-3 font-weight-bold" style="font-size: 22px;">Your Cart is Empty</h4>';
                if(categoryId == 4){
                    c += '<p class="mb-0">Add Service Now!</p>';
                }else{
                    c += '<p class="mb-0">We Know Your Food Cravings. Add Your Favorite Meal Now!</p>';
                }
                

            $('#qty-table').html('');
            $('#qty-table').html(c);
            // $('.cartDiv').hide();
            $('#emptyCartDiv').show();
            $('#cartBTN').hide();
            $('#emptyCart').show();
            $('.price-checkout').attr("style", "display: none !important");
        } else {
            $('.price-checkout').attr("style", "display: block !important");
        }

        groupItems(i['items']);

        // $('#cartItemCount').html(qty);

        if (deliveryActive != 1 && pickupActive != 1 && dineActive != 1 && incarActive != 1) {
            $('#cartBTN').addClass('disabled');
            $('.price-checkout').addClass('disabled');
        }else {
            $('#cartBTN').removeClass('disabled');
            $('.price-checkout').removeClass('disabled');
        }

        $('#cartItemCount').addClass('rotate-x');
        setTimeout(function() {
            $('#cartItemCount').removeClass('rotate-x')
        }, 600);
        // $(".rotate-x").removeClass(600);

        i['items'] = [];

        if (outlet_open != 1) {
            $('.cart-new-btn').addClass('d-none');
            $('.price-checkout').addClass('disabled');
            $('.price_mobile').addClass('disabled');
            $('.order-type').addClass('disabled');
            $('.available-next').removeClass('d-none');
        } else {
            $('.cart-new-btn').removeClass('d-none');
            $('.price-checkout').removeClass('disabled');
            $('.price_mobile').removeClass('disabled');
            $('.order-type').removeClass('disabled');
            $('.available-next').addClass('d-none');
        }

        $('#upbar' + barid).hide();
        $('#feabar' + barid).hide();
        $('#bar' + barid).hide();
        $('.cart-new-btn').removeClass('not-active-all');
        $('body #single-item-modal').modal('hide');
    }
}

function add_to_cart_wl(action, itemId,barid) {
    //$('.spinner').show();
    if (action == 'add') {
        var validate = 0;
        if (itemTemplates != undefined && itemTemplates != '') {
            var mandTopp = itemTemplates.filter(e => e.minQty != 0);
            // console.log(mandTopp);
            if (mandTopp.length == 0) {
                validate = 1;
            }
            for (var k = 0; k < mandTopp.length; k++) {
                var count = 0;
                let index = item['subItems'].filter(ex => ex.sectionId == mandTopp[k]['templateId']);
                count = index.length;
                $('.spinner').show();
                if (count < mandTopp[k]['minQty']) {
                    $('#itemSelectError' + mandTopp[k]['templateId']).show();
                    $('#item-error'+ mandTopp[k]['templateId']).html('Kindly Select Atleast ' + mandTopp[k]['minQty'] + ' Item to Proceed');
                    var targetElement = document.getElementById('itemSelectError' + mandTopp[k]['templateId']);
                        targetElement.scrollIntoView({
                            behavior: 'smooth', // or 'auto' for immediate scrolling
                            block: 'start'      // or 'end', 'center', 'nearest'
                        });
                    setTimeout(function() {
                        $('#itemSelectError' + mandTopp[k]['templateId']).fadeOut('fast');
                    }, 3000);
                    //alert('Kindly Select Atleast ' + mandTopp[k]['minQty'] + ' Item to Proceed');
                    validate = 0;
                    $('.spinner').hide();
                    // alert("Kindly select atlest 1 Pizza");
                    return false;
                } else {
                    $('#itemSelectError' + mandTopp[k]['templateId']).hide();
                    $('.spinner').hide();
                    validate = 1;
                }

            }
        }

    }
    var i = {};

    var post_params = {};


    i['items'] = [];
    i['items'].push(item);
    if (action == 'delete') {
        post_params.action = 'delete';
        post_params.itemId = itemId;
        get_params = "&action=delete&itemId=" + itemId;
        var foundItem = res.find(objec => objec.orderItemId == itemId);
        var gtm_items;
        var gtmTotal;

        if (foundItem) {
            var foundIndex = gtag_items.findIndex(item => item.item_id == foundItem.itemId);

            if (foundIndex !== -1) {
                if (gtag_items[foundIndex].quantity > 1) {
                    gtag_items[foundIndex].quantity--;
                    gtag_items[foundIndex].price = parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['sp']);
                    gTotal = gTotal - foundItem['sp'];

                    gtm_items = [{
                        'item_id': gtag_items[foundIndex].item_id,
                        'item_name': gtag_items[foundIndex].item_name,
                        'quantity':  gtag_items[foundIndex].quantity,
                        'price' : gtag_items[foundIndex].price,
                        'item_category' : gtag_items[foundIndex].item_category,
                        'location_id' : postalCode
                    }];

                    gtmTotal = gtag_items[foundIndex].price;
                } else {
                    
                    gtm_items = [{
                        'item_id': gtag_items[foundIndex].item_id,
                        'item_name': gtag_items[foundIndex].item_name,
                        'quantity':  0,
                        'price' : parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['sp']),
                        'item_category' : gtag_items[foundIndex].item_category,
                        'location_id' : postalCode
                    }];
                    gtmTotal = parseFloat(gtag_items[foundIndex].price) - parseFloat(foundItem['sp']);
                    gtag_items.splice(foundIndex, 1);
                    gTotal = gTotal - foundItem['sp'];
                }
                localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
                localStorage.setItem('gTotal', JSON.stringify(gTotal));
            }
        }
        if (typeof gtag == "function") {
            gtag('event', 'remove_from_cart', {
                'value': parseFloat(gTotal),
                'currency': 'INR',
                'items': gtag_items
            });
        }

        if (typeof gtm_tag == "function") {

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "remove_from_cart",
                'ecommerce': {
                    'currency': "INR",
                    'value': parseFloat(gtmTotal),
                    'items': gtm_items
                }
            });
        }

        if (typeof fbq == "function") {
            fbq('track', 'RemoveFromCart');
        }

        if (typeof webengage_tag == "function") {

            var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + foundItem['image'];
            
            // Check if foundItem has subItems and if the array length is greater than 0
            if (Array.isArray(foundItem['subItems']) && foundItem['subItems'].length > 0) {
                // Initialize variables to store the concatenated values
                var subitemNames = '';
                var totalSubitemPrice = parseFloat(foundItem['sp']); // Start with the main item price
                var subitemDescriptions = foundItem['description'] || ''; // Start with the main item description
        
                // Loop through the subItems array to append the names, prices, and descriptions
                foundItem['subItems'].forEach(function(subItem) {
                    subitemNames += ' + ' + subItem['itemName'];
                    totalSubitemPrice += parseFloat(subItem['sp']);
                    if (subItem['itemDesc']) {
                        subitemDescriptions += ' ' + subItem['itemDesc'];
                    }
                });
        
                // Update the main item with the concatenated subitem information
                foundItem['itemName'] += subitemNames;
                foundItem['sp'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                foundItem['description'] = subitemDescriptions;
            }
        
            // Track the updated data
            webengage.track("Removed From Cart", {
                "Product Name" : foundItem['itemName'],
                "Product ID" : String(foundItem['itemId']),
                "Category Name" : foundItem['sectionName'],
                "Category ID" : foundItem['sectionId'],
                "Price" : parseFloat(foundItem['sp']),
                "Description" : foundItem['description'],
                "Image URL" : image,
                "Type" : foundItem['vegnonvegboth']
            });
        }

        localStorage.setItem('business', businessId);
        localStorage.setItem('slug',slug);
    } else if (action == 'update') {
        var t = 0;
        post_params.action = 'update';
        post_params.itemId = itemId;
        get_params = "&action=update&itemId=" + itemId;
        localStorage.setItem('business', businessId);
        localStorage.setItem('slug',slug);

        
        
        var foundItem = res.find(objec => objec.orderItemId == itemId);
            if (foundItem) {
                var existingItem = gtag_items.find(existing => existing.item_id == foundItem['itemId']);
                if (existingItem) {
                    existingItem.quantity = foundItem['qty'] + 1;
                    existingItem.price = parseFloat(existingItem.price)  + parseFloat(foundItem['sp']);
                    let sp = parseFloat(foundItem['sp']);
                    gTotal += sp;
                }
                delete i.items[t]['parentName'];
                delete i.items[t]['itemName'];
                delete i.items[t]['sp'];
                if(i.items[t]?.subItems){
                if (i.items[t]['subItems'].length > 0) {
                    var j = 0;
                    i.items[t]['subItems'].forEach(obj1 => {
                        delete i.items[t]['subItems'][j]['itemName'];
                        delete i.items[t]['subItems'][j]['sp'];
                        j++;
                    });
                }
            }
                t++;
        }
        if (typeof gtag == "function") {


            gtag('event', 'add_to_cart', {
                'value': parseFloat(gTotal),
                'currency': 'INR',
                'items': gtag_items
            });
        }

        if (typeof gtm_tag == "function") {

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "add_to_cart",
                'ecommerce': {
                    'currency': "INR",
                    'value': parseFloat(gTotal),
                    'items': gtag_items
                }
            });
        }

        
        localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
        localStorage.setItem('gTotal', JSON.stringify(gTotal));
        if (typeof fbq == "function") {
            fbq('track', 'AddToCart');
        }
        if (typeof webengage_tag == "function") {

            var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + foundItem['image'];
            
            // Check if foundItem has subItems and if the array length is greater than 0
            if (Array.isArray(foundItem['subItems']) && foundItem['subItems'].length > 0) {
                // Initialize variables to store the concatenated values
                var subitemNames = '';
                var totalSubitemPrice = parseFloat(foundItem['sp']); // Start with the main item price
                var subitemDescriptions = foundItem['description'] || ''; // Start with the main item description
        
                // Loop through the subItems array to append the names, prices, and descriptions
                foundItem['subItems'].forEach(function(subItem) {
                    subitemNames += ' + ' + subItem['itemName'];
                    totalSubitemPrice += parseFloat(subItem['sp']);
                    if (subItem['itemDesc']) {
                        subitemDescriptions += ' ' + subItem['itemDesc'];
                    }
                });
        
                // Update the main item with the concatenated subitem information
                foundItem['itemName'] += subitemNames;
                foundItem['sp'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                foundItem['description'] = subitemDescriptions;
            }
        
            // Track the updated data
            webengage.track("Added To Cart", {
                "Product Name" : foundItem['itemName'],
                "Product ID" : String(foundItem['itemId']),
                "Category Name" : foundItem['sectionName'],
                "Category ID" : foundItem['sectionId'],
                "Price" : parseFloat(foundItem['sp']),
                "Description" : foundItem['description'],
                "Image URL" : image,
                "Type" : foundItem['vegnonvegboth'],
                "City" : city,
                "Locality" : locality,
                "Quantity" : foundItem['qty'],
                "Store ID" : businessId
            });
        }
        

    } else if (action == 'add') {
        var t = 0;
        if (localStorage.getItem('itemList') && localStorage.getItem('itemList') != '') {
            var arr = JSON.parse(localStorage.getItem('itemList'));
            var index = arr.findIndex(e => e.bId == businessId);
            if (arr[index]['items'] != '') {
                i['items'] = arr[index]['items'];
            }

            localStorage.setItem('business', businessId);
            localStorage.setItem('slug',slug);
            localStorage.setItem('itemList', '');
        }

        if (i['items'][t]['parentName'] != '' && i['items'][t]['parentName'] != null) {
            $('#bar' + i['items'][t]['pId']).show();
            setTimeout(function() {
                $('.y9uHb').fadeOut('fast');
            }, 1000);
        } else {
            $('#bar' + i['items'][t]['itemId']).show();
            setTimeout(function() {
                $('.y9uHb').fadeOut('fast');
            }, 1000);
        }

        

        if (typeof webengage_tag == "function") {
            var item_data = i['items'][0]; // Access the main item
            var image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + item_data['image'];
        
            // Check if the main item has subItems and if the array length is greater than 0
            if (Array.isArray(item_data['subItems']) && item_data['subItems'].length > 0) {
                // Initialize variables to store the concatenated values
                var subitemNames = '';
                var totalSubitemPrice = parseFloat(item_data['itemPrice']); // Start with the main item price
                var subitemDescriptions = item_data['description'] || ''; // Start with the main item description
        
                // Loop through the subItems array to append the names, prices, and descriptions
                item_data['subItems'].forEach(function(subItem) {
                    subitemNames += ' + ' + subItem['itemName'];
                    totalSubitemPrice += parseFloat(subItem['itemPrice']);
                    if (subItem['itemDesc']) {
                        subitemDescriptions += ' ' + subItem['itemDesc'];
                    }
                });
        
                // Update the main item with the concatenated subitem information
                item_data['itemName'] += subitemNames;
                item_data['itemPrice'] = totalSubitemPrice.toFixed(2); // Ensure the total price is formatted to two decimal places
                item_data['description'] = subitemDescriptions;
            }
        
            // Track the updated data
            webengage.track("Added To Cart", {
                "Product Name" : item_data['itemName'],
                "Product ID" : String(item_data['itemId']),
                "Category Name" : item_data['sectionName'],
                "Category ID" : item_data['sectionId'],
                "Price" : parseFloat(item_data['itemPrice']),
                "Description" : item_data['description'],
                "Image URL" : image,
                "Type" : item_data['vegNonvegBoth'],
                "City" : city,
                "Locality" : locality,
                "Quantity" : item_data['qty'],
                "Store ID" : businessId
            });
        }
        

        if (!jQuery.isEmptyObject(item)) {
            i.items.forEach(obj => {
                var existingItem = gtag_items.find(existing => existing.item_id === obj['itemId']);
                if (existingItem) {
                    existingItem.quantity += obj['qty'];
                    existingItem.price = parseFloat(existingItem.price) + parseFloat(obj['sp']);
                } else {
                    var a = {};
                    a["item_id"] = i.items[t]['itemId'];
                    a["item_name"] = i.items[t]['itemName'];
                    a["quantity"]=i.items[t]['qty'];
                    a["price"]=i.items[t]['sp'];
                    a['item_category']= i.items[t]['sectionName'];
                    a['location_id'] = postalCode;
                    gtag_items.push(a);
                }
                
                let sp = parseFloat(i.items[t]['sp']);
                gTotal += sp;
                delete i.items[t]['parentName'];
                delete i.items[t]['itemName'];
                delete i.items[t]['sp'];
                if(i.items[t]?.subItems){
                if (i.items[t]['subItems'].length > 0) {
                    var j = 0;
                    i.items[t]['subItems'].forEach(obj1 => {
                        delete i.items[t]['subItems'][j]['itemName'];
                        delete i.items[t]['subItems'][j]['sp'];
                        j++;
                    });
                }
            }
                t++;
            });
        }
        // console.log(gtag_items);
        if (typeof gtag == "function") {


            gtag('event', 'add_to_cart', {
                'value': parseFloat(gTotal),
                'currency': 'INR',
                'items': gtag_items
            });
        }
        if (typeof gtm_tag == "function") {

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "add_to_cart",
                'ecommerce': {
                    'currency': "INR",
                    'value': parseFloat(gTotal),
                    'items': gtag_items
                }
            });
        }
        
        localStorage.setItem('gtag_items', JSON.stringify(gtag_items));
        localStorage.setItem('gTotal', JSON.stringify(gTotal));
        if (typeof fbq == "function") {
            fbq('track', 'AddToCart');
        }

        post_params.action = 'add';
        post_params.cart = JSON.stringify(i);

        get_params = "&action=add&cart=" + JSON.stringify(i);
    } else {
        post_params.action = 'add';
        post_params.cart = '';
        get_params = "&action=add&cart=";
    }

    if (localStorage.getItem('orderType') == 1 || localStorage.getItem('orderType') == 4) {
        post_params.latitude = localStorage.getItem('lat');
        post_params.longitude = localStorage.getItem('lng');
        get_params += "&latitude=" + localStorage.getItem('lat') + "&longitude=" + localStorage.getItem('lng');
    }

    // orderType=$("input[name='order_payment_method']:checked"). val()
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    post_params.businessId = businessId;
    post_params.contactMappingId = contactMappingId;
    post_params.token = token;
    post_params.contactId = contactId;
    post_params.isNew = 1;
    post_params.orderType = orderType;
    post_params.tableId = tableId;
    // console.log(tableId);
    // console.log(post_params);
    // var params="?businessId="+businessId+"&contactMappingId="+contactMappingId+"&token="+token+"&contactId="+contactId+
    // "&isNew=1&orderType="+orderType+""+get_params;
    var url = origin + "/client/cart";
    $('.cartDiv').show();
    let subtotal = $('.subTotalSpan').text();

    // $('.price-checkout').attr("style", "display: block !important");
    (subtotal > 0) ? $('.price-checkout').attr("style", "display: block !important"): $('.price-checkout').attr("style", "display: none !important");
    $('.loginDIV').attr("style", "display: none !important");
    $.ajax({
        url: url,
        type: "POST",
        data: post_params,
        dataType: "json",
        success: function(result) {

            if(result?.status !=0){
            
            var orderDetails = result['rows']['orderDetails'][0];
            var promoCodes = result['rows']['promoCodes'];
            if (orderDetails['dineInOrders'] == 0) {
                $('a#dineInTag').removeClass('active');
                $('a#dineInTag').addClass('disabled');
                $('a#dineInTag').hide();
                $('#chk_dine').attr("style", "display: none");
                $('#chk_dine_dis').attr("style", "display: inline-block");
                
            } else {
                $('a#dineInTag').removeClass('disabled');
                $('a#dineInTag').show();
                $('#chk_dine_dis').attr("style", "display: none");
            }
            if (orderDetails['inCarOrders'] == 0) {
                $('a#inCarTag').removeClass('active');
                $('a#inCarTag').addClass('disabled');
                $('a#inCarTag').hide();
                $('#chk_incar_dis').attr("style", "display: inline-block");
            } else {
                $('a#inCarTag').removeClass('disabled');
                $('a#inCarTag').show();
                $('#chk_incar_dis').attr("style", "display: none");
            }
            if (orderDetails['onlineDeliveryOn'] == 0) {
                onlineOrdersDelivery = 0;
                $('a#delivery-tab').removeClass('active');
                $('#chk_del').attr("style", "display:none");
                $('a#delivery-tab').addClass('disabled');
                $('a#delivery-tab').addClass('d-none');
                $('#chk_del_dis').attr("style", "display:inline-block");
            }else if (orderDetails['onlineOrdersDelivery'] == 0 && orderDetails['onlineDeliveryOn'] == 1) {
                onlineOrdersDelivery = 0;
                $('a#delivery-tab').removeClass('active');
                $('a#delivery-tab').removeClass('d-none');
                $('#chk_del').attr("style", "display: none");
                $('a#delivery-tab').addClass('disabled');
                $('#chk_del_dis').attr("style", "display:inline-block");
            } else {
                $('a#delivery-tab').removeClass('disabled');
                $('a#delivery-tab').removeClass('d-none');
                $('#chk_del_dis').attr("style", "display:none");
            }
            if (orderDetails['onlineOrdersSelfPickup'] == 0) {
                $('a#pickup-tab').removeClass('active');
                $('a#pickup-tab').addClass('disabled');
                $('#chk_pickup').attr("style", "display: none");
                $('#chk_pickup_dis').attr("style", "display:inline-block");
            } else {
                $('a#pickup-tab').removeClass('disabled');
                $('#chk_pickup_dis').attr("style", "display:none");
            }

            if(result['rows']?.orderItemDetails_running){
                var cartItems = result['rows']['orderItemDetails_running'];
                if(cartItems['items_already_added'].length > 0){
                    $('a#delivery-tab').removeClass('active');
                    $('#chk_del').attr("style", "display:none");
                    $('a#delivery-tab').addClass('disabled');
                    $('#chk_del_dis').attr("style", "display:inline-block");

                    $('a#pickup-tab').removeClass('active');
                    $('a#pickup-tab').addClass('disabled');
                    $('#chk_pickup').attr("style", "display: none");
                    $('#chk_pickup_dis').attr("style", "display:inline-block");

                    $('a#inCarTag').removeClass('active');
                    $('a#inCarTag').addClass('disabled');
                    $('#chk_incar').attr("style", "display: none");
                    $('#chk_incar_dis').attr("style", "display: inline-block");
                }
            }else{
                var cartItems = result['rows']['orderItemDetails'];
            }

            var c = "";
            let size;
        if (orderDetails['orderType'] == 3 && orderDetails['running_order'] == 1 && orderDetails['businessRunningOrder'] == 1) {
            if (cartItems.items_added.length === 0) {
                size = Object.keys(cartItems['items_added']);
            }else{
                size = Object.keys(cartItems['items_added']);
            }
        }else{
             size = Object.keys(cartItems);
        }

            var cItems = '';
            if (size.length > 0) {
                $('.cartDiv').show();
                $('#emptyCartDiv').hide();
                $('#cartBTN').show();
                $('#emptyCart').hide();
                qty = size.length;
                res_already_cart = [];
                res = [];

                if (orderDetails['orderType'] == 3 && orderDetails['running_order'] == 1 && orderDetails['businessRunningOrder'] == 1) {
                if (cartItems['items_added']?.length > 0 && cartItems['items_added'] != undefined && cartItems['items_already_added'] != undefined  && cartItems['items_already_added'] ?.length > 0 && orderDetails['orderType'] == 3) {
                    cItems = cartItems['items_added'];
                    $('#cartDisplay').show();
                    items_already_added(cartItems['items_already_added']);
                } else if (cartItems['items_added'] != undefined  && cartItems['items_added'].length > 0 && orderDetails['orderType'] == 3) {
                    cItems = cartItems['items_added'];
                    $('#AlreadycartDisplay').hide();
                }else{
                    var c = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
                    '<g><path d="M167.48,326.6c8.21,21.97,27.89,35.58,50.39,35.58c58.81,0,117.63,0.01,176.44,0.02c2.92,0,5.86-0.1,8.74,0.21   c11.74,1.29,20.14,9.49,21.68,20.96c1.89,14.14-3.74,25.46-15.23,29.78c-2.93,1.1-6.29,1.48-9.45,1.48   c-62.65,0.08-125.3,0.39-187.95-0.08c-33.49-0.25-58.57-17.01-77.45-43.61c-12.26-17.28-20.69-36.62-25.68-57.14   c-5.32-21.89-9.5-44.05-13.98-66.14c-4.48-22.1-8.76-44.24-13.01-66.38c-4.17-21.69-8.16-43.42-12.29-65.12   c-3.04-15.97-6.08-31.95-9.39-47.87c-0.35-1.7-2.23-3.77-3.88-4.39c-12.03-4.57-24.2-8.75-36.29-13.16   C9.85,46.99,3.77,36.37,4.71,24.11C5.64,11.96,13.44,2.35,24.23,0.34c2.06-0.38,4.41-0.53,6.37,0.07   C49.8,6.25,69,12.13,88.09,18.35c6.72,2.19,11.52,7.13,13.96,13.78c3.32,9.06,6.32,18.25,9.16,27.47c1.04,3.37,2.72,4.61,6.24,4.6   c89.06-0.14,178.13-0.19,267.19-0.24c27.79-0.02,55.59-0.14,83.38,0.11c6.69,0.06,13.51,0.79,20.03,2.26   c12.12,2.72,18.08,10.7,19.21,23.23c0.85,9.4-2.65,17.83-5.08,26.47c-4.95,17.55-10.27,35-15.44,52.49   c-5.82,19.7-11.7,39.38-17.47,59.09c-5.77,19.71-11.4,39.46-17.19,59.17c-3.23,10.98-7.66,21.35-16.09,29.53   c-7,6.8-15.47,9.62-25.08,9.63c-29.64,0.02-59.27,0.14-88.91,0.13c-49.44-0.01-98.88-0.09-148.32-0.1   C171.76,325.96,169.86,326.34,167.48,326.6z M290.11,199.41c-32.5,0.21-59.17,14.2-82.07,36.44c-2.28,2.22-3.72,6.13-4.01,9.4   c-0.57,6.35,2.62,11.44,8.42,14.06c5.72,2.59,11.34,1.67,16.34-2.46c5.78-4.77,11.32-9.96,17.59-14   c24.17-15.58,49.54-18.39,76.03-6c10.68,4.99,19.76,12.17,28.41,20.06c6.25,5.7,15.16,5.42,20.77-0.21   c5.78-5.8,6.18-14.76,0.09-20.68C349.03,214.02,322.7,199.98,290.11,199.41z M330.16,162.48c0.06,11.68,9.76,21.39,21.37,21.39   c11.72,0,21.86-10.16,21.69-21.76c-0.16-11.52-10.11-21.41-21.59-21.45C339.92,140.61,330.1,150.59,330.16,162.48z M249.36,162.48   c0.04-11.81-9.92-21.88-21.58-21.82c-11.5,0.06-21.47,9.97-21.58,21.45c-0.11,11.66,9.92,21.73,21.68,21.76   C239.41,183.89,249.32,174.02,249.36,162.48z"></path>' +
                    '<path d="M345.73,471.92c0.02-22.05,17.72-39.48,39.97-39.36c22.03,0.12,39.54,17.93,39.4,40.07   c-0.15,21.85-17.75,39.33-39.63,39.37C363.05,512.04,345.7,494.54,345.73,471.92z"></path>' +
                    '<path d="M266.1,472.44c-0.05,22.28-17.49,39.6-39.77,39.52c-22.21-0.08-39.66-17.69-39.48-39.86c0.18-22.4,17.5-39.6,39.81-39.53   C248.93,432.63,266.16,450.05,266.1,472.44z"></path>' +
                    '</g></svg><h4 class="wla-outlet-name-md mb-2 mt-3 font-weight-bold" style="font-size: 22px;">Your Cart is Empty</h4>' +
                    '<p class="mb-0">We Know Your Food Cravings. Add Your Favorite Meal Now!</p>';
                    $('#cartDisplay').html('');
                    $('#cartDisplay').html(c);
                    $('#cartDisplay').show();
                }
            } else {
                    cItems = cartItems;
                }

                if (cItems) {
                    if (isCloud == 1) {
                        // var 
                        var temp = cItems;
                        temp.forEach(c => {
                            cItems = c['items'];
                            cItems.forEach(obj => {
                                $('.price-checkout').attr("style", "display: block !important");
                                var index = res.findIndex(e => e.itemId == obj.itemId);
                                if (index == -1) {
                                    res.push(obj);
                                    if ($('#btn-' + obj['itemId']).length > 0) {

                                        if ($('#div-' + obj['itemId']).length > 0) {
                                            $('#btn-' + obj['itemId']).hide();
                                            $('#div-' + obj['itemId']).show();
                                            $('#feabtn-' + obj['itemId']).hide();
                                            $('#feadiv-' + obj['itemId']).show();
                                            $('#qty-input-' + obj['itemId']).val(obj['qty']);
                                            $('#feaqty-input-' + obj['itemId']).val(obj['qty']);
                                        }
                                    } else {
                                        if ($('#div-' + obj['parentId']).length > 0) {
                                            $('#btn-' + obj['parentId']).hide();
                                            $('#div-' + obj['parentId']).show();
                                            $('#feabtn-' + obj['parentId']).hide();
                                            $('#feadiv-' + obj['parentId']).show();
                                            var q = res.filter(e => e.parentId == obj['parentId']).reduce((total, obj) => parseInt(obj.qty) + parseInt(total), 0)
                                            $('#qty-input-' + obj['parentId']).val(q);
                                            $('#feaqty-input-' + obj['parentId']).val(q);
                                        }


                                    }


                                } else {

                                    if ($('#btn-' + obj['itemId']).length > 0) {


                                        if ($('#div-' + obj['itemId']).length > 0) {
                                            $('#btn-' + obj['itemId']).hide();
                                            $('#div-' + obj['itemId']).show();
                                            $('#feabtn-' + obj['itemId']).hide();
                                            $('#feadiv-' + obj['itemId']).show();
                                            var q = parseInt($('#qty-input-' + obj['itemId']).val()) + 1;
                                            $('#qty-input-' + obj['itemId']).val(q);
                                            $('#feaqty-input-' + obj['itemId']).val(q);
                                        }

                                    } else {

                                        if ($('#div-' + obj['parentId']).length > 0) {
                                            $('#btn-' + obj['parentId']).hide();
                                            $('#div-' + obj['parentId']).show();
                                            $('#feabtn-' + obj['parentId']).hide();
                                            $('#feadiv-' + obj['parentId']).show();
                                            var q = parseInt($('#qty-input-' + obj['parentId']).val()) + parseFloat(1);
                                            $('#qty-input-' + obj['parentId']).val(q);
                                            $('#feaqty-input-' + obj['parentId']).val(q);
                                        }
                                        // $('#div-' + obj['parentId']).show();
                                        // var q = parseInt($('#qty-input-' + obj['parentId']).val()) + 1;
                                        // $('#qty-input-' + obj['parentId']).val(q);
                                    }

                                    //  $('#btn-'+obj['itemId']).hide();
                                    //  $('#div-'+obj['itemId']).show();
                                    //  var q= parseInt($('#qty-input-'+obj['itemId']).val())+1;
                                    //  $('#qty-input-'+obj['itemId']).val(q);

                                    if (obj['subItems'] == '') {
                                        index = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);
                                        if (index != -1) {
                                            res[index]['qty'] = parseFloat(res[index]['qty']) + parseFloat(1);
                                            res[index]['sp'] = parseFloat(res[index]['sp']) + parseFloat(obj['itemPrice']);
                                        } else {
                                            res.push(obj);
                                        }

                                    } else {

                                        index1 = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);

                                        if (index1 != -1) {
                                            res[index1]['qty'] = parseFloat(res[index1]['qty']) + parseFloat(1);
                                            res[index1]['subTotal'] = parseFloat(res[index1]['subTotal']) + parseFloat(obj['itemPrice']);
                                            var t = 0;
                                            obj['subItems'].forEach(o1 => {

                                                res[index1]['subItems'][t]['sp'] = (parseFloat(res[index1]['subItems'][t]['subTotal']) + parseFloat(o1['itemPrice'])).toString();
                                                // res[index]['subItems'][t]['qty']=parseFloat(res[index]['subItems'][t]['qty'])+parseFloat(o1['qty']);
                                                t++;
                                            });

                                        } else {

                                            res.push(obj);
                                        }
                                    }


                                }
                            });
                        });

                    } else {
                        cItems.forEach(obj => {
                            // if(orderDetails['running_order'] == 1){
                            //     for(var j=0 ; j < obj['items'].length ; j++){
                            //         obj = obj['items'][j];
                            //     }
                                
                            // }
                            $('.price-checkout').attr("style", "display: block !important");
                            var index = res.findIndex(e => e.itemId == obj.itemId);
                            if (index == -1) {
                                res.push(obj);
                                if ($('#btn-' + obj['itemId']).length > 0) {

                                    if ($('#div-' + obj['itemId']).length > 0) {
                                        $('#btn-' + obj['itemId']).hide();
                                        $('#div-' + obj['itemId']).show();
                                        $('#feabtn-' + obj['itemId']).hide();
                                        $('#feadiv-' + obj['itemId']).show();
                                        $('#qty-input-' + obj['itemId']).val(obj['qty']);
                                        $('#feaqty-input-' + obj['itemId']).val(obj['qty']);
                                    }
                                } else {
                                    if ($('#div-' + obj['parentId']).length > 0) {
                                        $('#btn-' + obj['parentId']).hide();
                                        $('#div-' + obj['parentId']).show();
                                        $('#feabtn-' + obj['parentId']).hide();
                                        $('#feadiv-' + obj['parentId']).show();
                                        var q = res.filter(e => e.parentId == obj['parentId']).reduce((total, obj) => parseInt(obj.qty) + parseInt(total), 0)
                                        $('#qty-input-' + obj['parentId']).val(q);
                                        $('#feaqty-input-' + obj['parentId']).val(q);
                                    }


                                }


                            } else {

                                if ($('#btn-' + obj['itemId']).length > 0) {


                                    if ($('#div-' + obj['itemId']).length > 0) {
                                        $('#btn-' + obj['itemId']).hide();
                                        $('#div-' + obj['itemId']).show();
                                        $('#feabtn-' + obj['itemId']).hide();
                                        $('#feadiv-' + obj['itemId']).show();
                                        var q = parseInt($('#qty-input-' + obj['itemId']).val()) + 1;
                                        $('#qty-input-' + obj['itemId']).val(q);
                                        $('#feaqty-input-' + obj['itemId']).val(q);
                                    }

                                } else {

                                    if ($('#div-' + obj['parentId']).length > 0) {
                                        $('#btn-' + obj['parentId']).hide();
                                        $('#div-' + obj['parentId']).show();
                                        $('#feabtn-' + obj['parentId']).hide();
                                        $('#feadiv-' + obj['parentId']).show();
                                        var q = parseInt($('#qty-input-' + obj['parentId']).val()) + parseFloat(1);
                                        $('#qty-input-' + obj['parentId']).val(q);
                                        $('#feaqty-input-' + obj['parentId']).val(q);
                                    }
                                    // $('#div-' + obj['parentId']).show();
                                    // var q = parseInt($('#qty-input-' + obj['parentId']).val()) + 1;
                                    // $('#qty-input-' + obj['parentId']).val(q);
                                }

                                //  $('#btn-'+obj['itemId']).hide();
                                //  $('#div-'+obj['itemId']).show();
                                //  var q= parseInt($('#qty-input-'+obj['itemId']).val())+1;
                                //  $('#qty-input-'+obj['itemId']).val(q);

                                if (obj['subItems'] == '') {
                                    index = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);
                                    if (index != -1) {
                                        res[index]['qty'] = parseFloat(res[index]['qty']) + parseFloat(1);
                                        res[index]['sp'] = parseFloat(res[index]['sp']) + parseFloat(obj['itemPrice']);
                                    } else {
                                        res.push(obj);
                                    }

                                } else {

                                    index1 = res.findIndex(e => e.itemId == obj.itemId && e.description === obj.description);

                                    if (index1 != -1) {
                                        res[index1]['qty'] = parseFloat(res[index1]['qty']) + parseFloat(1);
                                        res[index1]['subTotal'] = parseFloat(res[index1]['subTotal']) + parseFloat(obj['itemPrice']);
                                        var t = 0;
                                        obj['subItems'].forEach(o1 => {

                                            res[index1]['subItems'][t]['sp'] = (parseFloat(res[index1]['subItems'][t]['subTotal']) + parseFloat(o1['itemPrice'])).toString();
                                            // res[index]['subItems'][t]['qty']=parseFloat(res[index]['subItems'][t]['qty'])+parseFloat(o1['qty']);
                                            t++;
                                        });

                                    } else {

                                        res.push(obj);
                                    }
                                }


                            }
                        });
                    }
                }

                if (isCloud == 1) {
                    // for (var t = 0; t < res.length > 0; t++) {
                    //     for (var i = 0; i < res[t]['items'].length; i++) {
                    //         var iData = res[t]['items'][i];
                    //         c += '<div class="cart-items-outer"><div class="row">';
                    //         c += '<div class="col-8 cart-lft-btn"><div>';
                    //         if (iData['vegnonvegboth'] == 'veg') {
                    //             c += '<div class="veg-flag">';
                    //             c += '<span></span>';
                    //             c += '</div>';
                    //         } else if (iData['vegnonvegboth'] == 'non-veg') {
                    //             c += '<div class="non-vegflag">';
                    //             c += '<span></span>';
                    //             c += '</div>';
                    //         }

                    //         c += '</div>';
                    //         if (iData['parentName'] != null) {
                    //             c += '<div><p class="item-small-hd">' + iData['parentName'] + '-' + iData['itemName'] + '</p>';
                    //         } else {
                    //             c += '<div><p class="item-small-hd">' + iData['itemName'] + '</p>';
                    //         }

                    //         c += '<p class="item-price"><span>' + iData['qty'] + ' x ' + currency + ' ' + iData['itemPrice'] + '</span> <b style="display: inline-block; font-weight: 500;">' + currency + ' ' + iData['subTotal'] + '</b></p>';
                    //         c += '</div></div>';
                    //         c += '<div class="col-4 cart-rgt-btn">';
                    //         c += '<div class="input-group quantity-btn">';
                    //         c += '<div class="input-group-prepend" id="qty_minus">';
                    //         c += '<button class="qty-decrease" onclick="update_item(1,' + iData['orderItemId'] + ')"><i class="las la-minus"></i></button>';
                    //         c += '</div>';
                    //         c += '<input type="hidden" id="act_sel_8360" value="update" class="1">';
                    //         c += '<input type="text" class="form-control qtyVal p-0" id="del-' + iData['orderItemId'] + '" data-item="' + iData['itemId'] + '" readonly="" value="' + iData['qty'] + '">';
                    //         c += '<div class="input-group-prepend" id="qty_plus">';
                    //         c += '<button class="qty-increase" onclick="update_item(2,' + iData['orderItemId'] + ')"><i class="las la-plus"></i></button>';
                    //         c += '</div>';
                    //         c += '</div>';
                    //         c += '</div>';
                    //         c += '</div>';
                    //         if (iData['subItems'].length > 0) {
                    //             for (var j = 0; j < iData['subItems'].length; j++) {
                    //                 c += '<div class="additional">';
                    //                 c += '<div class="row">';
                    //                 c += '<div class="col-8 cart-lft-btn">';
                    //                 c += '<div>';
                    //                 if (iData['subItems'][j]['vegnonvegboth'] == 'veg') {
                    //                     c += '<div class="veg-flag">';
                    //                     c += '<span></span>';
                    //                     c += '</div>';
                    //                 } else if (iData['subItems'][j]['vegnonvegboth'] == 'non-veg') {
                    //                     c += '<div class="non-vegflag">';
                    //                     c += '<span></span>';
                    //                     c += '</div>';
                    //                 }
                    //                 c += '</div>';
                    //                 c += '<div>';
                    //                 c += '<p class="item-small-hd">' + iData['subItems'][j]['sectionName'] + ':</b> ' + iData['subItems'][j]['itemName'] + '</p>';
                    //                 c += '</div>';
                    //                 c += '</div>';
                    //                 c += '<div class="col-4 cart-rgt-btn">';
                    //                 c += '<p class="item-price">' + currency + ' ' + iData['subItems'][j]['subTotal'] + '</p>';
                    //                 c += '</div>';
                    //                 c += '</div></div>';
                    //             }
                    //         }
                    //         c += '</div>';

                    //     }

                    //     // if()
                    // }
                    for (var i = 0; i < res.length > 0; i++) {

                        c += '<div class="cart-items-outer"><div class="row">';
                        if(outlet_open != 1){
                            c += '<div class="col-12 cart-lft-btn"><div>';
                        }else{
                            c += '<div class="col-8 cart-lft-btn"><div>';
                        }

                        if (res[i]['vegnonvegboth'] == 'veg') {
                            c += '<div class="veg-flag">';
                            c += '<span></span>';
                            c += '</div>';
                        } else if (res[i]['vegnonvegboth'] == 'non-veg') {
                            c += '<div class="non-vegflag">';
                            c += '<span></span>';
                            c += '</div>';
                        }

                        c += '</div>';
                        if (res[i]['parentName'] != null) {
                            c += '<div><p class="item-small-hd">' + res[i]['parentName'] + '-' + res[i]['itemName'] + '</p>';
                        } else {
                            c += '<div><p class="item-small-hd">' + res[i]['itemName'] + '</p>';
                        }

                        if ((!res[i]['dynamic_combo'] || res[i]['dynamic_combo'] != 1) && (res[i].hasOwnProperty('viewType') && res[i]['viewType'] !=3)) {
                            c += '<p class="item-price"><span>' + res[i]['qty'] + ' x ' + currency + ' ' + Math.round(res[i]['itemPrice']) + '</span> <b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                        }

                        if(res[i]['viewType'] ==3){
                            c += '<p class="item-price"><b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                        }

                        c += '</div></div>';
                        if(outlet_open != 1){
                            c += '<div class="col-12 cart-rgt-btn">';
                        }else{
                            c += '<div class="col-4 cart-rgt-btn">';
                        }
                        c += '<div class="cart-new-btn">';
                        c += '<div class="quantity-btn"><div class="_29Y5Z " id="qty_minus" onclick="update_item(1,' + res[i]['orderItemId'] + ',0,' + res[i]['itemId'] + ')"></div>';
                        c += '<input type="hidden" id="act_sel_8360" value="update" class="1"><input type="text"  id="del-' + res[i]['orderItemId'] + '" data-item="' + res[i]['itemId'] + '" class=" _2zAXs qtyVal" readonly="" value="' + res[i]['qty'] + '">';
                        c += '<div class="_1ds9T" id="qty_plus" onclick="update_item(2,' + res[i]['orderItemId'] + ',0,' + res[i]['itemId'] + ')">+</div></div>'
                        c += '<div class="y9uHb theo-toggle" id="upbar' + res[i]['itemId'] + '"style="display:none"></div>';
                        c += '</div>';
                        c += '<div class="available-next d-none"><div style="text-align: center; border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 95%;bottom: 0px;left: 10px;">Next available at '+ end_hour +'</div></div>';
                        c += '</div>';
                        c += '</div>';
                        c += '</div>';
                        c += '</div>';
                        

                        if (res[i]['subItems']?.length > 0) {
                            for (var j = 0; j < res[i]['subItems'].length; j++) {
                                c += '<div class="additional">';
                                c += '<div class="row">';
                                c += '<div class="col-8 cart-lft-btn">';
                                c += '<div>';
                                if (res[i]['subItems'][j]['vegnonvegboth'] == 'veg') {
                                    c += '<div class="veg-flag">';
                                    c += '<span></span>';
                                    c += '</div>';
                                } else if (res[i]['subItems'][j]['vegnonvegboth'] == 'non-veg') {
                                    c += '<div class="non-vegflag">';
                                    c += '<span></span>';
                                    c += '</div>';
                                }
                                c += '</div>';
                                c += '<div>';
                                c += '<p class="item-small-hd">' + res[i]['subItems'][j]['sectionName'] + ':</b> ' + res[i]['subItems'][j]['itemName'] + '</p>';
                                c += '</div>';
                                c += '</div>';
                                c += '<div class="col-4 cart-rgt-btn">';
                                c += '<p class="item-price">' + currency + ' ' + Math.round(res[i]['subItems'][j]['subTotal']) + '</p>';
                                c += '</div>';
                                c += '</div></div>';
                            }
                        }
                        c += '</div>';
                    }
                } else {
                    var btnDisableError=0;
                    var invalidDiv =``;
                    for (var i = 0; i < res.length > 0; i++) {
                        let subItems_check = res[i]?.subItems || [];
                        let hasOutOfStockSubItem = subItems_check.some(subItem => subItem.validateStatus == 0);
                        if (res[i]['validateStatus'] == 0 || hasOutOfStockSubItem) {
                            invalidDiv=`border-radius: 9px;
                            background-color: #ffe1e1;
                            padding: 10px;`;
                            btnDisableError++;
                        }
                        c += `<div class="cart-items-outer" style="${invalidDiv}"><div class="row">`;
                        if(outlet_open != 1){
                            c += '<div class="col-12 cart-lft-btn"><div>';
                        }else{
                            c += '<div class="col-8 cart-lft-btn"><div>';
                        }
                        if (res[i]['vegnonvegboth'] == 'veg') {
                            c += '<div class="veg-flag">';
                            c += '<span></span>';
                            c += '</div>';
                        } else if (res[i]['vegnonvegboth'] == 'non-veg') {
                            c += '<div class="non-vegflag">';
                            c += '<span></span>';
                            c += '</div>';
                        }

                        c += '</div>';
                        if (res[i]['parentName'] != null) {
                            c += '<div><p class="item-small-hd">' + res[i]['parentName'] + '-' + res[i]['itemName'] + '</p>';
                        } else {
                            c += '<div><p class="item-small-hd">' + res[i]['itemName'] + '</p>';
                        }

                        if ((!res[i]['dynamic_combo'] || res[i]['dynamic_combo'] != 1) && (res[i].hasOwnProperty('viewType') && res[i]['viewType'] !=3)) {
                            c += '<p class="item-price"><span>' + res[i]['qty'] + ' x ' + currency + ' ' + Math.round(res[i]['itemPrice']) + '</span> <b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                        }

                        if(res[i]['viewType'] ==3){
                            c += '<p class="item-price"><b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                        }

                        c += '</div></div>';
                        if(outlet_open != 1){
                            c += '<div class="col-12 cart-rgt-btn">';
                        }else{
                            c += '<div class="col-4 cart-rgt-btn">';
                        }
                       
                       if(cartItems[i]['validateStatus'] != 0 && !hasOutOfStockSubItem){
                         c += '<div class="cart-new-btn">';
                        c += '<div class="quantity-btn"><div class="_29Y5Z" id="qty_minus" onclick="update_item(1,' + res[i]['orderItemId'] + ',0,' + res[i]['itemId'] + ')"></div>';
                        c += '<input type="hidden" id="act_sel_8360" value="update" class="1"><input type="text"  id="del-' + res[i]['orderItemId'] + '" data-item="' + res[i]['itemId'] + '" class=" _2zAXs qtyVal" readonly="" value="' + res[i]['qty'] + '">';
                        c += '<div class="_1ds9T" id="qty_plus" onclick="update_item(2,' + res[i]['orderItemId'] + ',0,' + res[i]['itemId'] + ')">+</div></div>'
                        c += '<div class="y9uHb theo-toggle" id="upbar' + res[i]['itemId'] + '"style="display:none"></div>';
                        }else if(hasOutOfStockSubItem){
                            c += '<button style="    padding: 0px;color: var(--main-bg-color);" class="delete-item notavailable" onclick="update_item(1,' + res[i]['orderItemId'] + ')">Delete</button>';
                        }else {
                            c += '<button style="    padding: 0px;color: var(--main-bg-color);" class="delete-item notavailable" onclick="update_item(1,' + res[i]['orderItemId'] + ')">Delete</button>';
                        }
                        c += '</div>';
                        c += '</div>';
                        c += '</div>';
                        c += '</div>';
                        if (res[i]['subItems']?.length > 0) {
                            let hasOutOfStockSubItem = res[i]['subItems'].some(subItem => subItem.validateStatus == 0);
                            for (var j = 0; j < res[i]['subItems'].length; j++) {
                                var invalidStyling='';
                                if(res[i]['subItems'][j]['validateStatus']==0 || hasOutOfStockSubItem ){
                                    invalidStyling=`padding: 4px;
                                        border-radius: 4px;
                                        background-color: #fdc8c8;`;
                                        btnDisableError++;
                                }
                                c += `<div class="additional" style="${invalidStyling}">`;
                                c += '<div class="row">';
                                c += '<div class="col-8 cart-lft-btn">';
                                c += '<div>';
                                if (res[i]['subItems'][j]['vegnonvegboth'] == 'veg') {
                                    c += '<div class="veg-flag">';
                                    c += '<span></span>';
                                    c += '</div>';
                                } else if (res[i]['subItems'][j]['vegnonvegboth'] == 'non-veg') {
                                    c += '<div class="non-vegflag">';
                                    c += '<span></span>';
                                    c += '</div>';
                                }
                                c += '</div>';
                                c += '<div>';
                                c += '<p class="item-small-hd">' + res[i]['subItems'][j]['sectionName'] + ':</b> ' + res[i]['subItems'][j]['itemName'] + '</p>';
                                c += '</div>';
                                c += '</div>';
                                c += '<div class="col-4 cart-rgt-btn">';
                                c += '<p class="item-price">' + currency + ' ' + Math.round(res[i]['subItems'][j]['subTotal']) + '</p>';
                                c += '</div>';
                                c += '</div></div>';
                                if(res[i]['subItems'][j]['validateStatus']==0 || hasOutOfStockSubItem ){
                                    c +=`<p class="extra-main-p mb-0" style="color: red;font-size: 11px;">${res[i]['subItems'][j]['validateMsg']}</p>`;
                                }
                            }
                        }
                        c += '</div>';


                    }
                    $('.price-checkout').prop("disabled", btnDisableError > 0);
                }

                if (itemId != '') {
                    let myItem = $('#del-' + itemId).attr('data-item');
                    var filterMyItem = res.filter(e => e.itemId == myItem);
                    if (filterMyItem.length == 0) {
                        $('#btn-' + myItem).show();
                        $('#div-' + myItem).hide();
                        $('#feabtn-' + myItem).show();
                        $('#feadiv-' + myItem).hide();
                    }
                }

                $('#showViewCart').show();
            } else {
                qty = 0;
                c = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">' +
                    '<g><path d="M167.48,326.6c8.21,21.97,27.89,35.58,50.39,35.58c58.81,0,117.63,0.01,176.44,0.02c2.92,0,5.86-0.1,8.74,0.21   c11.74,1.29,20.14,9.49,21.68,20.96c1.89,14.14-3.74,25.46-15.23,29.78c-2.93,1.1-6.29,1.48-9.45,1.48   c-62.65,0.08-125.3,0.39-187.95-0.08c-33.49-0.25-58.57-17.01-77.45-43.61c-12.26-17.28-20.69-36.62-25.68-57.14   c-5.32-21.89-9.5-44.05-13.98-66.14c-4.48-22.1-8.76-44.24-13.01-66.38c-4.17-21.69-8.16-43.42-12.29-65.12   c-3.04-15.97-6.08-31.95-9.39-47.87c-0.35-1.7-2.23-3.77-3.88-4.39c-12.03-4.57-24.2-8.75-36.29-13.16   C9.85,46.99,3.77,36.37,4.71,24.11C5.64,11.96,13.44,2.35,24.23,0.34c2.06-0.38,4.41-0.53,6.37,0.07   C49.8,6.25,69,12.13,88.09,18.35c6.72,2.19,11.52,7.13,13.96,13.78c3.32,9.06,6.32,18.25,9.16,27.47c1.04,3.37,2.72,4.61,6.24,4.6   c89.06-0.14,178.13-0.19,267.19-0.24c27.79-0.02,55.59-0.14,83.38,0.11c6.69,0.06,13.51,0.79,20.03,2.26   c12.12,2.72,18.08,10.7,19.21,23.23c0.85,9.4-2.65,17.83-5.08,26.47c-4.95,17.55-10.27,35-15.44,52.49   c-5.82,19.7-11.7,39.38-17.47,59.09c-5.77,19.71-11.4,39.46-17.19,59.17c-3.23,10.98-7.66,21.35-16.09,29.53   c-7,6.8-15.47,9.62-25.08,9.63c-29.64,0.02-59.27,0.14-88.91,0.13c-49.44-0.01-98.88-0.09-148.32-0.1   C171.76,325.96,169.86,326.34,167.48,326.6z M290.11,199.41c-32.5,0.21-59.17,14.2-82.07,36.44c-2.28,2.22-3.72,6.13-4.01,9.4   c-0.57,6.35,2.62,11.44,8.42,14.06c5.72,2.59,11.34,1.67,16.34-2.46c5.78-4.77,11.32-9.96,17.59-14   c24.17-15.58,49.54-18.39,76.03-6c10.68,4.99,19.76,12.17,28.41,20.06c6.25,5.7,15.16,5.42,20.77-0.21   c5.78-5.8,6.18-14.76,0.09-20.68C349.03,214.02,322.7,199.98,290.11,199.41z M330.16,162.48c0.06,11.68,9.76,21.39,21.37,21.39   c11.72,0,21.86-10.16,21.69-21.76c-0.16-11.52-10.11-21.41-21.59-21.45C339.92,140.61,330.1,150.59,330.16,162.48z M249.36,162.48   c0.04-11.81-9.92-21.88-21.58-21.82c-11.5,0.06-21.47,9.97-21.58,21.45c-0.11,11.66,9.92,21.73,21.68,21.76   C239.41,183.89,249.32,174.02,249.36,162.48z"></path>' +
                    '<path d="M345.73,471.92c0.02-22.05,17.72-39.48,39.97-39.36c22.03,0.12,39.54,17.93,39.4,40.07   c-0.15,21.85-17.75,39.33-39.63,39.37C363.05,512.04,345.7,494.54,345.73,471.92z"></path>' +
                    '<path d="M266.1,472.44c-0.05,22.28-17.49,39.6-39.77,39.52c-22.21-0.08-39.66-17.69-39.48-39.86c0.18-22.4,17.5-39.6,39.81-39.53   C248.93,432.63,266.16,450.05,266.1,472.44z"></path>' +
                    '</g></svg><h4 class="wla-outlet-name-md mb-2 mt-3 font-weight-bold" style="font-size: 22px;">Your Cart is Empty</h4>';
                    if(categoryId == 4){
                        c += '<p class="mb-0">Add Service Now!</p>';
                    }else{
                        c += '<p class="mb-0">We Know Your Food Cravings. Add Your Favorite Meal Now!</p>';
                    }
                //   $('.cartDiv').hide();
                if (addressServicable == 0) {
                    $('#emptyCartDiv').hide();
                } else {
                    $('#emptyCartDiv').show();
                }

                $('#cartBTN').attr('style', 'display:none !important')
                $('.price-checkout').attr("style", "display: none !important");
                $('.cart-count-add').show();
                $('.quantity-btn').hide();
                //   $('#cartBTN').hide();
                // $('#emptyCart').show();
                // $('#emptyCart').html(c);
                $('#showViewCart').hide();
            }

            var p = "";

            if (promoCodes && promoCodes != null && promoCodes != '' && promoCodes != 'null' && promoCodes.length > 0) {
                $('.coupon-slider').html('');
                $('.coupon-slider-text').show();
                for (var i = 0; i < promoCodes.length; i++) {
                    p += '<div class="col-8 col-md-4 promoBody">' +
                        '<div class="promoTitle"><img src="' + origin + '/assets/wla_new/img/promo.png" alt="' + promoCodes[i]['code'] + '"/> <span>' + promoCodes[i]['code'] +
                        '</span></div><div class="promoDesc">' + promoCodes[i]['title'] + '</div></div>';
                }
                $('.coupon-slider').html(p);


            } else {
                $('.coupon-slider').hide();
                $('.coupon-slider-text').hide();
            }
            $('#cartItemCount').html(orderDetails['totalQty']);
            $('body .search-icon-dv > span').text(orderDetails['totalQty']);
            $('#cartAmountCount').html(' ' + orderDetails['totalQty'] + ' ' + (orderDetails['totalQty'] == 1 ? 'item' : 'items'));

            // console.log(c);
            orderId = orderDetails['orderId'];
            $('#cartDisplay').html('');
            $('#cartDisplay').html(c);
            $('#customisable-item-modal').modal('hide');
            $('.subTotalSpan').html('');
            $('.subTotalSpan').html(currency + ' ' + parseFloat(orderDetails['subTotal']).toFixed(2));
            if (orderDetails['subTotal'] > 0 && size.length > 0) {
                $('.price-checkout').attr("style", "display: block !important")
            } else {
                $('.price-checkout').attr("style", "display: none !important")
            }
            $('#packing_charge').html('');
            $('#packing_charge').html(orderDetails['packaging_charges']);
            $('#gst').html('');
            $('#gst').html(orderDetails['taxes']);
            if (size.length > 0) {
                // console.log(orderDetails['totalAmt']);
                $('.totalSpan').html('');
                $('.totalSpan').html(currency + ' ' + parseFloat(orderDetails['totalAmt']).toFixed(2));} else {
                $('.totalSpan').html('');
                $('.totalSpan').html(currency + ' 0');
            }

            $('#itemSpan').html('');
            $('#itemSpan').html('<span class="fa-stack" data-count="' + orderDetails['totalQty'] + '"></span>');
            $('#amountTotal').html('');
            $('#amountTotal').html(currency + ' ' + Math.round(orderDetails['totalAmt']));
            //  amountTotal['totalAmt']
            $('.spinner').hide();

            if (deliveryActive != 1 && pickupActive != 1 && dineActive != 1 && incarActive != 1) {
                $('#cartBTN').addClass('disabled');
                $('.price-checkout').addClass('disabled');
            }else {
                $('#cartBTN').removeClass('disabled');
                $('.price-checkout').removeClass('disabled');
            }
            $('#cartItemCount').addClass('rotate-x');
            // $(".rotate-x").removeClass(600);
            setTimeout(function() {
                $('#cartItemCount').removeClass('rotate-x')
            }, 600);

            if (outlet_open != 1) {
                $('.cart-new-btn').addClass('d-none');
                $('.price-checkout').addClass('disabled');
                $('.price_mobile').addClass('disabled');
                $('.order-type').addClass('disabled');
                $('.available-next').removeClass('d-none');
            } else {
                $('.cart-new-btn').removeClass('d-none');
                $('.price-checkout').removeClass('disabled');
                $('.price_mobile').removeClass('disabled');
                $('.order-type').removeClass('disabled');
                $('.available-next').addClass('d-none');
            }
            $('#upbar' + barid).hide();
                $('#feabar' + barid).hide();
                $('#bar' + barid).hide();
                $('.cart-new-btn').removeClass('not-active-all');
            }else{
                $('#upbar' + barid).hide();
                $('#feabar' + barid).hide();
                $('#bar' + barid).hide();
                $('.cart-new-btn').removeClass('not-active-all');
            }
    }

    });
    $('body #single-item-modal').modal('hide');
    $('.spinner').hide();
}


function items_already_added(resp) {
    var res = '';
    var c = "";

    if (Object.keys(resp).length > 0) {
        Object.values(resp).forEach((e, index) => {
            // let KOTNO = Object.keys(resp)[index];

            var res = e;
            for (var i = 0; i < res.length > 0; i++) {

                c += '<div class="cart-items-outer"><span style="margin-left: -5px; display: inline-block; border: 1px solid #eee; color: var(--main-bg-color); padding: 0px 10px; margin-bottom: 10px; font-size: 11px; font-weight: 700; border-radius: 5px; background-color: #fff;">Ordered</span><div class="row">';
                if(outlet_open != 1){
                    c += '<div class="col-12 cart-lft-btn"><div>';
                }else{
                    c += '<div class="col-8 cart-lft-btn"><div>';
                }
                if (res[i]['vegnonvegboth'] == 'veg') {
                    c += '<div class="veg-flag">';
                    c += '<span></span>';
                    c += '</div>';
                } else if (res[i]['vegnonvegboth'] == 'non-veg') {
                    c += '<div class="non-vegflag">';
                    c += '<span></span>';
                    c += '</div>';
                }

                c += '</div>';
                if (res[i]['parentName'] != null) {
                    c += '<div><p class="item-small-hd">' + res[i]['parentName'] + '-' + res[i]['itemName'] + '</p>';
                } else {
                    c += '<div><p class="item-small-hd">' + res[i]['itemName'] + '</p>';
                }

                if ((!res[i]['dynamic_combo'] || res[i]['dynamic_combo'] != 1) && (res[i].hasOwnProperty('viewType') && res[i]['viewType'] !=3)) {
                    c += '<p class="item-price"><span>' + res[i]['qty'] + ' x ' + currency + ' ' + Math.round(res[i]['itemPrice']) + '</span> <b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                }
                if(res[i]['viewType'] ==3){
                    c += '<p class="item-price"><b style="display: inline-block; font-weight: 500;">' + currency + ' ' + Math.round(res[i]['subTotal']) + '</b></p>';
                }

                c += '</div>';
                // c += '<span class="badge border border-danger text-danger" style="height:max-content;">Ordered</span>';
                c += '</div>';
                if(outlet_open != 1){
                    c += '<div class="col-12 cart-rgt-btn">';
                }else{
                    c += '<div class="col-4 cart-rgt-btn">';
                }
                c += '<div class="input-group quantity-btn">';
                // c += '<div class="input-group-prepend" id="qty_minus">';
                // c += '<button class="qty-decrease" onclick="update_item(1,' + res[i]['orderItemId'] + ')"><i class="las la-minus"></i></button>';
                // c += '</div>';
                // c += '<input type="hidden" id="act_sel_8360" value="update" class="1">';
                c += '<input type="text" class="form-control qtyVal p-0" id="" readonly="" value="' + res[i]['qty'] + '">';
                // c += '<div class="input-group-prepend" id="qty_plus">';
                // c += '<button class="qty-increase" onclick="update_item(2,' + res[i]['orderItemId'] + ')"><i class="las la-plus"></i></button>';
                // c += '</div>';
                c += '</div>';
                c += '</div>';
                c += '</div>';
                if (res[i]['subItems']?.length > 0) {
                    for (var j = 0; j < res[i]['subItems'].length; j++) {
                        c += '<div class="additional">';
                        c += '<div class="row">';
                        c += '<div class="col-8 cart-lft-btn">';
                        c += '<div>';
                        if (res[i]['subItems'][j]['vegnonvegboth'] == 'veg') {
                            c += '<div class="veg-flag">';
                            c += '<span></span>';
                            c += '</div>';
                        } else if (res[i]['subItems'][j]['vegnonvegboth'] == 'non-veg') {
                            c += '<div class="non-vegflag">';
                            c += '<span></span>';
                            c += '</div>';
                        }
                        c += '</div>';
                        c += '<div>';
                        c += '<p class="item-small-hd">' + res[i]['subItems'][j]['sectionName'] + ':</b> ' + res[i]['subItems'][j]['itemName'] + '</p>';
                        c += '</div>';
                        c += '</div>';
                        c += '<div class="col-4 cart-rgt-btn">';
                        c += '<p class="item-price">' + currency + ' ' + Math.round(res[i]['subItems'][j]['subTotal']) + '</p>';
                        c += '</div>';
                        c += '</div></div>';
                    }
                }
                c += '</div>';

            }
        });
    }

    $('#AlreadycartDisplay').show('');
    $('#AlreadycartDisplay').html('');
    $('#AlreadycartDisplay').html(c);

    if (outlet_open != 1) {
        $('.cart-new-btn').addClass('d-none');
        $('.price-checkout').addClass('disabled');
        $('.price_mobile').addClass('disabled');
        $('.order-type').addClass('disabled');
        $('.available-next').removeClass('d-none');
    } else {
        $('.cart-new-btn').removeClass('d-none');
        $('.price-checkout').removeClass('disabled');
        $('.price_mobile').removeClass('disabled');
        $('.order-type').removeClass('disabled');
        $('.available-next').addClass('d-none');
    }
}

function scrollToSection(sectionId) {
    $('#search-modal').modal('hide');
    sectionId = "#" + sectionId;
    var scrollSec = $(sectionId).offset();
    if (scrollSec) {
        $('html, body').animate({
            scrollTop: $(sectionId).offset().top - 100
        }, 500);
    }
    if (screen.width < 600) {
        $('#sectionListModal').modal('hide');
        $('.left-panel').css("height", "0");
    }

}

function scrollToItems(itemId) {
    itemId = "#item-" + itemId;
    var selectedElement = $(itemId); // Select the element
    var sectionTop = selectedElement.offset();
    if (sectionTop) {
        $('html, body').animate({
            scrollTop: sectionTop.top - 100
        }, 500);
    }

    if(item_id && sections_id){
        var url = origin + '/petPooja/getItemDetails?itemId=' + item_id + '&sectionId=' + sections_id + '&businessId=' + businessId;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(result) {
                var varia = result.rows.menu[0];
                if (varia['variants'].length > 0 || varia['templates'].length > 0) {
                    if(isCloud == 1){
                        setTimeout(function() {
                            showVariant(varia['id'], varia['sectionId']) ;
                        }, 1800);
                    }else if(varia['viewType'] == 3){
                        open_wizard(varia['id'],varia['sectionId'],varia['parentId'],varia['viewType']);
                    }else if(varia['viewType'] == 2){
                        open_combo(varia['id'],varia['sectionId'],varia['parentId'],varia['viewType']);
                    }else{
                        setTimeout(function() {
                            showVariant(varia['id'], varia['sectionId']) ;
                        }, 1200);
                    }
                    
                }else{
                    if(isCloud == 1){
                        setTimeout(function() {
                            openVariantModal(item_id,sections_id);
                        }, 1800);
                    }else if(varia['viewType'] == 3){
                        open_wizard(varia['id'],varia['sectionId'],varia['parentId'],varia['viewType']);
                    }else if(varia['viewType'] == 2){
                        open_combo(varia['id'],varia['sectionId'],varia['parentId'],varia['viewType']);
                    }else{
                        setTimeout(function() {
                            openVariantModal(item_id,sections_id);
                        }, 1200);
                    }
                }
            }
        });
        
    }
}


function update_item(action, item, id, barId,customise) {

    if (action == '1') {
        add_to_cart('delete', item, id,barId,customise);
    } else {
        add_to_cart('update', item, id,barId,customise);
    }
    $('#bar' + barId).show();
    setTimeout(function() {
        $('#bar' + barId).fadeOut('fast');
    }, 1000);
    $('#feabar' + barId).show();
    setTimeout(function() {
        $('#feabar' + barId).fadeOut('fast');
    }, 1000);
    $('#upbar' + barId).show();
    $('.cart-new-btn').addClass('not-active-all');
    setTimeout(function() {
        $('#upbar' + barId).fadeOut('fast');
        $('.cart-new-btn').removeClass('not-active-all');
    }, 1000);
    $('#deleteModal').modal('hide');
}


function getTopping(variantId) {

    var index = menu['variants'].findIndex(e => e.id == variantId);
    var itemName = menu['variants'][index]['itemName'];
    var sp = menu['variants'][index]['sp'];
    var parentName = menu['itemName'];
    item = {};
    item['itemId'] = variantId;
    item['parentItemId'] = 0;
    item['qty'] = 1;
    item['itemName'] = itemName;
    item['pId'] = menu['variants'][index]['parentId'];
    item['sp'] = sp;
    item['itemPrice'] = sp;
    item['parentName'] = parentName;
    item['subItems'] = [];
    item['sectionName'] = menu['sectionName'];



    var index = menu['variants'].findIndex(e => e.id == variantId);
    var variantType = '';

    if (menu['variants'][index]['templateId'] != 0) {
        itemTemplates = menu['variants'][index]['templates'];
        var temps = menu['variants'][index]['templates'];
        //   variantType+='<div id="topping">';
        for (var k = 0; k < temps.length; k++) {

            var temp = templates.filter(e => e.templateId == temps[k]['templateId']);

            if (temp.length > 0) {

                if (temp[0]['template'].length > 0) {
                    var minQty = temps[k]['minQty'];
                    var maxQty = temps[k]['maxQty'];
                    variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                    var quantity_desc = '';
                    if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                        quantity_desc += 'Please select any ' + maxQty + '  option';
                    } else if (minQty == 0 && maxQty != 0) {
                        quantity_desc += 'You can choose up to ' + maxQty + ' option(s)';
                    } else if (minQty != 0 && maxQty != 0) {
                        quantity_desc += 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                    } else if (minQty != 0 && maxQty == 0) {
                        quantity_desc += 'Select a minimum of ' + minQty;
                    }
                    if (quantity_desc != null && quantity_desc != '') {
                        variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                    } else {
                        variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                    }
                    if(item_variant_template==2){
                       
                        variantType += `<div class="modal-new-variants">`; // Start the modal-new-variants wrapper
                        var imageUrl;
                        for (var t = 0; t < temp[0]['template'].length; t++) {
                            if(temp[0]['template'][t]['image']== null){
                                imageUrl=bLogo;
                            }else{
                                imageUrl = "https://cdn.uengage.io/uploads/" + parentId + "/" + temp[0]['template'][t]['image'];

                            }
                        
                            if (minQty == 1 && maxQty == 1) {
                                if (t == 0) {
                                    variantType += `
                                        <div class="radio-button-one active" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                            <input checked="checked" data-price="${Math.round(temp[0]['template'][t]['sp'])}" class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                            <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                <span class="radio-text">
                                                    <span class="radio-image">
                                                        <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                    </span>
                                                    <span class="radio-title">
                                                        <div>${temp[0]['template'][t]['itemName']}</div>
                                                    </span>
                                                    <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                </span>
                                            </label>
                                        </div>`;
                                    addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);
                                } else {
                                    variantType += `
                                        <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                            <input data-price="${Math.round(temp[0]['template'][t]['sp'])}" class="topping-radio" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                id="${temp[0]['template'][t]['id']}" name="${temps[k]['templateId']}" value="${temp[0]['template'][t]['id']}" type="radio">
                                            <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                <span class="radio-text">
                                                    <span class="radio-image">
                                                        <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                    </span>
                                                    <span class="radio-title">
                                                        <div>${temp[0]['template'][t]['itemName']}</div>
                                                    </span>
                                                    <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                </span>
                                            </label>
                                        </div>`;
                                }
                            } else {
                                if (temp[0]['template'][t]['items'].length == 0) {
                                    variantType += `
                                        <div class="radio-button-one" id="topping-${temp[0]['template'][t]['sectionId']}-${temp[0]['template'][t]['id']}">
                                            <input class="styled-checkbox" data-price="${Math.round(temp[0]['template'][t]['sp'])}" onclick="addTopping(${variantId}, ${temp[0]['template'][t]['id']}, ${temp[0]['template'][t]['sectionId']})" 
                                                id="${temp[0]['template'][t]['id']}" name="${temp[0]['template'][t]['id']}" value="${temp[0]['template'][t]['id']}" type="checkbox">
                                            <label class="btn btn-default" for="${temp[0]['template'][t]['id']}">
                                                <span class="radio-text">
                                                    <span class="radio-image">
                                                        <img src="${imageUrl}" alt="${temp[0]['template'][t]['itemName']}" width="40" height="40">
                                                    </span>
                                                    <span class="radio-title">
                                                       
                                                        <div>${temp[0]['template'][t]['itemName']}</div>
                                                    </span>
                                                    <span class="radio-price">${currency} ${Math.round(temp[0]['template'][t]['sp'])}</span>
                                                </span>
                                            </label>
                                        </div>`;
                                } else {

                                    variantType += `
                                        <div class="col-12 p-1">
                                            <span style="color: #000; border-bottom: 1.5px solid #000; padding-bottom: 4px;">${temp[0]['template'][t]['itemName']}</span>
                                        </div>`;
                                    for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                        var tempDetail = temp[0]['template'][t]['items'][k];
                                        variantType += `
                                            <div class="radio-button-one" id="topping-${tempDetail['sectionId']}-${tempDetail['id']}">
                                                <input class="styled-checkbox" data-price="${Math.round(temp[0]['template'][t]['sp'])}" onclick="addTopping(${variantId}, ${tempDetail['id']}, ${tempDetail['sectionId']})" 
                                                    id="${tempDetail['id']}" name="${tempDetail['id']}" value="${tempDetail['id']}" type="checkbox">
                                                <label class="btn btn-default" for="${tempDetail['id']}">
                                                    <span class="radio-text">
                                                        <span class="radio-image">
                                                            <img src="${tempDetail['imageUrl']}" alt="${tempDetail['itemName']}" width="40" height="40">
                                                        </span>
                                                        <span class="radio-title">
                                                          
                                                            <div>${tempDetail['itemName']}</div>
                                                        </span>
                                                        <span class="radio-price">${currency} ${Math.round(tempDetail['sp'])}</span>
                                                    </span>
                                                </label>
                                            </div>`;
                                    }
                                }
                            }
                        }
                        
                        variantType += '</div></div></div>';
                        
                    }else{
                    for (var t = 0; t < temp[0]['template'].length; t++) {

                        if (minQty == 1 && maxQty == 1) {
                            if (t == 0) {
                                variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id']+'">';
                                variantType += '<li><div class="radio-outer">';
                                variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio"  checked="checked" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                variantType += '<div class="item-discription-main">';
                                variantType += '<span class="item-name"><div>';
                                if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                }

                                variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                variantType += '</div></label> </div></li></ul>';
                                addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                            } else {

                                variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id']+'">';
                                variantType += '<li><div class="radio-outer">';
                                variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                variantType += '<div class="item-discription-main">';
                                variantType += '<span class="item-name"><div>';
                                if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                }
                                variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                variantType += '</div></label> </div></li></ul>';
                            }
                        } else {
                            if (temp[0]['template'][t]['items'].length == 0) {

                                variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id']+'">';
                                variantType += '<li><div class="checkbox-outer">';
                                variantType += '<input class="styled-checkbox" data-price="'+Math.round(temp[0]['template'][t]['sp'])+'" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                variantType += '<div class="item-discription-main">';
                                variantType += '<span class="item-name"><div>';
                                if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                    variantType += '<div class="veg-flag"> <span></span> </div>';
                                } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                    variantType += '<div class="non-vegflag"> <span></span> </div>';
                                }
                                // variantType+='<div class="veg-flag"> <span></span></div>';
                                variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                variantType += '</div></label> </div></li></ul>';



                            } else {
                                variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                    var tempDetail = temp[0]['template'][t]['items'][k];
                                    variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+ tempDetail['id']+'">';
                                    variantType += '<li><div class="checkbox-outer">';
                                    variantType += '<input class="styled-checkbox" data-price="'+Math.round(temp[0]['template'][t]['sp'])+'" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                    variantType += '<label for="' + tempDetail['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (tempDetail['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }
                                    // variantType+='<div class="veg-flag"> <span></span></div>';
                                    variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';
                                }

                            }

                        }
                    }
                    variantType += '</div></div>';
                }
            }
            }


        }
    }
    $('#topping').html('');
    $('#topping').html(variantType);
}


function checkOut() {
    if (addressServicable == 0) {
        return false;
    }

    if (!localStorage.getItem('userdata') || localStorage.getItem('userdata') == '') {
        // $('#loginModal').modal('show');
        openLogin();
        // $('.spinner').hide();
        //  $('#menu-total').hide();
        //  $('#loginBTN').show();
        return false;
    }

    const find_active = document.querySelectorAll('.order-type a.active');
    // if (find_active.length == 0) {
    //     $('#promonotapplied').modal('show');
    //     $('#promonotmsg').html("Kindly please select options");
    //     errormodalhide();
    //     return false;
    // }

    if (orderType == '' || orderType == null || orderType == 'NULL' || orderType == 'null') {
        if(deliveryOnlineActive == 1 && deliveryActive == 1){
            orderType = 1;
        }else if (pickupActive == 1) {
            orderType = 2;
        } else if (dineActive == 1) {
            orderType = 3;
        } else if (incarActive == 1) {
            orderType = 4;
        } else {
            alert("Outlet is Currently Not Serviceable")
            return false;
        }
    }else{
        if (deliveryActive != 1 && pickupActive != 1 && dineActive != 1 && incarActive != 1) {
            alert("Outlet is Currently Not Serviceable")
            return false;
        }
    }
    localStorage.setItem('orderType', orderType);

    // if(loc==''){
    //    orderType=1;
    // }
    if (localStorage.getItem('orderType') == undefined || localStorage.getItem('orderType') == null ||
        localStorage.getItem('orderType') == 'null' || localStorage.getItem('orderType') == 'NULL') {
        window.location.href = "/checkout/" + businessId + "/1";
    } else {
        let tabId = localStorage.getItem('tableId');
        if (localStorage.getItem('orderType') == 3 && tableId > 0) {
            window.location.href = "/checkout/" + businessId + "/" + localStorage.getItem('orderType') + '/' + tableId;
        } else {
            window.location.href = "/checkout/" + businessId + "/" + localStorage.getItem('orderType');
        }
    }

}

function setOrderType(id, linkBtn,element) {
    
    if (id == 1 && (!element.classList || !element.classList.contains('active'))) {
        if ((localStorage.getItem('orderType') != 1) && onlineOrdersDelivery != 0 && modalSwitch != 0) {
            $('#deliverymodal').modal('show');
        }else{
            orderType = id;
            $('.order-type a').removeClass('active');
            $('#' + linkBtn).addClass('active');
            localStorage.setItem('orderType', id);
            $('input[name="optradio"]:checked').val();
            $('#chk_del').attr("style", "display: inline-block");
            modalSwitch = 1;
        }
    }else if (id == 2 && (!element.classList || !element.classList.contains('active'))) {
        if ((localStorage.getItem('orderType') != 2) && modalSwitch != 0) {
            $('#pickuplocality').html('');
            $('#pickcity').html('');
            $('#pickuplocality').html(locality_outlet);
            $('#pickcity').html(city_outlet);
            $('#pickproceedmodal').modal('show');
        } else {
            orderType = id;
            $('.order-type a').removeClass('active');
            $('#' + linkBtn).addClass('active');
            localStorage.setItem('orderType', id);
            $('input[name="optradio"]:checked').val();
            $('#chk_pickup').attr("style", "display: inline-block");
            modalSwitch = 1;
        }
    }else if (id == 3 && (!element.classList || !element.classList.contains('active'))) {
        if ((localStorage.getItem('orderType') != 3 && modalSwitch != 0)) {
            $('#dinemodal').modal('show');
        }else{
            orderType = id;
            $('.order-type a').removeClass('active');
            $('#' + linkBtn).addClass('active');
            localStorage.setItem('orderType', id);
            $('input[name="optradio"]:checked').val();
            $('#chk_dine').attr("style", "display: inline-block");
            modalSwitch = 1;
            $('#dinemodal').modal('hide');
        }
    }else if (id == 4 && (!element.classList || !element.classList.contains('active'))) {
        if ((localStorage.getItem('orderType') != 4 && modalSwitch != 0)) {
            $('#incarmodal').modal('show');
        }else{
            orderType = id;
            $('.order-type a').removeClass('active');
            $('#' + linkBtn).addClass('active');
            localStorage.setItem('orderType', id);
            $('input[name="optradio"]:checked').val();
            $('#chk_incar').attr("style", "display: inline-block");
            modalSwitch = 1;
        }
    }
    
}

function searchItems() {
    var searchString = $('#searchText').val().toLowerCase();
    var filterVeg = $('#filterVeg').is(':checked');
    var filterNonVeg = $('#filterNonVeg').is(':checked');
    var searchItemsArr = [];

    $('.spinner').show();

    if (isCloud == 1) {
        staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '_' + brandId + '.json?nocache=' + (new Date()).getTime();
    }else{
        staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '.json?nocache=' + (new Date()).getTime();
    }
    
    
    $.getJSON(staticUrl, function(data) {

        if(searchString.length > 0 && data.rows.business.pureVegetarian != 1){
            $('#searchVegNonVeg').show();
        }else{
            $('#searchVegNonVeg').hide();
        }
    });

    if (searchString.length <= 2) {
        $('#featuredProductsSearch').show();
        $('#productSearchDiv').hide();
    } else {
        $('#featuredProductsSearch').hide();
        $('#productSearchDiv').show();

        menuSearch.forEach(e => {
            e.items.forEach(f => {
                if (f.variants !== undefined && f.variants.length > 0) {
                    f.variants.forEach(x => {
                        if (x.itemName && x.itemName.toLowerCase().indexOf(searchString) != -1 && 
                            (x.sp != 0 || (x.variants && x.variants.length > 0))) {
                            // Check filters
                            if ((filterVeg && x.vegNonvegBoth === 'veg') || (filterNonVeg && x.vegNonvegBoth === 'non-veg') || (!filterVeg && !filterNonVeg)) {
                                searchItemsArr.push(x);
                            }
                        }
                    });
                } else {
                    if (f.itemName.toLowerCase().indexOf(searchString) != -1 && f.sp != 0) {
                        // Check filters
                        if ((filterVeg && f.vegNonvegBoth === 'veg') || (filterNonVeg && f.vegNonvegBoth === 'non-veg') || (!filterVeg && !filterNonVeg)) {
                            searchItemsArr.push(f);
                        }
                    }
                }
            });
        });
        

        var itemList = "";
        if (searchItemsArr.length > 0) {
            for (var z = 0; z < searchItemsArr.length; z++) {
                var searchdisc = searchItemsArr[z];
                
                if(outlet_open != 1){
                itemList += '<div class="item-card-design-new-new position-relative outlet-closed">';
                }else{
                    itemList += '<div class="item-card-design-new-new position-relative">';
                }


                if (searchdisc['variant_count'] > 0) {

                    if (searchdisc['variants'][0]['templateId'] != 0 && searchdisc['variants'][0]['templateId'] != null) {
                        itemList += '<div class="item-card-design-new-start-outer mb-3 customization-avail">';
                    }
                    else {
                        itemList += '<div class="item-card-design-new-start-outer mb-3">';
                    }
                } else {
                    if (searchdisc['templateId'] != 0 && searchdisc['templateId'] != null) {
                        itemList += '<div class="item-card-design-new-start-outer mb-3 customization-avail">';
                    }
                    else {
                        itemList += '<div class="item-card-design-new-start-outer mb-3">';
                    }
                }

                itemList += '<div class="item-card-design-new-start">';
                
                itemList += '<div class="item-card-design-detail-new">';
                itemList += '<div>';
                
                itemList += '<div class="d-flex align-items-center mb-2">';
                
                if (searchdisc['vegNonvegBoth'] == 'veg') {
                    itemList += '<div class="veg-flag" style="margin-right:3px;"><span></span></div>';
                }else if (searchdisc['vegNonvegBoth'] == 'non-veg') {
                    itemList += '<div class="non-vegflag" style="margin-right:3px;"><span></span></div>';
                }
                if (searchdisc['recommended'] == 1) {
                    itemList += '<span class="tag-bestseller"><span>Bestseller</span></span>';
                }
                if (searchdisc['newItem'] == 1) {
                    itemList += '<span class="tag-new"><span>New</span></span>';
                }
                if(searchdisc?.custom_tags && searchdisc['custom_tags'] != null)
                {
                    var tagsArray = searchdisc['custom_tags'].split(',');
                    tagsArray.forEach(element => {
                            itemList += '<span class="tag-limited-edition">'+ element +'</span>';
                    });
                        
                }
                itemList += '</div>';
                if (searchdisc['viewType'] == 3 || searchdisc['viewType'] == 2) {
                    itemList += '<div class="item-heading" onclick="open_wizard(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ',' + searchdisc['parentId'] + ',' + searchdisc['viewType'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                } else {
                    if ((searchdisc['templateId'] != null && searchdisc['templateId'] != '') || (searchdisc['variantsAvailable'] != null && searchdisc['variantsAvailable'] != '')) {
                        itemList += '<div class="item-heading" onclick="showVariant(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                    } else {
                        itemList += '<div class="item-heading" onclick="openVariantModal(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                    }
                }

                itemList += '<div class="item-tt-outer">';
                itemList += '<h4 class="item-title">' + searchdisc['itemName'] + '</h4>';
                itemList += '</div>';
                itemList += '</div>';

                if (searchdisc['viewType'] == 3 || searchdisc['viewType'] == 2) {
                    itemList += '<p class="pric e-p" onclick="open_wizard(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ',' + searchdisc['parentId'] + ',' + searchdisc['viewType'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                } else {
                    if ((searchdisc['templateId'] != null && searchdisc['templateId'] != '') || (searchdisc['variantsAvailable'] != null && searchdisc['variantsAvailable'] != '')) {
                        itemList += '<p class="pric e-p" onclick="showVariant(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                    } else {
                        itemList += '<p class="pric e-p" onclick="openVariantModal(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                    }
                }

                if (searchdisc['variantsAvailable'] > 0) {
                    itemList += currency + '' + Math.round(Math.min.apply(null, searchdisc['variants'].map(item => item.sp)));
                } else {
                    if (Math.round(searchdisc['sp']) != Math.round(searchdisc['mrp']) && Math.round(searchdisc['mrp']) != 0) {
                        itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(searchdisc['mrp']) + '</s></small>' + currency + '' + Math.round(searchdisc['sp']);
                    } else {
                        itemList += currency + '' + Math.round(searchdisc['sp']);
                    }
                }

                itemList +='</p>';
                /*if (searchdisc['variant_count'] > 0) {

                    if (searchdisc['variants'][0]['templateId'] != 0 && searchdisc['variants'][0]['templateId'] != null) {
                        itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
                    }
                } else {
                    if (searchdisc['templateId'] != 0 && searchdisc['templateId'] != null) {
                        itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
                    }
                }*/
                if(searchdisc['description'] != null && searchdisc['description'] != 'null' && searchdisc['description'] != ''){
                    itemList += '<p class="heading-customize">' + searchdisc['description'] + '</p>';
                }
                itemList += '</div>';
                itemList += '</div>';
                if (searchdisc['image'] != null && searchdisc['image'] != '') {
                    itemList += '<div class="item-card-placeholder-detail-new position-relative item-with-img">';
                }else{
                    itemList += '<div class="item-card-placeholder-detail-new position-relative item-without-img-detail">';
                }
                itemList += '<div class="item-card-placeholder-nw-outer position-relative">';
                
                    
                    if (searchdisc['image'] != null && searchdisc['image'] != '') {
                        if (searchdisc['viewType'] == 3 || searchdisc['viewType'] == 2) {
                            itemList += '<div class="item-card-placeholder-nw" onclick="open_wizard(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ',' + searchdisc['parentId'] + ',' + searchdisc['viewType'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                        } else {
                            if ((searchdisc['templateId'] != null && searchdisc['templateId'] != '') || (searchdisc['variantsAvailable'] != null && searchdisc['variantsAvailable'] != '')) {
                                itemList += '<div class="item-card-placeholder-nw" onclick="showVariant(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                            } else {
                                itemList += '<div class="item-card-placeholder-nw" onclick="openVariantModal(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
                            }
                        }

                        itemList += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + searchdisc['image'] + '" alt="' + searchdisc['itemName'] + '" width="84" height="82">';
                        itemList += '</div>';
                    }
                    
                if(outlet_open ==1){   
                    itemList += '<div class="cart-new-btn">';
                    if (searchdisc['viewType'] == 3 || searchdisc['viewType'] == 2) {
                        itemList += '<div class="cart-count-add cart-btn" onclick="open_wizard(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ',' + searchdisc['parentId'] + ',' + searchdisc['viewType'] + ');" data-dismiss="modal">Add <i class="las la-plus"></i></div>';
                    } else {
                        itemList += '<div class="cart-count-add cart-btn" onclick="showVariant(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')" id="btn-' + searchdisc['id'] + '" data-dismiss="modal">Add <i class="las la-plus"></i></div>';
                        itemList += '<div class="quantity-btn"  id="div-' + searchdisc['id'] + '"style="display:none !Important;" >';
                        itemList +='<div class="_29Y5Z _20vNm" id="qty_minus" onclick="deleteFromDiv(' + searchdisc['id'] + ')"></div>';
                        itemList += '<input type="hidden"  value="update" class="1"><input type="text"  id="qty-input-' + searchdisc['id'] + '"class="_2zAXs _2quy-" readonly="" value="1">';
                        itemList += '<div class="_1ds9T _2WdfZ" id="qty_plus" onclick="showVariant(' + searchdisc['id'] + ',' + searchdisc['sectionId'] + ')">+</div></div>';
                        
                    }
                }
                    itemList += '</div>';
                    itemList +='</div></div></div></div>';
                    itemList += '<div class="available-next d-none" style="text-align: center; border: 1px dashed #DA251C; border-radius: 10px; background: #fae3e3; color: #DA251C; position: absolute; width: 95%; bottom: 0; left: 50%; transform: translate(-50%, -50%);">Next available at '+ end_hour +'</div>';
                    itemList += '</div>';
                    itemList += '</div>';
            }
        } else {
            itemList += '<div class="col-12 text-center"><span style="color:#000; font-size: 16px;">No Result Found For <b>"' + searchString + '"</b></span></div>';
        }


        $('#productSearch').html("");
        $('#productSearch').html(itemList);

        $('.lmask').hide();
        $("button.addItem").click(function(e) {
            // Do something
            e.stopPropagation();
        });
        $("button.addItem").click(function(e) {
            // Do something
            e.stopPropagation();
        });
        $("div.input-group").click(function(e) {
            // Do something
            e.stopPropagation();
        });
        if (addressServicable == 0) {
            $('.btn').prop('disabled', true);
            $('#cartBTN').prop('disabled', false);
            $('.btn-left-menu').prop('disabled', false);
            $('.noDisable').prop('disabled', false);
            $('#cartBTN').attr("style", "display: none !important");
            $('.price-checkout').attr("style", "display: none !important");
            $('.errorDivCls').attr("style", "display: block !important;background: #ececec !important;border: 1px solid var(--main-bg-color) !important;color:var(--main-bg-color)");
        }
    }
    $('.spinner').hide();
}



function openSection() {
    $('#sectionListModal').modal('show');
}


function openVariantModal(id, sectionId) {
    if (typeof gtag === "function") {
        gtag('event', 'product_selected', {
            'event_category': 'Product Selected',
            'event_label': 'Product selected by user',  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    if (addressServicable == 0) {
        return false;
    }

    $('.spinner').show();
    var url = origin + '/petPooja/getItemDetails?itemId=' + id + '&sectionId=' + sectionId + '&businessId=' + businessId;
    var itemList = "";
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            var varia = result.rows.menu[0];
            var button = '' ;
            var image = ''; // Initialize the 'image' variable
// console.log(result);
            if (varia['image'] != null && varia['image'] != '') {
                image += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + varia['image'] + '" class="zoom" alt="' + varia['image'] + '" width="350" height="350">';
            } else {
                image += '<img src="' + bLogo + '" alt="Logo" style="filter: grayscale(0.9);" width="350" height="350">';
            }

            itemList += '</div><div class=" img-content"><div class="modal-inner-heading">';
            itemList += '<div class="d-flex justify-content-between sticky-single-itemss">';
            itemList += '<div class="d-flex align-items-center mb-2">';
            itemList += '<h5 class="modal-title-bg">' + varia['itemName'] + '</h5>';   
            document.getElementById('headerSingle').innerHTML ='';                  
            var htmlContent = '';

            // Check for veg/non-veg flag
            if (varia['vegNonvegBoth'] == 'veg') {
                htmlContent +=`
                                <div class="veg-flag"><span></span></div>
                            `;
            } else if (varia['vegNonvegBoth'] == 'non-veg') {
                htmlContent += `
                                <div class="non-vegflag"><span></span></div>
                            `;
            }
            
            // Check for Bestseller tag
            if (varia?.recommended && varia['recommended'] != 0) {
                htmlContent += ' <span class="tag-bestseller"><span>Bestseller</span></span>';
            }
            
            if(varia?.newItem && varia['newItem'] != 0 ){
                htmlContent += '<span class="tag-new"><span>New</span></span>';
            }
            // Append the content to the element with ID 'headerSingle'
            document.getElementById('headerSingle').innerHTML += htmlContent;



            if(varia?.custom_tags && varia['custom_tags'] != null)
                {
                    var tagsArray = varia['custom_tags'].split(',');
                    tagsArray.forEach(element => {
                        if (pId == 7175) {
                            itemList += '<span class="tag-limited-edition">'+ element +'</span>';
                        } else {
                            itemList += '<span class="tag-limited-edition">'+ element +'</span>';
                        }
                        
                    });
                    
                }

            
            itemList += '</div>';

            if(categoryId != 4){
                itemList += '<div>';
                itemList += '<span id="sharing_item">';
                itemList += '<svg fill=none height=28 viewBox="0 0 29 28"width=29 xmlns=http://www.w3.org/2000/svg><path d="M28.4259 13.5833C28.4259 20.9346 22.1314 26.9167 14.338 26.9167C6.54449 26.9167 0.25 20.9346 0.25 13.5833C0.25 6.2321 6.54449 0.25 14.338 0.25C22.1314 0.25 28.4259 6.2321 28.4259 13.5833Z"fill=white fill-opacity=0.8 stroke=#707070 stroke-width=0.5 /><path d="M17.6635 21.7336C17.0634 21.7336 16.5542 21.5238 16.1358 21.1042C15.718 20.6841 15.5092 20.1739 15.5092 19.5738C15.5092 19.4833 15.549 19.2548 15.6287 18.8883L9.11141 15.0189C8.91581 15.2447 8.67644 15.4219 8.39331 15.5505C8.11017 15.679 7.8062 15.7433 7.48141 15.7433C6.88616 15.7433 6.38026 15.5314 5.9637 15.1076C5.54715 14.6838 5.33887 14.1758 5.33887 13.5836C5.33887 12.9914 5.54715 12.4833 5.9637 12.0595C6.38026 11.6357 6.88616 11.4238 7.48141 11.4238C7.8056 11.4238 8.10957 11.4881 8.39331 11.6167C8.67705 11.7453 8.91642 11.9228 9.11141 12.1492L15.6296 8.29605C15.5873 8.17894 15.5569 8.06272 15.5381 7.94742C15.5188 7.8315 15.5092 7.71318 15.5092 7.59244C15.5092 6.99296 15.7196 6.48313 16.1403 6.06295C16.5611 5.64338 17.0718 5.43359 17.6725 5.43359C18.2732 5.43359 18.7827 5.64398 19.2011 6.06477C19.6195 6.48555 19.8284 6.99628 19.8278 7.59697C19.8272 8.19765 19.6174 8.70718 19.1984 9.12554C18.7794 9.54391 18.2693 9.75279 17.668 9.75219C17.3408 9.75219 17.0389 9.68518 16.7625 9.55115C16.486 9.41713 16.2505 9.23693 16.0561 9.01054L9.53702 12.88C9.57928 12.9971 9.60977 13.1136 9.62848 13.2295C9.6478 13.3448 9.65746 13.4629 9.65746 13.5836C9.65746 13.7043 9.6478 13.8224 9.62848 13.9377C9.60917 14.053 9.57898 14.1695 9.53793 14.2872L16.0561 18.1566C16.2511 17.9303 16.4866 17.7501 16.7625 17.616C17.0389 17.482 17.3408 17.415 17.668 17.415C18.2681 17.415 18.7782 17.6251 19.1984 18.0453C19.618 18.4667 19.8278 18.9777 19.8278 19.5784C19.8278 20.1791 19.6174 20.6886 19.1966 21.1069C18.7758 21.5253 18.2642 21.7342 17.6635 21.7336ZM17.668 20.828C18.0236 20.828 18.3215 20.7079 18.5618 20.4676C18.8021 20.2274 18.9222 19.9297 18.9222 19.5747C18.9222 19.2198 18.8021 18.9218 18.5618 18.681C18.3215 18.4401 18.0239 18.32 17.6689 18.3206C17.3139 18.3212 17.016 18.4413 16.7751 18.681C16.5343 18.9206 16.4141 19.2183 16.4147 19.5738C16.4153 19.9294 16.5355 20.2274 16.7751 20.4676C17.0148 20.7079 17.3118 20.828 17.668 20.828ZM7.48141 14.8369C7.84122 14.8369 8.14307 14.7167 8.38697 14.4765C8.63026 14.2362 8.75191 13.9386 8.75191 13.5836C8.75191 13.2286 8.63026 12.931 8.38697 12.6907C8.14367 12.4504 7.84182 12.3303 7.48141 12.3303C7.13066 12.3303 6.83696 12.4504 6.60031 12.6907C6.36365 12.931 6.24503 13.2286 6.24442 13.5836C6.24382 13.9386 6.36245 14.2365 6.60031 14.4774C6.83817 14.7183 7.13187 14.8381 7.48141 14.8369ZM17.6689 8.84663C18.0239 8.84663 18.3215 8.7265 18.5618 8.48622C18.8021 8.24595 18.9222 7.94802 18.9222 7.59244C18.9222 7.23686 18.8021 6.93923 18.5618 6.69956C18.3215 6.45989 18.0239 6.33975 17.6689 6.33915C17.3139 6.33855 17.016 6.45868 16.7751 6.69956C16.5343 6.94044 16.4141 7.23837 16.4147 7.59334C16.4153 7.94832 16.5355 8.24595 16.7751 8.48622C17.0148 8.7265 17.3127 8.84663 17.6689 8.84663Z"fill=black /></svg>';
                itemList += '</span>';
                itemList += '</div>';
            }
           
            itemList += '</div>';
            itemList+='<div class="single-item-start">';

           
            // if (varia['description'] != null && varia['description'] != '' && varia['description'] != 'null') {
            //     itemList += '<div class="modal-discription"><p>' + varia['description'] + '</p></div>';
            // }
            if (varia['description'] != '' && varia['description'] != null && varia['description'] != 'null') {
        var ellipsis = '<span class="expand_details" onclick="expand_description(' + varia['id'] + ',1)">...Read more</span>';
        var expand_less = '<span class="expand_details" onclick="collapse_description(' + varia['id'] + ',1)">...Read less</span>';
        var maxLength = 70;
        var text = $.trim(varia['description']);
        if (text.length > maxLength) {
            text_sub = text.substring(0, maxLength);
            itemList += "<p class='heading-customize less" + varia['id'] + "'>" + text_sub.substring(0, text.lastIndexOf(" ")) + ellipsis + "</p>";
            itemList += "<p class='heading-customize more" + varia['id'] + " d-none'>" + text + expand_less + "</p>";
        } else {
            itemList += '<div class="modal-discription"><p>' + text + '</p></div>';
        }
    }


            if (varia['variants'].length > 0) {
                if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
                    itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
                }
                // showVariant(varia['id'],varia['sectionId']);
            } else if (varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 0 && varia['templateId'] != 'null') {
                itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
                // showVariant(varia['id'],varia['sectionId']);
            } else {
                itemList += '';
            }
            
            var num = parseFloat(varia["avgRating"]);
            if (num != undefined && num > 3) {
                var rat = Math.ceil(num);
                itemList += '<div class="d-flex" style="margin-bottom: 5px;">';
                for (var a = 0; a < rat; a++) {
                    itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
                }
                itemList += '</div>';

            }
            itemList += '</div>';
            // itemList += '<p class="pric e-p">';

            // if (varia['variantsAvailable'] > 0) {
            //     var sp_arr = varia['variants'].map(function(el) {
            //         return el.sp
            //     });
            //     if (varia['dynamic_combo'] == 1) {
            //         if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
            //             itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
            //         } else {
            //             itemList += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
            //         }
            //     } else if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
            //         itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
            //     } else {
            //         itemList += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
            //     }
            // } else {
            //     if (varia['dynamic_combo'] == 1) {
            //         if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
            //             itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> <small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(varia['sp']) + '';
            //         } else {
            //             itemList += '<span style="font-size: 12px; color: #5c5c5c; display:inline-block">Starting @</span> ' + currency + ' ' + Math.round(varia['sp']) + '';
            //         }
            //     } else if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
            //         itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(varia['sp']) + '';
            //     } else {
            //         itemList += '' + currency + ' ' + Math.round(varia['sp']) + '';
            //     }
            // }

            // itemList += '</p>';
            // if(aiFlag == 1){
            //     itemList += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
            // }
            // button += '<div class="modal-lower-discription" style="margin-top: 15px;">';
            // if (varia['viewType'] == 3) {
            //     button += '<button class="add-btn animatebtn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span>Add To Cart</span></button>'

            // }else if (varia['viewType'] == 2) {
            //     button += '<button class="add-btn animatebtn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span>Add To Cart</span></button>'

            // } else {
            //     button += '<button class="add-btn animatebtn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span>Add To Cart</span></button>'
            // }

            // button += '<div class="available-next" style="width: 100%;padding: 0 15px;"><div style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;width: 100%;">Next available at '+ end_hour +'</div></div>';

            // button += '</div>';
            button += '<div class="modal-lower-discription">';

            // Handle different viewType scenarios
            if (varia['viewType'] == 3) {
                button += '<button class="add-btn animatebtn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
                button += '<span>ADD TO CART</span>';
                button += '</button>';
            } else if (varia['viewType'] == 2) {
                button += '<button class="add-btn animatebtn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
                button += '<span>ADD TO CART</span>';
                button += '</button>';
            } else {
                // Default case with pricing logic
                button += '<button class="add-btn animatebtn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                
                // Pricing logic
                button += '<span>';
                if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
                    button += '<small style="color: #fff; font-size: 95%;"><s><i class="la la-inr"></i>' + Math.round(varia['mrp']) + '</s></small> ';
                }
                button += '<i class="la la-inr"></i>' + (parseFloat(varia['sp']).toFixed(2)) + '</span>';
                
                // Add to cart text
                button += '<span>ADD TO CART</span>';
                button += '</button>';
            }
            
            // Optional "Next available" section
            button += '<div class="available-next d-none" style="width: 100%;padding: 0 15px;">';
            button += '<div style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;width: 100%;">';
            button += 'Next available at '+end_hour;
            button += '</div>';
            button += '</div>'; // Close available-next
            
            button += '</div>'; // Close modal-lower-discription
            
            
            $('#singleItemImage').html('');
            $('#singleItemImage').html(image);
            $('#itemViewdvClassId').html('');
            $('#itemViewdvClassId').html(itemList);
            $('#singleItemButton').html('');
            $('#singleItemButton').html(button);
            $('#single-item-modal').modal('show');
            $('.spinner').hide();

            var gtm_items = [{
                'item_id': varia['id'],
                'item_name': varia['itemName'],
                'quantity':  1,
                'price' : parseFloat(varia['sp']),
                'item_category' : varia['sectionName'],
                'location_id' : postalCode
            }];
            
            if(typeof gtm_tag == 'function'){
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    'event': "view_item",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(varia['sp']),
                        'items': gtm_items
                    }
                });
            }

            if(typeof webengage_tag == "function"){

                if (varia['image'] != null && varia['image'] != '') {
                    var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + varia['image'] ;
                } else {
                    var image = bLogo ;
                }

                webengage.track("Product Viewed", {
                  "Product Name" : varia['itemName'] ,
                  "Product ID"   : String(varia['id']) ,
                  "Category Name"   : varia['sectionName'] ,
                  "Category ID"    : varia['sectionId'],
                  "Price" : parseFloat(varia['sp']),
                  "Description" :  varia['description'] ,
                  "Image URL": image,
                  "Type" :  varia['vegNonvegBoth']
                });
            }

            const share = e => {
                if (navigator.share) {
                    navigator
                    .share({
                        title: varia['itemName'],
                        text: "Take a look at this "+ varia['itemName'] +" on "+ businessName +"",
                        url: result['sharing_url']
                    })
                    // .then(() => console.log("thanks for share"))
                    .catch(error => console.log("error", 'Browser does not support share'));
                }
            };
        
            if(categoryId != 4){
                setTimeout(() => {
                    document.getElementById("sharing_item").addEventListener("click", share);
                }, 100);
            }

            if (outlet_open != 1) {
                $('.available-next').removeClass('d-none');
                $('.add-btn').addClass('d-none');
            } else {
                $('.add-btn').removeClass('d-none');
                $('.available-next').addClass('d-none');
            }
        }
    });
    // 
}

function getItemDetails(id, sectionId) {
    
    if (addressServicable == 0) {
        return false;
    }

    $('.spinner').show();
    var url = origin + '/petPooja/getItemDetails?itemId=' + id + '&sectionId=' + sectionId + '&businessId=' + businessId;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            var varia = result.rows.menu[0];
            var button = '' ;
            var image = ''; // Initialize the 'image' variable
            
            openSingleItemModal(varia,result);
        }
    });
    // 
}

function openSingleItemModal(varia,result)
{
    // if()
    var itemList = "";
    var button = '' ;
    var image = '';
    // alert('gotit');
    if (varia['variants'].length > 0) {
        if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
            itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
        }
        // alert('gotit-withvariant');
        $('#viewItemImage').modal('hide');
        $('#single-item-modal').modal('hide');
        showVariantModal(result,varia);
    } else if (varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 0 && varia['templateId'] != 'null') {
        itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
        $('#viewItemImage').modal('hide');
        $('#single-item-modal').modal('hide');
        // alert('gotit-withvariant');
        showVariantModal(result,varia);
    } else {

        if (varia['image'] != null && varia['image'] != '') {
            image += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + varia['image'] + '" class="zoom" alt="' + varia['image'] + '" width="350" height="350">';
        } else {
            image += '<img src="' + bLogo + '" alt="Logo" style="filter: grayscale(0.9);" width="350" height="350">';
        }

        itemList += '</div><div class=" img-content"><div class="modal-inner-heading">';
        itemList += '<div class="d-flex justify-content-between sticky-single-itemss">';
        itemList += '<div class="d-flex align-items-center mb-2">';
        itemList += '<h5 class="modal-title-bg">' + varia['itemName'] + '</h5>';   
        document.getElementById('headerSingle').innerHTML ='';                  
        var htmlContent = '';

        // Check for veg/non-veg flag
        if (varia['vegNonvegBoth'] == 'veg') {
            htmlContent +=`
                            <div class="veg-flag"><span></span></div>
                        `;
        } else if (varia['vegNonvegBoth'] == 'non-veg') {
            htmlContent += `
                            <div class="non-vegflag"><span></span></div>
                        `;
        }
        
        // Check for Bestseller tag
        if (varia?.recommended && varia['recommended'] != 0) {
            htmlContent += ' <span class="tag-bestseller"><span>Bestseller</span></span>';
        }
        
        if(varia?.newItem && varia['newItem'] != 0 ){
            htmlContent += '<span class="tag-new"><span>New</span></span>';
        }
        // Append the content to the element with ID 'headerSingle'
        document.getElementById('headerSingle').innerHTML += htmlContent;



        if(varia?.custom_tags && varia['custom_tags'] != null)
            {
                var tagsArray = varia['custom_tags'].split(',');
                tagsArray.forEach(element => {
                    if (pId == 7175) {
                        itemList += '<span class="tag-limited-edition">'+ element +'</span>';
                    } else {
                        itemList += '<span class="tag-limited-edition">'+ element +'</span>';
                    }
                    
                });
                
            }

        
        itemList += '</div>';

        if(categoryId != 4){
            itemList += '<div>';
            itemList += '<span id="sharing_item">';
            itemList += '<svg fill=none height=28 viewBox="0 0 29 28"width=29 xmlns=http://www.w3.org/2000/svg><path d="M28.4259 13.5833C28.4259 20.9346 22.1314 26.9167 14.338 26.9167C6.54449 26.9167 0.25 20.9346 0.25 13.5833C0.25 6.2321 6.54449 0.25 14.338 0.25C22.1314 0.25 28.4259 6.2321 28.4259 13.5833Z"fill=white fill-opacity=0.8 stroke=#707070 stroke-width=0.5 /><path d="M17.6635 21.7336C17.0634 21.7336 16.5542 21.5238 16.1358 21.1042C15.718 20.6841 15.5092 20.1739 15.5092 19.5738C15.5092 19.4833 15.549 19.2548 15.6287 18.8883L9.11141 15.0189C8.91581 15.2447 8.67644 15.4219 8.39331 15.5505C8.11017 15.679 7.8062 15.7433 7.48141 15.7433C6.88616 15.7433 6.38026 15.5314 5.9637 15.1076C5.54715 14.6838 5.33887 14.1758 5.33887 13.5836C5.33887 12.9914 5.54715 12.4833 5.9637 12.0595C6.38026 11.6357 6.88616 11.4238 7.48141 11.4238C7.8056 11.4238 8.10957 11.4881 8.39331 11.6167C8.67705 11.7453 8.91642 11.9228 9.11141 12.1492L15.6296 8.29605C15.5873 8.17894 15.5569 8.06272 15.5381 7.94742C15.5188 7.8315 15.5092 7.71318 15.5092 7.59244C15.5092 6.99296 15.7196 6.48313 16.1403 6.06295C16.5611 5.64338 17.0718 5.43359 17.6725 5.43359C18.2732 5.43359 18.7827 5.64398 19.2011 6.06477C19.6195 6.48555 19.8284 6.99628 19.8278 7.59697C19.8272 8.19765 19.6174 8.70718 19.1984 9.12554C18.7794 9.54391 18.2693 9.75279 17.668 9.75219C17.3408 9.75219 17.0389 9.68518 16.7625 9.55115C16.486 9.41713 16.2505 9.23693 16.0561 9.01054L9.53702 12.88C9.57928 12.9971 9.60977 13.1136 9.62848 13.2295C9.6478 13.3448 9.65746 13.4629 9.65746 13.5836C9.65746 13.7043 9.6478 13.8224 9.62848 13.9377C9.60917 14.053 9.57898 14.1695 9.53793 14.2872L16.0561 18.1566C16.2511 17.9303 16.4866 17.7501 16.7625 17.616C17.0389 17.482 17.3408 17.415 17.668 17.415C18.2681 17.415 18.7782 17.6251 19.1984 18.0453C19.618 18.4667 19.8278 18.9777 19.8278 19.5784C19.8278 20.1791 19.6174 20.6886 19.1966 21.1069C18.7758 21.5253 18.2642 21.7342 17.6635 21.7336ZM17.668 20.828C18.0236 20.828 18.3215 20.7079 18.5618 20.4676C18.8021 20.2274 18.9222 19.9297 18.9222 19.5747C18.9222 19.2198 18.8021 18.9218 18.5618 18.681C18.3215 18.4401 18.0239 18.32 17.6689 18.3206C17.3139 18.3212 17.016 18.4413 16.7751 18.681C16.5343 18.9206 16.4141 19.2183 16.4147 19.5738C16.4153 19.9294 16.5355 20.2274 16.7751 20.4676C17.0148 20.7079 17.3118 20.828 17.668 20.828ZM7.48141 14.8369C7.84122 14.8369 8.14307 14.7167 8.38697 14.4765C8.63026 14.2362 8.75191 13.9386 8.75191 13.5836C8.75191 13.2286 8.63026 12.931 8.38697 12.6907C8.14367 12.4504 7.84182 12.3303 7.48141 12.3303C7.13066 12.3303 6.83696 12.4504 6.60031 12.6907C6.36365 12.931 6.24503 13.2286 6.24442 13.5836C6.24382 13.9386 6.36245 14.2365 6.60031 14.4774C6.83817 14.7183 7.13187 14.8381 7.48141 14.8369ZM17.6689 8.84663C18.0239 8.84663 18.3215 8.7265 18.5618 8.48622C18.8021 8.24595 18.9222 7.94802 18.9222 7.59244C18.9222 7.23686 18.8021 6.93923 18.5618 6.69956C18.3215 6.45989 18.0239 6.33975 17.6689 6.33915C17.3139 6.33855 17.016 6.45868 16.7751 6.69956C16.5343 6.94044 16.4141 7.23837 16.4147 7.59334C16.4153 7.94832 16.5355 8.24595 16.7751 8.48622C17.0148 8.7265 17.3127 8.84663 17.6689 8.84663Z"fill=black /></svg>';
            itemList += '</span>';
            itemList += '</div>';
        }
       
        itemList += '</div>';
        
       
        // if (varia['description'] != null && varia['description'] != '' && varia['description'] != 'null') {
        //     itemList += '<div class="modal-discription"><p>' + varia['description'] + '</p></div>';
        // }
        itemList+='<div class="single-item-start">';
        if (varia['description'] != '' && varia['description'] != null && varia['description'] != 'null') {
    var ellipsis = '<span class="expand_details" onclick="expand_description(' + varia['id'] + ',1)">...Read more</span>';
    var expand_less = '<span class="expand_details" onclick="collapse_description(' + varia['id'] + ',1)">...Read less</span>';
    var maxLength = 70;
    var text = $.trim(varia['description']);
    if (text.length > maxLength) {
        text_sub = text.substring(0, maxLength);
        itemList += "<p class='heading-customize less" + varia['id'] + "'>" + text_sub.substring(0, text.lastIndexOf(" ")) + ellipsis + "</p>";
        itemList += "<p class='heading-customize more" + varia['id'] + " d-none'>" + text + expand_less + "</p>";
    } else {
        itemList += '<div class="modal-discription"><p>' + text + '</p></div>';
    }
}


        if (varia['variants'].length > 0) {
            if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
                itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
            }
            // showVariant(varia['id'],varia['sectionId']);
        } else if (varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 0 && varia['templateId'] != 'null') {
            itemList += '<div class="modal-discription"><p><span style="color: #9EA2A1;font size:13px;">Customisable</span></p></div>';
            // showVariant(varia['id'],varia['sectionId']);
        } else {
            itemList += '';
        }
        
        var num = parseFloat(varia["avgRating"]);
        if (num != undefined && num > 3) {
            var rat = Math.ceil(num);
            itemList += '<div class="d-flex" style="margin-bottom: 5px;">';
            for (var a = 0; a < rat; a++) {
                itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
            }
            itemList += '</div>';

        }
        itemList+='</div>';
        // itemList += '<p class="pric e-p">';

        // if (varia['variantsAvailable'] > 0) {
        //     var sp_arr = varia['variants'].map(function(el) {
        //         return el.sp
        //     });
        //     if (varia['dynamic_combo'] == 1) {
        //         if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
        //             itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        //         } else {
        //             itemList += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        //         }
        //     } else if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
        //         itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        //     } else {
        //         itemList += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        //     }
        // } else {
        //     if (varia['dynamic_combo'] == 1) {
        //         if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
        //             itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> <small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(varia['sp']) + '';
        //         } else {
        //             itemList += '<span style="font-size: 12px; color: #5c5c5c; display:inline-block">Starting @</span> ' + currency + ' ' + Math.round(varia['sp']) + '';
        //         }
        //     } else if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
        //         itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + ' ' + Math.round(varia['sp']) + '';
        //     } else {
        //         itemList += '' + currency + ' ' + Math.round(varia['sp']) + '';
        //     }
        // }

        // itemList += '</p>';
        // if(aiFlag == 1){
        //     itemList += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
        // }
        // button += '<div class="modal-lower-discription" style="margin-top: 15px;">';
        // if (varia['viewType'] == 3) {
        //     button += '<button class="add-btn animatebtn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span>Add To Cart</span></button>'

        // }else if (varia['viewType'] == 2) {
        //     button += '<button class="add-btn animatebtn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span>Add To Cart</span></button>'

        // } else {
        //     button += '<button class="add-btn animatebtn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span>Add To Cart</span></button>'
        // }

        // button += '<div class="available-next" style="width: 100%;padding: 0 15px;"><div style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;width: 100%;">Next available at '+ end_hour +'</div></div>';

        // button += '</div>';
        button += '<div class="modal-lower-discription">';

        // Handle different viewType scenarios
        if (varia['viewType'] == 3) {
            button += '<button class="add-btn animatebtn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
            button += '<span>ADD TO CART</span>';
            button += '</button>';
        } else if (varia['viewType'] == 2) {
            button += '<button class="add-btn animatebtn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
            button += '<span>ADD TO CART</span>';
            button += '</button>';
        } else {
            // Default case with pricing logic
            button += '<button class="add-btn animatebtn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">';
            
            // Pricing logic
            button += '<span>';
            if (Math.round(varia['mrp']) != Math.round(varia['sp']) && Math.round(varia['mrp']) != 0) {
                button += '<small style="color: #fff; font-size: 95%;"><s><i class="la la-inr"></i>' + Math.round(varia['mrp']) + '</s></small> ';
            }
            button += '<i class="la la-inr"></i>' + (parseFloat(varia['sp']).toFixed(2)) + '</span>';
            
            // Add to cart text
            button += '<span>ADD TO CART</span>';
            button += '</button>';
        }
        
        // Optional "Next available" section
        button += '<div class="available-next d-none" style="width: 100%;padding: 0 15px;">';
        button += '<div style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;width: 100%;">';
        button += 'Next available at '+end_hour;
        button += '</div>';
        button += '</div>'; // Close available-next
        
        button += '</div>'; // Close modal-lower-discription
        
        
        $('#singleItemImage').html('');
        $('#singleItemImage').html(image);
        $('#itemViewdvClassId').html('');
        $('#itemViewdvClassId').html(itemList);
        $('#singleItemButton').html('');
        $('#singleItemButton').html(button);
        $('#single-item-modal').modal('show');
        $('.spinner').hide();

        var gtm_items = [{
            'item_id': varia['id'],
            'item_name': varia['itemName'],
            'quantity':  1,
            'price' : parseFloat(varia['sp']),
            'item_category' : varia['sectionName'],
            'location_id' : postalCode
        }];
        
        if(typeof gtm_tag == 'function'){
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "view_item",
                'ecommerce': {
                    'currency': "INR",
                    'value': parseFloat(varia['sp']),
                    'items': gtm_items
                }
            });
        }

        if(typeof webengage_tag == "function"){

            if (varia['image'] != null && varia['image'] != '') {
                var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + varia['image'] ;
            } else {
                var image = bLogo ;
            }

            webengage.track("Product Viewed", {
              "Product Name" : varia['itemName'] ,
              "Product ID"   : String(varia['id']) ,
              "Category Name"   : varia['sectionName'] ,
              "Category ID"    : varia['sectionId'],
              "Price" : parseFloat(varia['sp']),
              "Description" :  varia['description'] ,
              "Image URL": image,
              "Type" :  varia['vegNonvegBoth']
            });
        }

        const share = e => {
            if (navigator.share) {
                navigator
                .share({
                    title: varia['itemName'],
                    text: "Take a look at this "+ varia['itemName'] +" on "+ businessName +"",
                    url: result['sharing_url']
                })
                // .then(() => console.log("thanks for share"))
                .catch(error => console.log("error", 'Browser does not support share'));
            }
        };
    
        if(categoryId != 4){
            setTimeout(() => {
                document.getElementById("sharing_item").addEventListener("click", share);
            }, 100);
        }

        if (outlet_open != 1) {
            $('.available-next').removeClass('d-none');
            $('.add-btn').addClass('d-none');
        } else {
            $('.add-btn').removeClass('d-none');
            $('.available-next').addClass('d-none');
        }
    }


    
}

function showVariantModal(result,varia)
{
    var variantId = varia['id'];
    if (result['rows']['menu'].length == 0) {
        alert("Item is Currently Not Available");
        $('.spinner').hide();
        return false;
    }

    menu = result['rows']['menu'][0];
    $('#totalSpanCustom').attr('data-price', menu['sp']);
    if (menu['image'] != null && menu['image'] != '') {
            var imgTag = '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + menu['image'] + '" alt="' + menu['itemName'] + '" class="zoom" width="345" height="250"></img>';
        
        
    } else {
        var imgTag='<img src="' + bLogo + '" alt="Logo" class="zoom" style="filter: grayscale(0.9);" width="345" height="250"></img>';
    }

    $('#imgprofile_variant').html('');
    $('#imgprofile_variant').html(imgTag);
    $('#imgprofile_variant').show();

    var flagName = '';
    flagName += '<div class="d-flex align-items-center mb-2">';
    if (menu['vegNonvegBoth'] == 'veg') {
        flagName = '<div class="veg-flag"> <span></span> </div></div>';
    } else if (menu['vegNonvegBoth'] == 'non-veg') {
        flagName += '<div class="non-vegflag"> <span></span> </div></div>';
    }

    if(menu?.recommended && menu['recommended'] == 1){
        flagName += '<span class="tag-bestseller"><span>Bestseller</span></span>';
    }

    if(menu?.newItem && menu['newItem'] != 0 ){
        flagName += '<span class="tag-new"><span>New</span></span>';
    }

    if(menu?.custom_tags && menu['custom_tags'] != null)
        {
            var tagsArray = menu['custom_tags'].split(',');
            tagsArray.forEach(element => {
                if (pId == 7175) {
                    flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                } else {
                    flagName += '<span class="tag-limited-edition">'+ element +'</span>';
                }
                
            });
            
        }

    flagName += '</div>';
    $('#flagdata').html('');
    $('#flagdata').html(flagName);
    $('#variantName').html('');
    $('#variantName').html(menu['itemName']);
    if (menu['description'] != null && menu['description'] != "null" && menu['description'] != "") {
        // Split the description into words
        const description = menu['description'];
        const words = description.split(' ');
    
        // Check if the description exceeds 15 words
        if (words.length > 15) {
            // Extract the first 15 words
            const truncatedDescription = words.slice(0, 15).join(' ') + '...';
    
            // Populate the variant description with truncated text and add "Read More"
            $('#variantDesc').html(`
                <div class="short-text">
                    ${truncatedDescription} 
                    <div class="someElement" >Read More</div>
                </div>
                <div class="full-text" style="display: none;">
                    ${description}
                    <div class="someElement" ></div>
                </div>
            `);
    
            // Handle toggling between truncated and full description
            $(document).on('mouseenter', '#variantDesc .someElement', function () {
                const shortText = $('#variantDesc .short-text');
                const fullText = $('#variantDesc .full-text');
    
                
                    fullText.show();
              
            });
            $(document).on('mouseleave', '#variantDesc .someElement', function () {
                const shortText = $('#variantDesc .short-text');
                const fullText = $('#variantDesc .full-text');
    
                
                    fullText.hide();
              
            });
        } else {
            // If the description is within 15 words, display it as-is
            $('#variantDesc').html(description);
        }
    }
    templates = result['rows']['templates'];
    var num = parseFloat(menu["avgRating"]);
    if (num != undefined && num > 3) {
        var rat = Math.ceil(num);
        var itemList = '<div class="d-flex" style="margin-bottom: 5px;">';
        for (var a = 0; a < rat; a++) {
            itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
        }
        itemList += '</div>';
        $('#variantRating').html(itemList);
        $('#variantRating').removeClass('d-none');
    }else{
        $('#variantRating').addClass('d-none');
    }
    if (menu['variant_count'] > 0) {
        const share = e => {
            if (navigator.share) {
                navigator
                .share({
                    title: menu['itemName'],
                    text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                    url: result['sharing_url']
                })
                // .then(() => console.log("thanks for share"))
                .catch(error => console.log("error", 'Browser does not support share'));
            }
        };
    
        document.getElementById("sharingItem").addEventListener("click", share);

        var sp_arr = menu['variants'].map(function(el) {
            return el.sp
        });

        var sp_varinat= Math.round(Math.min(...sp_arr));

        var mrp_arr = menu['variants'].map(function(el) {
            return el.mrp
        });
        
        var mrp_varinat= Math.round(Math.min(...mrp_arr));

        var varinat_price = '<p class="price-p">';
        if (Math.round(mrp_varinat) != Math.round(sp_varinat) && Math.round(mrp_varinat) != 0) {
            varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(mrp_varinat) + '</s></small>' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        } else {
            varinat_price += '' + currency + ' ' + Math.round(Math.min(...sp_arr)) + '';
        }
        varinat_price +='</p>';
        if(aiFlag == 1){
            varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
        }
        $('#variantPrice').html(varinat_price);
        $('.spinner').show();
        menu['variants'] = menu['variants'].sort((a, b) => a.sp - b.sp);
        item['itemId'] = menu['variants'][0]['id'];
        item['parentItemId'] = 0;
        item['pId'] = menu['variants'][0]['parentId'];
        item['qty'] = 1;
        item['subItems'] = [];
        item['sp'] = menu['variants'][0]['sp'];
        item['itemPrice'] = menu['variants'][0]['sp'];
        item['parentName'] = menu['itemName'];
        item['itemName'] = menu['variants'][0]['itemName'];
        item['description'] = menu['description'];
        item['customization'] = 0;
        item['sectionName'] = menu['sectionName'];
        item['sectionId'] = menu['sectionId'];
        item['image'] = menu['image'];
        item['vegNonvegBoth'] = menu['vegNonvegBoth'];
        // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
        // $('#itemSelectError-' + item['itemId']).hide();
        var variantType = '<div class="inner-options common-options"><div class="inner-option-start pizza-options"><p class="text-center position-relative new-seprator mb-2"><span>Variants</span></p> <div class="pizza-radios">';
        for (var i = 0; i < menu['variants'].length; i++) {
            if (i == 0) {

                variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + " )' class='radio-outer position-relative'>";
                variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" data-price="'+  menu['variants'][i]['sp']  +'" name="newAddType" value="' + menu['variants'][i]['id'] + '" checked="">';
                variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                variantType += '<span> <span class = "name-moddd" >' + menu['variants'][i]['itemName'] + '<span></span></span>';
                if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                    variantType += '<span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span>';
                } else {
                    variantType += '<span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span>';
                }
                variantType += '</span>';

                if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                    variantType += '<span class = "pizza-img text-right"><img src = "' + menu['variants'][i]['variant_icon'] + '"></span>';
                }

                variantType += '</span><span></span></label> </div>';

            } else {
                variantType += "<div onclick='getTopping(" + menu['variants'][i]['id'] + ")' class='radio-outer position-relative'>";
                variantType += '<input type="radio" id="' + menu['variants'][i]['id'] + '" data-price="'+  menu['variants'][i]['sp']  +'" name="newAddType" value="' + menu['variants'][i]['id'] + '" >';
                variantType += '<label for = "' + menu['variants'][i]['id'] + '" class = "animatebtn">'
                variantType += '<span class = "inner-data d-flex align-items-center justify-content-between">';
                variantType += '<span> <span class = "name-moddd" >' + menu['variants'][i]['itemName'] + '<span></span></span>';
                if (Math.round(menu['variants'][i]['mrp']) != Math.round(menu['variants'][i]['sp']) && Math.round(menu['variants'][i]['mrp']) != 0) {
                    variantType += '<span class = "d-block font-weight-bold price-fxd"><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(menu['variants'][i]['mrp']) + '</s></small> ' + currency + '' + Math.round(menu['variants'][i]['sp']) + '</span>';
                } else {
                    variantType += '<span class = "d-block font-weight-bold price-fxd"> ' + currency + ' ' + Math.round(menu['variants'][i]['sp']) + '</span>';
                }
                variantType += '</span>';

                if (menu['variants'][i]['variant_icon'] != null && menu['variants'][i]['variant_icon'] != '') {
                    variantType += '<span class = "pizza-img text-right"><img src = "' + menu['variants'][i]['variant_icon'] + '"></span>';
                }

                variantType += '</span></label> </div>';

            }

        }
        variantType += '</div></div></div>';
        if (menu['variants'][0]['templateId'] != 0) {

            var temps = menu['variants'][0]['templates'];



            itemTemplates = menu['variants'][0]['templates'];
            variantType += '<div id="topping">';
            for (var k = 0; k < temps.length; k++) {

                var temp = templates.filter(e => e.templateId == temps[k]['templateId']);

                if (temp.length > 0) {

                    if (temp[0]['template'].length > 0) {
                        var minQty = temps[k]['minQty'];
                        var maxQty = temps[k]['maxQty'];
                        variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                        var quantity_desc;
                        if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                            quantity_desc = 'Please select any ' + maxQty + '  option';
                        } else if (minQty == 0 && maxQty != 0) {
                            quantity_desc = 'You can choose up to ' + maxQty + ' option(s)';
                        } else if (minQty != 0 && maxQty != 0) {
                            quantity_desc = 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                        } else if (minQty != 0 && maxQty == 0) {
                            quantity_desc = 'Select a minimum of ' + minQty;
                        }

                        if (quantity_desc != null && quantity_desc != '') {
                            variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                        } else {
                            variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                        }
                        variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none; background-color:#fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                        for (var t = 0; t < temp[0]['template'].length; t++) {

                            if (minQty == 1 && maxQty == 1) {
                                if (t == 0) {
                                    variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                    variantType += '<li><div class="radio-outer">';
                                    variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '"  checked="checked" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }

                                    variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';
                                    addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                } else {

                                    variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                    variantType += '<li><div class="radio-outer">';
                                    variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }
                                    variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';
                                }
                            } else {
                                if (temp[0]['template'][t]['items'].length == 0) {

                                    variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+temp[0]['template'][t]['id']+'">';
                                    variantType += '<li><div class="checkbox-outer">';
                                    variantType += '<input data-price="'+Math.round(temp[0]['template'][t]['sp'])+'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }
                                    // variantType+='<div class="veg-flag"> <span></span></div>';
                                    variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';



                                } else {
                                    variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                    for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                        var tempDetail = temp[0]['template'][t]['items'][k];
                                        variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+tempDetail['id']+'">';
                                        variantType += '<li><div class="checkbox-outer">';
                                        variantType += '<input data-price="'+Math.round(tempDetail['sp'])+'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                        variantType += '<label for="' + tempDetail['id'] + '">';
                                        variantType += '<div class="item-discription-main">';
                                        variantType += '<span class="item-name"><div>';
                                        if (tempDetail['vegNonvegBoth'] == 'veg') {
                                            variantType += '<div class="veg-flag"> <span></span> </div>';
                                        } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                            variantType += '<div class="non-vegflag"> <span></span> </div>';
                                        }
                                        // variantType+='<div class="veg-flag"> <span></span></div>';
                                        variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                        variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                        variantType += '</div></label> </div></li></ul>';
                                    }

                                }

                            }
                        }
                        variantType += '</div></div>';
                    }
                    $('#variantCustom').removeClass('d-none');
                }else{
                    $('#variantCustom').addClass('d-none');
                }


            }
            variantType += '</div>';
        }

        // variantType+='</div>';
        $('#variantBody').html('');
        $('#variantBody').html(variantType);
        $('#customisable-item-modal').modal('show');
        $('.modal-content').animate({
            scrollTop: 0
        }, 'slow');
        $('#customisable-item-modal').on('shown.bs.modal', function() {
            setTimeout(function() {
                    $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
            }, 1000);
        });

        var gtm_items = [{
            'item_id': menu['id'],
            'item_name': menu['itemName'],
            'quantity': 1,
            'price' : parseFloat(sp_varinat),
            'item_category' : menu['sectionName'],
            'location_id' : postalCode
        }];
        
        if(typeof gtm_tag == 'function'){
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': "view_item",
                'ecommerce': {
                    'currency': "INR",
                    'value': parseFloat(sp_varinat),
                    'items': gtm_items
                }
            });
        }

        if(typeof webengage_tag == "function"){
            
            if (menu['image'] != null && menu['image'] != '') {
                var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'];
            } else {
                var image= bLogo;
            }
            webengage.track("Product Viewed", {
              "Product Name" : menu['itemName'] ,
              "Product ID"   : String(menu['id']) ,
              "Category Name"   : menu['sectionName'] ,
              "Category ID"    : menu['sectionId'],
              "Price" : parseFloat(sp_varinat),
              "Description" :  menu['description'] ,
              "Image URL": image,
              "Type" :  menu['vegNonvegBoth']
            });
        }
        

    } else {
        item['itemId'] = menu['id'];
        item['parentItemId'] = 0;
        item['qty'] = 1;
        item['subItems'] = [];
        item['pId'] = menu['parentId'];
        item['sp'] = menu['sp'];
        item['itemPrice'] = menu['sp'];
        item['parentName'] = '';
        item['itemName'] = menu['itemName'];
        item['description']=menu['description'];
        item['customization'] = 0;
        item['sectionName'] = menu['sectionName'];
        item['sectionId'] = menu['sectionId'];
        item['image'] = menu['image'];
        item['vegNonvegBoth'] = menu['vegNonvegBoth'];
        // $(".error-inside").prop("id", "itemSelectError-" + item['itemId']);
        // $('#itemSelectError-' + item['itemId']).hide();
        if (menu['templateId'] != null && menu['templateId'] != 0 && menu['templateId'] != "null") {
            const share = e => {
                if (navigator.share) {
                    navigator
                    .share({
                        title: menu['itemName'],
                        text: "Take a look at this "+ menu['itemName'] +" on "+ businessName +"",
                        url: result['sharing_url']
                    })
                    // .then(() => console.log("thanks for share"))
                    .catch(error => console.log("error", 'Browser does not support share'));
                }
            };
        
            document.getElementById("sharingItem").addEventListener("click", share);
            $('.spinner').show();
            itemTemplates = menu['templates'];
            var available_templates = result['rows']['templates'];

            if (available_templates.length > 0) {
                const availableTemplateIds = available_templates.map(template => String(template.templateId));
                const commonTemplates = itemTemplates.filter(template => availableTemplateIds.includes(String(template.templateId)));
                itemTemplates = commonTemplates;
            }

        
            var variantType = '';
            var varinat_price = '<p class="price-p">';
            if (Math.round(menu['mrp']) != Math.round(menu['sp']) && Math.round(menu['mrp']) != 0) {
                varinat_price += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(menu['mrp']) + '</s></small>' + currency + ' ' + Math.round(menu['sp']) + '';
            } else {
                varinat_price += '' + currency + ' ' + Math.round(menu['sp']) + '';
            }
                varinat_price+='</p>';
                if(aiFlag == 1){
                    varinat_price += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
                }
            $('#variantPrice').html(varinat_price);
            //var variantType='<div class="inner-options common-options"><div class="inner-option-start"><p>Customisation</p></div></div>';
            var temps = menu['templates'];
            for (var k = 0; k < temps.length; k++) {
                var temp = templates.filter(e => e.templateId == temps[k]['templateId']);
                if (temp.length > 0) {

                    if (temp[0]['template'].length > 0) {
                        var minQty = temps[k]['minQty'];
                        var maxQty = temps[k]['maxQty'];
                        variantType += '<div class="inner-options common-options"><div class="inner-option-start">';
                        var quantity_desc = '';
                        if ((minQty == maxQty) && maxQty != 0 && minQty != 0) {
                            quantity_desc += 'Please select any ' + maxQty + '  option';
                        } else if (minQty == 0 && maxQty != 0) {
                            quantity_desc += 'You can choose up to ' + maxQty + ' option(s)';
                        } else if (minQty != 0 && maxQty != 0) {
                            quantity_desc += 'Select a minimum of ' + minQty + ' and a maximum of ' + maxQty;
                        } else if (minQty != 0 && maxQty == 0) {
                            quantity_desc += 'Select a minimum of ' + minQty;
                        }
                        if (quantity_desc != null && quantity_desc != '') {
                            variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '<span class="bottom-narrow-span">' + quantity_desc + '</span></span></p>';
                        } else {
                            variantType += '<p class="text-center position-relative new-seprator"><span>' + temp[0]['template'][0]['sectionName'] + '</span></p>';
                        }
                        variantType += '<div class="error-msg-nwww" id="itemSelectError'+ temp[0]['template'][0]['sectionId'] +'" style="display:none;background-color: #fd6768; color: #fff; padding: 5px 10px; margin-top: -16px; margin-left: -10px; margin-right: -10px; margin-bottom: 10px; font-weight: 600; transition: all 20s ease 20s;"><i class="las la-exclamation-circle"></i><span id="item-error'+ temp[0]['template'][0]['sectionId'] +'"></span></div>';
                        // variantType+="<div class='col-12 m-0' style='background:#ececec;font-size:1.2em;    border-left: 5px solid #000;'><span>"+temp[0]['template'][0]['itemName']+"</span></div>";
                        //  variantType+="<div class='col-12 m-0 p-2' style='color:#000;font-size:1.2em;    border-bottom: 1.5px solid #fff;background:#ececec'><span>"+temp[0]['template'][0]['sectionName']+"</span></div>";
                        for (var t = 0; t < temp[0]['template'].length; t++) {

                            if (minQty == 1 && maxQty == 1) {
                                if (t == 0) {
                                    variantType += '<ul class="items-row active" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                    variantType += '<li><div class="radio-outer">';
                                    variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '" class="topping-radio" checked="checked" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }

                                    variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';
                                    addTopping(variantId, temp[0]['template'][t]['id'], temp[0]['template'][t]['sectionId']);

                                } else {

                                    variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                    variantType += '<li><div class="radio-outer">';
                                    variantType += '<input data-price=" ' + Math.round(temp[0]['template'][t]['sp']) + '"  class="topping-radio" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temps[k]['templateId'] + '" value="' + temp[0]['template'][t]['id'] + '" type="radio">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }
                                    variantType += '</div><div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';
                                }
                            } else {
                                if (temp[0]['template'][t]['items'].length == 0) {

                                    variantType += '<ul class="items-row" id="topping-'+ temp[0]['template'][t]['sectionId'] +'-'+ temp[0]['template'][t]['id'] +'">';
                                    variantType += '<li><div class="checkbox-outer">';
                                    variantType += '<input data-price="'+Math.round(temp[0]['template'][t]['sp'])+'"  class="styled-checkbox" onclick="addTopping(' + variantId + ',' + temp[0]['template'][t]['id'] + ',' + temp[0]['template'][t]['sectionId'] + ')" id="' + temp[0]['template'][t]['id'] + '"  name="' + temp[0]['template'][t]['id'] + '" value="' + temp[0]['template'][t]['id'] + '" type="checkbox">';
                                    variantType += '<label for="' + temp[0]['template'][t]['id'] + '">';
                                    variantType += '<div class="item-discription-main">';
                                    variantType += '<span class="item-name"><div>';
                                    if (temp[0]['template'][t]['vegNonvegBoth'] == 'veg') {
                                        variantType += '<div class="veg-flag"> <span></span> </div>';
                                    } else if (temp[0]['template'][t]['vegNonvegBoth'] == 'non-veg') {
                                        variantType += '<div class="non-vegflag"> <span></span> </div>';
                                    }
                                    // variantType+='<div class="veg-flag"> <span></span></div>';
                                    variantType += '</div> <div>' + temp[0]['template'][t]['itemName'] + '</div>';
                                    variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(temp[0]['template'][t]['sp']) + '</span>';
                                    variantType += '</div></label> </div></li></ul>';



                                } else {
                                    variantType += "<div class='col-12 p-1'><span style='color: #000;border-bottom: 1.5px solid #000;padding-bottom: 4px;'>" + temp[0]['template'][t]['itemName'] + "</span></div>";
                                    for (var k = 0; k < temp[0]['template'][t]['items'].length; k++) {
                                        var tempDetail = temp[0]['template'][t]['items'][k];
                                        variantType += '<ul class="items-row" id="topping-'+ tempDetail['sectionId'] +'-'+ tempDetail['id'] +'">';
                                        variantType += '<li><div class="checkbox-outer">';
                                        variantType += '<input data-price="'+Math.round(tempDetail['sp'])+'" class="styled-checkbox" onclick="addTopping(' + variantId + ',' + tempDetail['id'] + ',' + tempDetail['sectionId'] + ')" id="' + tempDetail['id'] + '"  name="' + tempDetail['id'] + '" value="' + tempDetail['id'] + '" type="checkbox">';
                                        variantType += '<label for="' + tempDetail['id'] + '">';
                                        variantType += '<div class="item-discription-main">';
                                        variantType += '<span class="item-name"><div>';
                                        if (tempDetail['vegNonvegBoth'] == 'veg') {
                                            variantType += '<div class="veg-flag"> <span></span> </div>';
                                        } else if (tempDetail['vegNonvegBoth'] == 'non-veg') {
                                            variantType += '<div class="non-vegflag"> <span></span> </div>';
                                        }
                                        // variantType+='<div class="veg-flag"> <span></span></div>';
                                        variantType += '</div> <div>' + tempDetail['itemName'] + '</div>';
                                        variantType += '</span><span class="item-price">' + currency + ' ' + Math.round(tempDetail['sp']) + '</span>';
                                        variantType += '</div></label> </div></li></ul>';
                                    }

                                }

                            }


                        }
                        variantType += '</div></div>';
                    }
                    $('#variantCustom').removeClass('d-none');
                }else{
                    $('#variantCustom').addClass('d-none');
                }
            }
            //  variantType+='</div>';
            $('#variantBody').html('');
            $('#variantBody').html(variantType);
            $('#customisable-item-modal').modal('show');
            $('.modal-content').animate({
                scrollTop: 0
            }, 'slow');
            $('#customisable-item-modal').on('shown.bs.modal', function() {
                setTimeout(function() {
                        $(".modal-body").scrollTop($('#imgprofile_variant').height()+11.200);
                }, 1000);
            });
            
            var gtm_items = [{
                'item_id': menu['id'],
                'item_name': menu['itemName'],
                'quantity': 1,
                'price' : parseFloat(menu['sp']),
                'item_category' : menu['sectionName'],
                'location_id' : postalCode
            }];
            
            if(typeof gtm_tag == 'function'){
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    'event': "view_item",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(menu['sp']),
                        'items': gtm_items
                    }
                });
            }

            if(typeof webengage_tag == "function"){

                if (menu['image'] != null && menu['image'] != '') {
                    var image = "https://cdn.uengage.io/uploads/" + parentId + "/" + menu['image'] ;
                } else {
                    var image = bLogo ;
                }
                webengage.track("Product Viewed", {
                  "Product Name" : menu['itemName'] ,
                  "Product ID"   : String(menu['id']) ,
                  "Category Name"   : menu['sectionName'] ,
                  "Category ID"    : menu['sectionId'],
                  "Price" : parseFloat(menu['sp']),
                  "Description" :  menu['description'] ,
                  "Image URL": image,
                  "Type" :  menu['vegNonvegBoth']
                });
            }

        } else {
            add_to_cart('add', '', 0);
            $('#feabar' + item['itemId']).show();
            setTimeout(function() {
                $('#feabar' + item['itemId']).fadeOut('fast');
            }, 1000);
            $('#bar' + item['itemId']).show();
            setTimeout(function() {
                $('#bar' + item['itemId']).fadeOut('fast');
            }, 1000);
            $('#upbar' + item['itemId']).show();
            $('.cart-new-btn').addClass('not-active-all');
            setTimeout(function() {
                $('#upbar' + item['itemId']).fadeOut('fast');
                $('.cart-new-btn').removeClass('not-active-all');
            }, 1000);
        }


    }
    if (typeof gtag === "function") {
        gtag('event', 'product_viewed', {
            'event_category': 'product_viewed',
            'event_label': 'Product Viewed -'+  varia['itemName'],  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }

    if (outlet_open != 1) {
        $('.add-btn').addClass('d-none');
        $('.available-next').removeClass('d-none');
    } else {
        $('.add-btn').removeClass('d-none');
        $('.available-next').addClass('d-none');
    }
    setTimeout(() => {
        $(".spinner").fadeOut('slow');
    }, 1);
    
}

function openPromoModal(index) {
    //console.log(promoCodes[index]);
    var pData = promoCodes[index];

    var l = '' + pData['code'] + '';

    var promodetail = '<h4>' + pData['title'] + '</h4>';
    if (pData['description'] != null && pData['description'] != 'null' && pData['description'] != '') {
        promodetail += '<p>' + pData['description'] + '</p>';
    }


    $('#copytxt').html("");
    $('#copytxt').val(l);
    $('#promo-d').html("");
    $('#promo-d').html(promodetail);
    if (typeof gtag === "function") {

        gtag('event', 'trying_get_promocode', {
            'event_category': 'Selection of promo code',
            'event_label': 'User trying to get promo code',  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    $('#promomodal').modal('show');
}

function renderMenu(data) {

    var val = [];
    var sectionList = '<div style="display: flex;justify-content: space-between;align-items: center;width: 100%;" class="d-flex d-lg-none"><div style="font-weight: 600;color: #000;font-size: 17px;">Menu</div><div><button class="backBtn" aria-label="backBtn"><span><svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" enable-background="new 0 0 320.591 320.591" height="512" viewBox="0 0 320.591 320.591" width="512" style="height: auto;width: 100%;max-width: 11px;height: auto;"><g><g id="close_1_"><path d="m30.391 318.583c-7.86.457-15.59-2.156-21.56-7.288-11.774-11.844-11.774-30.973 0-42.817l257.812-257.813c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875l-259.331 259.331c-5.893 5.058-13.499 7.666-21.256 7.288z"></path><path d="m287.9 318.583c-7.966-.034-15.601-3.196-21.257-8.806l-257.813-257.814c-10.908-12.738-9.425-31.908 3.313-42.817 11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414-6.35 5.522-14.707 8.161-23.078 7.288z"></path></g></g></svg></span></button></div></div><div class="inner-toogle-new">';
    var sectionList_sec = '';
    var itemList = "";
    var featuredList = "";
    var featuredListSearch = "";
    var sectionListSearch = "";
    if(data.status == 1){
    $('.wla-main-section').show();
    $('#coming_menu').hide();
    menuFull = data;
    menu = data.rows.menu;
    menuSearch = data.rows.menu;
    aiFlag = Number(data.rows.business['aiFlag']);
    var popular = data.rows.popular;
    templateList = data.rows.templates;
    $(':checkbox:checked').each(function(i) {
        val[i] = $(this).val();

        if (val.find(f => f == 1) && val.find(f => f == 2)) {
            popular = data.rows.popular;

        } else if (val.find(f => f == 1)) {
            popular = data.rows.popular.filter(e => e.vegNonvegBoth == 'veg');
        } else if (val.find(f => f == 2)) {
            popular = data.rows.popular.filter(e => e.vegNonvegBoth == 'non-veg');
        }
    });

    if(typeof webengage_tag == "function"){
        if(val?.length != 0 && val?.length == 2){
            webengage.track("Menu Filter Applied", {
                "Store Name" : data.rows.business['name'],
                "Store ID" : businessId,
                "City" : data.rows.business['city'],
                "Locality" : data.rows.business['locality'],
                "Filter" : "Veg,Non Veg"
            });
        }else if(val?.length != 0 && val?.length == 1){
            if(val[0] == 1){
                webengage.track("Menu Filter Applied", {
                    "Store Name" : data.rows.business['name'],
                    "Store ID" : businessId,
                    "City" : data.rows.business['city'],
                    "Locality" : data.rows.business['locality'],
                    "Filter" : "Veg"
                });
            }else{
                webengage.track("Menu Filter Applied", {
                    "Store Name" : data.rows.business['name'],
                    "Store ID" : businessId,
                    "City" : data.rows.business['city'],
                    "Locality" : data.rows.business['locality'],
                    "Filter" : "Non Veg"
                });
            }
        }    
    }
    

    if (popular.length > 0) {
        // console.log(popular);
        var countClass='';
        if(popular.length == 1){
            countClass = 'featured-one';
        }else if(popular.length == 2){
            countClass = 'featured-two';
        }else if(popular.length == 3){
            countClass = 'featured-three';
        }
        $('#featuredList').addClass(countClass);
        $('#featuredProducts').show();
        $('#featuredProducts').addClass('page-section common-top-bottom common-right-left pr-0');
        $('#featuredProductsSearch').show();
        featuredListSearch += '<h4 class="ps text-center"><span>Popular Searches</span></h4><ul class="ps-list inner-search-ss mb-0" id="featuredListSearch">'
        for (var k = 0; k < popular.length; k++) {
            var varia = popular[k];

            if (pId == 7175 || pId == 47300 || pId == 49626) {
                if(aiFlag == 1){
                    featuredList += '<div class="outer-item-dv featured-dv aiFlag-enable">';
                }else{
                    featuredList += '<div class="outer-item-dv featured-dv">';
                }
                
                featuredList += '<div class="item-outer"><a tabindex="0">';
               /*  if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                }else{
                    featuredList += '<div class="item-placeholder" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                } */
                featuredList += '<div class="item-placeholder" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')">';

                var item_image = varia['image'];
                if (varia['image'] != null && varia['image'] != '') {
                        
                featuredList += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + item_image + '" alt="' + varia['itemName'] + '" class="bestseller-placeholder" width="243" height="274">';
                
                    
                } else {
                    featuredList += '<img src="' + bLogo + '" alt="' + varia['itemName'] + '" style="filter: grayscale(0.9);" class="bestseller-placeholder" width="243" height="274">';
                }
                if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
                    checkFoodType.push(varia['vegNonvegBoth']);
                }

                featuredList += '</div></a>';
                if(outlet_open !=1){
                    featuredList += '<div class="item-details" style="padding-bottom: 77px;">';
                }else{
                    featuredList += '<div class="item-details">';
                }

                featuredList += '<div class="d-flex align-items-center mb-2">';
                if (varia['vegNonvegBoth'] == 'veg') {
                    featuredList += '<div class="veg-flag"><span></span></div>';
                } else if (varia['vegNonvegBoth'] == 'non-veg') {
                    featuredList += '<div class="non-vegflag"><span></span></div>';
                }
                if(varia['recommended'] == 1){
                    featuredList += '<span class="tag-bestseller"><span>Bestseller</span></span>';
                }
                if(varia['newItem'] == 1){
                    featuredList += '<span class="tag-new"><span>New</span></span>';
                }
                if(varia['custom_tags'] && varia['custom_tags'] != null)
                    {
                        var tagsArray = varia['custom_tags'].split(',');
                        tagsArray.forEach(element => {
                                featuredList += '<span class="tag-limited-edition">'+ element +'</span>';
                        });
                        
                    }
                featuredList += '</div>';
                if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<div class="item-heading" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"> <h4 class="item-title">' + varia['searchString'] + '</h4>';
                }else{
                    featuredList += '<div class="item-heading" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"> <h4 class="item-title">' + varia['searchString'] + '</h4>';
                }
                featuredList += '</div>';
                /*if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<span style="color:#9EA2A1;font size:13px;">Customisable</span>';
                }*/

                featuredList += '<div class="cart-btn-outer">';
                featuredList += '<div>';
                if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null' && Math.round(varia['sp']) != Math.round(varia['mrp']) && Math.round(varia['mrp']) != 0) {
                    featuredList += '<p class="price-p" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + '' + Math.round(varia['sp']) + '</p>';
                }else if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<p class="price-p" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">' + currency + ' ' + Math.round(varia['sp']) + '</p>';
                }else if (Math.round(varia['sp']) != Math.round(varia['mrp']) && Math.round(varia['mrp']) != 0) {
                    featuredList += '<p class="price-p" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + '' + Math.round(varia['sp']) + '</p>';
                } else {
                    featuredList += '<p class="price-p" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">' + currency + ' ' + Math.round(varia['sp']) + '</p>';
                }

                if(aiFlag == 1){
                    featuredList +='<p style="font-size: 11px;line-height: initial;font-weight: 400;padding-top: 0px !important;display: block;width: 100%;margin-bottom: 0px;">(Inc. of all taxes)</p>';
                }

                featuredList += '</div>';

                featuredList += '<div class="text-center">';
                featuredList += '<div class="cart-new-btn">';
                if (varia['viewType'] == 3) {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" id="btn-' + varia['id'] + '">ADD +</div>';

                }else if (varia['viewType'] == 2) {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" id="btn-' + varia['id'] + '">ADD +</div>';

                } else {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" id="feabtn-' + varia['id'] + '">ADD +</div>';
                    featuredList += '<div class="quantity-btn"  id="feadiv-' + varia['id'] + '"style="display:none !Important;" ><div class="_29Y5Z _20vNm " id="qty_minus" onclick="deleteFromDiv(' + varia['id'] + ')"></div>';
                    featuredList += '<input type="hidden"  value="update" class="1"><input type="text"  id="feaqty-input-' + varia['id'] + '"class=" _2zAXs _2quy-" id="" readonly="" value="1">';
                    featuredList += '<div class="_1ds9T _2WdfZ" id="qty_plus" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">+</div></div>'
                }

                featuredList += '<div class="y9uHb theo-toggle" id="feabar' + varia['id'] + '"style="display:none"></div>';

                featuredList += '</div>';

                if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<span style="color:#9EA2A1;font-size:13px;display: block;">Customisable</span>';
                }

                featuredList += '</div>';

                featuredList +='</div>';
                featuredList += '<div class="available-next d-none" style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 90%;bottom: 15px;left: 50%;transform: translate(-50%, 0%);font-size: 12px;line-height: normal;padding: 5px 0;">Next available at '+ end_hour +'</div>';
                featuredList += '</div></div></div>';
            } else {
              
                featuredList += `<div class="featured-outer position-relative">`;
                // if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<div class="featured-card" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                // }else{
                    // featuredList += '<div class="featured-card" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                // }
                featuredList += '<div class="bg-span"></div>';
                var item_image = varia['image'];
                if (varia['image'] != null && varia['image'] != '') {
                        
                featuredList += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + item_image + '" alt="' + varia['itemName'] + '" class="bestseller-placeholder" width="400" height="400" >';
                
                    
                } else {
                    featuredList += '<img src="' + bLogo + '" alt="' + varia['itemName'] + '" style="filter: grayscale(0.9);" class="bestseller-placeholder"width="400" height="400" >';
                }
                if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
                    checkFoodType.push(varia['vegNonvegBoth']);
                }
                featuredList += '<div class="featured-upper">';

                featuredList += '<div class="d-flex align-items-center mb-2">';
                if (varia['vegNonvegBoth'] == 'veg') {
                    featuredList += '<div class="veg-flag"><span></span></div>';
                } else if (varia['vegNonvegBoth'] == 'non-veg') {
                    featuredList += '<div class="non-vegflag"><span></span></div>';
                }
                if(varia['recommended'] == 1){
                    featuredList += '<span class="tag-bestseller"><span>Bestseller</span></span>';
                }
                if(varia['newItem'] == 1){
                    featuredList += '<span class="tag-new"><span>New</span></span>';
                }
                if(varia['custom_tags'] && varia['custom_tags'] != null)
                    {
                        var tagsArray = varia['custom_tags'].split(',');
                        tagsArray.forEach(element => {
                                featuredList += '<span class="tag-limited-edition">'+ element +'</span>';
                        });
                        
                    }
                featuredList += '</div>';
                featuredList += '<h4 class="item-title">' + varia['searchString'] + '</h4>';
                featuredList += '</div></div>';
                if(outlet_open != 1){
                    featuredList += '<div class="featured-lower d-flex justify-content-between align-items-center" style="bottom:45px">';
                }else{
                    featuredList += '<div class="featured-lower d-flex justify-content-between align-items-center">';
                }


                if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<div onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                    
                } else {
                    featuredList += '<div onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')">';
                    
                }
                if (Math.round(varia['sp']) != Math.round(varia['mrp']) && Math.round(varia['mrp']) != 0) {
                    featuredList += '<p class="price-p" ><small style="color: #848484; font-size: 85%;"><s> ' + currency + '' + Math.round(varia['mrp']) + '</s></small> ' + currency + '' + Math.round(varia['sp']) + '</p>';
                } else {
                    featuredList += '<p class="price-p">' + currency + ' ' + Math.round(varia['sp']) + '</p>';
                }
                if(aiFlag == 1){
                    featuredList +='<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #fff;padding-top: 0px !important;">(Inc. of all taxes)</p>';
                }
                featuredList += '</div>';
                featuredList += '<div class="text-right">';
                if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                    featuredList += '<p class="mb-0 customisa">Customizable</p>';
                }
                featuredList += '<div class="d-flex">';
                featuredList += '<div class="cart-new-btn">';
                if (varia['viewType'] == 3) {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" id="btn-' + varia['id'] + '">ADD +</div>';

                }else if (varia['viewType'] == 2) {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" id="btn-' + varia['id'] + '">ADD +</div>';

                } else {
                    featuredList += '<div class="cart-count-add cart-btn" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')" id="feabtn-' + varia['id'] + '">ADD +</div>';
                    featuredList += '<div class="quantity-btn" id="feadiv-' + varia['id'] + '"style="display:none !Important;" ><div class="_29Y5Z _20vNm " id="qty_minus" onclick="deleteFromDiv(' + varia['id'] + ')"></div>';
                    featuredList += '<input type="hidden"  value="update" class="1"><input type="text"  id="feaqty-input-' + varia['id'] + '"class=" _2zAXs _2quy-" id="" readonly="" value="1">';
                    featuredList += '<div class="_1ds9T _2WdfZ" id="qty_plus" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')">+</div></div>'
                }
                featuredList += '<div class="y9uHb theo-toggle" id="feabar' + varia['id'] + '"style="display:none"></div>';
                featuredList += '</div>';


                featuredList += '</div></div></div>';
                featuredList += '<div class="available-next d-none" style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 90%;bottom: 15px;left: 50%;transform: translate(-50%, 0%);font-size: 12px;line-height: normal;padding: 5px 0;">Next available at '+ end_hour +'</div>';
                featuredList +='</div>';
            }
            if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                featuredListSearch += '<li><div class="ps-image-outer" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;"><div class="ps-image">';
            }else{
                featuredListSearch += '<li><div class="ps-image-outer" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;"><div class="ps-image">';
            }
            

            var item_image = varia['image'];
            if (varia['image'] != null && varia['image'] != '') {
                    
                featuredListSearch += '<img src="https://cdn.uengage.io/uploads/' + parentId + '/' + item_image + '" alt="' + varia['itemName'] + '" class="bestseller-placeholder" width="50" height="40">';
                
                
            } else {
                featuredListSearch += '<img src="' + bLogo + '" alt="' + varia['itemName'] + '" style="filter: grayscale(0.9);" class="bestseller-placeholder" width="50" height="40">';
            }
            if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
                checkFoodType.push(varia['vegNonvegBoth']);
            }

            if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 'null') {
                featuredListSearch += '</div></div><div class="ps-discription" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
            }else{
                featuredListSearch += '</div></div><div class="ps-discription" onclick="getItemDetails(' + varia['id'] + ',' + varia['sectionId'] + ')" data-dismiss="modal" style="cursor: pointer;">';
            }
            
            if (varia['vegNonvegBoth'] == 'veg') {
                featuredListSearch += '<div class="veg-flag"><span></span></div>';
            } else if (varia['vegNonvegBoth'] == 'non-veg') {
                featuredListSearch += '<div class="non-vegflag"><span></span></div>';
            }
            // featuredListSearch += varia['itemName'] + '<img src="' + origin + '/assets/wla_new/img/growth-graph.png" alt="Growth graph" width="15" height="15"></div></li>';
            featuredListSearch += varia['itemName'] + '<img src="' + origin + '/assets/wla_new/img/growth-graph.png" alt="Growth graph" width="15" height="15"></div></li>';

        }

        featuredListSearch += '</ul>';

        sectionList += '<div class="sub-part-outer"><a class="subcategories" onclick="scrollToSection(\'featuredProducts\')" lid="featuredProducts" id="featuredProducts-li"><div class="overlay-tp-hd"></div><span class="sm-img"><span><div class="icon-ff"><i class="las la-heart"></i></div></span><span>Featured Items</span></span> <span class="count-n">(' + popular.length + ')</span></a></div>'

        sectionList_sec += '<li class="nav-item"><a class="nav-link" onclick="scrollToSection(\'featuredProducts\')" id="featuredProducts-li">Featured Items</a></li>'
    } else {
        $('#featuredProducts').hide();
        $('#featuredProducts').removeClass('page-section common-top-bottom common-right-left pr-0');
        $('#featuredProductsSearch').hide();
    }


    for (var tmp = 0; tmp < menu.length; tmp++) {
        for (var j = menu[tmp]['items'].length - 1; j >= 0; j--) {

            if (menu[tmp]['items'][j] && menu[tmp]['items'][j]['variants'] && menu[tmp]['items'][j]['variants'].length > 0) {
                if (val.find(f => f == 1) && val.find(f => f == 2)) {

                } else if (val.find(f => f == 1)) {
                    menu[tmp]['items'][j]['variants'] = data.rows.menu[tmp]['items'][j]['variants'].filter(m => m.vegNonvegBoth == 'veg' || m.vegNonvegBoth == 'veg');
                } else if (val.find(f => f == 2)) {
                    menu[tmp]['items'][j]['variants'] = data.rows.menu[tmp]['items'][j]['variants'].filter(m => m.vegNonvegBoth == 'non-veg');
                    // continue;
                }

                if (menu[tmp]['items'][j]['variants'].length == 0) {
                    menu[tmp]['items'].splice(j, 1);
                }

            } else {
                if (val.find(f => f == 1) && val.find(f => f == 2)) {

                } else if (val.find(f => f == 1)) {
                    menu[tmp]['items'] = data.rows.menu[tmp]['items'].filter(m => m.vegNonvegBoth == 'veg' || m.vegNonvegBoth == 'veg');
                } else if (val.find(f => f == 2)) {
                    menu[tmp]['items'] = data.rows.menu[tmp]['items'].filter(m => m.vegNonvegBoth == 'non-veg');
                    // continue;
                }
            }

        }
        // for (var k = 0; k < menu[i]['items'][j]['variants'].length; k++) {

    }

    for (var i = 0; i < menu.length; i++) {


        if (categoryId == 4) {

            // && (menu[i]['items'][0]['sp'] != 0 || menu[i]['items'][0].variants.length > 0 || menu[i]['items'][0].viewType == 2)) {
            if(menu[i]['items'].length > 0 && (!menu[i].hasOwnProperty('is_subscription') || (menu[i].hasOwnProperty('is_subscription') && menu[i]['is_subscription'] == 0)) && menu[i]['type'] == 4){
                sectionListSearch += '<li>';
                sectionListSearch += '<a onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li" style="cursor:pointer;">';
                sectionListSearch += '<div class="category-outer-nw">';
                if (menu[i]['image'] != null && menu[i]['image'] != '') {
                    var img_url_search = 'https://cdn.uengage.io/uploads/' + pId + '/' + menu[i]['image'];
                    sectionListSearch += '<img src="' + img_url_search + '"  alt="' + menu[i]['sectionName'] + '" width="400" height="400">';
                } else {
                    sectionListSearch += '<img src="' + bLogo + '" alt="' + menu[i]['sectionName'] + '" style="filter: grayscale(0.9);" width="400" height="400">';
                }
                sectionListSearch += '</div>';
                sectionListSearch += '<h4>' + menu[i]['sectionName'] + '</h4>';
                sectionListSearch += '</a>';
                sectionListSearch += '</li>';

                sectionList += '<div class="sub-part-outer">';
                if (screen.width < 991 && menu[i]['items'].length > 1) {

                    let hasVariants = false;
        
                    for (let j = 0; j < menu[i]['items'].length; j++) {
                        if (menu[i]['items'][j]['variants'] && menu[i]['items'][j]['variants'].length > 0) {
                            hasVariants = true;
                            break;
                        }
                    }
                    
                    if (hasVariants) {
                        sectionList += '<a class="subcategories" onclick = "toggleSub(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
                    }else{
                        sectionList += '<a class="subcategories" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
                    }
                    
                }else{
                    sectionList += '<a class="subcategories" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
                }
                
                sectionList += '<div class="overlay-tp-hd"></div><span class="sm-img"><span>';
                if (menu[i]['image'] != null && menu[i]['image'] != '') {
                var img_url = 'https://cdn.uengage.io/uploads/' + pId + '/' + menu[i]['image'];
                
                    
                    sectionList += '<img src="' + img_url + '"  alt="' + menu[i]['sectionName'] + '" width="45" height="45">';


                } else {
                    sectionList += '<img src="' + bLogo + '" alt="' + menu[i]['sectionName'] + '" style="filter: grayscale(0.9);" width="45" height="45">';
                }
                sectionList += '</span> <span><span style="display: inline;width: auto;">' + menu[i]['sectionName'] + '</span>' ;

                if (screen.width < 991 && menu[i]['items'].length > 1) {

                    let hasVariants = false;
        
                    for (let j = 0; j < menu[i]['items'].length; j++) {
                        if (menu[i]['items'][j]['variants'] && menu[i]['items'][j]['variants'].length > 0) {
                            hasVariants = true;
                            break;
                        }
                    }
                    
                    if (hasVariants) {
                        sectionList += '<span class="d-lg-none" id= "open-'+ menu[i]['sectionId'] +'" style="display:inline !important"><span style="display: inline-flex;border-radius: 50px;background-color: var(--main-bg-color);width: 18px;height: 18px;align-items: center;justify-content: center;margin-left: 5px;"><i class="las la-plus" style="font-size: 15px;"></i></span></span>';
                        sectionList += '<span class="d-lg-none" id= "close-'+ menu[i]['sectionId'] +'" style="display:none !important"><span style="display: inline-flex;border-radius: 50px;background-color: var(--main-bg-color);width: 18px;height: 18px;align-items: center;justify-content: center;margin-left: 5px;"><i class="las la-minus" style="font-size: 15px;"></i></span></span>';
                    }
                    
                }

                sectionList +='</span></span> <span class="count-n">';

                var l = 0;
                let sub_cat = "";

                for (var p = 0; p < menu[i]['items'].length; p++) {
                        if (menu[i]['items'][p]['variants'] != undefined && menu[i]['items'][p]['variants'].length > 0) {
                            l = l + menu[i]['items'][p]['variants'].length;
        
                            sub_cat += `<a class="subcategories sub_cat"  style="justify-content:space-between;" onclick="scrollToSection(${menu[i]['sectionId']}, ${menu[i]['items'][p]['id']})" id="${menu[i]['sectionId']}-${menu[i]['items'][p]['id']}-li">`
        
                            sub_cat += `<span>${menu[i]['items'][p]['itemName']}</span>`;
                        } else {
                            l++;
                        }
                    
                    
                }

                sectionList += '(' + l + ')</span></a>';
                if(menu[i]['items'].length > 1){
                    sectionList += `<div class="sub-part-cat" id="sub-cat-${menu[i]['sectionId']}-li">`;
                    sectionList += sub_cat;
                    sectionList += `</div>`;
                }
            
                sectionList += `</div>`;


                sectionList_sec += '<li class="nav-item"><a class="nav-link" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" id="' + menu[i]['sectionId'] + '-li">' + menu[i]['sectionName'] + '</a></li>';
                itemList += ' <div class="page-section" id="' + menu[i]['sectionId'] + '">';
                if(pId != 7175){
                    itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
                }
                itemList += '<div class="inner-sub-page-sec"><div class="row">';
                for (var j = 0; j < menu[i]['items'].length; j++) {
                    if (menu[i]['items'][j]['variants'] != undefined && menu[i]['items'][j]['variants'].length > 0) {
                        if(pId == 7175){
                            if (menu[i]['items'].length > 1) {
                                itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span  id="' + menu[i]['items'][j]['id'] + '">' + menu[i]['sectionName'] + ' <br><span style="padding: 0px;display:contents">('+ menu[i]['items'][j]['itemName'] +')</span></span></h3>';
                            }else{
                                itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
                            }
                        }else{
                            itemList += '<h4 class="w-100 text-center sub-heading" style="color: #4F4F4D; font-weight: 300; font-size: 16px;" id="' + menu[i]['items'][j]['id'] + '">'+ menu[i]['items'][j]['itemName'] +'</h4>';
                        }
                        
                        for (var k = 0; k < menu[i]['items'][j]['variants'].length; k++) {
                            var varia = menu[i]['items'][j]['variants'][k];
                            var itemName = menu[i]['sectionName'];
                            if (itemName.toLowerCase().includes("slash")) {
                                itemList = slashAppend(varia, itemList);
                            } else {
                                itemList = itemAppend(varia, itemList);
                            }

                        }

                    } else {
                        if(pId == 7175){
                            itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
                        }
                        var varia = menu[i]['items'][j];
                        var itemName = menu[i]['sectionName'];
                        if (itemName.toLowerCase().includes("slash")) {
                            itemList = slashAppend(varia, itemList);
                        } else {
                            itemList = itemAppend(varia, itemList);
                        }
                    }

                }
                itemList += '</div></div></div>';
            }
        }else if (menu[i]['items'].length > 0 && (!menu[i].hasOwnProperty('is_subscription') || (menu[i].hasOwnProperty('is_subscription') && menu[i]['is_subscription'] == 0))) {

            // && (menu[i]['items'][0]['sp'] != 0 || menu[i]['items'][0].variants.length > 0 || menu[i]['items'][0].viewType == 2)) {

            sectionListSearch += '<li>';
            sectionListSearch += '<a onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li" style="cursor:pointer;">';
            sectionListSearch += '<div class="category-outer-nw">';
            if (menu[i]['image'] != null && menu[i]['image'] != '') {
                var img_url_search = 'https://cdn.uengage.io/uploads/' + pId + '/' + menu[i]['image'];
                sectionListSearch += '<img src="' + img_url_search + '"  alt="' + menu[i]['sectionName'] + '" width="400" height="400">';
            } else {
                sectionListSearch += '<img src="' + bLogo + '" alt="' + menu[i]['sectionName'] + '" style="filter: grayscale(0.9);" width="400" height="400">';
            }
            sectionListSearch += '</div>';
			sectionListSearch += '<h4>' + menu[i]['sectionName'] + '</h4>';
			sectionListSearch += '</a>';
			sectionListSearch += '</li>';

            sectionList += '<div class="sub-part-outer">';
            if (screen.width < 991 && menu[i]['items'].length > 1) {

                let hasVariants = false;
    
                for (let j = 0; j < menu[i]['items'].length; j++) {
                    if (menu[i]['items'][j]['variants'] && menu[i]['items'][j]['variants'].length > 0) {
                        hasVariants = true;
                        break;
                    }
                }
                
                if (hasVariants) {
                    sectionList += '<a class="subcategories" onclick = "toggleSub(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
                }else{
                    sectionList += '<a class="subcategories" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
                }
                
            }else{
                sectionList += '<a class="subcategories" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" lid="' + menu[i]['sectionId'] + '" id="' + menu[i]['sectionId'] + '-li">';
            }
            
            sectionList += '<div class="overlay-tp-hd"></div><span class="sm-img"><span>';
            if (menu[i]['image'] != null && menu[i]['image'] != '') {
            var img_url = 'https://cdn.uengage.io/uploads/' + pId + '/' + menu[i]['image'];
            
                
                sectionList += '<img src="' + img_url + '"  alt="' + menu[i]['sectionName'] + '" width="45" height="45">';


            } else {
                sectionList += '<img src="' + bLogo + '" alt="' + menu[i]['sectionName'] + '" style="filter: grayscale(0.9);" width="45" height="45">';
            }
            sectionList += '</span> <span><span style="display: inline;width: auto;">' + menu[i]['sectionName'] + '</span>' ;

            if (screen.width < 991 && menu[i]['items'].length > 1) {

                let hasVariants = false;
    
                for (let j = 0; j < menu[i]['items'].length; j++) {
                    if (menu[i]['items'][j]['variants'] && menu[i]['items'][j]['variants'].length > 0) {
                        hasVariants = true;
                        break;
                    }
                }
                
                if (hasVariants) {
                    sectionList += '<span class="d-lg-none" id= "open-'+ menu[i]['sectionId'] +'" style="display:inline !important"><span style="display: inline-flex;border-radius: 50px;background-color: var(--main-bg-color);width: 18px;height: 18px;align-items: center;justify-content: center;margin-left: 5px;"><i class="las la-plus" style="font-size: 15px;"></i></span></span>';
                    sectionList += '<span class="d-lg-none" id= "close-'+ menu[i]['sectionId'] +'" style="display:none !important"><span style="display: inline-flex;border-radius: 50px;background-color: var(--main-bg-color);width: 18px;height: 18px;align-items: center;justify-content: center;margin-left: 5px;"><i class="las la-minus" style="font-size: 15px;"></i></span></span>';
                }
                
            }

            sectionList +='</span></span> <span class="count-n">';

            var l = 0;
            let sub_cat = "";

            for (var p = 0; p < menu[i]['items'].length; p++) {
                    if (menu[i]['items'][p]['variants'] != undefined && menu[i]['items'][p]['variants'].length > 0) {
                        l = l + menu[i]['items'][p]['variants'].length;
    
                        sub_cat += `<a class="subcategories sub_cat"  style="justify-content:space-between;" onclick="scrollToSection(${menu[i]['sectionId']}, ${menu[i]['items'][p]['id']})" id="${menu[i]['sectionId']}-${menu[i]['items'][p]['id']}-li">`
    
                        sub_cat += `<span>${menu[i]['items'][p]['itemName']}</span>`;
                    } else {
                        l++;
                    }
                
                
            }

            sectionList += '(' + l + ')</span></a>';
            if(menu[i]['items'].length > 1){
                sectionList += `<div class="sub-part-cat" id="sub-cat-${menu[i]['sectionId']}-li">`;
                sectionList += sub_cat;
                sectionList += `</div>`;
            }
        
            sectionList += `</div>`;


            sectionList_sec += '<li class="nav-item"><a class="nav-link" onclick="scrollToSection(' + menu[i]['sectionId'] + ')" id="' + menu[i]['sectionId'] + '-li">' + menu[i]['sectionName'] + '</a></li>';
            itemList += ' <div class="page-section" id="' + menu[i]['sectionId'] + '">';
            if(pId != 7175){
                itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
            }
            itemList += '<div class="inner-sub-page-sec"><div class="row">';
            for (var j = 0; j < menu[i]['items'].length; j++) {
                if (menu[i]['items'][j]['variants'] != undefined && menu[i]['items'][j]['variants'].length > 0) {
                    if(pId == 7175){
                        if (menu[i]['items'].length > 1) {
                            itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span  id="' + menu[i]['items'][j]['id'] + '">' + menu[i]['sectionName'] + ' <br><span style="padding: 0px;display:contents">('+ menu[i]['items'][j]['itemName'] +')</span></span></h3>';
                        }else{
                            itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
                        }
                    }else{
                        itemList += '<h4 class="w-100 text-center sub-heading" style="color: #4F4F4D; font-weight: 300; font-size: 16px;" id="' + menu[i]['items'][j]['id'] + '">'+ menu[i]['items'][j]['itemName'] +'</h4>';
                    }
                    
                    for (var k = 0; k < menu[i]['items'][j]['variants'].length; k++) {
                        var varia = menu[i]['items'][j]['variants'][k];
                        var itemName = menu[i]['sectionName'];
                        if (itemName.toLowerCase().includes("slash")) {
                            itemList = slashAppend(varia, itemList);
                        } else {
                            itemList = itemAppend(varia, itemList);
                        }

                    }

                } else {
                    if(pId == 7175){
                        itemList += '<h3 class="wla-outlet-name-md-two w-100 common-heading mb-0"><span>' + menu[i]['sectionName'] + '</span></h3>';
                    }
                    var varia = menu[i]['items'][j];
                    var itemName = menu[i]['sectionName'];
                    if (itemName.toLowerCase().includes("slash")) {
                        itemList = slashAppend(varia, itemList);
                    } else {
                        itemList = itemAppend(varia, itemList);
                    }
                }

            }
            itemList += '</div></div></div>';
        }
    }
    if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
        add_to_cart('view', '');
    }
    $('#featuredList').html('');
    $('#featuredList').html(featuredList);
    $('#category_menu').html(sectionListSearch);
    $('.scroller').html("");
    $('.scroller').html(sectionList_sec);
    $('#featuredListSearch').html('');
    $('#featuredListSearch').html(featuredListSearch);
    $('#sectionList').html("");
    $('#sectionList').html(sectionList);
    $('#sectionList1').html("");
    $('#sectionList1').html(sectionList);
    //   sectionListModal
    $('#productList').html("");
    $('#productList').html(itemList);
    $('.lmask').hide();
    $("button.addItem").click(function(e) {
        // Do something
        e.stopPropagation(); /* vikram  */
    });
    $("button.featuredBtn").click(function(e) {
        // Do something
        e.stopPropagation(); /* vikram  */
    });
    $('.spinner').hide();
    res.forEach(obj => {
        if ($('#btn-' + obj['itemId']).length > 0) {
        if ($('#div-' + obj['itemId']).length > 0) {
            $('#btn-' + obj['itemId']).hide();
            $('#div-' + obj['itemId']).show();
            $('#feabtn-' + obj['itemId']).hide();
            $('#feadiv-' + obj['itemId']).show();
            var q = res.filter(e => e.itemId == obj['itemId']).reduce((total, obj) => parseInt(obj.qty) + parseInt(total), 0)
            $('#qty-input-' + obj['itemId']).val(q);
            $('#feaqty-input-' + obj['itemId']).val(q);
        }
        } else {
            if ($('#div-' + obj['pId']).length > 0) {
            $('#btn-' + obj['pId']).hide();
            $('#div-' + obj['pId']).show();
            $('#feabtn-' + obj['pId']).hide();
            $('#feadiv-' + obj['pId']).show();
            var q = res.filter(e => e.pId == obj['pId']).reduce((total, obj) => parseInt(obj.qty) + parseInt(total), 0)
            $('#qty-input-' + obj['pId']).val(q);
            $('#feaqty-input-' + obj['pId']).val(q);
            }
        }

    });

    if (screen.width < 991) {
            $('#sub-part-cat').hide();
            var subcategories = document.querySelectorAll('.subcategories');
            // Remove "active" class from all elements
            subcategories.forEach(function(element) {
                element.classList.remove('active');
            });
    }

    if (outlet_open != 1) {
        $('.cart-new-btn').addClass('d-none');
        $('.price-checkout').addClass('disabled');
        $('.price_mobile').addClass('disabled');
        $('.order-type').addClass('disabled');
        $('.available-next').removeClass('d-none');
    } else {
        $('.cart-new-btn').removeClass('d-none');
        $('.price-checkout').removeClass('disabled');
        $('.price_mobile').removeClass('disabled');
        $('.order-type').removeClass('disabled');
        $('.available-next').addClass('d-none');
    }
}else{
    $('.spinner').hide();
    $('#coming_menu').show();
    $('.wla-main-section').hide();
    return false;
}

}

function slashAppend(varia, itemList) {
    itemList += '<div class="col-md-4 col-12 outer-item-dv-new"><div class="item-dts-new"><div class="item-nw-outer-new">';
    var item_image = '';
    var null_img = '';
    if (varia['image'] != null && varia['image'] != '') {
            item_image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + varia['image'];
    
    } else {
        item_image = 'https://static.uengage.in/uploads/1/image-341933-1673851041.jpeg';
        null_img='null_img';
    }
    if (item_image != null && item_image != '') {
        if (varia['viewType'] == 3) {
            itemList += '<div class="item-nw-placeholder-outer" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
        }else if (varia['viewType'] == 2) {
            itemList += '<div class="item-nw-placeholder-outer" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
        } else {
            if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                itemList += '<div class="item-nw-placeholder-outer" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">';
            } else {
                itemList += '<div class="item-nw-placeholder-outer" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">';
            }
        }


        itemList += '<div class="item-nw-placeholder">';
        itemList += '<img class="'+null_img+'" src=' + item_image + '  alt="' + varia['itemName'] + '" width="84" height="82">';
        itemList += '</div>';
        itemList += '</div>';
    }
    if (varia['image'] != null && varia['image'] != '') {
        itemList += '<div class="item-content"><div class="item-details">';
    } else {
        itemList += '<div class="item-content" style="-ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%"><div class="item-details item-details-single">';
    }
    itemList += '<div>';
    itemList += '<div class="d-flex align-items-center mb-2">';
    if (item_image != null && item_image != '') {
        if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
            checkFoodType.push(varia['vegNonvegBoth']);
        }
        if (varia['vegNonvegBoth'] == 'veg') {
            itemList += '<div class="veg-flag" style="margin-right:3px;">';
            itemList += '<span></span>';
            itemList += '</div>';
        } else if (varia['vegNonvegBoth'] == 'non-veg') {
            itemList += '<div class="non-vegflag" style="margin-right:3px;">';
            itemList += '<span></span>';
            itemList += '</div>';
        }
    } else {
        if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
            checkFoodType.push(varia['vegNonvegBoth']);
        }
        if (varia['vegNonvegBoth'] == 'veg') {
            if (varia['viewType'] == 3) {
                itemList += '<div class="veg-flag" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            }else if (varia['viewType'] == 2) {
                itemList += '<div class="veg-flag" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            } else {
                if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                    itemList += '<div class="veg-flag" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                } else {
                    itemList += '<div class="veg-flag" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                }
            }
        } else if (varia['vegNonvegBoth'] == 'non-veg') {
            if (varia['viewType'] == 3) {
                itemList += '<div class="non-vegflag" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            }else if (varia['viewType'] == 2) {
                itemList += '<div class="non-vegflag" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            } else {
                if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                    itemList += '<div class="non-vegflag" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                } else {
                    itemList += '<div class="non-vegflag" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                }
            }
        }
    }
    if (varia['recommended'] != null && varia['recommended'] != undefined && varia['recommended'] == '1') {
            itemList += '<span class="tag-bestseller"><span>Bestseller</span></span>';
    } 
    if (varia['newItem'] != null && varia['newItem'] != undefined && varia['newItem'] == '1') {
            itemList += '<span class="tag-new"><span>New</span></span>';
    }

    if(varia['custom_tags'] && varia['custom_tags'] != null)
    {
        var tagsArray = varia['custom_tags'].split(',');
        tagsArray.forEach(element => {
            if (pId == 7175) {
                itemList += '<span class="tag-limited-edition">'+ element +'</span>';
            } else {
                itemList += '<span class="tag-limited-edition">'+ element +'</span>';
            }
            
        });
        
    }

    itemList += '</div>';
    if (varia['viewType'] == 3) {
        itemList += '<div onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
    }else if (varia['viewType'] == 2) {
        itemList += '<div onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
    } else {
        if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
            itemList += '<div class="item-heading" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
        } else {
            itemList += '<div class="item-heading" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
        }
    }

    itemList += '<div class="item-tt-outer">';
    itemList += '<h4 class="item-title">' + varia['itemName'] + '</h4>';
    itemList += '</div> </div>';
    if (varia['description'] != '' && varia['description'] != null && varia['description'] != 'null') {
        var ellipsis = '<span class="expand_details" onclick="expand_description(' + varia['id'] + ')">...Read more</span>';
        var expand_less = '<span class="expand_details" onclick="collapse_description(' + varia['id'] + ')">...Read less</span>';
        var maxLength = 70;
        var text = $.trim(varia['description']);
        if (text.length > maxLength) {
            text_sub = text.substring(0, maxLength);
            itemList += "<p class='heading-customize less" + varia['id'] + "'>" + text_sub.substring(0, text.lastIndexOf(" ")) + ellipsis + "</p>";
            itemList += "<p class='heading-customize more" + varia['id'] + " d-none'>" + text + expand_less + "</p>";
        } else {
            itemList += "<p class='heading-customize '>" + text + "</p>";
        }
    }

    if (varia['variant_count'] > 0) {

        if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
            itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
        }
    } else {
        if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 'null') {
            itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
        }
    }

    var num = parseFloat(varia["avgRating"]);
    if (num != undefined && num > 3) {
        var rat = Math.ceil(num);
        itemList += '<div>';
        for (var a = 0; a < rat; a++) {
            itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
        }
        itemList += '</div>';

    }

    itemList += '</div>';
    itemList += '<div class="cart-btn-outer">';
    itemList += '<span style="display:inline-block">';

    if (varia['viewType'] == 3) {
        itemList += '<p class="price-p" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
    }else if (varia['viewType'] == 2) {
        itemList += '<p class="price-p" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
    } else {
        if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
            itemList += '<p class="price-p" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">';
        } else {
            itemList += '<p class="price-p" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">';
        }
    }

    if (varia['variantsAvailable'] > 0) {

        if (varia['dynamic_combo'] == 1) {
            itemList += '<span style="font-size: 12px; color: #5c5c5c; display:inline-block">Starting @</span>' + currency + '' + Math.round(Math.min.apply(null, varia['variants'].map(item => item.sp)));
        } else {
            itemList += ' ' + currency + '' + Math.round(Math.min.apply(null, varia['variants'].map(item => item.sp)));
        }

    } else {

        if (varia['dynamic_combo'] == 1) {
            if (varia['sp'] != varia['mrp'] && varia['mrp'] != 0) {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> <small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + '' + Math.round(varia['sp']);
            } else {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> ' + currency + '' + Math.round(varia['sp']);
            }
        } else if (Math.round(varia['sp']) != Math.round(varia['mrp']) && Math.round(varia['mrp']) != 0) {
            itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + Math.round(varia['mrp']) + '</s></small>' + currency + '' + Math.round(varia['sp']);
        } else {
            itemList += currency + '' + Math.round(varia['sp']);
        }
    }

    itemList += '</p>';
    if(aiFlag == 1){
        itemList += '<p class="price-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
    }
    itemList += '</span>';
    itemList += '<span>';
    itemList += '<div class="cart-new-btn">';
    if (varia['viewType'] == 3) {
        itemList += '<div class="cart-count-add cart-btn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" >ADD +</div>';

    }else if (varia['viewType'] == 2) {
        itemList += '<div class="cart-count-add cart-btn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" >ADD +</div>';

    } else {
        itemList += '<div class="cart-count-add cart-btn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" id="btn-' + varia['id'] + '">ADD +</div>';
        itemList += '<div class="quantity-btn" id="div-' + varia['id'] + '"style="display:none !Important;" ><div class="_29Y5Z _20vNm " id="qty_minus" onclick="deleteFromDiv(' + varia['id'] + ')"></div>';
        itemList += '<input type="hidden"  value="update" class="1"><input type="text"  id="qty-input-' + varia['id'] + '"class=" _2zAXs _2quy-" id="" readonly="" value="1">';
        itemList += '<div class="_1ds9T _2WdfZ" id="qty_plus" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">+</div></div>'
    }
    itemList += '<div class="y9uHb theo-toggle" id="bar' + varia['id'] + '"style="display:none"></div>';

    itemList += '</div> </span>';
    itemList += '<div class="available-next d-none" style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 100%;bottom: 0px;left: 0px;">Next available at '+ end_hour +'</div>';
    itemList +='</div></div></div></div></div></div>';

    return itemList;
}

function itemAppend(varia, itemList) {
    var item_image = '';
    if (varia['image'] != null && varia['image'] != '') {
        
        item_image = 'https://cdn.uengage.io/uploads/' + parentId + '/' + varia['image'];
        
        
    }
    
    if(outlet_open !=1){
        itemList += '<div class="col-md-6 item-card-design-new outlet-closed" id="item-'+varia['id']+'">';
    }else{
        itemList += '<div class="col-md-6 item-card-design-new" id="item-'+varia['id']+'">';
    }

    if (varia['variant_count'] > 0) {

        if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
            itemList += '<div class="item-card-design-new-start-outer customization-avail">';
        }
        else {
            itemList += '<div class="item-card-design-new-start-outer">';
        }
    } else {
        if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 'null') {
            itemList += '<div class="item-card-design-new-start-outer customization-avail">';
        }
        else {
            itemList += '<div class="item-card-design-new-start-outer">';
        }
    }
    
    itemList += '<div class="item-card-design-new-start">';


    if (item_image == '') {
        itemList += '<div class="item-card-design-detail-new item-without-img">';
    } else {
        itemList += '<div class="item-card-design-detail-new">';
    }

    itemList += '<div>';

    itemList += '<div class="d-flex align-items-center mb-2">';
    if (item_image != null && item_image != '') {
        if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
            checkFoodType.push(varia['vegNonvegBoth']);
        }
        if (varia['vegNonvegBoth'] == 'veg') {
            itemList += '<div class="veg-flag" style="margin-right:3px;">';
            itemList += '<span></span>';
            itemList += '</div>';
        } else if (varia['vegNonvegBoth'] == 'non-veg') {
            itemList += '<div class="non-vegflag" style="margin-right:3px;">';
            itemList += '<span></span>';
            itemList += '</div>';
        }
    } else {
        if (varia['vegNonvegBoth'] != "" && checkFoodType.includes(varia['vegNonvegBoth']) == false) {
            checkFoodType.push(varia['vegNonvegBoth']);
        }
        if (varia['vegNonvegBoth'] == 'veg') {
            if (varia['viewType'] == 3) {
                itemList += '<div class="veg-flag" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            }else if (varia['viewType'] == 2) {
                itemList += '<div class="veg-flag" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            } else {
                if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                    itemList += '<div class="veg-flag" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                } else {
                    itemList += '<div class="veg-flag" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                }
            }
        } else if (varia['vegNonvegBoth'] == 'non-veg') {
            if (varia['viewType'] == 3) {
                itemList += '<div class="non-vegflag" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            }else if (varia['viewType'] == 2) {
                itemList += '<div class="non-vegflag" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')"><span></span></div>';
            } else {
                if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                    itemList += '<div class="non-vegflag" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                } else {
                    itemList += '<div class="non-vegflag" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')"><span></span></div>';
                }
            }
        }
    }

    if (varia['recommended'] != null && varia['recommended'] != undefined && varia['recommended'] == '1') {
            itemList += '<span class="tag-bestseller"><span>Bestseller</span></span>';
    } 
    if (varia['newItem'] != null && varia['newItem'] != undefined && varia['newItem'] == '1') {
            itemList += '<span class="tag-new"><span>New</span></span>';
    }

    if(varia['custom_tags'] && varia['custom_tags'] != null)
    {
        var tagsArray = varia['custom_tags'].split(',');
        tagsArray.forEach(element => {
            if (pId == 7175) {
                itemList += '<span  class="tag-limited-edition">'+ element +'</span>';
            } else {
                itemList += '<span  class="tag-limited-edition">'+ element +'</span>';
            }
            
        });
        
    }
    
    itemList += '</div>';
    if (varia['viewType'] == 3) {
        itemList += '<div onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
    }else if (varia['viewType'] == 2) {
        itemList += '<div onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
    } else {
        if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
            itemList += '<div class="item-heading" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
        } else {
            itemList += '<div class="item-heading" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
        }
    }
    itemList += '<div class="item-tt-outer">';
    itemList += '<h4 class="item-title">' + varia['itemName'] + '</h4>';
    itemList += '</div></div>';
    var num = parseFloat(varia["avgRating"]);
    if (num != undefined && num > 3) {
        var rat = Math.ceil(num);
        itemList += '<div>';
        for (var a = 0; a < rat; a++) {
            itemList += '<i class="las la-star" style="color:#FDD42D;"></i>';
        }
        itemList += '</div>';
    }
    if (varia['viewType'] == 3) {

        
        itemList += '<p class="pric e-p" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
    

    }else if (varia['viewType'] == 2) {

        
        itemList += '<p class="pric e-p" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')">';
    

    } else {
        if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
            
                itemList += '<p class="pric e-p" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">';
            

        } else {
            
                itemList += '<p class="pric e-p" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')">';
            

        }
    }

    if (varia['variantsAvailable'] > 0) {

        var sp_arr= Math.min.apply(null, varia['variants'].map(item => item.sp));

        var mrp_arr= Math.min.apply(null, varia['variants'].map(item => item.mrp));

        if (varia['dynamic_combo'] == 1) {
            

            if (sp_arr != mrp_arr && mrp_arr != 0) {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> <small style="color: #848484; font-size: 85%;"><s>' + currency + '' + mrp_arr + '</s></small>' + currency + '' + sp_arr;
            } else {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> ' + currency + '' + sp_arr;
            }
        } else if (sp_arr != mrp_arr && mrp_arr != 0) {
            itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + mrp_arr + '</s></small>' + currency + '' + sp_arr;
        } else {
            itemList += currency + '' + sp_arr;
        }

    } else {

        if (varia['dynamic_combo'] == 1) {
            if (varia['sp'] != varia['mrp'] && varia['mrp'] != 0) {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> <small style="color: #848484; font-size: 85%;"><s>' + currency + '' + varia['mrp'] + '</s></small>' + currency + '' + varia['sp'];
            } else {
                itemList += '<span style="font-size: 12px; color: #5c5c5c;display:inline-block">Starting @</span> ' + currency + '' +   varia['sp'];
            }
        } else if (varia['sp'] != varia['mrp'] && varia['mrp'] != 0) {
            itemList += '<small style="color: #848484; font-size: 85%;"><s>' + currency + '' + varia['mrp'] + '</s></small>' + currency + '' + varia['sp'];
        } else {
            itemList += currency + '' + varia['sp'];
        }
    }
    itemList += '</p>';
    if(aiFlag == 1){
        itemList += '<p class="pric e-p" style="font-size: 12px;line-height: initial; font-weight: 400;color: #848484;">(Inc. of all taxes)</p>';
    }
    /*if (varia['variant_count'] > 0) {

        if (varia['variants'][0]['templateId'] != 0 && varia['variants'][0]['templateId'] != null && varia['variants'][0]['templateId'] != "null") {
            itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
        }
    } else {
        if (varia['templateId'] != 0 && varia['templateId'] != null && varia['templateId'] != "" && varia['templateId'] != 'null') {
            itemList += '<span style="display: block; margin-top: 3px; color: #9EA2A1;font size:13px;" class="customisable-span">Customisable</span>';
        }
    }*/
    if (varia['description'] != '' && varia['description'] != null && varia['description'] != 'null') {
        var ellipsis = '<span class="expand_details" onclick="expand_description(' + varia['id'] + ')">...Read more</span>';
        var expand_less = '<span class="expand_details" onclick="collapse_description(' + varia['id'] + ')">...Read less</span>';
        var maxLength = 70;
        var text = $.trim(varia['description']);
        if (text.length > maxLength) {
            text_sub = text.substring(0, maxLength);
            itemList += "<p class='heading-customize less" + varia['id'] + "'>" + text_sub.substring(0, text.lastIndexOf(" ")) + ellipsis + "</p>";
            itemList += "<p class='heading-customize more" + varia['id'] + " d-none'>" + text + expand_less + "</p>";
        } else {
            itemList += "<p class='heading-customize '>" + text + "</p>";
        }
    }
    
    if(item_image == ''){
        itemList += '<div class="ratingp-tp-bg">';
    }
    
    if(item_image == ''){
        itemList += '</div>';
    }
    itemList += '</div>';
    itemList += '</div>';
    if (item_image == '') {
        itemList += '<div class="item-card-placeholder-detail-new item-without-img-detail">';
        itemList += '<div class="item-card-placeholder-nw-outer">';
        itemList += '<div class="cart-new-btn rating-tp">';
    } else {
        itemList += '<div class="item-card-placeholder-detail-new position-relative item-with-img">';
        itemList += '<div class="item-card-placeholder-nw-outer position-relative">';
        if (varia['viewType'] == 3) {
            itemList += '<div class="item-card-placeholder-nw " id="item-' + varia['id'] + '" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
        }else if (varia['viewType'] == 2) {
            itemList += '<div class="item-card-placeholder-nw " id="item-' + varia['id'] + '" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ')" style="cursor: pointer;">';
        } else {
            if ((varia['templateId'] != null && varia['templateId'] != '' && varia['templateId'] != 0 && varia['templateId'] != 'null') || (varia['variantsAvailable'] != null && varia['variantsAvailable'] != '')) {
                itemList += '<div class="item-card-placeholder-nw" id="item-' + varia['id'] + '" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
            } else {
                itemList += '<div class="item-card-placeholder-nw" id="item-' + varia['id'] + '" onclick="openVariantModal(' + varia['id'] + ',' + varia['sectionId'] + ')" style="cursor: pointer;">';
            }
        }

        if (varia['image'] != null && varia['image'] != '') {
            itemList += '<img src=' + item_image + '  alt="' + varia['itemName'] + '" width="84" height="82">';
        }
        itemList += '</div>';
        itemList += '<div class="cart-new-btn">';
    }


    if (varia['viewType'] == 3) {
        itemList += '<div class="cart-count-add cart-btn" onclick="open_wizard(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" >ADD +</div>';

    }else if (varia['viewType'] == 2) {
        itemList += '<div class="cart-count-add cart-btn" onclick="open_combo(' + varia['id'] + ',' + varia['sectionId'] + ',' + varia['parentId'] + ',' + varia['viewType'] + ');" >ADD +</div>';

    } else {
        itemList += '<div class="cart-count-add cart-btn" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')" id="btn-' + varia['id'] + '">ADD +</div>';
        itemList += '<div class="quantity-btn" id="div-' + varia['id'] + '"style="display:none !Important;" ><div class="_29Y5Z _20vNm " id="qty_minus" onclick="deleteFromDiv(' + varia['id'] + ')"></div>';
        itemList += '<input type="hidden"  value="update" class="1"><input type="text"  id="qty-input-' + varia['id'] + '"class=" _2zAXs _2quy-" id="" readonly="" value="1">';
        itemList += '<div class="_1ds9T _2WdfZ" id="qty_plus" onclick="showVariant(' + varia['id'] + ',' + varia['sectionId'] + ')">+</div></div>'
    }
    itemList += '<div class="y9uHb theo-toggle" id="bar' + varia['id'] + '"style="display:none"></div>';
    itemList += '</div>';
    itemList += '</div>';
    itemList += '</div>';
    itemList += '<div class="available-next d-none" style="text-align: center;border: 1px dashed #DA251C;border-radius: 10px;background: #fae3e3;color: #DA251C;position: absolute;width: 100%;bottom: 0px;left: 0px;">Next available at '+ end_hour +'</div>';
    itemList += '</div>';
    itemList += '</div>';
    itemList += '</div>';
    return itemList;
}

function makeRequest(img_url) {
    fetch(img_url).then((response) => {
        return response.status;
    });
}

function expand_description(id,is_modal=0) {
    $('.less' + id).eq(is_modal).addClass('d-none');
    $('.more' + id).eq(is_modal).removeClass('d-none');
}

function collapse_description(id,is_modal=0) {
    $('.less' + id).eq(is_modal).removeClass('d-none');
    $('.more' + id).eq(is_modal).addClass('d-none');
}

function expand_detail_description(id) {
    $('.less_desc' + id).addClass('d-none');
    $('.more_desc' + id).removeClass('d-none');
}

function collapse_detail_description(id) {
    $('.less_desc' + id).removeClass('d-none');
    $('.more_desc' + id).addClass('d-none');
}

function checkVegNonVeg() {
    $('.spinner').show();
    if ($('.vegNonVeg').is(":checked")) {
    
        var staticUrl = 'https://static.uengage.in/feed/v2/veg/feed_' + businessId + '.json?nocache=' + (new Date()).getTime();
        
    

        $(".switch div").css("background", "#006400");
        $(".switch").css("background", "#90ee90");

    } else {
        var staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '.json?nocache=' + (new Date()).getTime();
    
        
        $(".switch div").css("background", "white");
        $(".switch").css("background", "#ccc");
    }


    parentId = pId;
    $.getJSON(staticUrl, function(data) {
        renderMenu(data);
    });
    //  if(localStorage.getItem('orderType')==1){
    //     getDeliveryDetails();
    //  }



    $('.spinner').hide();
}


function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('#sectionList a').each(function() {
        var currLink = $(this);
        if (currLink.attr("id") != undefined && currLink.attr("id") != '') {
            var id = currLink.attr("id").split("-")[0];
            //   var refElement = $(currLink.attr("id").split("-")[0]);
            //   console.log(refElement);
            if ($('#' + id).position().top <= scrollPos + 100 && $('#' + id).position().top + $('#' + id).height() > scrollPos + 100) {
                $('#sectionList li a').removeClass("activeli");
                // currLink.addClass("activeli");
            } else {
                currLink.removeClass("activeli");
            }
        }
    });
}

function changeOrderType() {

    var orderType = 0;
    if (localStorage.getItem('orderType') && localStorage.getItem('orderType') != '') {
        orderType = localStorage.getItem('orderType');
        if(deliveryOnlineActive == 1 && deliveryActive == 1){
            orderType = 1;
        }else if (pickupActive == 1) {
            orderType = 2;
        } else if (dineActive == 1) {
            orderType = 3;
        } else if (incarActive == 1) {
            orderType = 4;
        } else {
            orderType = 0;
        }
    } else {
        if(deliveryOnlineActive == 1 && deliveryActive == 1){
            orderType = 1;
        }
        else if (pickupActive == 1) {
            orderType = 2;
        } else if (dineActive == 1) {
            orderType = 3;
        } else if (incarActive == 1) {
            orderType = 4;
        }
    }

    var modalContent = "<div class='row m-0 p-2'><div class='col-4 m-0 p-2'>" +
        '<div class="form-check"><label class="form-check-label">';
    if(deliveryOnlineActive == 1){
        if (orderType == 1 && deliveryActive == 1) {
            modalContent += ' <input type="radio" value="1" class="form-check-input" id="delRadio" checked onclick="setOrders(1)" name="optradio">Delivery';
        } 
    }else {
        if(deliveryOnlineActive == 1){
            if (deliveryActive == 1) {
                modalContent += ' <input type="radio" value="1" class="form-check-input" id="delRadio" onclick="setOrders(1)" name="optradio">Delivery';
            }else {
                modalContent += ' <input type="radio" value="1" class="form-check-input" id="delRadio" onclick="setOrders(1)" disabled name="optradio">Delivery';
            } 
        }else {
            modalContent += ' <input type="radio" value="1" class="form-check-input" id="delRadio" onclick="setOrders(1)" disabled name="optradio">Delivery';
        }

    }

    modalContent += '</label></div></div><div class="col-4 m-0 p-2">' +
        '<div class="form-check"><label class="form-check-label">';
    if (orderType == 2 && pickupActive == 1) {
        modalContent += ' <input type="radio" value="2" class="form-check-input" id="takeAwayRadio" checked onclick="setOrders(2)" name="optradio">Picked Up';
    } else {
        if (pickupActive == 1) {
            modalContent += ' <input type="radio" value="2" class="form-check-input" id="takeAwayRadio" onclick="setOrders(2)" name="optradio">Picked Up';
        } else {
            modalContent += ' <input type="radio" value="2" class="form-check-input" id="takeAwayRadio" disabled onclick="setOrders(2)" name="optradio">Picked Up';
        }

    }
    modalContent += '</label></div></div><div class="col-4 m-0 p-2">' +
        '<div class="form-check"><label class="form-check-label">';
    if (orderType == 3 && dineActive == 1) {
        modalContent += ' <input type="radio" value="3" class="form-check-input" id="dineinRadio" checked onclick="setOrders(3)" name="optradio">Dine-In';
    } else {
        if (dineActive == 1) {
            modalContent += ' <input type="radio" value="3" class="form-check-input" id="dineinRadio"  onclick="setOrders(3)" name="optradio">Dine-In';
        } else {
            modalContent += ' <input type="radio" value="3" class="form-check-input" id="dineinRadio" disabled  onclick="setOrders(3)" name="optradio">Dine-In';
        }
    }
    modalContent += '</label></div></div>' +
        '<div class="col-12 mt-2 p-0 input-container" id="orderTPlaceHolder"><input class="form-control" type="text" id="searchLoc"/> <img  src="' + origin + '/assets/wla_new/img/curr-loc.png"" class="icon"></div>'

        +
        '</div>';
    $('#body').html('');
    $('#body').html(modalContent);
    get_address_list(orderType);
    if (orderType == 1 && localStorage.getItem('lat') && localStorage.getItem('lat') != '') {
        $('#closeOrderType').show();

    }

    if (orderType == 0) {
        $('#order_btn').prop('disabled', true);
        $('#orderTPlaceHolder').html('');
        $('#orderTPlaceHolder').html('<span style="font-size: 1.2em;margin: auto;">Outlet is Currently Non Serviceable</span>');
    } else {
        setOrders(orderType);
    }


    $('#orderType').modal({
        backdrop: 'static',
        keyboard: false
    })
    // $('#orderType').modal('show');
}

function initializeP() {

    // var cityBounds = new google.maps.LatLng(28.7041, 77.1025);
    var center = new google.maps.LatLng(28.7041, 77.1025);
    var circle = new google.maps.Circle({
        center: center,
        radius: 50
    });
    autocomplete5 = new google.maps.places.Autocomplete(
        document.getElementById('searchLoc'), {
            types: ['geocode']
        }
    );
    autocomplete5.setBounds(circle.getBounds());
    autocomplete5.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    var place = autocomplete5.getPlace();
    localStorage.setItem('change_lat', place.geometry.location.lat());
    localStorage.setItem('change_lng', place.geometry.location.lng());
    localStorage.setItem('change_formatted_Address', place.formatted_address);


}

function setOrders(orderType) {
    localStorage.setItem('orderType', orderType);
    if (orderType == 1) {
        $('#delList').show();
        $('#orderTPlaceHolder').html('');
        $('#orderTPlaceHolder').html('<input class="form-control" type="text" id="searchLoc"><img  src="' + origin + '/assets/wla_new/img/curr-loc.png"" class="icon">');
        // $('#delAddTag').html('');
        // $('#delAddTag').html('<input class="form-control" type="text" id="searchLoc"><img onclick="GetGeolocation();" src="' + origin + '/assets/wla_new/img/curr-loc.png"" class="icon">');
        //  if (typeof google != 'object' || typeof google.maps != 'object'){
        //     var script = document.createElement('script');
        //     script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPZl9d43wBtEc1Wb933_3PlLTdGLbyLwk&libraries=places';
        //     script.defer = true;
        //     document.head.appendChild(script);
        //     setTimeout(" initializeP()", 700);
        //  }else{
        //     initializeP();
        //  }
    } else if (orderType == 2) {
        var address = localStorage.getItem('store_address');
        $('#orderTPlaceHolder').html('');
        $('#orderTPlaceHolder').html('<span><b>Pick Up Address: </b>' + address + '</span>');
        $('#delAddTag').hide();
        $('#pickAddTag').show();
        $('#pickAddTag').html('');
        $('#pickAddTag').html('<span><b>Pick Up Address: </b>' + address + '</span>');
        $('#delList').hide();
    } else {
        var address = localStorage.getItem('store_address');
        $('#orderTPlaceHolder').html('');
        $('#orderTPlaceHolder').html('<span><b>Address: </b>' + address + '</span>');
        $('#delAddTag').hide();
        $('#pickAddTag').show();
        $('#pickAddTag').html('');
        $('#pickAddTag').html('<span><b>Address: </b>' + address + '</span>');
        $('#delList').hide();
    }
}

function setNewOrderType() {
    var orderType = localStorage.getItem('orderType');
    // localStorage.setItem('orderType',orderType);
    if (orderType == 1) {

        if (!localStorage.getItem('change_lat') || localStorage.getItem('change_lat') == '') {
            // alert("Kindly Enter the Delivering Address");
            $('#errorMessagenewOrdType').html('');
            $('#errorMessagenewOrdType').html("Kindly Enter the Delivering Location");
            $("#danger-alert-newOrderType").fadeTo(2000, 500).slideUp(500, function() {
                $("#danger-alert-newOrderType").slideUp(500);
            });
            return false;
        }


        localStorage.setItem('formatted_Address', localStorage.getItem('change_formatted_Address'));
        localStorage.setItem('lat', localStorage.getItem('change_lat'));
        localStorage.setItem('lng', localStorage.getItem('change_lng'));
        $('#orderTypeTop').html('');
        $('#orderTypeTop').html('<i class="la la-biking" style="font-size: 1.5em;line-height: 0em;"></i> Delivering To');
        $('.deliveringTo').html();
        $('.deliveringTo').html(localStorage.getItem('formatted_Address'));
        localStorage.removeItem("change_formatted_Address");
        localStorage.removeItem("change_lat");
        localStorage.removeItem("change_lng");
        $('#delAddTag').show();
        $('#pickAddTag').hide();
        //  getDeliveryDetails();

    } else if (orderType == 2) {
        $('#orderTypeTop').html('');
        $('#orderTypeTop').html('<i class="la la-people-carry" style="font-size: 1.5em;line-height: 0em;"></i> Pick Up');
        $('.deliveringTo').html();
        $('.deliveringTo').html(address);
        $('#delAddTag').hide();
        $('#pickAddTag').show();
        setTimeout(function() {
            $('.btn').prop('disabled', false);
            $('#cartBTN').prop('disabled', true);
        }, 1000);
        addressServicable = 1;
        if (qty == 0) {
            $('#emptyCartDiv').show();
            $('#cartBTN').attr("style", "display: none !important");
            $('.price-checkout').attr("style", "display: none !important");
        } else {

            $('#cartBTN').attr("style", "display: show !important");
            $('.price-checkout').attr("style", "display: show !important");
            $('#emptyCartDiv').hide();
        }

        $('.errorDivCls').attr("style", "display: none !important;");
        $('.delCheck').removeClass('error');
        $('.delCheck').html('<i class="las la-motorcycle"></i> Delivery Time<br><span class="delTime">45 min</span>');
        $('.delCheck1').show()
    } else if (orderType == 3) {
        $('#orderTypeTop').html('');
        $('#orderTypeTop').html('<i class="la la la-utensils" style="font-size: 1.5em;line-height: 0em;"></i> Dine In');
        $('.deliveringTo').html();
        $('.deliveringTo').html(address);
        // setOrderType(3,'dineInTag');
        $('#delAddTag').hide();
        $('#pickAddTag').hide();
        addressServicable = 1;
        if (qty == 0) {
            $('#emptyCartDiv').show();
            $('#cartBTN').attr("style", "display: none !important");
            $('.price-checkout').attr("style", "display: none !important");
        } else {

            $('#cartBTN').attr("style", "display: show !important");
            $('.price-checkout').attr("style", "display: show !important");
            $('#emptyCartDiv').hide();
        }
    }
    $('#orderType').modal('hide');
    if (outlet_open != 1) {
        $('.cart-new-btn').addClass('d-none');
        $('.price-checkout').addClass('disabled');
        $('.price_mobile').addClass('disabled');
        $('.order-type').addClass('disabled');
        $('.available-next').removeClass('d-none');
    } else {
        $('.cart-new-btn').removeClass('d-none');
        $('.price-checkout').removeClass('disabled');
        $('.price_mobile').removeClass('disabled');
        $('.order-type').removeClass('disabled');
        $('.available-next').addClass('d-none');
    }
}

function GetGeolocation() {

    navigator.geolocation.getCurrentPosition(GetCoords, GetError);

}

function GetCoords(position) {
    localStorage.setItem('change_lat', position.coords.latitude);
    localStorage.setItem('change_lng', position.coords.longitude);

    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': latlng
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            localStorage.setItem('change_formatted_Address', results[1].formatted_address);
            $('#searchLoc').val(results[1].formatted_address);
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });

}

function GetError() {

}

function getDeliveryDetails() {
    $('.spinner').show();
    var url = origin + '/client/checkDeliveryDetails?businessId=' + businessId + '&latitude=' + localStorage.getItem('lat') + '&longitude=' + localStorage.getItem('lng');
    var itemList = "";
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result.status == 1) {
                $('.delCheck').removeClass('error');
                $('.delCheck1').show()
                $('.delCheck').html('<i class="las la-motorcycle"></i> Delivery Time<br><span class="delTime"></span>');
                var rules = result.rules[0];
                $('.delTime').html('');
                $('.delValue').html('');

                $('.delTime').html(rules['delivery_time'] + " mins");
                $('.delValue').html(rules['eligible_order_amt']);

                setTimeout(function() {
                    $('.btn').prop('disabled', false);
                    $('#cartBTN').prop('disabled', true);
                    if (qty > 0) {
                        $('#cartBTN').attr("style", "display: flex !important");
                        $('.price-checkout').attr("style", "display: block !important");
                    }

                    $('.errorDivCls').attr("style", "display: none !important;");
                }, 1000);
                addressServicable = 1;
                if (qty != 0) {
                    $('#emptyCartDiv').hide();
                }

            } else {
                $('.delCheck').html("");
                $('.delCheck').html(result.msg);
                $('.delCheck').addClass('error');
                $('.delCheck1').hide();
                $('#emptyCartDiv').hide();
                setTimeout(function() {
                    $('.btn').removeClass('error');
                    $('.btn').prop('disabled', true);
                    $('#cartBTN').prop('disabled', false);
                    $('.btn-left-menu').prop('disabled', false);
                    $('.noDisable').prop('disabled', false);
                    $('#cartBTN').attr("style", "display: none !important");
                    $('.price-checkout').attr("style", "display: none !important");
                    $('.errorDivCls').attr("style", "display: block !important;background: #ececec !important;border: 1px solid var(--main-bg-color) !important;color:var(--main-bg-color)");

                }, 1000);
                if (qty == 0) {
                    $('#emptyCartDiv').hide();
                }

                addressServicable = 0;
            }

            if (outlet_open != 1) {
                $('.cart-new-btn').addClass('d-none');
                $('.price-checkout').addClass('disabled');
                $('.price_mobile').addClass('disabled');
                $('.order-type').addClass('disabled');
                $('.available-next').removeClass('d-none');
            } else {
                $('.cart-new-btn').removeClass('d-none');
                $('.price-checkout').removeClass('disabled');
                $('.price_mobile').removeClass('disabled');
                $('.order-type').removeClass('disabled');
                $('.available-next').addClass('d-none');
            }
        }
    });
    $('.spinner').hide();
    // checkDeliveryDetails
}

function get_address_list(orderType) {

    if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
        $('.spinner').show();
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];
        var token = userData['token'];
        var contactId = userData['contactId'];
        var url = origin + "/client/getDeliveryAddress/" + businessId + "/" + contactMappingId + "/" + token
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(result) {
                if (result['status'] == 0) {
                    alert(result['msg']);
                } else {
                    addressRows = result['rows'];
                    localityMapping = result['localityMapping'];
                    locality_list = result['locality_list'];
                    if (orderType == 1) {
                        var d = "<div class='w-100' id='delList'>";
                    } else {
                        var d = "<div class='w-100' id='delList' style='display:none'>";
                    }

                    if (result['rows'].length > 0) {
                        d += '<div class="col-12" style="background: #ececec;text-align: center;font-size: 1.25em;"><label>Saved Delivery Addresses</label></div>';
                        for (var i = 0; i < result['rows'].length; i++) {
                            d += "<div class='row m-0 p-2 mt-1' style='border-bottom:1px solid #777' onclick='selectAddress(" + businessId + "," + result['rows'][i]['latitude'] + "," + result['rows'][i]['longitude'] + ",\"" + result['rows'][i]['locality'] + "\",\"" + result['rows'][i]['city'] + "\")'>" +
                                "<div class='col-12 m-0 p-0' style='display:flex'> <i class='las la-map-marker' style='font-size: 30px;color: #777;display: inline;'></i>" + result['rows'][i]['locality'] + "-" + result['rows'][i]['city'] + "</div>"
                                // +"<div class='col-12 m-0 p-0'>"+result['rows'][i]['addressLine1']+"-"+result['rows'][i]['addressLine2']+"</div>"
                                +
                                "</div>";
                        }
                    }
                    d += '</div>';
                    $('#body').append(d);
                    // $('#addresBody').html('');
                    // $('#body').html(d);
                    // $('#addressModal').modal('show');
                }
                $('.spinner').hide();

            }
        });
    }


}

function selectAddress(id, latitude, longitude, locality, city) {

    // var storeData=JSON.parse(stores).filter(e=>e.id==id)[0];
    localStorage.setItem('change_lat', latitude);
    localStorage.setItem('change_lng', longitude);
    var add = locality + '-' + city
    localStorage.setItem('change_formatted_Address', add);
    setNewOrderType();
}

function getClientFeed() {
    if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != undefined) {
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];
        var url = origin + "/client/getFeedPersonalData/" + pId + "/" + businessId + "/" + contactMappingId + "/" + userData['mobile'];

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            headers: {
                "token": userData['token']
            },
            success: function(result) {
                if (result['status'] == 0) {

                } else {
                    //  console.log(result['feed']);
                    var feedB = '';
                    var feedD = "";
                    var feed = result['active_orders'];
                    if (feed.length > 0) {
                        feedB += "<div class='w-100' style='display: flex;overflow: scroll;'>";

                        for (var k = 0; k < feed.length; k++) {
                            var orders = feed[k];
                            feedB += '<div class="col-md-6 col-xs-11 col-sm-11 col-11">';
                            feedB += '<section class="root-outer">';
                            feedB += '<div class="root">';
                            feedB += '<figure style="position: relative;">';
                            feedB += '<img src="' + origin + '/assets/wla_new/img/bike.png" alt="Bike">';
                            feedB += '<figcaption> <h4>Tracking Details</h4><h6 style="margin-top: 8px;">Order Number</h6>';
                            feedB += '<h2>' + orders['orderId'] + '</h2></figcaption>';
                            feedB += '<figcaption><h4></h4><h6 style="margin-top: 26px;">Total Cost</h6>';
                            feedB += '<h2>' + currency + ' ' + Math.round(orders['totalAmt']) + '</h2></figcaption></figure>';
                            if (orders['deliveryStatus'] != 4) {
                                feedB += '<div style="margin-top: 15px;"><span style="font-weight: 700; font-size: 15px; color: #111;">Current Status:</span> <div class="statusBtn text-center" style="padding: 3px 15px; display: inline-block; background-color: #008100; color: #fff; border-radius: 40px;  font-size: 13px;width: auto; float: none; margin-left: 5px;">' + orders['o_status'] + '</div></div>';
                            } else {
                                feedB += '<div style="margin-top: 15px;"><span style="font-weight: 700; font-size: 15px; color: #111;">Current Status:</span> <div class="statusBtn text-center" style="padding: 3px 15px; display: inline-block; background-color: red; color: #fff; border-radius: 40px;  font-size: 13px;width: auto; float: none; margin-left: 5px;">' + orders['o_status'] + '</div></div>';
                            }

                            feedB += '<div class="order-track"><div class="order-track-step active"><div class="order-track-status">';
                            feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span></div>';
                            feedB += '<div class="order-track-text"><div style="width: 40px;">';
                            feedB += '<img src="' + origin + '/assets/wla_new/img/pending.png" alt="Pending" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                            feedB += '</div><div> <p class="order-track-text-stat">Pending</p>';
                            feedB += '<span class="order-track-text-sub">' + orders['invoiced_f'] + '</span></div></div></div>';
                            if (orders['accepted_f'] != null && orders['accepted_f'] != '') {
                                feedB += '<div class="order-track-step active">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/accept-circular.png" alt="Accept Circular" style="max-width: 25px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Accepted</p>';
                                feedB += '<span class="order-track-text-sub">' + orders['accepted_f'] + '</span></div></div></div>';
                            } else if (orders['deliveryStatus'] != 4) {
                                feedB += '<div class="order-track-step">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/accept-circular.png" alt="Accept Circular" style="max-width: 25px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Accepted</p>';
                                feedB += '<span class="order-track-text-sub"></span></div></div></div>';
                            }
                            if (orders['dispatched_f'] != null && orders['dispatched_f'] != '' && orders['orderType'] == 1) {
                                feedB += '<div class="order-track-step active">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivery-man.png" alt="Delivery Man" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Dispatched</p>';
                                feedB += '<span class="order-track-text-sub">' + orders['dispatched_f'] + '</span>';
                                if (orders['deliveryStatus'] != 3 && orders['deliveryStatus'] != 4 && orders['trackOrder'] == 1 && (orders['delivery_partnerId'] == null || orders['delivery_partnerId'] == 0)) {
                                    feedB += '<br><span class="order-track-text-sub"><a target="_blank" href="https://www.uengage.in/addo/track/' + orders['tracking_code'] + '">Track Rider</a></span>';
                                }
                                feedB += '</div></div></div>';
                            } else if (orders['orderType'] == 1 && orders['deliveryStatus'] != 4) {
                                feedB += '<div class="order-track-step">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivery-man.png" alt="Delivery Man" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Dispatched</p>';
                                feedB += '<span class="order-track-text-sub"></span></div></div></div>';
                            }
                            if (orders['prepared_f'] != null && orders['prepared_f'] != '' && orders['orderType'] == 2) {
                                feedB += '<div class="order-track-step active">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivery-man.png" alt="Delivery Man" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Prepared</p>';
                                feedB += '<span class="order-track-text-sub">' + orders['prepared_f'] + '</span>';

                                feedB += '</div></div></div>';
                            } else if (orders['orderType'] == 2 && orders['deliveryStatus'] != 4) {
                                feedB += '<div class="order-track-step">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivery-man.png" alt="Delivery Man" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Prepared</p>';
                                feedB += '<span class="order-track-text-sub"></span></div></div></div>';
                            }
                            if (orders['delivered_f'] != null && orders['delivered_f'] != '') {
                                feedB += '<div class="order-track-step active">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivered.png" alt="Delivered" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Delivered</p>';
                                feedB += '<span class="order-track-text-sub">' + orders['delivered_f'] + '</span></div></div></div>';
                            } else if (orders['deliveryStatus'] != 4) {
                                feedB += '<div class="order-track-step">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivered.png" alt="Delivered" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Delivered</p>';
                                feedB += '<span class="order-track-text-sub"></span></div></div></div>';
                            }

                            if (orders['cancelled_f'] != null && orders['cancelled_f'] != '') {
                                feedB += '<div class="order-track-step active">';
                                feedB += '<div class="order-track-status">';
                                feedB += '<span class="order-track-status-dot" style="background:red"></span><span class="order-track-status-line"></span>';
                                feedB += '</div><div class="order-track-text"><div style="width: 40px;">';
                                feedB += '<img src="' + origin + '/assets/wla_new/img/delivered.png" alt="Cancelled" style="max-width: 30px; margin-right: 10px; margin-top: 5px;">';
                                feedB += '</div><div><p class="order-track-text-stat">Cancelled</p>';
                                feedB += '<span class="order-track-text-sub">' + orders['cancelled_f'] + '</span></div></div></div>';
                            }


                            feedB += '</div> </section>';



                            // feedD+="<div class='col-md-6 col-xs-10 col-sm-10 col-10'>"
                            // +"<div class='row m-0 p-0' style='background:#fff;border: 1px solid #ececec;border-radius: 10px;'><div class='col-2 p-1'> <img src='" + origin + "/assets/wla_new/img/bell.png' style='width:2em'></div>"
                            // +"<div class='col-6 p-1' style='font-weight: 600;'>Order No: "+orders['orderId']+"<br><span style='float:left'>"+currency+" "+orders['totalAmt']+"</span></div>"
                            // +"<div class='col-4 p-1' style='    margin: auto;'> <div class='statusBtn text-center'>"+orders['o_status']+"</div></div>"
                            // +"<div class='col-12' style='border-top:1px solid #ececec'></div>"
                            // +"<div class='history-tl-container'><ul class='tl'><li class=' active tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_list_icon4.png' style='width:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Pending </span></div><div class='item-detail'>"+orders['invoiced_f']+"</div></li>";
                            // if(orders['accepted_f']!=null && orders['accepted_f']!=''){
                            //    feedD+="<li class='active tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_tick_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Accepted </span></div><div class='item-detail'>"+orders['accepted_f']+"</div></li>"                        
                            // }else{
                            //    feedD+="<li class='tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_tick_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Accepted </span></div><div class='item-detail'></div></li>"                        
                            // }
                            // if(orders['dispatched_f']!=null && orders['dispatched_f']!='' && orders['orderType']==1){
                            //    feedD +=
                            //    "<li class='active tl-item'><div class='item-title' style='display:flex'><img src='"+origin+"/assets/wla_new/img/ic_deliver_icon.png' style='width:1.5em;height:1.5em'>" +
                            //    "<span style='margin-left: 0.5em;font-size: 1.2em;'> Dispatched </span></div>";
                            // if (orders['delivery_partnerId'] == null || orders['delivery_partnerId'] == 0) {
                            //    feedD += "<div class='item-detail'>" + orders['dispatched_f'];

                            //    if(orders['tracking_code']!=null && orders['tracking_code']!='null' && orders['tracking_code']!=''){
                            //       feedD += "<br><label class='mt-2'>Delivery Code: " + orders['deliveryOTP'] +
                            //       "</label><br><a class='btn btn-primary' target='_blank' href='https://www.uengage.in/addo/track/" +
                            //       orders['tracking_code'] + "'>Track Rider</a>";
                            //    }
                            //    feedD+='</div></li>';

                            // } else {
                            //    feedD += "<div class='item-detail'>" + orders['dispatched_f'] + "</div></li>";
                            // }                      
                            // }else if(orders['orderType']==1){
                            //    feedD+="<li class='tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_deliver_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Dispatched </span></div><div class='item-detail'></div></li>"                        
                            // }
                            // if(orders['prepared_f']!=null && orders['prepared_f']!='' && orders['orderType']==2){
                            //    feedD+="<li class='active tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_bag_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Prepared </span></div><div class='item-detail'>"+orders['prepared_f']+"</div></li>"                        
                            // }else if(orders['orderType']==2){
                            //    feedD+="<li class='tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_deliver_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Prepared </span></div><div class='item-detail'></div></li>"                        
                            // }
                            // if(orders['delivered_f']!=null && orders['delivered_f']!=''){
                            //    feedD+="<li class='tl-item active'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_bag_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Delivered </span></div><div class='item-detail'>"+orders['delivered_f']+"</div></li>"                        
                            // }else{
                            //    feedD+="<li class='tl-item'><div class='item-title' style='display:flex'><img src='" + origin + "/assets/wla_new/img/ic_bag_icon.png' style='width:1.5em;height:1.5em'>"
                            // +"<span style='margin-left: 0.5em;font-size: 1.2em;'> Delivered </span></div><div class='item-detail'></div></li>"                        
                            // }


                            // feedD+="</ul></div></div>";
                            feedB += "</div>"
                        }

                        feedB += "</div>";
                    }
                    // console.log(feedD);
                    $('#feedDisplay').show();
                    $('#feedDisplay').attr("style", "display: block !important")
                    $('#feedDisplay').html(feedB);

                }
                $('.spinner').hide();

            }
        });
    }

}


function deleteFromDiv(id) {
    var arr = [];

    $('#feabar' + id).show();
    $('#bar' + id).show();
    $('#upbar' + id).show();
    $('.cart-new-btn').addClass('not-active-all');
    for (i = 0; i < res.length; i++) {
        if (res[i]['itemId'] == id || res[i]['parentId'] == id) {
            arr.push(i);
        }
    }

    if (arr.length == 1) {

        if (res[arr[0]]['qty'] == 1) {
            $('#btn-' + id).show();
            $('#div-' + id).hide();
            $('#feabtn-' + id).show();
            $('#feadiv-' + id).hide();
        }
        if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
            update_item(1, res[arr[0]]['orderItemId']);
        } else {
            update_item(1, id, arr[0]);
        }

    } else {

        if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
            update_item(1, res[arr[0]]['orderItemId']);
        } else {
            update_item(1, id, arr[0]);
        }
    }
    
    $('#feabar' + id).hide();
    
    $('#bar' + id).hide();
    
    $('#upbar' + id).hide();
    $('.cart-new-btn').removeClass('not-active-all');

}


function getBrandList(bId) {
    var url = origin + "/client/getCloudBrand/" + bId;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        async: false,
        success: function(result) {
            var bDiv = '';
            var bList = result['list'];
            var brandModal = '';
            var brand_slide = '';
            var count_brand = '(' + bList.length + ' Options)';
            $('#brand_count').html(count_brand);
            $('#brand_length').html(count_brand);
            for (var i = 0; i < bList.length; i++) {

                if (i == 0 && !brand_id) {
                    brand_slide += '<div class="slide active" id="slider_active-' + bList[i]['name'] + '"><img src="' + bList[i]['logo'] + '" alt="' + bList[i]['name'] + '" class="img-fluid mx-auto d-block"> </div>';
                } else {
                    brand_slide += '<div class="slide" id="slider_active-' + bList[i]['name'] + '"><img src="' + bList[i]['logo'] + '" alt="' + bList[i]['name'] + '" class="img-fluid mx-auto d-block"> </div>';
                }

            }
            if ($(window).width() <= 767) {
                $('#switch_brand').html(brand_slide);
            } else {
                $('#brand_slideImg').html(brand_slide);
            }


            for (var i = 0; i < bList.length; i++) {

                if (i == 0) {
                    var selectedBHTML = '<img src="' + bList[i]['logo'] + '" alt="' + bList[i]['name'] + '" width="80" height="80">';
                    var selectedBTHTML = bList[i]['name'];
                    if (!brand_id) {
                        $('#selected_brand').html(selectedBHTML);
                        $('#selected_brand_title').html(selectedBTHTML);
                        $('#selected_brand_title_mob').html(selectedBTHTML);

                    }
                    $('#cBrandToggle').html(bList[i]['name']);
                    $("#cBrandImage").attr("src", bList[i]['logo']);
                }
                brandModal += '<div class="merchant-dv d-flex align-items-center" onclick="fetchBrandMenu(' + bList[i]['id'] + ')">';
                brandModal += '<div class="merchant-img">';
                brandModal += '<img src="' + bList[i]['logo'] + '"' + 'alt = "' + bList[i]['name'] + '">';
                brandModal += '</div>';
                brandModal += '<div class="merchant-name">';
                brandModal += '<h5>' + bList[i]['name'] + '</h5>';
                brandModal += '<p class="mb-0">' + bList[i]['cuisine'] + '</p>';
                brandModal += '</div>';
                brandModal += '</div>';

            }
            $('#brandModalRow').html(brandModal);
            $('#cloudBrandList').html('');
            $('#cloudBrandList').html(bDiv);
        }
    });
}

function fetchBrandMenu(brandId) {

var staticUrl = 'https://static.uengage.in/feed/v2/feed_' + businessId + '_' + brandId + '.json?nocache=' + (new Date()).getTime();
    
    if(brandId == 336 || brandId == 337 || brandId == 338 ){
        $('#vegNonBoth').hide();
        $('#vegNonBoth_mob').hide();
    }

    $.getJSON(staticUrl, function(data) {
        $('.spinner').show();
        main_temp = data.rows.templates;
        if (data.rows.business.pureVegetarian == 1) {
            $('#vegNonBoth').hide();
            $('#vegNonBoth_mob').hide();
            $('#pureVegOnly').show();
            $('#pureVegOnly_mob').show();
        }else{
            $('#vegNonBoth').show();
            $('#vegNonBoth_mob').show();
            $('#pureVegOnly').hide();
            $('#pureVegOnly_mob').hide();
        }
        renderMenu(data);
        cloud_brandId = brandId;
        $('.spinner').hide();
        $(".outlets-listing-h").removeClass("active");
        $('#change-brand').modal('hide');
        var id = '#brand-' + brandId;
        $(id).addClass('active');
        var selectedBHTML = '<img src="' + data.rows.brandDetails.logo + '" alt="' + data.rows.brandDetails.name + '" width="80" height="80">';
        var selectedBTHTML = data.rows.brandDetails.name;
        $('#selected_brand').html(selectedBHTML);
        $('#selected_brand_title').html(selectedBTHTML);
        $('#selected_brand_title_mob').html(selectedBTHTML);

        var element = document.getElementById('slider_active-' + data.rows.brandDetails.name);
        if (element) {
            $('.slide').removeClass("active");
            element.classList.add("active");
        }

        topFunction();
        $('#suceess').modal('show');
        $('#sucess-msg').html(data.rows.brandDetails.name + ' Brand Selected');
        $('#cBrandToggle').html(data.rows.brandDetails.name);
        $("#cBrandImage").attr("src", data.rows.brandDetails.logo);
        
        setTimeout(function() {
            $('#suceess').modal('hide')
        }, 2000);
    });
}



function nextWizardStep(k,quantity_desc = '',minQty = '',maxQty = '') {

    if(quantity_desc == "checkbox"){
        var radioId = $('input[type=checkbox][name=radio-group' + k + ']:checked').attr('id');
    }else{
        var radioId = $('input[type=radio][name=radio-group' + k + ']:checked').attr('id');
    }
    if (radioId == '' || radioId == null) {
        $("#toast" + k + "").removeClass("d-none");
        return false;
    } else {
        $("#toast" + k + "").addClass("d-none");
        $("#bogo-" + (k + 1) + "").removeClass("disabled");
    }

    if(quantity_desc == "checkbox"){
        var val = radioId.split('_');
        var itemId = val[2];
        var sectionId = '';
        for (var i = 0; i < item['subItems'].length; i++) {
            if (item['subItems'][i]['itemId'] == itemId) {
                sectionId = item['subItems'][i]['sectionId'];
                break;
            }
        }
    
        // Validate minQty condition before proceeding
        var selectedItems = item['subItems'].filter(function(subItem) {
            return subItem.sectionId === sectionId;
        });
    
        if (selectedItems.length < minQty) {
            alert('You must select at least ' + minQty + ' items for this section.');
            return false;
        }
    }
    

    var active = $('.wizard .nav-tabs li.active');
    active.next().removeClass('disabled');
    nextTab(active);

}

function nextComboWizardStep(k,quantity_desc = '',minQty = '',maxQty = '') {

    if(quantity_desc == "checkbox"){
        var radioId = $('input[type=checkbox][name=radio-group-combo' + k + ']:checked').attr('id');
    }else{
        var radioId = $('input[type=radio][name=radio-group-combo' + k + ']:checked').attr('id');
    }
    if (minQty>0 && (radioId == '' || radioId == null)) {
        $("#toast-combo" + k + "").removeClass("d-none");
        return false;
    } else {
        $("#toast-combo" + k + "").addClass("d-none");
        $("#bogo-" + (k + 1) + "").removeClass("disabled");
    }


    if(quantity_desc == "checkbox"){
        var val = radioId.split('_');
        var itemId = val[3];
        var sectionId = '';
        for (var i = 0; i < item['subItems'].length; i++) {
            if (item['subItems'][i]['itemId'] == itemId) {
                sectionId = item['subItems'][i]['sectionId'];
                break;
            }
        }
    
        // Validate minQty condition before proceeding
        var selectedItems = item['subItems'].filter(function(subItem) {
            return subItem.sectionId === sectionId;
        });
    
        if (selectedItems.length < minQty) {
            alert('You must select at least ' + minQty + ' items for this section.');
            return false;
        }
    }

    var active = $('.wizard .nav-tabs li.active');
    var activeHref = active.find('a').attr('href'); // Get the href of the active tab content
    var next = active.next('li');
    if (next.length) { // Check if there is a next tab
        var nextHref = next.find('a').attr('href'); // Get the href of the next tab content

        // Hide the current active tab and its content
        active.addClass('d-none');
        active.removeClass('active');
        $(activeHref).addClass('d-none');
        $(activeHref).removeClass('active');
        // Show the next tab and its content
        next.removeClass('d-none');
        next.addClass('active');
        $(nextHref).removeClass('d-none');
        $(nextHref).addClass('active');
        // Call nextTab function with the next tab element
        nextTab(active);
    }
}


function prevWizardStep(k = null) {
    var itemId = $("#previous_item" + k + "").attr("id");
    var k = $("#previous_item" + k + "").attr("value");
    if (itemId) {
        $(".topping-list" + k + "").addClass("d-none");
        $("#pizza_name" + k + "").removeClass("d-none");
        $("#pizza" + k + "").removeClass("d-none");
        $("#toping" + k + "").addClass("d-none");
    } else {
        $(".topping-list" + k + "").removeClass("d-none");
        $("#toping" + k + "").removeClass("d-none");
        var active = $('.wizard .nav-tabs li.active');
        prevTab(active);
    }


}

function prevComboWizardStep() {
    var k = $("#previous_item_combo").attr("value"); // Assuming k is a constant value obtained from the element with id "previous_item_combo"
    $(".topping-list" + k).removeClass("d-none");
    $("#toping" + k).removeClass("d-none");
    
    var active = $('.wizard .nav-tabs li.active');
    var activeHref = active.find('a').attr('href'); // Get the href of the active tab content
    var previous = active.prev('li');
    
    if (previous.length > 0) {
        var previousHref = previous.find('a').attr('href'); // Get the href of the previous tab content

        // Hide the current active tab and its content
        active.addClass('d-none');
        active.removeClass('active');
        $(activeHref).addClass('d-none');
        $(activeHref).removeClass('active');
        // Show the previous tab and its content
        previous.removeClass('d-none');
        previous.addClass('active');
        $(previousHref).removeClass('d-none');
        $(previousHref).addClass('active');
        // Call prevTab function with the previous tab element
        prevTab(active);
    }
}

$('.nav-tabs').on('click', 'li', function() {
    $('.nav-tabs li.active').removeClass('active');
    $(this).addClass('active');
});


function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}

function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

function nth(n) {
    return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th"
}


function getOrderSiderOverview() {
    if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != undefined) {
        var userData = JSON.parse(localStorage.getItem('userdata'));
        var contactMappingId = userData['contactMappingId'];
        var url = origin + "/client/getFeedPersonalData/" + pId + "/" + businessId + "/" + contactMappingId + "/" + userData['mobile'] + '/' + userData['token'];

        $.ajax({
            url: url,
            type: "Post",
            dataType: "json",
            //headers: {"token":userData['token'] },
            success: function(result) {
                if (result['status'] == 0) {

                } else {
                    // console.log(result['feed']);
                    var feedB = '';
                    var feedD = "";
                    var feed = result['active_orders'];
                    if (feed.length > 0) {
                        $('#getOrderSiderOverviewOutler').show();
                        // $('.offers-section').show();
                        for (var k = 0; k < feed.length; k++) {
                            var orders = feed[k];
                            var url = origin + "/past-order/" + orders['orderId'];
                            var new_url = origin + "/past-order/" + orders['orderId'];
                            if(orders.categoryId == 4){
                                feedB += '<div class="offers-slider-start"><div class="a-order-div"><div class="order-header"><span>Reservation: #' + orders['orderId'] + '</span>';
                            }else{
                                feedB += '<div class="offers-slider-start"><div class="a-order-div"><div class="order-header"><span>Order: #' + orders['orderId'] + '</span>';
                            }
                            
                                if(orders.categoryId == 4){
                                    feedB +='<a href="' + url + '" style="color: #fff; background-color: var(--main-bg-color); padding: 2px 10px; border-radius: 50px !important; font-size: 12px;">View Reservation</a>';
                                }else{
                                    if(orders.deliveryStatus == 3 || orders.deliveryStatus == 4 || orders.deliveryStatus == 5 || pId == 7175 || ecomm == 1){
                                        feedB +='<a href="' + url + '" style="color: #fff; background-color: var(--main-bg-color); padding: 2px 10px; border-radius: 50px !important; font-size: 12px;">View Order</a>';
                                    }else{
                                        feedB +='<a href="' + new_url + '" style="color: #fff; background-color: var(--main-bg-color); padding: 2px 10px; border-radius: 50px !important; font-size: 12px;">View Order</a>';
                                    }
                                }
                            
                            feedB +='</div><div class="order-body">';
                            if(orders.running_order != 1){
                                feedB +='<div class="row w-100 m-0">';
                                // Add current class
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

                                if (orders.deliveryStatus == 3) {
                                    oresertime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Availed<br><span>' + moment(orders.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                                    
                                } else {
                                    oresertime = '<div class="order-tracking current"><span class="is-complete"></span><p>Availed</p></div>';
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
                                }else if (orders.orderType == 5) {
                                    if (orders.cancelledTime == null) {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + oresertime + '';
                                    } else {
                                        feedB += '' + oInvoicedAT + '' + oacceptedTime + '' + ocancelledTime + '';
                                    }
                                }

                                feedB += '</div>';
                            }
                            if (orders.deliveryOTP != null && orders.deliveryOTP != 'NULL' && orders.deliveryOTP != 'null' && orders.deliveryOTP != '' && orders.orderType == 1 && orders.orderType == 1) {
                                feedB += '<div class="row m-0"><div style="width:100%;text-align:right"><span style="background: #b0ddb0; color: #000; padding: 1px 5px; font-size: 11px; border-radius: 5px; margin-top: 8px; display: inline-block; margin-right: 7px;">Delivery Code <b>' + orders.deliveryOTP + '</b></span></div></div>';
                            }

                                if (contactNumber != 'NULL' && contactNumber != 'undefined') {
                                    feedB += '<ul class = "order-buttons"> <li> <a href = "tel:' + contactNumber + '"> <i class="las la-phone" > </i> Call Outlet</a> </li></ul> </div></div> </div>';
                                }
                            
                        }
                    } else {
                        $('#getOrderSiderOverviewOutler').hide();
                    }
                    // console.log(feedD);
                    $('#getOrderSiderOverview').show();
                    //$('#getOrderSiderOverview').attr("style", "display: block !important")
                    $('#getOrderSiderOverview').html(feedB);

                }
                $('.spinner').hide();

            }
        });
    }

}




//*----- Left Sidebar + Menu Popup Responsive Js-----*/

/*On Mobile Make Category As a Toggle Button*/
$('#showTop').click(function() {
    $('.menu-top').toggleClass('top-open');
    $('body').toggleClass('push bodytoggle');
    $('.fixed-black-screen').addClass('active');
    $('.backBtn').click(function() {
        $('.menu').removeClass('top-open');
        $('body').removeClass('push bodytoggle');
        $('.fixed-black-screen').removeClass('active');
        var subcategories = document.querySelectorAll('.subcategories');

        // Remove "active" class from all elements
        subcategories.forEach(function(element) {
            element.classList.remove('active');
        });

        // Hide all close buttons and show all open buttons
        document.querySelectorAll('[id^="close-"]').forEach(function(closeBtn) {
            closeBtn.style.display = 'none';
        });
        document.querySelectorAll('[id^="open-"]').forEach(function(openBtn) {
            openBtn.style.display = 'inline';
        });

        // Hide all subcategories
        document.querySelectorAll('[id^="sub-cat-"]').forEach(function(subCat) {
            subCat.style.display = 'none';
        });
    });
});

/*On click Scroll To Section*/
function scrollToSection(catId, subCatId = "") {
    $('#search-modal').modal('hide');
    for (const li of document.querySelectorAll(".subcategories")) {
        li.classList.remove("active");
    }
    sectionId = "#" + catId;
    $(".subcategories.sub_cat").css('font-weight', '');
    if (subCatId != "") {
        sectionId = "#" + subCatId;
        var sub_cat_label = catId + "-" + subCatId + "-li";
        $('#' + sub_cat_label).css('font-weight', 500);
    }

    if (screen.width > 767) {
        var scrollSecs = $(sectionId).offset();
        if (scrollSecs) {
            $('html, body').animate({
                scrollTop: $(sectionId).offset().top - 80
            }, 500);
        }
    }
    

    if (screen.width < 991) {
        $('.menu').removeClass('top-open bottom-open right-open left-open pushleft-open pushright-open');
        $('body').removeClass('push-toleft push-toright');
        $('body').removeClass('push bodytoggle');
        $('.fixed-black-screen').removeClass('active');
        var scrollSecs = $(sectionId).offset();
        if (scrollSecs) {
            $('html, body').animate({
                scrollTop: $(sectionId).offset().top - 150
            }, 500);
        }
    }

    if (screen.width < 991){

        // Hide all close buttons and show all open buttons
        document.querySelectorAll('[id^="close-"]').forEach(function(closeBtn) {
            closeBtn.style.display = 'none';
        });
        document.querySelectorAll('[id^="open-"]').forEach(function(openBtn) {
            openBtn.style.display = 'inline';
        });

        // Hide all subcategories
        document.querySelectorAll('[id^="sub-cat-"]').forEach(function(subCat) {
            subCat.style.display = 'none';
        });
    }else{
        var label = catId + "-li";
        var sectionLabel = document.getElementById(label);
        if (sectionLabel) {
            document.getElementById(label).classList.add("active");
        }
    }

    if (typeof webengage_tag == "function") {
        // Ensure catId is properly escaped and prefixed with '#'
        let escapedCatId = catId + '-li';

        let element = document.getElementById(escapedCatId);

    
        if (element) {
            let imgElement = element.querySelector('img').src;
            let imgSrc = imgElement ? imgElement : 'Image not found';

            // Fetch the count
            let countElement = element.querySelector('.count-n').textContent;
            let count = countElement ? parseInt(countElement.replace(/[()]/g, ''), 10) : 0;

            // Fetch the name
            let nameElement = element.querySelector('span').textContent;
            let name = nameElement ? nameElement : 'Name not found';

            webengage.track("Category Viewed", {
                "Store Name": outletName,
                "Store ID": businessId,
                "City": city,
                "Locality": locality,
                "Category Name": name,
                "Category ID": catId,
                "Image URL" : imgSrc,
                "Total Items" : count
            });
        }
    }
}

/*On Scroll Change Active*/
$(window).scroll(function(e) {
    e.stopPropagation();
    e.preventDefault();
    var distance = $(window).scrollTop();
    $('.page-section').each(function(i) {
        var currentScrollPos = $(document).scrollTop();
        if (screen.width > 767) {
            if ($(this).position().top <=
                distance + 50) {

                $('.navigationtwo .subcategories.active')
                    .removeClass('active');

                $('.navigationtwo .subcategories:not(.sub_cat)').eq(i)
                    .addClass('active');

                $('.page-section').removeClass('top_activ_elem');
                let active_nav = $('.navigationtwo .subcategories.active').attr('lid');
                $('#' + active_nav).addClass('top_activ_elem');
                let subcat = $('.top_activ_elem .inner-sub-page-sec .row h5');
                subcat.each(function() {
                    var refElem = $(this).position().top - 50;
                    var refElemHeight = $(this).height() + 150;
                    if (refElem <= currentScrollPos && refElem + refElemHeight > currentScrollPos) {
                        let sub_cat_elem = $(this).attr('id');
                        let sub_cat_label = active_nav + "-" + sub_cat_elem + "-li";
                        $('#' + sub_cat_label).siblings().css('font-weight', '');
                        $('#' + sub_cat_label).css('font-weight', 500);
                    }
                });
            }
        }
        if (screen.width < 767) {
            if ($(this).position().top <=
                distance + 133) {

                // $('.navigationtwo .subcategories.active')
                //     .removeClass('active');

                // $('.navigationtwo .subcategories:not(.sub_cat)').eq(i)
                //     .addClass('active');

                $('.page-section').removeClass('top_activ_elem');
                let active_nav = $('.navigationtwo .subcategories.active').attr('lid');
                $('#' + active_nav).addClass('top_activ_elem');
                let subcat = $('.top_activ_elem .inner-sub-page-sec .row h5');
                subcat.each(function() {
                    var refElem = $(this).position().top - 50;
                    var refElemHeight = $(this).height() + 150;
                    if (refElem <= currentScrollPos && refElem + refElemHeight > currentScrollPos) {
                        let sub_cat_elem = $(this).attr('id');
                        let sub_cat_label = active_nav + "-" + sub_cat_elem + "-li";
                        $('#' + sub_cat_label).siblings().css('font-weight', '');
                        $('#' + sub_cat_label).css('font-weight', 500);
                    }
                });
            }
        }

    });

    let act_elm = $('.navigationtwo .subcategories.active');
    let cont = $('.navigationtwo #sectionList');
    if (act_elm != undefined && act_elm.length > 0) {
        let currPos = $(this).scrollTop();
        if (currPos > 4000) {
            var position = act_elm.offset().top -
                cont.offset().top +
                cont.scrollTop();
            cont.animate({
                scrollTop: position
            }, 10);
        } else {
            cont.scrollTop(0);
        }
    }
}).scroll();

//*----- Left Sidebar + Menu Popup Responsive Js-----*/



//*----- Sticky Menu On Mobile Top Full Js-----*/

/*show menu on scroll*/
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top - 120;
    if (window_top > div_top) {
        $('.secondary-nav-outer').addClass('stick');
    } else {
        $('.secondary-nav-outer').removeClass('stick');
    }
}

$(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});


/*On Scroll Change Active*/
$(window).scroll(function() {
    var distance = $(window).scrollTop();
    $('.page-section').each(function(i) {

        if ($(this).position().top <=
            distance + 123) {

            $('.secondary-nav .nav-link.active')
                .removeClass('active');

            $('.secondary-nav .nav-link').eq(i)
                .addClass('active');
        }

    });
}).scroll();

$(".secondary-nav a[href^='#']").on('click', function(event) {
    var target = this.hash;
    event.preventDefault();

    var navOffset = $('.secondary-nav').height();

    return $('html, body').animate({
        scrollTop: $(this.hash).offset().top - 150
    }, 500, function() {
        return window.history.pushState(null, null, target);
    });
});

/*make menu scrollable*/
$(".secondary-nav li").click(function() {
    centerLI(this, '.vam');
    // Dropdown Toggle
    if (!$(this).hasClass('dropdown')) {
        $('.nav-link').removeClass('visible');
    }
});

function centerLI(target, outer) {
    var out = $(outer);
    var tar = $(target);
    var x = out.width() - 50;
    var y = tar.outerWidth(true);
    var z = tar.index();
    var q = 0;
    var m = out.find('li');
    for (var i = 0; i < z; i++) {
        q += $(m[i]).outerWidth(true);
    }
    //out.scrollLeft(Math.max(0, q - (x - y)/2));
    out.animate({
        scrollLeft: Math.max(0, q - (x - y) / 2)
    }, 500);

}

//*----- Sticky Menu On Mobile Top Full Js-----*/


/*view more view Less*/
$(document).ready(function() {
    // Configure/customize these variables.
    var showChar = 60; // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";


    $('.more').each(function() {
        var content = $(this).html();

        if (content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext + '</span><span class="morecontent"><span>' + h + '</span>&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

            $(this).html(html);
        }

    });

    $(".morelink").click(function() {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});

/*View More View Less*/


/*sticky Search and Veg toggle*/
function sticky_relocate_two() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-toggle').offset().top + 80;
    if (window_top > div_top) {
        $('.veg-toggle').addClass('stickp');
        $('.cart-center').addClass('veg-toggle-space');
    } else {
        $('.veg-toggle').removeClass('stickp');
        $('.cart-center').removeClass('veg-toggle-space');
    }
}

$(function() {
    $(window).scroll(sticky_relocate_two);
    sticky_relocate_two();
});


if ($(window).width() <= 767) {
    $('.class-move-nw').append($('.rating-tp'));
}

function openSearchModal() {
    $('#search-modal').modal('show');
    $('#featuredProductsSearch').show();
    $('#productSearchDiv').hide();
    $('#searchText').val('');
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
    if (typeof gtag === "function") {

        gtag('event', 'promocode_copied', {
            'event_category': 'Promo copied',
            'event_label': 'Promo code copied -' + copyText.value,  // Label describing the button
            'value': 1  // Optional: you can pass a value if needed
        });
    }
    copyText.blur();
    window.getSelection().removeAllRanges();

}

$('#search-modal').on('shown.bs.modal', function() {
    $('#searchText').focus();
})
$('#search-modal').on('hidden.bs.modal', function() {
    $('#searchVegNonVeg').hide();
    $('#searchText').html('');
    $('#filterVeg').prop('checked', false);
    $('#filterNonVeg').prop('checked', false);
})

$('#bogoModal').on('hidden.bs.modal', function() {
    checkedState = {};
})

$('#comboModal').on('hidden.bs.modal', function() {
    checkedState = {};
    $('#selected_combo').html('');
});

$('#customisable-item-modal').on('hide.bs.modal', function() {
    $(".modal-body").scrollTop(0); // Scroll to the top position
});

/*modal image popup*/
$(document).ready(function() {
    // required elements
    var imgPopup = $('.img-popup');
    var imageOpt = $('.image-optimize');
    var popupImage = $('.img-popup .image-optimize img');
    var closeBtn = $('.close-btn');
    
    // handle events
    $('.imgprofile').on('click', function() {
    var img_src = $(this).children('img').attr('src');
    imageOpt.children('img').attr('src', img_src); // Fixed this line
    imgPopup.addClass('opened');
    });
    
    $(imgPopup).add(closeBtn).on('click', function() { // Fixed this line
    imgPopup.removeClass('opened');
    imageOpt.children('img').attr('src', ''); // Fixed this line
    });
    
    popupImage.on('click', function(e) {
    e.stopPropagation();
    });
    
    
});
/*modal image popup*/


function getWalletData(){
    var userdata=JSON.parse(localStorage.getItem("userdata"));
    var token =  userdata['token'];
    var contactMappingId = userdata['contactMappingId'];
    var mobileNo =  userdata['mobile'];
    var parentBusinessId = parentId;
    var origin =window.location.origin;
    var url= origin + '/client/getWalletDetails';

    $.ajax({
        url: url,
        type: 'GET',
        data: {contactMappingId,parentBusinessId,businessId,token,mobileNo},
        success: function(response){
            var json = $.parseJSON(response);
            if(json.status == 1)
            {
                
                if(json.walletDetails != null && json?.walletDetails?.length > 0){

                    $('#count_brownie').show();
                    $(".single-toggle").addClass("intro");
                    $.each(json.walletDetails, function(index, item) {
                        if (item.available != null) {
                            $('#points_remaning').html(item.available);
                        } else {
                            $('#points_remaning').html('0');
                        }

                        if (item.redemption_pct != null) {
                            $('#redemption_pct').html(item.redemption_pct);
                        }

                        if(item?.wallet_rule && item.wallet_rule != null && item.wallet_rule !=''){
                            $('#wallet_rule').html(item.wallet_rule);
                        }
                        
                    });
                }else{
                    $('#count_brownie').hide();
                    $(".single-toggle").removeClass("intro");
                }

                
            }
        }
    });
}

function toggleSub(menuId) {
    // Get all subcategories elements
    var subcategories = document.querySelectorAll('.subcategories');
    var element = document.getElementById(menuId + '-li');
    var isActive = element.classList.contains('active');

    // Remove "active" class from all elements
    subcategories.forEach(function(element) {
        element.classList.remove('active');
    });

    // Hide all close buttons and show all open buttons
    document.querySelectorAll('[id^="close-"]').forEach(function(closeBtn) {
        closeBtn.style.display = 'none';
    });
    document.querySelectorAll('[id^="open-"]').forEach(function(openBtn) {
        openBtn.style.display = 'inline';
    });

    // Hide all subcategories
    document.querySelectorAll('[id^="sub-cat-"]').forEach(function(subCat) {
        subCat.style.display = 'none';
    });

    if (!isActive) {
        // Add "active" class to the clicked element
        element.classList.add('active');
        $('#close-' + menuId).attr('style', 'display:inline !important');
        $('#open-' + menuId).attr('style', 'display:none !important');
        $('#sub-cat-' + menuId + '-li').show();
    }
}


var slotsData;

function openReserModal() {
    if (localStorage.getItem('userdata') && localStorage.getItem('userdata') != '') {
        var url = origin + '/client/getReserSlots';
        var post_params = {
            businessId: businessId,
            orderId: orderId
        };
        $.ajax({
            url: url,
            type: "POST",
            data: post_params,
            dataType: "json",
            success: function(result) {
                if (result['status'] == 1) {
                    slotsData = result;
                    var inputDateElement = document.getElementById('inputDate');
                    if (inputDateElement) {
                        var datesWithSlots = slotsData.slots
                            .filter(slot => slot.slots.length > 0)
                            .map(slot => slot.date);

                        if (datesWithSlots.length > 0) {
                            var minDate = datesWithSlots[0];
                            var maxDate = datesWithSlots[datesWithSlots.length - 1];
                            inputDateElement.setAttribute('min', minDate);
                            inputDateElement.setAttribute('max', maxDate);

                            inputDateElement.addEventListener('input', function(e) {
                                var selectedDate = e.target.value;
                                updateTimeSlots(selectedDate, slotsData.slotDate, slotsData.slotTimig);
                            });

                            var slotDate = slotsData.slotDate;
                            var slotTimig = slotsData.slotTimig;
                            var preselectDate = datesWithSlots.includes(slotDate) ? slotDate : datesWithSlots[0];
                            var preselectTime = '';

                            if (preselectDate === slotDate) {
                                var selectedDateSlots = slotsData.slots.find(slot => slot.date === slotDate);
                                if (selectedDateSlots) {
                                    var isValidSlotTiming = selectedDateSlots.slots.some(slot => {
                                        var timeRange = slot.startDisplayName + ' - ' + slot.endDisplayName;
                                        if (timeRange === slotTimig) {
                                            preselectTime = timeRange;
                                            return true;
                                        }
                                        return false;
                                    });
                                    if (!isValidSlotTiming) {
                                        preselectTime = '';
                                    }
                                }
                            }

                            inputDateElement.value = preselectDate;
                            updateTimeSlots(preselectDate, preselectDate, preselectTime);

                            $('#reservation-modal').modal('show');
                        } else {
                            alert('No dates with slots available');
                        }
                    }
                }else {
                    alert('No slots available');
                }
            },
            error: function(xhr, status, error) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html('No Internet Connection');
                setTimeout(function() {
                    $('#promonotapplied').modal('hide')
                }, 2500);
            }
        });
    }else{
        openLogin();
    }
}

function updateTimeSlots(selectedDate, preselectDate, preselectTime) {
    if (slotsData && slotsData.slots) {
        var morningSlots = [];
        var afternoonSlots = [];
        var eveningSlots = [];

        var selectedDateSlots = slotsData.slots.find(slot => slot.date === selectedDate);
        if (selectedDateSlots) {
            selectedDateSlots.slots.forEach(function(slot) {
                if (slot.startHours < 12) {
                    morningSlots.push(slot);
                } else if (slot.startHours < 17) {
                    afternoonSlots.push(slot);
                } else {
                    eveningSlots.push(slot);
                }
            });

            displayTimeSlots(morningSlots, '#morning-times', '#show_morn_tab', preselectTime);
            displayTimeSlots(afternoonSlots, '#afternoon-times', '#show_after_tab', preselectTime);
            displayTimeSlots(eveningSlots, '#evening-times', '#show_even_tab', preselectTime);

            var $tabs = $('#myTabtwo .nav-link');
            var $tabContents = $('#myTabContenttwo .tab-pane');

            $tabs.removeClass('active');
            $tabContents.removeClass('show active');

            if (preselectTime) {
                $tabs.each(function(index) {
                    if ($tabContents.eq(index).find('li .time-slot.active').length > 0) {
                        $(this).addClass('active');
                        $tabContents.eq(index).addClass('show active');
                    }
                });
            } else {
                var $tabWithSlots = $tabs.filter(function(index) {
                    return $tabContents.eq(index).find('li').length > 0;
                }).first();
                $tabWithSlots.addClass('active');
                $($tabWithSlots.attr('href')).addClass('show active');
            }
        } else {
            console.error('No slots available for the selected date');
        }
    } else {
        console.error('slotsData is undefined or does not have a slots property');
    }
}

function displayTimeSlots(slots, listId, tabId, preselectTime) {
    if (slots.length > 0) {
        $(tabId).show();
        var slotsHtml = slots.map(function(slot) {
            var isActive = preselectTime === (slot.startDisplayName + ' - ' + slot.endDisplayName) ? ' active' : '';
            return '<li><a href="javascript:void(0)" class="time-slot' + isActive + '" value="' + slot.id + '">' + slot.startDisplayName + ' - ' + slot.endDisplayName + '</a></li>';
        }).join('');
        $(listId).html(slotsHtml);

        return slotsHtml.includes('class="time-slot active"');
    } else {
        $(tabId).hide();
        $(listId).html('');
        return false;
    }
}




$(document).on('click', '.time-slot', function() {
    $('.time-slot').removeClass('active'); // Remove 'active' class from all time slots
    $(this).addClass('active'); // Add 'active' class to the clicked time slot
});

function saveSlot(){
    var selectedDate = document.getElementById('inputDate').value;
    var selectedSlotElement = document.querySelector('.time-slot.active');
    


    if (!selectedDate) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html('Kindly Select the Date!');
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2500);
        return false;
    }

    if (!selectedSlotElement) {
        $('#promonotapplied').modal('show');
            $('#promonotmsg').html('Kindly Select the Slot Timing!');
            setTimeout(function() {
                $('#promonotapplied').modal('hide')
            }, 2500);
            return false;
    }

    var selectedSlotValue = selectedSlotElement.getAttribute('value');
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    var url = origin + "/client/setSlot?contactId=" + contactId + "&contactMappingId=" + contactMappingId + "&businessId=" + businessId + "&token=" + token + "&orderId=" + orderId + "&slotDate=" + selectedDate + "&slotTime=" + selectedSlotValue;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",

        success: function(result) {
            if (result['status'] == 1) {
                $('#reservation-modal').modal('hide');
                window.location.href = "/checkout/" + businessId + "/5";
            }
        },
        error: function(){
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html('No Internet Connection');
            setTimeout(function() {
                $('#promonotapplied').modal('hide')
            }, 2500);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const scrollRight = document.getElementById("scrollRight");
    const productListContainer = document.querySelector(".product-list-container");
    const scrollLeft = document.getElementById("scrollLeft");

    if(scrollRight && scrollLeft &&  productListContainer){

        scrollRight.addEventListener("click", function() {
            productListContainer.scrollBy({
              top: 0, 
              left: 280, 
              behavior: 'smooth'
            });
          });
          
        scrollLeft.addEventListener("click", function() {
            productListContainer.scrollBy({
              top: 0, 
              left: -280, 
              behavior: 'smooth'
            });
        });

    }

});