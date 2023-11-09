// @ts-check
import { LinkedList } from "./linkedList.js";
import { randomNumber } from "./helpingFunctions.js";
import { Map } from "./map.js";

class pointClass {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class MountainMap {
    /**
     * 
     * @param {number} pWidth 
     * @param {number} pHeight 
     */
    constructor(pWidth, pHeight, maxElevation) {
        this.width = pWidth;
        this.height = pHeight;
        this.rows = [];
        this.variation = 5;
        this.distOfVariation = 20;
        this.maxElevation = maxElevation;
        this.minElevation = 1;
        this.length = Math.min(this.width, this.height);
        this.buffer = Math.floor(this.length / 10);
    }

    /**
     * 
     * @param {MapSquare[]} row 
     */
    addRow(row) {
        this.rows.push(row);
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {MapSquare}
     */
    getMapSquare(x, y) {
        return this.rows[x][y];
    }
}
class MapSquare {
    /**
     * @param {number} elevation 
     * @param {number} direction 
     * @param {number} cost 
     * @param {boolean} closed 
     * @param {boolean} open 
     * @param {number} dist 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(elevation, direction, cost, closed, open, dist, x, y) {
        this.elevation = elevation
        this.direction = direction
        this.cost = cost
        this.closed = closed
        this.open = open
        this.dist = dist
        this.x = x
        this.y = y

    }
}
//Global Variables
let points = [];

let open = new LinkedList();

/**@type {MountainMap} */
let tempMap;
/**@type {Map} */
let map;



/**
 * 
 * @param {Map} map 
 */
/*
export function updateMapMountain(map) {

    for (let i = 0; i < tempMap.width; i++) {
        for (let j = 0; j < tempMap.height; j++) {
            //if we are over land then merge with the current elevation
            if (map.getMapPoint(i, j).type != "Ocean") {
                if (tempMap.getMapSquare(i, j).elevation >= 1) {
                    if (map.getMapPoint(i, j).elevation == -1) {
                        map.getMapPoint(i, j).elevation = tempMap.getMapSquare(i, j).elevation
                    }
                    else if (map.getMapPoint(i, j).elevation > tempMap.getMapSquare(i, j).elevation) {
                        //do nothing
                    }
                    else {
                        map.getMapPoint(i, j).elevation = tempMap.getMapSquare(i, j).elevation
                    }
                    map.getMapPoint(i, j).type = "Land"
                }
            }
            //else if we are over the ocean then overwrite any current elevation
            //new attempt, if over ocean reduce elevation ("due to errosion")
            //else {
            //if @temp_map[i][j].elevation != -1
            //	newElevation = @temp_map[i][j].elevation/2
            //	if newElevation > 0
            //		@map[i][j].elevation = newElevation
            //		@map[i][j].type = "Land"
            //	end
            //end
            //}

        }
    }
}
*/

/**
 * 
 * @param {Map} pMap 
 */
function initMap(pMap) {
    map = pMap
    tempMap = new MountainMap(map.width, map.height, map.maxElevation);
    
    for (let i = 0; i < tempMap.width; i++) {
        /** @type {MapSquare[] } */
        let newRow = [];
        for (let j = 0; j < tempMap.height; j++) {
            newRow.push(new MapSquare(-1, -1, 0, false, false, -1, i, j));

        }
        tempMap.addRow(newRow);
    }
}



/**
 * @param {Map} pMap 
 */
export function startGenerationMountain(pMap) {
    initMap(pMap);
    let numPoints = 3//Math.floor(tempMap.length/100) + 1;
    // 

    //
    for (let i = 0; i < numPoints; i++) {
        let x = randomNumber(tempMap.buffer, (tempMap.width - tempMap.buffer));
        let y = randomNumber(tempMap.buffer, (tempMap.height - tempMap.buffer));
        points.push(new pointClass(x, y));

        //  
    }

    let numRidges = 0;//Math.floor(numPoints/3) + 1;
    //

    for (let i = 0; i < numRidges; i++) {
        let len = randomNumber(0, tempMap.buffer / 2)

        let x = randomNumber(tempMap.buffer, tempMap.width - tempMap.buffer * 2);
        let y = randomNumber(tempMap.buffer, tempMap.height - tempMap.buffer * 2);
        //
        points.push(new pointClass(x, y));
        for (let j = 0; j < len; j++) {
            let newX = x + randomNumber(0, 15) - randomNumber(0, 7)
            let newY = y + randomNumber(0, 15) - randomNumber(0, 7)
            if (newX >= 0 && newX < tempMap.width) {
                x = newX;
            }
            if (newY >= 0 && newY < tempMap.height) {
                y = newY;
            }
            points.push(new pointClass(x, y));
        }

    }
    
    points.forEach(point => {
        let x = point.x;
        let y = point.y;
        let max = randomNumber(Math.floor(tempMap.maxElevation/2), tempMap.maxElevation);
        
        //
        //tempMap.getMapSquare(x, y).elevation = max;
        setElevations(max, x, y);
        tempMap.getMapSquare(x, y).direction = 0;
        tempMap.getMapSquare(x, y).closed = true;
        searchSurroundingSquares(tempMap.getMapSquare(x, y));

    });

    let tempList = open.toArray();
    tempList.forEach(node => {
        let dist = Math.random() * tempMap.variation * tempMap.distOfVariation;
        //Math.floor(Math.random() * range) + low
        
        tempMap.getMapSquare(node.x, node.y).dist = dist;

    });
}

export function generateOutFromCenterMountain() {

    if (open.empty()) {
        return false;
    }
    // while (open.count != 0) {
        let node = open.pop();

        if (node && (node.x != -1)) {
            let nextSquare = tempMap.getMapSquare(node.x, node.y);
            nextSquare.closed = true;
            nextSquare.open = false;
            let timeout = false;

            if (nextSquare.dist <= 0) {
                timeout = true;
            }
            checkCostAndSetElevation(nextSquare);
            //DRAW
            
            if (!(timeout && nextSquare.elevation <= tempMap.minElevation)) {
                searchSurroundingSquares(nextSquare);
                //
            }
        }

        return true;
    // }
}
/**
 * 
 * @param {MapSquare} square 
 */
function checkCostAndSetElevation(square) {
    let test = false;
    if (square.dist <= 0) {
        test = true;
    }
    square = chosenDirection(square);
    square.elevation = chosenElevation(square);

    if (square.elevation == tempMap.maxElevation && test) {
        square.direction = -2;
    }
    //tempMap.getMapSquare(square.x, square.y).elevation = square.elevation;
    setElevations(square.elevation, square.x, square.y);
    tempMap.getMapSquare(square.x, square.y).direction = square.direction;
}
function setElevations(elevation, x, y) {
    tempMap.getMapSquare(x, y).elevation = elevation;
    //if we are over land then merge with the current elevation
    if (true) {//map.getMapPoint(x, y).type != "Ocean") {
        if (tempMap.getMapSquare(x, y).elevation >= 1) {
            if (map.getMapPoint(x, y).elevation == -1) {
                map.getMapPoint(x, y).elevation = tempMap.getMapSquare(x, y).elevation;
            }
            else if (map.getMapPoint(x, y).elevation > tempMap.getMapSquare(x, y).elevation) {
                //do nothing
            }
            else {
                map.getMapPoint(x, y).elevation = tempMap.getMapSquare(x, y).elevation;
            }
            map.getMapPoint(x, y).type = "Land";
        }
    }
    
}
/**
 * 
 * @param {MapSquare} square 
 * @return {MapSquare} 
 */
function chosenDirection(square) {
    let newDirection = 0;
    if (square.dist <= 0) {
        square.dist = randomNumber(tempMap.distOfVariation, tempMap.variation * tempMap.distOfVariation);
    }
    newDirection = randomNumber(0, 1);
    if (randomNumber(0, 20) % 17 == 0) {
        newDirection += 1;
    }
    square.direction = newDirection;
    return square;
}
/**
 * 
 * @param {MapSquare} square 
 * @returns {number} 
 */
function chosenElevation(square) {
    let newElevation = compareSurroundingSquaresElevation(getSurroundingSquaresElevation(square)).elevation;
    if (square.direction == 1) {
        if (newElevation > 0) {
            newElevation -= 1;
        }
    }
    else if (square.direction == 2) {
        if (newElevation < tempMap.maxElevation - 1) {
            newElevation += 1;
        }
    }
    //
    return newElevation;
}
/**
 * 
 * @param {MapSquare[]} squares 
 * @return 
 */
function compareSurroundingSquaresElevation(squares) {
    // 

    let tempList = []
    squares.forEach(square => {
        if (square.elevation != 3) {
            tempList.push(square);
        }
    });
    if (tempList.length == 0) {
        return squares[0];
    }
    while (tempList.length < 3) {
        if (tempList.length <= 1) {
            tempList.push(tempList[0]);
        }
        else {
            let temp = randomNumber(0, tempList.length - 1);
            //
            tempList.push(tempList[temp]);
        }
    }

    //
    let temp = randomNumber(0, tempList.length - 1);
    //
    return tempList[temp];
}

/**
 * 
 * @param {MapSquare} square 
 * @returns 
 */
function getSurroundingSquaresElevation(square) {
    let x = square.x
    let y = square.y
    let tempArray = []
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && j >= 0 && i < tempMap.width && j < tempMap.height) {
                //
                //
                if (tempMap.getMapSquare(i, j).elevation != -1) {
                    tempArray.push(tempMap.getMapSquare(i, j))
                }
            }
        }
    }
    //
    return tempArray
}

