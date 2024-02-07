export interface IQueue<T> {
    item: T| null
}

class Queue<T> {
    length = 0
    items: IQueue<T>[] = []
    constructor(length: number) {
        this.length = length
        this.items = Array(length).fill({item: null});
    }

    enqueue(data: T) {
        if (this.items.find(queue => queue !== null)) {
            const filledArray = this.items
            for (let i = filledArray.length -1; i > 0 ; --i) {

                this.items[i] = filledArray[i-1];
            }
        }
        const newQueue = {item: data}
        this.items[0] = newQueue!!;
    }

    dequeue() {
        const item =  this.items[this.getFilledList().length -1];
        const index = this.items.indexOf(item);
        this.items[index].item = null;
        return this.items;
    }

    peek() {
        this.items = Array(this.length).fill(undefined);
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.filter(queue => queue.item !== null).length === 0;
    }

    getFilledList() {
        return this.items.filter(queue => queue !== undefined && queue.item !== null)
    }

    isHead(queue: IQueue<T>) {
        return this.items.indexOf(queue) === 0 && queue !== undefined && queue.item !== null
    }

    isTail(queue: IQueue<T>) {
        return this.items.indexOf(queue) === this.getFilledList().length - 1;
    }
}
export default Queue;