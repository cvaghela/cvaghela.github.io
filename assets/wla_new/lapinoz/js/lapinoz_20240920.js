if($().slick){
  $(".banner-slide").slick({
    dots:true,
    arrows:false,
    infinite: true,
    autoplay:true,
    autoplaySpeed:1500,
    lazyLoad:"progressive",
    speed:1500,
  });
  $('.testimonial-slider').slick({
      dots:true,
      arrows:false
  }); 
  
  $('.screenshot-slide').slick({
  infinite: true,
  dots:true,
  arrows:false,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplaySpeed:1500,
  autoplay:true,
  responsive: [
    {
      breakpoint: 1500,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
  {
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
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    
  ]
  });

  $("#e-offers-slide").slick({
    arrows:true,
    dots:false,
    slidesToShow:3,
    slidesToScroll:1,
    responsive:[
        {
            breakpoint: 767,
            settings: 
            {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 575,
            settings: 
            {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
  });
}


function validateContactFranchise() {
  var valid = true;	
  $(".contact_form").css('background-color','');
  $(".info").html('');
  if(!$("#first_name").val()) {
      $("#first_name-info").html("(required)");
      $("#first_name").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#email_id").val()) {
      $("#email_id-info").html("(required)");
      $("#email_id").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#city").val()) {
      $("#city-info").html("(required)");
      $("#city").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#email_id").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
      $("#email_id-info").html("(invalid)");
      $("#email_id").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#message").val()) {
      $("#message-info").html("(required)");
      $("#message").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#contact_no").val()) {
      $("#contact_no-info").html("(required)");
      $("#contact_no").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#contact_no").val().match(/^[0-9]{10}$/g)) {
      $("#contact_no-info").html("(invalid)");
      $("#contact_no").css('background-color','#FFFFDF');
      valid = false;
  }
  
  return valid;
}

function sendContactFranchise() {
  

// alert('ok');   
  var valid;	
  valid = validateContactFranchise();
  if(valid) {
      jQuery.ajax({
          url: "https://www.uengage.in/addo/form_submit/lapinoz-franchise-enquiry",
          data:
          'first_name='+$("#first_name").val()+
          '&last_name='+$("#last_name").val()+
          '&email_id='+$("#email_id").val()+
          '&city='+$("#city").val()+
          '&message='+$("#message").val()+
          '&contact_no='+$("#contact_no").val(),
          type: "POST",
          
          
          success:function(data){
          // console.log(data );
              $('#franchise_form')[0].reset();
              $("#franchise-form-status").show();
              $("#franchise-form-status").html('Thanks for your interest. You will be contacted by one of our representative shortly.');
              $('html, body').animate({
                  scrollTop: $("#franchise-form-status").offset().top-100
              }, 500);
          },
          error:function (){}
      });
  }
}

// $('.store-city-list').overlayScrollbars({
//   className: "os-theme-dark",
//   scrollbars: {
//       visibility       : "auto",
//       autoHide         : "leave",
//       autoHideDelay    : 500,
//   }
// });  


function validateContact() {
  var valid = true;	
  $(".contact_form").css('background-color','');
  $(".info").html('');
  if(!$("#first_name").val()) {
      $("#first_name-info").html("(required)");
      $("#first_name").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#email_id").val()) {
      $("#email_id-info").html("(required)");
      $("#email_id").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#email_id").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
      $("#email_id-info").html("(invalid)");
      $("#email_id").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#message").val()) {
      $("#message-info").html("(required)");
      $("#message").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#contact_no").val()) {
      $("#contact_no-info").html("(required)");
      $("#contact_no").css('background-color','#FFFFDF');
      valid = false;
  }
  if(!$("#contact_no").val().match(/^[0-9]{10}$/g)) {
      $("#contact_no-info").html("(invalid)");
      $("#contact_no").css('background-color','#FFFFDF');
      valid = false;
  }
  
  return valid;
}

function sendContact() {

 // alert('ok');   
  var valid;	
  valid = validateContact();
  if(valid) {
      jQuery.ajax({
          url: "https://www.uengage.in/addo/form_submit/lapinoz-contact-us",
          data:
          'first_name='+$("#first_name").val()+
          '&last_name='+$("#last_name").val()+
          '&email_id='+$("#email_id").val()+
          '&message='+$("#message").val()+
          '&contact_no='+$("#contact_no").val(),
          type: "POST",
           
          
          success:function(data){
             $('#contact_form')[0].reset();
             $("#form-status").show();
             $("#form-status").html('Thanks for contacting us. We will get back to you shortly.');
             $('html, body').animate({
                  scrollTop: $("#form-status").offset().top-100
              }, 500);
             
          },
          error:function (){}
      });
  }
}





// ===== Scroll to Top ==== 
$(document).ready(function(){
  $(window).scroll(function() {
    if ($(this).scrollTop() >= 200) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
  });
  $('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
  });
  });
  
  
  /*sticky-header*/
  $(window).on("scroll", function() {
    if($(window).scrollTop()) {
        $('.header').addClass('black');
    }
  
    else {
        $('.header').removeClass('black');
    }
  })
  /*sticky-header*/
  
  
  /* Navbar Sidebar*/
  $(document).ready(function() {
    $(document).on('click', '.myDiv', function() {
      $('body').addClass('myBackground');
    $('.uengageoverlay').addClass('active');
    $('.sidenav').addClass('active');
    })
    $(document).on('click', '.closebtn', function() {
      $('body').removeClass('myBackground');
    $('.uengageoverlay').removeClass('active');
    $('.sidenav').removeClass('active');
    })
  });
  $(document).click(function(event) {
    if (!$(event.target).closest(".sidenav,.myDiv").length) {
      $("body").find(".sidenav").removeClass("active");
    $("body").find(".uengageoverlay").removeClass("active");
    $("html").find("body").removeClass("myBackground");
    }
  });
  

  if($().slick){
  /*Banner Slider*/
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
  responsive: [
    {
    breakpoint: 768,
    settings: {
      speed: 200,
      pauseOnHover: true,
    }
    }
  ]
});

/*Common Slider*/
$('.common-slider').slick({
slidesToShow: 3,
slidesToScroll: 1,
arrows: false,
dots: true,
autoplay: true,
autoplaySpeed: 1000,
lazyLoad: "ondemand",
speed: 500,
responsive: [
  {
  breakpoint: 1199,
  settings: {
    slidesToShow: 2,
    slidesToScroll: 1
  }
  },
  {
  breakpoint: 991,
  settings: {
    slidesToShow: 2,
    slidesToScroll: 1
  }
  },
  {
  breakpoint: 768,
  settings: {
    slidesToShow: 2,
    slidesToScroll: 1
  }
  },
  {
  breakpoint: 576,
  settings: {
    slidesToShow: 1,
    slidesToScroll: 1
  }
  }
]
});


/*Store Slider*/
$('.store-slider').slick({
slidesToShow: 3,
slidesToScroll: 1,
arrows: false,
dots: true,
autoplay: true,
autoplaySpeed: 1000,
lazyLoad: "ondemand",
speed: 500,
responsive: [
  {
  breakpoint: 1199,
  settings: {
    slidesToShow: 3,
    slidesToScroll: 1
  }
  },
  {
  breakpoint: 991,
  settings: {
    slidesToShow: 2,
    slidesToScroll: 1
  }
  },
  {
  breakpoint: 768,
  settings: {
    slidesToShow: 1,
    slidesToScroll: 1
  }
  }
]
});


/*Testimonials Slider
 $('.quotes').slick({
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 500,
  lazyLoad: "ondemand",
  slidesToShow: 1,
  adaptiveHeight: true,
  responsive: [
	  {
		breakpoint: 768,
		settings: {
		  slidesToShow: 1,
		  slidesToScroll: 1
		}
	  }
	]
});
*/

/*Client Slider Homepage*/
$(document).ready(function() {
    $('.slider-client').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        speed: 500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 576,
            settings: {
                slidesToShow: 2
            }
        }]
    });
});
/*Client Slider Homepage*/

