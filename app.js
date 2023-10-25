// @ts-check

import { Map, MapPoint } from "./map.js";

//import * as ShoreLine from "./genShoreLine.js";
import { genShoreline } from "./genShoreLine.js";
import { genOcean } from "./genOcean.js";
import { genRegions, generateOutFromCenterRegion, updateRegionMap} from "./genRegions.js";
import { generateOutFromCenterMountain,  startGenerationMountain, updateMapMountain } from "./mountainGen.js";



class MapGenerator {
    constructor() {
        this.map = new Map(300, 300);
        this.squareWidth = 2;
        this.smooth_i = 0
        this.smooth_j = 0;
        this.copied = false;

        /**@type {number[][]} */
        this.smoothedMap = [];

        
        //populate map
        for (let i = 0; i < map.width; i++){
            let row = []
            for (let j = 0; j < map.height; j++) {
                row.push(new MapPoint(i, j, -1, "Land"));
            }
            map.addRow(row);
        }
        
        //generate the shoreline
        genShoreline(map.width, map);
        genOcean(map);
        // genMountain(map);
        //startGenerationMountain(map);
        
        genRegions(map,9);
        //smoothMap();
        
    }

}


export async function run() {
    //initialize Canvas
    let canvas = document.getElementById('canvas');

    if (!(canvas instanceof HTMLCanvasElement)) {
        return;
    }
    window.addEventListener('resize', () => {
        if (!(canvas instanceof HTMLCanvasElement)) {
            //console.log("Canvas is null... there is no hope");
            return;
        }
        updateCanvasSize(document, canvas);
    }, false);
    
    updateCanvasSize(document, canvas);

    //Initialize Map
    let map = new Map(300,300);
    let squareWidth = 2;
    let smooth_i = 0
    let smooth_j = 0;
    let copied = false;

    /**@type {number[][]} */
    let smoothedMap = [];

    //populate map
    for (let i = 0; i < map.width; i++){
        let row = []
        for (let j = 0; j < map.height; j++) {
            row.push(new MapPoint(i, j, -1, "Land"));
        }
        map.addRow(row);
    }
    
    //generate the shoreline
    genShoreline(map.width, map);
    genOcean(map);
    // genMountain(map);
    //startGenerationMountain(map);
    
    genRegions(map,9);
    //smoothMap();

    function copyMap() {
        for (let i = 0; i < map.width; i++) {
            smoothedMap.push([]);
            for (let j = 0; j < map.width; j++) {
                smoothedMap[i][j] = map.getMapPoint(i, j).elevation;
            }
            smoothedMap[i].push([]);
        }
        copied = true;
    }
    function fastSmoothMap() {
        
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.width; j++) {
                let temp_a = getSurroundingNodesElevation(smooth_i, smooth_j)
                ////console.log(temp_a)
                let temp = compareNodeElevation(temp_a);
                
                //console.log("here3", temp_a);
                if (temp > 0) {
                    //smoothedMap[smooth_i][smooth_j] = Math.floor(temp)
                    map.getMapPoint(smooth_i,smooth_j).elevation = Math.floor(temp);
                    
                //console.log("here4");
                }
            }
        }
    }
    function smoothMap () {
        if (smooth_i < map.width)
        {
            //console.log("here1", smooth_i, smooth_j);
            if (smooth_j == map.width-1) {
                smooth_i++;
                smooth_j = 0;
                //console.log("here2");
            }
            else{
                let temp_a = getSurroundingNodesElevation(smooth_i, smooth_j)
                ////console.log(temp_a)
				let temp = compareNodeElevation(temp_a);
                
                //console.log("here3", temp_a);
                if (temp > 0) {
				    //smoothedMap[smooth_i][smooth_j] = Math.floor(temp)
                    map.getMapPoint(smooth_i,smooth_j).elevation = Math.floor(temp);
                    
                 //console.log("here4");
                }
                smooth_j++;
            }
            return false;
        }
        else
        {
            
            //console.log("here5");
            return true;
        }
    }
    /**
     * 
     * @param {number[]} elevations 
     */
    function compareNodeElevation(elevations){
        let min = 0;
        let max = 1;
        let count = 0;
        let sum = 0;
        elevations.forEach(e => {
            if (e < min) {
                min = e;
            }
            if (e > max) {
                max = e;
            }
            count++;
            sum += e;
        });
        if (max - min > 3) {
            return Math.floor(sum/count);
        }
        else {
            return -1
        }
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    function getSurroundingNodesElevation(x, y) {
		let temp_a = []
		for (let i = x-1; i <= x+1; i++) {
			for (let j = y-1;j <= y+1; j++) {
				if (i >= 0 && j >= 0 && i < map.width && j < map.width) {
					if (smoothedMap[i][j] > 1) {
						temp_a.push(smoothedMap[i][j]);
					}
				}
			}
		}
		return temp_a
	} 
    function drawStuff() {

        
        if (keepGoingRegion){//} && !keepGoingMountain) {
            let steps = 0;

            while (keepGoingRegion) {
                keepGoingRegion = generateOutFromCenterRegion();
                steps++;
                if (steps > 1000) {
                    break;
                }
            }

            updateRegionMap(map);
            
        }

        /*if (!keepGoingRegion &&keepGoingRegion2){//} && !keepGoingMountain) {
            let steps = 0;
            console.log("jere");
            while (keepGoingRegion) {
                keepGoingRegion = generateOutFromCenterRegion();
                steps++;
                if (steps > 1000) {
                    break;
                }
            }

            updateRegionMap(map);
        }*/
        
        /*
        if (keepGoingMountain) {
            let steps = 0;

            while (keepGoingMountain) {
                keepGoingMountain = generateOutFromCenterMountain();
                steps++;
                if (steps > 1000) {
                    break;
                }
            }
            
            updateMapMountain(map);
        }
        */
    
        
        
        keepGoingMountain = false;

        if (!copied) {
            copyMap();
        }
        
        
        if (!keepGoingMountain && !keepGoingRegion &&!smoothed) {
            //fastSmoothMap();
            //smoothed = smoothMap();
            smoothed = true;
        }
        if (!keepGoingMountain && !keepGoingRegion) {
            return null;
        }
        else {
            return map;
        } 
    }


    


    window.requestAnimationFrame(draw);

    let keepGoingMountain = true;
    let keepGoingRegion = true;
    let keepGoingRegion2 = true;
    let smoothed = false;



    
    /**
     *
     * @param {number} now
     */
    function draw(now) {

        let timestamp = performance.now();
        let dt = (now - timestamp) / 1000;
        timestamp = now;
        let canvas = document.getElementById('canvas');
        if (!(canvas instanceof HTMLCanvasElement)) {
            return;
        }
        let ctx = canvas.getContext('2d');
        if (!ctx) {
            return null;
        }

        //drawStuff();
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                let point = map.getMapPoint(i, j);
                ctx.fillStyle = point.draw();
                ctx.fillRect(point.x*squareWidth, point.y*squareWidth, squareWidth, squareWidth);
            }
        }
        //ctx.fillStyle = "#000000";
        //ctx.fillRect(100, 100, 10, 10);


        

        window.requestAnimationFrame(draw);
    }



    /**
     *
     * @param {Document} doc
     * @param {HTMLCanvasElement} canvas
     */
    function updateCanvasSize(doc, canvas) {
        canvas.width = doc.body.clientWidth;
        canvas.height = doc.body.clientHeight;
    }
}