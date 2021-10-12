// import questionnaire from "./questionnaire.json";

export default function Preview({ state }) {
    return (
        <>
            <DataStorage    state={ state } />
            <DataEncryption state={ state } />
            <DataRetention  state={ state } />
            <DataUsage      state={ state } />
            <DataSharing    state={ state } />
            <DataSelling    state={ state } />
            <DataAccess     state={ state } />
            <Miscellaneous  state={ state } />
        </>
    )
}

function ListGroupItem({ items, icon, title, count = 0 })
{
  if (!items.length) {
    return null
  }
  return (
    <div className="list-group-item list-group-item-action flex-column align-items-start">
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h4><i className={ icon } /> { title }</h4>
        { count ?
          <span className="badge badge-secondary badge-pill">{ count }</span> :
          null }
      </div>
      {list(items)}
    </div>
  );
}

function DataStorage({ state })
{
  const answers = state.answers["data-storage-policy"];

  const A_NO_STORAGE   = answers.find(x => x.valueCoding.code === "no-storage");
  const A_LOCAL        = answers.find(x => x.valueCoding.code === "Local");
  const A_CLOUD        = answers.find(x => x.valueCoding.code === "Cloud");
  const A_SAME_COUNTRY = answers.find(x => x.valueCoding.code === "same-country");
  const A_KEPT         = answers.find(x => x.valueCoding.code === "kept");

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

  return <ListGroupItem
    title="Data Storage"
    icon={ "fas fa-database " +  (storageLocationsLength ? "text-danger" : "text-success") }
    items={storageLocations}
    // count={ storageLocationsLength }
  />
}

function DataEncryption({ state })
{
  const A_ENCRYPTED = state.answers["data-storage-policy"].find(x => x.valueCoding.code === "Encrypted");

  return <ListGroupItem
    title="Data Encryption"
    icon={ "fas fa-shield-alt " + (A_ENCRYPTED ? "text-success" : "text-danger") }
    items={
      A_ENCRYPTED ?
        ["Patient health data are end-to-end encrypted."] :
        ["The app is not explicitly stating anything regarding data encryption"]
    }
  />
}

function DataRetention({ state }) {
  const answers = state.answers["data-storage-policy"];

  const A_KEPT             = answers.find(x => x.valueCoding.code === "kept");
  const A_DELETED          = answers.find(x => x.valueCoding.code === "deleted");
  const A_RM_ON_DEACTIVATE = answers.find(x => x.valueCoding.code === "removed-when-deactivated");

  const retention = [];

  let colorClass = "text-success"

  if (A_DELETED) {
    retention.push("Stored patient data are deleted upon request.")
    colorClass = "text-info"
  }
  if (A_RM_ON_DEACTIVATE) {
    retention.push("Previously collected patient data are deleted upon account deactivation.")
    colorClass = "text-info"
  }
  if (A_KEPT) {
      retention.push("Already collected patient data are preserved by the developer for future use after an account closes.")
      colorClass = "text-danger"
  }

  return <ListGroupItem
    title="Data Retention"
    icon={ "fas fa-history " + colorClass }
    items={
      retention.length ? retention : ["The app is not explicitly stating anything about data retention"]}
    // count={ retention.length }
  />
}

function DataUsage({ state })
{
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

  let colorClass = "text-success"

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
    colorClass = "text-danger"
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
      <ListGroupItem items={txt} title="Data Usage" icon={ "fas fa-tools " + colorClass } />
    </>
  );
}

function DataSharing({ state })
{
  const answers = state.answers["data-sharing-policy"]

  const A_NO_SHARING   = answers.find(x => x.valueCoding.code === "no-sharing");
  const A_DEIDENTIFIED = answers.find(x => x.valueCoding.code === "deidentified");
  const A_FULL_SHARING = answers.find(x => x.valueCoding.code === "full-sharing");
  const A_ONLY_HIPAA   = answers.find(x => x.valueCoding.code === "only-to-hipaa-organizations");
  const A_ONE_TIME     = answers.find(x => x.valueCoding.code === "one-time");
  const A_CONTINUOUS   = answers.find(x => x.valueCoding.code === "continuous");
  const A_OPT_OUT      = answers.find(x => x.valueCoding.code === "opt-out-of-transfer");

  const txt = []

  let colorClass = "text-success"

  if (A_NO_SHARING) {
    txt.push("Patient data are not shared by the app as primary or secondary use.")
  }
  else {
    colorClass = "text-info"
    if (A_DEIDENTIFIED) {
      txt.push("Identifying information are removed from patient data, which are later shared with partners.")
    }
    if (A_ONLY_HIPAA) {
      txt.push("Patient data are shared ONLY with HIPAA business associates as part of care.")
    }
    if (A_OPT_OUT) {
      txt.push("In the event of transfer of ownership or sale of company, the developer allows patients the option to deny transfer of data to the new company.")
    }
    if (A_ONE_TIME) {
      txt.push("Patient data are only collected and shared for an initial period of time as described in the full privacy policy. Collection and sharing outside that window require additional consent.")
      colorClass = "text-danger"
    }
    if (A_FULL_SHARING) {
      txt.push("Collected patient data are fully shared with business partners.")
      colorClass = "text-danger"
    }
    if (A_CONTINUOUS) {
      txt.push("Once permission is obtained, patient data are collected and shared continuously as needed until permission is revoked by the patient.")
      colorClass = "text-danger"
    }
  }

  return <ListGroupItem items={txt} title="Data Sharing" icon={ "fas fa-share-square " + colorClass } />
}

