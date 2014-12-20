var swipable = function($target){
	$target.addClass("swipable-container");
	$target.children().addClass("swipable-element").draggable().on("drag", function(){
		var left = $(this).css("left");
		$(this).removeClass("left right");
		$(this).addClass(parseInt(left.replace("px", "")) > 0 ? "left" : "right");
	});
	
}