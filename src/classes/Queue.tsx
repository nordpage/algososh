class Queue<T> {
    private head: number | null = null;
    private tail: number | null = null;

    length = 0
    items: (T | null)[] = []
    constructor(length: number) {
        this.length = length
        this.items = Array(length).fill(null);
    }

    enqueue(data: T) {
        if (this.tail === null) {
            this.items[0] = data;
            this.tail = 0;
            this.head = 0;
        } else {
            if (this.tail === this.length - 1) {
                throw new Error("Очередь уже заполнена");
            }
            ++this.tail;
            this.items[this.tail] = data;
        }
    }

    dequeue() {
        if (this.head === null) {
            throw new Error("Очередь пуста");
        }
        this.items[this.head] = null;

        if (this.head < this.tail!) {
            this.head++;
        }
    }

    peek() {
        this.items = Array(this.length).fill(null);
        this.head = null;
        this.tail = null;
    }


    isEmpty() {
        return this.head === null// || this.items[this.head] === null;
    }

    isHead(index: number) {
        return this.head === index;
    }

    isTail(index: number) {
        return this.tail === index;
    }

}
export default Queue;