const Car = class{

    constructor(id, x, y, grid, gridend){
        this.id = id;

        this.pos = [x,y];
        this.vel = [5,0];
        this.acc = 1.0;
        this.vel_max = 3.0;

        this.vel_dir = 4; // 0 - 7 for N, NE, E, ... 
        this.vel_mag = 0;

        this.grid = null;
        this.nextCheck = null;
    }

    update_pos(dt){
        for (let i=0;i<2;i++){
            this.pos[i] += this.vel[i] * dt
        }
        console.log("New pos: ", this.pos);
    }

    update_vel(dt){

    }

}

const Tile = class{

    constructor(nx, ny, tileType, imgSrc){

        this.nx = nx;
        this.ny = ny;

        this.x = gridsize * nx;
        this.y = gridsize * ny;

        this.tileType = tileType;
        this.direction = null; 

        this.populatedCars = [];

        //this.blockSprite = new Image();
        //blockSprite.x = this.x;
        //blockSprite.y = this.y;
        //this.sprite = new Image(gridsize, gridsize);
        //this.sprite.src = imgSrc;
        //this.sprite.onload = function(){
        //    ctx.drawImage(this.sprite, this.x, this.y);
        //}

    }

    plot(){
        
    }

}

const SimCar = class{

    constructor(ncar, gridsize, carsize){

        const tileMapSources = ["img/roadtile0.bmp", "img/roadtile1.bmp", "img/roadtile2.bmp"]

        this.ncar = ncar;
        this.gridsize = gridsize;
        this.carsize = carsize;

        this.dt = 1;
        this.cars = [];
        
        let tilesTemplate = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

        ];

        this.tiles = []
        for (let i=0;i<tilesTemplate.length;i++){
            this.tiles.push([])
            for (let j=0;j<tilesTemplate[i].length;j++){
                this.tiles[i].push(new Tile(i,j,tilesTemplate[i][j], tileMapSources[tilesTemplate[i][j]]));
            }
        }

    }

    populateCars(){
        for (let i=0; i<this.ncar; i++){
            let car = new Car(i,100,50,null,null);
            this.cars.push(car);
        }
    }

    drawMap(){


        console.log("Draw car");

        // for (let i=0; i<this.tiles.length; i++){
        //     for (let j=0; j<this.tiles[i].length; j++){
        //         this.tiles[i][j].drawBlock();
                
        //     }
        // }

        ctx.fillStyle = "#A11";
        for (let i=0; i<this.cars.length; i++){
            ctx.fillRect(this.cars[i].pos[0],this.cars[i].pos[1],this.carsize,this.carsize);
        }

    }

    updateCars(){
        for (let i=0; i<this.cars.length; i++){
            this.cars[i].update_pos(this.dt);
        }

    }

    evolve(){
        console.log("In evolve");
        this.updateCars();
        this.drawMap();
    }

}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const graph = document.getElementById("graphPanel");
const control = document.getElementById("controlPanel");

const gridsize = 32;

// 

const roadtilesImg= []

function plot(img,x,y){
    img.onload = function(){
        ctx.drawImage(img, x, y);
    }
}

for (j=0;j<13;j++){
    roadtilesImg.push([]);
    for (i=0;i<20;i++){
        let img0 = new Image(gridsize, gridsize);
        img0.src = "img/roadtile0.bmp";
        roadtilesImg[j].push(img0);
    }
}

console.log(roadtilesImg);



//roadtiles.push(new RoadtileImage(60,80,gridsize,gridsize,"img/roadtile1.bmp"));
//roadtiles.push(new RoadtileImage(60,80,gridsize,gridsize,"img/roadtile2.bmp"));

// roadtile.drawBlock(60,80);
// roadtile.drawBlock(120,80);


simCar = new SimCar(1,32, 7);
simCar.populateCars();

plotBackground = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (j=0;j<13;j++){
        for (i=0;i<20;i++){
            plot(roadtilesImg[j][i],32*i,32*j);
        }
    }
}


evolve = function(){
    simCar.evolve();
    plotBackground();
    simCar.drawMap();
}

evolve();
//intervalID = setInterval(function(){evolve()}, 100);
