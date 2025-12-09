import dbConnect from '@/lib/db';
import Topic from '@/models/Topic';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    let topics = await Topic.find({});
    
    // Auto-seed if empty for demo purposes
    if (topics.length === 0) {
      const seedData = [
        {
          title: "Bubble Sort",
          description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
          difficulty: "Easy",
          visualizerLink: "/visualizer?algo=BUBBLE",
          resources: ["https://en.wikipedia.org/wiki/Bubble_sort"]
        },
        {
          title: "Selection Sort",
          description: "The selection sort algorithm sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.",
          difficulty: "Easy",
          visualizerLink: "/visualizer?algo=SELECTION",
          resources: []
        },
        {
          title: "Insertion Sort",
          description: "Insertion sort is a simple sorting algorithm that builds the final sorted array (or list) one item at a time.",
          difficulty: "Medium",
          visualizerLink: "/visualizer?algo=INSERTION", 
          resources: []
        },
        {
          title: "Merge Sort",
          description: "Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
          difficulty: "Hard",
          visualizerLink: "/visualizer?algo=MERGE",
          resources: []
        },
        {
          title: "Quick Sort",
          description: "An efficient, divide-and-conquer sorting algorithm that selects a 'pivot' and partitions the array.",
          difficulty: "Medium",
          visualizerLink: "/visualizer?algo=QUICK",
          resources: []
        }
      ];
      await Topic.insertMany(seedData);
      topics = await Topic.find({});
    }

    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
