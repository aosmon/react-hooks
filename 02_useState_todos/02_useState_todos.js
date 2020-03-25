import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

/*
  INSTRUCTIONS:
  Create a "todo" app with the following criteria.
    1. The user can add new todo items
    2. The user can remove todo items
*/
function generateId() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

function Todo() {
  const [todos, setTodos] = React.useState([]);
  const [input, setInput] = React.useState("");

  const handleSubmit = () => {
    setTodos(todos =>
      todos.concat({
        text: input,
        id: generateId()
      })
    );
    setInput("");
  };

  const removeTodo = id => setTodos(todos => todos.filter((todo) => todo.id !== id));

  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="New Todo"
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={e => handleSubmit(e.target.value)}>Submit</button>

      <ul>
        {todos.map(({ text, id }) => (
          <li key={id}>
            <span>{text}</span>
            <button onClick={(e)=>removeTodo(id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Todo />, rootElement);
