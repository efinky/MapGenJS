// @ts-check

import { Map } from "./map.js";
import { randomNumber } from "./helpingFunctions.js";


/**
 * @typedef {{x:number, y:number}} Point
 * @typedef {{x1:number,y1:number,x2:number,y2:number}} Section
 */
let length = 0;
/**@type {Map} */
let map;
//^^ bad fix

/**@type {Section[]} */
let sections = [];
/**@type {Point[]} */
let points = [];
let width;
let height;
/**
 * 
 * @param {Map} pMap 
 * 
 */
export function genShoreline( pMap) {
	map = pMap;
	width = map.width;
	height = map.height;
	length = map.width;//Math.min(width, height);
	createSections();
	createPoints();
	connectPoints();
}



//-1, 1
//
function createSections() {
	//d = 30

	//pick a certain number of points per line, can be random between two values
	//numPoints = rand(8..10)
	//loop through numPoints times create section

	//calculate length of section
	
	let numPoints = randomNumber(8, 10);
	let d = Math.floor(length / numPoints);
	let buffer = Math.floor(d / 4);
	let offset = 20
	//length = ((@length)/d).to_i

	let x = 0 + offset;
	let y = 0 + offset;
	let newX = x + d;
	let newY = y + d;
	//nw->ne
	//@sections.push(@section_struct.new x, y, newx, newy)
	//for i in (1..numPoints)
	while (newX + d + buffer <= width - offset - 1) {
		x = newX + buffer
		newX += d + buffer
		//this is how I would randomize boxes
		//ty = newy + rand(-(d/4).to_i..d)
		sections.push({ x1: x, y1: y, x2: newX, y2: newY });
	}
	sections.pop();

	x = width - 1 - d - offset;
	y = d + offset + buffer;
	newX = x + d;
	newY = y + d;
	//ne->se
	//sections.push(section_struct.new x, y, newx, newy)	
	//for i in (2..numPoints)
	while (newY + d + buffer <= height - offset - 1) {
		y = newY + buffer;
		newY += d + buffer;
		sections.push({ x1: x, y1: y, x2: newX, y2: newY });
		//end
	}
	sections.pop();

	x = width - 1 - (d * 2) - offset - buffer;
	y = height - 1 - d - offset;
	newX = x + d;
	newY = y + d;
	//se->sw
	//@sections.push(@section_struct.new x, y, newx, newy)
	//how do I reverse a range?
	//for i in (numPoints-2).downto(0)
	while (x - d - buffer >= offset) {
		newX = x - buffer;
		x -= (d + buffer);
		sections.push({ x1: x, y1: y, x2: newX, y2: newY });
	}
	sections.pop();

	x = 0 + offset;
	y = height - 1 - (d * 2) - offset - buffer;
	newX = x + d;
	newY = y + d;
	//sw->nw
	//sections.push(section_struct.new x, y, newx, newy)
	//puts length
	while (y - (d + buffer) >= offset + (sections[0].y2 - sections[0].y1)) {
		newY = y - buffer
		y -= (d + buffer)
		sections.push({ x1: x, y1: y, x2: newX, y2: newY })
	}


}

function createPoints() {
	let count = randomNumber(0, 2);
	sections.forEach(section => {
		if (count % 2 == 0) {
			let point = {
				x: section.x1 > section.x2 ? randomNumber(section.x2, section.x1) : randomNumber(section.x1, section.x2),
				y: section.y1 > section.y2 ? randomNumber(section.y2, section.y1) : randomNumber(section.y1, section.y2)
			};
			points.push(point);
		}
		count += 1;
	})
}
function connectPoints() {
	let i = 1;
	let prev = points[0]
	let lastPoint = points.length - 1;
	while (i < points.length) {
		genEdge(prev.x, prev.y, points[i].x, points[i].y)

		prev = points[i];
		i += 1;
	}
	genEdge(points[lastPoint].x, points[lastPoint].y, points[0].x, points[0].y)
}
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle 
 * @param {number} tile_name 
 * @returns 
 */
