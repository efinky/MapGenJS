//@ts-check

import { Map } from "./map.js";


class OceanSquare {
    /**
     * 
     * @param {number} elevation 
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} closed 
     * @param {boolean} open 
     */
    constructor(elevation, type, x, y, closed, open) {
        this.elevation = elevation;
        this.type = type;
        this.x = x;
        this.y = y;
        this.closed = closed;
        this.open = open;
    }
}

let tempMap = []
let length = 0;
let open = [];
/**
 * 
 * @param {Map} map 
 */
export function genOcean(map) {
    length = map.width;
    console.log('map', map);
    for (let i = 0; i < length; i++) {
        let row = [];
        for (let j = 0; j < length; j++) {
            console.log(i);
            let elevation = map.getMapPoint(i,j).elevation;
            console.log('ele', elevation);
            let closed = false;
            if (elevation != -1) {
                closed = true;
            }
            row.push(new OceanSquare(elevation, map.getMapPoint(i,j).type, i, j, closed, false))
        }
        tempMap.push(row);
    }
    fillOcean();

    for (let i = 0; i < length; i++) {
        let row = [];
        for (let j = 0; j < length; j++) {
            map.getMapPoint(i,j).elevation = tempMap[i][j].elevation;
            map.getMapPoint(i,j).type = tempMap[i][j].type;
        }
    }
    // @ts-ignore
    tempMap = null;
}

function fillOcean() {
    let startSquaress = [];
    startSquaress.push(tempMap[0][0]);
    startSquaress.push(tempMap[0][length-1]);
    startSquaress.push(tempMap[length-1][0]);
    startSquaress.push(tempMap[length-1][length-1]);

    startSquaress.forEach(square => {
        tempMap[square.x][square.y].closed = true
        tempMap[square.x][square.y].elevation = 0
        tempMap[square.x][square.y].type = "Ocean"
        searchSurroundingSquares(tempMap[square.x][square.y]);
        
    });

    while (open.length != 0 ){
			let nextSquare = open.pop();
			if (nextSquare.elevation != null) {
				tempMap[nextSquare.x][nextSquare.y].closed = true
				tempMap[nextSquare.x][nextSquare.y].elevation = 0
				tempMap[nextSquare.x][nextSquare.y].type = "Ocean"
				tempMap[nextSquare.x][nextSquare.y].open = false
            }
			//if show%10 == 0
				//puts "show " + show.to_s
				//puts "open " + open.count.to_s
			//end
			searchSurroundingSquares(tempMap[nextSquare.x][nextSquare.y])
			//show+=1
    }
}

/**
 * 
 * @param {OceanSquare} square 
 */
function searchSurroundingSquares(square) {
    let x = square.x
    let y = square.y
    
    checkSquare(checkXY(x-1), checkXY(y))
    checkSquare(checkXY(x+1), checkXY(y))
    checkSquare(checkXY(x), checkXY(y-1))
    checkSquare(checkXY(x), checkXY(y+1))

}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 */
function checkSquare(x, y) {
    if ((x >= 0) && (y >= 0) && (x < length) && (y < length))
    if (!tempMap[x][y].closed) {
        if(!(tempMap[x][y].open)) {
            tempMap[x][y].open = true
            open.push(tempMap[x][y])
        }
    }

}
/**
 * 
 * @param {number} xy 
 */
function checkXY(xy) {
    if (xy >= length) {
        xy = xy - length
    }
    else if (xy < 0) {
        xy = xy + (length)
    }
    return xy;
}