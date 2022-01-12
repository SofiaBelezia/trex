var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var cacto1,cacto2,cacto3,cacto4,cacto5,cacto6
var fimDeJogo,GameOver;
var recomecar,restart
var newImage;
var Pular
var Morrer
var checkPoint

var pontuacao=0

var JOGAR=1
var ENCERRAR=0
var estadoJogo=JOGAR

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  GameOver=loadImage("gameOver.png");
  restart=loadImage("restart.png")
 
  cacto1=loadImage("obstacle1.png");
  cacto2=loadImage("obstacle2.png");
  cacto3=loadImage("obstacle3.png");
  cacto4=loadImage("obstacle4.png");
  cacto5=loadImage("obstacle5.png");
  cacto6=loadImage("obstacle6.png");

Pular=loadSound("jump.mp3")
Morrer=loadSound("die.mp3")
checkPoint=loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.debug=false
  trex.setCollider("circle",0,0,40)
  
  ground = createSprite(width/2,height-20,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-20,width,2);
  invisibleGround.visible = false;
  
  console.log("Hello"+ 5)

  gNuvens=new Group()
  gObstaculos=new Group()
  fimDeJogo=createSprite(width/2,height/2)
  fimDeJogo.addImage(GameOver)
  fimDeJogo.visible=false
  recomecar=createSprite(width/2,height/2+50)
  recomecar.addImage(restart)
  recomecar.visible=false
  
}

function draw() {
  background(180);
  text("pontuação:"+pontuacao,width/2,20)
  
  trex.collide(invisibleGround);
  
  if(pontuacao>0 && pontuacao%100==0){
    checkPoint.play()
  }
  if(estadoJogo==JOGAR){
    pontuacao=pontuacao+Math.round((frameRate()/60))
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -12;
      Pular.play()
    }
    spawnClouds();
  gerarObstaculos();
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    ground.velocityX = -(4+3*pontuacao/100);
    if(gObstaculos.isTouching(trex)){
      estadoJogo=ENCERRAR
      Morrer.play()
    }
    
  }
  else if(estadoJogo==ENCERRAR){
    ground.velocityX = 0;
    trex.changeAnimation("collided",trex_collided)
    trex.velocityY=0
    gObstaculos.setVelocityXEach(0)
    gNuvens.setVelocityXEach(0)
    gObstaculos.setLifetimeEach(-1)
    gNuvens.setLifetimeEach(-1)
    fimDeJogo.visible=true
    recomecar.visible=true
    if(mousePressedOver(recomecar)){
      reset()
    }
  }
  //gerar as nuvens
  
  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height/4,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    
    //atribua tempo de vida à variável
    cloud.lifetime = 200
    gNuvens.add(cloud)
    //ajuste a profundidade
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function gerarObstaculos(){
if (frameCount%60===0){
var cactos=createSprite(width,height-35,10,40)
cactos.velocityX=-(6+pontuacao/100)
var rand=Math.round(random(1,6))
switch(rand){
  case 1:cactos.addImage(cacto1);
  break;
  case 2:cactos.addImage(cacto2);
  break;
  case 3:cactos.addImage(cacto3);
  break;
  case 4:cactos.addImage(cacto4);
  break;
  case 5:cactos.addImage(cacto5);
  break;
  case 6:cactos.addImage(cacto6);
  break;
  default:break
}
cactos.scale=0.5
cactos.lifetime=width
gObstaculos.add(cactos)
}

}

function reset(){
  estadoJogo = JOGAR
  pontuacao = 0
  gObstaculos.destroyEach()
  gNuvens.destroyEach()
  recomecar.visible=false
  fimDeJogo.visible=false
  trex.changeAnimation("running",trex_running)
}
