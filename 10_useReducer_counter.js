import React from "react";
import ReactDOM from "react-dom";
import Slider from './Slider'
import "./styles.css";

function reducer(state, action) {
  if (action.type === 'increment') {
    return {
      count: state.count + state.step,
      step: state.step,
    }
  } else if (action.type === 'decrement') {
    return {
      count: state.count - state.step,
      step: state.step,
    }
  } else if (action.type === 'reset') {
    return {
      count: 0,
      step: state.step,
    }
  } else if (action.type === 'updateStep') {
    return {
      count: state.count,
      step: action.step,
    }
  } else {
    throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(
    reducer,
    { count: 0, step: 1 }
  )

  return (
    <React.Fragment>
      <Slider onChange={(value) => dispatch({
        type: 'updateStep',
        step: value
      })} />
      <hr />
      <h1>{state.count}</h1>
      <button onClick={() => dispatch({
        type: 'increment',
      })}>
        +
      </button>
      <button onClick={() => dispatch({
        type: 'decrement'
      })}>
        -
      </button>
      <button onClick={() => dispatch({
        type: 'reset'
      })}>
        Reset
      </button>
    </React.Fragment>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Counter />, rootElement);