/*Download The App Slider*/
$('.slider').slick({
dots: true,
arrows: false,
infinite: true,
autoplay: true,
autoplaySpeed: 3000,
lazyLoad: "ondemand",
speed: 500,
slidesToShow: 1,
adaptiveHeight: true,
fade: true
});


/*Banner Promo Code Slider*/
$(".banner-slider-promo").slick({
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  lazyLoad: "ondemand",
  slidesToShow: 3,
  slidesToScroll: 1,
  speed: 500,
fade: false,
responsive: [
  {
  breakpoint: 768,
  settings: {
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  }
]
});
}


// function showOutletNew(select,pId){
// 	var url=origin+'/client/getStores?city='+select.value+'&parentBusinessId='+pId;
// 	$.ajax({
// 		url: url, 
// 	   type: "GET",
// 	   dataType: "json",
// 	   success: function(result){
// 			if(result['status']==0){
// 			alert(result['msg']);
// 			}else{
// 			var list=result['loca_list'];
// 			var option='<option value="" selected disabled hidden>Select Your Favourite Outlet</option>';
// 			for(var i=0;i<list.length;i++){
// 				option+='<option value="'+list[i]['web_slug']+'">'+list[i]['locality']+'</option>';
// 			}
// 			$('#outletSelector').html('');
// 			$('#outletSelector').html(option);
// 			}

