import logo from './logo.svg';
import questionnaire from "./questionnaire.json";
import { useReducer } from 'react'

const ANSWER = 'ANSWER'

const initialState = {
  ready: false,
  answers: questionnaire.item.reduce((prev, e) => {
    prev[e.linkId] = null;
    return prev
  }, {})
}

function reducer(state, action) {
  switch(action.type) {
    case ANSWER:
      const answers = {
          ...state.answers,
          [action.linkId]: action.value
      }
      return {
        ...state,
        answers,
        ready: Object.values(answers).every(i => !!i)
      }
    default:
        return state
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

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
        { questionnaire.item.map((item) => (
          <div key={item.linkId} className="col-lg-6">
            <div className="card">
              <div className="card-header"><b>{ item.text }</b></div>
              <div className="card-body">
                <QuestionItem
                  linkId={item.linkId}
                  type={item.type}
                  answerOptions={getOptions(item.answerValueSet)}
                  currentAnswer={state.answers[item.linkId]}
                  dispatcher={(linkId, value) => void dispatch({ type: ANSWER, linkId, value})}
                  />
              </div>
            </div>
            <br/>
        </div>
        ))}
        </div>
        <hr/>
        <div className="text-center">
          <a className={`btn btn-primary btn-lg ${!state.ready ? 'disabled' : ''}`} href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.answers, null, 2))} download="PrivacyManifest.json">Generate Privacy Manifest</a>
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

function getOptions(answerValueSet) {
  if(answerValueSet) {
    return questionnaire.contained.find(e => `#${e.id}` === answerValueSet).compose.include[0].concept
  }
  return null
}

function OptionsList({ linkId, answerOptions, currentAnswer, dispatcher }) {
  return answerOptions.map(concept => (
    <div key={`${linkId}_${concept.code}`} className="form-check">
    <input className="form-check-input"
      type="radio" name={linkId}
      id={`${linkId}_${concept.code}`}
      value={concept.code}
      checked={currentAnswer === concept.code}
      onChange={() => dispatcher(concept.code)}
      />
    <label className="form-check-label" htmlFor={`${linkId}_${concept.code}`}>
      {concept.display}
    </label>
  </div>
  ))
}

// TODO: Input validation
function URLInput({ linkId, currentAnswer, dispatcher}) {
  return <input className="form-control" type="url" name={linkId} id={linkId} placeholder="https://example.com"
              pattern="https?://.*" size="30"
              required value={currentAnswer || ''} onChange={e => dispatcher(e.target.value)}/>
}

function QuestionItem({ type, linkId, answerOptions, currentAnswer, dispatcher}) {
  switch(type) {
    case 'choice':
      return  <OptionsList
                answerOptions={answerOptions}
                linkId={linkId}
                currentAnswer={currentAnswer}
                dispatcher={(value) => void dispatcher(linkId, value)}
              />
    case 'url':
      return <URLInput
                linkId={linkId}
                currentAnswer={currentAnswer}
                dispatcher={(value) => void dispatcher(linkId, value)}
              />
    default:
      return <div className="error">Error: Unsupported Question Type</div>
  }
}

export default App;
