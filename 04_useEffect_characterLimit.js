import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

/*
  Instructions:
    Assume you're creating an app that allows the user to 
    post status updates (ala Twitter). Your UI should have a
    textarea and a button. The button should be disabled if the
    length of the textarea is 0 or greater than 240 characters.
    The document's title should inform the user on how many
    characters they have left to type before they hit the 240
    character limit - "115 characters left."
*/

function App() {
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    document.title = `${240 - input.length} characters left.`;
  }, [input]);

  return (
    <div className="App">
      <textarea
        type="text"
        value={input}
        placeholder="Type"
        maxLength="240"
        onChange={e => setInput(e.target.value)}
      />
      <button
        disabled={input.length === 0 || input.length > 240}
        onClick={() => console.log(input)}
      >
        Submit
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
