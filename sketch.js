// add your code here
var player1,player2,player1Animation,player2Animation;
var database,player1Score,player2Score;
var gameState;
var position1,position2;
var message;
var loose;

function preload()
{
    player1Animation=loadAnimation("assets/player1a.png","assets/player1b.png","assets/player1a.png");
    player2Animation=loadAnimation("assets/player2a.png","assets/player2b.png","assets/player2a.png");
} 

function setup()
{

    createCanvas(600,600);

    //creating player1
    player1=createSprite(300,250,10,10);
    player1.addAnimation("walking",player1Animation);
    player1.scale=0.5;
    player1Animation.frameDelay=200;
    player1.setCollider("circle",0,0,60);
    player1.debug=true;

    //creating player2
    player2=createSprite(200,500,10,10);
    player2.addAnimation("walking",player2Animation);
    player2.scale=-0.5;
    player2Animation.frameDelay=200;
    player2.setCollider("circle",0,0,60);
    player2.debug=true;


    database=firebase.database();
    console.log(database);

    var player1Position=database.ref('player1/position');
    player1Position.on("value",readPosition1,showError);

    var player2Position=database.ref('player2/position');
    player2Position.on("value",readPosition2,showError);

  var player1ScoreRef=database.ref('player1Score').on("value",function(data){
player1Score=data.val();
  });
  var player2ScoreRef=database.ref('player2Score').on("value",function(data){
    player2Score=data.val();
      });
 

    gameState=database.ref('gameState/');
    gameState.on("value",readGS,showError);

     message=createElement('h3');
    message.position(620,60);
    message.html("");
  
}
var team;
var win_team;

function draw()
{
 background("white");
 
if(gameState==0)
{
   
    fill("black");
    text("Press space to start the toss",100,200);

    if(keyDown("space"))
    {
        console.log('space pressed');
        
        var rand=Math.round(random(1,2));
        if(rand==1)
        {
            database.ref('/').update({
                'gameState':1
            });
            team=1;
          // alert("RED RIDE");
        console.log("RED RIDE");
       
        }
        if (rand==2){
            database.ref('/').update({
                'gameState':2
            });
          // alert("YELLOW RIDE");
              team=2;
       
          console.log("YELLOW RIDE");

        }
    database.ref('player1/position').update({
            'x':150,
            'y':300
        });
        database.ref('player2/position').update({
            'x':450,
            'y':300
        });

        }


    }
  
    if(team==1)
{  
message.html("RED RIDE");
team=0;

}
else if(team==2){
message.html("YELLOW RIDE");
team=0;

}
if(gameState==1)
{
    
    if(keyDown(LEFT_ARROW)){
        console.log('left arrow');
        writePosition1(-5,0);
    }
    
   else if(keyDown(RIGHT_ARROW)){
        writePosition1(5,0);
    }
    
   else if(keyDown(UP_ARROW)){
        writePosition1(0,-5);
    }
    
    else if(keyDown(DOWN_ARROW)){
        writePosition1(0,5);
    }
    
    else if(keyDown("w")){
        writePosition2(0,-5);
    }
    
    else if(keyDown("d")){
        writePosition2(0,5);
    }

    if(player1.x>500){
        database.ref('/').update({
            'player1Score':player1Score+5,
            'gameState':0,
            'player2Score':player2Score-5,
           
        })
       // alert("RED WON");
       win_team="red";
        console.log("RED WON");
    }
    if(player1.isTouching(player2))
    {
        database.ref('/').update({
            'gameState':0,
            'player1Score':player1Score-5,
            'player2Score':player2Score+5
           
        })
        //alert('RED LOST');
        console.log("RED LOST");
        //win_team="yellow";
        loose="red";
    }
}
if(gameState==2)
{
    if(keyDown(LEFT_ARROW)){
        //console.log('left arwow');
        writePosition2(-5,0);
    }
    
   else if(keyDown(RIGHT_ARROW)){
    console.log('right arrow');
        writePosition2(5,0);
    }
    
   else if(keyDown(UP_ARROW)){
        writePosition2(0,-5);
    }
    
    else if(keyDown(DOWN_ARROW)){
        writePosition2(0,5);
    }
    
    else if(keyDown("w")){
        writePosition1(0,-5);
    }
    
    else if(keyDown("d")){
        writePosition1(0,5);
    }
    if(player2.x<150){
        database.ref('/').update({
            
            'player1Score':player1Score-5,
            'gameState':0,
            'player2Score':player2Score+5,
            
        })
       // alert("YELLOW WON");
       console.log("YELLOW WON");
       win_team="yellow";
    }
    if(player2.isTouching(player1))
    {
        database.ref('/').update({
            'gameState':0,
            'player1Score':player1Score+5,
            'player2Score':player2Score-5
            
        })
       // alert('YELLOW LOST');
      // win_team="red";
       console.log("YELLOW LOST");
       loose="yellow";
    }
        }
    if(win_team=="red")
    {
        
//text("RED WINS",280,20);
message.html("RED WINS");
win_team=""
    }
    else if(win_team=="yellow") {
    
//text("YELLOW WINS",280,20);
message.html("YELLOW WINS");
win_team="";
    }

    if(loose=="red")
    {
        message.html("RED LOST"); 
        loose="";
    }
    else if(loose=="yellow")
    {
        message.html("YELLOW LOST");   
        loose=""; 
    }
 textSize(15);
 text("RED:"+player1Score,350,15);
 text("YELLOW:"+player2Score,150,15);
    drawLine();
    drawLine1();
    drawLine2();
    drawSprites();
}
//reads GameState
function readGS(data)
{
    gameState=data.val();
}

function readPosition1(data)
{
    position1=data.val();
    player1.x=position1.x;
    player1.y=position1.y;

}
function readPosition2(data)
{
    position2=data.val();
    player2.x=position2.x;
    player2.y=position2.y;

}

function writePosition1(x,y)
{
   // console.log('write position1');
    database.ref('player1/position').set({
        'x':position1.x+x,
        'y':position1.y+y
    })
}
function writePosition2(x,y)
{
    //console.log('write position2');

    database.ref('player2/position').set({
        'x':position2.x+x,
        'y':position2.y+y
    })
}
function showError()
{
    console.log("Database Error");
}

function drawLine()
{
    for(var i=0;i<600;i=i+20)
    {
        line(300,i,300,i+10);
    }
}
function drawLine1()
{
    for(var i=0;i<600;i=i+20)
    {
        stroke("yellow");
        strokeWeight(4);
        line(100,i,100,i+10);
    }
}
function drawLine2()
{
    for(var i=0;i<600;i=i+20)
    {
        stroke("red");
        strokeWeight(4);
        line(500,i,500,i+10);
    }
}