//@ts-check
export class LinkedNode {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} cost 
     */
    constructor(x, y, cost) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        /** @type {LinkedNode | null} */
        this.next = null;
        /** @type {LinkedNode | null} */
        this.prev = null;
        
    }
}
export class LinkedList {
    constructor() {
        // this.head = null;
        //this.last = null;
        // this.count = 0;

        this.thing = [];
    }    
    clear() {
        // this.head = null;
        this.thing = [];
    }
    empty() {
        return this.thing.length === 0;
    }
    // /**
    //  * 
    //  * @returns {LinkedNode | null}
    //  */
    // getLast() {
    //     //console.log('getlast', this.last);
    //     let node = this.head;
    //     while(node != null && node.next != null) {
    //         node = node.next;
    //     }
        
    //     return node;
    // }
    // /**
    //  * 
    //  * @returns {LinkedNode | null}
    //  */
    // getFirst() {
    //     return this.head;
    // }
    /**
     * 
     * @returns {LinkedNode[]}
     */
    toArray() {
        // let node = this.head;
        // let array = [];
        // while(node) {
        //     array.push(node)
        //     node = node.next;
        // }
        // return array;
        return this.thing;
    }
    // /**
    //  * 
    //  * @param {LinkedNode} node 
    //  */
    // push(node) {

    //     if (!this.head) {
    //         this.head = node;
    //         //this.last = this.head;
    //     }
    //     else {
    //         let last = this.getLast()
    //         if (last) {
    //             last.next = node;
    //         }
    //     }        
    //     this.count++;
    // }
    /**
     * 
     * @returns {LinkedNode | null}
     */
    pop() {
        return this.thing.pop();

        //if there is only one node.  set the list to empty
        // let node = null;
        // if (this.count === 1) {
        //     node = this.head;
        //     this.head = null;
        //     //console.log('last is null?', this.last);
        //     //this.last = null;
        //     this.count--;
        //     return node;
        // }
        // //if the list is not empty
        // else if(this.count > 1) {
        //     let node = this.getLast()//this.last;
        //     //console.log(this.toArray());
        //     if (node && node.prev) {
        //         //this.last = node.prev;
        //         node.prev.next = null;
        //         this.count--;
        //         console.log("cost", node.cost)
        //         return node;
        //     }
        //     else {
        //         return null;
        //     }
        // }
        // else {
        //     console.log("empty");
        //     return null;
        // }
        // //if linked list is 1 node long... then 
        
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} cost 
     * @returns 
     */
    insertNode(x, y, cost) {
		// let result = -1
        let newNode = new LinkedNode (x, y, cost);
        this.thing.push(newNode);
        this.thing.sort((a, b) => b.cost - a.cost);
        //if list is empty just add the node to the head
		// if (this.head == null) {
		// 	this.head = newNode;
		// 	result = 0;
        //     console.log("first insert");
        //     //this.last = this.head;
        //     //console.log(this.last);
        // }
		// else {
		// 	let current = this.head;
		// 	//searches until we find the right place in the list
		// 	while (current.next != null && cost >= current.cost) {
		// 		current = current.next;
        //     }
		// 	//we are at the front of the list
		// 	if (current == this.head && cost < current.cost) {
		// 		//insert at front of list
		// 		//puts "i = " + cost.to_s + " c = " + current.cost.to_s
		// 		//puts "insert in front" + cost.to_s
		// 		result = 0;
		// 		this.head.prev = newNode;
        //         newNode.next = this.head;
		// 		this.head = newNode;
        //         //console.log("front of list insert", this.last);

        //     }	
		// 	//we are at the end of the list
		// 	else if (current.next == null && cost >= current.cost) {
		// 		result = 0;
		// 		//place new node at the end of list
        //         newNode.prev = current;
		// 		current.next = newNode;	
        //         let last = this.getLast();
        //         last = newNode;
        //         //console.log('end of list insert',this.last);
        //         //console.log(this.count+1);
        //     }		
		// 	else if (cost < current.cost) {
		// 		result = 0;
		// 		//puts "insert in middle1 " + index.to_s
		// 		//this.node_struct.new current, current.prev, x, y, index
        //         newNode.next = current;
        //         newNode.prev = current.prev;
        //         if (current.prev) {
		// 		    current.prev.next = newNode;
        //         }
		// 		current.prev = newNode;
		// 		//puts "inserted" + index.to_s
                
        //         //console.log("middle insert 1", this.last);
        //     }
		// 	else {
		// 		result = 0;
		// 		//puts "insert in middle2 " + index.to_s
		// 		//this.node_struct.new current.next, current, x, y, index
		// 		newNode.next = current.next;
        //         newNode.prev = current;
        //         if (current.next) {
        //             current.next.prev = newNode;
        //         }
		// 		current.next = newNode;
		// 		//puts "inserted" + index.to_s
        //         //console.log("middle insert 2", this.last);
        //     }
			
        // }
		// if (result == 0) {
		// 	this.count += 1;
        //     //console.log("insert", this.count);
        // }
        // //console.log(this.toArray());
		// return result;
	}
    
}