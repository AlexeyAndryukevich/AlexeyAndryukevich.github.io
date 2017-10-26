//.load	

// $(function() {
$(document).ready(function(){
	var owl = $(".full-slider");
	//owl.owlCarousel();
	// Go to the next item
	

	owl.owlCarousel({
		loop: true,
		items: 1,
		itemClass: "f-slide-wrap",
		nav: false,
		//navigation : false,
		//navText: ""
		navText : "",
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		autoplaySpeed: 1000,
		
	});

	$('.f-slider-next ').click(function() {
		owl.trigger('next.owl.carousel');
	})

	$('.f-slider-prev').click(function() {		
		owl.trigger('prev.owl.carousel');
	})


	var owl2 = $(".mini-slider");
	//owl.owlCarousel();
	// Go to the next item
	

	owl2.owlCarousel({
		dots: false,

		loop: true,
		items: 3,
		itemClass: "m-slide-wrap",
		nav: false,
		//navigation : false,
		//navText: ""
		navText : "",
		autoplay: true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
		autoplaySpeed: 1000,
		//margin: 35,

		responsive:{
			// breakpoint from 0 up
			0:{
				//margin: 30,
				items: 1,		
			},
			770:{
				margin: 30,
				items: 2,		
			},
			992:{
				items: 3,				
				margin: 35
			},
			1170:{
				items: 3,								
				margin: 35				
			}
		}
	});

	$('.m-slider-next ').click(function() {
		owl2.trigger('next.owl.carousel');
	})

	$('.m-slider-prev').click(function() {		
		owl2.trigger('prev.owl.carousel');
	})


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


	$(".popup-custom .btn").click(function(){
		$.magnificPopup.close();
	}); 

	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

});
