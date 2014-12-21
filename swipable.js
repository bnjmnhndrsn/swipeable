(function($) {
	
	//HELPER FUNCTIONS
	var 
		_getLeft,
		_changeCSS,
		_makeCaption,
		_dragStop,
		_onSwipe,
		_onSwipeAll
	;
	
	_getLeft = function(elem){
		return parseInt( $(elem).css("left").replace("px", "") );
	};
	
	//returns function to use on the drag event with correct variables in closure
	
	_getChangeCss = function(options){

		 return function(){
			var left = _getLeft(this);
	
			$(this).removeClass("left right");
	
			if (left < 0) {
				$(this).addClass("left");
			} else if (left > 0) {
				$(this).addClass("right")
			}
	
			if (Math.abs(left) <= options.threshold) {
				$(this).find(".swipable-caption").css("opacity", Math.abs(left/options.threshold) );
			}
	
			$(this).css({
				'transform': "rotate(" +  left * options.rotation + "deg)",
				'transform-origin': options.transformOrigin
			});
		};
	};
	
	//returns function to use on the drag stop event with correct variables in closure
	_getDragStop = function(options) {
	
		return function(){
			var $elem = $(this), 
				left = _getLeft(this);
			if (left < -options.threshold) {
				$elem.trigger("swipeleft");
				options.onSwipe.call(this);
			} else if (left > options.threshold) {
				$elem.trigger("swiperight");
				options.onSwipe.call(this);
			} else {
				$elem.addClass("swipable-transitioning");
				$elem.removeClass("left right");
				$elem.one('transitionend', function(){
					$elem.removeClass("swipable-transitioning");
				});
		
				setTimeout(function(){
					$elem.css({ left: 0, top: 0, transform: 'rotate(0deg)' });
				}, 1);
			}
		};
	};

	_makeCaption = function(classes, css, text){
		return $("<div>").addClass("swipable-caption " + classes).css(css).text(text);
	};
	
	_onSwipe = function(){
		var $elem = $(this),
			$parent = $elem.parent(),
			left = _getLeft($elem),
			width = $elem.width();
			
			$elem.addClass("swipable-transitioning");

			$elem.one('transitionend', function(){
			$elem.remove();
			
			if ($parent.children().length === 0){
				$parent.removeClass("swipable-container");
				$parent.trigger("swipeall");
			}
		});

		setTimeout(function(){
			$elem.css({
				left: left > 0 ? width + "px" : "-" + width + "px",
			});
	
		}, 1);
	};
	
	//DEFAULTS
	
	var 
		captionCssDefaults = {
			top: "50px",
			left: "20px"
		},
		captionRightCssDefaults = {
			color: "green"
		},
		captionLeftCssDefaults = {
			color: "red"
		},
		captionRightTextDefault = "Yes",
		captionLeftTextDefault = "No",
		swipeDefaults = {
			threshold: 50,
			transformOrigin: "top left",
			rotation: .1,
			onSwipe: _onSwipe
		}
	;
		
	
	//MAIN FUNCTION
	
	$.fn.swipable = function(captions, swipeOptions){
		
		captions = captions ? captions : { right: {}, left: {} };
	
		var
			captionCSS = $.extend(captionCssDefaults, captions.css),
			captionLeftCSS = $.extend(captionLeftCssDefaults, captionCSS, captions.left.css),
			captionRightCSS = $.extend(captionRightCssDefaults, captionCSS, captions.right.css),
			captionLeftText = captions.left.text ? captions.left.text : captionLeftTextDefault,
			captionRightText = captions.right.text ? captions.right.text: captionRightTextDefault
			options = $.extend(swipeDefaults, swipeOptions)
		;
	
		this.addClass("swipable-container");
	
		this.children()
		.addClass("swipable-element")
		.draggable()
		.append( _makeCaption("left", captionLeftCSS, captionLeftText) )
		.append( _makeCaption("right", captionRightCSS, captionRightText) )
		.on("drag", _getChangeCss(options))
		.on("dragstop", _getDragStop(options));
		
		return this;
	};
	
}(jQuery));