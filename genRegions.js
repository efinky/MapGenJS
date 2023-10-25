//@ts-check
import { Map } from "./map.js";
import { LinkedList } from "./linkedList.js";
import { randomNumber } from "./helpingFunctions.js";

/**
 *
 * @param {number} variance level of noise
 * @param {number} startingPos starting position
 * @param {number} stickiness how much it likes its starting position (1-3)
 * @returns
 */
function addNoise(variance, startingPos, stickiness) {
    let newPos = randomNumber(startingPos - 1, startingPos +1) 
    //starting pos is 5, variance is 3,
    return newPos;
}
class RegionsSquare {
    constructor(
        addNoiseYes,
        elevation,
        direction,
        persistence,
        cost,
        closed,
        open,
        dist,
        x,
        y
    ) {
        this.addNoiseYes = addNoiseYes;
        this.elevation = elevation;
        this.direction = direction;
        this.persistence = persistence;
        this.cost = cost;
        this.closed = closed;
        this.open = open;
        this.dist = dist;
        this.x = x;
        this.y = y;
    }
}
/** @type {RegionsSquare[][]}  */
let tempMap = [];
let open = new LinkedList();
let variation = 20;
let buffer = 0;
let maxElevation = 0;
let persistence = 0;
let length = 0;
/**
 *
 * @param {Map} map
 * @param {number} numRegions
 */
export function genRegions(map, numRegions) {
    length = map.width;
    buffer = Math.floor(length / 7);
    //initialize an empty map full of nodes
    for (let i = 0; i < length; i++) {
        let row = [];
        for (let j = 0; j < length; j++) {
        row.push(new RegionsSquare(false, -1, -1, -1, 0, false, false, -1, i, j));
        }
        tempMap.push(row);
    }

    //generate regions

    //use the regions to generate "noisy" terrain
    for (let i = 0; i < numRegions; i++) {
        startGenRegion(randomNumber(4, 9), randomNumber(4, 5));
        //addNoise();
    }
    //	puts "adding noise..."
    //fill in anything else with low noise
    //gen = Perlin:: Generator.new @seed, 0.5, 12

    
    //smoothMap()

    
}
/**
 * 
 * @param {Map} map 
 */
export function updateRegionMap(map) {
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1; j++) {
        let elevation = tempMap[i][j].elevation;
            if (tempMap[i][j].addNoiseYes) {
                //elevation = addNoise(5, elevation, 3);
                tempMap[i][j].elevation = elevation;
            }
        }
    }
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1; j++) {
        if (map.getMapPoint(i, j).elevation == -1) {
            if (tempMap[i][j].elevation != -1) {
                map.getMapPoint(i, j).elevation = tempMap[i][j].elevation;
                map.getMapPoint(i, j).type = "Land";
            }
        }
        }
    }

    // @ts-ignore
    //tempMap = null;
}

/**
 *
 * @param {number} elevation
 * @param {number} persistenceParameter
 */
function startGenRegion(elevation, persistenceParameter) {
    maxElevation = elevation;
    persistence = persistenceParameter;

    let v = 10; //(numRegions/2).to_i
    variation = randomNumber(0, v) + v;
    startGeneration();
}

function startGeneration() {
    //generate random points from which to start generating.
    //number of points should be influenced by @length

    //generate a few points near each other to simulate a mountain ridge
    //x = 0
    //y = 0
    //while (@temp_map[x][y].elevation != -1)
    //buffer = 8
    let x = randomNumber(10, length - 10);
    let y = randomNumber(10, length - 10);
    //if we aren't on the mainland try again with tighter constraints
    /*if (tempMap[x][y].elevation == -1) {
            x = randomNumber(buffer * 2, length - buffer * 4);
            y = randomNumber(buffer * 2, length - buffer * 4);
        }*/
    tempMap[x][y].elevation = maxElevation;
    tempMap[x][y].direction = 0;
    tempMap[x][y].closed = true;
    //temp_map[x][y].dist = @rand.rand(@variation)* 10
    //@temp_map[x][y].persistence = @persistence
    //@temp_map[x][y].persistence = @persistence
    searchSurroundingNodes(tempMap[x][y]);
    let tempList = open.toArray();
    tempList.forEach((square) => {
        tempMap[square.x][square.y].dist = randomNumber(0, variation) * 10;
        tempMap[square.x][square.y].persistence = persistence;
        tempMap[square.x][square.y].addNoiseYes = true;
    });

    generateOutFromCenterRegion();
}

