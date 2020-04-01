import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { newUser } from './api'

function Redirect () {
  return <h1>Dashboard</h1>
}

function Loading () {
  return <p>Loading...</p>
}

function registerReducer(state, action) {
  if (action.type === 'login') {
    return {
      ...state,
      loading: true,
      error: ''
    }
  } else if (action.type === 'success') {
    return {
      ...state,
      loading: false,
      error: '',
      registered: true
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      loading: false,
      error: action.error,
    }
  } else if (action.type === 'input') {
    return {
      ...state,
      [action.name]: action.value
    }
  } else {
    throw new Error(`That action doesn't exist`)
  }
}

function Register() {
  const [state, dispatch] = React.useReducer(
    registerReducer,
    { username: '', email: '', password: '', loading: false, error: '', registered: false }
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch({ type: 'login' })

    newUser({ 
      username: state.username, 
      email: state.email, 
      password: state.password 
    })
      .then(() => dispatch({ type: 'success' }))
      .catch((error) => dispatch({
        type: 'error',
        error
      }))
  }

  if (state.registered === true) {
    return <Redirect to='/dashboard' />
  }

  if (state.loading === true) {
    return <Loading />
  }

  return (
    <React.Fragment>
      {state.error && <p>{state.error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='email'
          onChange={(e) => dispatch({
            type: 'input',
            name: 'email',
            value: e.target.value,
          })}
          value={state.email}
        />
        <input
          type='text'
          placeholder='username'
          onChange={(e) => dispatch({
            type: 'input',
            name: 'username',
            value: e.target.value,
          })}
          value={state.username}
        />
        <input
          placeholder='password'
          onChange={(e) => dispatch({
            type: 'input',
            name: 'password',
            value: e.target.value,
          })}
          value={state.password}
          type='password'
        />
        <button type='submit'>Submit</button>
      </form>
    </React.Fragment>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Register />, rootElement);
