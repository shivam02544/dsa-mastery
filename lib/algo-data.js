export const ALGO_INFO = {
  BUBBLE: {
    title: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      best: "O(n)"
    },
    code: `// Bubble Sort
async function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
}`
  },
  SELECTION: {
    title: "Selection Sort",
    description: "Divides the input list into two parts: a sorted sublist of items which is built up from left to right and the remaining unsorted items.",
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      best: "O(n²)"
    },
    code: `// Selection Sort
async function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) swap(arr, i, minIdx);
  }
}`
  },
  INSERTION: {
    title: "Insertion Sort",
    description: "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      best: "O(n)"
    },
    code: `// Insertion Sort
async function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`
  },
  MERGE: {
    title: "Merge Sort",
    description: "An efficient, stable, comparison-based, divide and conquer sorting algorithm. Most implementations produce a stable sort.",
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
      best: "O(n log n)"
    },
    code: `// Merge Sort
async function mergeSort(arr, l, r) {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  await mergeSort(arr, l, m);
  await mergeSort(arr, m + 1, r);
  await merge(arr, l, m, r);
}`
  },
  QUICK: {
    title: "Quick Sort",
    description: "An efficient, divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays.",
    complexity: {
      time: "O(n log n)",
      space: "O(log n)",
      best: "O(n log n)"
    },
    code: `// Quick Sort
async function quickSort(arr, low, high) {
  if (low < high) {
    let pi = await partition(arr, low, high);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  }
}`
  },
  BINARY_SEARCH: {
    title: "Binary Search",
    description: "Search a sorted array by repeatedly dividing the search interval in half. Begin with an interval covering the whole array.",
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      best: "O(1)"
    },
    code: `// Binary Search
async function binarySearch(arr, x) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (arr[m] === x) return m;
    if (arr[m] < x) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`
  },
  DIJKSTRA: {
    title: "Dijkstra's Algorithm",
    description: "Finds the shortest paths between nodes in a graph. It picks the unvisited node with the smallest distance, calculates the distance through it to each unvisited neighbor, and updates the neighbor's distance if smaller.",
    complexity: {
      time: "O(E + V log V)",
      space: "O(V)",
      best: "O(E + V log V)"
    },
    code: `// Dijkstra's Algorithm
function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  distances[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { node: u } = pq.dequeue();
    if (visited.has(u)) continue;
    visited.add(u);

    for (const neighbor in graph[u]) {
      const d = graph[u][neighbor];
      const newDist = distances[u] + d;
      if (newDist < (distances[neighbor] || Infinity)) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  return distances;
}`
  },
  BST: {
    title: "Binary Search Tree",
    description: "A rooted binary tree data structure whose internal nodes each store a key greater than all the keys in the node's left subtree and less than those in its right subtree.",
    complexity: {
      time: "O(log n)",
      space: "O(n)",
      best: "O(1)"
    },
    code: `// BST Insertion
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) return new Node(value);
  if (value < root.value) 
    root.left = insert(root.left, value);
  else if (value > root.value)
    root.right = insert(root.right, value);
  return root;
}`
  },
  BFS: {
    title: "Breadth-First Search",
    description: "Traverses a graph level by level. It starts at the root (or arbitrary node) and explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
      best: "O(V + E)"
    },
    code: `// BFS
function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`
  },
  DFS: {
    title: "Depth-First Search",
    description: "Traverses a graph by exploring as far as possible along each branch before backtracking.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
      best: "O(V + E)"
    },
    code: `// DFS
function dfs(graph, start, visited = new Set()) {
  console.log(start);
  visited.add(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`
  },
  LINKED_LIST: {
    title: "Singly Linked List",
    description: "A linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.",
    complexity: {
      time: "Access: O(n), Insert/Del: O(1)",
      space: "O(n)",
      best: "O(1)"
    },
    code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
}`
  },
  STACK: {
    title: "Stack (LIFO)",
    description: "A linear data structure which follows a particular order in which the operations are performed: Last In First Out.",
    complexity: {
      time: "Push/Pop: O(1)",
      space: "O(n)",
      best: "O(1)"
    },
    code: `class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    return this.items.pop();
  }
}`
  },
  QUEUE: {
    title: "Queue (FIFO)",
    description: "A linear structure which follows a particular order in which the operations are performed: First In First Out.",
    complexity: {
      time: "Enqueue/Dequeue: O(1)",
      space: "O(n)",
      best: "O(1)"
    },
    code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    return this.items.shift();
  }
}`
  }
};
