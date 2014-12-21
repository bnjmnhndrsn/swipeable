var swipable = function($target, captions, options){
	
	captions = captions ? captions : { right: {}, left: {} };
	
	var 
		captionCSS = $.extend({
			top: "50px",
			left: "20px",
		}, captions.css),
	
		captionLeftCSS = $.extend({
			color: "red"
		}, captionCSS, captions.left.css),
	
		captionRightCSS = $.extend({
			color: "green"
		}, captionCSS, captions.right.css),
	
		captionLeftText = captions.left.text ? captions.left.text : "no",
		captionRightText = captions.right.text ? captions.right.text: "yes",
		
		defaults = $.extend({
			threshold: 50,
			transformOrigin: "top left",
			rotation: .1
		}, options),
		//HELPER FUNCTIONS
		_getLeft,
		_changeCSS,
		_makeCaption,
		_dragStop
	;
	
	_getLeft = function(elem){
		return parseInt( $(elem).css("left").replace("px", "") );
	}
	
	_changeCSS = function(){
		var left = _getLeft(this);
		
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
	
	_dragStop = function(){
		var $elem = $(this), 
			left = _getLeft(this);
			
		if (left < -defaults.threshold) {
			$elem.trigger("swipeleft");
		} else if (left > defaults.threshold) {
			$elem.trigger("swiperight");
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
	};
	
	_makeCaption = function(classes, css, text){
		return $("<div>").addClass("swipable-caption " + classes).css(css).text(text);
	};
	
	
	$target.addClass("swipable-container");
	$target.children().addClass("swipable-element").draggable()
	.append( _makeCaption("left", captionLeftCSS, captionLeftText) )
	.append( _makeCaption("right", captionRightCSS, captionRightText) )
	.on("drag", _changeCSS)
	.on("dragstop", _dragStop);
	
}