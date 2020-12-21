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
      <main className="container-fluid" style={{ minHeight: "calc(100vh - 93px)" }}>
        <br/>
        <br/>
        <div className="container-fluid">
        TODO: Render questions...
        </div>
        <br/>
        <br/>
      </main>
      <footer>
        <div className="card-footer text-muted text-center">
          <div className="container-fluid">
            Read more about the SMART Privacy Manifest <a href="#">here</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