function DataSelling({ state })
{
  const answers = state.answers["data-selling-policy"];

  const A_NO_SELLING      = answers.find(x => x.valueCoding.code === "no-selling");
  const A_IDENTIFIED      = answers.find(x => x.valueCoding.code === "identified");
  const A_DEIDENTIFIED    = answers.find(x => x.valueCoding.code === "deidentified");
  const A_WITH_CONSENT    = answers.find(x => x.valueCoding.code === "with-consent");
  const A_IMPLIED_CONSENT = answers.find(x => x.valueCoding.code === "implied-consent");
  const A_ADVERTIZING     = answers.find(x => x.valueCoding.code === "advertising");

  const txt = []

  let colorClass = "text-success"

  if (A_NO_SELLING) {
    txt.push("Patient data are never sold by the developer in any form.")
  }
  else {
    colorClass = "text-info"
    if (A_DEIDENTIFIED) {
      txt.push("Identifying information are removed from patient data, which are later sold to partners.")
    }
    if (A_WITH_CONSENT) {
      txt.push("Patients must opt in for the developer to sell their data.")
    }
    if (A_IDENTIFIED) {
      txt.push("Patient data are sold to some or all of the following: data brokers, marketing firms, advertising firms, or analytics firms.")
      colorClass = "text-danger"
    }
    if (A_IMPLIED_CONSENT) {
      txt.push("Patients may opt out from the developer selling their data.")
      colorClass = "text-danger"
    }
    if (A_ADVERTIZING) {
      txt.push("Some data obtained by the app are used for consumer marketing or advertising.")
      colorClass = "text-danger"
    }
  }

  return <ListGroupItem items={txt}  title="Data Selling" icon={ "fas fa-file-invoice-dollar " + colorClass } />
}

function DataAccess({ state })
{
  const answers = state.answers["patient-access-policy"];

  const A_MANAGED       = answers.find(x => x.valueCoding.code === "managed");
  const A_PATIENT_READ  = answers.find(x => x.valueCoding.code === "patient-read");
  const A_PATIENT_WRITE = answers.find(x => x.valueCoding.code === "patient-write");

  const txt = []

  if (A_MANAGED) {
    txt.push("This app does not help patients view or mark up data collected on them.")
  }
  if (A_PATIENT_READ) {
    txt.push("This app allows Patients to request to view all data the developer collects.")
  }
  if (A_PATIENT_WRITE) {
    txt.push("Patient can add comments and/or corrections to data collected on them, and corrected/annotated data are sent to partners where applicable.")
  }

  return <ListGroupItem items={ txt }  title="Data Access" icon="fas fa-universal-access text-info" />
}

function Miscellaneous({ state })
{
  const A_CARIN             = state.answers["compliance-certs"].find(x => x.valueCoding.code === "carin-alliance");
  const A_POLICY_ONLY       = state.answers["patient-updates" ].find(x => x.valueCoding.code === "policy-only"   );
  const A_POLICY_EMAIL      = state.answers["patient-updates" ].find(x => x.valueCoding.code === "email"         );
  const A_POLICY_HEALTH_SYS = state.answers["patient-updates" ].find(x => x.valueCoding.code === "health-system" );

  const A_POLICY_URI = state.answers["privacy-policy-uri"][0]?.valueUri

  const txt = []

  console.log(state.answers)

  if (A_CARIN) {
    txt.push('This app upholds the <a href="https://www.carinalliance.com/wp-content/uploads/2020/07/2020_CARIN_Code_of_Conduct_May-2020.pdf" target="_blank">CARIN alliance Code of Conduct</a>.')
  }

  if (A_POLICY_ONLY && A_POLICY_URI) {
    txt.push(`Updated policies may be found at <a href="${A_POLICY_URI}" target="_blank">${A_POLICY_URI}</a>.`)
  }

  if (A_POLICY_EMAIL) {
    txt.push("Patients can opt in to receiving updates to this app's privacy policy by email.")
  }

  if (A_POLICY_HEALTH_SYS) {
    txt.push("Linked health systems are notified of any updates to this app's privacy policies or potential breaches.")
  }

  return <ListGroupItem items={txt}  title="Miscellaneous" icon="fas fa-info-circle text-info" />
}

function list(items) {
  return items.length ? <ul>{items.map((x, i) => (<li key={i} dangerouslySetInnerHTML={{ __html: x }}/>))}</ul> : null
}
