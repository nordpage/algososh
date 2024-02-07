class LinkedList<T> {
    head: LinkedNode<T> | null;
    tail: LinkedNode<T> | null;
    length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    addToTheHead(value: T) {
        let node = new LinkedNode(value);
        node.next = this.head;

        if (this.head === null) {
            this.tail = node;
        }

        this.head = node;
        this.length++


        return node;
    }


    insertAfter(node: LinkedNode<T>, value: T) {
        const next = node.next;
        const newNode = new LinkedNode<T>(value);
        newNode.next = next
        node.next = newNode
        this.length++

        if (node === this.tail) {
            this.tail = newNode;
        }

        return newNode
    }

    deleteNext(node: LinkedNode<T>) {
        node!.next = node.next?.next || null;
        this.length--;
    }

    deleteHead() {
        if (this.head !== this.tail) {
            this.head = this.head?.next || null
        } else {
            this.head = null;
            this.tail = null;
        }
        this.length--;
    }

    getNodeByPosition(position: number): LinkedNode<T> | null {
        if (position < 0 || position > this.length) {
            return null;
        }

        let current = this.head;
        let index = 0;

        while(index < position) {
            current = current!!.next;
            index++;
        }

        return current!!;
    }

    toArray() {
        let node = this.head;
        const result: T[] = [];
        while (node) {
            result.push(node.value);
            node = node.next;
        }
        return result;
    }

}

export class LinkedNode<T> {
    value: T;
    next: LinkedNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}

export default LinkedList;