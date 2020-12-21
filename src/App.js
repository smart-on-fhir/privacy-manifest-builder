import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logo} className="App-logo" alt="logo" style={{
              height: "1.4em",
              verticalAlign: "top",
              marginRight: "1ex"
            }} /> Privacy Manifest Builder
          </a>
        </div>
      </nav>
      <main className="container-fluid">
        <br/>
        <br/>
        <div className="container-fluid">
          TODO: Render questions here...
        </div>
        <br/>
        <br/>
      </main>
      <nav className="navbar fixed-bottom navbar-light bg-light">
        <div className="container-fluid">
          <div className="text-muted">
            Read more about the SMART Privacy Manifest <a href="/" target="_blank" rel="noreferrer">here</a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
