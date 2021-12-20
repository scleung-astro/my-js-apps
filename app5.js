const Particle = class{
    constructor(id,mass,x,y,vx,vy){
        this.id = id;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        this.mass = mass;

        this.ke = 0;
        this.pe = 0;
    }

    updatePos(dt){
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x > boxWidth){
            this.x -= boxWidth;
        } else if (this.x < 0){
            this.x += boxWidth;
        }

        if (this.y > boxWidth){
            this.y -= boxWidth;
        } else if (this.y < 0){
            this.y += boxWidth;
        }
    }

    updateVel(dt){
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
    }

    resetAcc(dt){
        this.ax = 0;
        this.ay = 0;
    }

    resetEnergy(dt){
        this.ke = 0;
        this.pe = 0;
    }

}

const GravSim = class{

    constructor(n){

        this.np = n;
        this.dt = 1;
        this.time = 0;

        this.plotScale = 1;
        this.showFrameX = 0;
        this.showFrameY = 0;

        this.particles = [];
        for (let i=0;i<n;i++){
            let x = Math.random() * boxWidth;
            let y = Math.random() * boxHeight;
            let particle = new Particle(i,1,x,y,0,0);
            this.particles.push(particle);

            console.log("Create particle at ", x, y);
        }

        this.totalMass = this.getTotalMass();
        this.potentialEnergy = this.getPotentialEnergy();
        // Use virial theorem to get the average energy per unit mass
        let avgVelSq = -this.potentialEnergy / this.totalMass;
        this.setRandomVelocity(avgVelSq);
        this.kineticEnergy = this.getKineticEnergy();

        console.log("Finish building initial System...");
        console.log("Initial Kinetic energy = ", this.kineticEnergy);
        console.log("Initial Potential energy = ", this.potentialEnergy);

        this.plotParticles();

        this.energyHist = [['time', 'total energy']];
        this.kinEnergyHist = [['time', 'kinetic energy']];
        this.potEnergyHist = [['time', 'potential energy']];


    }

    setRandomVelocity(avgVelSq){

        let avgVelMag = Math.sqrt(avgVelSq);
        console.log("avgVelMag = ", avgVelMag);

        // assign random velocity to each particle
        for (let i=0; i<this.np; i++){
            let dir = Math.random() * 2.0 * Math.PI;
            this.particles[i].vx = avgVelMag * Math.sin(dir);
            this.particles[i].vy = avgVelMag * Math.cos(dir);
        }

        // move the center of mass velocity to 0
        let vx_CM = 0;
        let vy_CM = 0;
        for (let i=0; i<this.np; i++){
            vx_CM += this.particles[i].mass * this.particles[i].vx;
            vy_CM += this.particles[i].mass * this.particles[i].vy;
        }

        vx_CM /= this.totalMass;
        vy_CM /= this.totalMass;

        for (let i=0; i<this.np; i++){
            this.particles[i].vx -= vx_CM;
            this.particles[i].vy -= vy_CM;
        }

        // check CM is well balanced
        let vx_CM_new = 0;
        let vy_CM_new = 0;
        for (let i=0; i<this.np; i++){
            vx_CM_new += this.particles[i].mass * this.particles[i].vx;
            vy_CM_new += this.particles[i].mass * this.particles[i].vy;
        }
        console.log("Corrected CM vel", vx_CM_new, vy_CM_new);

    }

    getTotalMass(){
        let mass = 0;
        for (let i=0;i<this.np;i++){
            mass += this.particles[i].mass;
        }
        return mass;
    }

    getKineticEnergy(){
        let ke = 0;
        for (let i=0;i<this.np;i++){
            ke += 0.5 * this.particles[i].mass * (
                Math.pow(this.particles[i].vx,2) + Math.pow(this.particles[i].vy,2)
            )
        }
        return ke;
    }

    getPotentialEnergy(){
        let pe = 0;
        for (let j=0;j<this.np;j++){
            for (let i=j+1;i<this.np;i++){
                let distsq = Math.pow((this.particles[i].x - this.particles[j].x), 2) + 
                    Math.pow((this.particles[i].y - this.particles[j].y), 2);
                pe -= this.particles[i].mass * this.particles[j].mass / Math.sqrt(distsq);
            }
        }
        return pe;
    }

    getPotentialEnergyFast(){
        let pe = 0;
        for (let i=0;i<this.np;i++){
            pe += this.particles[i].mass * this.particles[i].pe;
        } 
        return pe;
    }

    plotParticles(){

        // white background
        //ctx.clearRect(0,0,width,height);

        // black background
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,width,height);

        const circleSize = this.plotScale * 2;
        const shift_x = boxWidth / this.plotScale * this.showFrameX;
        const shift_y = boxHeight / this.plotScale * this.showFrameY; 


        ctx.fillStyle = "#FF0";
        for (let i=0;i<this.np;i++){
            ctx.beginPath();
            ctx.arc((this.particles[i].x - shift_x) * this.plotScale / 3, (this.particles[i].y - shift_y) * this.plotScale / 3, circleSize, 0, 2*Math.PI);
            ctx.fill();
        }

    }

    evolveParticles(){

        let acc_ratio = 0;

        // leapfrog algorithm
        for (let i=0;i<this.np;i++){
            this.particles[i].updatePos(0.5*this.dt);
            this.particles[i].resetAcc();
            this.particles[i].resetEnergy();

        }

        for (let i=0;i<this.np;i++){
            for (let j=i+1;j<this.np;j++){

                let dx = (this.particles[i].x - this.particles[j].x);
                if (dx > boxWidth / 2){
                    dx -= boxWidth;
                } else if (dx < -boxWidth/2){
                    dx += boxWidth;
                }

                let dy = (this.particles[i].y - this.particles[j].y);
                if (dy > boxHeight / 2){
                    dy -= boxHeight;
                } else if (dy < -boxHeight/2){
                    dy += boxWidth;
                }

                let distsq = Math.pow(dx,2) + Math.pow(dy,2);
                let distsq_clean = Math.max(distsq, 1);

                let dir_x = dx / Math.sqrt(distsq);
                let dir_y = dy / Math.sqrt(distsq);

                let acc_x = 1.0 / distsq_clean * dir_x;
                let acc_y = 1.0 / distsq_clean * dir_y;


                this.particles[i].ax += -this.particles[j].mass * acc_x;
                this.particles[i].ay += -this.particles[j].mass * acc_y;

                this.particles[j].ax += this.particles[i].mass * acc_x;
                this.particles[j].ay += this.particles[i].mass * acc_y;

                this.particles[i].pe -= this.particles[j].mass / Math.sqrt(distsq_clean);
                
            }
        }

        for (let i=0;i<this.np;i++){
            this.particles[i].updateVel(this.dt);

        }


        for (let i=0;i<this.np;i++){
            this.particles[i].updatePos(0.5*this.dt);
        }

        // cooling down particles
        for (let i=0;i<this.np;i++){
            if (0.5*(Math.pow(this.particles[i].vx,2) + Math.pow(this.particles[i].vy,2) + this.particles[i].pe > 0)){
                this.particles[i].vx *= 0.9;
                this.particles[i].vy *= 0.9;
            }
        }

        this.time += this.dt;
        this.plotParticles();

        currTime.innerHTML = Math.round(this.time*100)/100;

        // update dt
        acc_ratio = 1000;
        for (let i=0;i<this.np;i++){
            acc_ratio = Math.min(Math.abs(0.1*this.particles[i].vx / this.particles[i].ax), 
                Math.abs(0.1*this.particles[i].vy / this.particles[i].ay), 
                acc_ratio);
           //console.log(acc_ratio, this.particles[i].vx, this.particles[i].ax);

        }

        this.dt = Math.max(acc_ratio * 0.1, 1);

        this.kineticEnergy = this.getKineticEnergy();
        this.potentialEnergy = this.getPotentialEnergyFast();

        //console.log(this.dt, this.kineticEnergy + this.potentialEnergy);
        this.energyHist.push([this.time, this.kineticEnergy + this.potentialEnergy]);
        this.potEnergyHist.push([this.time, this.potentialEnergy]);
        this.kinEnergyHist.push([this.time, this.potentialEnergy]);

    }

}

