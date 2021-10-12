import logo from './logo.svg';
import questionnaire from "./questionnaire.json";
import Preview from "./Preview"
import { useReducer } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const initialState = {
  answers: questionnaire.item.reduce((prev, e) => {
    prev[e.linkId] = [];
    return prev
  }, {}),
  showPreview: false
};

function previewDataUsage(state) {
  const answers = state.answers["data-usage-policy"];

  const A_NO_PROCESSING    = answers.find(x => x.valueCoding.code === "no-processing");
  const A_PRIMARY_ONLY     = answers.find(x => x.valueCoding.code === "primary-only");
  const A_RESEARCH         = answers.find(x => x.valueCoding.code === "research");
  const A_POPULATION       = answers.find(x => x.valueCoding.code === "population-analytics");
  const A_ML               = answers.find(x => x.valueCoding.code === "machine-learning");
  const A_POTENTIAL_IMPACT = answers.find(x => x.valueCoding.code === "potential-impact");
  const A_WRITE_ACCESS     = answers.find(x => x.valueCoding.code === "write-access");
  const A_NON_HEALTH       = answers.find(x => x.valueCoding.code === "non-health");

  const txt = []
  const usage = []

  if (A_NO_PROCESSING) {
    txt.push("Patient data are not processed by the app.")
  }
  
  if (A_PRIMARY_ONLY) {
    usage.push("used only for directly improving care quality of the patient")
  }
  if (A_RESEARCH) {
    usage.push("used for IRB-approved research purposes")
  }
  if (A_POPULATION) {
    usage.push("used for population analytics")
  }
  if (A_ML) {
    usage.push("potentially used to train machine learning models not directly related to the primary service")
  }
  if (A_POTENTIAL_IMPACT) {
    txt.push("This app collects and/or shares genetic or family history data that may impact people other than the patient giving access.")
  }
  if (A_WRITE_ACCESS) {
    txt.push("Data captured by the app are written to a paired health record.")
  }
  if (A_NON_HEALTH) {
    txt.push("This app requests to collect some non-health data from devices, such as location.")
  }

  if (usage.length) {
    txt.push("Patient data are " + usage.join(", ") + ".")
  }

  return (
    <>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-tools text-primary" /> Data Usage</h4>
          <span class="badge badge-secondary badge-pill">2</span>
        </div>
        {list(txt)}
      </div>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-share text-primary" /> Data Sharing</h4>
          <span class="badge badge-secondary badge-pill">2</span>
        </div>
      </div>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-file-invoice-dollar text-primary" /> Data Selling</h4>
          <span class="badge badge-secondary badge-pill">2</span>
        </div>
      </div>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-universal-access text-primary" /> Data Access</h4>
          <span class="badge badge-secondary badge-pill">2</span>
        </div>
      </div>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-info-circle text-primary" /> Misc.</h4>
          <span class="badge badge-secondary badge-pill">2</span>
        </div>
      </div>
    </>
  );
}

