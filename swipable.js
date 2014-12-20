var swipable = function($target, captions, options){
	
	var captionCSS = $.extend({
		top: "50px",
		left: "20px"
	}, captions.css);
	
	var defaults = $.extend({
		threshold: 50,
		transformOrigin: "top left",
		rotation: .1
	}, options);
	
	var _getLeft = function(){
		return parseInt( $(this).css("left").replace("px", "") );
	}
	
	var _changeCSS = function(){
		var left = _getLeft();
		
		$(this).removeClass("left right");
		
		if (left < 0) {
			$(this).addClass("left");
		} else if (left > 0) {
			$(this).addClass("right")
		}
		
		if (Math.abs(left) <= defaults.threshold) {
			$(this).find(".swipable-caption").css("opacity", Math.abs(left/defaults.threshold) );
		}
		
		$(this).css({
			'transform': "rotate(" +  left * defaults.rotation + "deg)",
			'transform-origin': defaults.transformOrigin
		});
	};
	
	$target.addClass("swipable-container");
	$target.children().addClass("swipable-element").draggable()
	.append(
		$("<div>")
		.addClass("swipable-caption left")
		.css(captionCSS)
		.text(captions.left.text)
		.css("color", "green")
	).append(
		$("<div>")
		.addClass("swipable-caption right")
		.css(captionCSS).text(captions.right.text)
		.css("color", "red")
	).on("drag", _changeCSS)
	.on("dragstop", function(){
		var $elem = $(this);
		var left = _getLeft();
		if (left < -defaults.threshold) {
			$elem.trigger("swipeLeft");
		} else if (left > defaults.threshold) {
			$elem.trigger("swipeRight");
		} else {
			$elem.addClass("swipable-transitioning");
			$elem.removeClass("left right");
			$elem.one('transitionend', function(){
				$elem.removeClass("swipable-transitioning");
			});
			
			setTimeout(function(){
				$elem.css({
					left: 0,
					top: 0,
					transform: 'rotate(0deg)'
				});
					
			}, 1);
		}
	});
	
}