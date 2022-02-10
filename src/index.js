import React from "react";
import ReactDOM from "react-dom";
import Home from './home.jsx';
import cache from "../public/cache.png";
import "./style.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <Home/>
        <div>h1ell</div>
        <p/>
        <img src={cache} alt/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));
