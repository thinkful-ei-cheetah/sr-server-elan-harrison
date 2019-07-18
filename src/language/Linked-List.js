class _Node {
    constructor(value, next) {
        this.value=value,
        this.next=next;
    }
}

class LinkedList {
    constructor(){
        this.head = null
    }
    startEmpty(){
        if (this.head!==null){
            this.head = null
        }
        this.head = new _Node(null, this.head)
    }
    insertValue(word){
        if (this.head===null){
            this.startEmpty()
        }
        const M=word.memory_value;
        const value = word.id;
        let node = this.head
        for (let i=0; i<M; i++){
            if (node.next !==null){
                node =node.next
            }
            else{
                node.next = new _Node(null, null)
                node = node.next
            }
        }
        if (node.value!==null){
            if (node.next!==null){
                let tempNode = node.next
                let currNode = node
                currNode.next = new _Node(value, tempNode)
            }
            else{
                node.next = new _Node(value, null)
            }
        }
        else{
            node.value = value
        }
    }
    findNextValue(){
        let node = this.head
        while(this.head){
            if (node.value!==null){
                this.head=this.head.next
                return node.value
            }
            else {
                this.head=this.head.next
                node=node.next
            }
        }
        return null;
    }
}
module.exports=LinkedList