
class Stack<T> {
    items: T[]

    constructor() {
        this.items = []
    }


    enqueue(data: T) {
        this.items.push(data)
    }

    dequeue() {
        this.items.pop()
    }

    peek() {
        this.items = []
    }

    size() {
        return this.items.length
    }
    isEmpty() {
        return this.items.length === 0;
    }

    isHead(data: T) {
        return this.items.indexOf(data) === this.items.length - 1
    }

}

export default Stack