function drawChart() {
    var data = google.visualization.arrayToDataTable(chartArray);

    var options = {
      title: 'energy evolution',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graphPanel'));

    chart.draw(data, options);
}

function showChart(){
    idx = parseInt(energyPlotChoice.value);
    switch (idx){
        case 0:
            chartArray = gravSim.energyHist;
            break;
        case 1:
            chartArray = gravSim.kinEnergyHist;
            break;
        case 2:
            chartArray = gravSim.potEnergyHist;
            break;
        default:
            return;
    }

    google.charts.setOnLoadCallback(drawChart);
}

// pause or resume the simulations
function pause(){
    if(isRunning){
        clearInterval(intervalID);
        isRunning = false;
    } else {
        setInterval(function(){
            gravSim.evolveParticles()
        }, intervalVal);
        isRunning = true;
    }
}

// set recurrence time shorter to speed-up the simulation
function faster(){
    switch (intervalVal){
        case 250:
            intervalVal = 125;
            break;
        case 500:
            intervalVal = 250;
            break;
        case 1000:
            intervalVal = 500;
            break;
    }
    if(isRunning){
        clearInterval(intervalID);
        intervalID = setInterval(function(){
            gravSim.evolveParticles()
        }, intervalVal);   
        
    } 
}

// set recurrence time shorter to slow down the simulation
function slower(){
    switch (intervalVal){
        case 125:
            intervalVal = 250;
            break;
        case 250:
            intervalVal = 500;
            break;
        case 500:
            intervalVal = 1000;
            break;
    }
    if(isRunning){
        clearInterval(intervalID);
        intervalID = setInterval(function(){
            gravSim.evolveParticles()
        }, intervalVal);   
        
    } 
}

// Reset the gravSim app with default setting
function restart(){

    // reset setting
    chartArray = null;
    intervalVal = 500;
    tracerID = null;
    plotScale = 1;
    isRunning = true;
    intervalID = null;

    gravSim = new GravSim(parseInt(restartNp.value));

    intervalID = setInterval(function(){
        gravSim.evolveParticles()
    }, intervalVal);
}

// Zoom-in of the simulation to a broader view
function zoomIn(){
    if (gravSim.plotScale<4){
        gravSim.plotScale += 1;
        magLevel.innerHTML = gravSim.plotScale;
    }
}

// Zoom-out of the simulation to a finer view
function zoomOut(){
 
    if (gravSim.plotScale>1){
        gravSim.plotScale -= 1;

        gravSim.showFrameX = Math.min(gravSim.showFrameX, gravSim.plotScale-1);
        gravSim.showFrameY = Math.min(gravSim.showFrameY, gravSim.plotScale-1);

        magLevel.innerHTML = gravSim.plotScale;
    }
}

// Use arrow to control the region to be plotted
window.addEventListener("keydown", function(event){

    console.log(event.key);
    switch(event.key){
        case "ArrowUp":
            gravSim.showFrameY = Math.max(0, gravSim.showFrameY - 1);
            break;
        case "ArrowDown":
            gravSim.showFrameY = Math.min(gravSim.plotScale-1, gravSim.showFrameY + 1);
            break;
        case "ArrowRight":
            gravSim.showFrameX = Math.min(gravSim.plotScale-1, gravSim.showFrameX + 1);
            break;
        case "ArrowLeft":
            gravSim.showFrameX = Math.max(0, gravSim.showFrameX - 1);
            break;
    };

    plotZone.innerHTML = "(" + gravSim.showFrameX + "," + gravSim.showFrameY + ")";

});

let chartArray = null;
let intervalVal = 500;
let tracerID = null;
let plotScale = 1;
let isRunning = true;
let intervalID = null;

const energyPlotChoice = document.getElementById("plotChoice");
const restartNp = document.getElementById("restartNp");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const boxWidth = 3*canvas.width;
const boxHeight = 3*canvas.height;

const currTime = document.getElementById("currTime");
const boxSize = document.getElementById("boxSize");
const magLevel = document.getElementById("magLevel");
const plotZone = document.getElementById("plotZone");


gravSim = new GravSim(400);
gravSim.evolveParticles()


// populate the initial screen
currTime.innerHTML = gravSim.time;
boxSize.innerHTML = boxWidth + "x" + boxHeight;
magLevel.innerHTML = gravSim.plotScale;
plotZone.innerHTML = "(" + gravSim.showFrameX + "," + gravSim.showFrameY + ")";


intervalID = setInterval(function(){
    gravSim.evolveParticles()
}, intervalVal);
