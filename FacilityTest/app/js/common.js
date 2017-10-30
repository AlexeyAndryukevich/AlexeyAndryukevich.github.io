$(document).ready(function(){
	
	/*---Mobile menu---*/

	$('.btn-open-touch-area').click(function() {
		$('.main-head .menu, .btn-open, .btn-close').toggle();
		$('.btn-open-touch-area').css('z-index', -1);
		$('.btn-close-touch-area').css('z-index', 1);		
	});
	
	$('.btn-close-touch-area').click(function() {
		$('.main-head .menu, .btn-open, .btn-close').toggle();	
		$('.btn-close-touch-area').css('z-index', -1);
		$('.btn-open-touch-area').css('z-index', 1);		
	});
	

	/*---Full slider---*/

	var owlFullSlider = $(".full-slider");	

	owlFullSlider.owlCarousel({
		loop: true,
		items: 1,
		itemClass: "f-slide-wrap",
		nav: false,
		navText : "",
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		autoplaySpeed: 1000,
		
	});

	$('.f-slider-next ').click(function() {
		owlFullSlider.trigger('next.owl.carousel');
	})

	$('.f-slider-prev').click(function() {		
		owlFullSlider.trigger('prev.owl.carousel');
	})


	/*---Mini slider---*/
	
	var owlMiniSlider = $(".mini-slider");

	owlMiniSlider.owlCarousel({
		dots: false,

		loop: true,
		items: 3,
		itemClass: "m-slide-wrap",
		nav: false,
		navText : "",
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		autoplaySpeed: 1000,

		responsive:{
			0:{
				items: 1,		
			},
			600:{
				items: 2,		
				margin: 20,
			},
			992:{
				items: 3,				
				margin: 20
			},
			1170:{
				items: 3,								
				margin: 35				
			}
		}
	});

	$('.m-slider-next ').click(function() {
		owlMiniSlider.trigger('next.owl.carousel');
	})

	$('.m-slider-prev').click(function() {		
		owlMiniSlider.trigger('prev.owl.carousel');
	})


	/*---Popup---*/	

	$('a[href=#popup]').magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});

	$(".f-slider-btn").click(function(){
		owlFullSlider.trigger('stop.owl.autoplay');
	});

	$(".popup-close-btn").click(function(){
		$.magnificPopup.close();
		owlFullSlider.trigger('play.owl.autoplay');
	}); 


	/*---Parallax---*/		
	
	var k1, k2, k3, k4, k5;

	function prlSpacing() {	
		var w = $(window).width();
		if (w >= 992) {			
			k1=.7;
			k2=.4;
			k3=.2;
			k4=.1;
			k5=.04;					
		} else if (w<992 && w>=768) {			
			k1=.55;
			k2=.34;
			k3=.18;
			k4=.09;
			k5=.04;					
		} else if (w<768 && w>=480) {
			k1=.46;
			k2=.28;
			k3=.17;
			k4=.08;	
			k5=.03;								
		} else if (w < 480) {
			k1=.35;
			k2=.2;
			k3=.1;
			k4=.06;
			k5=.02;		
		}
	}

	prlSpacing();

	$(window).scroll(function() {
		var st = $(this).scrollTop();
		
			$('.prl-1st').css({
				"transform": "translate(0, -" + st*k1 + "px)"
			});

			$('.prl-2nd').css({
				"transform": "translate(0, -" + st*k2 + "px)"
			});

			$('.prl-3rd').css({
				"transform": "translate(0, -" + st*k3 + "px)"
			});

			$('.prl-4th').css({
				"transform": "translate(0, -" + st*k4 + "px)"
			});

			$('.prl-hide').css({
				"transform": "translate(50%, -" + st*k5 + "px)"
			});			
			
	});

	$(window).resize(function() {		
		prlSpacing();						
	});		

	$('.prl-hide').mouseover(function() {	
		$('.prl-1st, .prl-2nd, .prl-3rd, .prl-4th').css({
			"background-color": "rgba(100, 100, 100, 1)"
		})
	});

	$('.prl-hide').mouseleave(function() {
		$('.prl-1st, .prl-2nd, .prl-3rd, .prl-4th').css({
			"background-color": "rgba(100, 100, 100, .8)"
		})
	});

	$('.prl-hide').click(function() {
		$('.prl-1st, .prl-2nd, .prl-3rd, .prl-4th, .prl-hide').css({
			"display": "none"
		})
	});


});
