var Button = function(x, y, texture, callback, nothing, down_frame, out_frame, over_frame) {
	this.sprite = PH.add.sprite(x, y, null);
	this.sprite.anchor.setTo(0.5);
	this.button = PH.add.button(x, y, texture, callback, nothing, down_frame, out_frame, over_frame);
	this.button.anchor.setTo(0.5);
	
}