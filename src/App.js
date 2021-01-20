import logo from './logo.svg';
import questionnaire from "./questionnaire.json";
import { useReducer } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const initialState = {
  answers: questionnaire.item.reduce((prev, e) => {
    prev[e.linkId] = [];
    return prev
  }, {})
};


function generateQuestionnaireResponse(state) {
  return {
    resourceType : "QuestionnaireResponse",
    status       : "completed",
    questionnaire: "http://privacy-manifest.smarthealthit.org/questionnaire",
    subject      : "<subject>",
    identifier: {
      value: "<app-resource-identifying-uri>"
    },
    authored: "<last updated privacy manifest>",
    item: questionnaire.item.map(item => {
      return {
        linkId: item.linkId,
        text  : item.text,
        definition: "http://privacy-manifest.smarthealthit.org",
        answer: state.answers[item.linkId]
      };
    })
  };
}

function checkStateValidity(state) {
  for (let question of questionnaire.item) {
    const answers = state.answers[question.linkId];
    if (question.required) {
      if (!answers.length) {
        // console.log(`${question.linkId} is required`);
        return false;
      }
    }
    if (question.type === "url") {
      let answer = getPath(answers, "0.valueUri") || "";
      if (answer && !/^https?:\/\/.+/.test(answer)) {
        // console.log(`${question.linkId} is invalid (${answer})`);
        return false;
      }
    }
  }
  return true;
}

function checkFormValidity() {
  const form = document.getElementsByTagName("form")[0];
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function beforeDownload(e) {
  if (!checkFormValidity()) {
    e.preventDefault();
  }
}

function reducer(state, action) {
  switch(action.type) {
    case "TOGGLE_MULTIPLE": {
      const currentAnswers = [...state.answers[action.linkId]];
      const answerIndex = currentAnswers.findIndex(x => x.valueCoding.code === action.value.valueCoding.code);
      if (answerIndex > -1) {
        currentAnswers.splice(answerIndex, 1);
      } else {
        currentAnswers.push(action.value);
      }
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.linkId]: currentAnswers
        }
      };
    }

    case "TOGGLE_SINGLE": {
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.linkId]: state.answers[action.linkId].findIndex(
            x => x.valueCoding.code === action.value.valueCoding.code
          ) > -1 ? [] : [action.value]
        }
      };
    }

    case "SET_URI":
      const answers = {
          ...state.answers,
          [action.linkId]: [{ valueUri: action.value }]
      }
      return {
        ...state,
        answers
      }
    default:
        return state
  }
}

function getPath(obj, path = "") {
    return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj)
}

function Question({ text, extension = null, linkId, state, dispatch }) {
  let label = text;
  let note  = null;

  if (Array.isArray(extension)) {
    let ext = extension.find(x => x.url === "http://fhir-registry.smarthealthit.org/extensions/questionnaire-item-label");
    if (ext && ext.valueString) {
      note = label;
      label = ext.valueString;
    }
  }
  return (
    <div className="col-lg-6" style={{ marginBottom: "3rem" }}>
      <h4 className="text-success">{ label }</h4>
      <hr/>
      { note && <p className="form-text">{ note }</p> }
      <Answers questionId={linkId} state={state} dispatch={dispatch}/>
    </div>
  );
}

function Answers({ questionId, state, dispatch }) {
  const question = questionnaire.item.find(x => x.linkId === questionId);
  
  if (question.type === "choice") {

    const { concept, system } = questionnaire.contained.find(
      x => `#${x.id}` === question.answerValueSet
    ).compose.include[0];

    if (question.repeats) {
      return <>{concept.map(currentAnswer => <CheckBox
          key={`${questionId}_${currentAnswer.code}`}
          attrs={{
            name: currentAnswer.code,
            checked: state.answers[questionId].findIndex(x => x.valueCoding.code === currentAnswer.code) > -1,
            onChange: () => {
              dispatch({
                type: "TOGGLE_MULTIPLE",
                linkId: questionId,
                value: {
                  valueCoding: {
                      system,
                      code: currentAnswer.code,
                      display: currentAnswer.display
                  }
                }
              });
            }
          }}
          label={ currentAnswer.display }
          description={ getPath(currentAnswer, "designation.0.value") || null }
        />)}</>;
    }

    else {
      return <>{concept.map(currentAnswer => <CheckBox
          key={`${questionId}_${currentAnswer.code}`}
          attrs={{
            name: currentAnswer.code,
            type: "radio",
            checked: state.answers[questionId].findIndex(x => x.valueCoding.code === currentAnswer.code) > -1,
            onChange: () => {
              dispatch({
                type: "TOGGLE_SINGLE",
                linkId: questionId,
                value: {
                  valueCoding: {
                      system,
                      code: currentAnswer.code,
                      display: currentAnswer.display
                  }
                }
              });
            }
          }}
          label={ currentAnswer.display }
          description={ getPath(currentAnswer, "designation.0.value") || null }
        />)}</>;
    }
  }
  else if (question.type === "url") {
    return <URLInput
           linkId={questionId}
           value={getPath(state, `answers.${questionId}.0.valueUri`) || null}
           onChange={e => void dispatch({ type: "SET_URI", linkId: questionId, value: e.target.value })}
           required={!!question.required}
         />
  }

  return null;
}

function App() {

  /** @type {any} */
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
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
      <main className="container" style={{ fontSize: "14px" }}>
        <br/>
        <br/>
        <form onSubmit={e => e.preventDefault()} className="needs-validation">
          <div className="row">
            { questionnaire.item.map(item => <Question key={item.linkId} { ...item } state={state} dispatch={dispatch}/>) }
          </div>
          <div className="card">
            <h4 className="card-header">
              <a
                onClick={beforeDownload} 
                className={"btn btn-primary float-right"}
                href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.answers, null, 2))}
                download="privacy-manifest.json"
                style={{ margin: "-4px 0" }}
              >Download</a>
              Privacy Manifest { !checkStateValidity(state) && <small><b style={{ verticalAlign: "text-top"}} className="badge badge-danger">Invalid</b></small> }
            </h4>
            <div className="card-body">
            <SyntaxHighlighter customStyle={{ background: "#FFF" }} language="json" style={atomOneLight}>{
                JSON.stringify(generateQuestionnaireResponse(state), null, 2)    
            }</SyntaxHighlighter>
            </div>
          </div>
        </form>
        <br/>
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

function URLInput({ linkId, value, onChange, required = false}) {
  return <input
    className="form-control"
    type="url"
    name={linkId}
    id={linkId}
    placeholder="https://example.com"
    required={required}
    pattern="^https?://.+"
    value={value || ''}
    onChange={onChange}
  />
}

function CheckBox({ attrs, label, description }) {
  return (
    <div className="form-check">
      <label className="form-check-label">
        <input
          type="checkbox"
          { ...attrs }
          className="form-check-input"
        /> { label }
        { description && <p className="text-muted">{ description }</p> }
      </label>
    </div>
  );
}

export default App;