// 		}
// 	});
// }

// function openOrderPageNew(select){
//   window.location.href="order/"+select.value;
  
// }

/*Image Rotate*/
if(document.getElementById('js-logo') !=null){
window.onscroll = function() {
	if($(window).width()>768) {
		var theta = document.documentElement.scrollTop / 420 % Math.PI;	
		document.getElementById('js-logo').style.transform ='rotate(' + theta + 'rad)';
	}
	
	if($(window).width()<767) {
		var theta = document.documentElement.scrollTop / 700 % Math.PI;	
		document.getElementById('js-logo').style.transform ='rotate(' + theta + 'rad)';
	}
}
}
/*Image Rotate*/

/*Read More On Merchants Page*/
var desktop = !('ontouchstart' in document.documentElement);
var minHeight = 260, padBottom = 0; time = 250, offset = 50; //zero or whatever.
$('.city-outer-new').each(function(i) {
	if ($(this)[0].scrollHeight > minHeight) { $(this).after('<div class="update-btn" style="width: max-content; margin-top: 0px; padding: 10px 20px; cursor: pointer; margin: 0 auto; background-color: #DDF5E7; border: 1px solid #043D07; border-radius: 20px; font-weight: 600; color: #043D07;">View All Outlets</div>'); }
	});
	$(".update-btn").click(function() {
	var textbox= $(this).prev('.city-outer-new')
	if ($(this).text()=='View All Outlets') {
	textbox.css('height', textbox[0].scrollHeight + padBottom);
	$(this).text('View Less Outlets');
	} else {
	if (desktop) {
	textbox.css( 'height', minHeight );
	$('html, body').animate( { scrollTop: textbox.offset().top - offset }, {duration: time} )
	.promise().then(function() {  });  //fire once function if you need.
	} else {
	location.href = '#' +  $(this).parent().attr('id'); // mobile animate slow use bookmark.
	textbox.css('height', minHeight);
	}
	$(this).text('View All Outlets');
	}
});


/*animations js*/
var Animation = function({ offset } = { offset: 10 }) {
  var _elements;

  // Define a dobra superior, inferior e laterais da tela
  var windowTop = offset * window.innerHeight / 100;
  var windowBottom = window.innerHeight - windowTop;
  var windowLeft = 0;
  var windowRight = window.innerWidth;

  function start(element) {
      // Seta os atributos customizados
      element.style.animationDelay = element.dataset.animationDelay;
      element.style.animationDuration = element.dataset.animationDuration;
      // Inicia a animacao setando a classe da animacao
      element.classList.add(element.dataset.animation);
      // Seta o elemento como animado
      element.dataset.animated = "true";
  }

  function isElementOnScreen(element) {
      // Obtem o boundingbox do elemento
      var elementRect = element.getBoundingClientRect();
      var elementTop =
          elementRect.top + parseInt(element.dataset.animationOffset) ||
          elementRect.top;
      var elementBottom =
          elementRect.bottom - parseInt(element.dataset.animationOffset) ||
          elementRect.bottom;
      var elementLeft = elementRect.left;
      var elementRight = elementRect.right;

      // Verifica se o elemento esta na tela
      return (
          elementTop <= windowBottom &&
          elementBottom >= windowTop &&
          elementLeft <= windowRight &&
          elementRight >= windowLeft);

  }

  // Percorre o array de elementos, verifica se o elemento estя├Б∙▒ na tela e inicia animaя├Б∙√я├я▒o
  function checkElementsOnScreen(els = _elements) {
      for (var i = 0, len = els.length; i < len; i++) {
          // Passa para o proximo laя├Б∙√o se o elemento ja estiver animado
          if (els[i].dataset.animated) continue;

          isElementOnScreen(els[i]) && start(els[i]);
      }
  }

  // Atualiza a lista de elementos a serem animados
  function update() {
      _elements = document.querySelectorAll(
          "[data-animation]:not([data-animated])");

      checkElementsOnScreen(_elements);
  }

  // Inicia os eventos
  window.addEventListener("load", update, false);
  window.addEventListener("scroll", () => checkElementsOnScreen(_elements), { passive: true });
  window.addEventListener("resize", () => checkElementsOnScreen(_elements), false);

  // Retorna funcoes publicas
  return {
      start,
      isElementOnScreen,
      update
  };

};

// Initialize
var options = {
  offset: 20 //percentage of window
};
var animation = new Animation(options);
/*animations js*/
