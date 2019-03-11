import React, { Component } from 'react'

class App extends Component {
  render() {
    const { children } = this.props
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome React</h1>
        </header>
        {children}
      </div>
    );
  }
}

export default App;
