class _Node {
  constructor(value, next) {
    this.value = value
    this.next = next
  } 
}

class LinkedList {
  constructor() {
    this.head = null
  }

  insertFirst(item) {
    // Create a new _Node and point the head to the new node
    this.head = new _Node(item, this.head)
  }

  insertLast(item) {
    if(this.head == null) {
      this.insertFirst(item)
    }
    else {
      let tempNode = this.head
      while (tempNode.next !== null) {
        tempNode = tempNode.next
      }
      tempNode.next = new _Node(item, null)
    }
  }

  find(item) {
    // We start at the head
    let currNode = this.head
    if(!this.head) return null

    while(currNode.value !== item) {
      if (currNode.next === null) return null
      else currNode = currNode.next
    }
    return currNode
  }
  
  remove(item) {
    if(!this.head) return null
    if (this.head.value === item) {
      this.head = this.head.next
      return
    }
    let currNode = this.head
    // Keep track of the previous
    let previousNode = this.head

    while ((currNode !== null) && (currNode.value !== item)) {
      previousNode = currNode
      currNode = currNode.next
    }
    if(currNode === null) {
      console.log('Item not found')
      return
    }
    previousNode = currNode.next
  }

  shiftFirstItem(spaces) {
    if(!this.head) return null
    if (!this.head.next) return this.head
    if(spaces === 0) return
    let temp = this.head
    this.head = this.head.next
    let currNode = this.head
    let count = 1
    while(count < spaces) {
      if(currNode.next === null) {
        currNode.next = this.head
      }
      currNode = currNode.next
      count++
    }
    let tail = currNode.next
    currNode.next = temp
    currNode.next.next = tail
  }
}

const sll = new LinkedList() // 1 -> 2 -> 3 -> 4 -> 5 => 2 -> 3 -> 1 -> 4 -> 5
sll.insertLast(1)
sll.insertLast(2)
sll.insertLast(3)
sll.insertLast(4)
sll.insertLast(5)
sll.shiftFirstItem(5)
module.exports = LinkedList
