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
/*addNoise(variance, startingPos, stickiness) {
    let newPos = randomNumber(startingPos - 1, startingPos +1) 
    //starting pos is 5, variance is 3,
    return newPos;
}*/
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


export class Regions {
    constructor(maxElevation, variation, map) {
        /** @type {RegionsSquare[][]}  */
        this.tempMap = [];
        this.open = new LinkedList();
        this.variation = variation;
        this.buffer = Math.floor(map.width / 7);
        this.maxElevation = maxElevation;
        this.persistence = 0;
        this.map = map;
    }

    /**
     *
     * @param {Map} map
     * @param {number} variation
     * @param {number} numRegions
     */
    static genRegions(map, variation, numRegions) {
        //max elevation for regions should be 1/3 of total max elevations
        let maxElev = Math.floor(.2*map.maxElevation);
        let regions = new Regions(maxElev, variation, map);
        //initialize an empty map full of nodes
        for (let i = 0; i < map.width; i++) {
            let row = [];
            for (let j = 0; j < map.height; j++) {
            row.push(new RegionsSquare(false, -1, -1, -1, 0, false, false, -1, i, j));
            }
            regions.tempMap.push(row);
        }

        //generate regions

        //use the regions to generate "noisy" terrain
        for (let i = 0; i < numRegions; i++) {
            regions.startGenRegion(randomNumber(4, Math.floor(maxElev/2)), randomNumber(4, 5));
            //addNoise();
        }
        //	puts "adding noise..."
        //fill in anything else with low noise
        //gen = Perlin:: Generator.new @seed, 0.5, 12

        
        //smoothMap()

        return regions;
    }
    /**
     * 
     * @param {Map} map 
     */
    updateRegionMap(map) {
        for (let i = 0; i < map.width - 1; i++) {
            for (let j = 0; j < map.height - 1; j++) {
            let elevation = this.tempMap[i][j].elevation;
                if (this.tempMap[i][j].addNoiseYes) {
                    //elevation = addNoise(5, elevation, 3);
                    this.tempMap[i][j].elevation = elevation;
                }
            }
        }
        for (let i = 0; i < map.width - 1; i++) {
            for (let j = 0; j < map.height - 1; j++) {
            if (map.getMapPoint(i, j).elevation == -1) {
                if (this.tempMap[i][j].elevation != -1) {
                    map.getMapPoint(i, j).elevation = this.tempMap[i][j].elevation;
                    map.getMapPoint(i, j).type = "Land";
                }
            }
            }
        }

        // @ts-ignore
        //this.tempMap = null;
    }

    /**
     *
     * @param {number} startingElevation
     * @param {number} persistenceParameter
     */
    startGenRegion(startingElevation, persistenceParameter) {
        this.persistence = persistenceParameter;

        let v = 10; //(numRegions/2).to_i
        this.variation = randomNumber(0, v) + v;
            //generate random points from which to start generating.
        //number of points should be influenced by @length

        //generate a few points near each other to simulate a mountain ridge
        //x = 0
        //y = 0
        //while (@temp_map[x][y].elevation != -1)
        //buffer = 8
        let x = randomNumber(10, this.map.width - 10);
        let y = randomNumber(10, this.map.height - 10);
        //if we aren't on the mainland try again with tighter constraints
        /*if (this.tempMap[x][y].elevation == -1) {
                x = randomNumber(buffer * 2, length - buffer * 4);
                y = randomNumber(buffer * 2, length - buffer * 4);
            }*/
        this.tempMap[x][y].elevation = startingElevation;
        this.tempMap[x][y].direction = 0;
        this.tempMap[x][y].closed = true;
        //temp_map[x][y].dist = @rand.rand(@variation)* 10
        //@temp_map[x][y].persistence = @persistence
        //@temp_map[x][y].persistence = @persistence
        this.searchSurroundingNodes(this.tempMap[x][y]);
        let tempList = this.open.toArray();
        tempList.forEach((square) => {
            this.tempMap[square.x][square.y].dist = randomNumber(0, this.variation) * 10;
            this.tempMap[square.x][square.y].persistence = this.persistence;
            this.tempMap[square.x][square.y].addNoiseYes = true;
        });

        this.generateOutFromCenterRegion();
    }


    generateOutFromCenterRegion() {
        if (this.open.empty()) {
            return false;
        }
    // while (!open.empty()) {
        let square = this.open.pop();
        if (square) {
            let x = square.x;
            let y = square.y;
            if (x != -1) {
                let nextSquare = this.tempMap[x][y];
                nextSquare.closed = true;
                nextSquare.open = false;
                nextSquare.addNoiseYes = true;
                let timeout = false;
                if (nextSquare.dist <= 0) {
                    //timeout = true;
                }

                this.checkCostAndSetElevationAndColor(nextSquare);
                if (nextSquare && !(timeout && nextSquare.persistence <= 0)) {
                    this.searchSurroundingNodes(nextSquare);
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
    checkCostAndSetElevationAndColor(node) {
        if (node.dist <= 0) {
            node.persistence -= 1;
        }
        node = this.chosenDirection(node);
        node.elevation = this.chosenElevation(node);

        this.tempMap[node.x][node.y].elevation = node.elevation;
        this.tempMap[node.x][node.y].direction = node.direction;
    }
    /**
     *
     * @param {RegionsSquare} node
     * @returns
     */
    chosenDirection(node) {
        if (node.dist <= 0) {  
            let newDirection = 1;
            node.dist = randomNumber(this.variation, this.variation*2) * 10;
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
    chosenElevation(node) {
        let newNodes = this.getSurroundingNodesElevation(node)
        if(newNodes) {
            let newElevationNode = this.compareSurroundingNodesElevation(newNodes)
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
                        if (newElevation < this.maxElevation - 1) {
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
    compareSurroundingNodesElevation(squares) {
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
    getSurroundingNodesElevation(node) {
        let x = node.x;
        let y = node.y;
        let tempArray = [];
        for (let i = x - 2; i <= x + 2; i++) {
            for (let j = y - 2; j <= y + 2; j++) {
                if (i >= 0 && j >= 0 && i < this.map.width && j < this.map.height) {
                    if (this.tempMap[i][j].elevation >= 0) {
                        tempArray.push(this.tempMap[i][j]);
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
    searchSurroundingNodes(parent) {
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
                if (i >= 0 && j >= 0 && i < this.map.width - 1 && j < this.map.height - 1) {
                let current = this.tempMap[i][j];
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
                    this.open.insertNode(current.x, current.y, current.cost);
                    }
                }
                }
            }
            }
        }
    }

    smoothMap() {
        for (let i = 0; i < this.map.width - 1; i++) {
            for (let j = 0; j < this.map.height - 1; j++) {
            let tempArray = this.getSurroundingNodesElevation(this.tempMap[i][j]);
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
            this.tempMap[i][j].elevation = Math.floor(temp);
            }
        }
    }
}