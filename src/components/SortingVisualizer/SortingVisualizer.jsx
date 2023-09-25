import React from 'react';
import {
  getMergeSortAnimations,
  getQuickSortAnimations,
  sleep,
  heapSort
}from '../SortingAlgorithms/SortingAlgorithms.js';
import './SortingVisualizer.css';

const ANIMATION_SPEED_MS = 1;
const NUMBER_OF_ARRAY_BARS = 300;
const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';
export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      isRunning: false,
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    this.setState({ array });
  }

  async mergeSort() {
    this.setState({ isRunning: true });
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    this.setState({ isRunning: false });
  }

  async quickSort() {
    this.setState({ isRunning: true }); 
    const animations = getQuickSortAnimations([...this.state.array]);
    let i = 0;
    while (i < animations.length) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [pivotIndex, pivotHeight, barOneIdx, barTwoIdx, swap] = animations[i];
  
      if (pivotIndex !== null) {
        const pivotBar = arrayBars[pivotIndex];
        pivotBar.style.backgroundColor = SECONDARY_COLOR;
        await sleep(ANIMATION_SPEED_MS);
      }
  
      if (pivotHeight !== null) {
        const pivotBar = arrayBars[pivotIndex];
        pivotBar.style.height = `${pivotHeight}px`;
        await sleep(ANIMATION_SPEED_MS);
        pivotBar.style.backgroundColor = PRIMARY_COLOR;
      }
  
      if (barOneIdx !== null && barTwoIdx !== null) {
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = swap ? SECONDARY_COLOR : PRIMARY_COLOR;
  
        await sleep(ANIMATION_SPEED_MS);
  
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
  
        await sleep(ANIMATION_SPEED_MS);
  
        const tempHeight = barOneStyle.height;
        barOneStyle.height = barTwoStyle.height;
        barTwoStyle.height = tempHeight;
      }
  
      i++;
    }
    this.setState({ isRunning: false });
  }
  

  heapSort() {
    this.setState({ isRunning: true }); 
    const animations = heapSort([...this.state.array]);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const [barOneIdx, barTwoIdx, swap] = animations[i];
  
      if (barOneIdx !== null && barTwoIdx !== null) {
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = swap ? SECONDARY_COLOR : PRIMARY_COLOR;
  
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
  
        setTimeout(() => {
          const tempHeight = barOneStyle.height;
          barOneStyle.height = barTwoStyle.height;
          barTwoStyle.height = tempHeight;
        }, (i + 0.5) * ANIMATION_SPEED_MS);
      }
    }
  
    setTimeout(() => {
      this.setState({ isRunning: false });
    }, animations.length * ANIMATION_SPEED_MS);
  }

  bubbleSort() {}

  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortAnimations(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, mergeSortedArray));
    }
  }

  render() {
    const { array, isRunning } = this.state;

    return (
      <div>
        <h1 className='header'>Sorting Algorithm Visualizer</h1>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: PRIMARY_COLOR,
                height: `${value}px`,
              }}
            ></div>
          ))}
          <button
            className="generate-array-button"
            onClick={() => this.resetArray()}
            disabled={isRunning}
          >
            Generate New Array
          </button>
          <button className="sort-button" onClick={() => this.mergeSort()} disabled={isRunning}>
            Merge Sort
          </button>
          <button className="sort-button" onClick={() => this.quickSort()} disabled={isRunning}>
            Quick Sort
          </button>
          <button className="sort-button" onClick={() => this.heapSort()} disabled={isRunning}>
            Heap Sort
          </button>
          <button className="sort-button" onClick={() => this.bubbleSort()} disabled={isRunning}>
            Bubble Sort
          </button>
          <button
            className="sort-button"
            onClick={() => this.testSortingAlgorithms()
            }
            disabled={isRunning}
          >
            Test Sorting Algorithms (BROKEN)
          </button>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
