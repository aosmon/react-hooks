import React, { useState } from "react";
import ReactDOM from "react-dom";
import './styles.css'

function Theme (){
  
  const [theme, setTheme] = useState("light");
  
  return (
    <div className={theme}>
      {theme === "light" 
        ? <button onClick={()=> setTheme("dark")}>🔦</button>
        : <button onClick={()=> setTheme("light")}>💡</button>
      }
    </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Theme />, rootElement);
