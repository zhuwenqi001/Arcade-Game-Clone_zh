
/**
 * 定义敌人类、玩家类，实现敌人与玩家的渲染、位置重置、位置刷新，碰撞判断。
 * 
 * @date     2018-05-05
 * @author   zwq<896111958@qq.com>
 */

//通用参数
var commonOption={
	width:101,//定义单元格宽
	height:83,//定义单元格高
	rows:6,//渲染区域 6行
	cols:5,//渲染区域 5列
	enemyNum:3
};
//敌人数组
var allEnemies=[];

//敌人类
var Enemy = function(paramas) {
	//参数初始化
	this.defaults={
		rows:3,//运动区域 行
		initRow:2,//起始 行
		cellOffsetTop:20,//每个对象 在单元格中的Y值偏离
		baseSpeed:120,//运动基础速度 120px/s (浏览器每次渲染位移2px)
		varitySpeed:300//速度变化 0～300px/s
	};
	paramas=paramas||{};
	this.options={};
	for(var key in this.defaults){
		this.options[key]=paramas[key]||this.defaults[key];
	}
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

//敌人重置
Enemy.prototype.reset = function() {
	//设置随机行
    	this.row=Math.floor(Math.random()*this.options.rows)+this.options.initRow;
    this.y=(this.row-1)*commonOption.height-this.options.cellOffsetTop;
    this.x=-commonOption.width;//初识位置为渲染区域外一个单元格宽
    this.speed=this.options.baseSpeed+Math.random()*this.options.varitySpeed;
};

// 更新敌人的位置
Enemy.prototype.update = function(dt) {
    this.x+=dt*this.speed;
    if(this.x>commonOption.width*(commonOption.cols+1)){//位置移动到渲染区域外一个单元格 重置敌人位置
   	 	this.reset();
    }
};

// 渲染敌人
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//玩家类
var play = function(paramas) {
	//参数初始化
	this.defaults={
		initRow:6,//起始 行
		initCol:3,//起始 列
		cellOffsetTop:35//每个对象 在单元格中的Y值偏离
	};
	paramas=paramas||{};
	this.options={};
	for(var key in this.defaults){
		this.options[key]=paramas[key]||this.defaults[key];
	}
    this.sprite = 'images/char-boy.png';
   	this.reset();
};

//玩家重置
play.prototype.reset=function(){
	this.x=	commonOption.width*(this.options.initCol-1);
    this.row=this.options.initRow;
    this.y=(this.row-1)*commonOption.height-this.options.cellOffsetTop;
}

//碰撞监听
play.prototype.collision=function(){
	var that=this;
	return allEnemies.some(function(item){
		return (item.row==that.row&&(that.x-item.x)<(commonOption.width-20)&&(that.x-item.x)>0);
	});
}

//更新玩家位置 检测是否有发生碰撞
play.prototype.update = function(dt) {
	if(this.collision()){
		this.reset();//玩家回到初始位置
		scores.reset();//分数清0
	}
};

play.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//键盘事件
play.prototype.handleInput = function(direction) {
	//玩家控制
	switch (direction){
		case "left":
			if(this.x-commonOption.width>=0){
				this.x-=commonOption.width;
			}
			break;
		case "up":
			if(this.row-1>1){
				this.y-=commonOption.height;
				this.row-=1;
			}else if(this.row-1==1){//挑战成功
				scores.update();
				this.reset();
			}
			break;
		case "right":
			if(this.x+commonOption.width<=commonOption.width*commonOption.cols){
				this.x+=commonOption.width;
			}
			break;
		case "down":
			if(this.row+1<=commonOption.rows){
				this.y+=commonOption.height;
				this.row+=1;
			}
			break;
		default:
			break;
	}
};


//分数
var score=function(){
	this.x=commonOption.cols*commonOption.width;
	this.y=30;
	this.reset();
}
//重置
score.prototype.reset = function() {
    this.num=0;
};

score.prototype.render = function() {
    ctx.fillText('分数：'+this.num, this.x, this.y);
};

score.prototype.update = function() {
    this.num+=1;
};

//实例对象
for(var i=0;i<commonOption.enemyNum;i++){
	allEnemies.push(new Enemy());
}
var player=new play();
var scores=new score();
//监听玩家键盘点击事件
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

