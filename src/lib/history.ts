// Undo/Redo history manager
export class HistoryManager<T> {
  private stack: T[] = [];
  private pointer = -1;
  private maxSize = 50;

  push(state: T) {
    this.stack = this.stack.slice(0, this.pointer + 1);
    this.stack.push(JSON.parse(JSON.stringify(state)));
    if (this.stack.length > this.maxSize) this.stack.shift();
    else this.pointer++;
  }

  undo(): T | null {
    if (this.pointer <= 0) return null;
    this.pointer--;
    return JSON.parse(JSON.stringify(this.stack[this.pointer]));
  }

  redo(): T | null {
    if (this.pointer >= this.stack.length - 1) return null;
    this.pointer++;
    return JSON.parse(JSON.stringify(this.stack[this.pointer]));
  }

  canUndo() { return this.pointer > 0; }
  canRedo() { return this.pointer < this.stack.length - 1; }
}
