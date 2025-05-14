var origin = window.location.origin;
var businessName;
var ecomm;
var localityMapping;
var map=null;
var marker=null;
$('textarea').on('keydown', function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevent form submission if inside a form
        $(this).val($(this).val() + "\n"); // Manually add new line
    }
});
$('#newAddressModal').on('hidden.bs.modal', function () {
    // $(this).find('form')[0].reset();  // Reset form fields
    // $(this).find('input[type="text"]').val('');  // Clear text inputs
    // $(this).find('select').val('');  // Reset select elements
    $(this).find('.list-wrap').addClass('d-none');  // Hide any dropdowns
    $(this).find('#mapLoader').hide();  // Hide loading spinner
    $(this).find('#map-error').hide();  // Hide error message
});
$('#addAddModal').on('hidden.bs.modal', function () {
    // // Reset all input fields
    // $(this).find('input[type="text"]').val('');
    // $(this).find('input[type="hidden"]').val('');
    // Reset radio buttons to default selection
    $(this).find('input[type="radio"]').prop('checked', false);
    $(this).find('input[type="radio"][value="Home"]').prop('checked', true);

    // Reset any displayed text
    // $(this).find('.fulladd, .fullnot, .fulladdh').text('');
});
$('#newAddressModalEcomm').on('hidden.bs.modal', function () {
    // Reset form fields
    $(this).find('form')[0].reset();

    // Reset radio buttons
    $('input[name="newAddress"]').prop('checked', false);
    $('#radio1_ecom').prop('checked', true); // Set default radio button
    // $('#deliveryAddressId_ecom').val('');

    // Hide error messages
    $('#danger-alert-address').hide();
    $('#errorMessageAddress').text('');
});
$('#newAddPhone, #mobileNoCust').keypress(function(e) {
    return isNumber(e);
});

$(document).ready(function() {
    // $('.spinner').show();
    // origin = window.location.origin +  '/-master';
    $(function() {

        setTimeout(function() { 
            $(".animation-lottie").removeClass("d-md-block"); 
            $(".animation-lottie").removeClass("d-block");
            $(".animation-lottie").addClass("d-none"); 
        }, 3500)

        setTimeout(function(){
            $('.free-rewards').removeClass("d-none");
        }, 3500);
    });
    let debounceTimer;

    $('#pincode_ecom').on('input', function() {
        clearTimeout(debounceTimer);
        const pincode = $(this).val();

        var pincodePattern = /^\d{6}$/;

        if(pincode == '' || !pincodePattern.test(pincode)){
            $('#error_pincode_ecomm').html('Please enter a valid pincode');
            $('#error_pincode_ecomm').show();
            return false;
        }
        if (pincode.length >= 2 && pincode.length <= 12) {
            debounceTimer = setTimeout(handlePincodeApiCall, 500); // 500ms debounce time
        }
    });


    $('#pincode_ecom').on('keyup change', function() {
        var pincode = $(this).val();

        if (pincode === '') {
            $('#error_pincode_ecomm').html('');
            $('#error_pincode_ecomm').hide();
        }
    });
});
function handlePincodeApiCall() {
    var pincode = $('#pincode_ecom').val();

    if (pincode.length >= 2 && pincode.length <= 12) {
        $.ajax({
            url: origin + '/client/getPinCodeData',
            type: 'POST',
            data: { pincode: pincode,parentId: parentId},
            dataType:"json",
            success: function(response) {
                
                if(response['status'] == 1){
                    $('#error_pincode_ecomm').hide();
                    var data = response?.data;
                    $('#city_ecom').val(data[0]['city']);
                    $('#state_ecom').val(data[0]['state']);
                }else{
                    $('#error_pincode_ecomm').html('Not Delivering to this area');
                    $('#error_pincode_ecomm').show();
                    $('#city_ecom').val('');
                    $('#state_ecom').val('');
                }

            },
            error: function(error) {

                $('#error_pincode_ecomm').html(error);
                $('#error_pincode_ecomm').show();
                $('#city_ecom').val('');
                $('#state_ecom').val('');
            }
        });
    } else {
        $('#error_pincode_ecomm').html('');
        $('#error_pincode_ecomm').html('Please enter a valid pincode.');
        $('#error_pincode_ecomm').show();
    }
}

$(function() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var name = userData['name'];
    var mobile = userData['mobile'];
    var email = userData['email'];
    var gender = userData['gender'];
    var dob = userData['dob'];
    var anniversary = userData['anniversary'];
    if (document.getElementById('name')) {
        document.getElementById('name').value = name;
        if(name != '' && name != null && name != 'null'){
            $('#user_name').html(name);
        }else{
            $('#user_name').html("User");
        }
    }

    if (document.getElementById('namevalue')) {
        document.getElementById('namevalue').value = name;
        if(name != '' && name != null && name != 'null'){
            $('#namevalue').html(name);
        }else{
            $('#namevalue').html("User");
        }
    }

    
    if (document.getElementById('mobile')) {
        document.getElementById('mobile').value = mobile;
        $('#mobile').html('+91 ' + mobile);
    }
    if (document.getElementById('emailId')) {
        document.getElementById('emailId').value = email;
    }

if(gender != '' && gender != null && gender != 'null' && document.getElementById('MaleGenderNew') && document.getElementById('FemaleGenderNew')){
        if(document.getElementById('MaleGenderNew') && gender == 'Male'){
            var maleGenderNewRadioButton = document.getElementById("MaleGenderNew");
            maleGenderNewRadioButton.checked = true;

        }else{
            var maleGenderNewRadioButton = document.getElementById("MaleGenderNew");
            maleGenderNewRadioButton.checked = false;
        }

        if(document.getElementById('FemaleGenderNew') && gender == 'Female'){
            var femaleGenderNewRadioButton = document.getElementById("FemaleGenderNew");
            femaleGenderNewRadioButton.checked = true;
        }else{
            var femaleGenderNewRadioButton = document.getElementById("FemaleGenderNew");
            femaleGenderNewRadioButton.checked = false;
        }
    }

    if (dob != '' && dob != null && dob != '0000-00-00' && document.getElementById('DateOfBirthNew')) {
        var components = dob.split('-');
        if (components.length === 3) {
            var formattedDate = components[0] + '-' + components[1] + '-' + components[2];
    
            document.getElementById('DateOfBirthNew').value = formattedDate;
        }
    }
    
    if (anniversary != '' && anniversary != "null" && anniversary != null && anniversary != '0000-00-00' && document.getElementById('AniversaryLabelNew')) {
        var components = anniversary.split('-');
        if (components.length === 3) {
            var formattedDate = components[0] + '-' + components[1] + '-' + components[2];
    
            document.getElementById('AniversaryLabelNew').value = formattedDate;
        }
    }

});
function getReward(businessId, orderId){

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];

    var post_params = {
        businessId: businessId,
        contactMappingId : contactMappingId,
        orderId: orderId,
        parentBusinessId: pId
    };

    var url = origin +  '/client/getOrderReward';

    $.ajax({
        url: url,
        type: "POST",
        data:post_params,
        dataType: "json",
        headers:{
            token : token
        },
        success: function(result) {
            
            if(result['status'] == 1){
                
                var reward = result?.reward;
                // console.log(reward);
                
                if(reward && reward != undefined && reward != null && reward != ''){
                    $('#reward-collection').removeClass('d-none');
                    if (reward[0] && reward[0].hasOwnProperty('scratch')) {
                        $('#reward_des').html('Hurray! You just earned a Reward!');
                        $('#reward_undes').html('Tap to reveal your reward');
                        $('#append_unscratch').html('<a href="#"  class="call-btn" onclick=\'showUnscratchRewardDetails(' + JSON.stringify(reward[0]) + ','+ orderId +')\'>Reveal Now</a>');
                    }else if(reward['scratch'] == 0){
                        $('#reward_des').html('Hurray! You just earned a Reward!');
                        $('#reward_undes').html('Tap to reveal your reward');
                        $('#append_unscratch').html('<a href="#" class="call-btn" onclick=\'showUnscratchRewardDetails(' + JSON.stringify(reward) + ','+ orderId +')\'>Reveal Now</a>');
                    }else{
                        $('#reward_des').html('Yay! You unlocked your Reward!');
                        $('#reward_undes').html('Tap to view details');
                        $('#append_unscratch').html('<a href="#" class="call-btn" onclick=\'viewRewardDetails(' + JSON.stringify(reward) + ')\'>View Reward</a>');
                    }
                    
                    $('#show_reward').show();
                }else{
                    $('#show_reward').hide();
                }
            }else{
                $('.hurray-section').hide();
            }
        }
    });
}
function showUnscratchRewardDetails(reward,order_Id){
    if(reward){
        var data = '';

        var purchaseDate = new Date(reward['purchased_at']);
        var currentDate = new Date();
        var timeDifference = currentDate - purchaseDate;
        var dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days

        data += '<div class="center-div">';
        data += '<button type="button" class="close d-none d-md-inline-flex" data-dismiss="modal" aria-label="Close">';
        data += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">';
        data += '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.746872 0.546312C1.34167 -0.0484858 2.30603 -0.0484858 2.90083 0.546312L6.90077 4.54626L10.9007 0.546312C11.4955 -0.0484858 12.4599 -0.0484858 13.0547 0.546312C13.6495 1.14111 13.6495 2.10547 13.0547 2.70027L9.05473 6.70021L13.0547 10.7002C13.6495 11.295 13.6495 12.2593 13.0547 12.8541C12.4599 13.4489 11.4955 13.4489 10.9007 12.8541L6.90077 8.85417L2.90083 12.8541C2.30603 13.4489 1.34167 13.4489 0.746872 12.8541C0.152073 12.2593 0.152073 11.295 0.746872 10.7002L4.74682 6.70021L0.746872 2.70027C0.152073 2.10547 0.152073 1.14111 0.746872 0.546312Z" fill="#333333"></path>';
        data += '</svg>';
        data += '</button>';
        data += '<div class="text-center reward-block-inner" onclick=\'revealRewardDetails(' + JSON.stringify(reward) + ','+ order_Id + ')\'>';
        if (dayDifference > 1) {
            var expiry = new Date(reward['expires_at']);
            var timeexpiryDifference = expiry - currentDate;
            var dayexpiryDifference = Math.floor(timeexpiryDifference / (1000 * 3600 * 24));
            data += '<p class="newly-added expired-nw">Expires in ' + dayexpiryDifference + ' days</p>';
        } else {
            data += '<p class="newly-added">Newly Added</p>';
        }
        data += '<div class="gift-svg">';
        data += '<svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">';
        data += '<path d="M61.5233 27.3941H49.9028C51.0697 26.1008 51.799 24.4064 51.799 22.532C51.799 18.511 48.5268 15.2388 44.5058 15.2388C41.9677 15.2388 39.736 16.5443 38.4281 18.5159C37.1202 16.5443 34.8884 15.2388 32.3504 15.2388C28.3294 15.2388 25.0572 18.511 25.0572 22.532C25.0572 24.4064 25.7889 26.1008 26.9534 27.3941H15.3329C13.3224 27.3941 11.6863 29.0303 11.6863 31.0408V38.334C11.6863 40.3445 13.3224 41.9806 15.3329 41.9806H16.5484V67.5069C16.5484 69.5174 18.1845 71.1535 20.195 71.1535H35.997H40.8592H56.6611C58.6716 71.1535 60.3078 69.5174 60.3078 67.5069V41.9806H61.5233C63.5338 41.9806 65.1699 40.3445 65.1699 38.334V31.0408C65.1699 29.0303 63.5338 27.3941 61.5233 27.3941ZM44.5058 17.6698C47.1873 17.6698 49.3679 19.8505 49.3679 22.532C49.3679 25.2135 47.1873 27.3941 44.5058 27.3941H40.8592H39.6436V22.532C39.6436 19.8505 41.8243 17.6698 44.5058 17.6698ZM27.4883 22.532C27.4883 19.8505 29.6689 17.6698 32.3504 17.6698C35.0319 17.6698 37.2126 19.8505 37.2126 22.532V27.3941H35.997H32.3504C29.6689 27.3941 27.4883 25.2135 27.4883 22.532ZM14.1174 38.334V31.0408C14.1174 30.3722 14.6619 29.8252 15.3329 29.8252H32.3504H34.7815V39.5495H28.8545H17.764H15.3329C14.6619 39.5495 14.1174 39.0025 14.1174 38.334ZM18.9795 67.5069V41.9806H28.857H34.7839V68.7224H20.1975C19.5241 68.7224 18.9795 68.1754 18.9795 67.5069ZM37.2126 68.7224V29.8252H38.4281H39.6436V40.7602V40.765V40.7699V68.7224H37.2126ZM57.8767 67.5069C57.8767 68.1754 57.3321 68.7224 56.6611 68.7224H42.0747V41.9806H46.8615H57.8767V67.5069ZM62.7388 38.334C62.7388 39.0025 62.1943 39.5495 61.5233 39.5495H59.0922H46.8615H42.0747V29.8252H44.5058H61.5233C62.1943 29.8252 62.7388 30.3722 62.7388 31.0408V38.334Z" fill="white"></path>';
        data += '<path d="M55.4456 17.6699L56.4181 13.7801L60.3078 12.8077L56.4181 11.8353L55.4456 7.94556L54.4732 11.8353L50.5835 12.8077L54.4732 13.7801L55.4456 17.6699Z" fill="white"></path>';
        data += '<path d="M60.3077 17.6697L59.8214 19.6145L57.8766 20.1008L59.8214 20.587L60.3077 22.5318L60.7939 20.587L62.7387 20.1008L60.7939 19.6145L60.3077 17.6697Z" fill="white"></path>';
        data += '<path d="M62.7387 12.8077L63.2249 10.8628L65.1698 10.3766L63.2249 9.89042L62.7387 7.94556L62.2525 9.89042L60.3076 10.3766L62.2525 10.8628L62.7387 12.8077Z" fill="white"></path>';
        data += '</svg>';
        data += '</div>';
        data += '<p class="mb-0 scatchnow">Reveal Now</p>';
        data += '</div>';
        data += '</div>';

        $('#append_scratch_data').html(data);
        $('#first-scratch').modal('show');
    }else{
        $('#first-scratch').modal('hide');
    }
}

function revealRewardDetails(reward,order_Id){
    var url= origin +  '/client/purchase_rewards';

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var mobileNo = userData['mobile'];

    $.ajax({
            url: url,
            type: 'POST',
            data: {
                parentBusinessId: pId,
                mobileNo: mobileNo,
                reward_id: reward._id,
                order_id : order_Id
            },
            dataType: "json",
                success: function(response){

                    if(response.status == 1)
                    {
                        var data = '';
                        var purchase = new Date();
                        var expire = new Date(reward.expires_at);
                        var timediff = expire - purchase;
                        var datediff = Math.floor(timediff / (1000 * 3600 * 24));

                        data += '<div class="claim-coupon-outer">';
			            data += '<button type="button" class="close d-none d-md-block" data-dismiss="modal" aria-label="Close">';
                        data += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">';
                        data += '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.746872 0.546312C1.34167 -0.0484858 2.30603 -0.0484858 2.90083 0.546312L6.90077 4.54626L10.9007 0.546312C11.4955 -0.0484858 12.4599 -0.0484858 13.0547 0.546312C13.6495 1.14111 13.6495 2.10547 13.0547 2.70027L9.05473 6.70021L13.0547 10.7002C13.6495 11.295 13.6495 12.2593 13.0547 12.8541C12.4599 13.4489 11.4955 13.4489 10.9007 12.8541L6.90077 8.85417L2.90083 12.8541C2.30603 13.4489 1.34167 13.4489 0.746872 12.8541C0.152073 12.2593 0.152073 11.295 0.746872 10.7002L4.74682 6.70021L0.746872 2.70027C0.152073 2.10547 0.152073 1.14111 0.746872 0.546312Z" fill="#333333"></path>';
                        data += '</svg>';
				        data += '</button>';
                        data += '<div class="claim-coupon">';
                        data += '<div class="claim-coupon-start">';
                        data += '<div class="coupon-img">';
                        if(reward.image_url != null && reward.image_url !=''){
                            data += '<img src="'+ reward.image_url +'" alt="'+ reward.title +'" width="150" height="150">';
                        }else{
                            data += '<img src="'+ logo +'" alt="'+ reward.title +'" width="150" height="150">';
                        }
                        data += '</div>';
                        data += '<h4 class="claim-heading">'+ reward.title +'</h4>';

                        data += '<p class="claim-para">Expires in '+ datediff +' Days</p>';
                        data += '</div>';
                        data += '</div>';
                        data += '</div>';
                        data += '<div class="modal-content">';
                        data += '<div class="modal-header">';
                        data += '<span class="modal-title" id="ModalTitle">Reward Details</span>';
                        data += '<button type="button" class="close d-md-none d-block" data-dismiss="modal" aria-label="Close">';
                        data += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">';
                        data += '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.746872 0.546312C1.34167 -0.0484858 2.30603 -0.0484858 2.90083 0.546312L6.90077 4.54626L10.9007 0.546312C11.4955 -0.0484858 12.4599 -0.0484858 13.0547 0.546312C13.6495 1.14111 13.6495 2.10547 13.0547 2.70027L9.05473 6.70021L13.0547 10.7002C13.6495 11.295 13.6495 12.2593 13.0547 12.8541C12.4599 13.4489 11.4955 13.4489 10.9007 12.8541L6.90077 8.85417L2.90083 12.8541C2.30603 13.4489 1.34167 13.4489 0.746872 12.8541C0.152073 12.2593 0.152073 11.295 0.746872 10.7002L4.74682 6.70021L0.746872 2.70027C0.152073 2.10547 0.152073 1.14111 0.746872 0.546312Z" fill="#333333"></path>';
                        data += '</svg>';
                        data += '</button>';
                        data += '</div>';
                        data += '<div class="modal-detail">';
                        data += '<div class="rewards-details">';
                        data += '<p class="reward-title">'+ reward.title +'</p>';
                        data += '<div class="d-flex justify-content-between align-items-center mt-2 mb-1">';
                        data += '<div>';
                        if(reward?.promo_code != null && reward.promo_code != ''){
                            data += '<span class="point-name">'+ reward.promo_code +'</span>';
                        }else{
                            data += '<span class="point-name">'+ response.promo_code +'</span>';
                        }
                        
                        data += '</div>';
                        data += '<div>';
                        data += '<textarea class="promo-code-span" id="copytxtunsc" style="position: absolute; left: -9999px;">'+ reward.promo_code +'</textarea>';
                        data += '<a href="javascript:void(0)" onclick="copyText()" class="promo-code-btn">Copy</a>';
                        data += '</div>';
                        data += '</div>';
                        data += '<p class="reward-expire">Expires in '+ datediff +' days</p>';
                        data += '<p class="reward-title">Terms & Conditions</p>';
                        data += '<ul class="rewars-ul">';
                        data +=  reward.tc;
                        data += '</ul>';
                        data += '<a href="'+ origin +'" class="scratch-button">Start Ordering</a>';
                        data += '</div>';
                        data += '</div>';
                        data += '</div>';
                                        
                        
                            $('#first-scratch').modal('hide');
                            $('#scratched_reward_data').html(data);
                            $('#reveal-modal').modal('show');
                            $('#reward_des').html('Yay! You unlocked your Reward!');
                            $('#reward_undes').html('Tap to view details');
                            $('#append_unscratch').html('<a href="#" class="call-button" onclick=\'viewRewardDetails(' + JSON.stringify(reward) + ')\'>View Reward</a>');
                            
                        
                    }else{
                        $('#reveal-modal').modal('hide');
                        $('#first-scratch').modal('hide');
                        $('#promonotapplied').modal('show');
                        $('#promonotmsg').html(response.msg);
                        setTimeout(function() {
                            $('#promonotapplied').modal('hide')
                        }, 2500);
                        return false;
                    }
                }
    });
}

function viewRewardDetails(reward){

    if(reward)
    {
        var data = '';
        var purchase = new Date();
        var expire = new Date(reward.expires_at);
        var timediff = expire - purchase;
        var datediff = Math.floor(timediff / (1000 * 3600 * 24));

        data += '<div class="claim-coupon-outer">';
        data += '<button type="button" class="close d-none d-md-block" data-dismiss="modal" aria-label="Close">';
        data += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">';
        data += '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.746872 0.546312C1.34167 -0.0484858 2.30603 -0.0484858 2.90083 0.546312L6.90077 4.54626L10.9007 0.546312C11.4955 -0.0484858 12.4599 -0.0484858 13.0547 0.546312C13.6495 1.14111 13.6495 2.10547 13.0547 2.70027L9.05473 6.70021L13.0547 10.7002C13.6495 11.295 13.6495 12.2593 13.0547 12.8541C12.4599 13.4489 11.4955 13.4489 10.9007 12.8541L6.90077 8.85417L2.90083 12.8541C2.30603 13.4489 1.34167 13.4489 0.746872 12.8541C0.152073 12.2593 0.152073 11.295 0.746872 10.7002L4.74682 6.70021L0.746872 2.70027C0.152073 2.10547 0.152073 1.14111 0.746872 0.546312Z" fill="#333333"></path>';
        data += '</svg>';
        data += '</button>';
        data += '<div class="claim-coupon">';
        data += '<div class="claim-coupon-start">';
        data += '<div class="coupon-img">';
        if(reward.image_url != null && reward.image_url !=''){
            data += '<img src="'+ reward.image_url +'" alt="'+ reward.title +'" width="150" height="150">';
        }else{
            data += '<img src="'+ logo +'" alt="'+ reward.title +'" width="150" height="150">';
        }
        data += '</div>';
        data += '<h4 class="claim-heading">'+ reward.title +'</h4>';

        data += '<p class="claim-para">Expires in '+ datediff +' Days</p>';
        data += '</div>';
        data += '</div>';
        data += '</div>';
        data += '<div class="modal-content">';
        data += '<div class="modal-header">';
        data += '<span class="modal-title" id="ModalTitle">Reward Details</span>';
        data += '<button type="button" class="close d-md-none d-block" data-dismiss="modal" aria-label="Close">';
        data += '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">';
        data += '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.746872 0.546312C1.34167 -0.0484858 2.30603 -0.0484858 2.90083 0.546312L6.90077 4.54626L10.9007 0.546312C11.4955 -0.0484858 12.4599 -0.0484858 13.0547 0.546312C13.6495 1.14111 13.6495 2.10547 13.0547 2.70027L9.05473 6.70021L13.0547 10.7002C13.6495 11.295 13.6495 12.2593 13.0547 12.8541C12.4599 13.4489 11.4955 13.4489 10.9007 12.8541L6.90077 8.85417L2.90083 12.8541C2.30603 13.4489 1.34167 13.4489 0.746872 12.8541C0.152073 12.2593 0.152073 11.295 0.746872 10.7002L4.74682 6.70021L0.746872 2.70027C0.152073 2.10547 0.152073 1.14111 0.746872 0.546312Z" fill="#333333"></path>';
        data += '</svg>';
        data += '</button>';
        data += '</div>';
        data += '<div class="modal-detail">';
        data += '<div class="rewards-details">';
        data += '<p class="reward-title">'+ reward.title +'</p>';
        data += '<div class="d-flex justify-content-between align-items-center mt-2 mb-1">';
        data += '<div>';
        if(reward?.promo_code != null && reward.promo_code != ''){
            data += '<span class="point-name">'+ reward.promo_code +'</span>';
        }
        
        data += '</div>';
        data += '<div>';
        data += '<textarea class="promo-code-span" id="copytxtunsc" style="position: absolute; left: -9999px;">'+ reward.promo_code +'</textarea>';
        data += '<a href="javascript:void(0)" onclick="copyText()" class="promo-code-btn">Copy</a>';
        data += '</div>';
        data += '</div>';
        data += '<p class="reward-expire">Expires in '+ datediff +' days</p>';
        data += '<p class="reward-title">Terms & Conditions</p>';
        data += '<ul class="rewars-ul">';
        data +=  reward.tc;
        data += '</ul>';
        data += '<a href="'+ origin +'" class="scratch-button">Start Ordering</a>';
        data += '</div>';
        data += '</div>';
        data += '</div>';
                        
        
        $('#first-scratch').modal('hide');
        $('#scratched_reward_data').html(data);
        $('#reveal-modal').modal('show');                            
    
    }
}
if (typeof pwa !== 'undefined' && pwa == "paytm") {
    $('#name').prop('readonly', true);
    $('#emailId').prop('readonly', true);
    $('#logout').hide();
}

function logout() {
    localStorage.clear();
    window.location.href = '/';
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

$(document).on('keydown', '#emailId', function(e) {
    if (e.which === 32) {
        return false;
    }
});

// trim space
$(".block-start-space").on("keyup", function() {
    var length = $.trim($(this).val()).length;
    if (length == 0) {
        $(this).val("");
    } else {
        $(this).val($(this).val().trimLeft(""));
    }
})


function updateProfile() {

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var name = document.getElementById('name');
    var mobile = document.getElementById('mobile');
    var email = document.getElementById('emailId');
    var gender = '';
   

    var dob = '';
    if ($('#DateOfBirthNew').val() != undefined) {
        dob = $('#DateOfBirthNew').val();
    }

    var married = '';
    var anniversary = '';
    if ($('#AniversaryLabelNew').val() != undefined) {
        anniversary = $('#AniversaryLabelNew').val();
        married = 1;
    }
    if (name.value == "") {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter name");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2500);
        return false;
    }
    if ($('input[name="gendernew"]:checked').val() != undefined) {
        gender = $('input[name="gendernew"]:checked').val();
    }
    if(pId == 7175 && gender == ''){
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please select gender");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2000);
        return false;
    }
    // if (email.value == '') {
    //     $('#promonotapplied').modal('show');
    //     $('#promonotmsg').html("Please enter email ID");
    //     setTimeout(function() {
    //         $('#promonotapplied').modal('hide')
    //     }, 2500);
    //     return false;
    // }

    if (validateEmail(email.value) == false && email.value != '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid email ID");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2500);
        return false;
    }


    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    var mobile = userData['mobile'];
    var params = 'contactId=' + contactId + '&contactMappingId=' + contactMappingId + '&businessId=' + pId + '&token=' + token;
    var url = '' + origin +  '/client/updateProfile?' + params;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: {
            name: name.value,
            email: email.value,
            gender : gender,
            dob: dob,
            anniversary : anniversary,
            married :married
        },
        success: function(result) {
            if (result.status == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result.data.msg);
                setTimeout(function() {
                    $('#promonotapplied').modal('hide')
                }, 2500);
                return false;
            } else {
                userData = JSON.parse(localStorage.getItem('userdata'));
                userData.name = name.value;
                userData.email = email.value;
                userData.dob = dob;
                userData.gender = gender;
                userData.anniversary = anniversary;
                userData.married = married;
                if(typeof webengage_tag == "function"){
                    if(userData.dob != null && userData.dob != '' && userData.dob != "null"){
                        var c_dob = new Date(userData.dob)
                    }else{
                        var c_dob = '';
                    }

                    if(userData.anniversary != null && userData.anniversary != '' && userData.anniversary != "null"){
                        var c_ann = new Date(userData.anniversary);
                    }else{
                        var c_ann = '';
                    }

                    webengage.track("Form Filled",{
                        "Phone Number" : userData.mobile,
                        "Email" : userData.email,
                        "First Name" : userData.name,
                        "Birth Date" : c_dob,
                        "Anniversary Date" : c_ann
                    });

                    if(userData.anniversary != null && userData.anniversary != '' && userData.anniversary != "null"){
                        webengage.user.setAttribute('we_anniversary_date', userData.anniversary);
                    }

                    if(userData.dob != null && userData.dob != '' && userData.dob != "null"){
                        webengage.user.setAttribute('we_birth_date', userData.dob);
                    }
    
                }

                localStorage.setItem('userdata', JSON.stringify(userData));
                if(name.value == '' || name.value == null || name.value == "null"){
                    document.getElementById("namevalue").innerText = "User";
                }else{
                    document.getElementById("namevalue").innerText = name.value;
                }
                document.getElementById("emailvalue").innerText = email.value;
                $('#promoapplied').modal('show');
                $('.promors').html('Profile updated successfully');
                if (typeof gtag === "function") {

                    gtag('event', 'profile_updated', {
                        'event_category': 'profile updated',
                        'event_label': 'Profile updated by user',  // Label describing the button
                        'value': 1  // Optional: you can pass a value if needed
                    });
                }
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
            }
        }
    });
}

function getPastOrder() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    var mobile = userData['mobile'];
    var action = 'close_order';
    var params = 'mobile=' + mobile + '&parentBusinessId=' + pId + '&contactMappingId=' +
        contactMappingId + '&businessId=' + pId + '&token=' + token + '&action=' + action;
    var url = '' + origin +  '/pay/getOrderInfo?' + params;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",

        success: function(result) {
            var data = "";
            $('.spinner').hide();
            if (result.status == 1) {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {


                        if(result.rows[i]['categoryId'] != 4){
                            if(result.rows[i]['deliveryStatus'] == 3 || result.rows[i]['deliveryStatus'] == 4 || result.rows[i]['deliveryStatus'] == 5 || pId == 7175){
                                var url = origin +"/past-order/" + result.rows[i]['id'];
                            }else{
                                var url = origin +"/past-order/" + result.rows[i]['id'];
                            }
                            
                        }else{
                            var url = origin +"/past-order/" + result.rows[i]['id'];
                        }

                        data += '<div class="col-lg-4 col-md-6 margins"><div class="order-card-new">';
                        var orderType = "";
                        var orderStatus = "";
                        var order_status_icon = "";
                        var order_status_icon_background = "";

                        if (result.rows[i]['orderType'] == 1) {
                            orderType = "Delivery";
                        } else if (result.rows[i]['orderType'] == 2) {
                            orderType = "Pickup";
                        } else if (result.rows[i]['orderType'] == 3) {
                            orderType = "Dine In";
                        } else if (result.rows[i]['orderType'] == 4) {
                            orderType = "In-Car";
                        }
                        if(result.rows[i]['cart_type'] != 2){
                        if (result.rows[i]['deliveryStatus'] == 0) {
                            orderStatus = 'Received <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11162)><circle cx=84.3525 cy=84.3517 fill=white r=66.391></circle><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><mask fill=white id=path-3-inside-1_622_11162><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"></path></mask><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"mask=url(#path-3-inside-1_622_11162) stroke=url(#paint0_linear_622_11162) stroke-width=13.0684></path><circle cx=61.9801 cy=108.18 fill=white r=11.088></circle></g><defs><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_622_11162 x1=89.5802 x2=41.6311 y1=95.1129 y2=85.8919><stop stop-color=white></stop><stop stop-color=white offset=1 stop-opacity=0></stop></linearGradient><clipPath id=clip0_622_11162><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            order_status_icon = 'las la-stopwatch';
                            order_status_icon_background = 'yellow';
                        } else if (result.rows[i]['deliveryStatus'] == 1) {
                            orderStatus = 'Accepted <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11162)><circle cx=84.3525 cy=84.3517 fill=white r=66.391></circle><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><mask fill=white id=path-3-inside-1_622_11162><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"></path></mask><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"mask=url(#path-3-inside-1_622_11162) stroke=url(#paint0_linear_622_11162) stroke-width=13.0684></path><circle cx=61.9801 cy=108.18 fill=white r=11.088></circle></g><defs><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_622_11162 x1=89.5802 x2=41.6311 y1=95.1129 y2=85.8919><stop stop-color=white></stop><stop stop-color=white offset=1 stop-opacity=0></stop></linearGradient><clipPath id=clip0_622_11162><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            order_status_icon = 'las la-check';
                            order_status_icon_background = 'greeni';
                        } else if (result.rows[i]['deliveryStatus'] == 7) {
                            orderStatus = 'Prepared <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11162)><circle cx=84.3525 cy=84.3517 fill=white r=66.391></circle><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><mask fill=white id=path-3-inside-1_622_11162><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"></path></mask><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"mask=url(#path-3-inside-1_622_11162) stroke=url(#paint0_linear_622_11162) stroke-width=13.0684></path><circle cx=61.9801 cy=108.18 fill=white r=11.088></circle></g><defs><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_622_11162 x1=89.5802 x2=41.6311 y1=95.1129 y2=85.8919><stop stop-color=white></stop><stop stop-color=white offset=1 stop-opacity=0></stop></linearGradient><clipPath id=clip0_622_11162><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            order_status_icon = 'las la-stopwatch';
                            order_status_icon_background = 'greeni';
                        }else if (result.rows[i]['deliveryStatus'] == 2) {
                            
                            if (result.rows[i]['orderType'] == 1) {
                                orderStatus = 'Out for Delivery <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11162)><circle cx=84.3525 cy=84.3517 fill=white r=66.391></circle><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><mask fill=white id=path-3-inside-1_622_11162><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"></path></mask><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"mask=url(#path-3-inside-1_622_11162) stroke=url(#paint0_linear_622_11162) stroke-width=13.0684></path><circle cx=61.9801 cy=108.18 fill=white r=11.088></circle></g><defs><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_622_11162 x1=89.5802 x2=41.6311 y1=95.1129 y2=85.8919><stop stop-color=white></stop><stop stop-color=white offset=1 stop-opacity=0></stop></linearGradient><clipPath id=clip0_622_11162><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            } else {
                                orderStatus = 'Prepared <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11162)><circle cx=84.3525 cy=84.3517 fill=white r=66.391></circle><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><path d="M157.815 84.0478C157.815 124.789 124.788 157.816 84.0476 157.816C43.3068 157.816 10.2798 124.789 10.2798 84.0478C10.2798 43.307 43.3068 10.28 84.0476 10.28C124.788 10.28 157.815 43.307 157.815 84.0478Z"clip-rule=evenodd fill=#E7B33B fill-rule=evenodd></path><mask fill=white id=path-3-inside-1_622_11162><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"></path></mask><path d="M50.436 84.0477C47.347 84.0477 44.802 81.5309 45.2412 78.4733C46.2543 71.4202 49.1771 64.7386 53.7421 59.1761C59.4963 52.1647 67.5035 47.3653 76.3996 45.5957C85.2957 43.8262 94.5301 45.196 102.529 49.4717C110.529 53.7475 116.798 60.6646 120.269 69.0445C123.74 77.4244 124.198 86.7486 121.565 95.4284C118.932 104.108 113.371 111.606 105.829 116.646C98.2877 121.685 89.2321 123.953 80.2054 123.064C73.0442 122.359 66.2528 119.701 60.5492 115.43C58.0765 113.579 58.0966 109.999 60.2808 107.815V107.815C62.4651 105.631 65.984 105.688 68.558 107.396C72.3485 109.91 76.7192 111.48 81.3018 111.932C87.753 112.567 94.2248 110.946 99.6147 107.345C105.005 103.743 108.979 98.3844 110.861 92.1812C112.742 85.9779 112.415 79.3142 109.934 73.3253C107.454 67.3364 102.973 62.3929 97.2562 59.3371C91.5393 56.2814 84.9397 55.3024 78.5819 56.567C72.2241 57.8317 66.5015 61.2617 62.3892 66.2726C59.4679 69.8322 57.4876 74.033 56.5855 78.4915C55.9729 81.5191 53.525 84.0477 50.436 84.0477V84.0477Z"mask=url(#path-3-inside-1_622_11162) stroke=url(#paint0_linear_622_11162) stroke-width=13.0684></path><circle cx=61.9801 cy=108.18 fill=white r=11.088></circle></g><defs><linearGradient gradientUnits=userSpaceOnUse id=paint0_linear_622_11162 x1=89.5802 x2=41.6311 y1=95.1129 y2=85.8919><stop stop-color=white></stop><stop stop-color=white offset=1 stop-opacity=0></stop></linearGradient><clipPath id=clip0_622_11162><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            }
                            order_status_icon = 'las la-stopwatch';
                            order_status_icon_background = 'greeni';
                        } else if (result.rows[i]['deliveryStatus'] == '3') {
                            if (result.rows[i]['orderType'] == 3) {
                                orderStatus = 'Served <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11169)><circle cx=84.1528 cy=84.152 fill=white r=66.391></circle><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path></g><defs><clipPath id=clip0_622_11169><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            } else if (result.rows[i]['orderType'] == 2) {
                                orderStatus = 'Picked Up <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11169)><circle cx=84.1528 cy=84.152 fill=white r=66.391></circle><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path></g><defs><clipPath id=clip0_622_11169><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            } else if (result.rows[i]['orderType'] == 5) {
                                orderStatus = 'Availed <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11169)><circle cx=84.1528 cy=84.152 fill=white r=66.391></circle><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path></g><defs><clipPath id=clip0_622_11169><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            }else {
                                orderStatus = 'Delivered <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_622_11169)><circle cx=84.1528 cy=84.152 fill=white r=66.391></circle><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path><path clip-rule=evenodd d="M157.616 83.8479C157.616 124.589 124.589 157.616 83.8479 157.616C43.1071 157.616 10.0801 124.589 10.0801 83.8479C10.0801 43.1071 43.1071 10.0801 83.8479 10.0801C124.589 10.0801 157.616 43.1071 157.616 83.8479ZM113.579 61.4938C115.739 63.6544 115.739 67.1575 113.579 69.3181L76.6949 106.202C74.5343 108.363 71.0312 108.363 68.8706 106.202L54.117 91.4484C51.9564 89.2878 51.9564 85.7848 54.117 83.6242C56.2776 81.4636 59.7807 81.4636 61.9413 83.6242L72.7827 94.4656L89.2686 77.9797L105.755 61.4938C107.915 59.3332 111.418 59.3332 113.579 61.4938Z"fill=#63932C fill-rule=evenodd></path></g><defs><clipPath id=clip0_622_11169><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            }
                            order_status_icon = 'las la-check';
                            order_status_icon_background = 'greeni';
                        } else if (result.rows[i]['deliveryStatus'] == 4 || result.rows[i]['deliveryStatus'] == 5) {
                            orderStatus = 'Rejected <svg fill=none style=width:100%;max-width:20px;margin-left:3px viewBox="0 0 168 168"xmlns=http://www.w3.org/2000/svg><g clip-path=url(#clip0_746_79)><circle cx=84.0727 cy=83.7677 fill=#EDEDED r=66.391></circle><circle cx=84.0727 cy=83.768 fill=white r=44.2607></circle><path clip-rule=evenodd d="M157.536 83.7678C157.536 124.509 124.509 157.536 83.7678 157.536C43.027 157.536 10 124.509 10 83.7678C10 43.027 43.027 10 83.7678 10C124.509 10 157.536 43.027 157.536 83.7678ZM61.4134 61.4136C63.574 59.253 67.0771 59.253 69.2377 61.4136L83.7676 75.9435L98.2973 61.4137C100.458 59.2531 103.961 59.2531 106.122 61.4137C108.282 63.5743 108.282 67.0774 106.122 69.238L91.5919 83.7677L106.121 98.2973C108.282 100.458 108.282 103.961 106.121 106.122C103.961 108.282 100.458 108.282 98.2972 106.122L83.7676 91.592L69.2378 106.122C67.0772 108.282 63.5742 108.282 61.4136 106.122C59.253 103.961 59.253 100.458 61.4136 98.2975L75.9433 83.7677L61.4134 69.2378C59.2528 67.0772 59.2528 63.5742 61.4134 61.4136Z"fill=#C52733 fill-rule=evenodd></path></g><defs><clipPath id=clip0_746_79><rect fill=white height=168 width=168></rect></clipPath></defs></svg>';
                            order_status_icon = 'las la-times';
                            order_status_icon_background = 'redi';
                        }

                    }else{
                        orderStatus = 'Direct Pay';
                        order_status_icon = 'las la-check';
                        order_status_icon_background = 'greeni';
                    }
                        icon = currency;

                        data+='<div class="order-card-header"><ul class="order-card-details"><li><div class="order-card-details-left"><div><img src="'+logo+'" alt="'+businessName+'" width="400" height="400"></div><div><h3><a href="javascript:void(0)" style="pointer-events: none;text-decoration:none;">#' + result.rows[i]['id'] + '</a></h3><p><a href="javascript:void(0)" style="pointer-events: none;text-decoration:none;">'+ result.rows[i]['locality'] + ', ' + result.rows[i]['city'] + '</a></p></div></div></li><li class="ordering-status"><p>'+orderStatus+'</p></li></ul></div>';
                            
                            
                            data +='<div class="order-card-bottom"><div class="row m-0"><div class="col-8 pr-1"><p class="mb-0"><p>'+ result.rows[i]['startTime'] +'</p><p class="mb-0">Order Type</p></div><div class="col-4 pl-1 right-allgg"><p class="mb-0"><b><i class="la la-inr"></i>' + result.rows[i]['total'] + '</b></p><p class="mb-0"><b>'+orderType+'</b></p></div></div></div>';
                            data +='<ul class="view-icons"><li><a href="' + url + '">'+ (result.rows[i]['categoryId'] == 4 ? 'View Reservation' : 'View Order') +'</a></li>';
                            if (result.rows[i]['deliveryStatus'] == 3) {
                                if(pId == 7175){
                                    if(result.rows[i]['rating'] == 0){
                                        data+='<li><a href="javascript:void(0);" onclick="rateTheoOrder(' + result.rows[i]['id'] + ',' + result.rows[i]['businessId'] +')">Rate Order</a></li>';
                                    }
                                }else{
                                    data+='<li><a href="#" data-toggle="modal" data-target="#rateoutlet" data-id="' + result.rows[i]['id'] + '" data-type="' + result.rows[i]['orderType'] + '"   onclick="setOrderId(' + result.rows[i]['id'] + ',' + result.rows[i]['businessId'] +')">Rate Order</a></li>';
                                    }    
                            }
                            if (result.rows[i]['deliveryStatus'] == 2 && result.rows[i]['orderType'] == 1) {
                                data += '</ul><div class="inner-body-detail" style="justify-content: center; margin-bottom: 0px;"><span style="display: inline-block;background-color: #EEF8F3;padding: 4px 7px;border-radius: 5px;width: 100%;text-align: center;font-weight: 700;color: #000;">Delivery Code: <span style="color: var(--main-bg-color);">'+result.rows[i]['deliveryOTP']+'</span></span></div>';
                            }
                    data +='</div></div>';
                    }
                    $('#listPastDiv').html("");
                    $('#listPastDiv').html(data);
                    $('#listPastDiv').show();
                    $('#No-pastorder').hide();
                } else {
                    $('#listPastDiv').hide();
                    $('#No-pastorder').show();
                }


            } else {
                    $('#listPastDiv').hide();
                    $('#No-pastorder').show();
            }

        }
    });

}
function reorder(oldOrderId,businessId,orderType){
    var userData = JSON.parse(localStorage.getItem('userdata'));
    localStorage.setItem('orderType',orderType);
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    $('.spinner').show();

    // var params = 'contactMappingId=' + contactMappingId + '&businessId=' + pId + '&token=' + token + '&isNew=1&action=view&orderId=' + orderId;
    // var url = origin +  '/client/cart?' + params;
   
    // $.ajax({
    //     url: url,
    //     type: "GET",
    //     dataType: "json",

        // success: function(result) {
    //         var oldOrderId =result['rows']['orderDetails'][0]['orderId'];
    //         var businessId=result['rows']['orderDetails'][0]['businessId'];
            // alert(result);
            localStorage.setItem('business', businessId);
            // localStorage.setItem('slug',slug);
            
            if (!localStorage.getItem('itemList') || localStorage.getItem('itemList') == '') {
        
                var j = {};
                j['bId'] = businessId;
                j['items'] = [];
                var finalArr = [];
                finalArr.push(j);
                // //console.log(JSON.stringify(j));
                localStorage.setItem('itemList', JSON.stringify(finalArr));
                // //console.log(localStorage.getItem('itemList'));
                
                // localStorage.setItem('itemNew',JSON.stringify(j));
            } else {
                
                // //console.log(localStorage.getItem('itemList'),'hgfdfh');
                if (JSON.parse(localStorage.getItem('itemList'))[0] == undefined || JSON.parse(localStorage.getItem('itemList'))[0]['bId'] == undefined) {
                    var j = {};
                    j['bId'] = businessId;
                    j['items'] = [];
                    var finalArr = [];
                    finalArr.push(j);
                    // //console.log(JSON.stringify(j));
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
            
            add_to_cart_wl('add',oldOrderId,businessId);
        // }
    // });
}

function getCallSVG(){
    var str='<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.73106 2.10621L8.91954 1.83677C9.57063 1.68867 10.2534 1.78252 10.8403 2.10082C11.4273 2.41911 11.8784 2.94009 12.1095 3.56655L12.8706 5.63014C13.0693 6.16897 13.0943 6.75648 12.9421 7.31024C12.7899 7.864 12.4682 8.35622 12.022 8.71784L10.4343 10.0041C10.3879 10.0417 10.3565 10.0946 10.3457 10.1533C10.2744 10.5463 10.4893 11.3361 11.0344 12.4515C11.4293 13.2617 11.7994 13.8377 12.1243 14.168C12.3519 14.3993 12.4814 14.4543 12.5393 14.4423L14.5871 13.9678C15.1463 13.8383 15.732 13.887 16.2621 14.1071C16.7923 14.3272 17.2402 14.7077 17.5432 15.1952L18.6973 17.0555C19.0487 17.6211 19.1829 18.2951 19.0751 18.9522C18.9672 19.6093 18.6246 20.2049 18.1108 20.6285L17.1678 21.4051C16.6679 21.8168 16.0699 22.0921 15.432 22.204C14.7941 22.316 14.1382 22.2608 13.5279 22.0439C10.8337 21.0863 8.53136 18.5971 6.58964 14.6222C4.64626 10.6423 4.09865 7.29239 5.00673 4.57569C5.21065 3.96467 5.56854 3.41648 6.04588 2.98396C6.52323 2.55143 7.10295 2.24909 7.73106 2.10621ZM8.06462 3.56979C7.6877 3.65523 7.33914 3.83632 7.05254 4.09561C6.76593 4.3549 6.55095 4.68364 6.42831 5.05016C5.66646 7.33493 6.15122 10.3046 7.9384 13.9639C9.72392 17.6182 11.7651 19.8257 14.0318 20.6314C14.398 20.7614 14.7916 20.7944 15.1743 20.7271C15.557 20.6598 15.9157 20.4946 16.2156 20.2475L17.1576 19.4708C17.3913 19.2783 17.5471 19.0075 17.5963 18.7087C17.6454 18.41 17.5844 18.1036 17.4246 17.8464L16.2704 15.9871C16.1327 15.7652 15.929 15.5921 15.6878 15.492C15.4466 15.3918 15.1802 15.3697 14.9258 15.4288L12.873 15.9049C11.6817 16.1711 10.6883 15.159 9.68766 13.1099C9.0115 11.7298 8.72559 10.6775 8.87078 9.88467C8.94544 9.47285 9.16554 9.10319 9.48959 8.83897L11.0774 7.55271C11.2801 7.38823 11.4262 7.16441 11.4953 6.91266C11.5643 6.66091 11.5528 6.39386 11.4624 6.14897L10.7023 4.08546C10.5972 3.8007 10.3921 3.56389 10.1253 3.41923C9.85848 3.27457 9.54813 3.23193 9.25218 3.29928L8.06462 3.56979Z" fill="var(--main-bg-color)"></path></svg>';
    return str;
}

function getOrderBellSVG()
{
    var str = '<svg fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect fill="url(#pattern0_269_1426)" height="18" width="18"></rect><defs><pattern height="1" id="pattern0_269_1426" patternContentUnits="objectBoundingBox" width="1"><use transform="scale(0.00195312)" xlink:href="#image0_269_1426"></use></pattern><image height="512" id="image0_269_1426" width="512" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACAKADAAQAAAABAAACAAAAAAAL+LWFAABAAElEQVR4AeydB5xVxfXHz9y3nd6bSFXKFkBQFEEXdsGgYn+7CLFHNHbU2I1o1Og/mmhMNCZqLFHK2mKMBRdcEUWjqGzBhoIgICC9LLv73p3/b97uwpZX79zXz3w+sO/dO3Nm5jv33Tkzc+YMEQcmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE2ACTIAJMAEmwASYABNgAkyACTABJsAEmAATYAJMgAkwASbABJgAE7BCQFhJxGmYABMInkBOwdk9DDInmkRHE8mh+NENIEHdSFIbSEkLXlJCxqwFi71gsUUSrSYSXxlEH5lkvFu5aO6mhKwxV4oJxAgBVgBipCG4GIlFIPsEZ2ejjmaQEOeiZkcmVu0iUhtJQv6PpHjOTJFzq94u2RaRXDkTJpBEBFgBSKLG5qqGn8CISc4+piGux4j2YuSmRvgc9AnsxczA466Uuge+fPvljfriWAITYAKKACsA/BwwARsI5Ofnp2xzdLscw9bfQVw7G0SyiNYE9glBf3B3kvdWlZTUtr7NV5gAEwiFACsAodDiuEzAC4ERBcWHm2TOgz49ysttvmQ/gc9MtyyuKitZZb9olsgEkocA7G04MAEmYJVAziTn6SbJT7nzt0rQUrojDIdYnjfReYql1JyICTABDwEHc2ACTMAagdxJzvOFEM8hdaY1CZxKg0A6DCyLegwa/tPm71cu15DDSZlA0hJgBSBpm54rrkMgt9A5C6P+JyCDZ9F0QOqlBXtxcs8BOes3ra76TE8Up2YCyUeAbQCSr825xpoE1LQ/Rv4lEMMKtCZLm5K7hSnPKH+35DWb5LEYJpAUBFgBSIpm5kraRSA73zlYrT9DXnu7ZLIcWwjsgRIwBkrA17ZIYyFMIAkI8PRlEjQyV9EeAqNHz0o1HLQA0rjztwepnVLaSod4Xm3HtFMoy2ICiUyAFYBEbl2um60EajvsuJat/W1Faq8wSaO3OrpdZa9QlsYEEpcALwEkbttyzWwk4PHwJ4SaXmbvfjZyDYOo3fARcDh8BPwUBtkskgkkFAGeAUio5uTKhIuAx70vd/7hwmun3HbCYWCmhgMTYAKBCPAMQCBCfD/pCQwtOL1LKqX+ABA8+o+Pp2EP1aQcWrH0he3xUVwuJROIDgGeAYgOd841jgikiLQZKC53/vHTZm1FRt30+Ckul5QJRIcAW8xGhzvnGkcEhJTn2FXc8XldV19XnL3nkN4de6Y4Ujrg1MA0u2THpRxBtS63a+cPG3b89ODcqrbLKn8eYEc9pBSqzR6zQxbLYAKJSoCXABK1ZblethDAvv+e2Pe/AcK0fivpqY7aBb87/ptDe3UaDlk88+a9dcw167eunH7H+4fX1Ll1FSOZkiZ7fP5myRbvWfFVJsAE+EXEzwAT8EPA4TDycVu781/8yC82ovPPgSz+zQGCj2D079MlZ/FfTtiQlmrU+YgT7GXhqjHyg43M8ZhAMhLgl1EytjrXOWgCJtHRQUf2EVGN/LMyM/r5uM2XWxDIysjsP++u479qcTn0r0K/7ULPlFMwgfghwApA/LQVlzQKBATJITrZqjX/hml/HTFJl3ZA787Zx2R3WaNXcb2208ubUzOB2CfACkDstxGXMLoEDtPJXhn8IT3/zkKHaMyePnx36MmapdBqu2aS+AsTSEAC/GJKwEblKtlKoKOOtD49O/TSSZ/Mafv36txTq/6SOmml58RMIMEJsAKQ4A3M1dMm0E5HQqojhQ8OsggwJcXRwWLS+mSCD23S4seJE54A+wFI+CbmCmoS0NuOJkTz9GYNCfcO/NtLQipDd5gZJnUwSIpUIkcbkimd8PkgLtGSXeic0kNPwimYQPIQYAUgedqaaxpVApKMuk0kXOydtnkzmFCEaohcUIxc28hUSkBqD0TR2nnZPAv+xgSYgFcCvATgFQtfZAJ2EkDnX7uWO/8gkBpQkIzadYgpg4jNUZgAE9AhwAqADj1OywSCIOAZ+bv3BRGToygCannEqNvMMJgAEwgzAVYAwgyYxSc5AbXmz9P+IT8EajmAwI4DE2AC4SPACkD42LJkJuAx+GMM1ggYMJbkwASYQPgIsAIQPrYsmQmQYe5lChYJCGZnkRwnYwLBEWAFIDhOHIsJWCNg6p5pYy3bhEjl2SaZEDXhSjCBmCTACkBMNgsXKnEIJPs+f42WlMxOgx4nZQIBCbACEBARR2ACTIAJMAEmkHgEWAFIvDblGjEBJsAEmAATCEiAFYCAiDgCE2ACTIAJMIHEI8AKQOK1KdeICTABJsAEmEBAAqwABETEEZgAE2ACTIAJJB4BVgASr025RkyACTABJsAEAhJgBSAgIo7ABJgAE2ACTCDxCPBxwBbaNHuyc6QhjYtIyilI3h//JE4vXYcDTEtN6XisctHccgtiOUkCEvh2NXzac2ACTECbQE7B2XmGcP8a50QW4o3bFwLVmdFrSIiFpjCfrHqn5AvtTJJMACsAITR4//zzM9o5qh8mU/4KfX7z2RNJg/FgDhbkviR3UtETu82sq9aUPb0/BPEclQkwASbABFoQOOYYZ+buLPFnvFsvkmqo1TwcjoHY4YYUl+UWFP2jOm331avefJNPkWrOyOe35p2Yz2h8w9P5G/veQsc/CzT8cRN4RC9u59j3tkrD5JgAE2ACTMAaAfUO3ZNFb6PXx6CrVeffVKh6J1+SWdv2rcFTp6Y3vcGffRPw15H5TpWEd9qn7PsTHr/jQ6j6cVACHgohPkdlAkyACTCBJgTaGfv+jH5/QpNLAT6K/Mzadg8GiMS3GwiwAhDEo5Bd4ByOqSc18g81XDyicPqoUBNxfCbABJhAshPwvDsFXWSBw69zCouHWUiXdElYAQiiyR0kLkE0K6wMU5q3BJEFR2ECTIAJMIEmBBrenZbeu4aUlzYRxR99ELAC14eoxL0sSRZo1O707HznYI30nJQJMAEmkFQEGt6Zp1utNAyyJ1pNm0zpWAEIqrXFoUFF8x7JIRxitvdbfJUJMAEmwARaEhCGcS2uOVpeD+G72ibIIQAB3gYYAFDDbS1FCRasF4ya6pzz+ZslW4LLjmMlCoEz7/8pUarC9WACESGAd2U3V608XzMzHeVBM+v4Sc4KQHBt9T2i5QYX1WusTHeduBx35ni9G+2Lc+YY2R9U5QkpjiCTOsPaYZthii/KF8//LNpF4/yZABPQI5A3qfgI05AjG3/b0i2WVx0/rILmzDH1JIcndcO7MlNTunpncwhAgBWAAIDUbYzgF2JNSUcBgK8KujJvyjl/KF/43N4gsoxUFJFTWHSBeH8lDBXFIE+mqCy8bJEUknIKir/F1zsrFs1/PlIF4nyYABOwh0BOQdEvhaA7pJSD8XOu30WPv8KQlLt05SpZWPT7ytIF/8QddTcmwuhp07Jq9tHl6jWkE+AvaKFO+mRJqzW1nSyQ0Bk+g7rq/kg6S3fN+bHCTHnXyi0sehUvhidRpvrOv0XhBMnDUO1/Id4Cdq7RAg5/ZQIxSkD9VuEVrwSd6HN4aw32WkxcV7/93ALnK+pd4DVOFC7W7su8AOXuqpm1FMJ8TlNGUiRnBSCIZq4oLalA72+HRnldfn5+LMy6iD1txDy8HE4JovpK9XHCuca/gorLkZgAE4gqgYzadmrG7qzgCiFOhae9uYirO+gOLjs/sZxOp1q3t8Ng+m31zvaTFd9qIMAKQJCPgmEYfwgyqr9oA7YaPSxvbfEnOJR7OQXOC4Pu/A8KPiuvsPjcg1/5ExNgArFGIK+g6Dz05GeGVi5xqloKDC2N/bG/3C5Uub3ORoaSm5DSjnd1KFnGbVxWAIJsuvJ35i1CVH2jOGHeEGSW4YkGgz8cVvBbK8KxlngrDIf4mbECj9MwgXATwG/TJHGrlWywHHA70kV1FgBLjmrrn25YUb645F1dIcmSnl/mIbQ0fiQPhBDdR1QxJqdwer6Pm2G/nP3eymOQyaEWMzpc7RawmJaTMQEmEEYCnp08HrsdS5n0hz3A0ZZS2pAou6BoIiyPx+qKwuDmPsjQtdfSLUbcpGcFIISmGtJFLkD070JI4jWqIPM3Xm9E4KJh0EidbBySlAKRTGF3MlU2weq6K8Hq47c6ur9NKcUIvxmE8aZB0o534prO7k0vhrGYCSeaFYAQmrSkpMQN1RKnU2kGSVOzJxZH58cmqJNO6U1pDNFJH4dp18VhmbnI9QR+SCYQ2Pp2uE59sTbYWSe91bR5U4pzsPrwC6vpG9PB9P+PZWVlrsbv/DcwAVYAAjNqFiM9q/oJXNja7GLoX+Dpkq4JPZl+ChjIaI1oDTK1jXT0axFBCZLejmBunJWNBLAHPqnaDr9t71v+gmYqo+KjRLrl9Siirv3BNuky/xl0VTmihwArACE+CMv/85990DT/FmIyL9HlzJwp0/t6uRHWS6aktToZSGlovmR0co98WkO6n0Su7sjnzDlqEnDBIO4pTRlxlRwzAPDbYT0gfcRnTEZMcvZBic+2XuqGlJIerSor2aMtJ8kEsAJgocENo1YtA1RbSNo0SSq55ZVNL0TiszBolVY+Qg5s2K+rJSZeEq9496UqmBQ9Gi/l5XI2EBD0l8rS+V8mDY/63Tn9deqLQ8v03g0WMpeGUDOhaRaSNk1SY5ryr00v8OfgCLACEBynZrHKF76yGTNWzzW7aOELtr1cMrrQ2cFCUstJ2u71KAA6VrJp325xRHzmwnKFbUhodvFMUZbaIIpFRIKAkAvTtneM7nbbSNSzSR55H1b1w9f0JpdC/Sjb7Da/CzWRTvzBU2e2h4v0i3VkNKR9GqN/PnXLAkhWACxAU0kA7kH8MS0mb0zWvo5oVuOXSPxdtqxEzVxs0MnLnWIm1TJAVUlJrdlZnoRFSjXzw8sBOg9PeNO6sJL8UNr2TicvX/53/LSSJ5huHy5/g0ewvuHdEHwKzZiZtXWXQoTuAMjEkuzDmkVJ2uSsAFhs+hWL5n+DpP+2mPxAMmy9uTrb6dSdAjsgL7gP8tvg4nmPJU3tl413wTF8VSkB5YsWXG2ShB8E8UcsC1SiuFoGlTFc3XgqmmqDCihnD6IjyKsoXTA72Tp/1Viw4NdUymVEp/9Hj56VimJfocquE2D4+GpSLfXowPKSNsXLNb4UJAFDyvtMIXRd+/ZxbBPKCOaZILPVjgZjn1V4YeZbFaT/srGac/TTVS0qWYlSXBeukuAQF53lGXp9Xnjt3k6efqFW1SsWLcCjx8F2ArLhNE+rgqXQGhSEmm1th+0zoUhrLyVKYYdztlBLnzjxeQZAoy1XLC75H7wDfqAhwpMUb/wbI+liVwiptdYnSXe7kS4xTs8EmEBTAugItXYAQJbWO6FpWYL4DCVQaCvReG8urVhUsiyI/DiKDwKsAPgAE+xlWLHacfDEsNz3Vmo7wgi2zFBadKf7NKcbgy0px2MCTCAoAr6O/Q0qMbpj3d1BQeajouUUOk+ErQac/+gFw+RDf/QIemzZdEUkd/qK0vmvgYCaFtYLhi2uMIMqg1v7x47pRj4UKCjWHIkJhJ1A/W9xgE4+bnfktgAKU9jh9vfr8uOzX9epM6dlBcCOZ0AKKf6kL0jk502crn0YRlDlqNPeCpiR8+FXfYLKiyMxASYQVgLZS6sOQQaZOpm4aqu/10kfbNqcydPHYPR/fLDxfcXDMuQfMAjR3YXlS3zSXOclABuael/6LuUTYKOuKCnMa3VlBJO+wWPWpmDi+ooj3cm1FdAXB77OBKJNwKG/K2fj1x+8FpEdLULachz6pj3uNs9Hm3si5M8KgA2tuOrNN2tg1fIXbVGCzszOd0ZkfR0GNFp2AMm8E0C7nVkAE7CRgDTiYwtg3hTnAGyfPUO36nh3Pbym7On9unI4PS8B2PYMyJqUxyBMV4t2GA6Pa0zbyuVLEA5K0d32k1yHAvkCydeZQLQJ6G4BFJFZ/zfd4nqgcmji2uuiur9ryuDkDQR4BsCmR6Fi6Qvbsbb1pA3iLhidf3ZXG+T4FSFMva2ASK+77chv+fgmE2ACwRHQPQXQhl1BAQuafYKzM2ZJzwsYMVAESX//atEruqexBsolae6zAmBjUwuXS7kHrtMUmVVjuC/XlBEwuSn0lgCw7zgiSxUBK8IRmECSE4AHRC1lXPddEAx+h1tchXhtgonrJ47LRS52++sHUKi3WAEIlZif+OVlL/9IUpT4iRLULUzPX5k35RzdH4vfvISppwBg57BSAKDUc2ACTCCKBNRvcKBO/oYZ3iWA0dOmZcF9+GU6ZWxIO//LxS//YIMcFtFAgBUAmx8FKYz7IRJ2KlqhC5n7z9WSECBxdUaarg1A1qjJ03sFyIZvMwEmEEYCIyY5e0O81mAh1QjvKYB1+7LOx1Chmy4GQxhqhpWDjQRYAbARphJVuWhuOf6U6oqV0rje6XTqGsz4LMaqN5/fBTVli88IQdxw8VbAIChxFCYQPgKmQ3spbvPy0pKd4SqheofBUcpsbfk44nlF6bzPteWwgGYEWAFohsOeLx4nFdqi5MCvt5HuQUP+S6FrB6C9/ch/8fguE2AC/gnon8wZ3lMAv9pqnIGBhg32Qra4XPcPMwnvsgIQhkavXFTyDsR+pisap/bdoCvDX3qhu/1HEm8F9AeY7zGBMBMwSO8UQHUyaFiLKKQdzs1W4JjnRWEtZ5IKZwUgXA0vpB3rVUfmTio6LlxFlNLU+vHDWFHL+jhc9WK5TCBZCOjuxoEFodY7wB/n3MnO43H/aH9xgrmHbYp22FUFk1XSxUlJuhpHqMJdXFsWbHP0uBfLAf10ssTRvergjCU6MnymVUsAOuaKko8F9sk2SjcWvPrG+yrrXTt3pbil+0ApamrrHHv37Wv2e9+xY1emMiHv0LF99YGI+NAmK8uVnpZ6ILFDOKh9h/auhjgTmsblz1Em4PkNqla0FsLqA8CeQ3/Wpe7s+KK12nGqQASavRACReb7wRMoKytz5U0qfgjWr1oHBWGK7qQRE8/MXvHuS1XB5x5cTFMa3xpaGoA4NLicOFYwBEaPnpVaSzuCieozzrPzXozpDlrVcfnyv+v6yvBZ/+S7ofcbdOsuA/oAnjvlzKHkpqk+bgd9WZB8kJ+XoHGFHJEVgJCRhZAgJe0f5K65DSm6hJCqZVRhOhzX4eKFLW/ofjdqHKsovXFgZ0lalqVUSZ5o8NSp6W32Zw02RcpwYchsTMIMB5KBtXKH+pvQobbjjn25BcVrsVP2e4xbV8JCvArrkCv3pqaVe3amJHTtw1K5tjpSPe8AHQG+0rpTbkQbo2k1gqDtbpct3lU1CpHYSa3PHSU2F9tql1NQdA8g36IpsE64XQM9joY0BbVMnltQtAnXure8HuT3dRWLFvAsgB9Y6nAnh8MYg5fhGHT0IxB1KP4d4idJMt9ah8p/jd/LCviY+tSU9Enl4vnfJTOQQHXH73c94ihfAFbCZvx+e1hJ6C8N/IP0dpnmasRJ8xcv0D14OLynsnS+GkBxCBMBngEIE9hGsYaj7mHpTlWWsBmN1yz8TZUpKVcg3U0W0gZKsgQRzgoUyet9QbwvtwkY9eJzu83RZNBoknK0lGKscoACO5AmsfijHwJ9ca8vaBUqX1owMiV0cLuwTl0BjstxYTkU4eVYDluJeAy1HqT6DVpSAADQYy9SL8a+/9H5Xw1pWp0/0te4HXV/ta9ULMkbAVYAvFGx8Vr5wlc2YxbgX3iX/UpLrKRfjy50/t5upx1SyhewHdCSAqDSatUpvhOL3EJnjiQj3zDNfIxWxuPF1x0dVUPXhA/qMwddAu1h6X4shBwLpQqTyg6lFGxC57UUh+CUiRSjrHzhfGUfk5wKgcBvUIqTrEDGkd5zraTzl2bIsae0w/1Z/uIEdU/Ss1++/fLGoOJyJMsEEk0BEDmF04/Hu6DQc1qdwFiMxFq8iJdUp+56a9Wbb9ZYJqWR0DDlA9IQF0KEzppY+xoplBJhx/bCA7WpXFzyKl6on+DCkQcuBvVBlnd1b3kpqKgJEim38MyBaMJCPFOF6IsmosvpCiMlvH+5p49wE/cA8TMxI3CmdEvCVtkt2C3zMWZclkJJKK04PvtzmjPHjHCZopJd2vZOJbCrUDODuaEUAPy+KB8//BV9n6XNc01Nz7gEVzo2vxryNzhCFX8KOZVNCZSNTmZtu6n4aR+HvqMv/sJeWsB1uiitLJ33HrJJGGUzYd5c2ROLjjUMUlNGI3w8BxvRajdULlrwLx/3w3o5t8D5Kh6gUzUzWW92lgOrSkpqNeU0S67WqQ2H+BgXOze74fvLLtOQx1e9U/KF7yjxfydvyundpSvlRHQ0J+HZycePJezHNMc/tRiogXJxbVAZlg7+60iTb3z+ZomWy+sYqJHfIowonD7KlKbqmNToO5iwEwOkseXvlnwdTORg43h2sXTcsQrxde2CXoVtQni9oPqoVF5h8bmY2VR+B3p6i4J3wBfQBi6vXDzvQ2/34+1aQigAOYVFF+LH/jjgB5zRQIX/XD5h+OxIjxAaFJSlug8IpuvPKy+d/6yunJbp86YU52DbzutB+C3YaJrkrHp3wQctZSTCd7Xl0hSOk6H5Y6RP+fgX8JlKhHoncB1MtOXn+N2/jtmC/1S8W6I8dCbMCK6x3fIKpk/AQHUBvnvtuBrj4e8GHKpzcjj86ucVFJ0HsE83ycvSRwz/j414BztnjpG7ZKXatn1lEIV2YdpvVsXi+f8MIm5MR4l7BSCvwPkLmAu9DsqOYEl7lIBFC5ShSkQDZgHQaYpxWplKqqxYvCAPMmx/iWEmoK3DIW6B4Isgv+XOgL3g9iQ56u5Rdg1adYihxJ7pvv3tCjCNfzKmkdVaqu7oJYZqx0XxQmAtnu/XhRSvV6fvWhytZUEv5dK+lFNwdg8h3beiE1O/36wWArfhPflkujDvsduOqDEfLCWqGUFfM7CN0fz+Rdv8D7O0Y/1GCsNNKC8PI++rQhDtxpLTidilsjCENDEXNa4VgP7552e0c+xTFsEDQiYr6Hb4l7475HQaCXImOU/HCP5lDRGepFh3nlq+qOQtXTm+0num8tpvz8O61zC8KGvIYW7eXdfm4zVlT+/3lSaerqsTyr7ZTsfgB+zEQvEM/Ah4aj+eGtC+su7E7/E1rPCWwNvcW4nicMbzXkzdO1a4RW8oA2lkGl/ty9j5RTiVndxJxVNJyDdsaJrTMf2P5dLIhdzCotswnPpd6DmK73e7M7Pj+b0Y1woArOt/iQo8F3rD1aeAxnc1tM0/W01vIZ2AlqwslodZSNs0yWL8SAqaXuDPAQhgim/E0qpxqtNHuxchdqCp0gAC+XaCEdgGZeC/WAJ7tmL88MWRXiKMd5YYQS/G72qiZj2+qZgwfFgk2cMpFYwW5d+slhtLzzPKFy+wfTeF1fKEmi6uFQB0piWosKUtbA2g4AmTistLF0TMmh1bx2Zh/UjZK+gFU47BeuZyPSGJnxrumI/ANrKZ+JGrTp8d8CR+k9tRw3V4L8x3C/l8ohu62gErd6ITvi/Ep9qyhLykorTk79pyghSQV1h0JnbzzEd0R5BJWkeTtABLssWtb8THlXg3cBqiidmBB+D5vEnO7eWLSxZrygoqeXXqnmewxeRORNYbgTqM8yGDFQAv1AdPndk+s652OhStSzCiO8JLFL7EBPwR6Iv3wvWGFNdjkLES08PPmqnyH1Vvl2zzlyhZ72Gp8EIbRpKb2+61PpsbKnu88yepdz/SWe/8VaZCKs+ecRt09qVHv9KCMm0oRDoMwF71aLE2CAskQq3DwYHJXwLFC3hfegzWAkZLpgiqDTGl93hmbd36hlkW7vyT6QEIT12HYx39PsMl1mOteAH+qd0hHJoQQOd/cpOvlj7infjnZctKqi0lDjFR9sTiEXjnq1nf9BCTeokudDy8epEX2Us2KG6RLXDT3KCdL8P3o5te0/i82WG4x3/xzktw+BDekH2CszNeKGuRSxuNnEz4BMi02yeARnmiknRk/mkd3SmpRejwL0MBtCyQo1IBzjT+CEjxFZaUnk4zHU8uL5v7c/xVwL4SNxhi74NEnb5kr5kiD43EDMvIyWce5jYdS1He7nZQgA3AB7ABGG+HrGjIiOslADxxH8DwxC4FoDsejEU5U6YfW7lw3rpwNoZ60GE08yTKHsq2k5ZFMmr27NH50bWUF1ffcwqLsUOBrnGTPAdTtHbMBMVF/VMccE3WvQ1165hGXdqnUyf8U387tk+jDllp1L5NGrXNSqW2mWmUmlL/eGSkp3rqZsD3a3pq/U/egc8pKfWzny6Xm9w4eUeFmto6GMV7PtL+mjrPhzqXpD3VtbRnXx3t2ltLO/fh0OJdtbR1Vw1txz/1d9P2Glq/ZR+54Jkv4UP9tO99tQ73b7GO/Cy55UN2O9WJF4bt09wO6dbq/PHzFU9Uvb0g7MsrDYcUqW17tnT+qo1gX4St3fEb4roDyZ7sHGmY4jPgt68e2GdPtSnHVSx9YXs4m3Vk/vT+boepZhusKWE4KhPbGIP13BfOqkRU9ohC53h4drkKb40zkLHe+l1ESx5cZumpDhrQqw0d0i2LenXNoL4921KfLlnUs0sb6twhEx18BqmOPBaDCc2hGkrD7r37afP2avpp615at3kv/lbTBvyrXLWTdlXXKxWxWH6NMimtZxEU0j9jNKh8kiSBFnSQFmZid+Fbu4NXQvrkcriNw74om7cmpFQhRs4dP6MTpbmWoKfICTGpv+gwI3CMrFw0t9xfpFi+F5tvkhCIwQ/4fDSqsvC2LahpndQ21VOW/+c/amorbAHriTjIg862lIGg16AAnGopbZwlynY604ytxqk4O/56PLBHxVnxvRY31WHQoD5tKWdgB8ob3Jn69WxHvbu2pS4ds+B5OO5/ll7rrC7uxUzCpq17aO2m3bRy9Q6qWrODVqzagesun2ni7MYKGIY9utvV5tl43h8eCnNsx34NT+y0UNIciIsDifAem3Hgexg+jJ42Latub+bChkOlbMsBWt48bCO39v62rRR6guL+TeNZA3akqS0og/RQtEr937QdHU8Pp3MQZYxiGFLNYIRsjAlf3qdi2vG1VqVOoAvKmj+rtu4K/NCuQLV6xWvVunRMp/G53Wjk4E40sE8H6tOtLabus2J2JB9pzmrmYPuufVhC2EPfrd9FX3y7lZaWb6FtWGaI47ABisAjtdU1f/36g9d2x3E9AhYdMwCnIdIrASO2jmCapjii6t35K1rfsudKw/kEqmzKy6ed4TuHu3bMF2Wv7rBTaKRlxb0CoIDlTCoeBDeuyrBDb2tda/rPwzHFueF0TIE1xMcwj3Rp66z9XJH0HvaeTkSMhJxqVC6JMc19OWZ2bkAdO/shEXO31Bp97sCONGZoFxo+oCMN7deJenRpl9Cj+nA1wo7d1bTqxx301ZrttKxqC31ctfWArUK48gyDXDgYokcMV+1D8d5Z+GEDB2fO97ASO8FPnFa34JTrMbjSVca74Qo4srvoSbwlL7A1Axw2hV0LExLB7iMhFADVuHCwkwuLjCX42NHWxhbiLxWl86+0VWYTYccc48zcnSUWoiGCtSRda0g5bsXikvVNxCTERzWb4zLSrhYGXY0fbad4qFRaqkETR/WgCSN70LD+nemQHu0prcG4Lh7KH09lrK1z0bpNu+jL1dvovS9+oiUrtlBtHZw5x0dQRm4PVaelPrzqzefVmnlChbz8Mw6RjhR1Ql7f4Com32+7j04I59Y/GFo/gBHSdcGVJ+hYu+AefWL54vlq5jbuQ8IoAKolcgqn5wtpvomP9u7NFPJmeKi6L1yt7TmEJ8V4FMdQnhMgj4/Q+Z+VaJ3/kGNPaZeWnnEZFkJujIeOf+ih7anwyJ505LDuNLR/F0prsKwP0HZ822YCavfC2p920vJvtlDZZz/RhxVxsSNvN2a2HqX9KfeH29DYZtwBxXmUgBTHixiIBTrM51+mW/66qqxkT0ChFiPALuFmdG73WkzuK1ktHIudXLmo5B1fEeLtekIpAAp+3kTnKfBMpZw8WLOu996CsD8Ts6D1PeH9tj1XcyZNH2cIeRUeskJI7NIgtQZ/34cm+0zlhOEvhHM5wp5aBC/FM9XvoGsxdTgbqeyduQm+GAFjdu+YQVOP7k1HYx0/Z0BXagtLfA6xR2AXdh+s/G4rfVi5id76eANt2aF+OjEb1NrxH4Uj/Y/lC5/bG7OlDLVgOHMjZ0nVTHQs52HdSy0JpHlEYNcSlPtFgow/ly+a936oYkOJj0PXzoEh7TNIY2f/5sYhbNNxCNuLoZQl1uPaCShm6ppXWHwuRtNPo0B21i+iD4CaDhepGVmfvzNvI+qRWGv9eEnkLf3yl2gjNasSk8Z9vbpk0ikT+mJ6vzcNPrQzqX3zMRMkLObxTxCmvz2f3fiLf/gu1PfG63hsPKX23FMPEb7Lxilz9Ug1PFZq1wFMpFWQWH8RjT8b4WiIgXtC6dMG7tf/Jdzz/MNOTOn5jOueex4xUf8Pzxat27id3vt8I5W8u47WbYnZPlYZC97ZxbXlqbKyMtV4iRPUAVxLqnrVCNf+rxa9sjUSFYvnAWAk+LTMo/5X3/JqAnzH+o861/4em6uScFNANvMJKM7jSlXKB9Fb5AWMHOEIg3q3o5OP7UPjcnuh0++E802i8fNQnTSs303sl/d08upvw2cT1z0dfKzqgxgjGXA6JNQ/pRCkQjnAZ0zGSYGBoLrXqFxEsG2hC9C6n3bQR5U/0ctL1tLXa2PQKN/jXZB+W7F4vjrgjIMFArmTnceTKd5CUlun6PD43ILtfr+3UKSYTxKNN1zEoLARSMRQB8xI+ekXhvgDfkwTA0aOYIQBvdrS2VP607Ho9Ht1bY9Zy0hlDhJmjaezFxJT1fhc/x2dfePIPFJFiVg+gGukeZQBKdLxuf6fRzmIkGKglIGNW3bR++UbaO47a+iHn2JuZqDUEMYNK0rnfR6xZkmAjDxG4CTew0/HbuPhv+LodbUNOSFDxF53UaLH20CiBL4xW7hW7ivcptKeZ+BfTDxvWRkpVDTpUDrpmENpUN/OEdiih6l5s9rzj8z9DSN8jOYTtqNvbP1g/zYqBumYQcDgDf+kobw7h+weI9gMPfHUMsGqddvovx+spZKytbRvf8zMwCtvzP/CUaW3JJrBb0gNFGTksG0Dl+KFiuOGnZNIdlctkcbEC7lloez87nEE0WnHq3jXnminXPRl37tS6sZ/+fbLG+2VmxjS8vPzU7Y5ul2OCe3foUbtYqFW43K7knNifxqb3ZsyM9R0dJiCZ2S/HyN6dPbmPvzDZw6hE1BLCI4szBgopSCzXjkIkw6pthh+unIjvfLeWipd/lPoZQ1Pir2YkXrA3Unem+yHfvnCmzfl9O7SnaqMCg/3Fcfi9VIctnZSonP3qgBkFzoPdWCvI8yFDscDCEVUfptimEsicVKexcbym8zCXnu/8prcrKCalOMTbTtPk/pZ+gj3zMdhmPsolKRsSwJsTNS7ayadO3UgFYzpS1076hy+6KdQanTv3ouOXv1TnX2joZ2fNHwrdAIwUFQzBFKgHR1tGxSC0MUESrF1x15a9Ok6evqN72kjzjCIfpDl8Jh3WdW7Cz6IfllipwTKU2hmbW0Z3jOjbC2VkB8LI6MgXndnjCgoPtxN5gTshDgMk1xuzKN94xby3arSkrUtOTVTALAta7DDQX/CqE2NllvOv2FWihZJadxRuXjehy0Fxfr3+iN4aYntnZKUi+D07YSSkhJlhp3UoZ6xgel+eTFANHu2Ig3m6OwudM4Jg+ionD6UAr/7tgYY6R3o8NHxc4dvK93ghXkUAiwVGG2gDKh/ttp+ebwOVn23mf75+jdU9sXm4MsVnpg4wl78i4za68sXvhL1woSnisFLdTqdjq+20ttYvysIPlUwMWWVmULHReJo4mBKE0octY1cCPNOpFFMWr5/1bLSf6E9z4b3xe8a5R6IlFNQfDJseBfgRqCjVbFhSCww3OKmcJ/g1FhIu/6OmOTsg21OOEJY9rNLppIDsAlrJRoUp4ZtfSas+/FAdQ0qTRgipWCr3pn5famo8DD43LfTrQDW8N176v9hlF9viR+GCrBILQKeLYpKEfDMDrTFK9A+xW/D5p30Utl39Nxba6gumkceYz893NDeOaQz/SWZBx15k5y3QiO6W+uBaZEY/doP2CZ7bLzZXaiTZU2HvA/9WhGqdKBPb1G9xq/7MEHprHh3wRvqgidyg+ZQhu+hLIzuhzbxUHV6yu/jybWlmuUwHGIp6toD/+wKO9OE7Le8tGSnXQLjRU52gXM4fjj/xIN0VLTK3B2H7Vw0bTCdeEx/G5304JBzT6cPx208yo9W01rPt2F2QBpQBBzt8arCtkQbwu69tbTwfz/QP/79DW3aHlXbjmXkcF9YsfClr2yoVlyJqJ/6r/sBhbZNy8cg7mfhcE+IJ54eDjWum7Hceg1YhDL9VYvZpOPLS+d/JBqM5FZiGDvY4lOwCQX47dBO9GS8aKQNp/CV2fkA4QjhGTgLfK5FhnGXrH4KTlwPFfJOFD49GhU4vG9butI5nI62a5ofU/tGQ6dPMN7jkEAEDBgTOtrV//P4JtCrm3JD/FHFenq45CtatT5qfgX2Y4339mFd5J/i5d2rR70+Ndz8/hIDjufskNUgY7c0jEmV78z71EaZYRPlefdup4ug1d6FTKwNZAWtStvecbhocJv4rHZp4chCGub1laUl/9WWFQEBeZOnF0jTVGW1p/OS9AhO6LsqAkWPehbRHvUPgS/+y84YSseO6AMPfbrTvC4yXHiBu3ewtX7Un6zIFMBjK+DoQGZKB2To0MpUHWW8/KuN9PCCKqpaHbUzfj7CbMAF8TR61YEOBeCvUAAu05HRJG2NMIyTyt+Zt6jJtZj92NBvwZEajdAupJAz1TGOr2Il4FRtYQcFlAqHmF2+cH7lwUux+anhHOsXUTq9t4Cqntozunj+zNisqU2lwlp/7tKqX6Guf4LELJukBi1mWP8OdMUZQ+jovEM0vfTBzFVZ7atO3x210VvQ9eaI4SMgHcpmoAMMCLFTVcNmQPkUqFi1mf44t4pWfLc9fAX2LRlLsjRnaBf5QKLPBuQVFM/DenexbxRB3zFh0HZ2ZekCZfsW00FZ9ptC3o02dtpVUCx7vCQAc43dRnEoYB2sMx+vk7VzIuUD2iqU3ILiS9B7/81q+sZ0WAd/snzR/F81fk+0v/XONsx/4i05IdJ1Gz2kE116+jAaPbSnltMezxY9905M88NUo8E/fqTrwvnFKgFsMUzBEoEBZQBKgdWgFIGv1/xMj5SspA+rfrYqRiddws8GwJ34U+gIL9CBpNKiqX5duXiB9rtftxz+0g8tOL1Lqkibg8KinwrJRs+f2IZ74ntH94HZt+NbIMv/IIQ1i6JG1Ec5yDGrx4Bsaj/00E+3rVrlbhYjRr5sXl21vMfA4VCGxES9IsnnN69euUxPRmymzit0/hol+zcYDYpkCdWI/8ErjqRfnZpLfbq1s9b54/Ab4d5OjjqcueLaiml+ta8bzc2BCTQjgFkh5cAJyqFw74JpizrXQK0OYrI5hADjKuraqQ2dOK4fHT28M325Zidt3RXRUwkPQcEv7DEoe8vm76sS4sz6lvjRpwzBtcktr4f2XWI7e4maSo/JoGzzumYP/JVBjlfwBOajkPqz1K1rWqtc5X6L96FVA8DWIr1cwU/rW/ycboBPZSw3xGYAhz+Bg7KmtBRwvvVhON96laXEMZpodKGzQ500Hrdpui3oWqrjd687exgVHNmfHFb38OPgHNXxG64dyJcd8wQNnyMeJKB2EijDwZQuWPVSykDoQdkIfFTxI93zbAVt+Fkpn5EL2C74sqxN/VWiOSprcP1r+V0rpXgMe+HtsiGwvUHV0jT6zP9Dn3mY7cKbCoTdnoDXtvlQctX+wQgEWWYIx7UxetAF7CGKMMWNc6xDDy9CubFtbSb07O1PAZ8JR5nCmIvR8kD7pXuX2CYzha4uGkqnjB9E6WlWtm2ptX21bU+t7e/1nglfZQIWCHg8EKZ0hkLQHqlDmxVQ2dVh18Bby1bT/c9X0d7qiJ45sNY0aUaieRHEu/oVYD1NsQ0lYO5vXuWE4TNj0b//iMLpo0zp/iOer/xQ6mQ1rmLh6D5guBvTVnYYVARRDtEfo8lZmJ7K7jZw+Mdbvl8ZU/vmu40Z/obYT2NDnOreDOOMs2KtLkE0hq8osAtxXg0nG/MQISJOfRxw4HPeLwbRA1ceQ0cM6RG65z6s56vpfQPT/Gp9X6jjczkwARsJCHU0c4NyqRaPyaFmBILfgaJ2qwzp19lzFkUmTkb+7NsdEAM54Q8dsCpxbs9B2Y5N5zqXUFlZRDINd7W6DBjykUHGTOhiwRtsCLlQdqaiLY8+GlENLBCLYSec0atX/7wH0Tc+hr4nYgMuQ9ItwrOncJv4Hwp5RKCC2nwfp6TQI6ZL3o2p8z02y7YsbvS0aVm11ZlzsRxwShBCNmOF+eSqRfM/CSJuzEcZNXl6b5dpPoeCTopUYU84qhddN2MEdcO6achBvZRd29Dpw+oaa/0cmEDkCBjYRtiRyLM8EPps1U9bd9ODz5dH+uChUixVnoP3bcycdqTTXp5ZShKvox/pFliO/Hda1v4Zy//zn5hx8KHOqNmTKa5C+W9B+dXUUgSD/HRoZzraM5eVU3B2niD3EuTeIYIlaMxqHbSemysWzX8BF2JCO1VK0ZfbjcuwhnYHytSlsaBN/rqwKLjANM3rEuXHlF1QNBEaoVoOCuLH1ISExY+9umTSnReNoDHD+8C4LzQhnhG+6vhdartVTDwyoVWAYycQAazUpsDTYEpXvBIwtA8hqAmAT77cQHOe+CKShw5twk+mCD5L1Ps+7oMaPae6UnF+jTwLlWllKAfEP+P1MmdoZ/m3GNoeieXmYhyPLn+PMveNQiPswFb9CWqr/oFXb4M7YLUnvlcUCqRe4//DIO7aWFqrGjx1anpGbfvJ+InDza3ogbnlfZi2q4Rl2sLKhfOguCRGyC10zsLb6y+oTSiuoC1V3sB0/0UnDaILTh4e8pG8QsJKW1nyu5TDFe74LTUAJwobAXUGgZkC/TnEQ4lqal1Usugbj1dBV2TOGcAAhm6DEnB/2GBEWLDyh+9OMSfDI2sOLIHgFldukjjVT3aid2LpSN/siUXHwrb0j+h40adEJWzAkv+Zyg2wyv2AAqC+jJrq7FZXKx7AxV/iq6GuRThAkaMSkSJvKl9YsjrCeSdddv3zz89o56jGupM8PxKVVyf03Xr+KDqke4gTTbDoN1ybPWuwkSgn58EEdAh4nAul9gh558BPW/fQ75/5jJas2KKTffBp4bwsrc2+i2NpWjz4wsdXzLwpzgHSJe5Dj+tEyZv1uxGqiToN8F/pbsd1y8vmHnBQ4bUguROdozEv+yCKeXyECtcym1oU7G+pOGMgGQ/YaQkjHN89GrPD/TKexVHhkN9UZuf2aXTHBSNowqi+oe3lhzGfUbcFHX9M2Yo2rRp/ZgI+CKilATgV8iwNBD+xpgwD3/t8Hd311AravrvWh2w7L8tPpcNxRiLNaNpJR1dW3pRz2pBZ8xs0642QhZmJKAQ1E2I6rq1cPO/Dlrl7VQAaI+VNKpoGV4l/wvdBjdci/Hcrfka/6+ze8teysrKYstyMMAdbs8PWz+Og3JVAaHdbBXsRdsr4PvSbGSNDPKUPVv11sOpn4z4vRPlSfBFoVAS6Y0ag1RK1z6rs3V9LD839gl4sC/9KI0aGPxuGMT1e/OH7hBZLNxqOSIdCp5ZZekapaGsx3X87pvufQ/5o5tbBrwKgoiuPRHUdt1+GdZU5+Aqz1yiEODtoKAqEgs4SDo9m41H4AxIE/zYKWvrBiJ3apdG9s0bR2NxDQjDyk5jq34bOX81QsVX/QZr8Ke4JYOHXdHTCjABsioNWBCQtq9xItzz2Ge3YE3ZvgrALkLMrFpcoWyAOGgTqD+zx7OfP0xCjk3QPDKsf3OXKum9N2dP7/QkKqAA0Js4+wdnZ4RJ3QI1QHpRC3/fSKEjvbykM8a6tKC2p0BOTfKkbtns+jJpfHu7aT8HWvlvOHUUd2gXvYVq4sH9frfNjax8HJpCoBKRIgRKA2QDPSYTB1XLXnv10378+pzeXbQgugUYsdAh/Lp8wfHYsOsrRqFZEkuZNdA6RDvE7DLDUOn80gokR//OmNH5TuWjupmAKELQC0CgsBiqJHkI8JRy1t5cvfGVzY7n4r28Cah3KdNfMRWNP8x1L/07brBS6/bxcmjx2QPBr/XI/OWqxLdnjo1+/DCyBCcQFASOT3DAUJPwNJqgtg8vK19Etj39OO/eG3dHVq2lZ1TPZODCYliFSg2PDLW5Axz8bKULbCxpcFsHEKpXkuA4df3kwkRvjhKwANCbEVHIhpoxwmIKI1jQHXGnRfdXpux9a9eabYZ8fa6x3vP3Nznf2NFLgLEPS6HCWfcqRPenm846gjkGP+t0w8MOI3+OrP5wlY9lMIHYJSDgTMjEjEOyywI7d++h3Ty2nxZ+FeewDwzFhuE7hQZbvZ0ctj9d22n4Bzha4Bx1pV98xw3rnayzPX1+5aP7rVnKxrAB4Mjto6PB/+A51NiohoKFDVEoVA5lmFziHO8h4A3sr+4WrOGpf/03nZNNZEw8PctSv/PXvQuePGSo+kjdczcJy44oA7ANSu2FZoHNQpVY7BV5f+h3d+VQ5udXmrvCF1eRwn1ix8KWvwpdFfEr2GMhjPz8GVmE9SM8PnW0wL71L10BeTwFoKB1GmW0dKeL6qG51IIJjA9gHLCpZ5gda0tzyePYjwja/8Blu9umWRQ9fPZYG9Q3uxaWm+R11GzHdzxM2SfMgckWDJiDhv8ZMg8F4kMsCq9dvo6v/9DGt27Iv6DxCjihoOwxzTq94p+S9kNMmYIK8ScVHYED1xyhuka9Dp/2Y4a6944uyV9VRp1rBFgWgsQQ5U6b3NUx5DzTUX+KarbIb8wjwF8NLetFlun7z5eKXfwgQN2Fv5xQWFcEjltr6Ebb1qJOP6U23nD8a3vyCyQLNgv38Brz4cWACTMA/gfplAUyoYudAoKC2C94L50FvfLg+UFSd+zU4HGxGZel8NaBIylB/TopyDS8vAoCw7qDyBRgj/tdh4HcNjjL+zlecUK+HpZPOmzh9rDQ82yDGhVogm+J7Dhqqrd5/z9cfvLbbJplxISanoOiXaNR/orBh2amR4hD02wvy6GQc2QuL04BMhLkP0/1q1B8JpyYBi8MRmEB8EBCpmA3oTdLIClheZSD4zsff061//4LC6ErYDUcGF1csnq/eLUkTPIfD7c28EgPLW1HpdlGpuKDl2BV9bTjObwj8BrdeY5E7qfgsTB8p+4D+1sVopVyP/O+qGJ/9RDJsa8krKIa/BvkIiAUeOljA2q9nG/rzNUfTob2CcQeBcxI9o/5tFnLiJEyACSgCarugqXYLBDHo/GHDdrr6oY/oh01hWxKAXzg5u3xRidpOnOghKfqvcCoAngfEo0Hty7ge81k34EKbKD01HzkM97lfvPPSt1HKP+zZwrvfjdBS7wtXRpOO6E53zRpLbdRh5gGCcO9B57+R9/QH4MS3mUAwBDy+A1J7knQEHoBW76+jO5/8hN7+H2bdwhbkHbC1uits4qMseERB8eEmyWdQjKOjVJS9UP3+D8cXPxDurZhhVwAaAeLs5j6mMO5Gxc7FtbCMUBvz8vF3j2nSL2LptEEf5Qz5Mo6WvBNcfxtywiATXHbGYXThtFxywOLff1Br/Zs93vz8x+O7TIAJhErAMxuQAiPBALYBbrdJT75WSY+9GsbxjqD7K0oX3BRqHWI9fl7B9AmSzDdRzmgMVuH+VDxrSPO2FYtLwmrU0dgOgd7ojfFs+xtlK8qdppB5VaUla22rUHQFiZyC4j9hWu7qcBQj1WHQ3bNG0JSjBwYUL8z9WOvHM8tr/QFZcQQmYJWAFGlkpvdBPxH4XJkPV6yj2Y98SrV14XGrjf3vj1UeN+yKRFlerT8gzVyBtmlvtX0sp8MZUILEteWL539mWYaFhBG3Zty0umrj5tVVT3cflFMBGzLlnCbIPWQWatc6SYYhqd+m1SsXtL4Vd1dEbkHRE9Dgfh2OkvfolElP3zaBxgzvHVC8gP9+oxadP+/rD8iKIzABHQKC4EALzrOUAa70bBf0PYbr27MDTTqiJ5V9sZH2VtvvYhtFOLLH2p974X3+X506xUraboOGPQ3NakREyyNoFXZYXFy5aMGNqm+MaN7IzPfTE4GSRMmTkumSroFxvk0QI/+iv6DxLgtHM+UO7EgPzz6GOrX3b4Es0OGLug1w7LMnHMVgmUyACfghIA2cNIudAoTzBfyFnburafafl9Hn32z3F836PUmPwEL9KusCop+yYfSvttdFanna48l2t5n1cKADe8JJJ+IzAE0rs3HjcnPz9yuX9+2X90+3IdWayxERaAAB73VfqnybliWePsMNM6b96cpwlPms/L50/xXjqG1mul/xqtM3ateSYKc+fjnxTSYQLgJC1uHI7J1QAPBbNXwb52akp9LUY/rS1h176asfdtlfHEFjew7Kbrvp+6p37BceGYldBw6fjhmNaRHITU3FPJbmdpz5xbvz39mx5gv7p2ZCqERUFYDGcm5cU7kP00hvYFngRTTCAFw/rPFeWP5KsQr5vR0W2WEWipG/8jv9m3BkM+uUwXTN9CMoBWv//oLH0K8OB/jADyYHJsAEokmg3rU2jG+wU7Ctz4I48Js+blQfSjHc9MmXW33G07gxrufA7HaYxl6oISNqSVH2c5D52LAWQNAbmO4/HdP9z6o+L6x5BSk8JhSAxrJu/r7qZ/x7oefg3KUkzZFQbdUGWNsDlIxP8KC+ZbvgMAvMKyyagyxuD0c2t5yXQ+eemE3Kt7/PgCl/o+7H+lGHz0h8gwkwgUgTEHCzLST6FKMdXpveFXhlNzBqSA/q0zWN3v0sqNNiQ63GuB6Dst14hy8JNWG043cfmH0yynBUWMohxVfSkOdXlpbMUX1cWPKwKDSmFIDGOmz6vnL18WOy//FztbEB11Sj2LolA+PWf2MGYGljfvHwN7fAeS1+2ffaXVbl2e/hq4+iqeMGwrDIj3R1bG+NmvLf7ydS7N9a+UM1PfX2VnrgxU30p5c309/f/Jne/N9OWrullnp0FhcfuAAAP1tJREFUSqXO7fyvp8Z+DbmEyUpALQmog7ZIeQ/0YRegfuND+nWmnP5taSF8BSgvgjaHST0GDa/BEmtcvV97Dhg+Ci/ASTaz2IyGuG5oF/NXZa+XfG2zbFvE+Xvl25KBrpDBU2e2z6yruwWzzddAlv+F6WAzM2R+PB1ukTvJeQUeTuXhz9aQleGgx28YRzmDuvuVK7DOaNQqA1X73xZ+M7bpZp1b0sLlu2juu9uofHW1T6lq9qPouE70G2cPSoVixIEJxCUB9PIm/AWoMwX8hcrvNtMl9y+jfTX2L0NjS9vl5YvmP+ov/1i613B42mKbylQD8/qHqlNT71315vNhMLqwqZQQEzdvObsOGsKK2beVE4YNjZe9q7mFxadCTX8JbWXrbE2Xjun0xE3jqb9ft74SU/4/kcC2o3gMO/a4aW7ZNlqwZDtt3RX8S27s0Db06JWHshIQj43OZT5AwHOoEDwI+nvNK/fBF93/AQwEbT+h08RGxWK4DX7xQIFi+4Ny/bsS6yhDdYqJOr8uhXl1RelL3+vIiVTauFEAGoFkTyw6Fktcf0TBra3XCHFaRen8fzfKi+W/uZOdx5MplK1CYK8fIVREHeP7z1uPo26d/K2suDDl/yNsi3yPmEPIMqJRt+x00TPvbKUSdPzVtdacoJw9sTPdXKxenhyYQPwSUIcJmemHoAK+xw+bt+6hC+5dQht+tv23vt8QcvKK0pK4WA6AX5XTAOoVK62NudH/SRzYE2+eZuNOAWhoHLUPfiYKr9bE+wbdYFLch9Osbg46fhQjjph4ZrbpcLyPWfdOdhYjqM5f1pKh1vuxphhP4aftdfQE1vRf/XAn1bqsdfyN9VXLAS/dPpAG9bJn1alRLv9lAhEngJMF3WmH+t0quHXnPrronvfCcZDQTkmO4yoXzS2PeL0tZIhZgN/jxXdTCEnXofO/BZb9zyNN3K2R+lYLQyAQjagw4ivvmzPwcXddqpq7OhL/fG+EJdqPlrmpcvGC30WjrKHm6Tk3wTAWI52tQ9C+3THyv83/yF9ZEzvU/n4Z/JR5qPWzO/6OvS7663+20K3/XO9Z43eb+r9DZRyVAiVgfI7vrVV214PlMYHwEDDrd+44lHFgqtcssjJS6YSxfajssw20c6+tin8GpsVP6X5Ybsnm7ypjej1cgUG/sgg7GVQ5j8M/77BURCLl/ezutKzqmSveemW550oc/hevMwDNUGfnO3saDuPXeGefjYftsCY3YeZKL2Ld/+HKxfOVl6eYD6MLnR1qJWEbjcizs7ADe7elJ26e4Ne7n7IgNnCKH7Zg2pl12GTtx/T+c6Vb6Z/vbKM91W7b81Gj/1fuGGS7XBbIBKJDAMaBab1wqmAHn9lv21lNF96LmYCfcCCdrUFWUU3qhIqlL4TJHaGthaW8Kc4B0iWuhJXcmZCM6RNPUCOLbzA4mCtN+XhVWYlyhhLXISEUgKYtkDt+RifKqOmU5krbtbxsbkztuWxaTm+f++efn9HOse9t3FPap23hsEPa0z9g8NehXaZPmYbrZ7j13eLzfqzdeK98N/1+/k+0Yauto5Vm1WyDXRLLHhrS7Bp/YQLxTkCmdsMuga4+q7F9VzXNum8JrVpvr4tvdDbvujvLX1SVlNT6zDwGbzT2KcLI2lS+8Dm7NaOo1jjhFICo0tTMPK+g+AlJ8iJNMc2SH9a3Pf0dnX/Htr46f2XpvxGW/nApGgfh+59q6L55P9FHX4X/d8gKQBw8EFxESwTULICaDfC1Q2Dnnmq6+L736dt1uy3J95PomYpFC873c59vRZBA3NoARJBRRLKqd/RDoRifBCzXYX3bYdr/OOrgr/OHpb9w2/4jD1i2UCMoo75HX/+ZbnlqvcdpT6jprcTv3yOdio+31QbTSjE4DROwnYCQ2KoO517SoU6+bT0OzEhLpSlH9aElOElw+25bB+wj4XVvO9baP7a9UiwwZAKsAISMzP4EOQXOyXCc8TQke/fhaSHLXl0y6clbjqNOPqf9MfKvXQfPfuEfSVsofrMkK77fR1f8ZR2Vfr6LbLDvaybb35eTx3agccPZCNAfI74XvwQEdvso98G+lYAUGAb2ptJPNtDuffYttUHdmNJjQM4nUAJWxS+9xCh5a9UvMeoVN7UYUVB8uElSacP+3XaFUKNO7dLohTsnUs8uvjov+PSvUZ2/7ft+Qyhl4KjKyO+hVzbTPDjziWTHr0qmtgG+eNtAGtybtwEGbimOEdcEjExyp6vd1N7Hg5u37aEZd5bZ7Sxom+mWY2FIx0pAFB8e20acUaxD3GY95NhT2plkvowK2Nb5t8lMoaduneCz8xfqQJ/9yqd/bHf+X/24n6bfu5pegPveSHf+6oGajql/7vzj9qfFBQ+FAN4Fxv4fsPvH+9bf7p3b0j9uHEdZGSmhSA0Ut7NhGP9Ru54CReT74SPACkD42PqXPGeOkZ6R/gLW37L9Rwz+rjrY5283HOPbva86LKRmtWftL3ipkY2pOvunF26lX963hpTBXzTC0XAFfP1ZPaKRNefJBKJCQNkEGDU/4N3gfap/QO/OcB0+Du6xbewy4Ha3Vop5TqfT+9RDVEgkV6YMPkrtnefofg/8E1xkV/ZqyvpvNxxNIw/37jtIrffV/8C9a/l2lUNHjvLdP/vxHz2+++1w5hNqWRTDGfmd6e4L+vA5AKHC4/hxT0AQfGnAIFg6sHQoWncNynV43qD29MZH6+08RXDwz9VCwB7g3bgHGIcVYBuAKDRa7sSiE2Hu9zqyto3/Q1eNoeNH9/NeG2j1Rs0aaPex2/lXrqmm6/7+I23c5n0E4r1i9lxNTxV0wpgOdOEJXWhgT17zt4cqS4lbAsp1cDreJT68Br7z8Wq64dHP7KyeCd37xBWlC5QPFA4RJGBbBxTBMsd1Vnn5ZxxiOlI+B3jfnjhCrOFvZgyjGScM954Knb4DnT/5mNrzniiyVxcs2Ub/t2Cztv/+UEvds1MqFWGt/8zxHalTW1vXN0MtCsdnArFFwEjD+QFKCfD+u3jmv1X00IKv7CuzpC0GyVErFpest08oSwpEoPU8T6AUfN8ygfz8/JS9jnb/QeevdeRk0wKcOuEQutw5kgTOAG8dXH7X9VrHj+wVNc1/79yf6DHs74/klL8y7ruhqCfd8cteNOawNpSZZuO6ZmQRcm5MIDwElLGwuad+iyCOX20ZRhzWjX7G7oAvf7DJvb+gNlKIMcP7dfvXmjVrzJb58ffwEPCu3nnLC0ZreUu/PMo05Xh0Nr2koGph0nemMD+uWlTyJZJIb8n42kECW7Huj256/MErep9GHdaJbjlvNBleO/8Ga3+s/cdi2LXXTdf940f6OAIe/Rrrn90vgy6e2o0mjmjrQ2FqjMl/mQATILP+VFAzQy0tNh8rqgHHDeceQWs27aHlX9vm3v+4n1N6zEFmtzH9gAREdoFzmCGNsdKgQUJSppRyI76/X3780E9ozpyglChvw8ZWOecWFp8Kq4/f48awVjfrL2zDITwfQin4ALri0p2uNp+uKXt6v4+4SXnZ7nX/nl0yaN6dk7z798dhPkYtLHrN2GwC5b//0j+vxcsjMlb+A+DR78rTulHByHbc8Sflr48rrUXAyKg/TtiLYeCuPfvp7DsW04afbdtWzPYAXhpLnRPTIWXvGPTq49HZHwsD8nGI1tlLVHVppTDlzeXvlrzm4/6By4EUAJFbUPwABvfXHkgR3AcMO+Wn0BI/REGXpqSaH37+Zkn8nDQTXB2DjmX3ur/ajzvvrnzq28PbFlp0/mo7T4x2/t9trKFLHl5Lm3eE39ivW4cUumxaNzptXEdywMqIAxNgAhYJKGdBaYfCJqD1csC6jTuo+I73qLrGJiNjtgegUVOd3Vx1xjgMrMdjZI/OXoxBy/k78r5Vw2KS5oHy0gW/aXWjyQW/b0X4p/8tMr6zSXydj1/D5h0KAS0VhvvDioUv2WhBolOs8KZVe1y/3irew+zIsXbkpLaqqf24o4b09CIO7n09Hv5i073vyh+q6dePrKPte2x6UXghoC6pzl458rn81O7UNqP1C8tHMr7MBJiAHwLSaENmOpQAL+HTlRvo4vuXeblj8ZKk9yqOGz4p2Klsi7nETLLcKWcOlaYDHT6WiCWp0f0QWwon6PaK0gV3+5LlUwHA+sJwg8QXSJjqK7HmdWU98j9oKR8opWC3K2tpIi4b5BY6byIp1PKJLeGOC3LptPzDvcoyajfgYJ/YPNXvk2/20VWPrqO9+7HXOIzhKDjxuWV6T97OF0bGLDp5CciUjmSmqlMEW4f5pV/Rfc9Vtb5h8Qr6hesrFy140GLymE2mjMG3im4jMJkyHoaPx5JJ+RgcdwtTgV3Y/31ERWlJhTf5PhWAvMLiZzH1cI63RGG6th9rG8uVHQH+Lq0VdR9+teiVrWHKKyJiR0w8M9s0HJ8isww7Mpx6TC+655JjvK5ji7otZLh+tiMb22UsqdyNPf7rqQa+/cMV2mY66Nozunu29HnfERGunFkuE0guAjK1G5kprXcxo7+g3/79I3r9ww12AVFHFh7pq/OyK5NwyxlacHqXNJk6Dn1b/fq9oNHI05Y+Iciy+zyC2asC4NFQHN1V56vOioxWgAJIX6KA/3a75VPxdmjE6NGzUms77ViG6RzV2NphQK+29DyM/jLTW0/ICPcOGP1t1M4jHAL++7+ddPszG8jlVs0ZnjAJxn23zuhJ3dq3ZhOeHFkqE0huAmoWQM0GtAzV++vo7N+W0g+b9rW8ZfG7/NzsTEdXlZTArix+Qna+c7CRIn6F9/80lFoZz3vtayNUo51d3Ju7lpWVtVp79bpAui2tmzoaKpqdv+KigA1Ht3Gz4RBVuZOKfof1IK/lVZFjLdR13HGnXZ1/WqpBD11ztPfOH3t1jdqfYq36nvKUfrGbbn06fJ1/Ovbv31jUgx66tC93/jH5BHChEpWAUbcRy42tbY0yM1LpYbyr7DszQIwythm3xgtHZfOVU1h8N/qslXj/34hyKw9t0ez8FboOm4zOfdSHlsF7h+oyOrWMGOXvaUB4W977X74QD0oAjCePgeJyg13M7r/0CDq0pxeLf3WKV41ynBW+0bXVOnyE/f03PbGe4DfCqgi/6dSe/hdvHUgzJ3XxG49vMgEmEB4CRu2PePW03mrcr3cnunvWCBszlbeMmOQ8ykaB4RGFAepX28Q8IaVSWGJqOtKQqa2na1BIrwqAYYpt4SGkJ1WSLM57f+VNelLCm3r0tGlZUPieRi7NPWdYzLZ40qFeffwrv/4O9QOEBUmshc9X1Rv81brCU7ai4zrRszcMoH49QtoVE2uYuDxMIM4JqC3H67yeMTJ57EA6u7C/XfVLQU7PHHOMM9MugeGQk/t+lXJgdFY4ZOvKFKne+3SvCsAXZfN+QIYxuaiM8eTtoyZP760LJFzp6/ZlKot/72b6IWaaPaADXTvzCBj9tUyI7X6166B9t1rSaRkx4t+/Xb/fY+2/PwwGf2p7343FPem2Gb34tL6ItyxnyARaE1ADEeEZiDSf6VPvrKuLRtDQfl5mLluLCXwFRwfvyTJ8bmcLLCC8MXKmTMeyubg5vLlYlr6hcuE8NVpsFbwqAIgF/z3ipVaxY+NChku6z42NojQvhZqmws/giuZXrX3LTE+hB64cS2kprScSjDqs+cego591W2rp0ofX0c599m/169jWQX+/ph/NnOjL+ZU1zpyKCTABPQJCLUV6sUNKxzvswavwDoMNkz1BXp070WmLUbU95TkoxXB5+qRIWvYfzDzAJ3TmJYjSXENrSOOzZaQh/g9xWlt5BMgsIrdNKoxIPiFkonZOmIL+hiQ+mYYgju66KI96dmnXKonh2k7CtaPV9Whf+Hmni2Y9tJa27KqzvSjD+2XSAqz3H3k4Vlc4MAEmEHME1E4k4d7eqly9u7ajORfktbpu8YKDHOJxZWhnMX3YkqF3nRg24XqC9zik+QdfInx2VpgyWIdKXYqEXjUHXwIjcl2IQyKSTwiZ/Gx0vwZTQKNCSOIzauGYnlRwVP/W96Fpi7pNra9H+Ypa65/9+I+0fqv9O3WmHtmBnrmuH6mjezkwASYQuwTULIAwW2//+8W4gTTlSG+eSy3UBduqv9wmLreQMrxJhBgU3gwsSZfwqTPL3xHLPhUAlR28MP0Lzgt+hY/2D+ss1ac+EaY0/JZbQ7SlpNmFzkOx5nWHpcQtEnVun0a3XTC6lbMfIetg9Id1/xjUx+6d9xOt+L71D79F1UL+WnRcZ/r9hX1IbffjwASYQOwTELXrYRTYvLtQjrluPu8I6tg23ZYKwLzgbnW+ii3C7BNi/7qnXtlqcYDfheWLF8z1Jybgm7WydMFTcFeo9nS8in/NW9af5DDewwEJP4RRfMii4TL5ESRqG3JCLwnuv2wMdWjbcikJKo/H6C/WnjGify3aRi8vtX9J4sITusLYryeOOvYCiS8xASYQkwSUUaABJaDlQKVju0y6x76tge3IcDwcYwBWx0h5VB/9CjncIyoWlzwdqEwBFQAloLJ0/pcVixacbqbInvBrX4TuCPClcnEbFTN0rEm8FahikbqfV+A8C4PyU+zIb3rBoTRmWGs/2wam/YUZmaNzQ6mH2uv/4Ev2Lkko6+HZZ/Sga07vHkpROC4TYAKxQsCzVLm5VWnGjehLZ008tNV1KxcwKD0jb6LTlveulfxbpsHe/7KW1yL0vQ5TLh/DT85Dqm9WfTT66jOCPWxPa3yVN+WcNuTaP1b5OIZSoE4yOgaVbh/miu+R5BhcuWiuvT2PhUIPnjqzfWZt3Uok7WMhebMkfbtl0fx7Clt5+xPuXQ0adbPoUf+i1vvP/v1q2rHHvlkJ1fnfUNSTLf2j3rpcACagT8BM60vS0XxidB9cBZ91Sylt3GrLkuFa0y2z4SZ+j35p9SSoreku0/weUuxZ5/BVHByVDDPzZXD/8qEQxodt9rk/XbaspNpX9EDXtRSAlsKVdebKn40cw5A40lCMg2YyHnHsUfkaMsPoP2ZOiMotKLofxbqhJQcr3+fddRwN6df8QCi1lmbsV8+UaUVk2NKoQ31m3L+G1J5/u4Ka6r/7/D508lib9g3bVTCWwwSYgEUCDnJnDIRtdEqz9JXfb6Zz7ny/2TXLXyTdXbF4we2W09uYMLew6DbMBv/ORpF48csv0Zeis8cheSSWrVg0/xsb5YffR7Ey1jAdjmOFxLGHgo5F4ZU9gcNiJZ7C9IYySoQeEN2QN8U5QLrFlyiFtsZ33tQBdM30I1pVyKj5watVbauIEb6gjP7mlW2zNVfl05/d+tqKlIUxgagTkEYmmen9W5Xj/mc/oXmL1ra6buFCtUu6hn25+OUfLKS1NYkaAH+1VbyAfq7IkmBB22G495GU4mOHQR+lkPxoeWnJTkuygkxk6wxAMHnilKS2OCXpaGnSsdBqlEJwNP613vDeXJia4piDzl/tZ4x656+KhtG/cq6g7fZRWf3/+/9OoLaZzd3aGjjeV8Tg8b5LK/fQ5X9di+dUUbAnXHFqd5o1tfXxovZIZylMgAlEk4CZ0o1kavPf997qWjrlhrdp2y4btg5L8ULF4vkzo1nHxrw9J+ka3e+AEnAjrvnbu6zWTivRB6oTYz+SDvfHWLf/GtdsfLM2lsr334grAC2L4lk22EG5hpvGw+R7HKqvZgjUFg81v/w9Opq3pCkfxzoP3N/FRlCH/WBe6wOURpvfX689ipRxTNMgzL3wsW2LdtxUrPbnrbtcdNbd35P6a1eYnt+Zbpne0y5xLIcJMIEYJGCm9yNpNHfkVfbZWpr98Cd2lFaaJk2oeneBeifHRMgtPHOglCmXGiQno0cfhELtQ2/xMfqzj7CLfZl0uT+NBdsF7Q4sJmhHthACo/+PkeWRutkeP6oH/elqrIwo67fGIN3kqMG6f4z5+VeH+l368A+kLP/tCicd1YHuuaAPb/WzCyjLYQIxSkDCDsBU9gBNVn/VLOLsh96n975ovWPAQjU+wgzxOKSL6AjaQjljKokRU6WJg8LkTHL+EsXU7vzVedm3nDuyeecPwR4//zHW+atmeeadrbZ2/uOGt6HfndebO38FlwMTSHACHv8ALbyYqnHPLeeOsuusgKNzCpzW1t4TnL2/6rEC4I9Oi3vqOEqM1u9ucdnS15vPzaHunZtvkRHuPfCnvcuSvHAmWrOphh79jy1auqeYfbqk0X0XHkIpjiYzH+GsAMtmAkwg6gSEayfeb7ublaN7l7Z03fRhza5Z/QIr+T/UH8duVULypWMFIIQ235tJ1yL6oSEk8RpVHfM7bYJaFmoSMPUv6jY2uRAbH9XU/x3PbaSaOntm1tpkOOiRy/vCLajVjSCxwYVLwQSYQOgEPDOc1Nx3yOkTD6fD+zYfDIUu2ZOib+2+zCsspk3KZKwABNnsowudHeB9SikA2uG280di9NscvfphqGmyWAvzsd3v81W2OO3AcgfRXef2osG9tXdOxhomLg8TYALBEPC4Cm7uw00th952vi3nqKkS3KActAVTFI5j09G1yQCyVhqq8++sW9epY3vR0P7Nt8TE6tT/Fhzx+8hrW3SrfCD9ZdO60eQj+Ld5AAh/YAJJSEC4Wy8F5A7uToVjethBo0tmXd1VdghKBhnNh6HJUGMLdRyZf1pHGJdqP1QOuLu7qiinRQlic+pfFfJOTP3vqW4+Xdei8EF/PT63Le/1D5oWR2QCiU1AYMaTsOzZNFw/YySpd6R2kHRd7vgZnbTlJIEAVgCCaGTTkabc/UIJ0AuXnHoY9ezafARs1OKgnxic+i/9fBctqWxusGO19t3ap9JdsPhvtt3RqjBOxwSYQNwT8OwKcDU3LO4Bg8DzTxxoR906igzX1XYISnQZrAAEaOHR+Wd3hfmbtmFJhzapNOMXQ5rlJkz4hsB0WKyFWpdJD73S/MdptYxq3X/OOb2oU9vm/sCtyuN0TIAJJAYB4drRytX5BScNo/aZ/hzoBVd3+BiYnX2CU3vJNrjc4jcWKwAB2q4uxa1cOgZyVRxACtFvZmZTm4zm7n5Fbcw4N2xW/mff2UZrN9vgohNSz5vchSZg+p8DE2ACTKAlgfpdAQd3GLXJSqfZ04e3jGble3vh9thtWUmbNGlYAfDT1Di3oCc0ycv8RAnq1oBebemEsf2bxTVcWzH1X9PsWix8UW5+n3r7Z1uKMrRvBl0JP/8cmAATYAJeCZg1ZGAmoGk4afwA6tcjq+klS5+FlFfnTTmdX0B+6LEC4AeOI0Vch9vaT+It5+ZRSsrBfe9q/UvU2dPJ+im+pVtq6n/Pfv3jh1Ph5OdeuPlVfzkwASbABHwREHWbm7k+T8W78qZf5vmKHsr1tqY7lW0B/BBjBcAHHLWXFKP/i33cDvry8P4d6IhhzQ+7ER6XmPqdbNCFCDLi1z/up/981FwbDzJpq2gX/aIr7/dvRYUvMAEm0JqACRfoUAKahKNyetPQQ5sbTDe5HfRH2CD9Wp1AG3SCJIvICoCPBs+qq70Etzr4uB305evOzoG/+4Oj4HrDv11Bp49kxL9gz7/y/Kcb+vdIJ6UAcGACTIAJBEPA4xsAp6A2BgPbAW2xBZDUyeGgixrl8t/mBFgBaM7D82306FmpUoorvdwK6VL2gI40ckhT5xay/rCfkKREJnLlmmpaUqG/7U9t470TVv/pqQeVnsjUgHNhAkwgngkYLQ4LOnJ4b8oZqD0GAxJjdn5+Pm9D8vJwsALgBUpdp51n43JfL7dCunTd2cObjf49xi4weonF8OdXN5M6nlM3OI/rRKMGa5tN6BaD0zMBJhBvBPBuFO6DS5DKb8hVZw3XroUk2W+bo8dZ2oISUAArAN4aVcrZ3i6Hck2t/Y88vMnavzRJuGLT8O+Tb/bZctRvxzYpdAVb/YfymHBcJsAEmhAQdcr1+MGRyJjhvSh3oLYPNkiUN0EwT0s2Ya0+sgLQAsiIwqIT8PiNbHE55K/Xz8hu5vnOcG9rZukassAwJvjHG/b4+7/8lG7UIevgbocwFplFMwEmkIAE6j0E4l3ZEDyzAE79WQCIG5E3yTmxUS7/rSfACkCLJwFGcGrrn1ZQ61bNRv84/lJg338sBmX5//HXB41vrJZxUK90OmuCvqZuNX9OxwSYQGIQqN8iffBk1NHYRWXLLICg6xODkH21YAWgCcvsAo+qWdjkkqWPVxcNbz76V3v+sQQQi+FJOP2xY+3/hqIe9hzkEYuQuExMgAlEkACWS+sODpjULMCVZw2zIX/xi7yJzub+2G2QGs8iWAFo0nqCjFn4qrVOpDxYjRrS66BUWYvR//aD32Po048/19LC5fqW/+OGt6FjhvFW2xhqWi4KE4hrAgbemULWHajDEcN60aHd2xz4bvEDXvFC27eLxbxjMhkrAA3NcswxzkxB8hzdVrr0jCHNRsJGC6MWXfl2pl+wZDuZNmz8v3wae9u0s11YFhNgAhKzAAedA6ljgmeddpg2Fth3nd8///wMbUEJIoAVgIaG3JNJxfiodXpUO5xidfyoJrsHzf3Y1hKbTn/q3JJeW6Z/EuGkke0od0BmgvwcuBpMgAnECgHPu7PJtumCMYdSu0zt7fxd2qXsPSNW6hjtcrAC0NgCQijPf1rh4lMGU2b6waMs1YE/sRpKP9tF23YfNLSxUk7l9Ofyad2sJOU0TIAJMIGABIwmW6cz8G49/8RBAdMEjCD13/UB84iTCKwAoKFyCs5WJ08crdNmaorq5PH9D4gQau0/Rkf/qpBq+l83TBzZng7rw7Npuhw5PRNgAt4J1M8CHDya/LTjBzVbYvWeKuDV40ZMPDM7YKwkiMAKgGpkaV6q29bOiX2pU/uDHvBi1emPqufqTTX02ap9ulWm8ydrrZho588CmAATSHwCTWdSO3fIpFOPO0S70m4jhY0BQTHpFQB1UpQQcqbuE1U8uYmBCqxXhUt/fV23TL7Sl2D0r7v178jDs2jEwIMKj6+8+DoTYAJMQIeAcg/cdEfAzMmDdcR50sLg+7zR06Yl/Qss6RUAwyDlI1rr3MmjhnWh/r0OOsExmuxh1X5SbRagrP7f+J++YeK5hV1sLhmLYwJMgAn4INDEnmrgIZ1p1GGdfEQM+nLH2uqM04KOnaARk14BgMeeGbptO3PKwAMilCtLYcbu6F/5/dc1/uvZKZUm5PC+/wONzh+YABMIKwHDjXcq3q2NYeYJB9+5jddC/iv13/0h5xljCZJaAcibcrrawK7lH1pZ/atjKw8EpanGqNc/VcZ3PtN3/HMWTvxT53VzYAJMgAlEhADeqYbr4BkB40b0oYw07S2BJzT0ARGpQixmktQKALnS1Ohf6ykqLuhLmRmNIvCQNjnOMhYb/PPv9Iz/1G6H08cdXO6IxTpymZgAE0g8Ah6PqtLtqVhmWiqdmd/E54q16qaQmXKmtaSJkSqpFQBTyLN1m3Fak61/hjL8i+HRv6rrui0Ht9RYqbty/NOtQ6PCY0UCp2ECTIAJWCGAMwKabK0+dUI/K0KapTGTfBkgaRWAnEnFgzCJfWSzpyHEL4f3bU8DejcZDTeZogpRVMSi607cnzm+SX0jVmrOiAkwASaAbWvqWPWGMLhvZzqsb7vGr5b+4n147Mj86f0tJU6AREmrAAhhqq1/Wv3huVMHHjj1T5h7sFVFb3Qdieepb/eDngpDza9jWweNHap9IEeo2XJ8JsAEmEA9ARMO1sz648vVKYG/bGKAbRGRcKe4p1tMG/fJklYBQN+vfP9bDmotfMLIPgfSi7qDmumBizH4Ycxh1jvwE4/sYIcXrhikwkViAkwgXgiIJjOtxx9xiP47SYpz4qXudpczKRWA7MnOkQA5XAfmSeN6U/s29W5wPW5/G7RSHZmRSOtUFvwW5j1UGpWWAxNgAkwgmgSEew9srepnWzu0zaBfjG1y/Lq1gg3Pm1KcYy1pfKdKSgXAIcVpus120riDFqge61RdgRFKP6hXOp09MXQnPjMndSGVlgMTYAJMINoEhGvHgSKceIy+a2BymaceEJhEH5JSAYAb3Gk6bZyWalDe4B4NInBudZOHUUdupNJeA/cH44YH78hHxb3qNOUygQMTYAJMIPoEPNutG3ZcjRrai1Idel2ZNPT6hOgTsVYCPWrW8oxqqlGTp/dGAUbpFOKkY3pTRnr9VjjhUm51TR1xEU+bniro4V/3JTWq97ccoO6pOCquSsOBCTABJhATBOAPQJj1Ts0y8S4+YWxPvWJJcSTOhdEUoleEaKROug3dbunGVA/MRzXCL44+OOUkzINTURoiI55Udeg3FvWgsyZ0pBdxONDyb/fRhu11nnL0gqvfMYe38dzjaf+INw1nyASYQBAEBNwDS0cHT8ypeCe//uGGIFL5jGIIB52Eu0/6jJGAN5JOAbBz+l+dUCXcep71ov1MqQ7+xuKkU3yjjZ3zZwJMQJOAcO/1nBIoRSqNGtLTswxQ57Y+G4tRoVoaTioFIKmWAPKmnIM9cGKiznPXdPqfYvjIX506clomwASYQFwQaPAMmJmRqr8MQGLK/7d37zFyVfcBx8+5M/uY9fqxu168a4Nf+AHs2saYUJ7tYjt1UFEUnG5MiIjStKFqUftHVPFHIzWordIqqVr1j6RqmyJUh0eySv8gahGNAUeqmiotOMGYEBpsiEjAAZuH37Mz9/R3Zna2u36sPfd3Z+beO98rmd2duedxP2eY87vnnntuuz0iuK0CgDAs7pAPdfXevYif7lnD//4JVWwIIIAAAi0RmPnsFX8ZQLkVzpzs2arMI1XJ2yoAsMbdqWmdWbP/w5OpWPlPc7ykRQABBBItUFkZ8HSlipuvql4G0NR36jKAJotUpW2rAMA482FN69y+ecn07P/Kg380mZEWAQQQQEAtUFuHxT+a/bZNi1X5SQDgR4nbZmubAODaD398rbSqaoxo7LraZDm593/GU6na5tPCgSKAAAIJE6h+F7tKrbZu8Xd5R9+ccSva6eFAbRMAlF2gmvznP1Kb11UXw6k+jCL6bNPoH09SIoAAAgjMFpDHBE8txX7t+sHZb0X4qxw4dV8RodiWJGmbAMA53ez/4YGCuay/+iCd6uI/LWkvCkUAAQQQOEvAlqqLAi1dPN/472rNZgNDAKABTGBav/LPmKZed960bNajfzV5kRYBBBBAID6B2qqA/hHBO5QPB3LObYuvZsnOqS1GAEa2jV8tzVC7gB+pRW7cUF373y8+YWQZSjYEEEAAgYQIVJYGri7KdvPUd7WiZkun5owpskhH0rYIAALl4j85WRT/qpX9lRa1oTyKkg0BBBBAIFkC5eplgGtWLTbBXA85uYRal8P81kvYLfW7tEUAIPNDVdd0bhoZMD3dndXGZvZ/6j/0HAACCGRPIJgKAOYVOs3166snbFGPUi4Zq/qMqOU2O11bBADWmV/VwI5dN1xNHp6SxX9KmqxIiwACCCDQCAF5NosJq4sCbb1edcVXloxxv9aIKiYtz8wHABu2f3y1sUZ1b8jI6mo0GZQZ/k/aB5j6IIAAAjWBIPSPZzdmw9R3du31CD+HRraPL4+QLlVJMh8AOBd8SNMi/lrSiqHqIycNAYCGkrQIIIBAQwUqk7SlhJVLF6nLyRmr6jvUFWhCBpkPAGQCoKoRN6xeaPyTpowpyfB/dXipCe1CEQgggAAC9QpULgGUK3O2RlZNnbjVm8fU/jJ3TNV3RCy2qckyHwBoG/GW0anV//ztf2wIIIAAAokWqI0C3Dyqey6ATAQgAEh0S1+scg8+6AOczRfbba73N66duv2PAGAuJt5DAAEEEiFQWxZ405oBbX22mGofos0nsekzPQKw8T9/fI3Iz9for7mir5p8aq1pTV6kRQABBBBosMDUydra2nd39OIWbvzeAf8QucxumQ4A5I491RDOUF+36V/QI7eWFLn9L7P/C3BgCCCQJQHrbwd0RTMoz27pXzC1fkvEAwwD3RyyiMU2LVm2AwDlJI5bNw3K+v9m+klTTWsVCkIAAQQQiCzgLwP45wLcunEwch4+oXSQqpNIVeFNSJzpAMBad63GcOOaqev/DP9rGEmLAAIINFWgNhHw2rW6eQCyIJBqDllTDzpCYZkOAGQBoKsimEwnWbV0QeX32odp+g1+QQABBBBIrIAtVx8MtHpYNQVMjs/6eWSZ3TIbAFy9Y+ew3MYxNYMvWvv5Z0tbd0YSh9EyIBUCCCCAQAsEyvLdXTTLlmgDADOwZeyTyvsJW3D4l1hkZgOAjsmcfwRw5G1eIW/6FnQbU2bxn8iIJEQAAQRaJSDPbulf2GMKXXlVDSZzTtWXqApvcOLMBgDOWlWjbVqzqDKJxLpTDW4CskcAAQQQiF1AAoBAJgL61Vw1m7NlVV+iKbvRaTMbAAicqtE2rK5ePbDyIWJDAAEEEEiXQDD1ZMANV2qfC6A7mUyyGgHABVpn7RUyAdDJtf/QzwFgQwABBBBIlUDl5M2Zdct1AYBzupPJJJsRAFygdVYO+wDAX/+XpwmwIYAAAgikTsDKKMBK5Z0AshRMZu8EyGQAsGX7uL/oM6z5tA4t7pUFgBj+1xiSFgEEEGipQHjSDMt3uXK7fP0tH1XfTqCsQ0OSZzIAmAyDKzVaC+d1mHndnRIAcAeAxpG0CCCAQCsF/Hd4b6HL9Pao7gSwHd3zVrXyOBpVdiYDABeYKzRgay6fihgJADSMpEUAAQRaKuDXcfHLuV+pvAxgbEnVp7QUYY7CMxkAmDBUNdaqYR8AOFlIQh4qwYYAAgggkE6ByiRuZ1Yunaerf2hVfYqu8MalzmYAYHWNtXyJBABTH5zG0ZMzAggggECjBfyJ3IohZQBgdaPKjT7GqPlnMgCQefvLo4L4dEMDhcoykpo8SIsAAgggkAABuZQ7vFge667Y5CqCqk9RFN3QpJkMAAKni9aGBiRa5P7/hn7wyBwBBBBoikBYNMN9ugBArghzCaApjRVDIU45XDOwyI8AsABQDE1BFggggEBLBfx3+UBfQVcH5WVlXeGNS525EYDx8fGccKnWAOjr7SYAaNxnjpwRQACBpgn4AKBvvjIAMG6ZVFiuBGRry1wA8MoRMyRN1BG1mfwaAIVuuWdUho3YEEAAAQRSLiCXc3vkO90/4VWxdY2MjS9RpE9k0swFAM4EqkZadlkPt/8l8qNKpRBAAIFoAtaVzNLFulEAm8tfFq305KbKXABgcrb6GL+I5osXdnH2H9GOZAgggEASBawrmsFF8t2u2GxQUvUtiqIbljR7AUBYVjXSYv8hYQGghn3gyBgBBBBouoCMAFRO7hQFu7LpVyRPZNLMBQDO6kYA+nrlGQCGFQAT+WmlUggggEAUATmpG1igGwEwga5viVLtRqfJXAAg92uqRgAWzfeXAEqNdid/BBBAAIEmCfjVAPu0AUDICECTmktRjNNFaX3zZQSASwCKBiApAgggkDAB+U5fJKO7qs3qTi5VZTcocfZGAKxTjQAs7JE7CAkAGvRxI1sEEECgFQIls3CeMgBQnly24qgvVmYGAwDdME1vj3xIZMIIGwIIIIBANgRsOGnmKwOAwOr6liRKZi8AUM4B6Onyiz3J44TYEEAAAQQyIuBMT6duIT9nQ9XockYgOQwEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQyL2CTcISj2z65JDDh7aExNxrjrpJKrTLWDBpn5kn9OpNQR+qAAAIIIIBAnQJF6ctOSF/2tjPmkDH25cCY/wpN8OyLTz92uM68Yt+9ZQHAyI7x/mDS3GOs/bQc1YdiPzIyRAABBBBAIJkCzlj3A+Ps7jDvHjvw1MTRVlSz6QHApq3jy8LA/pFERJ+TA/Zn+GwIIIAAAgi0q8AJGRn4+1J+8q9+/NS/vNlMhKYFAGNjY/mjucH7Jez5MznA+c08SMpCAAEEEEAg4QInrTVfKfe5Lx2YmCg2o65NCQA2bdu1LjTh4xLlbG7GQVEGAggggAACKRV4Piy7XQf2Tvy00fWX+QiN3Ua3jt8VGvc/dP6NdSZ3BBBAAIFMCFwX5OxzG28f/2ijjybXyAI2bB3/jLV2t5RRaGQ55I0AAggggECGBLpkgvwnllx5zVu/PPjSc406roYFABu2j98nZ/1fl4o3fJShUTjkiwACCCCAQIsEpO+0dw6tGv354UMHnm9EHRoyB8AP+8uZ/4RUuGEBRiMwyBMBBBBAAIGECZRt6Ha+8OzEE3HXK/YAYGRsfI2/fiEVXRB3ZckPAQQQQACBNhQ4LkHA9RIE/CTOY491eH7Llvs6gpz5llSQzj/OViIvBBBAAIF2Fuh1OfuIv50+ToRYA4Diwvc+z2z/OJuHvBBAAAEEEBABZ7YcyQ3+YZwWsV0CqKzwZ60fnmB1vzhbiLwQQAABBBCoChyTNQLWyRoBb8UBEtsIQGV5Xzr/ONqEPBBAAAEEEDifwHybC2SkPZ4tlhGAq7bdNdBhOl6XKnH2H0+7kAsCCCCAAALnEzhuzuSX7/+PR98935v1vBbLCEDedt4jhdL51yPPvggggAACCNQv0Gu7J++uP9m5KWKZUWidu/fcrKO9csPmDYfu/+1PHb9i6dBQRz6/UHLpjJYTqRBAAAEEEGipQHGyVHr/Zz9/662vPvSN3v/e9+KqOGrjnPV97t9p81JfApD7/ofkvv9fSEVUeXV2dhYf+tsvvbJi2dA1klcsIxNaHNIjgAACCCAQk0B46GdvvPQ7n/+TdcViUXti6/Kdbsm+Jyfe1tRN3dHmcsGYVEDd+X9n91fflM5/VPJS10nyYEMAAQQQQCBJAsGq5ZePPrH7q7/o6OyYVFbMls4EY8o89J1taMyN2kr4M/+eQmGFNh/SI4AAAgggkGSBeYXCyq//zZ+/rK6j1fe96rNta9x6zYH4a/5Tw/6abEiLAAIIIIBAKgRWX7FsZMumkdd0ldX1vb5sdQAgeazVHISf8BdTPTTVIC0CCCCAAALNEgju/61PHVMWpup7fdlxBACLNAchs/2HNelJiwACCCCAQNoEVixfOqSqszN9qvSSOI4AYL6mEnKrHw8O0gCSFgEEEEAgdQIduZy/zT36ZvUP3YtjHQDt7Qyz0pdDZyZLZVOSn6H8c9F5SIkAAggggEDLBPztcUFgTV7+deRzJic/a5u1dlbfV3u9jp9ddex73l3jCADOm3H9Lzpzqlg2xZLcV8CGAAIIIIBAygX8Caw/qfX/zkjf1pkPTKEzJ6/+fyDQykOM4xJADPV35sSZEp1/DJJkgQACCCCQTAF/guv7Ov9s3yRsiQgA/Jl/qZwMkCQ0CnVAAAEEEMimgO/rfJ+XhK3lAYAfGmHYPwkfBeqAAAIIINAMAd/n+Tlurd5aHgD4CX9sCCCAAAIItJNAMQF9X+sDgAREQe30oeNYEUAAAQRaL+DvdGv11vIAwLnWI7S6ESgfAQQQQKC9BMIE9H0JCADaq9E5WgQQQAABBBLQ/8eyEiAtiQACCCCAAAIpE2j5CEDKvKguAggggAACmRAgAMhEM3IQCCCAAAII1CdAAFCfF3sjgAACCCCQCQECgEw0IweBAAIIIIBAfQIEAPV5sTcCCCCAAAKZECAAyEQzchAIIIAAAgjUJ9DyxwEfevV/66sxeyOAAAIIIICAWoARADUhGSCAAAIIIJA+AQKA9LUZNUYAAQQQQEAtQACgJiQDBBBAAAEE0idAAJC+NqPGCCCAAAIIqAUIANSEZIAAAggggED6BAgA0tdm1BgBBBBAAAG1AAGAmpAMEEAAAQQQSJ9Ay9cB+IMv/EX61KgxAggggAACKRewUeu/5o47ugpnFtxjrHsoah6kQwABBBBAAIGIAs5+9lTXB4/+9Mknz0TJoe4AYPMd44Olovk9Y+zvS4FLohRKGgQQQAABBBCIReCwMe5rneX8157b+9g79eRYTwBgN27fda9z7q+lgIF6CmFfBBBAAAEEEGiowPsyIv/A/j0T/yiluEsp6ZICgNGtu6601v2DZLj1UjJlHwQQQAABBBBogYBzT5sgvG//nm8fvFjpFw0ARrfefbO14ROSEWf9F9PkfQQQQAABBFov8J4J3Mf2f3fie3NVZc7bAEe379opnf/TkgGd/1yKvIcAAggggEByBBaZ0D61cduuu+eqUu5Cb45u/8RnrTO75f2OC+3D6wgggAACCCCQSAF/m//OodUjrx8+dOBH56vheS8BbNo+fmvorD/z7zxfIl5DAAEEEEAAgVQITDob/PqLex7fe3ZtzwkArt66c0Xe5n8gO1529s78jQACCCCAAAKpEzjinP2VF5/55qszaz57DsCDDwY5m/+W7EDnP1OJ3xFAAAEEEEivwIANwkeM9PEzD2HWHIANuSX3yZDA787cgd8RQAABBBBAIO0C9vKh1995Q+YDPF87kulLACM7xvttyf5EXlhce5OfCCCAAAIIIJAZgaOd5dz62oqB08MBQSn4Ap1/ZhqZA0EAAQQQQOBsgf4zufCB2ouVEYCbbhovHO+xb8iL/bU3+IkAAggggAACmRM4cqzcc/lrex8+XRkBOF4I/GIBdP6Za2cOCAEEEEAAgVkCA73BiXH/il8oQB7s5z5X+RnDf0YHOw5+evOioyv7OoZzQX5A8u6OIVuyQAABBBBAoL0EnD1dDktHDr1bfPOf973ff+DtydWxAFh7n+Sz227ZPr6w6OwR+WPWHQH1FtJhTfHLOxbvX95X2GysmZ5bUG8+7I8AAggggAACZwk4Ex585+S+P95zZMOkUy/SVy6ePt0XFMv2FilG3fk/dNfS15b3F7bQ+Z/VaPyJAAIIIICAVkBOrFcP9mz5p53Dh/I5O6nMLtdd6L45MNbepszI+DP/nu7cOm0+pEcAAQQQQACBCwvM68qv/8vti8+7tv+FU537TtnY2wJn3eZz37r0V/w1/8qw/6UnYU8EEEAAAQQQiCiwqr/7uqsHOg5FTF5JZo3bHMh/VMv++gl/DPtrmoG0CCCAAAII1CEglwM+c93Cd+pIce6uzl0mk/XswLnvXPorK/u7ll763uyJAAIIIIAAAlqBFX26vldiiEE/W39QU5FcwPoBGj/SIoAAAgggUK9AZ96q1u5xxg36dQAK9RY8e3876z5/Vyoad/qYcWdOGRfKREXnZu/OXwgggAACCCBwcQFrjQ06jO3qMUGhV+7X65xO44xV9t2mp7oQ0HSW0X+RuQSmdOyIcaeOSSZ0+tElSYkAAggggIAIyAm0K8tJ9cmiCU++b4KeBSbX2y897PRz/FRMsSzYU+n8331LOv8PfI1VFSIxAggggAACCJwtICsBSRBQkr42rpH1WAKAypn/5Kmza8vfCCCAAAIIIBCjgJO+NjxxNJYc1QFA5Zp/Zdg/lvqQCQIIIIAAAgjMIRCelNH2snYxQKNfs99P+GPYf46W4i0EEEAAAQRiFXCmXLnkrstUPQIQymx/NgQQQAABBBBookBR3/eqAwAblpp4xBSFAAIIIIAAAqas73vVAYBzIS2BAAIIIIAAAk0UiKPvVQcATTxeikIAAQQQQACBmAQIAGKCJBsEEEAAAQTSJEAAkKbWoq4IIIAAAgjEJEAAEBMk2SCAAAIIIJAmAQKANLUWdUUAAQQQQCAmAQKAmCDJBgEEEEAAgTQJEACkqbWoKwIIIIAAAjEJEADEBEk2CCCAAAIIpEmAACBNrUVdEUAAAQQQiEmAACAmSLJBAAEEEEAgTQIEAGlqLeqKAAIIIIBATAIEADFBkg0CCCCAAAJpEiAASFNrUVcEEEAAAQRiEiAAiAmSbBBAAAEEEEiTAAFAmlqLuiKAAAIIIBCTAAFATJBkgwACCCCAQJoECADS1FrUFQEEEEAAgZgECABigiQbBBBAAAEE0iRAAJCm1qKuCCCAAAIIxCRAABATJNkggAACCCCQJgECgDS1FnVFAAEEEEAgJgECgJggyQYBBBBAAIE0CRAApKm1qCsCCCCAAAIxCeS1+bz85gfaLEiPAAIIIIAAAnULDNSdYmYCRgBmavA7AggggAACbSJAANAmDc1hIoAAAgggMFOAAGCmBr8jgAACCCDQJgIEAG3S0BwmAggggAACMwUIAGZq8DsCCCCAAAJtIkAA0CYNzWEigAACCCAwU4AAYKYGvyOAAAIIINAmAn4dgKL864x6vF88oLsPMWq5pEMAAQQQQACByAJnAmcMK/lE9iMhAggggAACqRR4P7DGHEpl1ak0AggggAACCEQVOChzAOy+qKlJhwACCCCAAALpE7DW/NCPADybvqpTYwQQQAABBBCIKhBK3x+YXOd3JIMTUTMhHQIIIIAAAgikSuCkK7l/C174990njDOPpqrqVBYBBBBAAAEEIgrYbxzYO3G8sg5AGLovSy7+dkA2BBBAAAEEEMiuQNE54/t8k/P/efu1l44uWT0yX369xf/NhgACCCCAAAIZFHD2Ky8+880Jf2TTKwEeK/d8USYE/jCDh8shIYAAAggggIAx+3tPhX9ag5gOAF7b+/Dp0NnflDd+WXuTnwgggAACCCCQCYHDxpY/9v3vT5yqHc10AOBfkGGBVwMbfER+JQioCfETAQQQQACBdAscDgP3kf17vn1w5mHMCgD8Gz/a8/i+sOxkLoB7YeaO/I4AAggggAAC6RKoXNq35ZsPfHfinEv8lUmAZx+OnxTYs+KGh7uCSf+QoBvk33n3OzsdfyOAAAIIIIBAIgSKRib8HQt77n3lmcfePl+NJDiYexsZG18TBPYBY809sue8uffmXQQQQAABBBBooYAs7Gcf8bf6+cv6c9XjogFALbEEAr02Z37DGnu7se5aiSxWyXuL5F/kRwnX8uYnAggggAACCNQt4NfveU/65EPSN++rLO8bdP1rZYG/urMiAQIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggMClCvwf2B01AQCMHa4AAAAASUVORK5CYII="></image></defs></svg>';
    return str;
}

function add_to_cart_wl(action, oldOrderId,businessId) {
    //$('.spinner').show();
    if (action == 'add') {
        var validate = 0;
        if (itemTemplates != undefined && itemTemplates != '') {
            var mandTopp = itemTemplates.filter(e => e.minQty != 0);
            // //console.log(mandTopp);
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
    if (action == 'add') {
        var t = 0;
        if (localStorage.getItem('itemList') && localStorage.getItem('itemList') != '') {
            var arr = JSON.parse(localStorage.getItem('itemList'));
            var index = arr.findIndex(e => e.bId == businessId);
            //console.log(index);
            if (arr[index]['items'] != '') {
                i['items'] = arr[index]['items'];
            }

            // localStorage.setItem('business', businessId);
            // localStorage.setItem('slug',slug);
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

        

     
        post_params.action = 'reorder';
        post_params.cart = JSON.stringify(i);

        get_params = "&action=add&cart=" + JSON.stringify(i);
    } else {
        post_params.action = 'reorder';
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
    post_params.oldOrderId=oldOrderId;
    // //console.log(tableId);
    // //console.log(post_params);
    // var params="?businessId="+businessId+"&contactMappingId="+contactMappingId+"&token="+token+"&contactId="+contactId+
    // "&isNew=1&orderType="+orderType+""+get_params;
    var url = origin +  "/client/cart";
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
 
        const cData = result.rows;
        if (!cData || cData.length == 0) {
            // Check if the response contains a specific error message
            if (result.status == 0 ) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result.msg);
                setTimeout(function() {
                    $('#promonotapplied').modal('hide')
                }, 2500);
                $('.spinner').hide();

            }
          } else {
        const orderDetails = cData.orderDetails[0];
        const orderItems = cData.orderItemDetails;
        const city = orderDetails.city;
        const locality = orderDetails.locality;
        const businessId = orderDetails.businessId;
        
     
        // Iterate through the order items
        orderItems.forEach(function(item) {
            var item_data = item; // The individual item

            // Default image handling (if any)
            var image = 'https://cdn.uengage.io/uploads/' + orderDetails.parentId + '/' + item['image'];
            // Check if the item has subItems and append them
            if (Array.isArray(item['subItems']) && item['subItems'].length > 0) {
                var subitemNames = '';
                var totalSubitemPrice = parseFloat(item['itemPrice']); // Start with main item price
                var subitemDescriptions = item['description'] || '';

                item['subItems'].forEach(function(subItem) {
                    subitemNames += ' + ' + subItem['itemName'];
                    totalSubitemPrice += parseFloat(subItem['itemPrice']);
                    if (subItem['itemDesc']) {
                        subitemDescriptions += ' ' + subItem['itemDesc'];
                    }
                });

                // Update the main item with the concatenated subitem information
                item['itemName'] += subitemNames;
                item['itemPrice'] = totalSubitemPrice.toFixed(2);
                item['description'] = subitemDescriptions;
            }

            // WebEngage tracking
            if (typeof webengage_tag === "function") {
                webengage.track("Added To Cart", {
                    "Product Name": item['itemName'],
                    "Product ID": String(item['itemId']),
                    "Category Name": item['sectionName'],
                    "Category ID": item['sectionId'],
                    "Price": parseFloat(item['itemPrice']),
                    "Description": item['description'],
                    "Image URL": image,
                    "Type": item['vegnonvegboth'],
                    "City": city,
                    "Locality": locality,
                    "Quantity": item['qty'],
                    "Store ID": businessId
                });
            }

            // Google Tag Manager tracking
            if (typeof gtag === "function") {
                gtag('event', 'add_to_cart', {
                    'value': parseFloat(item['itemPrice']),
                    'currency': 'INR',
                    'items': [{
                        'item_id': item['itemId'],
                        'item_name': item['itemName'],
                        'quantity': item['qty'],
                        'price': parseFloat(item['itemPrice']),
                        'item_category': item['sectionName'],
                        'location_id': orderDetails.pincode
                    }]
                });
            }

            // Data Layer push for GTM
            if (typeof gtm_tag === "function") {
                dataLayer.push({
                    'event': "add_to_cart",
                    'ecommerce': {
                        'currency': "INR",
                        'value': parseFloat(item['itemPrice']),
                        'items': [{
                            'item_id': item['itemId'],
                            'item_name': item['itemName'],
                            'quantity': item['qty'],
                            'price': parseFloat(item['itemPrice']),
                            'item_category': item['sectionName'],
                            'location_id': orderDetails.pincode
                        }]
                    }
                });
            }

            // Facebook Pixel tracking
            if (typeof fbq === "function") {
                fbq('track', 'AddToCart');
            }
        });

        // Store gtag_items in local storage for later use
        localStorage.setItem('gtag_items', JSON.stringify(orderItems));
        localStorage.setItem('gTotal', orderDetails.subTotal);
          
          $('.spinner').hide();

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
    }
    , error: function(xhr, status, error) {
        // Handle errors or network issues here
        $('.spinner').hide();
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("No Internet Connection");
        setTimeout(function() {
            $('#promonotapplied').modal('hide')
        }, 2500);
    }

    });

}

function addNewAddress() {
    //$('.spinner').show();
    $('#location-placeholder').val('');
    if (businessId == 89) {
        navigator.geolocation.getCurrentPosition(GetLocationMaps, GetLocationError);
        $('#addressModal').modal('hide');
        $('#nearestLocalityModal').modal('show');
    }
    
    
    if (localityMapping == 1) {
        $('#newAddressModalEcomm').hide();
        $('#map-canvas').hide();
        $('.locality').hide();
        $('#newAddressModal').modal('show');
        $('#locality_flow').show();
        $('.doorstep-div').addClass('single-doorsep');
        var localit = "<option value=''>--Select--</option>";
        for (var i = 0; i < locality_list.length > 0; i++) {
            localit += '<option value="' + locality_list[i]['localityId'] + '">' + locality_list[i]['localityName'] + '</option>';
        }
        $('#locality_manual').html('');
        $('#locality_manual').html(localit);
        var userData = JSON.parse(localStorage.getItem('userdata'));
        $('#mobileNoCust').val(userData['mobile']);
        $('#email').val(userData['email']);
        // $('#email').val(userData['email']);
        $('#mapLoader').hide();
    } else if ((ecomm == 1 || localityMapping == 4)) {

        navigator.geolocation.getCurrentPosition(GetLocationMaps, GetLocationError);
        $('#newAddressModalEcomm').modal('show');
        var userData = JSON.parse(localStorage.getItem('userdata'));
        $('#mobileNoCust_ecom').val(userData['mobile']);
        $('#email_ecom').val(userData['email']);
        $('#newAddressModal').hide();
    }else {
        $('#newAddressModalEcomm').hide();
        $('.doorstep-div').removeClass('single-doorsep');
        if (maps_flow == 1 && map_keys != '') {
            if ((typeof google != 'object' || typeof google.maps != 'object') && localityMapping != 1) {
                var script = document.createElement('script');

                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + map_keys + '&libraries=places';

                script.defer = true;
                document.head.appendChild(script);
                setTimeout("addNewAddress()", 1000);

            } else {
                var lat = "";
                var lng = "";
                $('#mapLoader').show();
                $('#locality_flow').hide();
                $('#newAddressModal').modal('show');
                var userData = JSON.parse(localStorage.getItem('userdata'));
                $('#mobileNoCust').val(userData['mobile']);
                $('#email').val(userData['email']);
                // $('#email').val('info@uengage.in');
                navigator.geolocation.getCurrentPosition(successCallback,
                    errorCallback, {
                        timeout: 10000
                    }
                );
                $('#update_address').html('Save Address');
                
            }
        } else {
            navigator.geolocation.getCurrentPosition(GetLocationMaps, GetLocationError);
            $('#addressModal').modal('hide');
            $('#nearestLocalityModal').modal('show');
        }
    }

    //  }


}

function errorCallback(error) {
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('locality')));
    autocomplete.addListener('place_changed', fillInAddress);
    $('#map-canvas').hide();
    $('#map-canvas-fake').show();
    $('.Oops-modal.center-align').removeClass('d-none');
    $('.address-left ').addClass('searchhh'); 
    $('.map-outer-btn').addClass('d-none');
    $('#searchCity').addClass('d-none');
    $('#mapLoader').hide();
    $('#map-error').show();
    $('#mobileBtnSubmit').prop('disabled', true);
    $('#searchCity').removeClass('d-none');
}

function successCallback(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    $('#mapLoader').hide();
    $('#map-canvas-fake').hide();
    initialize(lat, lng);
    $('#map-error').hide();
}
function GetCoords(position) {
    realLat = position.coords.latitude;
    realLng = position.coords.longitude;
    add_to_cart();

}

function GetLocationMaps(position) {
    $('#location_deny').hide();
    var currLat = position.coords.latitude;
    var currLng = position.coords.longitude;
    getCurrentLocality(currLat, currLng);
    // add_to_cart();
}

function GetLocationError(position) {
    $('#location_deny').show();
    $('#location-denied').html(position.message);
}
function getCurrentLocality(currLat, currLng) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var params = "?lat=" + currLat + "&lng=" + currLng + "&businessId=" + businessId + "&contactId=" + userData['contactId'] + "&contactMappingId=" + userData['contactMappingId'];
    var url = origin + '/maps_mongodb/getGeocodeAddress' + params;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            "token": userData['token']
        },

        success: function(result) {
            // result='{status: 0, msg: "Location is Not Servicable"}';
            if (result['status'] == 1) {
                var loc = result['formatted_Address'];
                $('#locationd').html(loc);
                currLocation = result;
                $(".fulladd").html(result['formatted_Address']);
                $(".fullnot").attr("style", "display: none");
                $("#confirmLoc").removeClass("disabled");
                $(".location-btn-one").addClass("disabled");
                $('.locations').attr("style", "display: block");
                $('.locationdblock').attr("style", "display: block");
                $('.locations-outlets').hide();
                $('.locations-msg').attr("style", "display: none");
            } else {
                $('.locationdblock').attr("style", "display: none");
                $('#lco').html('Location is Not Serviceable');
                $('#lco-outlet').show();
                $(".location-btn-one").removeClass("disabled");
                $('.locations').attr("style", "display: none");
                $('.locations-outlets').show();
                $('.locations-msg').attr("style", "display: block");
                $('#lat_ecom').val('');
                $('#lat_ecom').val(currLat);
                $('#lng_ecom').val('');
                $('#lng_ecom').val(currLng);
                    nearOutlet(currLat, currLng);

               
            }

        }
    });
}

function nearOutlet(currLat, currLng) {
    var lat = currLat;
    var long = currLng;

    if (lat != '' && lat != null && long != '' && long != null) {

        var postParams = {
            lat,
            long,
            parentId,
            businessId
        };
        var url = origin + '/client/nearedOutlets';
        $.ajax({
            url: url,
            type: "POST",
            data: postParams,
            dataType: "json",
            success: function(result) {
                if (result.status == 1) {
                    // $('#nearByOutlet').removeClass('d-none');
                    $('#error_outlet').removeClass('d-none');
                    $('#error_outlet_msg').addClass('d-none');
                    var outlets = '';
                 
                    for (var i = 0; i < result.outlet.length; i++) {
                        // Assuming result and i are defined elsewhere
                        let startTime24 = result.outlet[i]['start_timings'];
                        let endTime24 = result.outlet[i]['end_timings'];

                        let startTime12 = convert24To12Hour(startTime24);
                        let endTime12 = convert24To12Hour(endTime24);
                        // outlets += '<div class="nearcarddesign">' +
                        //     '<div class="nearcardheader">' +
                        //     '<span class="nearcardbg"></span>' +
                        //     '<div class="d-flex" style="position: relative; z-index: 111;">' +
                        //     '<div class="nearcardleft" style="width: 100%; max-width: 35px; margin-right: 7px;">' +
                        //     '<svg style="width: 100%;max-width: 100%; height: auto;" xmlns="http://www.w3.org/2000/svg" fill="none" height="512" viewBox="0 0 24 24" width="512">' +
                        //     '<path style="fill: var(--main-bg-color);" clip-rule="evenodd" d="m2 12c0-5.52285 4.47715-10 10-10 1.5947 0 3.1049.37401 4.445 1.04001.4946.24578.6963.84596.4505 1.34054s-.846.69627-1.3405.45048c-1.0698-.53163-2.276-.83103-3.555-.83103-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8-3.5817 8-8 0-.3012-.0166-.5982-.0489-.8901-.0607-.549.3352-1.0432.8841-1.1038.5489-.06073 1.0431.3351 1.1038.884.0403.3648.061.7351.061 1.1099 0 5.5228-4.4772 10-10 10-5.52285 0-10-4.4772-10-10zm19.7071-7.70711c.3905.39053.3905 1.02369 0 1.41422l-9 8.99999c-.3905.3905-1.0237.3905-1.4142 0l-3.00001-3c-.39052-.3905-.39052-1.0237 0-1.4142.39053-.39053 1.02369-.39053 1.41422 0l2.29289 2.2929 8.2929-8.29291c.3905-.39052 1.0237-.39052 1.4142 0z" fill="rgb(0,0,0)" fill-rule="evenodd"></path>' +
                        //     '</svg>' +
                        //     '</div>' +
                        //     '<div class="nearcardright w-100" style="color: #000;">' +
                        //     '<div style="border-bottom: 1px solid var(--main-bg-color); padding-bottom: 5px; margin-bottom: 5px;">Found an open outlet near you <span class="d-block" style="font-weight: 600;">' + result.outlet[i]['locality'] + ',' + result.outlet[i]['city'] + '</span></div>' +
                        //     '<div class="row">';
                            outlets+=`	<div class="outlet-div-main">
					<div class="oulet-card-div-m">
						<div class="oulet-card-left">
							<img src="${bLogo}" alt="Tossin Pizza" width="400" height="400">
						</div>	<div class="oulet-card-right">
							<div class="outlet-describedby-new">
								<h4>${businessName}</h4>
								<ul class="data-types-ul">`;
                        if (result.outlet[i]['onlineOrdersDelivery'] == 1) {
                            outlets += `<li>
										<span>
											<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1519_80)"><path d="M10.9055 5.70982C10.4951 5.70982 10.0925 5.56819 9.7725 5.31024C9.64293 5.20598 9.62244 5.01613 9.7267 4.88656C9.83036 4.75758 10.0208 4.73649 10.1504 4.84075C10.3667 5.01493 10.6283 5.10714 10.9055 5.10714C11.5703 5.10714 12.1109 4.56653 12.1109 3.90178C12.1109 3.73363 12.0771 3.57151 12.0102 3.41964C11.9434 3.26716 12.0127 3.08937 12.1651 3.02247C12.3188 2.95557 12.4954 3.02548 12.5623 3.17736C12.663 3.40638 12.7136 3.65046 12.7136 3.90178C12.7136 4.89861 11.9024 5.70982 10.9055 5.70982Z" fill="#333333"></path><path d="M12.7129 15.3529C12.5465 15.3529 12.4115 15.2179 12.4115 15.0515V11.9297C12.4115 11.5018 12.1204 11.1396 11.7028 11.0492L8.73578 10.3916C8.65442 10.3736 8.58451 10.3223 8.54172 10.2506C8.49953 10.1789 8.48868 10.0927 8.51218 10.0125L8.82558 8.9452C8.87259 8.78549 9.04013 8.69509 9.19984 8.7409C9.35955 8.7879 9.45116 8.95545 9.40415 9.11516L9.18176 9.87333L11.8323 10.4609C12.5272 10.611 13.0142 11.2155 13.0142 11.9297V15.0515C13.0142 15.2179 12.8792 15.3529 12.7129 15.3529Z" fill="#333333"></path><path d="M12.7141 17.1609C11.874 17.1609 11.1574 16.5353 11.0471 15.706L10.6367 12.7656C10.0732 12.6499 8.48514 12.3395 7.6215 12.3395C6.6078 12.3395 5.93039 11.7561 5.71403 10.696C5.34278 8.87889 6.43423 6.16202 7.76253 5.5955C8.62436 5.23028 9.67483 5.51112 10.3173 6.27532L11.6685 7.87242L13.7278 8.12916C13.9701 8.1599 14.1853 8.28284 14.3335 8.4757C14.48 8.66554 14.5439 8.89999 14.5137 9.13624C14.4607 9.58644 14.0756 9.92876 13.6182 9.92876C13.5844 9.92876 13.5338 9.92876 13.4741 9.91429L11.0622 9.61898C10.8711 9.59186 10.6915 9.50387 10.5493 9.37128L8.70331 7.42403C8.5888 7.30349 8.59362 7.11244 8.71476 6.99793C8.8353 6.88403 9.02635 6.88824 9.14086 7.00938L10.9742 8.94398C11.014 8.98074 11.0779 9.01269 11.1417 9.02173L13.5826 9.32246C13.7598 9.31644 13.8978 9.21217 13.9159 9.0615C13.9261 8.98195 13.905 8.90601 13.8568 8.84333C13.8068 8.77824 13.7339 8.73666 13.6525 8.72641L11.4774 8.45521C11.4021 8.44557 11.3334 8.4088 11.2846 8.35095L9.85624 6.66344C9.38193 6.09873 8.61713 5.8884 7.99757 6.14996C6.92661 6.60679 5.99186 9.04704 6.30405 10.5754C6.46135 11.3463 6.90492 11.7368 7.6215 11.7368C8.74429 11.7368 10.8802 12.2003 10.9706 12.2201C11.0941 12.2467 11.1876 12.3479 11.205 12.4727L11.645 15.6247C11.7155 16.1574 12.1747 16.5582 12.7141 16.5582C12.8805 16.5582 13.0155 16.6932 13.0155 16.8596C13.0155 17.0259 12.8805 17.1609 12.7141 17.1609Z" fill="#333333"></path><path d="M10.0022 4.5046H9.26696C9.15848 4.5046 9.05844 4.44614 9.0048 4.35213C8.86679 4.10864 8.79688 3.85552 8.79688 3.60059V3.29925C8.79688 2.30242 9.60808 1.49121 10.6049 1.49121H10.9063C12.0694 1.49121 13.0156 2.30242 13.0156 3.29925C13.0156 3.46559 12.8806 3.60059 12.7143 3.60059H11.1696C11.0352 4.12009 10.5627 4.5046 10.0022 4.5046ZM9.45681 3.90193H10.0022C10.3343 3.90193 10.6049 3.63132 10.6049 3.29925C10.6049 3.13291 10.7399 2.99791 10.9063 2.99791H12.3653C12.1978 2.4784 11.6072 2.09389 10.9063 2.09389H10.6049C9.94016 2.09389 9.39955 2.63449 9.39955 3.29925V3.60059C9.39955 3.70184 9.41824 3.80128 9.45681 3.90193Z" fill="#333333"></path><path d="M10.9041 17.1609H1.86388C1.76805 17.1609 1.67765 17.1151 1.621 17.038C1.56435 16.9608 1.54747 16.8608 1.5764 16.7692L2.16702 14.8949C2.76428 13.0055 4.49758 11.7368 6.48039 11.7368H7.89066C8.72115 11.7368 9.39736 12.413 9.39736 13.2435V15.0515C9.39736 15.882 10.0736 16.5582 10.9041 16.5582C11.0704 16.5582 11.2054 16.6932 11.2054 16.8596C11.2054 17.0259 11.0704 17.1609 10.9041 17.1609ZM2.2749 16.5582H9.4293C9.03756 16.1749 8.79468 15.6416 8.79468 15.0515V13.2435C8.79468 12.7451 8.38908 12.3395 7.89066 12.3395H6.48039C4.76155 12.3395 3.25908 13.4394 2.74138 15.0763L2.2749 16.5582Z" fill="#333333"></path><path d="M4.88002 9.32582H2.46931C2.30297 9.32582 2.16797 9.19082 2.16797 9.02448C2.16797 8.85814 2.30297 8.72314 2.46931 8.72314H4.88002C5.04636 8.72314 5.18136 8.85814 5.18136 9.02448C5.18136 9.19082 5.04636 9.32582 4.88002 9.32582Z" fill="#333333"></path><path d="M4.87835 12.3395H1.26228C1.09594 12.3395 0.960938 12.2045 0.960938 12.0382V7.81941C0.960938 7.65307 1.09594 7.51807 1.26228 7.51807H4.87835C5.04469 7.51807 5.17969 7.65307 5.17969 7.81941V12.0382C5.17969 12.2045 5.04469 12.3395 4.87835 12.3395ZM1.56362 11.7368H4.57701V8.12075H1.56362V11.7368Z" fill="#333333"></path><path d="M5.48081 18.9688C4.72927 18.9688 4.02956 18.5656 3.65409 17.9159C3.57032 17.7719 3.61974 17.5875 3.76378 17.5043C3.90842 17.4205 4.09224 17.47 4.17541 17.614C4.4436 18.0781 4.94382 18.3661 5.48081 18.3661C6.3113 18.3661 6.9875 17.6899 6.9875 16.8594C6.9875 16.6931 7.1225 16.5581 7.28884 16.5581C7.45518 16.5581 7.59018 16.6931 7.59018 16.8594C7.59018 18.0226 6.64398 18.9688 5.48081 18.9688Z" fill="#333333"></path><path d="M16.932 18.9689C16.1822 18.9689 15.5054 18.5856 15.1209 17.9432C15.0353 17.8003 15.0823 17.6153 15.2246 17.5297C15.368 17.4448 15.5524 17.4912 15.638 17.6334C15.9128 18.0926 16.3962 18.3663 16.932 18.3663C17.7624 18.3663 18.4386 17.6901 18.4386 16.8596C18.4386 16.4088 18.2404 15.9857 17.8944 15.6994C17.7667 15.5933 17.7486 15.4035 17.8553 15.2751C17.9613 15.148 18.1512 15.1293 18.2795 15.2359C18.7635 15.6367 19.0413 16.2292 19.0413 16.8596C19.0413 18.0227 18.0951 18.9689 16.932 18.9689Z" fill="#333333"></path><path d="M11.5089 17.161H9.09821C8.93188 17.161 8.79688 17.026 8.79688 16.8597C8.79688 16.6933 8.93188 16.5583 9.09821 16.5583H11.5089C11.6753 16.5583 11.8103 16.6933 11.8103 16.8597C11.8103 17.026 11.6753 17.161 11.5089 17.161Z" fill="#333333"></path><path d="M6.68862 15.3529H4.2779C4.11156 15.3529 3.97656 15.2179 3.97656 15.0516C3.97656 14.8852 4.11156 14.7502 4.2779 14.7502H6.68862C6.85496 14.7502 6.98996 14.8852 6.98996 15.0516C6.98996 15.2179 6.85496 15.3529 6.68862 15.3529Z" fill="#333333"></path><path d="M15.6652 17.1606H14.5201C14.3537 17.1606 14.2188 17.0256 14.2188 16.8593C14.2188 15.364 15.4356 14.1472 16.9308 14.1472C17.5919 14.1472 18.2278 14.3883 18.722 14.8252C18.7846 14.8813 18.822 14.9608 18.8232 15.0452C18.8244 15.1296 18.7907 15.2103 18.7298 15.2688L17.5365 16.4079C17.0315 16.8936 16.3661 17.1606 15.6652 17.1606ZM14.8431 16.5579H15.6652C16.21 16.5579 16.7271 16.35 17.12 15.9727L18.0578 15.0778C17.7233 14.8644 17.3328 14.7499 16.9308 14.7499C15.8701 14.7499 14.9896 15.537 14.8431 16.5579Z" fill="#333333"></path><path d="M6.68638 12.3395H1.26228C1.09594 12.3395 0.960938 12.2045 0.960938 12.0382C0.960938 11.8718 1.09594 11.7368 1.26228 11.7368H6.68638C6.85272 11.7368 6.98772 11.8718 6.98772 12.0382C6.98772 12.2045 6.85272 12.3395 6.68638 12.3395Z" fill="#333333"></path><path d="M16.3309 9.326H16.0296C15.3648 9.326 14.8242 8.78539 14.8242 8.12064C14.8242 7.45589 15.3648 6.91528 16.0296 6.91528H16.3309C16.8293 6.91528 17.2349 7.32089 17.2349 7.8193V8.42198C17.2349 8.92039 16.8293 9.326 16.3309 9.326ZM16.0296 7.51796C15.6975 7.51796 15.4269 7.78856 15.4269 8.12064C15.4269 8.45272 15.6975 8.72332 16.0296 8.72332H16.3309C16.4973 8.72332 16.6323 8.58832 16.6323 8.42198V7.8193C16.6323 7.65296 16.4973 7.51796 16.3309 7.51796H16.0296Z" fill="#333333"></path><path d="M12.7137 17.1607H11.5084C11.342 17.1607 11.207 17.0257 11.207 16.8594C11.207 16.693 11.342 16.558 11.5084 16.558H12.7137C13.2121 16.558 13.6177 16.1524 13.6177 15.654V10.8326C13.6177 10.6662 13.7527 10.5312 13.9191 10.5312C14.0854 10.5312 14.2204 10.6662 14.2204 10.8326V15.654C14.2204 16.4845 13.5442 17.1607 12.7137 17.1607Z" fill="#333333"></path><path d="M15.989 14.9409C15.8426 14.9409 15.7142 14.8342 15.6913 14.686L15.0067 10.2641C14.9404 9.81693 14.6005 9.45111 14.1611 9.35287C13.9984 9.31611 13.8965 9.15519 13.9333 8.99307C13.97 8.83035 14.1328 8.72789 14.2931 8.76526C14.9735 8.91774 15.4996 9.48425 15.6027 10.1737L16.2867 14.5938C16.3121 14.7583 16.1994 14.912 16.0354 14.9379C16.0198 14.9397 16.0041 14.9409 15.989 14.9409Z" fill="#333333"></path></g><defs><clipPath id="clip0_1519_80"><rect fill="white" height="19.2857" transform="translate(0.359375 0.285645)" width="19.2857"></rect></clipPath></defs></svg> Delivery
										</span>
									</li>`;
                        }

                        if (result.outlet[i]['onlineOrdersSelfPickup'] == 1) {
                            outlets += `	<li>
										<span>
											<svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1519_156)"><path d="M19.1841 18.1902L18.4872 6.61359C18.4717 6.35516 18.4218 6.09969 18.3389 5.8543L17.4763 3.30187C18.1279 3.06277 18.5941 2.43617 18.5941 1.7027C18.5941 0.763828 17.8302 0 16.8914 0H3.11035C2.17148 0 1.40765 0.763828 1.40765 1.7027C1.40765 2.43617 1.87382 3.06277 2.52543 3.30187L1.66285 5.8543C1.57996 6.09965 1.53004 6.35512 1.51449 6.61359L1.28906 10.3582C1.27933 10.5197 1.40238 10.6585 1.5639 10.6682C1.56988 10.6686 1.57586 10.6687 1.58179 10.6687C1.73558 10.6687 1.86461 10.5489 1.87394 10.3934L2.09937 6.64883C2.11179 6.44223 2.15172 6.23805 2.218 6.04191L3.10902 3.40535C3.10949 3.40535 3.10992 3.40539 3.11039 3.40539H7.92093V6.72305C7.92093 6.90719 8.02218 7.07504 8.18515 7.16105C8.34793 7.24695 8.54332 7.2359 8.69515 7.13215C8.75906 7.08848 8.81121 7.04133 8.85718 6.99973C8.96332 6.90375 9.00195 6.87336 9.10746 6.87336C9.21296 6.87336 9.25156 6.90371 9.35773 6.99973C9.48 7.11031 9.6648 7.27746 10.0011 7.27746C10.3373 7.27746 10.522 7.11031 10.6443 6.99973C10.7504 6.90375 10.789 6.8734 10.8945 6.8734C11 6.8734 11.0385 6.90375 11.1446 6.99973C11.1906 7.04129 11.2427 7.08844 11.3066 7.13211C11.4584 7.2359 11.6538 7.24695 11.8166 7.16109C11.9796 7.07508 12.0809 6.90723 12.0809 6.72305V3.40539H13.6203C13.7821 3.40539 13.9133 3.27422 13.9133 3.11242C13.9133 2.95063 13.7821 2.81945 13.6203 2.81945H12.0809V0.585938H16.8914C17.5072 0.585938 18.0082 1.08691 18.0082 1.7027C18.0082 2.31848 17.5072 2.81945 16.8914 2.81945H14.8971C14.7353 2.81945 14.6042 2.95063 14.6042 3.11242C14.6042 3.27422 14.7353 3.40539 14.8971 3.40539H16.8914C16.8919 3.40539 16.8923 3.40535 16.8928 3.40535L17.7838 6.04187C17.8501 6.23801 17.89 6.44223 17.9024 6.64879L18.5993 18.2254C18.618 18.5371 18.5104 18.8341 18.2963 19.0614C18.0822 19.2888 17.7923 19.4141 17.48 19.4141H2.52183C2.20949 19.4141 1.91957 19.2888 1.70547 19.0614C1.49132 18.8341 1.38375 18.5371 1.40254 18.2254L1.79711 11.6702C1.80683 11.5087 1.68379 11.3699 1.52226 11.3602C1.36132 11.3506 1.22195 11.4735 1.21222 11.635L0.817653 18.1902C0.789059 18.6648 0.952848 19.117 1.27886 19.4631C1.60488 19.8093 2.04629 20 2.52183 20H17.4799C17.9554 20 18.3968 19.8093 18.7228 19.4631C19.0488 19.1169 19.2126 18.6648 19.1841 18.1902ZM3.11035 2.81945C2.49457 2.81945 1.99359 2.31848 1.99359 1.7027C1.99359 1.08691 2.49457 0.585938 3.11035 0.585938H7.92089V2.81945H3.11035ZM11.4949 6.52684C11.3728 6.41977 11.1936 6.28742 10.8944 6.28742C10.5582 6.28742 10.3735 6.45457 10.2512 6.56516C10.1451 6.66113 10.1065 6.69148 10.001 6.69148C9.89546 6.69148 9.85687 6.66113 9.75074 6.56512C9.62847 6.45453 9.44367 6.28738 9.10746 6.28738C8.8082 6.28738 8.6289 6.4198 8.50687 6.52687V0.585938H11.4949V6.52684Z" fill="#333333"></path><path d="M10.0009 8.94531C9.26359 8.94531 8.66367 9.5452 8.66367 10.2826V10.8236C8.02887 11.0199 7.44066 11.3558 6.94176 11.8149C6.14758 12.5457 5.64488 13.5266 5.51555 14.5904C4.85027 14.7398 4.35156 15.3348 4.35156 16.0445C4.35156 16.8664 5.02023 17.5351 5.84215 17.5351H10.6759C10.8377 17.5351 10.9689 17.4039 10.9689 17.2421C10.9689 17.0803 10.8377 16.9491 10.6759 16.9491H5.84215C5.34332 16.9491 4.9375 16.5433 4.9375 16.0445C4.9375 15.5457 5.34332 15.1398 5.84215 15.1398H14.1597C14.6586 15.1398 15.0644 15.5457 15.0644 16.0445C15.0644 16.5433 14.6586 16.9491 14.1597 16.9491H11.9527C11.7909 16.9491 11.6598 17.0803 11.6598 17.2421C11.6598 17.4039 11.7909 17.5351 11.9527 17.5351H14.1597C14.9816 17.5351 15.6503 16.8664 15.6503 16.0445C15.6503 15.3348 15.1517 14.7398 14.4865 14.5904C14.356 13.5171 13.8444 12.5277 13.0394 11.796C12.5452 11.3468 11.9643 11.0173 11.3382 10.8237V10.2826C11.3382 9.5452 10.7383 8.94531 10.0009 8.94531ZM9.24961 10.2826C9.24961 9.86832 9.58664 9.53125 10.0009 9.53125C10.4152 9.53125 10.7523 9.86832 10.7523 10.2826V10.6847C10.5057 10.6433 10.2546 10.622 10.0009 10.622C9.74723 10.622 9.49609 10.6432 9.24961 10.6846V10.2826ZM13.8904 14.5539H6.11234C6.24469 13.67 6.67406 12.8575 7.33855 12.2461C8.06605 11.5766 9.0116 11.2079 10.001 11.2079C10.9814 11.2079 11.9205 11.5708 12.6454 12.2296C13.3191 12.842 13.7567 13.6616 13.8904 14.5539Z" fill="#333333"></path></g><defs><clipPath id="clip0_1519_156"><rect fill="white" height="20" width="20"></rect></clipPath></defs></svg> PickUp
										</span>
									</li>`;
                        }
                        if(result.outlet[i]['dineInOrders']==1){
                            outlets+=`	<li>
										<span>
											<svg fill="none" viewBox="0 0 25 15" xmlns="http://www.w3.org/2000/svg"><path d="M4.79297 5.41211H12.2717" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M4.02734 4.26048C4.02734 4.26048 4.02734 3.87695 3.64382 3.87695C3.2603 3.87695 1.91797 3.87695 1.91797 4.644C1.91797 5.41104 4.02734 5.41104 4.02734 5.41104V4.26048Z" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M19.7521 5.41211H12.2734" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M20.5195 4.26048C20.5195 4.26048 20.5195 3.87695 20.9031 3.87695C21.2866 3.87695 22.6289 3.87695 22.6289 4.644C22.6289 5.41104 20.5195 5.41104 20.5195 5.41104V4.26048Z" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M12.2713 0.68162C11.5895 0.68162 7.45811 1.0972 7.09376 1.55743C6.44178 2.45871 4.79263 5.41183 4.79263 5.41183C4.79263 5.41183 3.64206 5.41183 3.64206 6.37064C3.64206 6.37064 2.87501 6.5624 2.87501 7.13769V11.9317C2.87501 11.9317 2.85584 13.4658 4.21734 13.4658H5.71308" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M7.32422 13.4657H20.3256C21.6871 13.4657 21.668 11.9316 21.668 11.9316V7.13761C21.668 6.56233 20.9009 6.37057 20.9009 6.37057C20.9009 5.41176 19.7504 5.41176 19.7504 5.41176C19.7504 5.41176 18.1396 2.47781 17.4684 1.59571C17.104 1.1163 12.9539 0.681641 12.2721 0.681641" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M12.271 8.09659C12.6946 8.09659 13.038 7.75317 13.038 7.32955C13.038 6.90592 12.6946 6.5625 12.271 6.5625C11.8473 6.5625 11.5039 6.90592 11.5039 7.32955C11.5039 7.75317 11.8473 8.09659 12.271 8.09659Z" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M2.875 11.7402H21.6676" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M6.32812 5.41211L6.90341 7.71325L6.13636 8.48029H4.21875V5.60387" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M6.13672 8.48022C6.13672 8.48022 6.13672 9.24727 6.90376 9.24727H12.2731" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M18.2159 5.41211L17.6406 7.71325L18.4077 8.48029H20.3253V5.60387" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M18.4098 8.48047C18.4098 8.48047 18.4098 9.24751 17.6428 9.24751C16.7798 9.24751 12.2734 9.24751 12.2734 9.24751" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M6.52095 14.4247C6.94458 14.4247 7.288 14.0813 7.288 13.6577C7.288 13.234 6.94458 12.8906 6.52095 12.8906C6.09732 12.8906 5.75391 13.234 5.75391 13.6577C5.75391 14.0813 6.09732 14.4247 6.52095 14.4247Z" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M2.875 11.9316V14.041C2.875 14.041 2.875 14.6163 3.45028 14.6163C4.02557 14.6163 6.71023 14.6163 6.71023 14.6163C6.71023 14.6163 7.28551 14.6163 7.28551 14.041C7.28551 13.4657 7.28551 13.4657 7.28551 13.4657" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path><path d="M21.6683 11.9316V14.041C21.6683 14.041 21.6683 14.6163 21.093 14.6163C20.5178 14.6163 17.8331 14.6163 17.8331 14.6163C17.8331 14.6163 17.2578 14.6163 17.2578 14.041C17.2578 13.4657 17.2578 13.4657 17.2578 13.4657" stroke="#333333" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="0.6"></path></svg> Dine-in
										</span>
									</li>`;
                        }
                        if(result.outlet[i]['inCarOrders']==1){
                            outlets+=`	<li>
										<span>
											<svg fill="none" viewBox="0 0 24 17" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1519_184)"><path d="M15.6836 6.39403L15.6835 6.39411L15.6863 6.39403C16.9248 6.36011 16.9248 4.51421 15.6863 4.48029L15.6863 4.48022L15.6836 4.48029C14.4451 4.51421 14.4451 6.36011 15.6836 6.39403ZM16.0001 5.73547C15.9315 5.81437 15.8278 5.86932 15.6849 5.8716C15.5422 5.86932 15.4384 5.81415 15.3698 5.73489C15.3002 5.65458 15.2643 5.54669 15.2643 5.43716C15.2643 5.32763 15.3002 5.21975 15.3698 5.13943C15.4384 5.06021 15.5421 5.00505 15.6847 5.00273C15.8275 5.00609 15.9313 5.06181 16 5.14132C16.0697 5.2219 16.1055 5.32968 16.1055 5.43888C16.1055 5.54809 16.0697 5.65551 16.0001 5.73547Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M5.14056 17.286H19.8292C20.3857 17.286 20.8361 16.8266 20.8361 16.2625V15.5003C20.8361 15.3587 20.7198 15.2391 20.5785 15.2391H4.39124C4.24997 15.2391 4.13359 15.3587 4.13359 15.5003V16.2625C4.13359 16.8266 4.58401 17.286 5.14056 17.286ZM4.64888 16.2625V15.7615H20.3208V16.2625C20.3208 16.5388 20.0987 16.7636 19.8292 16.7636H5.14056C4.87106 16.7636 4.64888 16.5388 4.64888 16.2625Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M11.5578 8.67245C11.2915 8.64949 11.2915 8.28214 11.2734 8.07092C11.2734 7.39133 11.8196 6.83572 12.4877 6.83572C13.3318 6.81735 13.9457 7.75408 13.6117 8.53929C13.5756 8.62653 13.4898 8.68163 13.3905 8.66786C12.7856 8.58521 12.1627 8.59439 11.5578 8.67245ZM12.4877 8.18572C12.7495 8.18572 13.0113 8.19949 13.2731 8.22704C13.4402 6.94592 11.5353 6.94592 11.7068 8.22704C11.9641 8.20408 12.2259 8.18572 12.4877 8.18572Z" fill="#333333"></path><path d="M5.3165 14.4771L5.3165 14.4771L5.3164 14.4777C5.29417 14.6191 5.39331 14.7559 5.53479 14.7738C5.67551 14.7961 5.80867 14.6939 5.82608 14.5523C7.1954 6.34206 18.6727 6.94555 19.2023 15.2391H6.39951C6.31753 15.2391 6.25273 15.2716 6.20915 15.3226C6.16648 15.3725 6.14638 15.4374 6.14638 15.5003C6.14638 15.5632 6.16648 15.6281 6.20915 15.678C6.25273 15.729 6.31753 15.7615 6.39951 15.7615H19.4631C19.6095 15.7615 19.7207 15.6412 19.7207 15.5003L19.7207 15.4987C19.4344 6.36619 6.84352 5.48532 5.3165 14.4771Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M1.51649 14.2237C1.51649 14.8291 2.00301 15.3252 2.60019 15.3252C3.20189 15.3252 3.68842 14.8291 3.68842 14.2191V8.16772C3.69097 8.06634 3.63232 7.98408 3.55574 7.94096C3.47929 7.89791 3.37901 7.89061 3.29543 7.94589C2.86019 8.21565 2.34414 8.21978 1.90964 7.94599C1.82602 7.8906 1.72567 7.89788 1.64916 7.94096C1.57258 7.98408 1.51393 8.06634 1.51649 8.16772V14.2237ZM2.03177 14.2191V8.57858C2.39983 8.70572 2.80056 8.70572 3.16861 8.57858V14.2191C3.16861 14.5369 2.91461 14.7982 2.60019 14.7982C2.28982 14.7982 2.03177 14.541 2.03177 14.2191Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M2.59772 8.67165L2.59771 8.67182L2.60179 8.67166C3.30828 8.64343 3.83913 8.30241 4.19194 7.80673C4.54385 7.31232 4.71834 6.66495 4.71834 6.01985C4.71834 5.37474 4.54384 4.7271 4.19196 4.23213C3.83917 3.73589 3.30836 3.394 2.60188 3.36459L2.60188 3.36443L2.5978 3.36459C1.89131 3.39282 1.36046 3.73384 1.00765 4.22952C0.655746 4.72393 0.48125 5.37129 0.48125 6.0164C0.48125 6.66151 0.655747 7.30915 1.00764 7.80412C1.36042 8.30036 1.89123 8.64225 2.59772 8.67165ZM3.80007 7.46824C3.53212 7.86268 3.13266 8.12981 2.5998 8.14922C2.06811 8.12982 1.6695 7.86273 1.40209 7.46828C1.13348 7.07208 0.997667 6.54732 0.997667 6.01985C0.997667 5.49237 1.13348 4.96731 1.4021 4.57052C1.66953 4.1755 2.06815 3.90758 2.5998 3.88704C3.13262 3.90758 3.53209 4.17555 3.80005 4.57056C4.06922 4.96735 4.20531 5.49239 4.20531 6.01985C4.20531 6.5473 4.06922 7.07205 3.80007 7.46824Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M23.4534 10.1001H23.4535L23.4532 10.0961C23.4481 10.0331 23.4307 9.98066 23.4012 9.93981C23.3715 9.89856 23.3316 9.87205 23.287 9.8579C23.2033 9.83133 23.1051 9.84854 23.0184 9.88483H22.2162C22.1342 9.88483 22.0694 9.91736 22.0258 9.96835C21.9831 10.0183 21.963 10.0831 21.963 10.1461C21.963 10.209 21.9831 10.2738 22.0258 10.3238C22.0694 10.3747 22.1342 10.4073 22.2162 10.4073H22.9381V14.2236C22.9381 14.5414 22.6841 14.8027 22.3696 14.8027C22.0593 14.8027 21.8012 14.5455 21.8012 14.2236V10.9129C21.8012 10.8304 21.7696 10.7648 21.7195 10.7205C21.6702 10.6769 21.6061 10.6563 21.5436 10.6563C21.4811 10.6563 21.4169 10.6769 21.3677 10.7205C21.3175 10.7648 21.2859 10.8304 21.2859 10.9129V14.2236C21.2859 14.829 21.7725 15.3251 22.3696 15.3251C22.9668 15.3251 23.4534 14.829 23.4534 14.2236V10.1001Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path><path d="M21.7057 10.4028H23.0284C23.3544 10.4028 23.6202 10.1319 23.6155 9.80145V3.62578C23.6155 3.48417 23.4991 3.36455 23.3579 3.36455C22.9706 3.36455 22.6339 3.49618 22.3487 3.76327C22.0647 4.02921 21.8337 4.42738 21.6517 4.95782C21.2878 6.01811 21.1141 7.62182 21.1141 9.8018C21.1141 10.1317 21.3794 10.4028 21.7057 10.4028ZM21.6339 9.8018C21.6339 7.94355 21.7659 6.52058 22.0266 5.53499C22.2785 4.58285 22.6451 4.05821 23.1093 3.92314V9.8018C23.1093 9.84387 23.0722 9.88037 23.0329 9.88037H21.7103C21.6676 9.88037 21.6339 9.84505 21.6339 9.8018Z" fill="#333333" stroke="#333333" stroke-width="0.1"></path></g><defs><clipPath id="clip0_1519_184"><rect fill="white" height="17" width="24"></rect></clipPath></defs></svg> In Car
										</span>
									</li>`;
                        }
                        outlets+=`	</ul>
							</div>
							<p class="delivery-links-tp"><span><svg fill="none" viewBox="0 0 20 25" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_994_558)"><g clip-path="url(#clip1_994_558)"><path d="M16.7409 10.3249C16.7409 11.538 16.1121 13.2009 15.084 15.0468C14.0778 16.8534 12.7748 18.6878 11.6067 20.2006L13.2288 21.4529C14.4273 19.9007 15.7983 17.976 16.8743 16.0439C17.9286 14.1511 18.7902 12.0956 18.7902 10.3249H16.7409ZM7.53015 20.2006C6.36206 18.6878 5.05908 16.8534 4.0529 15.0468C3.02484 13.2009 2.39596 11.538 2.39596 10.3249H0.34668C0.34668 12.0956 1.20837 14.1511 2.26255 16.0439C3.3386 17.976 4.70954 19.9007 5.90811 21.4529L7.53015 20.2006ZM2.39596 10.3249C2.39596 5.85562 5.69096 2.39108 9.56844 2.39108V0.341797C4.39165 0.341797 0.34668 4.89896 0.34668 10.3249H2.39596ZM9.56844 2.39108C13.4459 2.39108 16.7409 5.85562 16.7409 10.3249H18.7902C18.7902 4.89896 14.7452 0.341797 9.56844 0.341797V2.39108ZM11.6067 20.2006C10.9671 21.029 10.564 21.5454 10.2093 21.8726C9.89761 22.1602 9.73043 22.2008 9.56844 22.2008V24.2501C10.4037 24.2501 11.0438 23.8909 11.5988 23.3789C12.1107 22.9066 12.6337 22.2236 13.2288 21.4529L11.6067 20.2006ZM5.90811 21.4529C6.50317 22.2236 7.02617 22.9066 7.53807 23.3789C8.09311 23.8909 8.73323 24.2501 9.56844 24.2501V22.2008C9.40646 22.2008 9.23927 22.1602 8.92763 21.8726C8.57288 21.5454 8.16982 21.029 7.53015 20.2006L5.90811 21.4529ZM5.46988 10.7321C5.46988 13.0072 7.28997 14.8787 9.56844 14.8787V12.8294C8.45156 12.8294 7.51916 11.9054 7.51916 10.7321H5.46988ZM9.56844 14.8787C11.8469 14.8787 13.667 13.0072 13.667 10.7321H11.6177C11.6177 11.9054 10.6853 12.8294 9.56844 12.8294V14.8787ZM13.667 10.7321C13.667 8.45709 11.8469 6.5856 9.56844 6.5856V8.63488C10.6853 8.63488 11.6177 9.55884 11.6177 10.7321H13.667ZM9.56844 6.5856C7.28997 6.5856 5.46988 8.45709 5.46988 10.7321H7.51916C7.51916 9.55884 8.45156 8.63488 9.56844 8.63488V6.5856Z" fill="var(--main-bg-color)"></path></g></g><defs><clipPath id="clip0_994_558"><rect fill="white" height="24.5914" width="19.1373"></rect></clipPath><clipPath id="clip1_994_558"><rect fill="white" height="24.5914" width="19.1266" transform="translate(0.00585938)"></rect></clipPath></defs></svg></span> <span><a href="#">${result.outlet[i]['locality']}, ${result.outlet[i]['city']}</a></span></p>
							
							<p class="delivery-links-tp"><span><svg fill="none" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_994_563)"><path d="M10.4167 7.24314C10.4167 6.7477 10.015 6.34608 9.51961 6.34608C9.02418 6.34608 8.62255 6.7477 8.62255 7.24314H10.4167ZM12.0314 12.4634C12.5268 12.4634 12.9284 12.0617 12.9284 11.5663C12.9284 11.0709 12.5268 10.6693 12.0314 10.6693V12.4634ZM1.41296 2.44454C1.03102 2.76009 0.977193 3.32553 1.29274 3.70747C1.60829 4.08941 2.17372 4.14324 2.55567 3.82769L1.41296 2.44454ZM4.64881 2.09842C5.03075 1.78287 5.08457 1.21744 4.76902 0.835498C4.45347 0.453553 3.88804 0.399728 3.5061 0.715276L4.64881 2.09842ZM16.4835 3.82769C16.8654 4.14324 17.4309 4.08941 17.7465 3.70747C18.062 3.32553 18.0082 2.76009 17.6263 2.44454L16.4835 3.82769ZM15.5331 0.715276C15.1512 0.399728 14.5857 0.453553 14.2702 0.835498C13.9547 1.21744 14.0085 1.78287 14.3904 2.09842L15.5331 0.715276ZM10.7755 12.4634C11.2709 12.4634 11.6725 12.0617 11.6725 11.5663C11.6725 11.0709 11.2709 10.6693 10.7755 10.6693V12.4634ZM8.62255 7.24314V10.3104H10.4167V7.24314H8.62255ZM16.9951 10.7017C16.9951 15.0089 13.6212 18.451 9.51961 18.451V20.2451C14.6661 20.2451 18.7892 15.9449 18.7892 10.7017H16.9951ZM9.51961 18.451C5.418 18.451 2.04412 15.0089 2.04412 10.7017H0.25C0.25 15.9449 4.37316 20.2451 9.51961 20.2451V18.451ZM2.04412 10.7017C2.04412 6.39444 5.418 2.95239 9.51961 2.95239V1.15827C4.37316 1.15827 0.25 5.45842 0.25 10.7017H2.04412ZM9.51961 2.95239C13.6212 2.95239 16.9951 6.39444 16.9951 10.7017H18.7892C18.7892 5.45842 14.6661 1.15827 9.51961 1.15827V2.95239ZM2.55567 3.82769L4.64881 2.09842L3.5061 0.715276L1.41296 2.44454L2.55567 3.82769ZM17.6263 2.44454L15.5331 0.715276L14.3904 2.09842L16.4835 3.82769L17.6263 2.44454ZM10.7755 12.4634H12.0314V10.6693H10.7755V12.4634ZM8.62255 10.3104C8.62255 11.4995 9.58646 12.4634 10.7755 12.4634V10.6693C10.5773 10.6693 10.4167 10.5086 10.4167 10.3104H8.62255Z" fill="var(--main-bg-color)"></path></g><defs><clipPath id="clip0_994_563"><rect fill="white" height="20" width="21"></rect></clipPath></defs></svg></span> <span><b>Open from</b> ${startTime12} to ${endTime12}</span></p></div> </div> <a onclick="openOrderPage('${result.outlet[i]['slug']}')" class="btn btn-primary location-btn location-btn-one btn-next animatebtn mb-0" >Switch to this Outlet</a>`;
                        // outlets += '<div class="nearcardfooter d-flex align-items-center" onclick=\'openOrderPage("' + result.outlet[i]['slug'] + '")\' style="padding: 8px;border-top: 2px solid var(--main-bg-color);color: var(--main-bg-color);font-weight: 600;">' +
                        //     '<div class="row w-100 m-0">' +
                        //     '<div class="col-6 pl-0 pr-2"> Switch to this outlet </div>' +
                        //     '<div class="col-6 d-flex justify-content-end align-items-center pr-0 pl-2">' +
                        //     '<i class="las la-arrow-right"></i>' +
                        //     '</div>' +
                        //     '</div>' +
                        //     '</div>' +
                        //     '</div>';


                    }

                    $('#outlet_lists').html(outlets);

                } else {
                    $('#nearByOutlet').addClass('d-none');
                    $('#error_outlet').addClass('d-none');
                    $('#error_outlet_msg').removeClass('d-none');
                }

            }
        });

    } else {
        $('#nearByOutlet').addClass('d-none');
        $('#error_outlet').addClass('d-none');
        $('#error_outlet_msg').removeClass('d-none');
    }
}

function addressTypeSvg(addressType){
    var svgString=``;
    if(addressType==1){
        svgString=`<svg fill="none" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg"><path d="M12.1349 6.45736C12.0471 6.45812 11.9626 6.42471 11.8991 6.36425L11.7036 6.16879L11.1271 5.59227V6.40758V10.8559C11.1271 11.1246 11.0203 11.3823 10.8303 11.5723C10.6404 11.7623 10.3827 11.869 10.114 11.869H8.0877C7.99813 11.869 7.91223 11.8335 7.8489 11.7701C7.78557 11.7068 7.74999 11.6209 7.74999 11.5313V9.50506V9.16735H7.41228H6.06143H5.72372V9.50506V11.5313C5.72372 11.6209 5.68814 11.7068 5.62481 11.7701C5.56148 11.8335 5.47558 11.869 5.38601 11.869H3.35975C3.09105 11.869 2.83336 11.7623 2.64336 11.5723C2.45336 11.3823 2.34662 11.1246 2.34662 10.8559V6.40758V5.59228L1.77011 6.16879L1.57464 6.36425C1.51114 6.42471 1.42659 6.45812 1.33885 6.45736C1.25031 6.45659 1.1656 6.42107 1.10299 6.35846C1.04038 6.29584 1.00486 6.21114 1.00409 6.12259C1.00333 6.03486 1.03674 5.9503 1.09719 5.8868L2.4456 4.53839L6.49809 0.485904C6.49811 0.485892 6.49812 0.48588 6.49813 0.485868C6.56146 0.422579 6.64732 0.387027 6.73685 0.387027C6.82639 0.387027 6.91225 0.422579 6.97558 0.485868C6.97559 0.48588 6.9756 0.485892 6.97562 0.485904L11.0281 4.53839L12.3765 5.8868C12.437 5.9503 12.4704 6.03486 12.4696 6.12259C12.4688 6.21114 12.4333 6.29584 12.3707 6.35846C12.3081 6.42107 12.2234 6.45659 12.1349 6.45736Z" fill="var(--main-bg-color)" stroke="black" stroke-width="0.675421"></path></svg>`;
    }else if(addressType==2){
        svgString=`<svg fill="none" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M9.23325 14.4379V5.20465C9.23325 3.33954 9.23325 2.40633 8.65354 1.82727C8.07448 1.24756 7.14127 1.24756 5.27616 1.24756C3.41105 1.24756 2.47783 1.24756 1.89878 1.82727C1.31906 2.40633 1.31906 3.33954 1.31906 5.20465V10.4808C1.31906 12.3459 1.31906 13.2791 1.89878 13.8582C2.47783 14.4379 3.41105 14.4379 5.27616 14.4379H9.23325ZM4.28688 7.1832H3.62737H4.28688ZM6.92495 7.1832H6.26543H6.92495ZM4.28688 4.54514H3.62737H4.28688ZM4.28688 9.82127H3.62737H4.28688ZM6.92495 4.54514H6.26543H6.92495ZM6.92495 9.82127H6.26543H6.92495ZM12.2011 9.82127H11.5416H12.2011ZM12.2011 7.1832H11.5416H12.2011ZM11.8713 5.20465H9.23325V14.4379H11.8713C13.1152 14.4379 13.7364 14.4379 14.1229 14.0514C14.5094 13.6649 14.5094 13.0437 14.5094 11.7998V7.84272C14.5094 6.59887 14.5094 5.97761 14.1229 5.59113C13.7364 5.20466 13.1152 5.20465 11.8713 5.20465Z" fill=" var(--main-bg-color)"></path><path d="M9.23325 14.4379V5.20465M9.23325 14.4379H5.27616C3.41105 14.4379 2.47783 14.4379 1.89878 13.8582C1.31906 13.2791 1.31906 12.3459 1.31906 10.4808V5.20465C1.31906 3.33954 1.31906 2.40633 1.89878 1.82727C2.47783 1.24756 3.41105 1.24756 5.27616 1.24756C7.14127 1.24756 8.07448 1.24756 8.65354 1.82727C9.23325 2.40633 9.23325 3.33954 9.23325 5.20465M9.23325 14.4379H11.8713C13.1152 14.4379 13.7364 14.4379 14.1229 14.0514C14.5094 13.6649 14.5094 13.0437 14.5094 11.7998V7.84272C14.5094 6.59887 14.5094 5.97761 14.1229 5.59113C13.7364 5.20466 13.1152 5.20465 11.8713 5.20465H9.23325M4.28688 7.1832H3.62737M6.92495 7.1832H6.26543M4.28688 4.54514H3.62737M4.28688 9.82127H3.62737M6.92495 4.54514H6.26543M6.92495 9.82127H6.26543M12.2011 9.82127H11.5416M12.2011 7.1832H11.5416" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.659516"></path></svg>`;
    }else if(addressType==3){
        svgString=`<svg fill="none" viewBox="0 0 12 15" xmlns="http://www.w3.org/2000/svg"><path d="M5.28052 13.8841L5.28065 13.884L5.27183 13.8766L5.27178 13.8765L5.27177 13.8765L5.27134 13.8762L5.26912 13.8743L5.2594 13.866L5.2197 13.8318C5.18452 13.8013 5.13235 13.7555 5.06561 13.6955C4.93211 13.5754 4.74048 13.3986 4.51011 13.1733C4.04897 12.7223 3.43464 12.0791 2.82112 11.31C1.58211 9.75675 0.396775 7.75202 0.396775 5.80644C0.396775 4.43888 0.941306 3.12717 1.91083 2.15992C2.88038 1.19264 4.19553 0.649094 5.56702 0.649094C6.9385 0.649094 8.25365 1.19264 9.2232 2.15992C10.1927 3.12717 10.7373 4.43888 10.7373 5.80644C10.7373 7.75202 9.55192 9.75675 8.31292 11.31C7.6994 12.0791 7.08507 12.7223 6.62392 13.1733C6.39355 13.3986 6.20192 13.5754 6.06842 13.6955C6.00168 13.7555 5.94951 13.8013 5.91433 13.8318L5.87463 13.866L5.86491 13.8743L5.86269 13.8762L5.86226 13.8765L5.86225 13.8765L5.8622 13.8766L5.85668 13.8812L5.85131 13.8862C5.70165 14.0236 5.43682 14.0251 5.28052 13.8841ZM5.56702 8.5368C5.92621 8.5368 6.2819 8.46622 6.61379 8.32907C6.94568 8.19192 7.2473 7.99087 7.50139 7.73737C7.75549 7.48387 7.95709 7.18288 8.09465 6.85156C8.23221 6.52024 8.30302 6.1651 8.30302 5.80644C8.30302 5.44777 8.23221 5.09264 8.09465 4.76132C7.95709 4.43 7.75549 4.12901 7.50139 3.8755C7.2473 3.622 6.94568 3.42096 6.61379 3.28381C6.2819 3.14665 5.92621 3.07607 5.56702 3.07607C4.84163 3.07607 4.1458 3.36355 3.63264 3.8755C3.11945 4.38749 2.83101 5.08205 2.83101 5.80644C2.83101 6.53083 3.11945 7.22539 3.63264 7.73737C4.1458 8.24933 4.84163 8.5368 5.56702 8.5368Z" fill=" var(--main-bg-color)" stroke="black" stroke-width="0.659516"></path></svg>`;
    }else if(addressType==4){
        svgString=`<svg fill="none" viewBox="0 0 12 15" xmlns="http://www.w3.org/2000/svg"><path d="M10.1049 0.376465H1.84582C1.08559 0.376465 0.469299 0.992755 0.469299 1.75299V12.7652C0.469299 13.5254 1.08559 14.1417 1.84582 14.1417H10.1049C10.8652 14.1417 11.4815 13.5254 11.4815 12.7652V1.75299C11.4815 0.992755 10.8652 0.376465 10.1049 0.376465Z" fill=" var(--main-bg-color)" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.66"></path><path d="M4.59887 14.1418V9.61991V14.1418ZM5.97539 6.57091H5.98228H5.97539ZM5.97539 3.81787H5.98228H5.97539ZM7.35192 9.61991V14.1418V9.61991ZM8.04018 10.0122C7.4445 9.56546 6.71999 9.32396 5.97539 9.32396C5.2308 9.32396 4.50629 9.56546 3.91061 10.0122M8.72844 6.57091H8.73532H8.72844ZM8.72844 3.81787H8.73532H8.72844ZM3.22235 6.57091H3.22923H3.22235ZM3.22235 3.81787H3.22923H3.22235Z" fill=" var(--main-bg-color)"></path><path d="M4.59887 14.1418V9.61991M5.97539 6.57091H5.98228M5.97539 3.81787H5.98228M7.35192 9.61991V14.1418M8.04018 10.0122C7.4445 9.56546 6.71999 9.32396 5.97539 9.32396C5.2308 9.32396 4.50629 9.56546 3.91061 10.0122M8.72844 6.57091H8.73532M8.72844 3.81787H8.73532M3.22235 6.57091H3.22923M3.22235 3.81787H3.22923" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.66"></path></svg>`;
    }
    return svgString;
}
function deleteAddressModal(id,actionBit){
    if(actionBit==1){
        $(`#delete-div-${id}`).removeClass("d-none");
        $(`#manage-div-${id}`).addClass('coloring');
    }else{
        $(`#delete-div-${id}`).addClass("d-none");
		$(`#manage-div-${id}`).removeClass("coloring");
	}
}
function deleteAddress(id,businessId){
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];

    // var params = 'mobile='+mobile+'&parentBusinessId=' +  pId   + '&contactMappingId='+contactMappingId+'&businessId='+ pId +'&token='+token+'&action='+action;
    var url =  '/client/deleteDeliveryAddress';
    $.ajax({
        url: url,
        type: "POST",
        data: {
            contactMappingId: contactMappingId,
            token: token,
            businessId: businessId,
            deliveryAddressId : id
        },
        dataType: "json",
        success: function(response) {
            if (response.status == "success") {
                getDeliveryAddress();
                $('#promoapplied').modal('show');
                $('.promors').html("Address deleted successfully!");
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2000);
                $('html').removeClass("coloring");
            } else {
                // alert("Error: " + response.message);
            }
        }
    });
}
function getDeliveryAddress() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    var mobile = userData['mobile'];
    var action = 'close_order';
    // var params = 'mobile='+mobile+'&parentBusinessId=' +  pId   + '&contactMappingId='+contactMappingId+'&businessId='+ pId +'&token='+token+'&action='+action;
    var url = '' + origin +  '/client/getDeliveryAddress/' + pId + '/' + contactMappingId + '/' + token
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",

        success: function(result) {
            var data = "";
            $('.spinner').hide();
            addressRows = result['rows'];
            localityMapping = result['localityMapping'];
            locality_list = result['locality_list'];
            if (result.status == 1) {
                if(result.rows != null && result.rows != ''){
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        let addressType = 'Home';
                        let addressBit=1;
                        var name = result['rows'][i]['name'];
                        if(name.toLowerCase() == 'other' || name.toLowerCase() == 'others'){
                            addressType = 'Other';
                            addressBit=3;
                        }else if(name.toLowerCase() == 'office' || name.toLowerCase() == 'work'){
                            addressType = 'Office';
                            addressBit=2;
                        }else if(name.toLowerCase() == 'hotel' || name.toLowerCase() == 'hotel'){
                            addressType = 'Hotel';
                            addressBit=4;
                        }
                        else{
                            addressType = 'Home';
                            addressBit=1;
                        }
                        data+=`<div class="col-lg-4 col-md-6 margins">
				<div class="manage-addresses" id="manage-div-${result.rows[i]['deliveryAddressId']}">
					<div class="home-ss">
						<span>
							${addressTypeSvg(addressBit)} ${addressType}
						</span>
					</div>
				
					<p>${result.rows[i]['addressLine1'] + ',' + result.rows[i]['addressLine2'] + "," + result.rows[i]['locality']} </p>
					
					<ul class="view-icons">
						<li>
							<a onclick="editAddress(${i})" class="edit"><svg style="width: 100%; max-width: 15px; margin-right: 3px;" fill="none" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg"><path d="M8.12533 3.24951L9.75032 4.87451M7.04199 10.8328H11.3753M2.70866 8.66618L2.16699 10.8328L4.33366 10.2912L10.6094 4.01543C10.8125 3.81227 10.9266 3.53677 10.9266 3.24951C10.9266 2.96225 10.8125 2.68675 10.6094 2.48359L10.5162 2.39043C10.3131 2.18733 10.0376 2.07324 9.75032 2.07324C9.46306 2.07324 9.18756 2.18733 8.98441 2.39043L2.70866 8.66618Z" stroke="var(--main-bg-color)" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.617422"></path></svg> Edit</a>
						</li>
						<li>
							<a onClick="deleteAddressModal(${result.rows[i]['deliveryAddressId']},1)" class="delete"><svg style="width: 100%; max-width: 15px; margin-right: 3px;" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.07701 13.3336C4.77834 13.3336 4.52412 13.2288 4.31434 13.019C4.10456 12.8092 3.99967 12.5552 3.99967 12.257V4.00031H3.33301V3.33365H5.99967V2.82031H9.99967V3.33365H12.6663V4.00031H11.9997V12.257C11.9997 12.5636 11.897 12.8199 11.6917 13.0256C11.4863 13.2314 11.2299 13.3341 10.9223 13.3336H5.07701ZM11.333 4.00031H4.66634V12.257C4.66634 12.3765 4.70479 12.4748 4.78167 12.5516C4.85856 12.6285 4.95701 12.667 5.07701 12.667H10.923C11.0252 12.667 11.1192 12.6243 11.205 12.539C11.2908 12.4536 11.3335 12.3594 11.333 12.2563V4.00031ZM6.53834 11.3336H7.20501V5.33365H6.53834V11.3336ZM8.79434 11.3336H9.46101V5.33365H8.79434V11.3336Z" fill="var(--main-bg-color)"></path></svg> Delete</a>
						</li>
					</ul>
					
					<div class="delete-div d-none" id="delete-div-${result.rows[i]['deliveryAddressId']}">
						<p>Are you sure you want to delete this address?</p>
						<ul class="btns-ul">
							<li>
								<a  class="delete-nw" onClick="deleteAddress(${result.rows[i]['deliveryAddressId']},${result.rows[i]['businessId']})" >Delete</a>
							</li>
							<li>
								<a  onClick="deleteAddressModal(${result.rows[i]['deliveryAddressId']},2)" class="delete-nw cancel delete-nw-cancel">Cancel</a>
							</li>
						</ul>
					</div>
				</div>
			</div>`;
                        // data += '<li><span class="address-status"><span style="display: flex; align-items: center; justify-content: center;"><img src="' + origin +'/assets/wla_new/img/home.png" alt="Home"></span></span><span class="address-text"><b>' + addressType + '</b><br>' + result.rows[i]['addressLine1'] + ',' + result.rows[i]['addressLine2'] + "," + result.rows[i]['locality'] + '</span>';

                        // data += '<span class="address-btn"><button type="button" class="btn btn-primary btn-next" onclick="editAddress(' + i + ')"> Edit</button></span>';
                        // data += '</li>';
                    } 
                    $('#listAddress').html("");
                    $('#listAddress').html(data);
                    $('#noAddressAvailable').hide();
                    $('#listAddress').show();
                } else {
                    $('#noAddressAvailable').show();
                    $('#listAddress').hide();
                }
            }else {
                $('#noAddressAvailable').show();
                $('#listAddress').hide();
            }
            }else {
                    $('#noAddressAvailable').show();
                    $('#listAddress').hide();
                }
         }
    });
}
function getOrderTracking(business_Id, order_Id,outletLat,outletLng){
	
	var userData = JSON.parse(localStorage.getItem('userdata'));
	var contactMappingId = userData['contactMappingId'];
	var token = userData['token'];

	var post_params = {
		businessId: business_Id,
		contactMappingId : contactMappingId,
		orderId: order_Id,
		token : token
	};
	// console.log(post_params);
	
	var url = origin +  '/client/getOrderRiderTracking';

	$.ajax({
		url: url,
		type: "POST",
		data : post_params,
		dataType: "json",
		success: function(result) {

			if(result['status'] == 1){

				if(result?.deatils?.length > 0){
					getDeliveryOtp(business_Id, order_Id);

					let currentTime = new Date();
					let estimatedMinutes = result['est_time'];
                    $('#est_mins').html(estimatedMinutes);
					currentTime.setMinutes(currentTime.getMinutes() + estimatedMinutes);
					let arrivalTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

					$('#estimated_time').html(arrivalTime);

					var riderDetails = result.deatils[0];
					
					$('#estimated_min').html(' (' + result['est_time'] + ' Mins)');
					if(riderDetails['lastname'] != ""){
						$('#rider_name').html(riderDetails['firstName'] + ' ' + riderDetails['lastname']);
					}else{
						$('#rider_name').html(riderDetails['firstName']);
					}
					$('#rider_call').html('<a href="tel:'+ riderDetails['riderMobile'] +'" class="call-button">Call Rider</a>');
					$('.delivery_ordertime').show();
					var riderIcon = origin +'/assets/wla_new/img/icons/rider_new.svg';
					openLeafletMap(parseFloat(riderDetails['riderLat']),parseFloat(riderDetails['riderLong']),parseFloat(riderDetails['deliveryLat']),parseFloat(riderDetails['deliveryLong']),riderIcon,1,outletLat, outletLng);
				}else{
					$('.delivery_ordertime').hide();
				}
				
			}else{
				$('.delivery_ordertime').hide();
			}
		}
	});
}
var map;
var markerLayer;
var outletMarker, customerMarker;

function openMaps(outletLat, outletLng, icon = '', customerLat = null, customerLng = null) {
    // $('#open-map').show();
    // Convert coordinates to numbers
    outletLat = Number(outletLat);
    outletLng = Number(outletLng);
    customerLat = customerLat !== null ? Number(customerLat) : null;
    customerLng = customerLng !== null ? Number(customerLng) : null;

    // Create features array
    var features = [];

    // Create feature for the outlet marker
    var outletMarker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([outletLng, outletLat])),
        name: 'Outlet Marker'
    });
    features.push(outletMarker);

    // Create feature for the customer marker if coordinates are provided
    if (customerLat !== null && customerLng !== null) {
        var customerMarker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([customerLng, customerLat])),
            name: 'Customer Marker'
        });
        features.push(customerMarker);

        // Create shortest path
        var shortestPath = new ol.geom.LineString([
            ol.proj.fromLonLat([outletLng, outletLat]),
            ol.proj.fromLonLat([customerLng, customerLat])
        ]);

        var shortestPathFeature = new ol.Feature({
            geometry: shortestPath,
            name: 'Shortest Path'
        });

        // Create curved (longest) path
        var controlPoint = [
            (outletLng + customerLng) / 2,
            (outletLat + customerLat) / 2 + 0.05// Increase for more curvature
        ];
        
        var curveCoordinates = new ol.geom.LineString([
            ol.proj.fromLonLat([outletLng, outletLat]),
            ol.proj.fromLonLat(controlPoint),
            ol.proj.fromLonLat([customerLng, customerLat])
        ]);

        var curvePathFeature = new ol.Feature({
            geometry: curveCoordinates,
            name: 'Curved Path'
        });

        features.push(shortestPathFeature);
        features.push(curvePathFeature);
    }

    // Create a style for the markers with scaling
    var outletMarkerStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: icon, // Custom path for outlet icon
            imgSize: [50, 50] // Adjust the scale as needed (assuming original size is 50x50)
        })
    });

    var customerMarkerStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            imgSize: [50, 50] // Adjust the scale as needed (assuming original size is 50x50)
        })
    });

    // Create styles for the paths
    var pathStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#000000', // Black color
            width: 3,
            lineDash: [4, 8] // Dotted line pattern
        })
    });

    var curvePathStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 3
        })
    });

    // Set styles for the markers
    outletMarker.setStyle(outletMarkerStyle);
    if (customerMarker) customerMarker.setStyle(customerMarkerStyle);

    // Set styles for the paths
    if (shortestPathFeature) shortestPathFeature.setStyle(pathStyle);
    if (curvePathFeature) curvePathFeature.setStyle(curvePathStyle);

    // Create or update the vector source
    var vectorSource = new ol.source.Vector({
        features: features
    });

    // Create or update the marker layer
    if (!markerLayer) {
        markerLayer = new ol.layer.Vector({
            source: vectorSource
        });
        if (map) {
            map.addLayer(markerLayer);
        }
    } else {
        markerLayer.setSource(vectorSource);
    }

    // Calculate center and zoom
    var centerLatLng = customerLat !== null && customerLng !== null ?
        [(outletLng + customerLng) / 2, (outletLat + customerLat) / 2] :
        [outletLng, outletLat];

    var center = ol.proj.fromLonLat(centerLatLng);
    var zoom = customerLat !== null && customerLng !== null ? 15 : 12;

    // Create or update the map
    if (!map) {
        map = new ol.Map({
            target: 'open-map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                markerLayer // Add the marker layer to the map
            ],
            view: new ol.View({
                center: center,
                zoom: zoom
            }),
            interactions: ol.interaction.defaults({
                dragPan: true,  // Enable drag
                mouseWheelZoom: true,  // Enable scroll zoom
                doubleClickZoom: true,
                shiftDragZoom: true,
                pinchZoom: true
            })
        });
    } else {
        map.getView().setCenter(center);
        map.getView().setZoom(zoom);
    }

    if ($(window).width() <= 767) {
        // setTimeout(()=>{
            // alert('ssasld');
            $('body .class-move-dataset').append($('body .move-data-set'));
            $('body .class-move-map').append($('body .move-data-map'));
        // },200)
        
    }
}
function closeLocality(){
    $('#addAddModal').modal("hide");
}
function getDeliveryOtp(business_Id, order_Id){

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];

    var post_params = {
        businessId: business_Id,
        contactMappingId : contactMappingId,
        orderId: order_Id,
        token : token
    };
    

    var url = origin +  '/client/getDeliveryOTP';

    $.ajax({
        url: url,
        type: "POST",
        data : post_params,
        dataType: "json",
        success: function(response) {
            $('.spinner').hide();
           if(response['status'] == 1 && response['otp'] != ''){
                $('#delivery_otp').html(response['otp']);
                $('#delivery_code_present').show();
           }else{
                $('#delivery_code_unavailable').show();
                
           }
        }
    });

}
function getCurrentLocalityAdd(currLat, currLng) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var businessId=localStorage.getItem('businessId');
    var params = "?lat=" + currLat + "&lng=" + currLng + "&businessId=" + businessId + "&contactId=" + userData['contactId'] + "&contactMappingId=" + userData['contactMappingId'];
    var url = origin + '/maps_mongodb/getGeocodeAddress' + params;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            "token": userData['token']
        },

        success: function(result) {
            // result='{"status":0,"formatted_Address":"MDC Sector 5, Panchkula","locality":"MDC Sector 5","city":"Panchkula","latitude":"30.712773","longitude":"76.8478444"}';
        //    var resultObj= JSON.parse(result);
            if (result['status'] == 1) {
                $('#locality-input').val(result['locality']);
                $('body #locationErrorServiceable').addClass('d-none');
                $('#newAddLocality').val(result['locality']);
                $('#newAddlat').val(result['latitude']);
                $('#newAddlng').val(result['longitude']);
                $('#newAddCity').val(result['city']);
                $('#citynewlabel').val(result['city']);
                $('#mobileBtnSubmitTwo').prop('disabled', false);
            } else {
                $('#locality-input').val('');
                $('#mobileBtnSubmitTwo').prop('disabled', true);
                $('body #locationErrorServiceable').removeClass('d-none');
                // $('#locationErrorServiceable').show();
                $('#newAddLocality').val('');
                $('#newAddCity').val('');
                $('#citynewlabel').val('');
                    
            }

        }
    });
}
function formatDateTime(invoicedAt) {
    // Parse date string correctly
    let dateObj = new Date(invoicedAt.replace(" ", "T")); // Ensures compatibility in JS

    // Extract day, month, and year
    let day = dateObj.getDate();
    let month = dateObj.toLocaleString('en-GB', { month: 'short' }); // "Jan"
    let year = dateObj.getFullYear();

    // Function to get ordinal suffix (st, nd, rd, th)
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th'; // Covers 11th to 20th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    let formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`; // "7th Jan, 2025"

    // Extract and format time in 12-hour format
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes().toString().padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    let formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}
function getOrderDetailOverview(orderId, orderCheckout = '') {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    var mobile = userData['mobile'];
    var action = 'close_order';
    var params = 'contactMappingId=' + contactMappingId + '&businessId=' + pId + '&token=' + token + '&isNew=1&action=view&orderId=' + orderId;
    var url = origin +  '/client/cart?' + params;
   
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",

        success: function(result) {
            $('.spinner').hide();

            if(result?.status !=0){
            var data = "";
            var oDetails = result.rows.orderDetails[0];
            var oIDetails = result.rows.orderItemDetails;
            // console.log(oDetails);

            icon = currency;
            $('#businessDetails').html(oDetails.businessName + ',' + oDetails.store_locality + ',' + oDetails.store_city);
            $('#iDate').html(oDetails.invoice_date);
            $('#iTime').html(oDetails.invoice_time);
            data += '<div class="d-flex justify-content-between align-items-center help-desk">';
            data+='<h1 class="heading-top">';
            if (orderCheckout == 1 || oDetails.cart_type==2) {
                data += '<a href="' + origin +'" style="line-height: initial;">';
            } else {
                data += '<a href="javascript:history.back();" style="line-height: initial;">';
            }
            var itemCount = oIDetails.length > 1 ? oIDetails.length + ' items' : oIDetails.length + ' item';
            if(oDetails.categoryId == 4){
                data += '<img src="' + origin +'/assets/wla_new/img/arrow-left.png" alt="Arrow Left" class="back-btn"></a>Reservation #' + orderId + '</h1><img src="' + origin +'/assets/wla_new/img/your-orders.png" alt="Your Orders"/></div>' + '<div class="row m-0"><div class="col-10 pl-0"><ul class="outlet-discription p-0" style="flex-wrap: wrap;"><li class="outlet-imgs-bg"><img src="https://www.uengage.in/images/addo/logos/' + oDetails.logo + '" alt="Logo" class="tp-nw-icon" width="45" height="45"></li><li class="outlet-disc-bg" style="flex-wrap: wrap;"><h3 class="outlet-name">' + oDetails.businessName + '</h3><p class="outlet-address"><span><img src="' + origin +'/assets/wla_new/img/location.png" alt="Location"></span> <span>' + oDetails.store_locality + ', ' + oDetails.store_city + '</span></p></li></ul></div><div class="col-2 text-right pr-0"><ul class="outlet-icons m-0"><li><a href="tel:' + oDetails.phone + '"><img src="' + origin +'/assets/wla_new/img/phone-icon.png" alt="Phone Icon"></a></li></ul></div></div>';
            }else{
                if(oDetails.cart_type!=2){
                data += '<svg fill="none" height="34" viewBox="0 0 34 34" width="34" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M16.835 2.34907C8.83464 2.34907 2.34907 8.83464 2.34907 16.835C2.34907 24.8354 8.83464 31.3209 16.835 31.3209C24.8354 31.3209 31.3209 24.8354 31.3209 16.835C31.3209 8.83464 24.8354 2.34907 16.835 2.34907ZM0 16.835C0 7.53728 7.53728 0 16.835 0C26.1327 0 33.67 7.53728 33.67 16.835C33.67 26.1327 26.1327 33.67 16.835 33.67C7.53728 33.67 0 26.1327 0 16.835ZM16.0995 11.3063C16.5582 11.765 16.5582 12.5087 16.0995 12.9674L13.4064 15.6605H23.0992C23.7479 15.6605 24.2737 16.1863 24.2737 16.835C24.2737 17.4837 23.7479 18.0095 23.0992 18.0095H13.4064L16.0995 20.7026C16.5582 21.1613 16.5582 21.905 16.0995 22.3637C15.6408 22.8223 14.8971 22.8223 14.4384 22.3637L9.74029 17.6655C9.28161 17.2068 9.28161 16.4632 9.74029 16.0045L14.4384 11.3063C14.8971 10.8477 15.6408 10.8477 16.0995 11.3063Z" fill="#333333" fill-rule="evenodd"></path></svg></a><span class="order-description">Order #' + orderId +'<span>'+ formatDateTime(oDetails.invoicedAt) +' | '+ itemCount + ',' + icon + oDetails.totalAmt +'</span></span></h1><a href="#" data-toggle="modal" data-target="#raseaconcern" class="help-btn">HELP</a></div>';
            }else{
              data+='<svg fill="none" height="29" viewBox="0 0 31 29" width="31" xmlns="http://www.w3.org/2000/svg"><path d="M3.57527 13.4838H27.6613C27.9807 13.4838 28.287 13.6106 28.5129 13.8365C28.7387 14.0623 28.8656 14.3687 28.8656 14.6881C28.8656 15.0075 28.7387 15.3138 28.5129 15.5396C28.287 15.7655 27.9807 15.8924 27.6613 15.8924H3.57527C3.25587 15.8924 2.94955 15.7655 2.7237 15.5396C2.49785 15.3138 2.37097 15.0075 2.37097 14.6881C2.37097 14.3687 2.49785 14.0623 2.7237 13.8365C2.94955 13.6106 3.25587 13.4838 3.57527 13.4838Z" fill="black"></path><path d="M4.07383 14.6881L14.0623 24.6741C14.2884 24.9003 14.4155 25.207 14.4155 25.5268C14.4155 25.8466 14.2884 26.1533 14.0623 26.3794C13.8362 26.6056 13.5295 26.7326 13.2097 26.7326C12.8898 26.7326 12.5831 26.6056 12.357 26.3794L1.5183 15.5407C1.40615 15.4289 1.31717 15.296 1.25645 15.1497C1.19574 15.0033 1.16449 14.8465 1.16449 14.6881C1.16449 14.5297 1.19574 14.3728 1.25645 14.2265C1.31717 14.0802 1.40615 13.9473 1.5183 13.8354L12.357 2.99673C12.5831 2.7706 12.8898 2.64355 13.2097 2.64355C13.5295 2.64355 13.8362 2.7706 14.0623 2.99673C14.2884 3.22287 14.4155 3.52957 14.4155 3.84938C14.4155 4.16918 14.2884 4.47589 14.0623 4.70202L4.07383 14.6881Z" fill="black"></path></svg></a>Order #' + orderId + '</h1></div>';
            }
        }
            data += `<div class="class-move-map"></div>`;

            var orderType = "";
            if (oDetails.orderType == 1) {
                orderType = "Delivery";
            } else if (oDetails.orderType == 2) {
                // if (oDetails.subOrderType == 2) {
                //     orderType = "Drive & PickUp";
                // } else {
                //     orderType = "Pick Up";
                // }
                orderType = "Pickup";
            } else if (oDetails.orderType == 3) {
                orderType = "Dine-In";
            } else if (oDetails.orderType == 4) {
                orderType = "In-Car";
            }

            if (oDetails.deliveryStatus == '3') {
                if (oDetails.orderType == 3) {
                    orderStatus = "Served";
                } else if (oDetails.orderType == 2) {
                    orderStatus = "Picked Up";
                }else if (oDetails.orderType == 5) {
                    orderStatus = "Availed";
                } else {
                    orderStatus = "Delivered";
                }
            }

            var paymentMode = "";
            if (oDetails.paymentMode == 'COD') {
                paymentMode = "cash";
            } else {
                paymentMode = "prepaid";
            }

            if (orderCheckout == 1) {

                data += `<div class="order-status-div pt-0 pb-0 border-top-0">
                        <div class="text-center thank-you-top mb-3" style="background-color: green; border-radius: 10px; padding: 10px 10px;">	
                           <i class="las la-check-circle" style="font-size: 38px; margin-bottom: 4px; color: #fff;"></i>
                           <h1 class="thank-you-head mb-0" style="font-size: 20px; font-weight: 600; color: #fff;">Thank you <span class="d-block">Your ${paymentMode} order has been received<span></span></span></h1>
                        </div>
                        <ul class="d-flex flex-wrap">`;

                        if(oDetails.categoryId != 4){
                            //  data += `<li style="width: 100%; max-width: 50%; margin: 0px; border: none;">
                            //             <div class="order-status-icon" style="max-width: 43px;">
                            //                 <span style="height: 36px; width: 36px; line-height: 36px;"><img src="${origin}/assets/wla_new/img/home.png" alt="Home" style="max-width: 18px;"></span>
                            //             </div><div class="order-status-text"><span>Order Type</span>${orderType}</div>
                            //         </li>`;
                        }
                              
                
                // data += `<li style="width: 100%; max-width: 50%; margin: 0px; border: none;">
                //               <div class="order-status-icon" style="max-width: 43px;">
                //                  <span style="height: 36px; width: 36px; line-height: 36px;"><img src="${origin}/assets/wla_new/img/wallet.png" alt="wallet" style="max-width: 18px;"></span>
                //               </div>
                //               <div class="order-status-text"><span>Payment Method</span>${oDetails.paymentMode}</div>
                //            </li>`;

                // if (orderType = 1) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>Delivery Address</span>' + oDetails.addressLine1 + ', ' + oDetails.addressLine2 + ', ' + oDetails.locality + ', ' + oDetails.city + '</div></li>'
                // }

                data += '</ul></div>';

                // if (typeof fbq == "function") {
                //     fbq('track', 'Purchase', { currency: "INR", value: parseFloat(oDetails.totalAmt) });
                // }

            } else {
                if(oDetails.cart_type!=2){
              
                // data += `<div class="outer-dv"> <div class="d-none deliver-status outlet-info-card"><div class="row align-items-center">`
             
			    // data += `</div></div>`;
                
                
                if(currentStatus != '' || currentStatus != null){
                    setTimeout(()=>{
                        $('body .var-color-card').removeClass('d-none');
                    },100)
                }

                if(oDetails.orderType == 1){
                    if(oDetails.cancelledTime != null){
                        setTimeout(()=>{
                            $('body .deliver-status').addClass('d-none');

                        },100)
                    }else{
                        if(oDetails.deliveredTime != null || oDetails.dispatchedTime != null){
                            setTimeout(()=>{
                                $('body .deliver-status').removeClass('d-none');
                                // $('#div-status-line').addClass('d-none');
                            },100);

                            if(oDetails.deliveredTime != null){
                                setTimeout(()=>{
                                    // $('body .deliver-status').removeClass('d-none');
                                    $('#div-status-line').addClass('d-none');
                                },100);
                            }
                            

                        }
                    }
                }
                // console.log(oDetails);
                if(oDetails.orderType == 1 ){
                    if(oDetails.deliveredTime == null && oDetails.dispatchedTime == null){
                        // alert('sdfdf');
                        if(oDetails.cancelledTime != null){
                            data += `<div class="map-open-outer position-relative">
                
                                
                    <div class="move-data-map">
                      <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                    </div>
                </div>`;
                        }else{
                            data += `<div class="map-open-outer position-relative">
                                
                                <div class="move-data-map">
                                    <div id="open-map" class="map" style=""><div class="ol-viewport" style="position: relative; overflow: hidden; width: 100%; height: 100%;"><div class="ol-unselectable ol-layers" style="position: absolute; width: 100%; height: 100%; z-index: 0;"><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="484" height="423" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(1, 0, 0, 1, 0, 0);"></canvas></div><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="605" height="529" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(0.8, 0, 0, 0.8, 0, 0);"></canvas></div></div><div class="ol-overlaycontainer" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"></div><div class="ol-overlaycontainer-stopevent" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"><div class="ol-zoom ol-unselectable ol-control" style="pointer-events: auto;"><button class="ol-zoom-in" type="button" title="Zoom in">+</button><button class="ol-zoom-out" type="button" title="Zoom out">−</button></div><div class="ol-rotate ol-unselectable ol-control ol-hidden" style="pointer-events: auto;"><button class="ol-rotate-reset" type="button" title="Reset rotation"><span class="ol-compass" style="transform: rotate(0rad);">⇧</span></button></div><div class="ol-attribution ol-unselectable ol-control ol-uncollapsible" style="pointer-events: auto;"><ul><li>© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.</li></ul><button type="button" title="Attributions"><span>»</span></button></div></div></div></div>
                        <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                                </div>
                            </div>`;
                            setTimeout(() => {
                                openLeafletMap(parseFloat(oDetails.latitude),parseFloat(oDetails.longitude),parseFloat(oDetails.delLat), parseFloat(oDetails.delLong));
                            }, 500); //
                        }
                    }
                   else if(oDetails.dispatchedTime != null && oDetails.deliveredTime == null){
                        // alert('sdfdf');
                        if(oDetails.cancelledTime != null){
                            data += `<div class="map-open-outer position-relative">
                
                                
                    <div class="move-data-map">
                      <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                    </div>
                </div>`;
                        }else{
                            data += `<div class="map-open-outer position-relative">

                                
                                <div class="move-data-map">
                                    <div id="open-map" class="map" style=""><div class="ol-viewport" style="position: relative; overflow: hidden; width: 100%; height: 100%;"><div class="ol-unselectable ol-layers" style="position: absolute; width: 100%; height: 100%; z-index: 0;"><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="484" height="423" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(1, 0, 0, 1, 0, 0);"></canvas></div><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="605" height="529" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(0.8, 0, 0, 0.8, 0, 0);"></canvas></div></div><div class="ol-overlaycontainer" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"></div><div class="ol-overlaycontainer-stopevent" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"><div class="ol-zoom ol-unselectable ol-control" style="pointer-events: auto;"><button class="ol-zoom-in" type="button" title="Zoom in">+</button><button class="ol-zoom-out" type="button" title="Zoom out">−</button></div><div class="ol-rotate ol-unselectable ol-control ol-hidden" style="pointer-events: auto;"><button class="ol-rotate-reset" type="button" title="Reset rotation"><span class="ol-compass" style="transform: rotate(0rad);">⇧</span></button></div><div class="ol-attribution ol-unselectable ol-control ol-uncollapsible" style="pointer-events: auto;"><ul><li>© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.</li></ul><button type="button" title="Attributions"><span>»</span></button></div></div></div></div>
                                   <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                                </div>
                            </div>`;
                            
                            getOrderTracking(oDetails.businessId, oDetails.orderId , parseFloat(oDetails.latitude), parseFloat(oDetails.longitude));
                            setTimeout(()=>{
                                // console.log($('body .ol-viewport'));
                                $('body .ol-viewport').eq(0).hide();
                            },200);
                        }
                    }else{
                        data += `<div class="map-open-outer position-relative">
                
                                
                        <div class="move-data-map">
                          <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                            <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                            <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                            <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                            <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                        </div>
                    </div>`;
                    }


                }else if( oDetails.orderType == 2){
                    if(oDetails.deliveredTime == null){
                        // alert('asd');
                        if(oDetails.cancelledTime != null){
                            data += `<div class="map-open-outer position-relative">
                
                                
                    <div class="move-data-map">
                      <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                    </div>
                </div>`;
                        }else{
                            data += `<div class="map-open-outer position-relative">
                
                                
                                <div class="move-data-map">
                                    <div id="open-map" class="map" style=""><div class="ol-viewport" style="position: relative; overflow: hidden; width: 100%; height: 100%;"><div class="ol-unselectable ol-layers" style="position: absolute; width: 100%; height: 100%; z-index: 0;"><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="484" height="423" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(1, 0, 0, 1, 0, 0);"></canvas></div><div class="ol-layer" style="position: absolute; width: 100%; height: 100%;"><canvas width="605" height="529" style="position: absolute; left: 0px; transform-origin: left top; transform: matrix(0.8, 0, 0, 0.8, 0, 0);"></canvas></div></div><div class="ol-overlaycontainer" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"></div><div class="ol-overlaycontainer-stopevent" style="position: absolute; z-index: 0; width: 100%; height: 100%; pointer-events: none;"><div class="ol-zoom ol-unselectable ol-control" style="pointer-events: auto;"><button class="ol-zoom-in" type="button" title="Zoom in">+</button><button class="ol-zoom-out" type="button" title="Zoom out">−</button></div><div class="ol-rotate ol-unselectable ol-control ol-hidden" style="pointer-events: auto;"><button class="ol-rotate-reset" type="button" title="Reset rotation"><span class="ol-compass" style="transform: rotate(0rad);">⇧</span></button></div><div class="ol-attribution ol-unselectable ol-control ol-uncollapsible" style="pointer-events: auto;"><ul><li>© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.</li></ul><button type="button" title="Attributions"><span>»</span></button></div></div></div></div>
                                   <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                                </div>
                                <a target="_blank" href="https://www.google.com/maps/dir//${oDetails.latitude},${oDetails.longitude}/@${oDetails.latitude},${oDetails.longitude},17z" class="get-directions d-block d-md-none">Get Directions <svg style=width:100%;max-width:14px;height:auto version=1.1 viewBox="0 0 20 20"xmlns=http://www.w3.org/2000/svg><g id=layer1><path d="M 19.476562 0 A 0.4999986 0.50000733 0 0 0 19.267578 0.056640625 L 0.26953125 10.056641 A 0.4999986 0.50000733 0 0 0 0.50195312 11 L 9 11 L 9 19.498047 A 0.4999986 0.50000733 0 0 0 9.9433594 19.730469 L 19.943359 0.73242188 A 0.4999986 0.50000733 0 0 0 19.527344 0 A 0.4999986 0.50000733 0 0 0 19.476562 0 z M 18.306641 1.6933594 L 10 17.474609 L 10 10.5 A 0.4999986 0.50000733 0 0 0 9.5 10 L 2.5253906 10 L 18.306641 1.6933594 z "style=fill:#222;fill-opacity:1;stroke:none;stroke-width:0></path></g></svg></a>

                            </div>`;
                            setTimeout(()=>{
                                openLeafletMap(parseFloat(oDetails.latitude), parseFloat(oDetails.longitude),null,null,'',2);

                            },200);
                        }
                    }else{
                        data += `<div class="map-open-outer position-relative">
                
                                
                    <div class="move-data-map">
                      <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                    </div>
                </div>`;
                    }
                }else{
                    data += `<div class="map-open-outer position-relative">
                
                                
                    <div class="move-data-map">
                      <div id="post-order-dine" style="display:none;"><img src="/assets/wla_new/img/icons/dine-in-svg.svg" alt="Dine Image"></div>
                        <div id="post-order-incar" style="display:none;"><img src="/assets/wla_new/img/icons/in-car-svg.svg" alt="Incar Image"></div>
                        <div id="post-order-reject" style="display:none;"><img src="/assets/wla_new/img/icons/cancelled.svg" alt="Reject Image"></div>
                        <div id="post-order-delivery" style="display:none;"><img src="/assets/wla_new/img/icons/delivery-svg.svg" alt="Delivery Image"></div>
                        <div id="post-order-pickup" style="display:none;"><img src="/assets/wla_new/img/icons/pickup-svg.svg" alt="pickup Image"></div>
                    </div>
                </div>`;
                }
               
                data +=`<div class='outer-dv'>`;
                data += '<div class="outlet-info-card steps-card">';
                var currentStatus=   result?.order_milestones.find(
                    item => item.orderType == oDetails.orderType && 
                            item.deliveyStatus == oDetails.deliveryStatus
                ) || { quickTitle: "Unknown Status", title: "Status not found" };
                // oDetails.invoicedAt = null;
                var quickTitle = currentStatus.quickTitle;
                var title = currentStatus.title;
                if(oDetails.orderType==1 && oDetails.deliveryStatus==2 ){
                    if(oDetails.cancelledTime != null){
                       var riderDiv ='';
                    }else{
                        if(oDetails.dispatchedTime != null && oDetails.deliveredTime == null){
                            if(oDetails.riderName != null){
    
                               var riderName = `<p class="mb-0 pp"><b>${oDetails.riderName}</b> is on the way to deliver your order </p>`;
                            }
    
                            if(oDetails.riderNo != null){
    
                                riderDiv += `<a href="tel:9876543210" class="call-btn"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.73106 2.10621L8.91954 1.83677C9.57063 1.68867 10.2534 1.78252 10.8403 2.10082C11.4273 2.41911 11.8784 2.94009 12.1095 3.56655L12.8706 5.63014C13.0693 6.16897 13.0943 6.75648 12.9421 7.31024C12.7899 7.864 12.4682 8.35622 12.022 8.71784L10.4343 10.0041C10.3879 10.0417 10.3565 10.0946 10.3457 10.1533C10.2744 10.5463 10.4893 11.3361 11.0344 12.4515C11.4293 13.2617 11.7994 13.8377 12.1243 14.168C12.3519 14.3993 12.4814 14.4543 12.5393 14.4423L14.5871 13.9678C15.1463 13.8383 15.732 13.887 16.2621 14.1071C16.7923 14.3272 17.2402 14.7077 17.5432 15.1952L18.6973 17.0555C19.0487 17.6211 19.1829 18.2951 19.0751 18.9522C18.9672 19.6093 18.6246 20.2049 18.1108 20.6285L17.1678 21.4051C16.6679 21.8168 16.0699 22.0921 15.432 22.204C14.7941 22.316 14.1382 22.2608 13.5279 22.0439C10.8337 21.0863 8.53136 18.5971 6.58964 14.6222C4.64626 10.6423 4.09865 7.29239 5.00673 4.57569C5.21065 3.96467 5.56854 3.41648 6.04588 2.98396C6.52323 2.55143 7.10295 2.24909 7.73106 2.10621ZM8.06462 3.56979C7.6877 3.65523 7.33914 3.83632 7.05254 4.09561C6.76593 4.3549 6.55095 4.68364 6.42831 5.05016C5.66646 7.33493 6.15122 10.3046 7.9384 13.9639C9.72392 17.6182 11.7651 19.8257 14.0318 20.6314C14.398 20.7614 14.7916 20.7944 15.1743 20.7271C15.557 20.6598 15.9157 20.4946 16.2156 20.2475L17.1576 19.4708C17.3913 19.2783 17.5471 19.0075 17.5963 18.7087C17.6454 18.41 17.5844 18.1036 17.4246 17.8464L16.2704 15.9871C16.1327 15.7652 15.929 15.5921 15.6878 15.492C15.4466 15.3918 15.1802 15.3697 14.9258 15.4288L12.873 15.9049C11.6817 16.1711 10.6883 15.159 9.68766 13.1099C9.0115 11.7298 8.72559 10.6775 8.87078 9.88467C8.94544 9.47285 9.16554 9.10319 9.48959 8.83897L11.0774 7.55271C11.2801 7.38823 11.4262 7.16441 11.4953 6.91266C11.5643 6.66091 11.5528 6.39386 11.4624 6.14897L10.7023 4.08546C10.5972 3.8007 10.3921 3.56389 10.1253 3.41923C9.85848 3.27457 9.54813 3.23193 9.25218 3.29928L8.06462 3.56979Z" fill="var(--main-bg-color)"></path></svg> Rider</a>`;
                            }
                        }
                    }
                data +=`<div class="top-delivery-status">
                                    <div class="delivery-status-outer">
                                        <div class="delivery-status-description">
                                            <h2>${quickTitle}</h2>
                                            ${riderName}
                                        </div>
                                        <div class="eta text-right">
                                            <div class="eta-div">
                                                <span id="est_mins"></span> mins
                                            </div>
                                        </div>
                                    </div>`;
                                
                                 data +=  ` <div class="delivery-code-dv" style="display:none;" id="delivery_code_present">
                                        <div class="delivery-code-left">
                                            <div class="d-flex align-items-center">
                                                <p class="mb-0 pp">Delivery Code</p>
                                                <span class="code-delivery" id="delivery_otp"></span>
                                               
                                            </div>
                                        </div>
                                        <div class="delivery-code-right text-right">
                                             <a href="tel:${oDetails.riderMobile}" class="call-btn"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.73106 2.10621L8.91954 1.83677C9.57063 1.68867 10.2534 1.78252 10.8403 2.10082C11.4273 2.41911 11.8784 2.94009 12.1095 3.56655L12.8706 5.63014C13.0693 6.16897 13.0943 6.75648 12.9421 7.31024C12.7899 7.864 12.4682 8.35622 12.022 8.71784L10.4343 10.0041C10.3879 10.0417 10.3565 10.0946 10.3457 10.1533C10.2744 10.5463 10.4893 11.3361 11.0344 12.4515C11.4293 13.2617 11.7994 13.8377 12.1243 14.168C12.3519 14.3993 12.4814 14.4543 12.5393 14.4423L14.5871 13.9678C15.1463 13.8383 15.732 13.887 16.2621 14.1071C16.7923 14.3272 17.2402 14.7077 17.5432 15.1952L18.6973 17.0555C19.0487 17.6211 19.1829 18.2951 19.0751 18.9522C18.9672 19.6093 18.6246 20.2049 18.1108 20.6285L17.1678 21.4051C16.6679 21.8168 16.0699 22.0921 15.432 22.204C14.7941 22.316 14.1382 22.2608 13.5279 22.0439C10.8337 21.0863 8.53136 18.5971 6.58964 14.6222C4.64626 10.6423 4.09865 7.29239 5.00673 4.57569C5.21065 3.96467 5.56854 3.41648 6.04588 2.98396C6.52323 2.55143 7.10295 2.24909 7.73106 2.10621ZM8.06462 3.56979C7.6877 3.65523 7.33914 3.83632 7.05254 4.09561C6.76593 4.3549 6.55095 4.68364 6.42831 5.05016C5.66646 7.33493 6.15122 10.3046 7.9384 13.9639C9.72392 17.6182 11.7651 19.8257 14.0318 20.6314C14.398 20.7614 14.7916 20.7944 15.1743 20.7271C15.557 20.6598 15.9157 20.4946 16.2156 20.2475L17.1576 19.4708C17.3913 19.2783 17.5471 19.0075 17.5963 18.7087C17.6454 18.41 17.5844 18.1036 17.4246 17.8464L16.2704 15.9871C16.1327 15.7652 15.929 15.5921 15.6878 15.492C15.4466 15.3918 15.1802 15.3697 14.9258 15.4288L12.873 15.9049C11.6817 16.1711 10.6883 15.159 9.68766 13.1099C9.0115 11.7298 8.72559 10.6775 8.87078 9.88467C8.94544 9.47285 9.16554 9.10319 9.48959 8.83897L11.0774 7.55271C11.2801 7.38823 11.4262 7.16441 11.4953 6.91266C11.5643 6.66091 11.5528 6.39386 11.4624 6.14897L10.7023 4.08546C10.5972 3.8007 10.3921 3.56389 10.1253 3.41923C9.85848 3.27457 9.54813 3.23193 9.25218 3.29928L8.06462 3.56979Z" fill="var(--main-bg-color)"></path></svg> Rider</a>
                                        </div>
                                    </div>`;

                              data+=  `<div class="delivery-code-dv" style="display:none;" id="delivery_code_unavailable">
                                        <div class="delivery-code-left">
                                            <div class="d-flex align-items-center">
                                                <p class="mb-0 pp">Call ${oDetails.riderName}</p>
                                               
                                            </div>
                                        </div>
                                        <div class="delivery-code-right text-right">
                                            <a href="tel:${oDetails.riderMobile}" class="call-btn"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.73106 2.10621L8.91954 1.83677C9.57063 1.68867 10.2534 1.78252 10.8403 2.10082C11.4273 2.41911 11.8784 2.94009 12.1095 3.56655L12.8706 5.63014C13.0693 6.16897 13.0943 6.75648 12.9421 7.31024C12.7899 7.864 12.4682 8.35622 12.022 8.71784L10.4343 10.0041C10.3879 10.0417 10.3565 10.0946 10.3457 10.1533C10.2744 10.5463 10.4893 11.3361 11.0344 12.4515C11.4293 13.2617 11.7994 13.8377 12.1243 14.168C12.3519 14.3993 12.4814 14.4543 12.5393 14.4423L14.5871 13.9678C15.1463 13.8383 15.732 13.887 16.2621 14.1071C16.7923 14.3272 17.2402 14.7077 17.5432 15.1952L18.6973 17.0555C19.0487 17.6211 19.1829 18.2951 19.0751 18.9522C18.9672 19.6093 18.6246 20.2049 18.1108 20.6285L17.1678 21.4051C16.6679 21.8168 16.0699 22.0921 15.432 22.204C14.7941 22.316 14.1382 22.2608 13.5279 22.0439C10.8337 21.0863 8.53136 18.5971 6.58964 14.6222C4.64626 10.6423 4.09865 7.29239 5.00673 4.57569C5.21065 3.96467 5.56854 3.41648 6.04588 2.98396C6.52323 2.55143 7.10295 2.24909 7.73106 2.10621ZM8.06462 3.56979C7.6877 3.65523 7.33914 3.83632 7.05254 4.09561C6.76593 4.3549 6.55095 4.68364 6.42831 5.05016C5.66646 7.33493 6.15122 10.3046 7.9384 13.9639C9.72392 17.6182 11.7651 19.8257 14.0318 20.6314C14.398 20.7614 14.7916 20.7944 15.1743 20.7271C15.557 20.6598 15.9157 20.4946 16.2156 20.2475L17.1576 19.4708C17.3913 19.2783 17.5471 19.0075 17.5963 18.7087C17.6454 18.41 17.5844 18.1036 17.4246 17.8464L16.2704 15.9871C16.1327 15.7652 15.929 15.5921 15.6878 15.492C15.4466 15.3918 15.1802 15.3697 14.9258 15.4288L12.873 15.9049C11.6817 16.1711 10.6883 15.159 9.68766 13.1099C9.0115 11.7298 8.72559 10.6775 8.87078 9.88467C8.94544 9.47285 9.16554 9.10319 9.48959 8.83897L11.0774 7.55271C11.2801 7.38823 11.4262 7.16441 11.4953 6.91266C11.5643 6.66091 11.5528 6.39386 11.4624 6.14897L10.7023 4.08546C10.5972 3.8007 10.3921 3.56389 10.1253 3.41923C9.85848 3.27457 9.54813 3.23193 9.25218 3.29928L8.06462 3.56979Z" fill="var(--main-bg-color)"></path></svg> Rider</a>
                                        </div>
                                    </div>`;
                                    data+=`</div>`;
                }else{
                    if(oDetails.orderType==1 && oDetails.deliveryStatus==3){
                        title=`Your order has been delivered by ${oDetails.riderName} successfully`;
                    }
                    data += `<div class="top-delivery-status">
                                    <div class="delivery-status-outer full-width-delivery">
                                        <div class="delivery-status-description">
                                            <h2>${quickTitle}</h2>
                                            ${title}
                                        </div>
                                    </div>
                            </div>`;
                }
                data+='<ul class="ordering-steps">';
                
              

                // if (orderType == 1) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>Delivery Address</span>' + oDetails.addressLine1 + ', ' + oDetails.addressLine2 + ', ' + oDetails.locality + ', ' + oDetails.city + '</div></li>'
                // }

                if(true){
                    moment.updateLocale('en', {
                        ordinal: function (number) {
                            let b = number % 10,
                                output = (~~(number % 100 / 10) === 1) ? 'th' :
                                         (b === 1) ? 'st' :
                                         (b === 2) ? 'nd' :
                                         (b === 3) ? 'rd' : 'th';
                            return number + output;
                        }
                    });
                    
                    // oDetails.invoicedAt = null;
                    if (oDetails.invoicedAt == null) {                        
                        oInvoicedAT = '<li><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Received</h4><p></p></div></div></li>';
                    } else {
                        oInvoicedAT = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Received</h4><p>'+moment(oDetails.invoicedAt).format('hh:mm A') + '<br>'+  moment(oDetails.invoicedAt).format('Do MMM')+ '</p></div></li>';
                    }

                    
                        if (oDetails.acceptedTime == null) {
                            if (oDetails.cancelledTime == null) {
                                oacceptedTime = '<li><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Accepted</h4><p></p></div></div></li>';
                            } else {
                                if (oDetails.acceptedTime == null) {
                                    oacceptedTime = '';
                                } else {
                                    oacceptedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Accepted</h4><p>'+ moment(oDetails.acceptedTime).format('hh:mm A') +'<br>'+ moment(oDetails.acceptedTime).format('Do MMM')+ '</p></div></li>';
                                }
                            }
                        } else {
                            oacceptedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Accepted</h4><p>'+moment(oDetails.acceptedTime).format('hh:mm A')+'<br>'+ moment(oDetails.acceptedTime).format('Do MMM') + '</p></div></li>';
                        }
                    

                    if (oDetails.preparedTime == null) {
                        if (oDetails.cancelledTime == null) {
                            opreparedTime = '<li><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Prepared</h4><p></p></div></div></li>';
                        } else {
                            if (oDetails.preparedTime == null) {
                                opreparedTime = '';
                            } else {
                                opreparedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Prepared</h4><p>'+moment(oDetails.preparedTime).format('hh:mm A')+'<br>'+ moment(oDetails.preparedTime).format('Do MMM')  + '</p></div></li>';
                            }
                        }
                    } else {
                        opreparedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Prepared</h4><p>'+ moment(oDetails.preparedTime).format('hh:mm A') +'<br>'+ moment(oDetails.preparedTime).format('Do MMM') +'</p></div></li>';
                    }

                    if (oDetails.dispatchedTime == null) {
                        if (oDetails.cancelledTime == null) {
                            odispatchedTime = '<li><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Dispatched</h4><p></p></div></div></li>';
                        } else {
                            if (oDetails.dispatchedTime == null) {
                                odispatchedTime = '';
                            } else {
                                odispatchedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Dispatched</h4><p>'+ moment(oDetails.dispatchedTime).format('hh:mm A')+'<br>'+ moment(oDetails.dispatchedTime).format('Do MMM') + '</p></div></li>';
                            }
                        }
                    } else {
                        odispatchedTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Dispatched</h4><p>'+ moment(oDetails.dispatchedTime).format('hh:mm A')+'<br>'+ moment(oDetails.dispatchedTime).format('Do MMM') + '</p></div></li>';
                    }

                    if (oDetails.deliveredTime == null) {
                        if (oDetails.cancelledTime == null) {
                            odeliveredTime = '<li><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Delivered</h4><p></p></div></div></li>';
                        } else {
                            if (oDetails.deliveredTime == null) {
                                odeliveredTime = '';
                            } else {
                                odeliveredTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Delivered</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                            }
                        }
                    } else {
                        odeliveredTime = '<li class="active"><div class="d-block  text-center"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Delivered</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                    }
                    if (oDetails.deliveredTime == null) {
                        if (oDetails.cancelledTime == null) {
                            odeliveredTimeCar = '<li><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"> <h4>Delivered</h4><p></p></div></div></li>';
                        } else {
                            if (oDetails.deliveredTime == null) {
                                odeliveredTimeCar = '';
                            } else {
                                odeliveredTimeCar = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Delivered</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                            }
                        }
                    } else {
                        odeliveredTimeCar = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Delivered</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                    }
                    if (oDetails.deliveredTime == null) {
                        if (oDetails.cancelledTime == null) {
                            opickeduptime = '<li><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Picked Up</h4></div></li>';
                        } else {
                            if (oDetails.deliveredTime == null) {
                                opickeduptime = '';
                            } else {
                                opickeduptime = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Picked Up</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                            }
                        }
                    } else {
                        opickeduptime = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Picked Up</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                    }

                    if (oDetails.deliveredTime == null) {
                        if (oDetails.cancelledTime == null) {
                            oservedat = '<li><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Served</h4></div></li>';
                        } else {
                            if (oDetails.deliveredTime == null) {
                                oservedat = '';
                            } else {
                                oservedat = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Served</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                            }
                        }
                    } else {
                        oservedat = '<li class="active"><div class="d-block  text-center stroke-custom"><div><svg class="active" fill="none" height="47" viewBox="0 0 47 47" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23.0825" fill="white" r="21.5" stroke="white" stroke-width="3"></circle><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M43 23C43 34.0457 34.0457 43 23 43C11.9543 43 3 34.0457 3 23C3 11.9543 11.9543 3 23 3C34.0457 3 43 11.9543 43 23ZM31.0607 16.9393C31.6464 17.5251 31.6464 18.4749 31.0607 19.0607L21.0607 29.0607C20.4749 29.6464 19.5251 29.6464 18.9393 29.0607L14.9393 25.0607C14.3536 24.4749 14.3536 23.5251 14.9393 22.9393C15.5251 22.3536 16.4749 22.3536 17.0607 22.9393L20 25.8787L24.4697 21.409L28.9393 16.9393C29.5251 16.3536 30.4749 16.3536 31.0607 16.9393Z" fill="#63932C" fill-rule="evenodd"></path></svg><svg class="initial" fill="none" height="46" viewBox="0 0 47 46" width="47" xmlns="http://www.w3.org/2000/svg"><circle cx="23.0825" cy="23" fill="#EDEDED" r="21.5" stroke="white" stroke-width="3"></circle><circle cx="23.0825" cy="23" fill="white" r="12"></circle></svg></div><div class="text-center"><h4>Served</h4><p>'+ moment(oDetails.deliveredTime).format('hh:mm A')+'<br>'+ moment(oDetails.deliveredTime).format('Do MMM') + '</p></div></li>';
                    }

                    if (oDetails.deliveryStatus == 3) {
                        oresertime = '<div class="order-tracking completed"><span class="is-complete"></span><p>Availed<br><span>' + moment(oDetails.deliveredTime).format('Do MMM hh:mm A') + '</span></p></div>';
                    } else {
                        oresertime = '<div class="order-tracking current"><span class="is-complete"></span><p>Availed</p></div>';
                    }

                    if (oDetails.cancelledTime == null) {
                        ocancelledTime = '<li>						<div class="d-block  text-center">							<div>								<svg fill=none  viewBox="0 0 155 156" xmlns=http://www.w3.org/2000/svg><circle cx=77.3385 cy=77.9999 fill=#EDEDED r=72.0913 stroke=white stroke-width=10.0592 /><circle cx=77.3386 cy=78.0002 fill=white r=40.237 /><path clip-rule=evenodd d="M144.123 77.9999C144.123 115.037 114.099 145.062 77.0617 145.062C40.0245 145.062 10 115.037 10 77.9999C10 40.9628 40.0245 10.9382 77.0617 10.9382C114.099 10.9382 144.123 40.9628 144.123 77.9999ZM56.7395 57.6779C58.7037 55.7137 61.8882 55.7137 63.8524 57.6779L77.0614 70.8869L90.2703 57.678C92.2345 55.7138 95.4191 55.7138 97.3833 57.678C99.3475 59.6422 99.3475 62.8268 97.3833 64.791L84.1744 77.9998L97.3831 91.2085C99.3473 93.1727 99.3473 96.3573 97.3831 98.3215C95.4189 100.286 92.2344 100.286 90.2702 98.3215L77.0614 85.1128L63.8526 98.3216C61.8884 100.286 58.7038 100.286 56.7396 98.3216C54.7754 96.3575 54.7754 93.1729 56.7396 91.2087L69.9485 77.9998L56.7395 64.7908C54.7753 62.8266 54.7753 59.642 56.7395 57.6779Z"fill=#C52733 fill-rule=evenodd /></svg>					</div>							<div class="text-center">								<h4>Rejected</h4>								    		</div>						</div>					</li>';
                    } else {
                        ocancelledTime = '<li>						<div class="d-block  text-center">							<div>								<svg fill=none  viewBox="0 0 155 156" xmlns=http://www.w3.org/2000/svg><circle cx=77.3385 cy=77.9999 fill=#EDEDED r=72.0913 stroke=white stroke-width=10.0592 /><circle cx=77.3386 cy=78.0002 fill=white r=40.237 /><path clip-rule=evenodd d="M144.123 77.9999C144.123 115.037 114.099 145.062 77.0617 145.062C40.0245 145.062 10 115.037 10 77.9999C10 40.9628 40.0245 10.9382 77.0617 10.9382C114.099 10.9382 144.123 40.9628 144.123 77.9999ZM56.7395 57.6779C58.7037 55.7137 61.8882 55.7137 63.8524 57.6779L77.0614 70.8869L90.2703 57.678C92.2345 55.7138 95.4191 55.7138 97.3833 57.678C99.3475 59.6422 99.3475 62.8268 97.3833 64.791L84.1744 77.9998L97.3831 91.2085C99.3473 93.1727 99.3473 96.3573 97.3831 98.3215C95.4189 100.286 92.2344 100.286 90.2702 98.3215L77.0614 85.1128L63.8526 98.3216C61.8884 100.286 58.7038 100.286 56.7396 98.3216C54.7754 96.3575 54.7754 93.1729 56.7396 91.2087L69.9485 77.9998L56.7395 64.7908C54.7753 62.8266 54.7753 59.642 56.7395 57.6779Z"fill=#C52733 fill-rule=evenodd /></svg>					</div>							<div class="text-center">								<h4>Rejected</h4>								<p>' + moment(oDetails.cancelledTime).format('hh:mm A')+'<br>' +moment(oDetails.cancelledTime).format('Do MMM') + '</p>							</div>						</div>					</li>';
                    }

                    if (oDetails.orderType == 1) {
                        if (oDetails.cancelledTime == null) {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odispatchedTime + '' + odeliveredTime + '';
                        } else {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odispatchedTime + '' + ocancelledTime + '';
                        }
                    } else if (oDetails.orderType == 2) {
                        if (oDetails.cancelledTime == null) {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + opickeduptime + '';
                        } else {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                        }
                    } else if (oDetails.orderType == 3) {
                        if (oDetails.cancelledTime == null) {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + oservedat + '';
                        } else {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                        }
                    } else if (oDetails.orderType == 4) {
                        if (oDetails.cancelledTime == null) {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + odeliveredTimeCar + '';
                        } else {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + opreparedTime + '' + ocancelledTime + '';
                        }
                    }else if (oDetails.orderType == 5) {
                        if (oDetails.cancelledTime == null) {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + oresertime + '';
                        } else {
                            data += '' + oInvoicedAT + '' + oacceptedTime + '' + ocancelledTime + '';
                        }
                    }
                    if(oDetails.categoryId != 4){
                        // data += '</ul></div><ul><li style="width: 100%; max-width: 50%; margin: 0px; border: none;"><div class="order-status-icon" style="max-width: 43px;"><span style="height: 36px; width: 36px; line-height: 36px;"><img src="' + origin +'/assets/wla_new/img/home.png" alt="Home"></span></div>';
                        // data += '<div class="order-status-text"><span>Order Type</span>' + orderType + '</div>';
                        // data += '</li>';
                    }
                    // data += '<li style="width: 100%; max-width: 50%; margin: 0px; border: none;"><div class="order-status-icon" style="max-width: 43px;"><span style="height: 36px; width: 36px; line-height: 36px;"><img src="' + origin +'/assets/wla_new/img/wallet.png" alt="Wallet"></span></div><div class="order-status-text"><span>Payment Method</span>' + oDetails.paymentMode + '</div></li></ul>'
                    // data += '</li></ul>';
                }
                data += '</div>';
            }else{
                data += `<div class="outer-dv"> `
                data+=`<div class="outlet-info-card new-ordering-system text-center">
			<div class="row align-items-center">
				<div class="col-12">
					<div class="outlet-image mb-2">
						<img src="https://www.uengage.in/images/addo/logos/${oDetails.logo}" alt="logo" width="400" height="400">
					</div>
					<h1>${oDetails.businessName}</h1>	
					<p>${oDetails.store_locality}, ${oDetails.store_city}</p>
					
					<div class="amount-p-divv">
						<p>Total Amount</p>
						
						<span><i class="la la-inr"></i><b>${oDetails.subTotal}</b></span>
					</div>
				</div>
			</div>
		</div>`;
            }
            }
         
            data += `<div id="reward-collection" class="d-none lottie-outer position-relative">
                        <dotlottie-player src="https://lottie.host/3a07992b-8b26-42c1-9e50-7965386af8eb/fe8L4Xg0Ge.lottie" class="animation-lottie d-none d-md-block" background="transparent" speed="1" style="width: 100%; height: auto" loop="false" autoplay></dotlottie-player>
                        <dotlottie-player  src="https://lottie.host/4f7bad83-92f2-4c6e-848d-3600510bff7a/PbG4vItuv4.json" class="animation-lottie d-md-none d-block" background="transparent" speed="1" class="animation-lottie" loop="false" autoplay></dotlottie-player>
						<div class="outlet-info-card hurray-section position-relative mt-0 free-rewards d-none">
							<div class="row align-items-center m-0" style="flex-wrap: revert;">
								<div class="pr-1 hurray-section-left">
									<svg fill="none" height="49" viewBox="0 0 49 49" width="49" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24.8883" cy="24.3038" fill="#FFF6EC" rx="24.0602" ry="24.3038" fill-opacity="0.3"></ellipse><ellipse cx="24.8883" cy="24.3038" fill="url(#paint0_linear_1210_489)" rx="24.0602" ry="24.3038"></ellipse><path d="M48.5644 24.3038C48.5644 37.518 37.9606 48.2236 24.8883 48.2236C11.8159 48.2236 1.21213 37.518 1.21213 24.3038C1.21213 11.0896 11.8159 0.384 24.8883 0.384C37.9606 0.384 48.5644 11.0896 48.5644 24.3038Z" stroke="white" stroke-opacity="0.2" stroke-width="0.768"></path><path d="M36.0171 17.5322H30.2667C30.8442 16.8858 31.2051 16.0388 31.2051 15.1019C31.2051 13.0919 29.5858 11.4563 27.5961 11.4563C26.3401 11.4563 25.2358 12.1089 24.5886 13.0944C23.9413 12.1089 22.837 11.4563 21.581 11.4563C19.5913 11.4563 17.972 13.0919 17.972 15.1019C17.972 16.0388 18.3341 16.8858 18.9104 17.5322H13.16C12.1651 17.5322 11.3555 18.3501 11.3555 19.355V23.0006C11.3555 24.0056 12.1651 24.8234 13.16 24.8234H13.7615V37.5829C13.7615 38.5878 14.5711 39.4057 15.566 39.4057H23.3855H25.7916H33.6111C34.606 39.4057 35.4156 38.5878 35.4156 37.5829V24.8234H36.0171C37.012 24.8234 37.8216 24.0056 37.8216 23.0006V19.355C37.8216 18.3501 37.012 17.5322 36.0171 17.5322ZM27.5961 12.6715C28.923 12.6715 30.0021 13.7615 30.0021 15.1019C30.0021 16.4422 28.923 17.5322 27.5961 17.5322H25.7916H25.1901V15.1019C25.1901 13.7615 26.2692 12.6715 27.5961 12.6715ZM19.175 15.1019C19.175 13.7615 20.2541 12.6715 21.581 12.6715C22.908 12.6715 23.987 13.7615 23.987 15.1019V17.5322H23.3855H21.581C20.2541 17.5322 19.175 16.4422 19.175 15.1019ZM12.5585 23.0006V19.355C12.5585 19.0209 12.828 18.7474 13.16 18.7474H21.581H22.784V23.6082H19.8511H14.363H13.16C12.828 23.6082 12.5585 23.3348 12.5585 23.0006ZM14.9645 37.5829V24.8234H19.8523H22.7852V38.1905H15.5672C15.234 38.1905 14.9645 37.9171 14.9645 37.5829ZM23.987 38.1905V18.7474H24.5886H25.1901V24.2134V24.2158V24.2182V38.1905H23.987ZM34.2126 37.5829C34.2126 37.9171 33.9431 38.1905 33.6111 38.1905H26.3931V24.8234H28.7618H34.2126V37.5829ZM36.6186 23.0006C36.6186 23.3348 36.3492 23.6082 36.0171 23.6082H34.8141H28.7618H26.3931V18.7474H27.5961H36.0171C36.3492 18.7474 36.6186 19.0209 36.6186 19.355V23.0006Z" fill="white"></path><path d="M33.0095 12.6714L33.4907 10.7271L35.4155 10.241L33.4907 9.75497L33.0095 7.81067L32.5283 9.75497L30.6035 10.241L32.5283 10.7271L33.0095 12.6714Z" fill="white"></path><path d="M35.4159 12.6715L35.1753 13.6437L34.2129 13.8867L35.1753 14.1297L35.4159 15.1019L35.6565 14.1297L36.6189 13.8867L35.6565 13.6437L35.4159 12.6715Z" fill="white"></path><path d="M36.619 10.241L36.8596 9.2689L37.822 9.02586L36.8596 8.78282L36.619 7.81067L36.3784 8.78282L35.416 9.02586L36.3784 9.2689L36.619 10.241Z" fill="white"></path><defs><linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1210_489" x1="24.8883" x2="24.8883" y1="0" y2="48.6076"><stop stop-color="var(--main-bg-color)"></stop><stop stop-color="var(--main-bg-color)" offset="1"></stop></linearGradient></defs></svg>
								</div>
								<div class="pl-1 pr-1 hurray-section-center">
									<h4 id="reward_des"></h4>
									<p id="reward_undes" class="mb-0"> </p>
								</div>
								<div class="pl-1 hurray-section-right" id="append_unscratch">
									<a href="#" data-toggle="modal" data-target="#first-scratch" class="call-btn">Reveal Now</a>
								</div>
							</div>
						</div>
					</div>`;
            getReward(oDetails.businessId,orderId);
            if(oDetails.deliveredTime != null){					
                wallet_message = `The cashback is credited to your wallet`;
            }else{
                wallet_message = `The cashback will be credited to your wallet once the order is delivered`;

            }
            if(oDetails.cashbackvalue > 0 && oDetails.deliveryStatus!=4){
                data += `<div class="outlet-info-card lp-coins-screen">
                <a href="/wallet">
						<div class="row align-items-center m-0" style="flex-wrap: revert;">
							<div class="pr-1 left-lp-coin">
								<img src="https://lapinozpizza.in/assets/wla_new/img/icons/cashback_received.png" alt="Cashback Received" width="128" height="128">
							</div>
							<div class="pl-1 right-lp-coin">
								<h4>Yay! You received ${oDetails.cashbackvalue} ${oDetails.walletName}</h4>
                                <p class="mb-0">${wallet_message}</p>
							</div>
						</div>
                </a>
					</div>`;
            }
            data += '<div class="outlet-info-card bg-top"><div class="row align-items-center"><div class="col-7 pr-1"><h2>'+oDetails.businessName+ '</h2><p class="mb-0 pp">'+oDetails.store_locality+', '+oDetails.store_city+'</p></div><div class="col-5 pl-1 text-right"><a href="tel:' + oDetails.phone + '"class="call-btn">'+getCallSVG()+' Outlet</a></div></div></div>';
          
          
            if(oDetails.categoryId == 4){
                data += '<h3 class="heading-common">Your Reservation</h3><div class="order-type-div">';
            }else{
                if(oDetails.cart_type !=2){
                data += '<h3 class="heading-common">Order Summary</h3>';
                }else{
                    data += '<h3 class="heading-common">Bill Summary</h3>';
 
                }

                data +='<div class="outlet-info-card p-0 position-relative ">';

                if(oDetails.running_order ==1 && oIDetails[0]['returnKOTNO'] !=null ){
                    data+='<div class="item-details text-center pb-0"><div style="color: #000; display: inline-block; font-weight: 700; font-size: 16px; border: 1px dashed var(--main-bg-color); padding: 4px 8px; border-radius: 5px;">KOT NO: <span style="color: var(--main-bg-color);">'+oIDetails[0]['returnKOTNO']+'</span></div></div>';
                }
            }

            icon = currency;

            if (isCloud == 1) {
                for (var m = 0; m < oIDetails.length; m++) {
                    if (oIDetails[m].items) {
                        for (var i = 0; i < oIDetails[m].items.length; i++) {
                            var oDetailss = oIDetails[m].items[i];
                            data += '<div class="item-discription-outer"><div class="item-discription-main" style="align-items: normal; margin-bottom: 6px;">';
                            if (oDetailss.parentName != null && oDetailss.parentName != '') {
                                data += '<span class="item-name" style="flex-wrap: wrap;"><div>';
                                data += '</div><div style="font-weight: 500;">' + oDetailss.parentName + '</div>'
                            }

                            data += '</span><span class="item-price" style="align-items: normal;"><div class="item-price-inner"><!--' + icon + '' + oDetailss.itemPrice + '--></div></span></div><div class="item-discription-main" style="align-items: normal;"><span class="item-name" style="flex-wrap: wrap; font-size: 15px;"><div>';
                            if (oDetailss.vegnonvegboth == 'veg') {
                                data += '<div class="veg-flag"><span></span></div>';
                            } else if (oDetailss.vegnonvegboth == 'non-veg') {
                                data += '<div class="non-vegflag"><span></span></div>';
                            }
                            data += '</div><div style="font-weight: 400;">' + oDetailss.itemName + '</div><br><div style="font-weight: 300; display: block;width: 100%;    margin-top: 3px;">';

                            if( oDetailss.mrp != oDetailss.itemPrice &&  oDetailss.mrp != 0){
                                data += '<small style="color: #848484; font-size: 85%;"><s>'+ icon + '' + oDetailss.mrp + '</s></small>';
                            }
                            if(oDetailss?.viewType != 3){
                                data += icon + '' + oDetailss.itemPrice + ' x ' + oDetailss.qty + '</div></span><span class="item-price pr-0" style="align-items: end;"><div class="item-price-inner">' + icon + '' + oDetailss.subTotal + '</div></span></div>';
                            }else{
                                data += '</div></span><span class="item-price pr-0" style="align-items: end;"><div class="item-price-inner">' + icon + '' + oDetailss.subTotal + '</div></span></div>';
                            }

                            if (oDetailss.subItems == 0) {
                                ocustomize = '<span style="color: #848484; margin-bottom: 4px; display: block; margin-top: 8px;"></span>';
                            } else {
                                ocustomize = '<span style="color: #848484; margin-bottom: 3px; display: block; margin-top: 8px;">Customization</span>';
                            }

                            data += '<div class="item-customization pl-0">' + ocustomize + ''

                            var itemDetails = oIDetails[m];
                            if (itemDetails.items[i].subItems) {
                                if (itemDetails.items[i].subItems.length > 0) {
                                    for (var j = 0; j < itemDetails.items[i].subItems.length; j++) {
                                        var subItems = itemDetails.items[i].subItems[j];
                                        data += '<div class="item-discription-main" style="margin-bottom: 5px;"><span class="item-name">+ <div>' + subItems.itemName + '</div></span>' +
                                            '<span class="item-price pr-0"><div class="item-price-inner" style="font-weight: 400;">' + icon + '' + subItems.subTotal + '</div></span></div>';
                                        // }

                                    }
                                }
                            } else {
                                if (itemDetails.subItems.length > 0) {
                                    for (var j = 0; j < itemDetails.subItems.length; j++) {
                                        var subItems = itemDetails.subItems[j];
                                        data += '<div class="item-discription-main" style="margin-bottom: 5px;"><span class="item-name">+ <div>' + subItems.itemName + '</div></span>' +
                                            '<span class="item-price pr-0"><div class="item-price-inner" style="font-weight: 400;">' + icon + '' + subItems.subTotal + '</div></span></div>';
                                        // }

                                    }
                                }

                            }
                            data += '</div></div>';
                        }

                    }
                }
            } else {
                if(oDetails.cart_type != 2){

                    data += '<div class="item-details">'; // Opening item-details
                    for (var i = 0; i < oIDetails.length; i++) {
                        var oDetailss = oIDetails[i];
                        data += `
                            <div class="item-detail-outer"> <!-- Opening item-detail-outer -->
                                <div class="item-detail"> <!-- Opening item-detail -->
                        `;
                        
                        // Item Image
                        if (oDetailss.image) {
                            data += `
                                <div class="item-image"> <!-- Opening item-image -->
                                    <img src="https://cdn.uengage.io/uploads/${pId}/${oDetailss.image}" alt="Item image" width="400" height="400">
                                </div> <!-- Closing item-image -->
                            `;
                        }
                    
                        // Item Description
                        data += `
                                <div class="item-description-outer"> <!-- Opening item-description-outer -->
                                    <div class="top-description-main"> <!-- Opening top-description-main -->
                                        <div class="item-discription"> <!-- Opening item-discription -->
                                            <h4>
                                                <div> <!-- Opening veg/non-veg flag container -->
                        `;
                        var pName = oDetailss.parentName;
                        var cName=oDetailss.itemName;
                        if(oDetailss.parentName==null){
                             pName = cName;
                             cName = "";
                        }
                        // Veg/Non-Veg Flag
                        if (oDetailss.vegnonvegboth == 'veg') {
                            data += '<div class="veg-flag"><span></span></div>';
                        } else if (oDetailss.vegnonvegboth == 'non-veg') {
                            data += '<div class="non-vegflag"><span></span></div>';
                        }
                       

                        data += `
                                                </div> <!-- Closing veg/non-veg flag container -->
                                                <div>${pName}</div>
                                            </h4>`;
                           // Strike-through price if applicable
                        var strikeThr=``;
                           if (oDetailss.mrp != oDetailss.itemPrice && oDetailss.mrp != 0) {
                                strikeThr = `
                                                <small style="color: #848484; font-size: 85%;">
                                                    <s>${icon} ${oDetailss.mrp}</s>
                                                </small>
                                `;
                             }          
                           data+=`<div class="d-flex justify-content-between">
                                        <div>
                                    <p class="cName-width">${cName}</p>        
                                    </div>
                                        <div class="differnt-text item-price-inner" style="font-weight: 500;color: #000;">
                                        ${strikeThr} ${icon} ${oDetailss.subTotal}
                                                                            </div>
                                    </div>`;
                              
                        
                        data +=`</div> <!-- Closing item-discription -->
                                        <div class="item-end"> <!-- Opening item-end -->
                                            <h5>Qty: ${oDetailss.qty}</h5>
                                            
                        `;
                    
                      
                    
                        data += `</div> <!-- Closing item-end -->
                                    </div> <!-- Closing top-description-main -->
                        `;
                    
                        // Customization Section (Now Inside item-description-outer)
                        if (oDetailss.subItems && oDetailss.subItems.length > 0) {
                            data += `
                                    <div class="item-customization"> <!-- Opening item-customization -->
                                        <span style="color: #848484; margin-bottom: 3px; display: block; margin-top: 0px;">Customization</span>
                            `;
                            
                            // Loop through the customizations
                            for (var j = 0; j < oDetailss.subItems.length; j++) {
                                var subItem = oDetailss.subItems[j];
                                data += `
                                        <div class="item-discription-main" style="margin-bottom: 5px;"> <!-- Opening item-discription-main -->
                                            <span class="item-name"> <!-- Opening item-name -->
                                                <div>${subItem.itemName}</div>
                                            </span> <!-- Closing item-name -->
                                            <span class="item-price pr-0"> <!-- Opening item-price -->
                                                <div class="item-price-inner" style="font-weight: 500;">
                                                    <i class="la la-inr"></i>${parseFloat(subItem.subTotal).toFixed(2)}
                                                </div>
                                            </span> <!-- Closing item-price -->
                                        </div> <!-- Closing item-discription-main -->
                                `;
                            }
                    
                            data += '</div> <!-- Closing item-customization -->';
                        }
                    
                        data += `
                                </div> <!-- Closing item-description-outer -->
                                </div> <!-- Closing item-detail -->
                            </div> <!-- Closing item-detail-outer -->
                        `;
                    }
                    data += '</div> <!-- Closing item-details -->';
                    
                
            }
                
                
            }
            if (oDetails.deliveryCharges == 0) {
                oDelivery = '<span style="color: #3DA66E;">Yay! Free Delivery</span>';
            } else {
                oDelivery = '<span>' + icon + '' + oDetails.deliveryCharges + '</span>';
            }

            if (oDetails.packaging_charges > 0) {
                oPacking = '<span>' + icon + '' + oDetails.packaging_charges + '</span>';
            }

            if (oDetails.serviceCharges > 0) {
                oService = '<span>' + icon + '' + oDetails.serviceCharges + '</span>';
            }
            tax_breakup = '';
            if (oDetails.taxBreakUp.length > 0) {
                oDetails.taxBreakUp.forEach((taxDetail)=>{
                    tax_breakup += `<div class="col-7">
                                <p class="mb-0" style="font-size: 12px;line-height: 20px; text-align: left;">${taxDetail.title}</p>
                            </div>
                            <div class="col-5">
                                <p class="mb-0" style="font-size: 14px; line-height: 20px; font-weight: 600; text-align: right;"><i
                                        class="la la-inr"></i> <span id="cgst">${taxDetail.value}</span></p>
                            </div>`;
                })
            }
            data += '<table cellspacing="0" cellpadding="0" id="cart-table"><tr><td><span>';
            if(oDetails.cart_type!=2){
                data+='Subtotal';

            }else{
                data+='Bill Amount';

            }
            data+='</span></td><td class="text-right"><span><span id="subTotalSpan">' + icon + '' + parseFloat(oDetails.subTotal).toFixed(2) + '</span></span></td></tr>';
          
            if (oDetails.orderType == 1) {
                data += '<tr><td><span>Delivery Charges</span></td><td class="text-right"><span> ' + oDelivery + '</span></td></tr>';
            }
            if (oDetails.wallet_amount > 0) {
                data += '<tr><td><span style="color:green;">'+ oDetails.walletName +'</span></td><td class="text-right"><span> <span style="color:green; font-weight:600;"> - ' + icon + '' + oDetails.wallet_amount + '</span></span></td></tr>';
            }
            if (oDetails.discount > 0) {
                data += '<tr><td><span style="color:green;">Discount</span></td><td class="text-right"><span> <span style="color:green; font-weight:600;"> - ' + icon + '' + oDetails.discount + '</span></span></td></tr>';
            }
            if (oDetails.packaging_charges > 0) {
                data += '<tr><td><span>Packaging Charges</span></td><td class="text-right"><span> ' + oPacking + '</span></td></tr>';;
            }
            if (oDetails.serviceCharges > 0) {
                data += '<tr><td><span>Service Charges</span></td><td class="text-right"><span> ' + oService + '</span></td></tr>';;
            }
            if(oDetails.taxes!=0){
                data += `<tr>
                            <td><span class="position-relative">GST<span class="tooltipnew"><i class="las la-exclamation-circle"></i>
                                        <div class="tipcontent">
                                            <h5 style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">Restaurant GST Breakup</h5>
                                            <div class="row" id="splitGSTRow">
                                                ${tax_breakup}
                                            </div>
                                        </div>
                                    </span></span></td>
                            <td class="text-right"><span> <span>${icon}${oDetails.taxes}</span></span></td>
                        </tr>`;
                }
            // data += `</table></div>`;
            if(oDetails.cart_type!=2){
            data += '<tr id="total-li"><td><span>Grand Total</span></td><td class="text-right"><span> <span id="lastsubTotalspan" style="font-weight: 600;">' + icon + '' + oDetails.totalAmt + '</span></span></td></tr></table></div>';
             } else{
            data += '<tr id="total-li"><td><span>Amount Paid</span></td><td class="text-right"><span> <span id="lastsubTotalspan" style="font-weight: 600;">' + icon + '' + oDetails.totalAmt + '</span></span></td></tr></table></div>';
            }
            if(oDetails.categoryId == 4){
                data += '<h3 class="heading-common">Reservation Details</h3><div class="outlet-info-card"><table cellspacing="0" cellpadding="0" id="cart-table"></tr><tr><td><span>Reservation ID</span>#' + orderId + '</td><td><span>Date and Time</span>' + moment(oDetails.invoicedAt).format('YYYY-MM-DD hh:mm A') + '</td></tr><tr><td><span>Payment Method</span>' + oDetails.paymentMode + '</td><td><span>Payment Gateway</span>' + oDetails.pg + '</td></tr></div>';
            }else{
                data += '<h3 class="heading-common">Order Details</h3><div class="outlet-info-card pb-1"><ul class="info-points"> ';
                
              
                if(orderType != null && orderType!='' ){

                    if(oDetails.orderType==1){


                    data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none height=168 viewBox="0 0 168 168"width=168 xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M94.44 49.1869C92.6833 49.0053 90.41 49.0001 86.9559 49.0001H83.9999C81.6803 49.0001 79.7999 47.1197 79.7999 44.8001C79.7999 42.4805 81.6803 40.6001 83.9999 40.6001L87.1624 40.6001C90.3543 40.6 93.0643 40.5999 95.3039 40.8315C97.6885 41.078 99.8922 41.6134 101.974 42.9001C104.056 44.1868 105.52 45.9185 106.807 47.941C107.942 49.7243 109.08 51.9698 110.396 54.6001L116.862 54.6001C118.451 54.6 119.911 54.5999 121.127 54.7091C122.441 54.8272 123.874 55.0984 125.26 55.8903C126.781 56.7588 128.041 58.019 128.91 59.5398C129.702 60.9263 129.973 62.3588 130.091 63.6731C130.2 64.8892 130.2 66.3486 130.2 67.9381V68.1001L130.2 68.4616C130.204 69.9163 130.207 71.4737 129.735 72.9519C129.419 73.942 128.947 74.8755 128.338 75.7174C127.428 76.9743 126.171 77.8952 124.998 78.7553L124.707 78.9692L123.153 80.1142L125.88 85.5696C136.213 86.8859 144.2 95.7102 144.2 106.4C144.2 117.998 134.798 127.4 123.2 127.4C113.04 127.4 104.566 120.186 102.62 110.6H73.7798C71.8341 120.186 63.3595 127.4 53.1999 127.4C43.0226 127.4 34.5362 120.16 32.6099 110.55C27.9087 110.074 24.2025 106.301 23.8301 101.569C23.7993 101.178 23.7996 100.755 23.7998 100.348L23.7999 100.24L23.7999 100.027C23.7998 98.1505 23.7997 96.9574 23.8819 95.9131C24.9085 82.8691 35.2689 72.5087 48.3129 71.4821C49.3572 71.3999 50.5503 71.4 52.4265 71.4001L52.6399 71.4001L56.2911 71.4001C61.3226 71.3999 65.5182 71.3998 68.849 71.8476C72.3646 72.3203 75.5387 73.36 78.0893 75.9107C80.64 78.4613 81.6797 81.6354 82.1524 85.151C82.6002 88.4818 82.6001 92.6774 82.5999 97.7089L82.5999 102.2H102.62C104.144 94.6901 109.677 88.6354 116.887 86.3656L103.235 59.0608C101.69 55.9714 100.669 53.9404 99.7204 52.4504C98.8245 51.0424 98.1826 50.4316 97.558 50.0456C96.9335 49.6595 96.1 49.3586 94.44 49.1869ZM74.1999 102.2V98.0001C74.1999 92.6016 74.191 88.9753 73.8273 86.2703C73.4799 83.6861 72.8794 82.5801 72.1496 81.8504C71.4199 81.1206 70.3139 80.5201 67.7297 80.1727C65.0247 79.809 61.3984 79.8001 55.9999 79.8001H52.6399C50.4799 79.8001 49.6433 79.8034 48.9719 79.8562C40.0471 80.5586 32.9584 87.6473 32.256 96.5721C32.2032 97.2436 32.1999 98.0802 32.1999 100.24C32.1999 100.511 32.2 100.673 32.2017 100.795C32.2576 101.478 32.9222 102.142 33.605 102.198L74.1999 102.2ZM41.3169 110.6C43.0466 115.494 47.7138 119 53.1999 119C58.686 119 63.3532 115.494 65.0829 110.6H41.3169ZM110.6 106.4C110.6 99.4413 116.241 93.8001 123.2 93.8001C130.159 93.8001 135.8 99.4413 135.8 106.4C135.8 113.359 130.159 119 123.2 119C116.241 119 110.6 113.359 110.6 106.4ZM119.34 72.4895L119.725 72.2063C120.499 71.6357 120.935 71.3128 121.249 71.0509C121.443 70.8896 121.516 70.8121 121.534 70.7905C121.621 70.6704 121.688 70.5372 121.734 70.396C121.722 70.431 121.753 70.372 121.774 70.0129C121.798 69.6043 121.8 69.0621 121.8 68.1001C121.8 66.2947 121.796 65.2189 121.725 64.4247C121.681 63.9447 121.625 63.7444 121.606 63.6895C121.486 63.4849 121.315 63.3144 121.111 63.1939C121.056 63.1749 120.855 63.1185 120.375 63.0754C119.581 63.0041 118.505 63.0001 116.7 63.0001H114.596L119.34 72.4895Z"fill=#222222 fill-rule=evenodd /></svg></div><div><h4>Order Type</h4><p>'+ orderType+'</p></div></div></li>';
                    }else if(oDetails.orderType==2){
                        data+='<li>						<div class="inner-points">							<div class="point-svg">								<svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M83.9996 32.2C77.0408 32.2 71.3996 37.8413 71.3996 44.8001V46.2251C73.7376 46.2 76.2615 46.2 78.9889 46.2001H89.0102C91.7377 46.2 94.2616 46.2 96.5996 46.2251V44.8001C96.5996 37.8413 90.9584 32.2 83.9996 32.2ZM105 46.5189V44.8001C105 33.2021 95.5976 23.8 83.9996 23.8C72.4016 23.8 62.9996 33.2021 62.9996 44.8001V46.5189C62.2436 46.5741 61.514 46.6388 60.8098 46.7147C55.891 47.2448 51.7776 48.3554 48.1248 50.8591C46.8684 51.7202 45.6884 52.6876 44.5976 53.7507C41.4261 56.8416 39.5304 60.6573 38.0459 65.3766C36.6046 69.9585 35.4398 75.783 33.9761 83.1017L33.8692 83.6359C31.76 94.1815 30.098 102.491 29.6206 109.11C29.1329 115.873 29.8145 121.562 33.0179 126.493C34.0867 128.138 35.3342 129.659 36.7377 131.03C40.944 135.138 46.3892 136.922 53.1162 137.77C59.7001 138.6 68.1746 138.6 78.929 138.6H89.0702C99.8246 138.6 108.299 138.6 114.883 137.77C121.61 136.922 127.055 135.138 131.261 131.03C132.665 129.659 133.912 128.138 134.981 126.493C138.185 121.562 138.866 115.873 138.379 109.11C137.901 102.492 136.239 94.1817 134.13 83.6364L134.023 83.1019C132.559 75.7831 131.395 69.9586 129.953 65.3766C128.469 60.6573 126.573 56.8416 123.402 53.7507C122.311 52.6876 121.131 51.7202 119.874 50.8591C116.222 48.3554 112.108 47.2448 107.189 46.7147C106.485 46.6388 105.756 46.5741 105 46.5189ZM61.71 55.0663C57.5284 55.517 54.9451 56.3681 52.8737 57.7878C52.0141 58.377 51.2067 59.0389 50.4604 59.7663C48.662 61.519 47.3208 63.8852 46.0588 67.8972C44.7691 71.9971 43.6874 77.3766 42.1654 84.9869C39.9839 95.8941 38.4337 103.686 37.9989 109.714C37.57 115.661 38.2942 119.196 40.0617 121.916C40.793 123.042 41.6465 124.083 42.6068 125.021C44.9276 127.287 48.2514 128.69 54.1668 129.436C60.1638 130.192 68.1081 130.2 79.2313 130.2H88.7678C99.891 130.2 107.835 130.192 113.832 129.436C119.748 128.69 123.072 127.287 125.392 125.021C126.353 124.083 127.206 123.042 127.938 121.916C129.705 119.196 130.429 115.661 130 109.714C129.565 103.686 128.015 95.8941 125.834 84.9869C124.312 77.3767 123.23 71.9971 121.94 67.8972C120.678 63.8852 119.337 61.519 117.539 59.7663C116.792 59.0389 115.985 58.377 115.125 57.7878C113.054 56.3681 110.471 55.517 106.289 55.0663C102.016 54.6057 96.5287 54.6001 88.7678 54.6001H79.2313C71.4704 54.6001 65.9832 54.6057 61.71 55.0663ZM66.757 96.8401C68.944 96.0671 71.3435 97.2134 72.1165 99.4004C73.8483 104.3 78.5211 107.8 84.0007 107.8C89.4802 107.8 94.1531 104.3 95.8848 99.4004C96.6578 97.2134 99.0573 96.0671 101.244 96.8401C103.431 97.6131 104.578 100.013 103.805 102.2C100.924 110.35 93.1508 116.2 84.0007 116.2C74.8506 116.2 67.0775 110.35 64.1967 102.2C63.4237 100.013 64.57 97.6131 66.757 96.8401Z"fill=#222222 fill-rule=evenodd /></svg>							</div>							<div>								<h4>Order Type</h4>								<p>Pick Up</p>							</div>						</div>					</li>';
                    }else if(oDetails.orderType==3){
                        
                        data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path d="M37.7348 100.8V100.96H37.8948H63.0947C67.6253 100.96 71.3385 104.668 71.7547 108.788V138.18C71.7547 139.404 71.3476 140.411 70.6466 141.112C69.9457 141.813 68.9384 142.22 67.7147 142.22C66.4911 142.22 65.4838 141.813 64.7829 141.112C64.0819 140.411 63.6748 139.404 63.6748 138.18V121.38V121.22H63.5148H38.3148H38.1548V121.38V138.18C38.1548 139.404 37.7476 140.411 37.0466 141.112C36.3457 141.813 35.3384 142.22 34.1148 142.22C32.8911 142.22 31.8838 141.813 31.1829 141.112C30.4819 140.411 30.0747 139.404 30.0747 138.18V104.58C30.0747 93.2385 29.6551 81.042 25.8703 68.0019C25.6706 66.994 25.8726 65.8803 26.3796 64.9676C26.8876 64.0533 27.6927 63.3555 28.6861 63.1568C30.6984 62.7544 32.7257 63.9585 33.5429 65.9911C36.8957 78.1492 37.7348 90.3102 37.7348 100.8ZM63.0947 113.56H63.2547V113.4V109.2V109.04H63.0947H37.8948H37.7348V109.2V113.4V113.56H37.8948H63.0947ZM88.2948 92.24H88.1348V92.4V138.6C88.1348 139.824 87.7276 140.831 87.0266 141.532C86.3257 142.233 85.3184 142.64 84.0948 142.64C82.8711 142.64 81.8638 142.233 81.1629 141.532C80.4619 140.831 80.0548 139.824 80.0548 138.6V92.4V92.24H79.8948H50.4948C49.2711 92.24 48.2638 91.8328 47.5629 91.1318C46.8619 90.4309 46.4548 89.4236 46.4548 88.2C46.4548 86.9763 46.8619 85.969 47.5629 85.2681C48.2638 84.5671 49.2711 84.16 50.4948 84.16H117.695C118.918 84.16 119.926 84.5671 120.627 85.2681C121.328 85.969 121.735 86.9763 121.735 88.2C121.735 89.4236 121.328 90.4309 120.627 91.1318C119.926 91.8328 118.918 92.24 117.695 92.24H88.2948ZM135.069 65.9825L135.069 65.9826L135.072 65.9713C135.272 64.972 135.975 64.0621 136.888 63.504C137.801 62.9464 138.903 62.7514 139.895 63.1485C141.917 63.9573 143.147 65.9801 143.155 68.4366C139.374 81.0528 138.955 93.6643 138.955 105V138.6C138.955 139.824 138.548 140.831 137.847 141.532C137.146 142.233 136.138 142.64 134.915 142.64C133.691 142.64 132.684 142.233 131.983 141.532C131.282 140.831 130.875 139.824 130.875 138.6V121.8V121.64H130.715H105.515H105.355V121.8V138.6C105.355 139.824 104.948 140.831 104.247 141.532C103.546 142.233 102.538 142.64 101.315 142.64C100.091 142.64 99.0838 142.233 98.3829 141.532C97.6819 140.831 97.2747 139.824 97.2747 138.6V109.2C97.2747 104.668 100.983 100.96 105.515 100.96H130.715H130.875V100.8C130.875 90.3077 131.714 78.1435 135.069 65.9825ZM130.295 113.56H130.455V113.4V109.2V109.04H130.295H105.095H104.935V109.2V113.4V113.56H105.095H130.295ZM79.9287 38.3763L80.0548 38.3489V38.22V29.4C80.0548 28.1763 80.4619 27.169 81.1629 26.4681C81.8638 25.7671 82.8711 25.36 84.0948 25.36C85.3184 25.36 86.3257 25.7671 87.0266 26.4681C87.7276 27.169 88.1348 28.1763 88.1348 29.4V38.22V38.3489L88.2608 38.3763C97.8505 40.461 104.935 48.7985 104.935 58.8C104.935 60.0236 104.528 61.0309 103.827 61.7318C103.126 62.4328 102.118 62.84 100.895 62.84H67.2948C66.0711 62.84 65.0638 62.4328 64.3629 61.7318C63.6619 61.0309 63.2548 60.0236 63.2548 58.8C63.2548 48.7985 70.339 40.461 79.9287 38.3763ZM95.8548 54.76H96.0767L96.0065 54.5494C94.3027 49.4378 89.1968 46.04 83.6748 46.04C78.1464 46.04 73.4649 49.4436 71.763 54.5494L71.6928 54.76H71.9148H95.8548Z"fill=#222222 stroke=white stroke-width=0.32 /></svg></div><div><h4>Order Type</h4><p>'+ orderType+'</p></div></div></li>';
                    }else if(oDetails.orderType==4){
                        data+='<li>						<div class="inner-points">							<div class="point-svg">								<svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path d="M131.403 50.4842L131.403 50.94H131.859H136.668C139.059 50.94 141 52.8808 141 55.272C141 57.6631 139.059 59.604 136.668 59.604H127.073C124.682 59.604 122.741 57.6631 122.741 55.272V45.0975V45.0871L122.741 45.0768C122.708 44.3626 122.553 42.6483 121.854 41.0975C121.148 39.5328 119.843 38.058 117.516 38.058H50.4839C48.1555 38.058 46.8508 39.5342 46.1446 41.1254C45.4449 42.7021 45.289 44.4675 45.2544 45.2815L45.254 45.2913L45.254 45.3011L45.2586 55.272C45.2586 55.2721 45.2586 55.2721 45.2586 55.2722C45.2585 57.6632 43.3177 59.604 40.9266 59.604H31.3319C28.9408 59.604 26.9999 57.6631 26.9999 55.272C26.9999 52.8808 28.9408 50.94 31.3319 50.94H36.1386H36.5946V50.484V45.1071C36.8285 39.5953 38.6776 35.6745 41.258 33.1331C43.8429 30.5873 47.1931 29.394 50.4839 29.394H117.516C120.807 29.394 124.158 30.5875 126.743 33.1092C129.323 35.626 131.169 39.4959 131.401 44.9038L131.403 50.4842ZM40.9079 126.636H40.4519V127.092V134.274C40.4519 136.665 38.5111 138.606 36.1199 138.606H31.3319C28.9408 138.606 26.9999 136.665 26.9999 134.274V91.182C26.9999 78.2329 37.5349 67.698 50.4839 67.698H117.516C130.465 67.698 141 78.2329 141 91.182V134.274C141 136.665 139.059 138.606 136.668 138.606H131.88C129.489 138.606 127.548 136.665 127.548 134.274V127.092V126.636H127.092H40.9079ZM95.7135 76.9069L95.8218 76.362H95.2662H72.7337H72.1781L72.2864 76.9069C73.1272 81.1373 74.6894 84.7984 76.7126 87.4133C78.733 90.0245 81.2535 91.638 83.9999 91.638C86.7464 91.638 89.2669 90.0245 91.2873 87.4133C93.3105 84.7984 94.8727 81.1373 95.7135 76.9069ZM131.88 117.972H132.336V117.516V91.182C132.336 83.0082 125.69 76.362 117.516 76.362H104.984H104.592L104.533 76.7494C102.4 90.7569 94.135 100.302 83.9999 100.302C73.8648 100.302 65.5971 90.7568 63.467 76.7494L63.4081 76.362H63.0162H50.4839C42.3102 76.362 35.6639 83.0082 35.6639 91.182V117.516V117.972H36.1199H131.88ZM61.9979 100.758C61.9979 105.794 57.9144 109.878 52.8779 109.878C47.8415 109.878 43.7579 105.794 43.7579 100.758C43.7579 95.7215 47.8415 91.638 52.8779 91.638C57.9144 91.638 61.9979 95.7215 61.9979 100.758ZM124.242 100.758C124.242 105.794 120.158 109.878 115.122 109.878C110.085 109.878 106.002 105.794 106.002 100.758C106.002 95.7215 110.085 91.638 115.122 91.638C120.158 91.638 124.242 95.7215 124.242 100.758Z"fill=#222222 stroke=white stroke-width=0.912 /></svg>						</div>							<div>								<h4>Order Type</h4>								<p>In Car</p>							</div>						</div>					</li>';
                    }

                    if(oDetails.slotTimig !=null && oDetails.slotTimig !=''){
                        data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M51.7996 28C51.7996 25.6805 53.68 23.8 55.9996 23.8H112C114.319 23.8 116.2 25.6805 116.2 28C116.2 30.3196 114.319 32.2 112 32.2H55.9996C53.68 32.2 51.7996 30.3196 51.7996 28ZM83.7667 40.6H84.2325C91.9001 40.6 97.9755 40.6 102.827 41.0935C107.798 41.5992 111.948 42.6574 115.578 45.083C118.482 47.0237 120.976 49.5174 122.917 52.4219C125.342 56.0519 126.4 60.2017 126.906 65.1725C127.4 70.0241 127.4 76.0995 127.4 83.7671V84.233C127.4 91.9005 127.4 97.976 126.906 102.828C126.4 107.798 125.342 111.948 122.917 115.578C120.976 118.483 118.482 120.976 115.578 122.917C111.948 125.343 107.798 126.401 102.827 126.907C97.9755 127.4 91.9 127.4 84.2323 127.4H83.7669C76.0992 127.4 70.0237 127.4 65.1721 126.907C60.2013 126.401 56.0515 125.343 52.4214 122.917C49.517 120.976 47.0232 118.483 45.0825 115.578C42.657 111.948 41.5987 107.798 41.0931 102.828C40.5995 97.976 40.5996 91.9005 40.5996 84.2329V83.7672C40.5996 76.0996 40.5995 70.0241 41.0931 65.1725C41.5987 60.2017 42.657 56.0519 45.0825 52.4219C47.0232 49.5174 49.517 47.0237 52.4214 45.083C56.0515 42.6574 60.2013 41.5992 65.1721 41.0935C70.0237 40.6 76.0991 40.6 83.7667 40.6ZM66.0222 49.4504C61.7156 49.8885 59.108 50.7177 57.0882 52.0673C55.101 53.3951 53.3947 55.1014 52.0669 57.0887C50.7173 59.1084 49.888 61.716 49.4499 66.0227C49.0047 70.3995 48.9996 76.0476 48.9996 84C48.9996 91.9524 49.0047 97.6006 49.4499 101.977C49.888 106.284 50.7173 108.892 52.0669 110.911C53.3947 112.899 55.101 114.605 57.0882 115.933C59.108 117.282 61.7156 118.112 66.0222 118.55C70.3991 118.995 76.0472 119 83.9996 119C91.952 119 97.6002 118.995 101.977 118.55C106.284 118.112 108.891 117.282 110.911 115.933C112.898 114.605 114.605 112.899 115.932 110.911C117.282 108.892 118.111 106.284 118.549 101.977C118.995 97.6006 119 91.9524 119 84C119 76.0476 118.995 70.3995 118.549 66.0227C118.111 61.716 117.282 59.1084 115.932 57.0887C114.605 55.1014 112.898 53.3951 110.911 52.0673C108.891 50.7177 106.284 49.8885 101.977 49.4504C97.6002 49.0051 91.952 49 83.9996 49C76.0472 49 70.3991 49.0051 66.0222 49.4504ZM83.9996 62.9999C86.3192 62.9999 88.1996 64.8803 88.1996 67.1999V82.6426L98.1107 92.1724C99.7827 93.7802 99.8348 96.439 98.2271 98.111C96.6194 99.783 93.9606 99.8352 92.2886 98.2274L83.2368 89.5238C81.542 87.8943 80.6947 87.0795 80.2471 86.0283C79.7996 84.9771 79.7996 83.8016 79.7996 81.4505V67.1999C79.7996 64.8803 81.68 62.9999 83.9996 62.9999ZM51.7996 140C51.7996 137.68 53.68 135.8 55.9996 135.8H112C114.319 135.8 116.2 137.68 116.2 140C116.2 142.32 114.319 144.2 112 144.2H55.9996C53.68 144.2 51.7996 142.32 51.7996 140Z"fill=#222222 fill-rule=evenodd /></svg></div><div><h4>Delivery Slot</h4><p>'+oDetails.slotTimig+'</p></div></div></li>';
                    }
                    if (oDetails.gift_order == 1) {
                        data += `<li>
                        <div class="inner-points">
                            <div class="point-svg">
                                <svg fill=none height=168 viewBox="0 0 168 168"width=168 xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M83.9123 30.271C72.3319 30.2709 63.2565 30.2709 56.1756 31.2229C48.9278 32.1973 43.2087 34.2308 38.7197 38.7197C34.2308 43.2087 32.1973 48.9278 31.2229 56.1756C30.2709 63.2565 30.2709 72.3318 30.271 83.9122V84.488C30.2709 96.0684 30.2709 105.144 31.2229 112.225C32.1973 119.473 34.2308 125.192 38.7197 129.681C43.2087 134.17 48.9278 136.203 56.1756 137.177C63.2566 138.129 72.3319 138.129 83.9123 138.129H84.488C96.0684 138.129 105.144 138.129 112.225 137.177C119.473 136.203 125.192 134.17 129.681 129.681C134.17 125.192 136.203 119.473 137.177 112.225C138.129 105.144 138.129 96.0684 138.129 84.488V83.9123C138.129 72.3319 138.129 63.2566 137.177 56.1756C136.203 48.9278 134.17 43.2087 129.681 38.7197C125.192 34.2308 119.473 32.1973 112.225 31.2229C105.144 30.2709 96.0685 30.2709 84.4881 30.271H83.9123ZM80.4377 37.7974C70.4359 37.8079 62.993 37.899 57.1783 38.6808C50.7649 39.543 46.8985 41.183 44.0407 44.0407C41.183 46.8985 39.543 50.7649 38.6808 57.1783C37.899 62.993 37.8079 70.4359 37.7974 80.4377H58.6842C56.9235 78.2384 55.6079 75.6443 54.8906 72.7748C52.1903 61.9739 61.9739 52.1903 72.7748 54.8906C75.6443 55.6079 78.2384 56.9235 80.4377 58.6842V37.7974ZM37.7974 87.9627C37.8079 97.9645 37.899 105.407 38.6808 111.222C39.543 117.635 41.183 121.502 44.0407 124.36C46.8985 127.217 50.7649 128.857 57.1783 129.72C62.993 130.501 70.4359 130.592 80.4377 130.603V94.8538C76.5265 102.666 68.448 108.029 59.1168 108.029C57.0389 108.029 55.3543 106.345 55.3543 104.267C55.3543 102.189 57.0389 100.504 59.1168 100.504C66.8264 100.504 73.2861 95.1533 74.9847 87.9627H74.3429L74.2967 87.9627H37.7974ZM87.9627 130.603C97.9645 130.592 105.407 130.501 111.222 129.72C117.635 128.857 121.502 127.217 124.36 124.36C127.217 121.502 128.857 117.635 129.72 111.222C130.501 105.407 130.592 97.9645 130.603 87.9627H94.1037L94.0575 87.9627H93.4156C95.1142 95.1533 101.574 100.504 109.283 100.504C111.361 100.504 113.046 102.189 113.046 104.267C113.046 106.345 111.361 108.029 109.283 108.029C99.9523 108.029 91.8739 102.666 87.9627 94.8538V130.603ZM130.603 80.4377H109.716C111.477 78.2384 112.792 75.6443 113.51 72.7748C116.21 61.9739 106.427 52.1903 95.6255 54.8906C92.7561 55.6079 90.1619 56.9235 87.9627 58.6842V37.7974C97.9645 37.8079 105.407 37.899 111.222 38.6808C117.635 39.543 121.502 41.183 124.36 44.0407C127.217 46.8985 128.857 50.7649 129.72 57.1783C130.501 62.993 130.592 70.4359 130.603 80.4377ZM87.9627 80.4377L87.9627 74.3129C87.9762 68.5777 91.8842 63.5825 97.4506 62.1909C102.74 60.8684 107.532 65.66 106.209 70.9497C104.818 76.5141 99.8265 80.4211 94.094 80.4377H87.9627ZM80.4377 74.3047C80.4204 68.573 76.5136 63.5818 70.9498 62.1909C65.66 60.8684 60.8684 65.66 62.1909 70.9497C63.582 76.5141 68.5739 80.4211 74.3063 80.4377H80.4377V74.3047Z"fill=#222222 fill-rule=evenodd /></svg>
                            </div>
                            <div>
                                <h4>Gifted To</h4>
                                <p>${oDetails.gift_to}</p>
                            </div>
                        </div>
                    </li>`;
                    }
                    if(oDetails.paymentMode!='' && oDetails.paymentMode!=null){
                        data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M97.0182 37.8016C96.4347 37.8008 95.8284 37.8006 95.1979 37.8006L72.7979 37.8006C72.1674 37.8006 71.5611 37.8008 70.9776 37.8016C69.3071 46.0292 62.8264 52.5099 54.5988 54.1804C54.598 54.7639 54.5979 55.3702 54.5979 56.0006C54.5979 56.6311 54.598 57.2374 54.5988 57.8209C62.8264 59.4914 69.3071 65.9721 70.9776 74.1997C71.5611 74.2005 72.1674 74.2006 72.7979 74.2006H95.1979C95.8284 74.2006 96.4347 74.2005 97.0182 74.1997C98.6887 65.9721 105.169 59.4914 113.397 57.8209C113.398 57.2374 113.398 56.6311 113.398 56.0006C113.398 55.3702 113.398 54.7639 113.397 54.1804C105.169 52.5099 98.6887 46.0292 97.0182 37.8016ZM100.403 29.4189C98.8657 29.4005 97.2273 29.4006 95.4891 29.4006L72.5067 29.4006C70.7685 29.4006 69.1301 29.4005 67.5926 29.4189C67.4627 29.4068 67.331 29.4006 67.1979 29.4006C67.0221 29.4006 66.8488 29.4114 66.6787 29.4324C64.1431 29.4774 61.8979 29.5861 59.9488 29.8482C56.4332 30.3208 53.2591 31.3606 50.7085 33.9112C48.1578 36.4618 47.1181 39.6359 46.6454 43.1516C46.3834 45.1006 46.2747 47.3459 46.2297 49.8814C46.2087 50.0516 46.1979 50.2248 46.1979 50.4006C46.1979 50.5337 46.2041 50.6654 46.2162 50.7953C46.1978 52.3328 46.1978 53.9712 46.1979 55.7094V56.2918C46.1978 58.03 46.1978 59.6685 46.2162 61.206C46.2041 61.3359 46.1979 61.4676 46.1979 61.6006C46.1979 61.7765 46.2087 61.9497 46.2297 62.1199C46.2747 64.6554 46.3834 66.9007 46.6454 68.8497C47.1181 72.3654 48.1578 75.5395 50.7085 78.0901C53.2591 80.6407 56.4332 81.6805 59.9488 82.1531C61.8979 82.4152 64.1431 82.5238 66.6787 82.5689C66.8488 82.5898 67.0221 82.6006 67.1979 82.6006C67.331 82.6006 67.4626 82.5945 67.5926 82.5823C69.1301 82.6008 70.7685 82.6007 72.5067 82.6007H95.4894C97.2275 82.6007 98.8658 82.6008 100.403 82.5823C100.533 82.5945 100.665 82.6006 100.798 82.6006C100.974 82.6006 101.147 82.5898 101.317 82.5689C103.853 82.5238 106.098 82.4152 108.047 82.1531C111.563 81.6805 114.737 80.6407 117.287 78.0901C119.838 75.5395 120.878 72.3654 121.35 68.8497C121.612 66.9006 121.721 64.6554 121.766 62.1199C121.787 61.9497 121.798 61.7764 121.798 61.6006C121.798 61.4676 121.792 61.3359 121.78 61.206C121.798 59.6685 121.798 58.03 121.798 56.2918V55.7095C121.798 53.9713 121.798 52.3328 121.78 50.7953C121.792 50.6654 121.798 50.5337 121.798 50.4006C121.798 50.2248 121.787 50.0516 121.766 49.8814C121.721 47.3459 121.612 45.1006 121.35 43.1516C120.878 39.6359 119.838 36.4618 117.287 33.9112C114.737 31.3606 111.563 30.3208 108.047 29.8481C106.098 29.5861 103.853 29.4774 101.317 29.4324C101.147 29.4114 100.974 29.4006 100.798 29.4006C100.665 29.4006 100.533 29.4068 100.403 29.4189ZM105.805 38.0468C107.081 41.429 109.77 44.118 113.152 45.3938C113.115 45.002 113.073 44.6284 113.025 44.2708C112.678 41.6867 112.077 40.5807 111.348 39.8509C110.618 39.1211 109.512 38.5207 106.928 38.1732C106.57 38.1252 106.197 38.0833 105.805 38.0468ZM113.152 66.6075C109.77 67.8833 107.081 70.5723 105.805 73.9545C106.196 73.918 106.57 73.8761 106.928 73.828C109.512 73.4806 110.618 72.8802 111.348 72.1504C112.077 71.4206 112.678 70.3146 113.025 67.7304C113.073 67.3729 113.115 66.9993 113.152 66.6075ZM62.191 73.9545C60.9152 70.5723 58.2262 67.8833 54.8441 66.6075C54.8806 66.9993 54.9224 67.3729 54.9705 67.7305C55.3179 70.3146 55.9184 71.4206 56.6481 72.1504C57.3779 72.8802 58.4839 73.4806 61.0681 73.828C61.4256 73.8761 61.7993 73.918 62.191 73.9545ZM54.8441 45.3938C58.2262 44.118 60.9152 41.429 62.191 38.0468C61.7993 38.0833 61.4256 38.1252 61.0681 38.1732C58.4839 38.5207 57.3779 39.1211 56.6481 39.8509C55.9184 40.5807 55.3179 41.6867 54.9705 44.2708C54.9224 44.6284 54.8806 45.002 54.8441 45.3938ZM83.9979 54.6006C83.2247 54.6006 82.5979 55.2274 82.5979 56.0006C82.5979 56.7738 83.2247 57.4006 83.9979 57.4006C84.7711 57.4006 85.3979 56.7738 85.3979 56.0006C85.3979 55.2274 84.7711 54.6006 83.9979 54.6006ZM74.1979 56.0006C74.1979 50.5883 78.5855 46.2006 83.9979 46.2006C89.4103 46.2006 93.7979 50.5883 93.7979 56.0006C93.7979 61.413 89.4103 65.8006 83.9979 65.8006C78.5855 65.8006 74.1979 61.413 74.1979 56.0006ZM65.4278 97.7103C75.8764 95.6861 87.0615 96.1404 96.1121 101.539C97.3834 102.297 98.575 103.241 99.6147 104.409C101.72 106.774 102.807 109.712 102.858 112.658C103.929 111.967 105.002 111.2 106.092 110.377L116.212 102.732C121.278 98.905 128.64 98.9044 133.706 102.73C138.387 106.264 140.254 112.608 136.902 117.98C134.521 121.798 130.934 127.078 127.283 130.459C123.593 133.877 118.342 136.75 114.369 138.668C109.545 140.996 104.335 142.284 99.2679 143.104C88.9124 144.78 78.1371 144.523 67.8978 142.414C62.6652 141.336 57.2274 140.776 51.8535 140.776H39.1979C36.8783 140.776 34.9979 138.895 34.9979 136.576C34.9979 134.256 36.8783 132.376 39.1979 132.376H51.8535C57.8013 132.376 63.807 132.995 69.5928 134.187C78.8443 136.093 88.5904 136.323 97.9257 134.812C102.568 134.06 106.902 132.945 110.718 131.103C114.545 129.256 118.848 126.823 121.576 124.296C124.334 121.742 127.421 117.309 129.776 113.534C130.486 112.394 130.388 110.75 128.644 109.434C126.574 107.87 123.345 107.871 121.275 109.434L111.155 117.079C107.115 120.131 102.142 123.396 95.9747 124.38C95.3523 124.479 94.7041 124.57 94.0314 124.65C93.7107 124.708 93.3768 124.746 93.0318 124.759C89.8829 125.072 86.2363 125.145 82.213 124.765C79.9036 124.547 78.2083 122.498 78.4264 120.189C78.6444 117.879 80.6933 116.184 83.0026 116.402C86.5163 116.734 89.6686 116.66 92.3431 116.386C92.3974 116.38 92.4514 116.375 92.5053 116.369C92.617 116.304 92.7876 116.186 93.0115 115.99C94.8006 114.429 94.9603 111.814 93.3408 109.995C92.9303 109.534 92.4248 109.12 91.8092 108.753C85.1947 104.808 76.3608 104.148 67.0255 105.957C57.7433 107.755 48.5214 111.898 41.6275 116.787C39.7354 118.129 37.1138 117.683 35.772 115.791C34.4301 113.898 34.8762 111.277 36.7683 109.935C44.5991 104.382 54.9261 99.7449 65.4278 97.7103Z"fill=#222222 fill-rule=evenodd /></svg></div><div><h4>Payment Method</h4><p>'+oDetails.paymentMode+'</p></div></div></li>';
                    }

                    if(oDetails.pg!='' && oDetails.pg!=null && oDetails.pg!='cash'){
                        data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 rx=83.25 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><g clip-path=url(#clip0_622_11154)><path clip-rule=evenodd d="M72.4814 35.0005H95.5133C105.805 35.0004 113.956 35.0003 120.336 35.858C126.901 36.7408 132.216 38.6006 136.406 42.7915C140.204 46.5887 142.092 51.314 143.069 57.0708C143.782 61.2733 144.042 66.2461 144.139 72.097C144.177 72.3257 144.197 72.5608 144.197 72.8005C144.197 72.9982 144.184 73.1927 144.157 73.3831C144.177 74.987 144.187 76.6547 144.192 78.3882C144.199 80.7078 142.324 82.5937 140.004 82.6005C137.685 82.6073 135.799 80.7324 135.792 78.4128C135.791 77.9348 135.789 77.4641 135.787 77.0005H32.2085C32.1979 79.1755 32.1974 81.5034 32.1974 84.0005C32.1974 94.6787 32.2063 102.265 32.98 108.02C33.7375 113.654 35.158 116.9 37.528 119.27C39.898 121.64 43.144 123.06 48.7781 123.818C54.533 124.592 62.1192 124.6 72.7974 124.6H81.1974C83.517 124.6 85.3974 126.481 85.3974 128.8C85.3974 131.12 83.517 133 81.1974 133H72.4815C62.19 133.001 54.0384 133.001 47.6588 132.143C41.0933 131.26 35.7792 129.4 31.5883 125.21C27.3975 121.019 25.5376 115.705 24.6549 109.139C23.7972 102.759 23.7973 94.6079 23.7974 84.3164V83.6846C23.7973 79.9787 23.7973 76.5503 23.8373 73.3822C23.811 73.1921 23.7974 72.9979 23.7974 72.8005C23.7974 72.5606 23.8175 72.3254 23.8561 72.0965C23.941 67.0163 24.1483 62.63 24.6549 58.862C25.5376 52.2964 27.3975 46.9823 31.5883 42.7915C35.7792 38.6006 41.0933 36.7408 47.6588 35.858C54.0384 35.0003 62.19 35.0004 72.4814 35.0005ZM32.3434 68.6005H135.651C135.517 64.5975 135.264 61.2858 134.787 58.4759C133.987 53.7615 132.623 50.8872 130.467 48.7311C128.097 46.3612 124.851 44.9406 119.217 44.1831C113.462 43.4094 105.876 43.4005 95.1974 43.4005H72.7974C62.1192 43.4005 54.533 43.4094 48.7781 44.1831C43.144 44.9406 39.898 46.3612 37.528 48.7311C35.158 51.1011 33.7375 54.3471 32.98 59.9812C32.6446 62.476 32.4529 65.3148 32.3434 68.6005ZM103.597 91.0005C105.917 91.0005 107.797 92.8809 107.797 95.2005V118.661L111.828 114.631C113.468 112.99 116.127 112.99 117.767 114.631C119.407 116.271 119.407 118.93 117.767 120.57L106.567 131.77C104.927 133.411 102.268 133.411 100.628 131.77L89.4275 120.57C87.7873 118.93 87.7873 116.271 89.4275 114.631C91.0677 112.99 93.727 112.99 95.3672 114.631L99.3974 118.661V95.2005C99.3974 92.8809 101.278 91.0005 103.597 91.0005ZM125.828 92.2306C127.468 90.5904 130.127 90.5904 131.767 92.2306L142.967 103.431C144.607 105.071 144.607 107.73 142.967 109.37C141.327 111.011 138.668 111.011 137.028 109.37L132.997 105.34V128.8C132.997 131.12 131.117 133 128.797 133C126.478 133 124.597 131.12 124.597 128.8V105.34L120.567 109.37C118.927 111.011 116.268 111.011 114.628 109.37C112.987 107.73 112.987 105.071 114.628 103.431L125.828 92.2306ZM46.1974 106.4C46.1974 104.081 48.0778 102.2 50.3974 102.2H72.7974C75.117 102.2 76.9974 104.081 76.9974 106.4C76.9974 108.72 75.117 110.6 72.7974 110.6H50.3974C48.0778 110.6 46.1974 108.72 46.1974 106.4Z"fill=#222222 fill-rule=evenodd /></g><defs><clipPath id=clip0_622_11154><rect height=134.4 width=134.4 fill=white transform="translate(16.7998 16.8)"/></clipPath></defs></svg></div><div><h4>Payment Gateway</h4><p>'+oDetails.pg+'</p></div></div></li>';
                       }
                       if (oDetails.orderType == 3 && oDetails.tableNo!='' && oDetails.tableNo!=null && oDetails.tableNo!= 0) {
                        data += '<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M100.443 33.5699C89.5601 31.7434 78.4391 31.7434 67.5567 33.5699L65.3304 33.9435C54.9296 35.6892 47.8949 45.0697 49.144 55.1327L49.245 55.946C49.3394 56.7066 50.0333 57.4 50.9999 57.4H67.1103C67.1669 57.3989 67.2237 57.3989 67.2806 57.4H100.719C100.776 57.3989 100.832 57.3989 100.889 57.4H116.999C117.966 57.4 118.66 56.7066 118.754 55.946L118.855 55.1327L123.023 55.6501L118.855 55.1327C120.104 45.0696 113.07 35.6892 102.669 33.9435L100.443 33.5699ZM105.995 65.8H116.999C122.066 65.8 126.457 62.0841 127.09 56.9807L122.922 56.4633L127.09 56.9807L127.191 56.1675C129.013 41.4905 118.748 28.1247 104.059 25.6594L101.833 25.2858C90.03 23.3048 77.9692 23.3048 66.1663 25.2858L63.94 25.6594C49.2511 28.1247 38.9861 41.4905 40.808 56.1675L40.9089 56.9807C41.5424 62.0841 45.9328 65.8 50.9999 65.8H62.0043L52.6462 109.471C52.1148 110.174 51.7996 111.05 51.7996 112C51.7996 112.321 51.8357 112.634 51.904 112.935L46.2928 139.12C45.8068 141.388 47.2515 143.621 49.5196 144.107C51.7877 144.593 54.0203 143.148 54.5064 140.88L59.7949 116.2H108.204L113.493 140.88C113.979 143.148 116.212 144.593 118.48 144.107C120.748 143.621 122.192 141.388 121.706 139.12L116.095 112.935C116.164 112.634 116.2 112.321 116.2 112C116.2 111.05 115.884 110.174 115.353 109.471L105.995 65.8ZM97.4043 65.8H70.5949L61.5949 107.8H106.404L97.4043 65.8Z"fill=#222222 fill-rule=evenodd /></svg></div><div><h4>Table Number</h4><p>' + oDetails.tableNo + '</p></div></div></li>';
                    }
                    if(oDetails.orderType==4){
                        data+='<li>						<div class="inner-points">							<div class="point-svg">								<svg fill=none viewBox="0 0 168 168"width=168 xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M83.9998 32.2C55.3915 32.2 32.1998 55.3917 32.1998 84C32.1998 112.608 55.3915 135.8 83.9998 135.8C112.608 135.8 135.8 112.608 135.8 84C135.8 55.3917 112.608 32.2 83.9998 32.2ZM23.7998 84C23.7998 50.7525 50.7523 23.8 83.9998 23.8C117.247 23.8 144.2 50.7525 144.2 84C144.2 117.248 117.247 144.2 83.9998 144.2C50.7523 144.2 23.7998 117.248 23.7998 84ZM54.8975 79.8H69.1795C69.884 77.3091 71.1996 75.0747 72.9542 73.2691L65.8124 60.8992C60.0229 65.4636 55.9907 72.1578 54.8975 79.8ZM73.0836 56.6933L80.2268 69.0656C81.4341 68.7616 82.6981 68.6 83.9998 68.6C85.3014 68.6 86.5653 68.7615 87.7725 69.0655L94.9157 56.6932C91.5407 55.3428 87.857 54.6 83.9998 54.6C80.1425 54.6 76.4587 55.3429 73.0836 56.6933ZM102.187 60.899L95.0452 73.2688C96.7999 75.0745 98.1155 77.309 98.8201 79.8H113.102C112.009 72.1577 107.977 65.4634 102.187 60.899ZM113.102 88.2H98.8201C98.1155 90.6913 96.7997 92.9258 95.0449 94.7316L102.187 107.101C107.976 102.537 112.009 95.8426 113.102 88.2ZM94.9153 111.307L87.7721 98.9347C86.565 99.2386 85.3013 99.4 83.9998 99.4C82.6982 99.4 81.4343 99.2386 80.2271 98.9346L73.0839 111.307C76.4589 112.657 80.1426 113.4 83.9998 113.4C87.8569 113.4 91.5404 112.657 94.9153 111.307ZM65.8127 107.101L72.9544 94.7313C71.1998 92.9256 69.8841 90.6911 69.1795 88.2H54.8975C55.9907 95.8424 60.023 102.537 65.8127 107.101ZM80.5611 90.0986C80.5407 90.0864 80.5203 90.0744 80.4997 90.0625C80.4801 90.0512 80.4605 90.04 80.4408 90.0291C78.3811 88.8106 76.9998 86.5666 76.9998 84C76.9998 81.4428 78.3711 79.2058 80.4184 77.9844C80.4456 77.9694 80.4728 77.9541 80.4998 77.9385C80.5284 77.922 80.5566 77.9053 80.5847 77.8882C81.5949 77.3225 82.7597 77 83.9998 77C85.2341 77 86.3939 77.3195 87.4008 77.8803C87.4332 77.9002 87.466 77.9198 87.4992 77.9389C87.5309 77.9572 87.5628 77.9751 87.5947 77.9924C89.6346 79.2157 90.9998 81.4484 90.9998 84C90.9998 86.5732 89.6114 88.8221 87.5428 90.0385C87.5285 90.0466 87.5141 90.0547 87.4998 90.063C87.4841 90.072 87.4685 90.0812 87.453 90.0904C86.4341 90.6694 85.2556 91 83.9998 91C82.75 91 81.5767 90.6725 80.5611 90.0986ZM46.1998 84C46.1998 63.1237 63.1234 46.2 83.9998 46.2C104.876 46.2 121.8 63.1237 121.8 84C121.8 104.876 104.876 121.8 83.9998 121.8C63.1234 121.8 46.1998 104.876 46.1998 84Z"fill=#222222 fill-rule=evenodd /></svg></div>							<div>								<h4>Car Number</h4>								<p>'+ oDetails.carNumber +'</p>							</div>						</div>					</li>';
                    }
                    if(oDetails.transaction_id!='' && oDetails.transaction_id !=null){


                        data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M79.6067 51.9772C81.8284 52.6437 83.0892 54.9851 82.4227 57.2069L79.0047 68.6H98.2349L102.377 54.7932C103.043 52.5714 105.385 51.3106 107.607 51.9772C109.828 52.6437 111.089 54.9851 110.423 57.2069L107.005 68.6H117.6C119.919 68.6 121.8 70.4805 121.8 72.8C121.8 75.1196 119.919 77 117.6 77H104.485L100.285 91H112C114.319 91 116.2 92.8805 116.2 95.2C116.2 97.5196 114.319 99.4 112 99.4H97.7647L93.6227 113.207C92.9561 115.429 90.6147 116.689 88.3929 116.023C86.1712 115.356 84.9104 113.015 85.5769 110.793L88.9949 99.4H69.7647L65.6227 113.207C64.9561 115.429 62.6147 116.689 60.3929 116.023C58.1712 115.356 56.9104 113.015 57.5769 110.793L60.9949 99.4H50.3998C48.0802 99.4 46.1998 97.5196 46.1998 95.2C46.1998 92.8805 48.0802 91 50.3998 91H63.5149L67.7149 77H55.9998C53.6802 77 51.7998 75.1196 51.7998 72.8C51.7998 70.4805 53.6802 68.6 55.9998 68.6H70.2349L74.3769 54.7932C75.0435 52.5714 77.3849 51.3106 79.6067 51.9772ZM76.4847 77H95.7149L91.5149 91H72.2847L76.4847 77Z"fill=#222222 fill-rule=evenodd /><path clip-rule=evenodd d="M83.9998 23.8C50.7523 23.8 23.7998 50.7525 23.7998 84C23.7998 117.248 50.7523 144.2 83.9998 144.2C117.247 144.2 144.2 117.248 144.2 84C144.2 50.7525 117.247 23.8 83.9998 23.8ZM32.1998 84C32.1998 55.3917 55.3915 32.2 83.9998 32.2C112.608 32.2 135.8 55.3917 135.8 84C135.8 112.608 112.608 135.8 83.9998 135.8C55.3915 135.8 32.1998 112.608 32.1998 84Z"fill=#222222 fill-rule=evenodd /></svg></div><div><h4>Payment ID</h4><p style="word-break: break-word;">'+oDetails.transaction_id+'</p></div></div></li>';
                        if(oDetails.deliveredTime != null){

                            // data += '<li><div class="inner-points"><div class="point-svg"><svg fill="none" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" fill="white" r="14.5" stroke="#EEEEEE"></circle><path d="M18.9375 22.875C21.1121 22.875 22.875 21.1121 22.875 18.9375C22.875 16.7629 21.1121 15 18.9375 15C16.7629 15 15 16.7629 15 18.9375C15 21.1121 16.7629 22.875 18.9375 22.875Z" stroke="var(--main-bg-color)" stroke-miterlimit="10" stroke-width="0.5625"></path><path d="M22.875 18.9375V9.9375C22.875 9.78832 22.8157 9.64524 22.7102 9.53975C22.6048 9.43426 22.4617 9.375 22.3125 9.375H7.6875C7.53832 9.375 7.39524 9.43426 7.28975 9.53975C7.18426 9.64524 7.125 9.78832 7.125 9.9375V22.3125C7.125 22.4617 7.18426 22.6048 7.28975 22.7102C7.39524 22.8157 7.53832 22.875 7.6875 22.875H18.9375" stroke="var(--main-bg-color)" stroke-miterlimit="10" stroke-width="0.5625"></path><path d="M8.25 9.375V7.6875C8.25 7.53832 8.30926 7.39524 8.41475 7.28975C8.52024 7.18426 8.66332 7.125 8.8125 7.125C8.96168 7.125 9.10476 7.18426 9.21025 7.28975C9.31574 7.39524 9.375 7.53832 9.375 7.6875V10.5C9.375 10.6492 9.31574 10.7923 9.21025 10.8977C9.10476 11.0032 8.96168 11.0625 8.8125 11.0625H8.25M12.1875 9.375V7.6875C12.1875 7.53832 12.2468 7.39524 12.3523 7.28975C12.4577 7.18426 12.6008 7.125 12.75 7.125C12.8992 7.125 13.0423 7.18426 13.1477 7.28975C13.2532 7.39524 13.3125 7.53832 13.3125 7.6875V10.5C13.3125 10.6492 13.2532 10.7923 13.1477 10.8977C13.0423 11.0032 12.8992 11.0625 12.75 11.0625H12.1875M16.6875 9.375V7.6875C16.6875 7.53832 16.7468 7.39524 16.8523 7.28975C16.9577 7.18426 17.1008 7.125 17.25 7.125C17.3992 7.125 17.5423 7.18426 17.6477 7.28975C17.7532 7.39524 17.8125 7.53832 17.8125 7.6875V10.5C17.8125 10.6492 17.7532 10.7923 17.6477 10.8977C17.5423 11.0032 17.3992 11.0625 17.25 11.0625H16.6875M20.625 9.375V7.6875C20.625 7.53832 20.6843 7.39524 20.7898 7.28975C20.8952 7.18426 21.0383 7.125 21.1875 7.125C21.3367 7.125 21.4798 7.18426 21.5852 7.28975C21.6907 7.39524 21.75 7.53832 21.75 7.6875V10.5C21.75 10.6492 21.6907 10.7923 21.5852 10.8977C21.4798 11.0032 21.3367 11.0625 21.1875 11.0625H20.625M8.8125 14.4375H9.9375M11.625 14.4375H12.75M8.8125 16.6875H9.9375M11.625 16.6875H12.75M8.8125 18.9375H9.9375M11.625 18.9375H12.75M8.8125 21.1875H9.9375M11.625 21.1875H12.75M14.4375 14.4375H15.5625M17.25 20.0625L18.9375 18.9375V16.125M22.875 12.75H7.125" stroke="var(--main-bg-color)" stroke-miterlimit="10" stroke-width="0.5625"></path></svg></div><div><h4>Date and Time</h4><p>'+ moment(oDetails.deliveredTime).format('Do MMM')+' '+ moment(oDetails.deliveredTime).format('hh:mm A') +'</p></div></div></li>'
                        }
                        }
                        data+='</ul></div>';
                    }
                    // if(){

                // }
            }
            if (oDetails.comments != 0 || oDetails.orderType == 1) {
                data += '<div class="order-status-div"><ul>';


                if (oDetails.comments == 0 || oDetails.comments == null) {
                    data += '';
                } else {
                    data += '<div class="outlet-info-card"><ul class="info-points" style="margin: 0px !important;">';
                    data += '<li style="max-width: 100%;margin-bottom: 0px;padding: 0px;"><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path d="M118.608 61.82L121.203 59.2247C125.503 54.9248 132.475 54.9248 136.775 59.2247C141.075 63.5247 141.075 70.4963 136.775 74.7963L134.18 77.3916M118.608 61.82C118.608 61.82 118.933 67.3349 123.799 72.201C128.665 77.0672 134.18 77.3916 134.18 77.3916M118.608 61.82L94.7487 85.6795C93.1327 87.2955 92.3246 88.1036 91.6297 88.9945C90.81 90.0455 90.1072 91.1826 89.5338 92.3858C89.0477 93.4058 88.6863 94.4899 87.9636 96.6581L85.6497 103.6L84.9011 105.846M134.18 77.3916L110.32 101.251C108.704 102.867 107.896 103.675 107.005 104.37C105.954 105.19 104.817 105.893 103.614 106.466C102.594 106.952 101.51 107.313 99.3417 108.036L92.4 110.35L90.1542 111.099M90.1542 111.099L87.9084 111.847C86.8414 112.203 85.665 111.925 84.8698 111.13C84.0745 110.335 83.7968 109.158 84.1525 108.091L84.9011 105.846M90.1542 111.099L84.9011 105.846"stroke=#222222 stroke-width=6.95172 /><path d="M61.5991 89.5996H75.5991"stroke=#222222 stroke-width=6.95172 stroke-linecap=round /><path d="M61.5991 67.2H97.9991"stroke=#222222 stroke-width=6.95172 stroke-linecap=round /><path d="M61.5991 112H69.9991"stroke=#222222 stroke-width=6.95172 stroke-linecap=round /><path d="M127.839 34.5613C121.278 28.0005 110.719 28.0005 89.5996 28.0005H78.3996C57.2807 28.0005 46.7212 28.0005 40.1604 34.5613C33.5996 41.1221 33.5996 51.6816 33.5996 72.8005V95.2005C33.5996 116.319 33.5996 126.879 40.1604 133.44C46.7212 140 57.2807 140 78.3996 140H89.5996C110.719 140 121.278 140 127.839 133.44C133.12 128.158 134.15 120.286 134.351 106.4"stroke=#222222 stroke-width=6.95172 stroke-linecap=round /></svg></div><div><h4>Special Instruction</h4><p>'  + oDetails.comments + '</p></div></li></ul></div>';
                   
                }
            }
                if (oDetails.orderType == 1) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>Delivery Address</span>' + oDetails.addressLine1 + ', ' + oDetails.addressLine2 + ', ' + oDetails.locality + ', ' + oDetails.city + '</div></li>'
                data += '<div class="order-status-div"><ul>';
                data += '<div class="outlet-info-card"><ul class="info-points" style="margin: 0px !important;">';
                  data += '<li style="max-width: 100%;margin-bottom: 0px;padding: 0px;"><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 rx=83.25 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><g clip-path=url(#clip0_622_11159)><path d="M125.998 114.8C125.998 117.893 123.491 120.4 120.398 120.4C117.306 120.4 114.798 117.893 114.798 114.8C114.798 111.707 117.306 109.2 120.398 109.2C123.491 109.2 125.998 111.707 125.998 114.8Z"fill=#222222 /><path d="M53.1983 47.6003C53.1983 50.6931 50.6911 53.2003 47.5983 53.2003C44.5055 53.2003 41.9983 50.6931 41.9983 47.6003C41.9983 44.5075 44.5055 42.0003 47.5983 42.0003C50.6911 42.0003 53.1983 44.5075 53.1983 47.6003Z"fill=#222222 /><path d="M23.7983 46.2413C23.7983 33.5683 34.7433 23.8003 47.5983 23.8003C60.4534 23.8003 71.3983 33.5683 71.3983 46.2413C71.3983 57.5884 64.4218 70.9807 52.833 75.9332C49.5035 77.356 45.6931 77.356 42.3637 75.9332C30.7749 70.9807 23.7983 57.5884 23.7983 46.2413ZM47.5983 32.2003C38.8038 32.2003 32.1983 38.7658 32.1983 46.2413C32.1983 54.8847 37.7331 64.8194 45.6646 68.2089C46.8857 68.7307 48.311 68.7307 49.5321 68.2089C57.4636 64.8194 62.9983 54.8847 62.9983 46.2413C62.9983 38.7658 56.3929 32.2003 47.5983 32.2003ZM79.7983 44.8003C79.7983 42.4807 81.6787 40.6003 83.9983 40.6003H107.137C122.544 40.6003 128.403 60.7211 115.405 68.9927L57.1017 106.095C51.1934 109.854 53.8567 119 60.8598 119H73.8586L72.6285 117.77C70.9883 116.13 70.9883 113.471 72.6285 111.83C74.2687 110.19 76.928 110.19 78.5682 111.83L86.9682 120.23C88.6084 121.871 88.6084 124.53 86.9682 126.17L78.5682 134.57C76.928 136.21 74.2687 136.21 72.6285 134.57C70.9883 132.93 70.9883 130.271 72.6285 128.63L73.8586 127.4H60.8598C45.4528 127.4 39.5938 107.279 52.5919 99.0079L110.895 61.9059C116.803 58.1461 114.14 49.0003 107.137 49.0003H83.9983C81.6787 49.0003 79.7983 47.1199 79.7983 44.8003ZM96.5983 113.441C96.5983 100.768 107.543 91.0003 120.398 91.0003C133.253 91.0003 144.198 100.768 144.198 113.441C144.198 124.788 137.222 138.181 125.633 143.133C122.304 144.556 118.493 144.556 115.164 143.133C103.575 138.181 96.5983 124.788 96.5983 113.441ZM120.398 99.4003C111.604 99.4003 104.998 105.966 104.998 113.441C104.998 122.085 110.533 132.019 118.465 135.409C119.686 135.931 121.111 135.931 122.332 135.409C130.264 132.019 135.798 122.085 135.798 113.441C135.798 105.966 129.193 99.4003 120.398 99.4003Z"fill=#222222 clip-rule=evenodd fill-rule=evenodd /></g><defs><clipPath id=clip0_622_11159><rect height=134.4 width=134.4 fill=white transform="translate(16.7998 16.8)"/></clipPath></defs></svg></div><div><h4>Delivery Address</h4><p>' + oDetails.addressLine1 + ', ' + oDetails.addressLine2 +', '+ oDetails.locality + ', '+ oDetails.city + '</p></div></li></ul></div>';
                   
                }

                if(oDetails.latitude != null && oDetails.longitude!=null && oDetails.orderType!=1 && oDetails.orderType!=4){
                    data+=`<div class="order-status-div"><ul><div class="outlet-info-card"><ul class="info-points" style="margin: 0px !important;"><li style="max-width: 100%;margin-bottom: 0px;padding: 0px;"><div class="inner-points"><div style="display: flex;align-items: center;width: 90%;"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 fill=white /><rect height=166.5 rx=83.25 width=166.5 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><path clip-rule=evenodd d="M58.4373 23.8001H109.562C112.754 23.8 115.464 23.7999 117.703 24.0314C120.088 24.278 122.292 24.8133 124.374 26.1C126.456 27.3867 127.92 29.1184 129.207 31.141C130.416 33.0406 131.627 35.4647 133.055 38.3197L133.147 38.5042C133.202 38.6131 133.251 38.7243 133.296 38.8375L141.156 58.7071C142.092 61.0714 143.128 64.0209 143.431 67.0392C143.741 70.1265 143.316 73.6632 140.896 76.7307C138.918 79.2398 136.166 81.1231 133 82.0196V135.8H140C142.319 135.8 144.2 137.68 144.2 140C144.2 142.32 142.319 144.2 140 144.2H27.9998C25.6802 144.2 23.7998 142.32 23.7998 140C23.7998 137.68 25.6802 135.8 27.9998 135.8H34.9998V82.0198C31.8328 81.1235 29.0813 79.24 27.1024 76.7306C24.6834 73.6632 24.258 70.1264 24.568 67.0392C24.8711 64.0209 25.9076 61.0714 26.8429 58.7071L34.7031 38.8375C34.7479 38.7243 34.7976 38.6131 34.852 38.5042L34.9444 38.3195C36.3717 35.4645 37.5836 33.0405 38.7923 31.141C40.0792 29.1184 41.5436 27.3867 43.6255 26.1C45.7075 24.8133 47.9112 24.278 50.2958 24.0314C52.5353 23.7999 55.2454 23.8 58.4373 23.8001ZM117.599 77.7699C119.481 79.7628 121.888 81.2537 124.6 82.0205V135.8H102.2L102.2 120.22C102.2 117.757 102.2 115.632 102.042 113.889C101.875 112.046 101.505 110.22 100.512 108.5C99.4058 106.585 97.8152 104.994 95.8998 103.888C94.1794 102.895 92.3541 102.525 90.5106 102.358C88.7674 102.2 86.6431 102.2 84.1803 102.2H83.8194C81.3566 102.2 79.2322 102.2 77.489 102.358C75.6455 102.525 73.8202 102.895 72.0998 103.888C70.1844 104.994 68.5938 106.585 67.4879 108.5C66.4946 110.22 66.1247 112.046 65.9576 113.889C65.7996 115.632 65.7997 117.757 65.7998 120.219L65.7998 135.8H43.3998V82.0202C46.1109 81.2533 48.5181 79.7626 50.3993 77.7699C53.2071 80.744 57.1864 82.6001 61.5993 82.6001C66.0122 82.6001 69.9916 80.744 72.7993 77.7699C75.6071 80.744 79.5864 82.6001 83.9993 82.6001C88.4122 82.6001 92.3916 80.744 95.1993 77.7699C98.0071 80.744 101.986 82.6001 106.399 82.6001C110.812 82.6001 114.792 80.744 117.599 77.7699ZM74.1998 135.8H93.7998V120.4C93.7998 117.706 93.7958 115.966 93.6763 114.647C93.562 113.387 93.3692 112.929 93.2371 112.7C92.8685 112.062 92.3383 111.531 91.6998 111.163C91.471 111.031 91.0132 110.838 89.7524 110.724C88.4339 110.604 86.694 110.6 83.9998 110.6C81.3056 110.6 79.5657 110.604 78.2472 110.724C76.9864 110.838 76.5286 111.031 76.2998 111.163C75.6613 111.531 75.1311 112.062 74.7625 112.7C74.6304 112.929 74.4376 113.387 74.3233 114.647C74.2038 115.966 74.1998 117.706 74.1998 120.4V135.8ZM54.5993 67.2001C54.5993 71.0661 57.7333 74.2001 61.5993 74.2001C65.4653 74.2001 68.5993 71.0661 68.5993 67.2001C68.5993 64.8805 70.4797 63.0001 72.7993 63.0001C75.1189 63.0001 76.9993 64.8805 76.9993 67.2001C76.9993 71.0661 80.1333 74.2001 83.9993 74.2001C87.8653 74.2001 90.9993 71.0661 90.9993 67.2001C90.9993 64.8805 92.8797 63.0001 95.1993 63.0001C97.5189 63.0001 99.3993 64.8805 99.3993 67.2001C99.3993 71.0661 102.533 74.2001 106.399 74.2001C110.265 74.2001 113.399 71.0661 113.399 67.2001C113.399 64.8805 115.28 63.0001 117.599 63.0001C119.919 63.0001 121.799 64.8805 121.799 67.2001C121.799 71.0661 124.933 74.2001 128.799 74.2001C131.028 74.2001 133.012 73.1634 134.301 71.5291C134.939 70.7201 135.247 69.6133 135.073 67.8784C134.892 66.0746 134.226 64.0235 133.345 61.7971L125.552 42.0974C124.053 39.0995 123.051 37.114 122.12 35.6503C121.224 34.2424 120.582 33.6315 119.957 33.2455C119.333 32.8595 118.499 32.5585 116.839 32.3869C115.083 32.2052 112.809 32.2001 109.355 32.2001H58.6438C55.1897 32.2001 52.9164 32.2052 51.1597 32.3869C49.4997 32.5585 48.6662 32.8595 48.0417 33.2455C47.4171 33.6315 46.7752 34.2424 45.8793 35.6503C44.948 37.114 43.9461 39.0995 42.4469 42.0974L34.6539 61.7971C33.7731 64.0235 33.1071 66.0746 32.926 67.8785C32.7518 69.6134 33.0603 70.7202 33.6983 71.5293C34.9869 73.1634 36.9708 74.2001 39.1993 74.2001C43.0653 74.2001 46.1993 71.0661 46.1993 67.2001C46.1993 64.8805 48.0797 63.0001 50.3993 63.0001C52.7189 63.0001 54.5993 64.8805 54.5993 67.2001Z"fill=#222222 fill-rule=evenodd /></svg></div><div>`
                     
                    if(oDetails.orderType==2){
                     data+=`<h4>Pickup Address</h4>`;
                    }else{
                        data+=`<h4>Outlet Address</h4>`; 
                    }
                     data+= `<p>${oDetails.store}</p></div></div>`;
                   
                    data +=`<div style="width: 100%;max-width: 10%;justify-content: right;display: flex;">
                     <a style="display: flex;" href="https://www.google.com/maps/dir//${oDetails.latitude},${oDetails.longitude}/@${oDetails.latitude},${oDetails.longitude},17z" target="_blank">
                    <svg fill="none" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" style="width: 100%;max-width: 27px;"><path d="M6.6055 13.8001H7.79695V10.2257H13.1585V12.3572L15.8845 9.63001L13.1585 6.88016V9.03429H7.56819C7.29574 9.03429 7.06699 9.12563 6.88192 9.30832C6.69685 9.49101 6.60471 9.71739 6.6055 9.98745V13.8001ZM10.7803 21.2228C10.5404 21.2228 10.3037 21.1751 10.0702 21.0798C9.83591 20.9837 9.62185 20.8391 9.42804 20.6461L0.950898 12.169C0.758678 11.9768 0.614513 11.7651 0.518403 11.5339C0.421499 11.302 0.373047 11.0661 0.373047 10.8262C0.373047 10.5863 0.421499 10.3496 0.518403 10.1161C0.615308 9.8826 0.759472 9.66854 0.950898 9.47394L9.42804 0.996796C9.62026 0.804577 9.83233 0.660412 10.0643 0.564302C10.2954 0.467397 10.5309 0.418945 10.7708 0.418945C11.0107 0.418945 11.2478 0.467397 11.4821 0.564302C11.7164 0.661206 11.9301 0.805371 12.1231 0.996796L20.6002 9.47394C20.7932 9.66615 20.9378 9.87823 21.0339 10.1102C21.1292 10.3413 21.1769 10.5768 21.1769 10.8167C21.1769 11.0566 21.1292 11.2937 21.0339 11.528C20.9386 11.7623 20.794 11.976 20.6002 12.169L12.1231 20.6461C11.9309 20.8391 11.7192 20.9837 11.488 21.0798C11.2561 21.1751 11.0202 21.2228 10.7803 21.2228Z" fill="rgb(34, 34, 34);"></path></svg></a>
                    </div></div></li></ul></div></ul></div>`;
                }
                if(oDetails.refundId!=null && oDetails.refundId!=''){
                data+='<div class="outlet-info-card"><ul class="info-points"> ';
                
              
                if(oDetails.refundId != null && oDetails.refundId!='' ){
                    data+='<li><div class="inner-points"><div class="point-svg"><svg fill=none viewBox="0 0 168 168" xmlns=http://www.w3.org/2000/svg><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 fill=white rx=83.25 x=0.75 y=0.75 /><rect height=166.5 width=166.5 rx=83.25 x=0.75 y=0.75 stroke=#EEEEEE stroke-width=1.5 /><rect height=134.4 width=134.4 fill=white transform="translate(16.7998 16.8)"/><path clip-rule=evenodd d="M90.9887 27.9644C90.969 30.284 92.8334 32.1802 95.1529 32.1999C104.727 32.2811 111.782 32.5924 117.248 33.6631C122.597 34.7108 126.113 36.4298 128.827 39.1438C132.018 42.335 133.849 46.6524 134.812 53.8135C135.791 61.0953 135.8 70.6639 135.8 83.9855C135.8 97.307 135.791 106.876 134.812 114.157C133.849 121.318 132.018 125.636 128.827 128.827C125.636 132.018 121.319 133.849 114.158 134.812C106.876 135.791 97.3071 135.8 83.9856 135.8C70.6641 135.8 61.0955 135.791 53.8136 134.812C46.6525 133.849 42.3351 132.018 39.144 128.827C36.43 126.113 34.7109 122.597 33.6632 117.248C32.5925 111.782 32.2812 104.727 32.2 95.1528C32.1804 92.8333 30.2841 90.9689 27.9646 90.9885C25.6451 91.0082 23.7807 92.9045 23.8003 95.224C23.8812 104.769 24.1817 112.542 25.4198 118.863C26.681 125.301 28.9678 130.53 33.2043 134.767C38.2163 139.779 44.6018 142.049 52.6943 143.137C60.6006 144.2 70.7338 144.2 83.6643 144.2H84.3069C97.2373 144.2 107.371 144.2 115.277 143.137C123.369 142.049 129.755 139.779 134.767 134.767C139.779 129.755 142.049 123.369 143.137 115.277C144.2 107.37 144.2 97.2372 144.2 84.3068V83.6641C144.2 70.7337 144.2 60.6005 143.137 52.6942C142.049 44.6017 139.779 38.2161 134.767 33.2041C130.53 28.9677 125.301 26.6808 118.863 25.4197C112.542 24.1816 104.769 23.8811 95.2241 23.8002C92.9046 23.7805 91.0083 25.6449 90.9887 27.9644ZM58.97 25.0302C57.3298 23.39 54.6705 23.39 53.0303 25.0302L25.0303 53.0302C23.3901 54.6704 23.3901 57.3297 25.0303 58.9699L53.0303 86.9699C54.6705 88.6101 57.3298 88.6101 58.97 86.9699C60.6102 85.3297 60.6102 82.6704 58.97 81.0302L38.1399 60.2H72.8002C81.4884 60.2 86.6165 64.4393 88.4127 66.2443L89.4889 67.3257L90.5559 68.3875C92.3609 70.1837 96.6002 75.3118 96.6002 84.0001V84.8001C96.6002 87.1196 98.4806 89.0001 100.8 89.0001C103.12 89.0001 105 87.1196 105 84.8001V84.0001C105 72.3309 99.2488 65.1876 96.4812 62.4334L95.4142 61.3716L94.3669 60.3191C91.6127 57.5514 84.4694 51.8001 72.8002 51.8001H38.1399L58.97 30.9699C60.6102 29.3297 60.6102 26.6704 58.97 25.0302Z"fill=#222222 fill-rule=evenodd /><path clip-rule=evenodd d="M83.7803 82.514C85.2022 82.9406 86.0091 84.4391 85.5825 85.861L83.3951 93.1526H95.7023L98.3533 84.3162C98.7798 82.8943 100.278 82.0874 101.7 82.514C103.122 82.9406 103.929 84.4391 103.503 85.861L101.315 93.1526H108.096C109.58 93.1526 110.784 94.3561 110.784 95.8406C110.784 97.3252 109.58 98.5286 108.096 98.5286H99.7023L97.0143 107.489H104.512C105.996 107.489 107.2 108.692 107.2 110.177C107.2 111.661 105.996 112.865 104.512 112.865H95.4015L92.7505 121.701C92.324 123.123 90.8254 123.93 89.4035 123.503C87.9816 123.077 87.1747 121.578 87.6013 120.156L89.7887 112.865H77.4815L74.8305 121.701C74.404 123.123 72.9054 123.93 71.4835 123.503C70.0616 123.077 69.2547 121.578 69.6813 120.156L71.8687 112.865H65.0879C63.6034 112.865 62.3999 111.661 62.3999 110.177C62.3999 108.692 63.6034 107.489 65.0879 107.489H73.4815L76.1695 98.5286H68.6719C67.1874 98.5286 65.9839 97.3252 65.9839 95.8406C65.9839 94.3561 67.1874 93.1526 68.6719 93.1526H77.7823L80.4333 84.3162C80.8598 82.8943 82.3584 82.0874 83.7803 82.514ZM81.7823 98.5286H94.0895L91.4015 107.489H79.0943L81.7823 98.5286Z"fill=#222222 fill-rule=evenodd stroke=#222222 stroke-width=2.8 /></svg></div><div><h4>Refund ID</h4><p>'+ oDetails.refundId+'</p></div></div></li>';
                }

                // if (oDetails.orderType == 3) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>Table No.</span>' + oDetails.tableNo + '</div></li>';
                // }

                // if ((oDetails.orderType == 2 && oDetails.subOrderType == 2) || oDetails.orderType == 4) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>In Car No.</span>' + oDetails.carNumber + '</div></li>';
                // }

                // if (oDetails.discount > 0) {
                //     data += '<li><div class="order-status-icon"><span><img src="' + origin +'/assets/wla_new/img/other.png" alt="Other"></span></div><div class="order-status-text"><span>Coupon Applied</span></div></li>';
                // }
                data += '</ul></div>';
            }
            if(oDetails.deliveryStatus == 3){
                if(pId == 7175){
                   /*  if(oDetails.rating == 0){
                        data+='<li><a href="javascript:void(0);" onclick="rateTheoOrder(' + orderId + ',' + oDetails.businessId +')"><i class="lar la-star" style="margin-right: 3px;"></i> Rate Order</a></li>';
                    } */
                    
                }else{
                    data+=`<div class="btn-container">
                    <div class="row m-0" style="justify-content: center;align-items: center;">
                        <div >
                            <a href="#" data-toggle="modal" data-target="#rateoutlet" data-type=${oDetails.orderType} data-id="` + orderId + `" onclick="setOrderId( `+ orderId + `,` + oDetails.businessId +`)">
                        <svg fill="none" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_495_3796)"><path clip-rule="evenodd" d="M9.06332 1.34326L10.8923 4.96409C10.9819 5.14608 11.1584 5.2733 11.3638 5.30398L15.4575 5.88664C15.6236 5.90895 15.7736 5.99478 15.8743 6.12505C15.9749 6.25531 16.0177 6.4192 15.9933 6.58029C15.9727 6.7127 15.9074 6.83472 15.8075 6.92711L12.8426 9.75719C12.6928 9.89666 12.6256 10.1002 12.664 10.2982L13.3785 14.2867C13.4302 14.6153 13.2015 14.9237 12.8641 14.9803C12.725 15.0015 12.5825 14.9797 12.4569 14.9179L8.80612 13.0381C8.62376 12.9406 8.40266 12.9406 8.22029 13.0381L4.54813 14.9318C4.24004 15.0853 3.86208 14.9712 3.69796 14.6751C3.63396 14.5558 3.61141 14.4195 3.63366 14.2867L4.34809 10.2982C4.38264 10.1004 4.31603 9.89864 4.16948 9.75719L1.18316 6.92711C0.938945 6.68672 0.938945 6.30044 1.18316 6.06005C1.28284 5.97045 1.40675 5.9103 1.54038 5.88664L5.63406 5.30398C5.83845 5.27106 6.01399 5.14453 6.10558 4.96409L7.93452 1.34326C8.00679 1.19644 8.13705 1.08418 8.29578 1.03194C8.4545 0.979706 8.62822 0.991913 8.77755 1.0658C8.90074 1.12646 9.00084 1.22364 9.06332 1.34326Z" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.8"></path></g><defs><clipPath id="clip0_495_3796"><rect fill="white" height="16" width="17"></rect></clipPath></defs></svg> Rate Order</a>
                        </div>
                        
                        </div>
                    </div>
                    </div>`;
                    $('body .footer-bottom').addClass('adjust-spacing-btns');
                }
                
            }  


            data +=`</div>`;
            if(oDetails.orderType == 5){
                // data += '<tr><td><span>Slot Date and Time</span>' + oDetails.slotTimig + '</td></tr>';
            }
            
            if (oDetails.orderType == 3 || (oDetails.orderType == 2 && oDetails.subOrderType == 2) || oDetails.orderType == 4) {
                // data += '<tr>';
                // if ((oDetails.orderType == 2 && oDetaxils.subOrderType == 2) || oDetails.orderType == 4) {
                //     data += '<td><span>Car Number</span>' + oDetails.carNumber + '</td>';
                // }
                // if (oDetails.orderType == 3) {
                //     data += '<td><span>Table Number</span>' + oDetails.tableNo + '</td>';
                // }
                // data += '</tr>';
            }
            // data += '</table></div></div></div>';

            $('#OrderDetailOverview').html("");
            $('#OrderDetailOverview').html(data);
            $('.map-open-outer').removeClass('svg-activated');
            if(oDetails.orderType == 1 && oDetails.deliveryStatus == 3){
                $('#post-order-delivery').show();
                $('.map-open-outer').addClass('svg-activated');
            }
            if(oDetails.orderType == 2 && oDetails.deliveryStatus == 3){
                $('#post-order-pickup').show();
                $('.map-open-outer').addClass('svg-activated');
            }
            if(oDetails.orderType==3 && oDetails.deliveryStatus == 3 ){
                $('#post-order-dine').show();
                $('.map-open-outer').addClass('svg-activated');
            }
            if(oDetails.orderType==4 && oDetails.deliveryStatus == 3){
                $('#post-order-incar').show();
                $('.map-open-outer').addClass('svg-activated');
            }
            if(oDetails.deliveryStatus==4){
                $('#post-order-reject').show();
                $('.map-open-outer').addClass('svg-activated');
            }
        }else{
            $('#OrderDetailOverview').html("<b> No Order Found</b>");
        }

    }
    });
}
function copyText() {
    /* Get the text field */
    var copyText = document.getElementById("copytxt");
    if(copyText){
        copyText.select();
    }

    var copyTextUn = document.getElementById("copytxtunsc");
    if(copyTextUn){
        copyTextUn.select();
    } 
        
        /* Copy the text inside the text field */
        document.execCommand("copy");
    
        /* Alert the copied text */
        $('#promoapplied').modal('show');
        $('.promors').html('Promo Code Copied!');
        setTimeout(function() {
            $('#promoapplied').modal('hide')
        }, 2000);
    
        // copyText.select(false);
        // copyText.blur();
        window.getSelection().removeAllRanges();
    
    

}
$('#rateoutlet').on('hidden.bs.modal', function(e) {
    var modalBody = $(this).find('.modal-body');
  // Reset form fields
  modalBody.find('form')[0].reset();
  $('#emojis').hide();
  $('#appemojis').hide();
  $('#delemojis').hide();
  });


$('#rateoutlet').on('show.bs.modal', function(e) {

    var dataId = $(e.relatedTarget).data('id'); 
    var orderType=$(e.relatedTarget).data('type'); 
    let message = "";

    if (orderType == 1) {
        orderType = "Delivery";
        message = "Was your order delivered on time?";
    } else if (orderType == 2) {
        orderType = "Pickup";
        message = "Was your order ready on time?";
    } else if (orderType == 3) {
        orderType = "Dine-In";
        message = "Rate our food & services.";
    } else if (orderType == 4) {
        orderType = "In-Car";
        message = "Rate the In-Car experience.";
    }

    const content = `
    <p class="mb-0">
        <span>Order ID</span> #${dataId}
    </p>
`;
    const contentType =`    <p class="mb-0"><span>Order Type</span>${orderType}</p>`;
    document.getElementById("serviceTitle").innerHTML = message;
// Get the element with the id "rateOrderId"
const targetElement = document.getElementById('rateOrderId');
const targetEl = document.getElementById('rateOrderType');
// Replace the content of the target element with the new content
targetElement.innerHTML = content;
targetEl.innerHTML = contentType;
    var params = 'orderId=' + dataId;
    var url= origin +  '/client/fetchRating?' + params;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        success: function(data) {
            $('.spinner').hide();
            var ratingOrderId = data.id;
            var status = data.status;
            var starValueFood=data.rating;
        if(dataId == ratingOrderId && status==1 && starValueFood != 0){

            var starValueFood=data.rating;
            var starValueWeb=data.app_rating;
            var starValueDel=data.delivery_rating;
            var reviews=data.rating_comments;

                if(starValueFood != undefined && starValueFood !='')
                {
                    selectStarByFood(starValueFood);
                    $('input[name="rating"]').prop('disabled', true);
                }

                if(starValueWeb != undefined && starValueWeb !='')
                {
                    selectStarByWeb(starValueWeb);
                    $('input[name="apprating"]').prop('disabled', true);
                }

                if(starValueDel != undefined && starValueDel !='')
                {
                    selectStarByDelivery(starValueDel);
                    $('input[name="delrating"]').prop('disabled', true);
                }
                
                if(reviews != undefined && reviews !='')
                {
                    $('#review-textarea').show();
                    $('#feeback-pizza').prop('readonly', true);
                    $('#feeback-pizza').val(reviews);
                }else{
                    $('#review-textarea').hide();
                }

                $('#submit-reviews').hide();
                $('.sticky-review').hide();
                $('#rateoutlet').addClass('disabled-btns');
        
    }else{
        $('input[name="rating"]').prop('disabled', false);
        $('input[name="apprating"]').prop('disabled', false);
        $('input[name="delrating"]').prop('disabled', false);
        $('#feeback-pizza').prop('readonly', false);
        $('#review-textarea').show();
        $('#submit-reviews').show();
        $('.sticky-review').show();
        $('#rateoutlet').removeClass('disabled-btns');
    }

}

});
	
});

var theo_list;	
var rating_value = 0;

function rateTheoOrder(orderId,businessId){
    var params = 'orderId=' + orderId + '&parentBusinessId=' + pId ;
    var url = origin +  '/client/getFeedbackFormQuestion?' + params;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result) {
            $('.spinner').hide();
            
            if (result.status == 1) {
                theo_list = result;
                var data= "";
                var list = result?.ques_list;
                if(list && list.length > 0){
                    data += '<form class="mb-0">';
                    list.forEach((element,index) => {
                        if(element?.quesArray && element?.quesArray.length >0){
                            data += '<div class="form-row">';
                            data += '<div class="form-group col">';
                            data += '<h5 style="font-size: 1.3em; line-height: 1.4em; margin-bottom: 0.2em; font-weight: 700;">'+ element.question +'</h5>';
                            data += '<div class="new-separate-start">';
                                    
                            var quesArr = element.quesArray;
                            quesArr.forEach((element,subindex)=>{
                                data += '<div class="new-separate">';
                                data += '<h5 style="font-size: 1.1em; line-height: 1.4em; margin-bottom: 0.2em; font-weight: 400;">'+ (subindex + 1) +'. '+ element.question +'</h5>';
                                data += '<div class="feedback d-flex align-items-center justify-content-between">';
                                data += '<div class="rating auto_atr" style="width: auto;">';
                                data += '<input type="radio" name="subrating-'+ element.questionId + subindex +'" id="subrating-'+element.questionId + subindex +'5" value="5" checked>';
                                data += '<label for="subrating-'+ element.questionId + subindex + '5"></label>';
                                data += '<input type="radio" name="subrating-'+element.questionId + subindex+ '" id="subrating-'+element.questionId + subindex +'4" value="4">';
                                data += '<label for="subrating-'+ element.questionId + subindex + '4"></label>';
                                data += '<input type="radio" name="subrating-'+ element.questionId + subindex +'" id="subrating-'+element.questionId + subindex +'3" value="3">';
                                data += '<label for="subrating-'+ element.questionId + subindex +'3"></label>';
                                data += '<input type="radio" name="subrating-'+element.questionId + subindex +'" id="subrating-'+element.questionId + subindex +'2" value="2">';
                                data += '<label for="subrating-'+ element.questionId + subindex + '2"></label>';
                                data += '<input type="radio" name="subrating-'+element.questionId + subindex +'" id="subrating-'+element.questionId + subindex +'1" value="1">';
                                data += '<label for="subrating-'+ element.questionId + subindex +'1"></label>';
                                data += '</div>';
                                data += '</div>';
                                data += '</div>';
                            });

                            data += '</div>';
                            data += '</div>';
                            data += '</div>';
                        }else if (element?.questionId == 27) {
                            data += '<div class="form-row">';
                            data += '<div class="form-group col">';
                            data += '<h5 style="font-size: 1.3em; line-height: 1.4em; margin-bottom: 0.2em; font-weight: 700;">' + element.question + '</h5>';
                            data += '<div class="ratings">';
                        
                            // Loop to generate 10 radio buttons for question 27
                            for (var i = 1; i <= 10; i++) {
                                data += '<label class="rating-item">';
                                data += '<input type="radio" id="rating-' + index + i + '" name="rating-' + element.questionId + '" value="' + i + '"' + (i == 10 ? ' checked' : '') + '>';
                                data += '<div class="rating-box">';
                                data += '<span class="rating-score">';
                                data += i;
                                data += '</span>';
                                data += '</div>';
                                data += '</label>';
                            }
                        
                            data += '</div>';
                            data += '</div>';
                            data += '</div>';
                        }
                        else{
                            data += '<div class="form-row">';
                            data += '<div class="form-group col">';
                            data += '<h5 style="font-size: 1.3em; line-height: 1.4em; margin-bottom: 0.2em; font-weight: 700;">'+ element.question +'</h5>';
                            data += '<div class="feedback d-flex align-items-center justify-content-between">';
                            data += '<div class="rating auto_atr" style="width: auto;">';
                            data += '<input type="radio" name="rating-'+element.questionId +'" id="rating-'+ index +'5" value="5" checked>';
                            data += '<label for="rating-'+ index +'5"></label>';
                            data += '<input type="radio" name="rating-'+element.questionId + '" id="rating-'+ index +'4" value="4" >';
                            data += '<label for="rating-'+ index +'4"></label>';
                            data += '<input type="radio" name="rating-'+element.questionId + '" id="rating-'+ index +'3" value="3" >';
                            data += '<label for="rating-'+ index +'3"></label>';
                            data += '<input type="radio" name="rating-'+element.questionId +'" id="rating-'+ index +'2" value="2" >';
                            data += '<label for="rating-'+ index +'2"></label>';
                            data += '<input type="radio" name="rating-'+element.questionId +'" id="rating-'+ index +'1" value="1">';
                            data += '<label for="rating-'+ index +'1"></label>';
                            data += '</div>';
                            data += '</div>';
                            data += '</div>';
                            data += '</div>';
                        }
                    });
                    data += '<div class="inner-nww">';
                    data += '<h5 style="font-size: 1em; line-height: 1.4em; margin-bottom: 0.5em; font-weight: 700;">Where did you hear about us?</h5>';
                    data += '<div class="radio-start">';
                    data += '<div class="radio-outer">';
                    data += '<input type="radio" id="ratingRadio-1" name="radio-group" value="Newspaper">'; 
                    data += '<label for="ratingRadio-1">';
                    data += '<span class="item-name" style="display: block;">';
                    data += '<div>Newspaper</div>';
                    data += '</span>';
                    data += '</label>';
                    data += '</div>';
                        
                    data += '<div class="radio-outer">';
                    data += '<input type="radio" id="ratingRadio-2" name="radio-group" value="Facebook Ads">'; 
                    data += '<label for="ratingRadio-2">';
                    data += '<span class="item-name" style="display: block;">';
                    data += '<div>Facebook Ads</div>';
                    data += '</span>';
                    data += '</label>';
                    data += '</div>';
                        
                    data += '<div class="radio-outer">';
                    data += '<input type="radio" id="ratingRadio-3" name="radio-group" value="Friends">'; 
                    data += '<label for="ratingRadio-3">';
                    data += '<span class="item-name" style="display: block;">';
                    data += '<div>Friends</div>';
                    data += '</span>';
                    data += '</label>';
                    data += '</div>';
                        
                    data += '<div class="radio-outer">';
                    data += '<input type="radio" id="ratingRadio-4" name="radio-group" value="Other">'; 
                    data += '<label for="ratingRadio-4">';
                    data += '<span class="item-name" style="display: block;">';
                    data += '<div>Other</div>';
                    data += '</span>';
                    data += '</label>';
                    data += '</div>';
                    data += '</div>';
                    
                    data += '<h5 style="font-size: 1em; line-height: 1.4em; margin-bottom: 0.5em; font-weight: 700;">Leave a comment</h5>';
                    data += '<div class="input-group mb-2">';
                    data += '<textarea formcontrolname="comment" name="theoreviews" id="feeback-theo" placeholder="Type Here" rows="4" aria-label="Review Comment" aria-describedby="review-comment" class="form-control ng-pristine ng-valid ng-touched"></textarea>';
                    data += '</div>';
                    data += '</div>';
                    data += '</form>';
                    data += '<div class="modal-lower-discription">';
					data += '<button type="button" id="submit-theoRating" class="promo-code-btn" onclick="submitTheoForm(event,'+ orderId +' , '+ businessId +')" style="filter: grayscale(1);pointer-event:none;cursor:initial;">Submit Review</button>';
                    data += '</div>';

                    $('#append_theoform').html('');
                    $('#append_theoform').html(data);
                    $('#ratetheooutlet').modal('show');
                }
            }
        },
        error: function(xhr, status, error) {
            // Handle errors or network issues here
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("No Internet Connection");
            setTimeout(function() {
                $('#promonotapplied').modal('hide')
            }, 2500);
        }
    });
}

$('#ratetheooutlet').on('show.bs.modal', function(e) {
    function checkRadioValue() {
        var radiohideValue = $("input[name='radio-group']:checked").val();
        if(radiohideValue != undefined && radiohideValue != ''){
            $('#submit-theoRating').removeAttr("style");
        } else {
            $('#submit-theoRating').attr("style","filter:grayscale(1);pointer-event:none;cursor:initial;");
        }
    }

    // Check radio value initially
    checkRadioValue();

    // Check radio value whenever input is changed
    $('#ratetheooutlet input[type="radio"]').on('change', checkRadioValue);
});


function submitTheoForm(event,orderId,businessId) {
    event.preventDefault();

    var radioValue = $("input[name='radio-group']:checked").val();
    if(radioValue == undefined || radioValue == ""){
        return false;
    }
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var mobile = userData['mobile'];
    var comment = $('#feeback-theo').val();
    

    $('input[type="radio"]:checked').each(function() {
        if (($(this).attr('name') !== 'radio-group') && ! $(this).attr('name').startsWith('subrating-')) {
            var questionId = $(this).attr('name').split('-')[1]; // Extract the question ID
            var index = parseInt($(this).attr('id').split('-')[1].slice(0, -1));
            var value = $(this).val(); // Get the selected value
            updateQuestionValue(questionId, index, value); // Update the question value in theo_list
        }else if($(this).attr('name').startsWith('subrating-')){
            var questionId = $(this).attr('name').split('-')[1].slice(0, -1); // Extract the question ID
            // Get the id of the radio button
            var id = $(this).attr('id');

            // Split the id by "-" and extract the last part
            var parts = id.split('-');
            var numberPart = parts[parts.length - 1];

            // Remove the "subrating-" part from the number
            var index = parseInt(numberPart.replace(questionId, '').slice(0, -1));
            var value = $(this).val(); // Get the selected value
            updateQuestionValue(questionId, index, value); // Update the question value in theo_list
        }
    });

    if(rating_value > 0){
        var avg_rating = parseFloat(rating_value/theo_list?.ques_list.length).toFixed(2);
    }else{
        var avg_rating = 0;
    }
    

   var formdata = {
        "businessId" : String(businessId),
        "parentBusinessId" : String(pId),
        "orderId" : String(orderId),
        "mobileNo" : mobile,
        "rating" : avg_rating,
        "question_list" : theo_list['ques_list'],
        "hear_about_us" : radioValue,
        "comments" : comment
    }

    var url = origin +  '/client/submit_feeback_form'; 
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(formdata),
        contentType: "application/json",
        dataType: "json",
        success: function(result) {
            $('.spinner').hide();

            if(result.status == 1){
                $('#ratetheooutlet').modal('hide');
                $('#promoapplied').modal('show');
                $('.promors').html(result['msg']);
                setTimeout(function() {
                    $('#promoapplied').modal('hide');
                    location.reload();
                }, 2500);
            }
        },
        error: function(xhr, status, error) {
            // Handle errors or network issues here
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html("No Internet Connection");
            setTimeout(function() {
                $('#promonotapplied').modal('hide')
            }, 2500);
        }

    });
    
        
}
function getLocalityList() {
    $('.spinner').show();

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var businessId = localStorage.getItem('businessId');
    var params = "businessId=" + businessId + "&contactId=" + userData['contactId'] + "&contactMappingId=" + userData['contactMappingId'] + '&token=' + userData['token'];
    var url = origin + '/maps_mongodb/getLocalityList?' + params;


    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        // headers  : {"token" : userData['token']},

        success: function(result) {
       
            if (result['status'] == 1) {
                var list = '';
                for (var i = 0; i < result['locality'].length; i++) {
                    list += '<li style="cursor: pointer;" class="list-item" data-search-on-list="list-item" onclick="selectLocality(\'' + result['locality'][i]['LocalityName'] + '\',\'' + result['locality'][i]['CityName'] + '\',\'' + result['locality'][i]['latitude'] + '\',\'' + result['locality'][i]['longitude'] + '\');">' +
                        '<a class="list-item-link btn-next"><span class="store-lists"><span><span><svg fill="noneS" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg"><path d="M13.5996 35.6267C10.031 35.6267 6.67808 35.2974 4.15293 34.7019C1.39822 34.0573 0 33.1955 0 32.1586C0 31.1216 1.39822 30.2598 4.15293 29.6153C6.67808 29.0197 10.038 28.6904 13.5996 28.6904C17.1682 28.6904 20.5212 29.0197 23.0463 29.6153C25.801 30.2598 27.1993 31.1216 27.1993 32.1586C27.1993 33.1955 25.801 34.0573 23.0463 34.7019C20.5212 35.2974 17.1682 35.6267 13.5996 35.6267ZM13.5996 29.3911C10.0867 29.3911 6.78938 29.7134 4.30597 30.2949C1.6417 30.9254 0.695634 31.6891 0.695634 32.1586C0.695634 32.628 1.6417 33.3917 4.30597 34.0222C6.78243 34.6038 10.0867 34.9261 13.5996 34.9261C17.1126 34.9261 20.4099 34.6038 22.8933 34.0222C25.5576 33.3917 26.5036 32.628 26.5036 32.1586C26.5036 31.6891 25.5576 30.9254 22.8933 30.2949C20.4099 29.7063 17.1126 29.3911 13.5996 29.3911Z" fill="var(--main-bg-color)"></path><path d="M25.6334 12.1209C25.6334 5.4299 20.2422 0 13.5989 0C6.95561 0 1.56445 5.42289 1.56445 12.1209C1.56445 17.3266 4.82002 21.7616 9.39729 23.4782L13.5989 32.5794L17.8771 23.4502C22.4126 21.7126 25.6334 17.2916 25.6334 12.1209Z" fill="var(--main-bg-color)"></path><path d="M13.6375 17.6607C16.8372 17.6607 19.4312 15.0667 19.4312 11.867C19.4312 8.66717 16.8372 6.07324 13.6375 6.07324C10.4377 6.07324 7.84375 8.66717 7.84375 11.867C7.84375 15.0667 10.4377 17.6607 13.6375 17.6607Z" fill="white"></path></svg></span></span> <span class="d-flex justify-content-between w-100"><span style="padding-right: 10px;">' + result['locality'][i]['LocalityName'] + ', ' + result['locality'][i]['CityName'] + '</span><span><i class="las la-angle-right"></i></span></span></span></a>' +
                        '</li>';
                }
                $('#localtyList').html(list);
                $('#nearestLocalityModal').modal('hide');
                $('#localityListModal').modal('show');
                $('#searchLoc').val('');
                $('.spinner').hide();
            }
        }
    });
}

function updateMarkerPosition(latLng) {
    var lat = latLng.lat();
    var lng = latLng.lng();
    $('#location-placeholder').val('');
    $('#locality').val('');
    $('#cityMapFlow').val('');
    $('#localityMapFlow').val('');
    $('#city').val('');
    $('#header-locality').html('Locality');

    // Check if location is serviceable
    // let newPosition = new google.maps.LatLng(lat, lng);
    // map.setCenter(newPosition);
    checkServiceability(lat, lng)
        .then((isServiceable) => {
            if (isServiceable) {
                // Proceed with filling address details
                $('#lat').val(lat);
                $('#lng').val(lng);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': new google.maps.LatLng(lat, lng) }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                        let data = {};
                        let addressComponents = results[0].address_components;
            
                        // Loop through address components
                        addressComponents.forEach(component => {
                            let types = component.types;
                
                            if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
                                data.sublocality = component.long_name;
                            }
                            if (types.includes('locality')) {
                                data.city = component.long_name;
                            }
                            if (types.includes('administrative_area_level_2') && !data.city) {
                                data.city = component.long_name; // Set only if city is empty
                            }
                            if (types.includes('administrative_area_level_1')) {
                                data.state = component.long_name;
                            }
                            if (types.includes('country')) {
                                data.country = component.long_name;
                            }
                            if (types.includes('postal_code')) {
                                data.pincode = component.long_name;
                            }
                            if (types.includes('political') && (types.includes('sublocality') || types.includes('locality'))) {
                                data.locality = data.locality || '';
                        
                                if (!data.locality.includes(component.long_name)) {
                                    data.locality += (data.locality ? ', ' : '') + component.long_name;
                                }
                            }
                        });
                
                        // Ensure locality contains sublocality + city if both exist
                        if (!data.locality) {
                            data.locality = data.sublocality ? `${data.sublocality}, ${data.city}` : data.city;
                        }
                
                        // Setting values to input fields
                        document.getElementById('pincode').value = data.pincode || '';
                        document.getElementById('city').value = data.city || '';
                        $('#cityMapFlow').val(data.city || '');
                        document.getElementById('state').value = data.state || '';
                        $('#header-locality').html(data.sublocality);
                        if (data.locality) {
                            document.getElementById('location-placeholder').value = data.locality;
                            $('#localityMapFlow').val(data.locality);
                        }
                    } else {
                        console.error("Geocoder failed due to: " + status);
                    }
                });
                if (!$('body #locationNotServiceable').hasClass('d-none')) {
                    $('body #locationNotServiceable').addClass('d-none');
                }                
                $('#mobileBtnSubmit').prop('disabled', false);
            } else {

                $('body #locationNotServiceable').removeClass('d-none');
                $('#mobileBtnSubmit').prop('disabled', true);
            }
        })
        .catch((error) => {
            console.error("Error checking serviceability:", error);
        });
}

function updateQuestionValue(questionId, index, value) {
    var question = theo_list.ques_list.find(item => item.questionId == questionId);

    if (question) {
        if (question.quesArray && Array.isArray(question.quesArray)) {
            var avg_innerRating = 0;
            // Update the sub-question with the matching index
            if (index >= 0 && index < question.quesArray.length) {
                if (!isNaN(value)) { // Check if the value is a number
                    rating_value = rating_value + parseFloat(value);
                    avg_innerRating = avg_innerRating +  parseFloat(value); // Add the value to rating_value
                }
                question.quesArray[index].questionValue = value;
            }
            if(avg_innerRating > 0){
                var avg_rating = parseFloat(avg_innerRating/question.quesArray.length).toFixed(2);
                question['questionValue'] = avg_rating;
            }
            
        } else {
            // If the question does not have a quesArray, update the question's value directly
            if (!isNaN(value)) { // Check if the value is a number
                rating_value = rating_value + parseFloat(value); // Add the value to rating_value
            }
            question['questionValue'] = value;
        }
    } else {
        // If the question is not found, create a new question object with the questionId and questionValue
        var newQuestion = {
            questionId: questionId,
            questionValue: value
        };
        theo_list.ques_list.push(newQuestion);
    }
}
function selectLocality(localtyName, cityName, latitude, longitude) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    $('#newAddLocality').val(localtyName);
    $('#newAddlat').val(latitude);
    $('#newAddlng').val(longitude);
    $('#newAddCity').val(cityName);
    if (!$('#locationErrorServiceable').hasClass('d-none')) {
        $('#locationErrorServiceable').addClass('d-none');
    }
    
    $('#newAddPhone').val(userData['mobile']);
    $('.fulladdh').html(cityName);
    $('.fulladd').html(localtyName);
    $('#locality-input').val(localtyName);
    $('.fulladdh').val(cityName);
    $('.fulladd').val(localtyName);
    $('#localityListModal').modal('hide');
    var userData = JSON.parse(localStorage.getItem('userdata'));
    $('#newEmail').val(userData['email']);
    // $('#newEmail').val();
    $('#addAddModal').modal('show');
    $('#addAddModal').on('shown.bs.modal', function () {
        initializeLeafletMap(latitude, longitude);
    });
}
function openLeafletMap(outletLat, outletLng, addressLat, addressLng, riderIconUrl = '',orderType = 1,delOutletLat,delOutletLang) {
  
        let map = L.map('open-map').setView([outletLat, outletLng], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Custom Icons
        let outletIcon = L.icon({
            iconUrl: riderIconUrl || (origin + '/assets/wla_new/img/icons/outlet_icon.png'),
            iconSize: [40, 40]
        });
        if(orderType==1){
        let addressIcon = L.icon({
            iconUrl: origin + '/assets/wla_new/img/icons/deli_address_marker.png',
            iconSize: [40, 40]
        });
        let iconOutlet = L.icon({
            iconUrl: origin + '/assets/wla_new/img/icons/outlet_icon.png',
            iconSize: [40, 40]
        });
        // Add Markers
        let outletMarker = L.marker([outletLat, outletLng], { icon: outletIcon }).addTo(map);
        let addressMarker = L.marker([addressLat, addressLng], { icon: addressIcon }).addTo(map);
        if (riderIconUrl != '') {
        let delOutletMarker = L.marker([delOutletLat, delOutletLang], { icon: iconOutlet }).addTo(map); // New outlet marker
        }
        // Calculate Distance Between Points (Euclidean Distance)
        let distance = Math.sqrt(
            Math.pow(addressLat - outletLat, 2) + Math.pow(addressLng - outletLng, 2)
        );

        // **Better Curve Calculation**
        let dx = addressLng - outletLng;
        let dy = addressLat - outletLat;
        
        // Find Perpendicular Offset for the Control Point
        let midLat = (outletLat + addressLat) / 2;
        let midLng = (outletLng + addressLng) / 2;
        
        let offsetFactor = Math.min(distance * 0.3, 0.02); // Adjusts curve size based on distance
        
        let controlLat = midLat + offsetFactor * (dx / distance); // Shift perpendicular
        let controlLng = midLng - offsetFactor * (dy / distance);
        // if (riderIconUrl == '') {
        // Draw a Grey Straight Line
            L.polyline([[outletLat, outletLng], [addressLat, addressLng]], {
                color: '#A9A9A9', // Grey Color
                weight: 3
            }).addTo(map);

            // Draw a Dotted Curved Line with Proper Bezier Control Point
            L.curve(
                [
                    'M', [outletLat, outletLng],  // Move to Outlet
                    'Q', [controlLat, controlLng], [addressLat, addressLng] // Quadratic Bezier Curve
                ],
                {
                    color: 'black',   // Solid line color
                    weight: 3,
                    opacity: 1,
                    dashArray: '5, 10' // Dotted line pattern
                }
            ).addTo(map);
        // }
        // Auto Fit View to Markers
        let bounds = L.latLngBounds([outletMarker.getLatLng(), addressMarker.getLatLng()]);
        map.fitBounds(bounds, { padding: [30, 30] });

        // Fetch Road Route (Only when rider icon is present)
        if (riderIconUrl != '') {
            // getRoute(outletLat, outletLng, addressLat, addressLng, 'black');
        }

        function getRoute(startLat, startLng, endLat, endLng, color = 'black') {
            let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY&start=${startLng},${startLat}&end=${endLng},${endLat}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    L.polyline(routeCoords, { color: color, weight: 4 }).addTo(map);
                })
                .catch(error => console.error("Error fetching route:", error));
        }
    }else{
        L.marker([outletLat, outletLng], { icon: outletIcon })
        .addTo(map)
        .bindTooltip("Pick up your order from here", { 
          permanent: true, 
          direction: "top", 
          className: "custom-tooltip" // Custom class
        });
      
      // Wait for the tooltip to be added to the DOM before styling
      setTimeout(() => {
        document.querySelector('.custom-tooltip').style.cssText = `
          background-color: #63932C;
          color: white;
          margin-top: -25px;
          border: 0px;
          border-radius: 5px;
          padding: 5px 10px;
          box-shadow: none;
        `;
      
        // Remove the tooltip "tip" using the ::before pseudo-element
        const style = document.createElement("style");
        style.innerHTML = `
          .custom-tooltip::before {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }, 100);
      
        // Center map on outlet
        map.setView([outletLat, outletLng], 15);
    }
}






// Initialize or update the Leaflet map
function initializeLeafletMap(lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    // Destroy the existing map to avoid multiple instances
    if (map !== null) {
        map.remove();
        map = null;
    }

    // Initialize Leaflet Map
    map = L.map('map-canvas-locality').setView([lat, lng], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add a draggable marker
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

      // Update Latitude & Longitude on Marker Drag
      marker.on('dragend', function (e) {
        var newLat = marker.getLatLng().lat;
        var newLng = marker.getLatLng().lng;
        
        // Update the form fields with new lat/lng
        $('#newAddlat').val(newLat);
        $('#newAddlng').val(newLng);

        getCurrentLocalityAdd(newLat, newLng); // Debugging
    });

}

function selectStarByFood(starValue) {
    const radioInputs = document.getElementsByName("rating");
    for (let i = 0; i < radioInputs.length; i++) {
      const radioInput = radioInputs[i];
      const value = parseInt(radioInput.value);
      radioInput.checked = value >= starValue;
    }
    $('#emojis').show();
    switch (String(starValue)) {
        case "1":
		$('.notgood-rating').removeClass('d-none');
		$('.satisfactory-rating').addClass('d-none');
		$('.good-rating').addClass('d-none');
		$('.great-rating').addClass('d-none');
		$('.excellent-rating').addClass('d-none');
		break;
	  case "2":
		$('.notgood-rating').addClass('d-none');
		$('.satisfactory-rating').removeClass('d-none');
		$('.good-rating').addClass('d-none');
		$('.great-rating').addClass('d-none');
		$('.excellent-rating').addClass('d-none');
		break;
	  case "3":
		$('.notgood-rating').addClass('d-none');
		$('.satisfactory-rating').addClass('d-none');
		$('.good-rating').removeClass('d-none');
		$('.great-rating').addClass('d-none');
		$('.excellent-rating').addClass('d-none');
		break;
	  case "4":
		$('.notgood-rating').addClass('d-none');
		$('.satisfactory-rating').addClass('d-none');
		$('.good-rating').addClass('d-none');
		$('.great-rating').removeClass('d-none');
		$('.excellent-rating').addClass('d-none');
		break;
	  case "5":
		$('.notgood-rating').addClass('d-none');
		$('.satisfactory-rating').addClass('d-none');
		$('.good-rating').addClass('d-none');
		$('.great-rating').addClass('d-none');
		$('.excellent-rating').removeClass('d-none');
		break;
	  }
}

function selectStarByWeb(starValue) {
    const radioInputs = document.getElementsByName("apprating");
    for (let i = 0; i < radioInputs.length; i++) {
      const radioInput = radioInputs[i];
      const value = parseInt(radioInput.value);
      radioInput.checked = value >= starValue;
    }
    $('#appemojis').show();
    switch (String(starValue)) {
        case "1":
		$('.notgood-apprating').removeClass('d-none');
		$('.satisfactory-apprating').addClass('d-none');
		$('.good-apprating').addClass('d-none');
		$('.great-apprating').addClass('d-none');
		$('.excellent-apprating').addClass('d-none');
		break;
	  case "2":
		$('.notgood-apprating').addClass('d-none');
		$('.satisfactory-apprating').removeClass('d-none');
		$('.good-apprating').addClass('d-none');
		$('.great-apprating').addClass('d-none');
		$('.excellent-apprating').addClass('d-none');
		break;
	  case "3":
		$('.notgood-apprating').addClass('d-none');
		$('.satisfactory-apprating').addClass('d-none');
		$('.good-apprating').removeClass('d-none');
		$('.great-apprating').addClass('d-none');
		$('.excellent-apprating').addClass('d-none');
		break;
	  case "4":
		$('.notgood-apprating').addClass('d-none');
		$('.satisfactory-apprating').addClass('d-none');
		$('.good-apprating').addClass('d-none');
		$('.great-apprating').removeClass('d-none');
		$('.excellent-apprating').addClass('d-none');
		break;
	  case "5":
		$('.notgood-apprating').addClass('d-none');
		$('.satisfactory-apprating').addClass('d-none');
		$('.good-apprating').addClass('d-none');
		$('.great-apprating').addClass('d-none');
		$('.excellent-apprating').removeClass('d-none');
		break;
	  }
}

function selectStarByDelivery(starValue) {
    const radioInputs = document.getElementsByName("delrating");
    for (let i = 0; i < radioInputs.length; i++) {
      const radioInput = radioInputs[i];
      const value = parseInt(radioInput.value);
      radioInput.checked = value >= starValue;
    }

    $('#delemojis').show();
    switch (String(starValue)) {
        case "1":
            $('.notgood-delrating').removeClass('d-none');
            $('.satisfactory-delrating').addClass('d-none');
            $('.good-delrating').addClass('d-none');
            $('.great-delrating').addClass('d-none');
            $('.excellent-delrating').addClass('d-none');
            break;
          case "2":
            $('.notgood-delrating').addClass('d-none');
            $('.satisfactory-delrating').removeClass('d-none');
            $('.good-delrating').addClass('d-none');
            $('.great-delrating').addClass('d-none');
            $('.excellent-delrating').addClass('d-none');
            break;
          case "3":
            $('.notgood-delrating').addClass('d-none');
            $('.satisfactory-delrating').addClass('d-none');
            $('.good-delrating').removeClass('d-none');
            $('.great-delrating').addClass('d-none');
            $('.excellent-delrating').addClass('d-none');
            break;
          case "4":
            $('.notgood-delrating').addClass('d-none');
            $('.satisfactory-delrating').addClass('d-none');
            $('.good-delrating').addClass('d-none');
            $('.great-delrating').removeClass('d-none');
            $('.excellent-delrating').addClass('d-none');
            break;
          case "5":
            $('.notgood-delrating').addClass('d-none');
            $('.satisfactory-delrating').addClass('d-none');
            $('.good-delrating').addClass('d-none');
            $('.great-delrating').addClass('d-none');
            $('.excellent-delrating').removeClass('d-none');
            break;
          }
}
// Js for edit address

function errormodalhide() {
    setTimeout(function() {
        $('#promonotapplied').modal('hide')
    }, 2500);
}

function enableOtherOption(checkVal) {
    // var checkVal=$("input[name='name']:checked"). val();

    if (checkVal == 'others') {
        $('#othersValDiv').show();
        $('#othersVal').val('Others');
        addressName = $('#othersVal').val();
    } else {
        $('#othersValDiv').hide();
        addressName = checkVal;
    }
}

function fillInAddress() {
    var place = autocomplete.getPlace();
    
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        $('#location-placeholder').val('');
        $('#locality').val('');
        $('#cityMapFlow').val('');
        $('#localityMapFlow').val('');
        $('#city').val('');
        $('#header-locality').html('Locality');
        // Check if location is serviceable
                      
        var myLatlng = new google.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 17,
            center: myLatlng,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        addMarker(myLatlng, 'Default Marker', map);

        checkServiceability(lat, lng)
            .then((isServiceable) => {
                if (isServiceable) {
                    // Proceed with filling address details
                    $('#lat').val(lat);
                    $('#lng').val(lng);
                   
      
                    // Fill address details
                    var data = {};
                    place.address_components.forEach(component => {
                        let types = component.types;
                        
                        if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
                            data.sublocality = component.long_name;
                        }
                        if (types.includes('locality')) {
                            data.city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_2') && !data.city) {
                            data.city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_1')) {
                            data.state = component.long_name;
                        }
                        if (types.includes('country')) {
                            data.country = component.long_name;
                        }
                        if (types.includes('postal_code')) {
                            data.pincode = component.long_name;
                        }
                        if (types.includes('political') && (types.includes('sublocality') || types.includes('locality'))) {
                            data.locality = data.locality || '';
                            if (!data.locality.includes(component.long_name)) {
                                data.locality += (data.locality ? ', ' : '') + component.long_name;
                            }
                        }
                    });
                    
                    document.getElementById('pincode').value = data.pincode || '';
                    document.getElementById('city').value = data.city || '';
                    $('#cityMapFlow').val(data.city || '');
                    document.getElementById('state').value = data.state || '';
                    $('#header-locality').html(data.sublocality || '');
                    
                    if (data.locality) {
                        document.getElementById('location-placeholder').value = data.locality;
                        $('#localityMapFlow').val(data.locality);
                    }

                    $('#mobileBtnSubmit').prop('disabled', false);
                    if (!$('body #locationNotServiceable').hasClass('d-none')) {
                        $('body #locationNotServiceable').addClass('d-none');
                    }                    
                } else {
                    $('body #locationNotServiceable').removeClass('d-none');
                    $('#mobileBtnSubmit').prop('disabled', true);
                }
            })
            .catch((error) => {
                console.error("Error checking serviceability:", error);
            });
    
}
function addMarker(latlng, title, map) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: title,
        draggable: true
    });

    // marker.addListener('drag', handleEvent);
    addYourLocationButton(map, marker);
    marker.addListener('dragend', function() {
        //  console.log(marker);
        updateMarkerPosition(marker.getPosition());
        map.setCenter(marker.getPosition());
    });
}

function addYourLocationButton(map, marker) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('div');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '1px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'center_changed', function() {
        secondChild.style['background-position'] = '0 0';
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0',
            animationInterval = setInterval(function() {
                imgX = imgX === '-18' ? '0' : '-18';
                secondChild.style['background-position'] = imgX + 'px 0';
            }, 500);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $('#location-placeholder').val('');
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                initialize(lat, lng);
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                secondChild.style['background-position'] = '-144px 0';
            });
        } else {
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '0 0';
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}
// Function to check if the location is serviceable
function checkServiceability(lat, lng) {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var businessId = localStorage.getItem('businessId');
    return new Promise((resolve, reject) => {
        $.ajax({
            url: origin + '/client/checkServiceability',  
            type: "POST",
            dataType: "json",
            data: { latitude: lat,
                    longitude: lng,
                    contactMappingId : contactMappingId,
                    token : token,
                    businessId : businessId
                },
            success: function(response) {
                if (response.status == 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}
function initialize(lat, lng) {
    $('#location-placeholder').val('');
    if (!$('body #locationNotServiceable').hasClass('d-none')) {
        $('body #locationNotServiceable').addClass('d-none');
    }    

    $('#lat').val(lat);
    $('#lng').val(lng);
    var myLatlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
        zoom: 17,
        center: myLatlng,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var options = {
        // types: ['(regions)'],
        componentRestrictions: {
            country: "IN"
        },
        fields: ["address_components", "geometry.location", "formatted_address", "name"],
        language: "en"
    };
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('locality')), options);
    //  autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
    autocomplete.addListener('place_changed', fillInAddress);
    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    var geocoder = new google.maps.Geocoder();

    addMarker(myLatlng, 'Default Marker', map);
    checkServiceability(lat, lng)
    .then((isServiceable) => {
        if (isServiceable) {
            geocoder.geocode({
                'latLng': myLatlng
            }, function(results, status) {
        
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    let data = {};
                    let addressComponents = results[0].address_components;
        
                    // Loop through address components
                    addressComponents.forEach(component => {
                        let types = component.types;
            
                        if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('sublocality_level_2')) {
                            data.sublocality = component.long_name;
                        }
                        if (types.includes('locality')) {
                            data.city = component.long_name;
                        }
                        if (types.includes('administrative_area_level_2') && !data.city) {
                            data.city = component.long_name; // Set only if city is empty
                        }
                        if (types.includes('administrative_area_level_1')) {
                            data.state = component.long_name;
                        }
                        if (types.includes('country')) {
                            data.country = component.long_name;
                        }
                        if (types.includes('postal_code')) {
                            data.pincode = component.long_name;
                        }
                        if (types.includes('political') && (types.includes('sublocality') || types.includes('locality'))) {
                            data.locality = data.locality || '';
                    
                            if (!data.locality.includes(component.long_name)) {
                                data.locality += (data.locality ? ', ' : '') + component.long_name;
                            }
                        }
                    });
            
                    // Ensure locality contains sublocality + city if both exist
                    if (!data.locality) {
                        data.locality = data.sublocality ? `${data.sublocality}, ${data.city}` : data.city;
                    }
            
                    // Setting values to input fields
                    document.getElementById('pincode').value = data.pincode || '';
                    document.getElementById('city').value = data.city || '';
                    $('#cityMapFlow').val(data.city || '');
                    document.getElementById('state').value = data.state || '';
                    $('#header-locality').html(data.sublocality);
                    if (data.locality) {
                        document.getElementById('location-placeholder').value = data.locality;
                        $('#localityMapFlow').val(data.locality);
                    }
                } else {
                    console.error("Geocoder failed due to: " + status);
                }
            });

            $('#mobileBtnSubmit').prop('disabled', false);
            if (!$('body #locationNotServiceable').hasClass('d-none')) {
                $('body #locationNotServiceable').addClass('d-none');
            }                    
        } else {
            $('body #locationNotServiceable').removeClass('d-none');
            $('#mobileBtnSubmit').prop('disabled', true);
            $('#localityMapFlow').val('');
            $('#cityMapFlow').val('');
        }
    })
    .catch((error) => {
        console.error("Error checking serviceability:", error);
    });
   

}

function editAddress(i) {

    // console.log(addressRows);
    // console.log(addressRows[i]);
    localStorage.setItem('businessId',addressRows[i]['businessId'])
    var cBID = addressRows[i]['businessId'];
    localityMapping = localityMappingObject?.[cBID] || 0;

    $('#location-placeholder').val('');
    // alert('ksjdf');

    // if (businessId == 89) {
    //     $("input[name=newAddType]").prop("checked", false);

    //     if (addressRows[i]['name'].toLowerCase() == 'others' || addressRows[i]['name'].toLowerCase() == 'other') {
    //         addressRows[i]['name'] = 'Other';
    //     }

    //     $("input[name=newAddType][value='" + addressRows[i]['name'] + "']").prop("checked", true)
    //     $('.fulladdh').html(addressRows[i]['city']);
    //     $('.fulladdh').val(addressRows[i]['city']);
    //     $('.fulladd').html(addressRows[i]['locality']);
    //     $('#newAddLocality').val(addressRows[i]['locality']);
    //     $('#newAddlat').val(addressRows[i]['latitude']);
    //     $('#newAddlng').val(addressRows[i]['longitude']);
    //     $('#newAddCity').val(addressRows[i]['city']);
    //     $('#newAddLine1').val(addressRows[i]['addressLine1']);
    //     $('#newAddLine2').val(addressRows[i]['addressLine2']);
    //     $('#newAddPhone').val(addressRows[i]['mobile']);
    //     $('#newAddId').val(addressRows[i]['deliveryAddressId']);
    //     if (addressRows[i]['email'] != 'info@uengage.in') {
    //         $('#newEmail').val(addressRows[i]['email']);
    //     } else {
    //         $('#newEmail').val('');
    //     }
    //     $('#addAddModal').modal('show');
    //     return false;
    // }

    //  if (typeof google != 'object' || typeof google.maps != 'object'){
    //     var script = document.createElement('script');
    //     if(map_keys==''){
    //       script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPZl9d43wBtEc1Wb933_3PlLTdGLbyLwk&libraries=places';
    //     }else{
    //       script.src = 'https://maps.googleapis.com/maps/api/js?key='+map_keys+'&libraries=places';
    //     }

    //     script.defer = true;
    //     document.head.appendChild(script);
    //     setTimeout("editAddress("+i+")", 1000);
    //  }else{
    // console.log(addressRows[i]);
    //  var lat=addressRows[i]['latitude'];
    //  var lng=addressRows[i]['longitude'];
    //  $('#mobileNoCust').val(addressRows[i]['mobile']);
    //  $('#location-placeholder').val(addressRows[i]['locality']);
    //  $("input[name=name][value='"+addressRows[i]['name']+"']").prop("checked",true);
    //  $('#deliveryAddressId').val(addressRows[i]['deliveryAddressId']);
    //  $('#addressLine1').val(addressRows[i]['addressLine1']);
    //  $('#addressLine2').val(addressRows[i]['addressLine2']);
    //  enableOtherOption(addressRows[i]['name']);
    if (localityMapping == 1) {
        $('#map-canvas').hide();
        $('.locality').hide();
        $('#newAddressModal').modal('show');
        $('#mapLoader').hide();
        $('#locality_flow').show();
        var localit = "<option value=''>--Select--</option>";
        for (var j = 0; j < locality_list.length > 0; j++) {
            localit += '<option value="' + locality_list[j]['localityId'] + '">' + locality_list[j]['localityName'] + '</option>';
        }
        $('#locality_manual').html('');
        $('#locality_manual').html(localit);
        var userData = JSON.parse(localStorage.getItem('userdata'));
        $('#mobileNoCust').val(userData['mobile']);
        //  console.log(addressRows[i]['localityId']);
        $('#locality_manual').val(addressRows[i]['localityId']);
        $('#email').val(addressRows[i]['email']);
        // $('#email').val('info@uengage.in');
    }  else if ((ecomm == 1 || localityMapping == 4)) {

        navigator.geolocation.getCurrentPosition(GetLocationMaps, GetLocationError);
        $('#newAddressModalEcomm').modal('show');
        var userData = JSON.parse(localStorage.getItem('userdata'));
        $('#addressLine1_ecom').val(addressRows[i]['addressLine1']);
        $('#addressLine2_ecom').val(addressRows[i]['addressLine2']);
        $('#locality_ecom').val(addressRows[i]['locality']);
        $('#pincode_ecom').val(addressRows[i]['pinCode']);
        $('#city_ecom').val(addressRows[i]['city']);
        $('#state_ecom').val(addressRows[i]['state']);
        $('#mobileNoCust_ecom').val(addressRows[i]['mobile']);
        $('#deliveryAddressId_ecom').val(addressRows[i]['deliveryAddressId']);

        if (addressRows[i]['email'] != 'info@uengage.in') {
            $('#email_ecom').val(addressRows[i]['email']);
        } else {
            $('#email_ecom').val('');
        }
        $("input[name=newAddressType][value='" + addressRows[i]['name'] + "']").prop("checked", true)
        enableOtherOption(addressRows[i]['name']);
        $('#newAddressModal').hide();
    }else {
        if (maps_flow == 1 && map_keys != '') {
            if (typeof google != 'object' || typeof google.maps != 'object') {
                var script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=' + map_keys + '&libraries=places';

                script.defer = true;
                document.head.appendChild(script);
                setTimeout("editAddress(" + i + ")", 1000);
            } else {
                var lat = addressRows[i]['latitude'];
                var lng = addressRows[i]['longitude'];
                $("input[name=newAddress]").prop("checked", false);

                if (addressRows[i]['name'].toLowerCase() == 'others' || addressRows[i]['name'].toLowerCase() == 'other') {
                    addressRows[i]['name'] = 'Other';
                }

                $("input[name=newAddress][value='" + addressRows[i]['name'] + "']").prop("checked", true)
                $('#mobileNoCust').val(addressRows[i]['mobile']);
                $('#location-placeholder').val(addressRows[i]['locality']);
                $('#localityMapFlow').val(addressRows[i]['locality']);
                $('#cityMapFlow').val(addressRows[i]['city']);
                $('#deliveryAddressId').val(addressRows[i]['deliveryAddressId']);
                $('#addressLine1').val(addressRows[i]['addressLine1']);
                $('#addressLine2').val(addressRows[i]['addressLine2']);
                enableOtherOption(addressRows[i]['name']);
                $('#mapLoader').show();
                $('#locality_flow').hide();
                $('#newAddressModal').modal('show');
                var userData = JSON.parse(localStorage.getItem('userdata'));
                $('#update_address').html('Update');
                if (addressRows[i]['email'] != 'info@uengage.in') {
                    $('#email').val(addressRows[i]['email']);
                } else {
                    $('#email').val('');
                }

                // $('#email').val('info@uengage.in');
                $('#mapLoader').hide();
                initialize(lat, lng);
                $('#map-error').hide();
            }
        } else {
            $("input[name=newAddType]").prop("checked", false);

            if (addressRows[i]['name'].toLowerCase() == 'others' || addressRows[i]['name'].toLowerCase() == 'other') {
                addressRows[i]['name'] = 'Other';
            }

            $("input[name=newAddType][value='" + addressRows[i]['name'] + "']").prop("checked", true);
            $('.fulladdh').html(addressRows[i]['city']);
            $('.fulladdh').val(addressRows[i]['city']);
            $('.fulladd').html(addressRows[i]['locality']);
            $('#newAddLocality').val(addressRows[i]['locality']);
            $('#locality-input').val(addressRows[i]['locality']);
            $('#newAddlat').val(addressRows[i]['latitude']);
            $('#newAddlng').val(addressRows[i]['longitude']);
            $('#newAddCity').val(addressRows[i]['city']);
            $('#newAddLine1').val(addressRows[i]['addressLine1']);
            $('#newAddLine2').val(addressRows[i]['addressLine2']);
            $('#newAddPhone').val(addressRows[i]['mobile']);
            $('#newAddId').val(addressRows[i]['deliveryAddressId']);
            if (addressRows[i]['email'] != 'info@uengage.in') {
                $('#newEmail').val(addressRows[i]['email']);
            } else {
                $('#newEmail').val('');
            }
            $('#addAddModal').modal('show');
            $('#addAddModal').on('shown.bs.modal', function () {
                initializeLeafletMap(addressRows[i]['latitude'], addressRows[i]['longitude']);
            });
            return false;
        }


    }
    //  }


}

function addAddLocaltyFlow() {

    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    let mobile = $('#newAddPhone').val();
    let addressLine1 = $('#newAddLine1').val();
    let addressLine2 = $('#newAddLine2').val();
    let locality = $('#newAddLocality').val();
    let city = $('#newAddCity').val();
    let latitude = $('#newAddlat').val();
    let longitude = $('#newAddlng').val();
    let deliveryAddressId = $('#newAddId').val();
    let state = '';
    let pinCode = '';
    let email = $('#newEmail').val();
    let addressType = 1;

    if (addressLine1 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter address.");
        errormodalhide();
        return false;
    }
    if (addressLine1.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid address.");
        errormodalhide();
        return false;
    }
    if (addressLine2 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter landmark.");
        errormodalhide();
        return false;
    }
    if (addressLine2 != '' && addressLine2.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid landmark.");
        errormodalhide();
        return false;
    }

    if (mobile == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobile.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }

    if (validateEmail(email) == false && email != '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid email ID.");
        errormodalhide();
        return false;
    }
    if (locality =='') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please Select Valid Location.");
        errormodalhide();
        return false;
    }

    if (city == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please Select Valid Location.");
        errormodalhide();
        return false;
    }
    var url = '' + origin +  '/client/addDeliveryAddress/' + pId + '/' + contactMappingId + '/' + token;
    var name = $("input[name='newAddType']:checked").val();
    if (name == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Kindly select Address Type.");
        errormodalhide();
        return false;
    }
    if(name.toLowerCase() == 'other' || name.toLowerCase() == 'others'){
        addressType = 3;
    }else if(name.toLowerCase() == 'office' || name.toLowerCase() == 'work'){
        addressType = 2;
    }else{
        addressType = 1;
    }

    let postParams = {
        addressLine1,addressLine2,locality,city,contactId,state,pinCode,mobile,email,name,latitude,longitude,deliveryAddressId,'type': addressType
    };
    $('.spinner').show();
    $.ajax({
        url: url,
        type: "POST",
        data: postParams,
        dataType: "json",
        success: function(result) {
            $('.spinner').hide();
            
            if (result['status'] == 0) {
                $('.spinner').hide();
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();

            } else {
                $('.spinner').hide();
                 $('#addAddModal').modal('hide');
                 getDeliveryAddress();
                $('.contact-bx')[0].reset();
                $('#addAddModalMobileTwo').modal('hide');
                $('#promoapplied').modal('show');
                $('.promors').html(`Address Updated`);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);

            }


        }
    });

}
function save_address_ecom() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    let locality = $('#locality_ecom').val();
    let addressLine1 = $('#addressLine1_ecom').val();
    let addressLine2 = $('#addressLine2_ecom').val();
    let mobile = $('#mobileNoCust_ecom').val();
    let city = $('#city_ecom').val();
    let latitude = $('#lat_ecom').val();
    let longitude = $('#lng_ecom').val();
    let deliveryAddressId = $('#deliveryAddressId_ecom').val();
    let state = $('#state_ecom').val();
    let pinCode = $('#pincode_ecom').val();
    let email = $('#email_ecom').val();
    let addressType = 1;
    var pincodePattern = /^\d{6}$/;
    var businessId = localStorage.getItem('businessId');
    if (pinCode == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter pincode.");
        errormodalhide();
        return false;
    }
    if(!pincodePattern.test(pinCode)){
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid pincode.");
        errormodalhide();
        return false;
    }

    if (city == '' || state == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter a valid pincode");
        errormodalhide();
        return false;
    }

    if (addressLine1 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter address.");
        errormodalhide();
        return false;
    }
    if (addressLine1.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Entered address " + addressLine1 + " should have minimum four length .");
        errormodalhide();
        return false;
    }

    if (addressLine2 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter landmark.");
        errormodalhide();
        return false;
    }
    if (addressLine2.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Entered landmark " + addressLine2 + " should have minimum four length .");
        errormodalhide();
        return false;
    }

    if (mobile == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobile.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }
    // if(email=='' || email==null){
    //     $('#promonotapplied').modal('show');
    //     $('#promonotmsg').html("Please enter email ID.");
    //     errormodalhide();
    //     return false;
    // }
    if (validateEmail(email) == false && email.value != '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid email ID.");
        errormodalhide();
        return false;
    }

    if(locality == ''){
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter locality.");
        errormodalhide();
        return false;
    }

    var name = $("input[name='newAddressType']:checked").val();
    if (name == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Kindly please select Address Type.");
        errormodalhide();
        return false;
    }
    if (name.toLowerCase() == 'other' || name.toLowerCase() == 'others') {
        addressType = 3;
    } else if (name.toLowerCase() == 'office') {
        addressType = 2;
    }else if(name.toLowerCase() == 'hotel'){
        addressType = 4;
    } else {
        addressType = 1;
    }

    let postParams = {
        addressLine1,
        addressLine2,
        locality,
        city,
        contactId,
        state,
        pinCode,
        mobile,
        email,
        name,
        latitude,
        longitude,
        deliveryAddressId,
        'type': addressType
    };
    var url = '' + origin + '/client/addDeliveryAddress/' + businessId + '/' + contactMappingId + '/' + token;

    $.ajax({
        url: url,
        type: "POST",
        data: postParams,
        dataType: "json",

        success: function(result) {
            if (result['status'] == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
            } else {
                if (ecomm == 1 || localityMapping == 4) {
                    $('#newAddressModalEcomm').modal('hide');
                } else {
                    $('#newAddressModal').modal('hide');
                }

                $('#promoapplied').modal('show');
                $('.promors').html(`Address Updated`);
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);

                getDeliveryAddress();
                $('.contact-bx').trigger('reset');
            }
        }
    });


}

function save_address() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    var contactId = userData['contactId'];
    let locality = $('#location-placeholder').val();
    let addressLine1 = $('#addressLine1').val();
    let addressLine2 = $('#addressLine2').val();
    let mobile = $('#mobileNoCust').val();
    let city = $('#city').val();
    let latitude = $('#lat').val();
    let longitude = $('#lng').val();
    let deliveryAddressId = $('#deliveryAddressId').val();
    let state = $('#state').val();
    let pinCode = $('#pincode').val();
    let email = $('#email').val();
    let addressType = 1;

    if (addressLine1 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter address.");
        errormodalhide();
        return false;
    }
    if (addressLine1.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Entered address " + addressLine1 + " should have minimum four length .");
        errormodalhide();
        return false;
    }

    if (addressLine2 == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter landmark.");
        errormodalhide();
        return false;
    }
    if (addressLine2.length <= 3) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Entered landmark " + addressLine2 + " should have minimum four length .");
        errormodalhide();
        return false;
    }

    if (mobile == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter Mobile number.");
        errormodalhide();
        return false;
    }

    if (mobile.length != 10) {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Mobile number should be 10 digits only.");
        errormodalhide();
        return false;
    }

    if (validateEmail(email) == false && email.value != '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Please enter valid email ID.");
        errormodalhide();
        return false;
    }

    if (localityMapping == 1) {
        locality = $('#locality_manual').val();
    }
    
    if (localityMapping != 1) {
        if (locality == '') {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html('Please choose a valid location');
            errormodalhide();
            return false;
        }
        if ($('#lat').val() == '' || $('#lng').val() == '') {
            $('#promonotapplied').modal('show');
            $('#promonotmsg').html('Not able to fetch the entered location');
            errormodalhide();
            return false;
        }
    }

    var name = $("input[name='newAddress']:checked").val();
    if (name == '') {
        $('#promonotapplied').modal('show');
        $('#promonotmsg').html("Kindly please select Address Type.");
        errormodalhide();
        return false;
    }
    if (name.toLowerCase() == 'other' || name.toLowerCase() == 'others') {
        addressType = 3;
    } else if (name.toLowerCase() == 'office' || name.toLowerCase() == 'work') {
        addressType = 2;
    } else {
        addressType = 1;
    }

    let postParams = {
        addressLine1,
        addressLine2,
        locality,
        city,
        contactId,
        state,
        pinCode,
        mobile,
        email,
        name,
        latitude,
        longitude,
        deliveryAddressId,
        'type': addressType
    };
    $('.spinner').show();
    var url = '' + origin +  '/client/addDeliveryAddress/' + pId + '/' + contactMappingId + '/' + token;
    $.ajax({
        url: url,
        type: "POST",
        data: postParams,
        dataType: "json",
        success: function(result) {
            $('.spinner').hide();
            if (result['status'] == 0) {
                $('#promonotapplied').modal('show');
                $('#promonotmsg').html(result['msg']);
                errormodalhide();
                return false;
            } else {
                $('#promoapplied').modal('show');
                $('.promors').html('Address Updated');
                setTimeout(function() {
                    $('#promoapplied').modal('hide')
                }, 2500);
                $('#addAddModalMobile').modal('hide');
                $('#newAddressModal').modal('hide');
                getDeliveryAddress();
                $('.contact-bx')[0].reset();
            }
        }
    });

}

// end Js for edit address

function getReservationListing() {
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var token = userData['token'];
    $('.spinner').show();
    $.ajax({
        url: origin + `/client/getReservationList?contactMappingId=${contactMappingId}&pId=${pId}&businessId=${pId}`,
        type: "GET",
        headers: {
            'TOKEN': token
        },
        dataType: "json",
        success: function(result) {
            var past = ``;
            var upcoming = ``;
            var currentTime = new Date();
            if (result.status == 1) {
            if (result['list'].length == 0) {
                $("#past").html(`<div class="text-center w-100"><img src="${origin}/assets/wla_new/img/reservation_past.png" alt="Reservation past" class="demo-img" width="300" height="300"/><h4 class="mb-0 mt-3">No Past Reservations</h4></div>`);
                $("#upcoming").html(`<div class="text-center w-100"><img src="${origin}/assets/wla_new/img/reservation_past.png" alt="Reservation past" class="demo-img" width="300" height="300"/><h4 class="mb-0 mt-3">No Upcoming Reservations</h4></div>`);
                $('.spinner').hide();
                return;
            }
            
            for (var i = 0; i < result['list'].length; i++) {
                var dataDetail = result['list'][i];
                var scheduledAt = new Date(dataDetail['scheduledAt']).getTime();
                const scheduledDate = new Date(scheduledAt);

                const twoHoursLater = new Date(scheduledAt + 2 * 60 * 60 * 1000);
                var status = parseInt(dataDetail['status'], 10);
                var statusDiv='';
                var ctaOptions=``;
                var url = origin +"/past-reservations/" + dataDetail.appointmentId;
                var downPrompt=``;
                if(currentTime < twoHoursLater){
                if(status==-1){
                    ctaOptions=`
                                            <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                        `;
                    downPrompt=`<div class="reservation-bottom"><p class="mb-0">Waiting for confirmation from the outlet</p></div>`;
                }
                if(dataDetail.uengage_pay==1){
                    if (currentTime >= scheduledAt && currentTime <= twoHoursLater) {
                        downPrompt=`<div class="reservation-bottom"><p class="mb-0">Pay bill between ${formatTime(scheduledDate)} to ${formatTime(twoHoursLater)} </p></div>`;
                    ctaOptions=`

                            <a class="direction-btn" href="/direct-pay/${dataDetail.slug}">Direct Pay</a>

                       
                      `;
                    }else{
                    if(status != -1 && status != 3){
                        downPrompt=`<div class="reservation-bottom"><p class="mb-0">Pay bill between ${formatTime(scheduledDate)} to ${formatTime(twoHoursLater)} </p></div>`;
                    }
                    ctaOptions=` 
                                            <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                       `;
                    }
                }else{
                    ctaOptions=` 
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
                var data = `  <div class="reservation-card col-md-4">
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

            }
            else{
                var url = origin +"/past-reservations/" + dataDetail.appointmentId;
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
                
                  <div class="reservation-card col-md-4">
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
                                  <a class="direction-btn" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank">Directions</a>
                                    <div class="anker-btns-home">
                                        <a class="call-btn mr-1" href="tel:${dataDetail['outletContact']}"><span>Call</span></a>
                                        <a class="call-btn ml-1" href="${url}"><span>Details</span></a>
                                    </div>
                                </div>
                            </div>
                            
                                  
                            
                        </div>
                    </div>
                
                
                
               `;

            }
            if (currentTime < scheduledAt) {
                upcoming += data;
            } else if (currentTime >= scheduledAt && currentTime <= twoHoursLater) {
                upcoming += data;
            } else {
                past += data;
            }
            
            }
            if (past == "") {
                $("#past").html(`<div class="text-center w-100"><img src="${origin}/assets/wla_new/img/reservation_past.png" alt="Reservation past" class="demo-img" width="300" height="300"/><h4 class="mb-0 mt-3">No Past Reservations</h4></div>`);
            } else {
                $("#past").html(past);
            }
            if (upcoming == "") {
                $("#upcoming").html(`<div class="text-center w-100"><img src="${origin}/assets/wla_new/img/reservation_past.png" alt="Reservation past" class="demo-img" width="300" height="300"/><h4 class="mb-0 mt-3">No Upcoming Reservations</h4></div>`);
            } else {
                $("#upcoming").html(upcoming);
            }
            }
            // Hide spinner once data is fully loaded
            $('.spinner').hide();

            // Append or update data in the DOM
            $('#upcoming').html(upcoming);
            $('#past').html(past);
    },
    error: function() {
        // Hide spinner in case of an error
        $('.spinner').hide();
    }
    });
}
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
function getReservationDetailOverview(reservationId){
    var userData = JSON.parse(localStorage.getItem('userdata'));
    var contactMappingId = userData['contactMappingId'];
    var mobileNo = userData['mobile'];
    var token = userData['token'];
    
    $.ajax({
        url: origin + `/client/getReservationData?reservationId=${reservationId}&contactMappingId=${contactMappingId}&businessId=${pId}`,
        type: "GET",
        headers: {
            'TOKEN': token
        },
        dataType: "json",
        success: function(result) {
            if (result.status == 1) {
                var lottieDiv=``;
                var dataDetail = result['list'][0];
                var status = parseInt(dataDetail['status']);
                var statusDiv='';
                var subText=``;
                
                lottieDiv=`<div class="text-center mb-2">
                        <img src="/assets/wla_new/img/confirmed.svg" alt="confirmed-" width="200" height="200" style="max-width: 80px;">
                    </div>`;
                switch (status) {
                    case -1:
                        statusDiv = `Request Submitted`;
                        subText=`Waiting for confirmation from the outlet`;
                       
                        break;
                    case 0:
                        statusDiv = `Confirmed`;
                        break;
                    case 1:
                        statusDiv = `Served`;
                        break;
                    case 3:
                        statusDiv = `Rejected`;
                        subText='Uh-oh! The merchant could not serve you :(';
                        lottieDiv=`<div class="text-center mb-2">
                        <img src="/assets/wla_new/img/cancelled-svg.svg" alt="cancelled-svg" width="200" height="200" style="max-width: 80px;">
                    </div>`;
                        break;
                    case 4:
                        statusDiv = `Noshow`;
                        break;
                    default:
                        statusDiv = `Request Submitted`;
                        subText=`Waiting for confirmation from the outlet`;
                        break;
                }

            var data =`<div class="reservation-details-nw">
        <div class="container">
            <div class="row align-items-center">
               <div class="col-md-6">
                  <h1 class="heading-top mb-0"><a href="javascript:history.back()" style="line-height: initial; display: flex;"><svg fill="none" height="29" viewBox="0 0 31 29" width="31" xmlns="http://www.w3.org/2000/svg"><path d="M3.57527 13.4838H27.6613C27.9807 13.4838 28.287 13.6106 28.5129 13.8365C28.7387 14.0623 28.8656 14.3687 28.8656 14.6881C28.8656 15.0075 28.7387 15.3138 28.5129 15.5396C28.287 15.7655 27.9807 15.8924 27.6613 15.8924H3.57527C3.25587 15.8924 2.94955 15.7655 2.7237 15.5396C2.49785 15.3138 2.37097 15.0075 2.37097 14.6881C2.37097 14.3687 2.49785 14.0623 2.7237 13.8365C2.94955 13.6106 3.25587 13.4838 3.57527 13.4838Z" fill="black"></path><path d="M4.07383 14.6881L14.0623 24.6741C14.2884 24.9003 14.4155 25.207 14.4155 25.5268C14.4155 25.8466 14.2884 26.1533 14.0623 26.3794C13.8362 26.6056 13.5295 26.7326 13.2097 26.7326C12.8898 26.7326 12.5831 26.6056 12.357 26.3794L1.5183 15.5407C1.40615 15.4289 1.31717 15.296 1.25645 15.1497C1.19574 15.0033 1.16449 14.8465 1.16449 14.6881C1.16449 14.5297 1.19574 14.3728 1.25645 14.2265C1.31717 14.0802 1.40615 13.9473 1.5183 13.8354L12.357 2.99673C12.5831 2.7706 12.8898 2.64355 13.2097 2.64355C13.5295 2.64355 13.8362 2.7706 14.0623 2.99673C14.2884 3.22287 14.4155 3.52957 14.4155 3.84938C14.4155 4.16918 14.2884 4.47589 14.0623 4.70202L4.07383 14.6881Z" fill="black"></path></svg></a> <span class="d-none d-md-inline-block">Reservations</span></h1>
               </div>
               <div class="col-md-6 d-none d-md-block text-right">
                  <a href="#" data-toggle="modal" data-target="#tNcModal" class="next-steps">Next Steps?</a>
               </div>
            </div>
                ${lottieDiv}
           

            <h3 class="heading-mid text-center mb-2 mb-md-3 text-capitalize">Reservation ${statusDiv}</h3>
            <p class="paragraph-mid text-center mb-2">${subText}</p>

            <div class="d-block d-md-none nextstepdv text-center">
               <a href="#" data-toggle="modal" data-target="#tNcModal" class="next-steps">Next Steps?</a>
            </div>
        </div>
    </div>

    <div class="reservation-detail-bottom pt-4 pb-4">
      <div class="container">
         <div class="row">
            <div class="col-md-4">
               <h4 class="common-tpt text-center text-md-left">Reservation Summary</h4>

               <div class="common-cc">
                  <div class="row m-0 w-100">
                     <div class="col-7 pl-0 pr-1">
                        <p class="mb-0 d-flex align-items-center"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M7 1.75C7.41421 1.75 7.75 2.08579 7.75 2.5V3.26272C8.41203 3.24999 9.1414 3.24999 9.94358 3.25H14.0564C14.8586 3.24999 15.588 3.24999 16.25 3.26272V2.5C16.25 2.08579 16.5858 1.75 17 1.75C17.4142 1.75 17.75 2.08579 17.75 2.5V3.32709C18.0099 3.34691 18.2561 3.37182 18.489 3.40313C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33855 22.5969 7.51098C22.6472 7.88567 22.681 8.29459 22.7037 8.74007C22.7337 8.82106 22.75 8.90861 22.75 9C22.75 9.06932 22.7406 9.13644 22.723 9.20016C22.75 10.0021 22.75 10.9128 22.75 11.9436V14.0564C22.75 15.8942 22.75 17.3498 22.5969 18.489C22.4392 19.6614 22.1071 20.6104 21.3588 21.3588C20.6104 22.1071 19.6614 22.4392 18.489 22.5969C17.3498 22.75 15.8942 22.75 14.0564 22.75H9.94359C8.10583 22.75 6.65019 22.75 5.51098 22.5969C4.33856 22.4392 3.38961 22.1071 2.64124 21.3588C1.89288 20.6104 1.56076 19.6614 1.40314 18.489C1.24997 17.3498 1.24998 15.8942 1.25 14.0564V11.9436C1.24999 10.9127 1.24998 10.0021 1.27701 9.20017C1.25941 9.13645 1.25 9.06932 1.25 9C1.25 8.90862 1.26634 8.82105 1.29627 8.74006C1.31895 8.29458 1.35276 7.88566 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40313C5.7439 3.37182 5.99006 3.34691 6.25 3.32709V2.5C6.25 2.08579 6.58579 1.75 7 1.75ZM2.76309 9.75C2.75032 10.4027 2.75 11.146 2.75 12V14C2.75 15.9068 2.75159 17.2615 2.88976 18.2892C3.02502 19.2952 3.27869 19.8749 3.7019 20.2981C4.12511 20.7213 4.70476 20.975 5.71085 21.1102C6.73851 21.2484 8.09318 21.25 10 21.25H14C15.9068 21.25 17.2615 21.2484 18.2892 21.1102C19.2952 20.975 19.8749 20.7213 20.2981 20.2981C20.7213 19.8749 20.975 19.2952 21.1102 18.2892C21.2484 17.2615 21.25 15.9068 21.25 14V12C21.25 11.146 21.2497 10.4027 21.2369 9.75H2.76309ZM21.1683 8.25H2.83168C2.8477 8.06061 2.86685 7.88123 2.88976 7.71085C3.02502 6.70476 3.27869 6.12511 3.7019 5.7019C4.12511 5.27869 4.70476 5.02502 5.71085 4.88976C6.73851 4.75159 8.09318 4.75 10 4.75H14C15.9068 4.75 17.2615 4.75159 18.2892 4.88976C19.2952 5.02502 19.8749 5.27869 20.2981 5.7019C20.7213 6.12511 20.975 6.70476 21.1102 7.71085C21.1331 7.88123 21.1523 8.06061 21.1683 8.25Z" fill="#1C274C" fill-rule="evenodd"></path></svg> ${formatReserveDateTime(dataDetail['scheduledAt'])}</p>
                     </div>
                     <div class="col-5 pl-1 pr-0">
                        <p class="mb-0 d-flex align-items-center"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.25C6.37665 1.25 4.25 3.37665 4.25 6C4.25 8.62335 6.37665 10.75 9 10.75C11.6234 10.75 13.75 8.62335 13.75 6C13.75 3.37665 11.6234 1.25 9 1.25ZM5.75 6C5.75 4.20507 7.20507 2.75 9 2.75C10.7949 2.75 12.25 4.20507 12.25 6C12.25 7.79493 10.7949 9.25 9 9.25C7.20507 9.25 5.75 7.79493 5.75 6Z" fill="#1C274C" clip-rule="evenodd" fill-rule="evenodd"></path><path d="M15 2.25C14.5858 2.25 14.25 2.58579 14.25 3C14.25 3.41421 14.5858 3.75 15 3.75C16.2426 3.75 17.25 4.75736 17.25 6C17.25 7.24264 16.2426 8.25 15 8.25C14.5858 8.25 14.25 8.58579 14.25 9C14.25 9.41421 14.5858 9.75 15 9.75C17.0711 9.75 18.75 8.07107 18.75 6C18.75 3.92893 17.0711 2.25 15 2.25Z" fill="#1C274C"></path><path d="M3.67815 13.5204C5.07752 12.7208 6.96067 12.25 9 12.25C11.0393 12.25 12.9225 12.7208 14.3219 13.5204C15.7 14.3079 16.75 15.5101 16.75 17C16.75 18.4899 15.7 19.6921 14.3219 20.4796C12.9225 21.2792 11.0393 21.75 9 21.75C6.96067 21.75 5.07752 21.2792 3.67815 20.4796C2.3 19.6921 1.25 18.4899 1.25 17C1.25 15.5101 2.3 14.3079 3.67815 13.5204ZM4.42236 14.8228C3.26701 15.483 2.75 16.2807 2.75 17C2.75 17.7193 3.26701 18.517 4.42236 19.1772C5.55649 19.8253 7.17334 20.25 9 20.25C10.8267 20.25 12.4435 19.8253 13.5776 19.1772C14.733 18.517 15.25 17.7193 15.25 17C15.25 16.2807 14.733 15.483 13.5776 14.8228C12.4435 14.1747 10.8267 13.75 9 13.75C7.17334 13.75 5.55649 14.1747 4.42236 14.8228Z" fill="#1C274C" clip-rule="evenodd" fill-rule="evenodd"></path><path d="M18.1607 13.2674C17.7561 13.1787 17.3561 13.4347 17.2674 13.8393C17.1787 14.2439 17.4347 14.6439 17.8393 14.7326C18.6317 14.9064 19.2649 15.2048 19.6829 15.5468C20.1014 15.8892 20.25 16.2237 20.25 16.5C20.25 16.7507 20.1294 17.045 19.7969 17.3539C19.462 17.665 18.9475 17.9524 18.2838 18.1523C17.8871 18.2717 17.6624 18.69 17.7818 19.0867C17.9013 19.4833 18.3196 19.708 18.7162 19.5886C19.5388 19.3409 20.2743 18.9578 20.8178 18.4529C21.3637 17.9457 21.75 17.2786 21.75 16.5C21.75 15.6352 21.2758 14.912 20.6328 14.3859C19.9893 13.8593 19.1225 13.4783 18.1607 13.2674Z" fill="#1C274C"></path></svg> ${dataDetail['pax'] > 1 ? dataDetail['pax'] + ' Guests' : dataDetail['pax'] + ' Guest'}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-md-4 mt-3 mt-md-0">
               <h4 class="common-tpt text-center text-md-left ss-two">Outlet Details</h4>

               <div class="common-cc">
                  <div class="row m-0 w-100 align-items-center">
                     <div class="col-7 pl-0 pr-1">
                        <p class="mb-0 d-flex align-items-center">${dataDetail.locality}, ${dataDetail.city}</p>
                     </div>
                     <div class="col-5 pl-1 pr-0">
                        <p class="mb-0 d-flex align-items-center justify-content-left justify-content-md-end addres">
                           <a class="svg-icon" href="https://www.google.com/maps/dir//${dataDetail.lat},${dataDetail.long}/@${dataDetail.lat},${dataDetail.long},17z" target="_blank"><svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.25 7.75185C5.25 4.30362 8.30876 1.57031 12 1.57031C15.608 1.57031 18.6116 4.18166 18.7454 7.51953L19.2231 7.67216C19.6863 7.82007 20.0922 7.94971 20.4142 8.09328C20.7623 8.24849 21.0814 8.4484 21.3253 8.77271C21.5692 9.09701 21.6662 9.45029 21.7098 9.81588C21.7501 10.1541 21.75 10.5641 21.75 11.0319V16.5406C21.75 17.1246 21.7501 17.6229 21.7028 18.0226C21.653 18.443 21.5418 18.8562 21.2404 19.2087C21.0674 19.4112 20.8573 19.5817 20.6205 19.712C20.2081 19.939 19.7645 19.9762 19.3236 19.9541C18.9044 19.9331 18.3915 19.8511 17.7904 19.7551L17.7488 19.7484C16.456 19.5419 15.9351 19.4639 15.4274 19.5046C15.2417 19.5195 15.0571 19.5461 14.875 19.5842C14.3774 19.6884 13.8988 19.912 12.716 20.4787C12.6749 20.4984 12.6342 20.5179 12.594 20.5372C11.2114 21.2 10.3595 21.6083 9.44031 21.7359C9.16384 21.7742 8.88482 21.7932 8.60546 21.7927C7.67668 21.791 6.77995 21.5044 5.32536 21.0395C5.28328 21.0261 5.24074 21.0125 5.19772 20.9987L4.81415 20.8762L4.77684 20.8643C4.31373 20.7164 3.90783 20.5867 3.5858 20.4432C3.23766 20.288 2.91861 20.0881 2.67471 19.7638C2.4308 19.4395 2.33379 19.0862 2.29024 18.7206C2.24995 18.3824 2.24997 17.9724 2.25 17.5045L2.25 12.6939C2.24997 11.9406 2.24994 11.3055 2.31729 10.8081C2.38759 10.289 2.54652 9.78141 2.98262 9.3997C3.11082 9.28749 3.25213 9.18988 3.40375 9.10882C3.91953 8.83304 4.47226 8.84905 5.00841 8.94931C5.11717 8.96965 5.23109 8.99469 5.35019 9.02379C5.28411 8.59652 5.25 8.17058 5.25 7.75185ZM5.74869 10.6355C5.32072 10.5032 4.99224 10.4109 4.72113 10.3602C4.32599 10.2863 4.19646 10.3311 4.13459 10.3642C4.08405 10.3912 4.03694 10.4237 3.99421 10.4611C3.9419 10.5069 3.85663 10.6105 3.80482 10.9931C3.75151 11.3869 3.75 11.9275 3.75 12.7426V17.4669C3.75 17.9835 3.75114 18.3106 3.78055 18.5575C3.80779 18.7861 3.85234 18.8711 3.89157 18.9232C3.9308 18.9754 4.00083 19.0428 4.21849 19.1398C4.45364 19.2446 4.77709 19.3491 5.28849 19.5125L5.67205 19.635C7.29563 20.1536 7.95089 20.354 8.6083 20.3552C8.81478 20.3556 9.02101 20.3416 9.22537 20.3132C9.87582 20.2229 10.5009 19.9329 12.0452 19.193C12.0765 19.178 12.1074 19.1632 12.138 19.1485C13.1987 18.6401 13.852 18.3269 14.555 18.1798C14.8014 18.1283 15.051 18.0923 15.3023 18.0721C16.0193 18.0146 16.7344 18.1289 17.8945 18.3144C17.9278 18.3197 17.9614 18.3251 17.9954 18.3305C18.6497 18.435 19.0779 18.5023 19.4019 18.5185C19.7138 18.5342 19.821 18.4943 19.8735 18.4654C19.9524 18.422 20.0225 18.3651 20.0801 18.2977C20.1185 18.2528 20.1771 18.1581 20.2123 17.8606C20.2489 17.5516 20.25 17.1358 20.25 16.5002V11.0696C20.25 10.553 20.2489 10.2259 20.2195 9.97894C20.1922 9.75036 20.1477 9.66539 20.1084 9.61323C20.0692 9.56107 19.9992 9.49369 19.7815 9.39665C19.5464 9.29181 19.2229 9.18735 18.7115 9.02398L18.6527 9.00518C18.4625 10.2523 17.9996 11.5114 17.3173 12.6352C16.4048 14.1379 15.0697 15.4468 13.3971 16.1461C12.5094 16.5173 11.4906 16.5173 10.6029 16.1461C8.93027 15.4468 7.59519 14.1379 6.68273 12.6352C6.29871 12.0027 5.9842 11.3274 5.74869 10.6355ZM12 3.00781C9.06383 3.00781 6.75 5.16605 6.75 7.75185C6.75 9.11024 7.18744 10.6082 7.97922 11.9122C8.77121 13.2166 9.88753 14.2787 11.2027 14.8285C11.708 15.0398 12.292 15.0398 12.7973 14.8285C14.1125 14.2787 15.2288 13.2166 16.0208 11.9122C16.8126 10.6082 17.25 9.11024 17.25 7.75185C17.25 5.16605 14.9362 3.00781 12 3.00781ZM12 6.84115C11.3096 6.84115 10.75 7.37747 10.75 8.03906C10.75 8.70065 11.3096 9.23698 12 9.23698C12.6904 9.23698 13.25 8.70065 13.25 8.03906C13.25 7.37747 12.6904 6.84115 12 6.84115ZM9.25 8.03906C9.25 6.58356 10.4812 5.40365 12 5.40365C13.5188 5.40365 14.75 6.58356 14.75 8.03906C14.75 9.49456 13.5188 10.6745 12 10.6745C10.4812 10.6745 9.25 9.49456 9.25 8.03906Z" fill="var(--main-bg-color)" fill-rule="evenodd"></path></svg></a>
                            <a class="svg-icon" href="tel:${dataDetail['outletContact']}"><svg fill="none" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg"><path d="M3.93141 2.44853C4.95323 1.42653 6.64341 1.61801 7.48807 2.75293L8.5389 4.16486C9.21451 5.07263 9.15744 6.33468 8.35113 7.14114L8.14708 7.34521C8.14651 7.34662 8.14592 7.34815 8.1453 7.3498C8.13452 7.37859 8.10725 7.47025 8.13408 7.64422C8.18971 8.00486 8.48275 8.73769 9.67246 9.92761C10.8659 11.1213 11.5898 11.4026 11.9253 11.4544C12.07 11.4767 12.1457 11.4573 12.1698 11.4492L12.5103 11.1086C13.2385 10.3804 14.3738 10.2369 15.2892 10.7374L16.8813 11.608C18.242 12.3521 18.5587 14.1723 17.4713 15.2599L16.2875 16.4439C15.918 16.8135 15.4142 17.1289 14.7917 17.1873C13.2718 17.3298 9.75082 17.1441 6.05967 13.4524C2.61537 10.0075 1.96105 7.01109 1.87834 5.54712L2.43342 5.51881L1.87834 5.54712C1.83747 4.8238 2.17687 4.20337 2.62341 3.75675L3.93141 2.44853ZM6.46742 3.43849C6.04046 2.86481 5.27343 2.83058 4.83774 3.26635L3.52974 4.57457C3.25358 4.85078 3.10868 5.16736 3.12654 5.48347C3.19407 6.67874 3.73589 9.40389 6.96599 12.6345C10.3528 16.0219 13.473 16.1176 14.6689 16.0055C14.9053 15.9833 15.1486 15.8587 15.3811 15.6261L16.5649 14.4421C17.0756 13.9314 16.9417 13.0112 16.2577 12.6372L14.6656 11.7666C14.2384 11.533 13.7379 11.6052 13.4167 11.9264L13.0371 12.306L12.5978 11.9096C13.0371 12.3061 13.0365 12.3066 13.036 12.3072L13.0348 12.3084L13.0323 12.3108L13.027 12.3159L13.0151 12.3271C13.0065 12.335 12.9966 12.3437 12.9854 12.353C12.963 12.3717 12.9353 12.393 12.902 12.4154C12.8352 12.4604 12.7463 12.5098 12.6338 12.552C12.4038 12.6382 12.1001 12.6844 11.7249 12.6265C10.9936 12.5137 10.0352 12.0147 8.76614 10.7454C7.49335 9.47242 7.00622 8.52263 6.89729 7.81638C6.84185 7.45691 6.88622 7.16906 6.96764 6.95169C7.00768 6.8448 7.05495 6.75956 7.09855 6.69484C7.12029 6.66256 7.14101 6.63554 7.15933 6.61355C7.16849 6.60255 7.17705 6.59281 7.18485 6.5843L7.19595 6.57243L7.20104 6.56718L7.20346 6.56472L7.20463 6.56353C7.20521 6.56295 7.20578 6.56238 7.64884 6.96216L7.20579 6.56237L7.4448 6.32332C7.81608 5.95198 7.87003 5.32309 7.51824 4.85041L6.46742 3.43849Z" fill="#91204A" clip-rule="evenodd" fill-rule="evenodd"></path><path d="M11.0509 1.48885C11.106 1.16515 11.4282 0.945558 11.7689 0.997965C11.79 1.0018 11.8578 1.01385 11.8934 1.02137C11.9645 1.03642 12.0637 1.05958 12.1874 1.0938C12.4347 1.16223 12.7802 1.27497 13.1949 1.45558C14.0251 1.81718 15.13 2.44972 16.2765 3.5389C17.423 4.62807 18.0888 5.67767 18.4694 6.46639C18.6595 6.86034 18.7782 7.18857 18.8502 7.42352C18.8863 7.541 18.9106 7.63523 18.9265 7.70279C18.9344 7.73657 18.9402 7.76369 18.9442 7.78373L18.949 7.80842C19.0042 8.13213 18.7751 8.45079 18.4344 8.50319C18.0946 8.55545 17.7745 8.33692 17.718 8.01474C17.7163 8.00609 17.7115 7.98284 17.7064 7.96093C17.6961 7.91708 17.6783 7.84755 17.6501 7.7556C17.5937 7.57167 17.4958 7.29828 17.3331 6.96128C17.0083 6.28813 16.4241 5.35856 15.3926 4.37859C14.361 3.39861 13.3825 2.84366 12.6739 2.53504C12.3192 2.38054 12.0314 2.2875 11.8378 2.23392C11.741 2.20714 11.6194 2.18061 11.5732 2.17084C11.2341 2.11715 10.9959 1.81163 11.0509 1.48885Z" fill="#91204A"></path><path d="M11.2391 4.21985C11.3339 3.90455 11.6798 3.72197 12.0117 3.81206L11.84 4.38297C12.0117 3.81206 12.012 3.81214 12.0123 3.81222L12.0129 3.81239L12.0142 3.81274L12.017 3.81351L12.0234 3.81534L12.0399 3.82022C12.0525 3.82404 12.0682 3.82901 12.0869 3.83532C12.1243 3.84793 12.1738 3.86588 12.2344 3.89058C12.3558 3.94001 12.5217 4.01634 12.7255 4.1309C13.1334 4.36023 13.6902 4.74117 14.3443 5.3626C14.9985 5.98404 15.3995 6.51302 15.6409 6.90051C15.7615 7.09408 15.8418 7.25168 15.8938 7.36701C15.9198 7.42465 15.9387 7.47164 15.952 7.5072C15.9586 7.52497 15.9639 7.53988 15.9679 7.55181L15.973 7.56748L15.975 7.57361L15.9758 7.57625L15.9761 7.57747L15.9763 7.57805C15.9764 7.57833 15.9765 7.57861 15.3755 7.74172L15.9765 7.57861C16.0713 7.89391 15.8791 8.22254 15.5472 8.31263C15.2182 8.40195 14.8753 8.22322 14.7771 7.91284L14.774 7.90431C14.7695 7.89241 14.7603 7.86899 14.7449 7.83479C14.7141 7.76644 14.6582 7.65463 14.5651 7.50533C14.3793 7.20708 14.0438 6.75642 13.4605 6.20229C12.8772 5.64816 12.4028 5.32935 12.0888 5.15284C11.9317 5.06447 11.814 5.01136 11.742 4.98206C11.706 4.9674 11.6814 4.95867 11.6689 4.95445L11.6599 4.95152C11.3332 4.8582 11.145 4.53247 11.2391 4.21985Z" fill="var(--main-bg-color)" clip-rule="evenodd" fill-rule="evenodd"></path></svg></a>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div class="col-md-4 mt-3 mt-md-0">
               <h4 class="common-tpt text-center text-md-left ss-two">Your Details</h4>

               <div class="common-cc">
                  <span>${dataDetail.contactName}</span>
                  <span>+91 ${mobileNo}</span>
               </div>
            </div>
         </div>
      </div>
    </div>`;
            $('#reservation-detail').html(data);
        }
    }
    });
}
/*delete address*/
$(document).ready(function () {
    $(".delete").click(function () {
        $(".manage-addresses").addClass("highlight");
		$(".delete-div").removeClass("d-none");
    });
	
	 $(".delete-nw-cancel").click(function () {
		$(".manage-addresses").removeClass("highlight");
		$(".delete-div").addClass("d-none");
    });
});
/*delete address*/
if ($(window).width() <= 767) {
    $('.right-move-address-one').append($('.address-right-one'));
    $('.right-move-address-two').append($('.address-right-two'));
}