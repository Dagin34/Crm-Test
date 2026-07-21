class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class Queue:
    def __init__(self, value):
        newNode = Node(value)
        self.front = newNode
        self.rear = newNode
        self.length = 1

    def is_empty(self):
        return self.front is None

    def enqueue(self, value):
        new_node = Node(value)
        if self.is_empty():
            self.front = new_node
            self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node

    def dequeue(self):
        if self.is_empty():
            raise Exception("Empty")
        removed_value = self.front.value
        self.front = self.front.next
        if self.front is None:
            self.rear = None
        return removed_value

    def print_queue(self):
        current = self.front
        while current:
            print(current.value, end=", ")
            current = current.next
        print("Empty")