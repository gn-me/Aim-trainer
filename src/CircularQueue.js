class CircularQueue { // This is my circular queue for my spheres, I have a max size attribute for the maximum amount of spheres I want
  constructor(size) {
    this.queue = [];
    this.maxSize = size;
  }

  enqueue(item) { // Adds an item to the queue if available
    if (this.queue.length < this.maxSize) {
      this.queue.push(item);
    }
  }

  removeAt(index) { // Removes the specific sphere that is clicked
    if (index < 0 || index >= this.queue.length) {
      console.log("Invalid index!"); // Handle invalid index
      return;
    }

    // Remove the element at the specified index
    this.queue.splice(index, 1);
  }

  removeAll() { // Removes all the spheres if it's the end of the round
    this.queue = [];
  }

  setSize(size) { // Used to change the size of the queue
    this.maxSize = size;
  }

  dequeue() {
    if (this.queue.length > 0) {
      return this.queue.shift();
    } else {
      return null;
    }
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  isFull() {
    return this.queue.length === this.maxSize;
  }

  peek() {
    if (this.queue.length > 0) {
      return this.queue[this.queue.length - 1];
    }
  }
}