function map_section_edge(x, y, angle, tile_name) {

	map.getMapPoint(check_x(x),check_y(y)).elevation = tile_name
	map.getMapPoint(check_x(x),check_y(y)).type = "ShoreLine"
	//nodes.push(point_struct.new x, y)
	let point = update_x_y(x, y, angle)

	return point
}

/**
 * 
 * @param {number} y_value 
 * @returns {number}
 */
function check_y(y_value) {
	if (y_value >= height) {
		y_value = y_value - height
	}
	else if (y_value < 0) {
		y_value = y_value + (height)
	}
	return y_value
}
/**
 * 
 * @param {number} x_value 
 * @returns {number}
 */
function check_x(x_value) {
	if (x_value >= width) {
		x_value = x_value - width
	}
	else if (x_value < 0) {
		x_value = x_value + (width)
	}
	return x_value
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle 
 * @returns {Point}
 */
function update_x_y(x, y, angle) {
	if (angle == 2) {
		x += 1
		y -= 1
	}
	else if (angle == 4) {
		x += 1
		y += 1
	}
	else if (angle == 6) {
		x -= 1
		y += 1
	}
	else if (angle == 8) {
		x -= 1
		y -= 1
	}
	else if (angle == 1) {
		y -= 1
	}
	else if (angle == 3) {
		x += 1
	}
	else if (angle == 5) {
		y += 1
	}
	else if (angle == 7) {
		x -= 1
	}
	return { x: x, y: y }
}
/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns 
 */
function find_center_angle(x1, y1, x2, y2) {
	let x = x1
	let y = y1 - Math.sqrt(Math.abs(x2 - x1) * Math.abs(x2 - x1) + Math.abs(y2 - y1) * Math.abs(y2 - y1));
	let angle = ((2 * Math.atan2(y2 - y, x2 - x)) * 180 / Math.PI)
	angle = Math.floor((angle + 22.5) / 45 + 1);
	if (angle > 8) {
		angle = 1;
	}
	else if (angle < 1) {
		angle = 8;
	}
	return angle;
}


function genEdge(x1, y1, x2, y2, tile_name = 0) {
	let exit = false;
	let x = x1;
	let y = y1;
	let initial_angle = find_center_angle(x, y, x2, y2);
	let angle = initial_angle;
	let point = map_section_edge(x, y, angle, tile_name);
	let distance = find_distance(point.x, point.y, x2, y2, initial_angle);
	let width = find_width(point.x, point.y, x1, y1, x2, y2);
	
	while (distance > 0 && !exit) {
		//puts "distance = " + distance.to_s
		if (distance >= 10) {
			angle = find_angle_section(angle, initial_angle, 1)
		}
		else if (distance >= 5) {
			angle = find_angle_section(angle, initial_angle, 1)
		}
		else {
			angle = find_center_angle(point.x, point.y, x2, y2)
			//tile_name = 5
		}
		point = map_section_edge(point.x, point.y, angle, tile_name)



		//distance = find_distance(point.x,point.y,x2,y2,initial_angle)
		//width = find_width(point.x,point.y,x1,y1,x2,y2)

		if (width >= distance) {
			//increment by an extra one towards the end points
			let new_angle = find_center_angle(point.x, point.y, x2, y2);
			angle = find_angle_section(angle, initial_angle, 2, new_angle, true);
			point = map_section_edge(point.x, point.y, angle, tile_name);
			exit = true
		}
		distance = find_distance(point.x, point.y, x2, y2, initial_angle);
		width = find_width(point.x, point.y, x1, y1, x2, y2);
		//delete
		//exit = true;
	}

	width = find_distance(point.x, point.y, x2, y2)
	angle = find_center_angle(point.x, point.y, x2, y2)
	while (width > 0 && !exit) {
		point = map_section_edge(point.x, point.y, angle, tile_name)
		width = find_distance(point.x, point.y, x2, y2)
		//delete
		exit = true;
	}
	if (!exit) {
		point = map_section_edge(x2, y2, angle, tile_name)
	}
	else {
		genEdge(point.x, point.y, x2, y2, tile_name);
	}
}
function find_width(x, y, x1, y1, x2, y2) {
	//width from center line
	let width = 0;
	if (x2 - x1 != 0) {
		let m = (y2 - y1) / (x2 - x1);
		let b = y2 - m * x2;
		width = Math.abs(y - (m * x) - b) / (Math.sqrt(m ** 2 + 1));
	}
	else {
		width = Math.abs(x2 - x);
	}
	return width;

}
function find_distance(x, y, x2, y2, initial_angle = 0) {

	let distance = 0;
	//find distance based on angle
	if (initial_angle != 0) {
		let cross_angle = ((initial_angle - 1) + 2) % 8 + 1;
		let point = update_x_y(x2, y2, cross_angle);
		if (x2 - point.x != 0) {
			let m = (y2 - point.y) / (x2 - point.x);
			let b = y2 - m * x2;
			distance = Math.abs(y - (m * x) - b) / (Math.sqrt(m ** 2 + 1));
		}
		else {
			distance = Math.abs(x2 - x);
		}
	}
	//simple find distance
	else {
		if (x == x2) {
			distance = Math.abs(y - y2);
		}
		else if (y == y2) {
			distance = Math.abs(x - x2);
		}
		else {
			distance = Math.sqrt(Math.abs(x2 - x) * Math.abs(x2 - x) + Math.abs(y2 - y) * Math.abs(y2 - y));
		}
	}
	return distance
}
/**
 * 
 * @param {number} angle 
 * @param {number} center 
 * @param {number} variance 
 * @param {number} new_center 
 * @param {boolean} increment 
 * @returns {number}
 */
function find_angle_section(angle, center, variance = 2, new_center = 0, increment = false) {

	//start to come towards point

	let return_angle = 0;
	if (increment == false) {
		//converts center to array point (from 0..7 instead of 1..8)
		center -= 1;
		let anglesList = [(center - 2) % 8 + 1, (center - 1) % 8 + 1, center % 8 + 1, (center + 1) % 8 + 1, (center + 2) % 8 + 1];

		let index = anglesList.indexOf(angle);

		//keep accidents from crashing the program
		if (index == null) {
			index = 2;
		}
		//change by one degree either way, or stay same direction
		let turn = randomNumber(-1, 1);

		index += turn;
		if (variance == 2) {
			if (index < 0) {
				index = 1;
			}
			else if (index > 4) {
				index = 3;
			}
		}
		else {
			if (index < 1) {
				index = 1;
			}
			else if (index > 3) {
				index = 3;
			}
		}
		return_angle = anglesList[index];
	}
	else {
		if (angle > new_center) {
			angle -= 1;
		}
		else if (angle < new_center) {
			angle += 1;
		}

		if (angle > 8) {
			angle = 1;
		}
		else if (angle < 1) {
			angle = 8;
		}


		return_angle = angle

	}
	return return_angle
}

function paintSection() {
	sections.forEach(section => {
		let x1 = section.x1;
		let y1 = section.y1;
		let x2 = section.x2;
		let y2 = section.y2;
		while (x1 != x2) {
			map[x1][y1].elevation = 0;
			map[x1][y2].elevation = 0;
			x1 += x1 > x2 ? -1 : 1;
		}
		x1 = section.x1;
		y1 = section.y1;
		x2 = section.x2;
		y2 = section.y2;
		while (y1 != y2) {
			map[x1][y1].elevation = 0;
			map[x2][y1].elevation = 0;
			y1 += y1 > y2 ? -1 : 1;
		}

	});
}