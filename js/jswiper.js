function jswiper(selector,option){
	var config = {
		direction:"horizontal",
		loop:false,
		autoplay:false
	};
	this.set = this.extend({},config,option);
	this.container = typeof selector == "string" ? document.querySelector(selector) : selector;
	this.wrapper = this.container.children[0];
	this.W = this.set.direction === "vertical" ? this.container.offsetHeight : this.container.offsetWidth;
	this.length = this.wrapper.querySelectorAll(".swiper-slide").length;
	this.xy = this.set.direction === "vertical" ? "Y" : "X";
	this.index = 0,this.timer = null;
	this.initial();
}
jswiper.prototype = {
	constructor:jswiper,
	initial:function(){
		this.bindEvent();
		this.setIntervalLoop();
	},
	bindEvent:function(){
		var startObj = {} , moveObj = {} , spanObj = {X:0,Y:0}, endObj = {X:0,Y:0},
			wrapper = this.wrapper,
			xy = this.xy;
		this.container.addEventListener("touchstart",function(e){
			spanObj = {};
			clearInterval(this.timer);
			this.timer = null;
			wrapper.classList.remove("tst");
			endObj[xy] = -this.index*this.W;
			startObj[xy] = e.touches[0]["page"+xy];
		}.bind(this),false);
		this.container.addEventListener("touchmove",function(e){
			moveObj[xy] = e.touches[0]["page" + xy];
			spanObj[xy] = moveObj[xy] - startObj[xy];
			if(this.index === 0 && spanObj[xy] > 0 || this.index === this.length - 1 && spanObj[xy] < 0){
				return;
			}
			wrapper.style.transform = "translate"+xy+"("+(endObj[xy]+spanObj[xy])+"px)"
		}.bind(this),false);
		this.container.addEventListener("touchend",function(){
			wrapper.addEventListener("webkitTransitionEnd",function(){
				this.setIntervalLoop();
			}.bind(this),false);
			wrapper.classList.add("tst");
			if(Math.abs(spanObj[xy]) > this.W/3){
				if(spanObj[xy] > 0){
					this.index -- ;
					this.index <= 0 && (this.index = 0);
				}else if(spanObj[xy] < 0){
					this.autoplayImg();
				}
			}
			this.move(xy,this.index);
		}.bind(this),false);
	},
	setIntervalLoop:function(){
		var that = this;
		if(this.set.autoplay && !this.timer){
			this.wrapper.classList.add("tst");
			this.timer = setInterval(function(){
				that.autoplayImg();
				that.move(that.xy,that.index);
			},that.set.autoplay);
		}
	},
	autoplayImg:function(){
		this.index ++ ;
		this.index >= this.length && (this.index = this.length-1);
	},
	move:function(xy,ind){
		this.wrapper.style.transform = "translate"+xy+"(" + (-ind*this.W) +"px)";
	},
	extend:function(){
		for(var i=1,len=arguments.length;i<len;i++){
			for(var key in arguments[i]){
				arguments[0][key] = arguments[i][key];
			}
		}
		return arguments[0];
	}
};