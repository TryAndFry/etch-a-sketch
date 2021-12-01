const gridSize=document.documentElement.querySelector('.grid-size')
const labels=document.documentElement.querySelectorAll('label')
const grid=document.documentElement.querySelector('.drawing-area');
const clearButton=document.documentElement.querySelector('.clear');
const upDownIndicator=document.documentElement.querySelector('.up-down')
const leftRightIndicator=document.documentElement.querySelector('.left-right')
const colorInput=document.documentElement.querySelector('.color');
const eraser=document.documentElement.querySelector('.eraser')
let eraserMode=false;
let gridBoolean=false; //for actively changing the grid size as the mouse moves
let xCoord=gridSize.value/2; //x coordinate for pointer
let yCoord=gridSize.value/2; //y coordinate for pointer
let upDownDegrees=90; //start with knobs pointing directly up
let leftRightDegrees=90;//start with knobs pointing directly up

changeDrawingArea(gridSize.value) //initialize grid

function changeDrawingArea(x){ // create grid
    while(grid.firstChild){
        grid.removeChild(grid.firstChild) //remove old grid
    }
    for(let i=1;i<=x;i++){ //create column divs
        let div=document.createElement('div');
        for(let j=1;j<=x;j++){//create each individual "box"
            let div2=document.createElement('div');
            div2.classList.add('box');
            div.appendChild(div2);
        }
        div.classList.add('column')
        grid.appendChild(div);
    }
    upDownDegrees=90; //reset knobs
    leftRightDegrees=90;
    upDownIndicator.style.transform=`rotate(${upDownDegrees}deg)`;
    leftRightIndicator.style.transform=`rotate(${leftRightDegrees}deg)`;
    grid.children.item(xCoord).children.item(yCoord).classList.toggle('pointer');
    if(!eraserMode) grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`${colorInput.value}`
}

function eraserToggle(){
    eraser.classList.toggle('active');
    eraserMode=!eraserMode;
    if(eraserMode){
        grid.children.item(xCoord).children.item(yCoord).style.removeProperty('background-color')
    } else {
        grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`${colorInput.value}`;
    }
}

function changeGrid(event){ //for actively updating grid as mouse moves
    if(gridBoolean){
        labels.item(1).innerText=`Grid Size: ${this.value}x${this.value}`
        xCoord=Math.floor(this.value/2);
        yCoord=Math.floor(this.value/2);
        changeDrawingArea(this.value)
    }
}
function changeGrid2(event){ //for keystroke changes
    labels.item(1).innerText=`Grid Size: ${event.target.value}x${event.target.value}`
    xCoord=Math.floor(event.target.value/2);
    yCoord=Math.floor(event.target.value/2);
    changeDrawingArea(event.target.value)
}

function fillInBox(event){//fill in boxes according to arrow key directions
    grid.children.item(xCoord).children.item(yCoord).classList.toggle('pointer')
    if(document.activeElement!=gridSize){   
        if(event.code=='ArrowRight'){
            xCoord++;
            leftRightDegrees+=30;
            if(xCoord>=gridSize.value){ 
                xCoord=gridSize.value-1;
                leftRightDegrees-=30;
            }
        }
        if(event.code=='ArrowLeft'){
            xCoord--;
            leftRightDegrees-=30;
            if(xCoord<=0){
                xCoord=0;
                leftRightDegrees+=30;
            }
        }
        if(event.code=='ArrowUp'){
            yCoord--;
            upDownDegrees+=30;
            if(yCoord<=0){ 
                yCoord=0;
                upDownDegrees-=30;
            }
        }
        if(event.code=='ArrowDown'){
            yCoord++;
            upDownDegrees-=30;
            if(yCoord>=gridSize.value){ 
                yCoord=gridSize.value-1;
                upDownDegrees+=30;
            }
        }
        //fill in the background, update pointer
        grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`${colorInput.value}`;
        grid.children.item(xCoord).children.item(yCoord).classList.toggle('pointer')
        //remove background if erasing
        if(eraserMode){
            grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`rgb(148, 184, 150)`;    
        }
        //rotate knobs
        upDownIndicator.style.transform= `rotate(${upDownDegrees}deg)`
        leftRightIndicator.style.transform=`rotate(${leftRightDegrees}deg)`
    }
}

function clearSketch(event){//remove background from all boxes
    let boxes=document.documentElement.querySelectorAll('.box');
    boxes.forEach( box =>{
        box.style.removeProperty('background-color');
    })
    if(!eraserMode) grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`${colorInput.value}`;
}

function handleColorChange(event){
    document.documentElement.style.setProperty('--selected-background-color',this.value);
    grid.children.item(xCoord).children.item(yCoord).style.backgroundColor=`var(--selected-background-color)`; 
}


clearButton.addEventListener('click',clearSketch)
gridSize.addEventListener('mousemove',changeGrid)
gridSize.addEventListener('change',changeGrid2)
gridSize.addEventListener('mousedown', () => gridBoolean=true);
gridSize.addEventListener('mouseup',() => gridBoolean=false);
window.addEventListener('keydown' , fillInBox)
colorInput.addEventListener('change', handleColorChange)