function previewDataStorage(state) {
  const answers = state.answers["data-storage-policy"];

  const A_NO_STORAGE       = answers.find(x => x.valueCoding.code === "no-storage");
  const A_LOCAL            = answers.find(x => x.valueCoding.code === "Local");
  const A_CLOUD            = answers.find(x => x.valueCoding.code === "Cloud");
  const A_SAME_COUNTRY     = answers.find(x => x.valueCoding.code === "same-country");
  const A_KEPT             = answers.find(x => x.valueCoding.code === "kept");
  const A_ENCRYPTED        = answers.find(x => x.valueCoding.code === "Encrypted");
  const A_DELETED          = answers.find(x => x.valueCoding.code === "deleted");
  const A_RM_ON_DEACTIVATE = answers.find(x => x.valueCoding.code === "removed-when-deactivated");
  
  // Storage locations ---------------------------------------------------------

  let storageLocations = [], storageLocationsLength = 0;

  if (A_LOCAL) {
    storageLocationsLength = storageLocations.push("locally on the patient's device")
  }
  if (A_CLOUD) {
    storageLocationsLength = storageLocations.push("securely in the cloud")
  }
  if (A_SAME_COUNTRY) {
    storageLocationsLength = storageLocations.push("by the developer or a third party at a physical location in the same country as it was obtained")
  }
  if (A_KEPT) {
    storageLocationsLength = storageLocations.push("by the developer for future use after an account closes")
  }

  if (!storageLocations.length) {
    storageLocations.push(A_NO_STORAGE ?
      "No patient health data are stored by the app." :
      "The app is not explicitly stating that it stores health data anywhere"
    )
  }
  else {
    storageLocations = ["Patient health data are stored " + storageLocations.join(", ") + "."]
  }

  // Data retention ------------------------------------------------------------

  const retention = [];
  
  if (A_KEPT) {
    retention.push("Already collected patient data are preserved by the developer for future use after an account closes.")
  }
  if (A_DELETED) {
    retention.push("Stored patient data are deleted upon request.")
  }
  if (A_RM_ON_DEACTIVATE) {
    retention.push("Previously collected patient data are deleted upon account deactivation.")
  }

  // Encrypted -----------------------------------------------------------------

  return (
    <>
      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-database text-primary" /> Data Storage</h4>
          { storageLocationsLength ? <span class="badge badge-secondary badge-pill">{ storageLocationsLength }</span> : null }
        </div>
        { storageLocationsLength ?
          list(storageLocations) :
          <div className="text-secondary">{ list(storageLocations) }</div>
        }
      </div>


      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-history text-primary" /> Data Retention</h4>
          { retention.length ? <span class="badge badge-secondary badge-pill">{ retention.length }</span> : null }
        </div>
        { retention.length ?
          list(retention) :
          <div className="text-secondary">{ list(["The app is not explicitly stating anything about data retention"]) }</div>
        }
      </div>

      <div className="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <h4><i className="fas fa-shield-alt text-primary" /> Data Encryption</h4>
        </div>
        { A_ENCRYPTED ?
          list(["Patient health data are end-to-end encrypted."]) :
          <div className="text-secondary">{ list(["The app is not explicitly stating anything regarding data encryption"]) }</div>
        }
      </div>
    </>
  );
}

function list(items) {
  return items.length ? <ul>{items.map((x, i) => (<li key={i}>{x}</li>))}</ul> : null
}

function preview(state) {
  return (
    // <div className="list-group" style={{ 
    //   // position: "fixed",
    //   // top: 60,
    //   // right: 8,
    //   // bottom: 50,
    //   // maxWidth: 360,
    //   // overflow: "auto",
    //   // zIndex: 2,
    //   fontSize: 14
    // }}>
    <Preview state={state}/>
    // </div>
  )
}

function generateQuestionnaireResponse(state) {
  return {
    resourceType : "QuestionnaireResponse",
    status       : "completed",
    questionnaire: "http://privacy-manifest.smarthealthit.org/questionnaire",
    subject      : "<subject>",
    identifier: {
      value: "<app-resource-identifying-uri>"
    },
    authored: new Date().toISOString(),
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

    case "SHOW_PREVIEW":
      return { ...state, showPreview: true }

    case "HIDE_PREVIEW":
      return { ...state, showPreview: false }

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
    <>
    { state.showPreview && (
        <div className="modal" style={{ display: "block", background: "rgba(0, 0, 0, 0.3)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Preview</h5>
                <button type="button" className="close" onClick={() => dispatch({ type: "HIDE_PREVIEW" }) }>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="alert alert-info">
                  <i className="fas fa-info-circle text-info"/> <small>Upon launching the app the user may be
                  presented with a summary similar to this one. The user might then decide not to launch the
                  app if he/she does not agree with your privacy statements.</small>
                </p>
                <div className="list-group">
                  <Preview state={state}/>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: "HIDE_PREVIEW" }) }>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
          <button
            type="button"
            className="btn btn-info float-right"
            style={{ margin: "-4px 0" }}
            onClick={() => dispatch({ type: "SHOW_PREVIEW" }) }>
            Preview
          </button>
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
                className="btn btn-primary float-right"
                href={"data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generateQuestionnaireResponse(state), null, 2))}
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
    </>
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
