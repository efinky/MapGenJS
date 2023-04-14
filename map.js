
// @ts-check

export class MapPoint {
    
    /**
     * 
     * @param {number} pX 
     * @param {number} pY 
     * @param {number} elevation
     * @param {string} type 
     */
    constructor(pX, pY, elevation, type){
        this.x = pX;
        this.y = pY;
        this.elevation = elevation;
        this.type = type;
    }

    draw() {

        let color = "#FF0000";
        if (this.elevation === 0) {
    
            color = "#1E3357";
        }
        else if (this.elevation === 1) {
    
            color = "#004DCF";
        }
        else if (this.elevation === 2) {
    
            color = "#F5F280";
        }
        else if (this.elevation === 3) {
    
            
            color = "#089F1A";
        }
        else if (this.elevation === 4) {
    
            color = "#0B5814";
        }
        else if (this.elevation === 5) {
    
            color = "#142B17";
        }
        else if (this.elevation === 6) {
    
            
            color = "#5D7160";
        }
        else if (this.elevation === 7) {
    
            
            color = "#969996";
        }
        else if (this.elevation === 8) {
    
            color = "#C6C9C6";
        }
        else if (this.elevation === 9) {
    
            color = "#E2E3E2";
        }
        else if (this.elevation === 10) {
    
            
            color = "#F9F9F9";
        }
        return color;
    }
}

export class Map {
    /**
     * 
     * @param {number} pWidth 
     * @param {number} pHeight 
     */
    constructor(pWidth, pHeight) {
        this.width = pWidth;
        this.height = pHeight;
        this.rows = [];
    }

    /**
     * 
     * @param {MapPoint[]} row 
     */
    addRow(row) {
        this.rows.push(row);
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {MapPoint}
     */
    getMapPoint(x, y) {
        return this.rows[x][y];
    }
}