/**
 * 
 * @param {MapSquare} parent 
 */
function searchSurroundingSquares(parent) {
    let x = parent.x
    let y = parent.y
    let cost = 0
    let Tempcount = 0;

    let TempcountCheck = 0;
    //search nodes around parent node
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            //if its not the parent node
            if (!(i == x && j == y)) {
                if (i == x || j == y) {
                    //cost for straight
                    cost = 10
                }
                else {
                    //cost for diagonal
                    cost = 14
                }
                if (i >= 0 && j >= 0 && i < tempMap.width && j < tempMap.height) {
                    let current = tempMap.getMapSquare(i, j);
                    TempcountCheck++;
                    if (!current) {
                        
                    }
                    if (current.closed) {
                        
                    }
                    //ignore node if its already in the closed list
                    if (current && !current.closed) {
                        //ignore node if its already in the open list
                        if (!current.open) {
                            //current.parent = parent
                            current.cost = parent.cost + cost;
                            if (parent.direction != -1) {
                                current.direction = parent.direction
                            }
                            if (parent.dist != -1) {
                                current.dist = parent.dist - cost
                            }
                            //if parent.ttd != -1
                            //	current.ttd = parent.ttd
                            //end

                            //if we have reached tempMap.minElevation and dist/ttd has run out
                            //then don't add to open list
                            //if current.direction != -2//!(parent.elevation <= tempMap.minElevation and parent.dist <= 0)
                            current.open = true
                            open.insertNode(current.x, current.y, current.cost);
                            Tempcount++;
                            //
                            //end

                        }
                    }

                }
            }
        }
    }
    
    

}


/*
function smoothMap() {
    for(let i = 0; i < tempMap.length-1; i++) {
        for(let j = 0; j < tempMap.length-1; j++) {
            let tempArray = getSurroundingNodesElevation(tempMap.getMapSquare(i][j]);
            let temp = 0.0;
            if (tempArray.count != 0) {
                tempArray.forEach(n => {
                    temp += n.elevation;
                });
                temp = temp/tempArray.tempMap.length;
                temp += 0.5;
            }
            else {
                temp = -1;
            }
            tempMap.getMapSquare(i][j].elevation = Math.floor(temp);
        }
    }
}*/


