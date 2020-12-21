import logo from './logo.svg';
import questionnaire from "./questionnaire.json";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} className="App-logo" alt="logo" style={{
              height: "1.4em",
              verticalAlign: "top",
              marginRight: "1ex"
            }} /> Privacy Manifest Builder
          </a>
        </div>
      </nav>
      <main className="container">
        <br/>
        <br/>
        <div className="row">
        { questionnaire.item.map((x, i) => (
            <div className="col-lg-6" key={i}>
              <div className="card">
                <div className="card-header"><b>{ x.text }</b></div>
                <div className="card-body">TODO: Render question UI here...</div>
              </div>
              <br/>
            </div>
          
        ))}
        </div>
        <hr/>
        <div className="text-center">
          <button className="btn btn-primary btn-lg">Generate Privacy Manifest</button>
        </div>
        <br/>
        <br/>
        <br/>
      </main>
      <nav className="navbar fixed-bottom navbar-light bg-light">
        <div className="container">
          <div className="text-muted">
            Read more about the SMART Privacy Manifest <a href="/" target="_blank" rel="noreferrer">here</a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
