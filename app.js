// @ts-check

import { Map, MapPoint } from "./map.js";

//import * as ShoreLine from "./genShoreLine.js";
import { genShoreline } from "./genShoreLine.js";
import { genOcean } from "./genOcean.js";
import { generateOutFromCenter, genMountain, startGeneration, updateMap } from "./mountainGen.js";




export async function run() {
    //initialize Canvas
    let canvas = document.getElementById('canvas');

    if (!(canvas instanceof HTMLCanvasElement)) {
        return;
    }
    window.addEventListener('resize', () => {
        if (!(canvas instanceof HTMLCanvasElement)) {
            console.log("Canvas is null... there is no hope");
            return;
        }
        updateCanvasSize(document, canvas);
    }, false);
    
    updateCanvasSize(document, canvas);

    //Initialize Map
    let map = new Map(300,300);
    let squareWidth = 2;

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
    startGeneration(map);


    


    window.requestAnimationFrame(draw);

    let keepGoing = true;



    
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

        if (keepGoing) {
            let steps = 0;

            while (keepGoing) {
                keepGoing = generateOutFromCenter();
                steps++;
                if (steps > 1000) {
                    break;
                }
            }

        }
        
        updateMap(map);


        //mapCurrent.draw(ctx, viewportOrigin_w, canvasSize);
        //let playerImageId = playerSet.getPlayerImageId(worldState.player.class, worldState.player.direction, worldState.player.step);
        //playerSet.draw(playerImageId, ctx, worldState.player.characterPos_w.sub(viewportOrigin_w));
        /*
        for (const character of characters) {
            const {x, y} = character.characterPos_w.sub(viewportOrigin_w);

            if (character.hp !== character.maxHp){
                const health_percent = (character.hp / character.maxHp);
                const w = health_percent * 32;
                ctx.fillStyle = "#00FF00";
                if (health_percent < 0.7) {
                    ctx.fillStyle = "#FFFF00";
                }
                if (health_percent < 0.4) {
                    ctx.fillStyle = "#FF0000";
                }
                ctx.fillRect(x, y-3, w, 2);
            }
        }
*/
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