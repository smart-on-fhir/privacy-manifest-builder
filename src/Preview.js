// import questionnaire from "./questionnaire.json";

export default function Preview({ state }) {
    return (
        <>
            { dataStorage(state) }
            { dataRetention(state) }
            { dataUsage(state) }
        </>
    )
}

function dataUsage(state) {
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

function dataRetention(state) {
    const answers = state.answers["data-storage-policy"];

    const A_KEPT             = answers.find(x => x.valueCoding.code === "kept");
    const A_DELETED          = answers.find(x => x.valueCoding.code === "deleted");
    const A_RM_ON_DEACTIVATE = answers.find(x => x.valueCoding.code === "removed-when-deactivated");

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

    return (
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
    );
}

function dataStorage(state) {
  const answers = state.answers["data-storage-policy"];

  const A_NO_STORAGE   = answers.find(x => x.valueCoding.code === "no-storage");
  const A_LOCAL        = answers.find(x => x.valueCoding.code === "Local");
  const A_CLOUD        = answers.find(x => x.valueCoding.code === "Cloud");
  const A_SAME_COUNTRY = answers.find(x => x.valueCoding.code === "same-country");
  const A_KEPT         = answers.find(x => x.valueCoding.code === "kept");
  const A_ENCRYPTED    = answers.find(x => x.valueCoding.code === "Encrypted");
  
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