export function generateOutFromCenterRegion() {
    if (open.empty()) {
        return false;
    }
   // while (!open.empty()) {
    let square = open.pop();
    if (square) {
        let x = square.x;
        let y = square.y;
        if (x != -1) {
            let nextSquare = tempMap[x][y];
            nextSquare.closed = true;
            nextSquare.open = false;
            nextSquare.addNoiseYes = true;
            let timeout = false;
            if (nextSquare.dist <= 0) {
                //timeout = true;
            }

            checkCostAndSetElevationAndColor(nextSquare);
            if (nextSquare && !(timeout && nextSquare.persistence <= 0)) {
                searchSurroundingNodes(nextSquare);
            }
        }
    }
    return true;
    //}
}
/**
 *
 * @param {RegionsSquare} node
 */
function checkCostAndSetElevationAndColor(node) {
    if (node.dist <= 0) {
        node.persistence -= 1;
    }
    node = chosenDirection(node);
    node.elevation = chosenElevation(node);

    tempMap[node.x][node.y].elevation = node.elevation;
    tempMap[node.x][node.y].direction = node.direction;
}
/**
 *
 * @param {RegionsSquare} node
 * @returns
 */
function chosenDirection(node) {
    if (node.dist <= 0) {  
        let newDirection = 1;
        node.dist = randomNumber(variation, variation*2) * 10;
        newDirection = randomNumber(0, 5);
        node.direction = newDirection;
    }
    return node;
}
/**
 *
 * @param {RegionsSquare} node
 * @returns
 */
function chosenElevation(node) {
    let newNodes = getSurroundingNodesElevation(node)
    if(newNodes) {
        let newElevationNode = compareSurroundingNodesElevation(newNodes)
        if (newElevationNode) {
            let  newElevation = newElevationNode.elevation;
            if (newElevation >= 2) {
                //if direction == 0 then go down an eleveation
                if (node.direction == 0) {
                    if (newElevation > 0) {
                        newElevation -= 1;
                        //once we go down an elevation stabalize
                        node.direction = 1
                    }
                //if direction == 2 then go up an elevation
                } else if (node.direction == 2) {
                    if (newElevation < maxElevation - 1) {
                        newElevation += 1;
                        //once we go up an elevation then stablize
                        node.direction = 1
                    }
                }
            }
            else {
                newElevation = 3;
            }
            
        return newElevation;
        }
            
    }
    return 0
    
}
/**
 *
 * @param {RegionsSquare[]} squares
 * @returns
 */
function compareSurroundingNodesElevation(squares) {
    //if 
    while (squares.length < 3) {
        if (squares.length <= 1) {
        squares.push(squares[0]);
        } else {
        squares.push(squares[randomNumber(0, squares.length - 1)]);
        }
    }
    let square = squares[randomNumber(0, squares.length - 1)]
    return square;
}
/**
 *
 * @param {RegionsSquare} node
 * @returns
 */
function getSurroundingNodesElevation(node) {
    let x = node.x;
    let y = node.y;
    let tempArray = [];
    for (let i = x - 2; i <= x + 2; i++) {
        for (let j = y - 2; j <= y + 2; j++) {
            if (i >= 0 && j >= 0 && i < length && j < length) {
                if (tempMap[i][j].elevation >= 0) {
                    tempArray.push(tempMap[i][j]);
                }
            }
        }
    }
    return tempArray;
}
/**
 *
 * @param {RegionsSquare} parent
 */
function searchSurroundingNodes(parent) {
    let x = parent.x;
    let y = parent.y;
    let cost = 0;
    //search nodes around parent node
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
        //if its not the parent node
        if (i != x || j != y) {
            if (i == x || j == y) {
            //cost for straight
            cost = 10;
            } else {
            //cost for diagonal
            cost = 14;
            }
            if (i >= 0 && j >= 0 && i < length - 1 && j < length - 1) {
            let current = tempMap[i][j];
            //ignore node if its already in the closed list
            if (!current.closed) {
                //ignore node if its already in the open list
                if (!current.open) {
                //current.parent = parent
                current.cost = parent.cost + cost;
                if (parent.direction != -1) {
                    current.direction = parent.direction;
                }
                if (parent.dist != -1) {
                    current.dist = parent.dist - cost;
                }
                if (parent.persistence != -1) {
                    current.persistence = parent.persistence;
                }
                current.open = true;
                open.insertNode(current.x, current.y, current.cost);
                }
            }
            }
        }
        }
    }
}

function smoothMap() {
    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1; j++) {
        let tempArray = getSurroundingNodesElevation(tempMap[i][j]);
        let temp = 0.0;
        if (tempArray.length != 0) {
            tempArray.forEach((n) => {
            temp += n.elevation;
            });
            temp = temp / tempArray.length;
            temp += 0.5;
        } else {
            temp = -1;
        }
        tempMap[i][j].elevation = Math.floor(temp);
        }
    }
}
