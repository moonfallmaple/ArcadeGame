let myHero;
let myEnemy=[];
let myBackGround;
let mySound;
let rowImages = [
    'images/water-block.png',   // top row is water
    'images/stone-block.png',   //  3 row stone
    'images/grass-block.png',   // 2 row grass
];



function startGame() {   
    myHero  = new Player("images/char-boy.png",70,75,200,420);
    myBackGround= new Background(rowImages,101,83);
    myGameArea.start(); 
    myGameArea.chooseHero(); 
    myGameArea.soundChange("music/op.mp3");
   
}


// myGameArea object: contains methods like start(), clear(),stop(),congratulaitons(), and playAgain()
let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function () {
            this.canvas.width = 505;
            this.canvas.height = 565;
            this.context = this.canvas.getContext("2d");  
            let container = document.getElementsByClassName("container");
            container[0].appendChild(this.canvas);
            this.interval=setInterval(updateGameArea,20); //refresh page for every 0.02 seconds
            this.frameNo= 0;
            window.addEventListener("keydown",function(e){ // addEventListener for keyboard
                myGameArea.key=e.keyCode;
            })

            window.addEventListener("keyup",function(e){ // addEventListener for keyboard
            myGameArea.key=false;
            })
            
    },
    chooseHero:function (){
        let heros=document.querySelectorAll("img")
        for (let hero of heros){
            hero.addEventListener("click",function(){
                myHero=new Player(hero.src,70,75,212.5,435);
            })
        }
    },  
    clear: function(){
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        },

    stop:function(){
        clearInterval(this.interval);
    },

    Congratulations:function(){ //Something happens when player wins
        document.getElementsByClassName("overlay")[0].style.visibility="visible";  
    },
   playAgain: function (){
        document.getElementsByClassName("overlay")[0].style.visibility="hidden";  
        startGame();
    },
    soundChange: function(s){
        document.getElementsByTagName("audio")[0].src=s;
    
    }
  
}    
    
function Background(img,width,height){
    this.width=width;
    this.height=height;
    let numRows = 6;
    let numCols = 5;
    this.update=function(){
        for (let col = 0; col < numCols; col++) {
            let row=0
            this.image=new Image();
            this.image.src = img[0];
            myGameArea.context.drawImage(this.image, col * this.width, -51);
            for(row=1;row<4;row++){
                this.image=new Image();
                this.image.src = img[1];
                myGameArea.context.drawImage(this.image, col * this.width, row *this.height-20);
            } 
            for(row=4;row<6;row++){
                this.image=new Image();
                this.image.src = img[2];
                myGameArea.context.drawImage(this.image, col * this.width, row * this.height-20);
            }          
        }         
    }  
} 


function Player(url,width,height,x,y){
    this.image=new Image();
    this.image.src=url;
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y; 
    this.speedX=0;
    this.speedY=0;
    this.update=function(){
        if(this.x<-15){ //make the player cannot move off screen
            this.x=-15
        }
        else if(this.y>420){
            this.y=420
        }
        else if(this.x>420){
            this.x=420
        }
        myGameArea.context.drawImage(this.image,this.x,this.y); 
    } 

    this.newPos = function(){
        this.x+=this.speedX;
        this.y+=this.speedY;
    }    

    this.crashWith = function(otherobj){
        let myleft = this.x;
        let myright = this.x+ (this.width);
        let mytop = this.y;
        let mybottom = this.y +(this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x+otherobj.width;
        let othertop = otherobj.y;
        let otherbottom = otherobj.y+otherobj.height;
        let crash=true;
        if((mytop>otherbottom)|| (myleft>otherright)||(mybottom<othertop)||(myright<otherleft)){
            crash=false;
        }
        return crash;
    } 
    // player win when reach the water area
    this.playerWins = function(){
        let win =false;
        if (this.y<-15){
            win = true;
            myGameArea.stop();
        }
        return win;
    }
}



function Enemies(url,width,height,x,y){
    this.image=new Image();
    this.image.src=url;
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y; 
    this.speedX=0;
    this.speedY=0;
    this.update=function(){
        myGameArea.context.drawImage(this.image,this.x,this.y); 
    } 
    this.newPos = function(){
        this.x+=this.speedX;
        this.y+=this.speedY;
    }    
}

function updateGameArea(){
    let x,y;
    //when Player win, the game will stop and the hidden layer about congratulation will show up 
    if(myHero.playerWins()){
        myGameArea.Congratulations();
        myGameArea.soundChange("music/ed.mp3");
    }
    //Vehicle-player collision resets the game
    //if crash with enemy, my hero will turn back to original place. My enemy will still pass the game area.
    for(let i=0; i<myEnemy.length; i++){
        if (myHero.crashWith(myEnemy[i])){
            myGameArea.clear();
            myBackGround.update();
            myEnemy[i].x+=3;
            myEnemy[i].newPos();
            myEnemy[i].update();
            myHero.x=200;
            myHero.y=420;
        }
    }
   // refresh myGameArea
    myGameArea.clear();
    myBackGround.update();
    myGameArea.frameNo+=1;
    myBackGround.update();
   // control my hero to left/up/right/down
    myHero.speedX=0;
    myHero.speedY=0;
    if(myGameArea.key==37){
            myHero.speedX=-8;
    }
    if(myGameArea.key==39){
            myHero.speedX= 8;
    }
    if(myGameArea.key==38){
            myHero.speedY=-8;
    }
    if(myGameArea.key==40){
            myHero.speedY= 8;
    }
    myHero.newPos();
    myHero.update(); 
   
    // create new enemy every 100 interval (2 seconds)
    if(myGameArea.frameNo ==1||everyinterval(100)){
        x=-50;
        maxHeight=240;
        minHeight=100;
        height=Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight)
        myEnemy.push(new Enemies("images/enemy-bug.png",80,70,x,height));
    }
    for(let i=0; i<myEnemy.length; i++){
        myEnemy[i].x+=3;
        myEnemy[i].update();
    }  
 
}

function everyinterval(n){
    if((myGameArea.frameNo/n)%1==0){
        return true;
    }
    return false;
}




