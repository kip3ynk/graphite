import React, {setGlobal} from 'reactn';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import './styles/App.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configure } from 'radiks';
import { UserSession } from 'blockstack';
import { appConfig } from './utils/config';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

const userSession = new UserSession({ appConfig })
const port = window.location.href.includes('local') ? 'http://localhost:5000' : 'https://whispering-sands-47101.herokuapp.com';

setGlobal({
    userSession,
    organization: {},
    documents: [], 
    contacts: [],
    files: [],
    teams: [],
    person: {
        name() {
          return 'Anonymous';
        },
        avatarUrl() {
          return avatarFallbackImage;
        },
      },
    shareFile: [],
    singleDoc: {},
    filteredDocs: [],
    sharedWith: [],
    tempDocId: "",
    redirect: false,
    loading: true,
    migrationLength: 1,
    migrationCount: 0,
    migrationComplete: false,
    migrateTitle: "",
    migrateContent: "",
    migrateID: "",
    migrateUpdated: "",
    migrateWords: "",
    currentPage: 1,
    docsPerPage: 10,
    docsSelected: [],
    activeIndicator: false,
    receiverID: "",
    confirmAdd: false,
    title: "",
    content: {
    "document": {
        "nodes": [
        {
            "object": "block",
            "type": "paragraph",
            "nodes": [
            {
                "object": "text",
                "leaves": [
                {
                    "text": ""
                }
                ]
            }
            ]
        }
        ]
    }
    },
    id: "",
    words: "",
    updated: "",
    index: "",
    singleDocTags: [],
    tag: "",
    selectedTagId: "",
    deleteState: false,
    sharedCollection: [],
    sharedWithSingle: [],
    tagDownload: false,
    selectedDate: "",
    selectedCollab: "",
    selectedTag: "",
    applyFilterNow: false,
    appliedFilter: false,
    tagIndex: "",
    stealthyConnected: false,
    travelstackConnected: false,
    coinsConnected: false,
    docs: [],
    save: "",
    printPreview: false,
    autoSave: "Saved",
    singlePublic: {},
    gaiaLink: "",
    hideStealthy: true,
    docFlex: "test-doc-card",
    notificationCount: 0,
    commentId: "",
    deleteIndex: "",
    send: false,
    integrations: [],
    userRole: "",
    accountSettings: "",
    teamCount: 0,
    documentId: "",
    userToLoadFrom: "",
    idToLoad: "",
    view: false,
    docLoaded: false,
    lastUpdated: "",
    stealthyKey: "",
    blockusignConnected: false,
    blockusignKey: "",
    coinsKey: "",
    kanstackConnected: false,
    kanstackKey: "",
    noteRiotConnected: false,
    noteRiotKey: "",
    mediumConnected: false,
    mediumIntegrationToken: "",
    mediumPost: {},
    slackConnected: false,
    slackWebhookUrl: "",
    graphitePro: false,
    newTeammateEmail: "",
    newTeammateName: "",
    newTeammateRole: "",
    ownerBlockstackId: "",
    newTeammateId: "",
    accountDetails: {},
    ownerName: "",
    ownerEmail: "",
    lastPaymentDate: "",
    inviterKey: "",
    inviteDate: "",
    inviter: "",
    inviteeEmail: "",
    inviteeBlockstackId: "",
    inviteeName: "",
    inviteeRole: "",
    inviteeId: "",
    inviteeKey: "",
    inviterEmail: "",
    inviteAccepted: "",
    inviteDetails: {},
    teamMateMostRecent: "",
    count: 0,
    audits: [],
    action: "",
    deleteDoc: false,
    settingsMain: "hide",
    settingsOnboarding: "hide",
    loadingBar: "",
    teamDocs: [],
    sharedDocsCount: 0,
    analytics: [],
    fileCreation: false,
    combined: [],
    filesPerPage: 10,
    filesSelected: [],
    file: "",
    name: "",
    lastModifiedDate: "",
    link: "",
    type: "",
    singleFile: {},
    singleFileTags: [],
    uploaded: "",
    typeList: "hide",
    selectedType: "",
    applyFilter: false,
    filteredVault: [],
    currentVaultPage: 1,
    description: "",
    appsUsed: "",
    conversationUser: "",
    img: "",
    page: 1,
    sharedWithMe: true,
    shareFileIndex: [],
    user: "",
    singleDocIsPublic: false,
    readOnly: true,
    filteredContacts: [],
    add: false,
    results: [],
    newContact: "",
    showFirstLink: false,
    types: [],
    manualResults: {},
    contactsPerPage: 10,
    contactsSelected: [],
    rtc: false,
    avatars: [],
    privateKey: "",
    publicKey: "",
    adminAddress: "",
    adminToken: "",
    tokenRefreshDate: "",
    accountInfo: {},
    originalConfig: {},
    invite: {},
    teamShare: false,
    loadingIndicator: false,
    auditThis: false,
    teamDoc: false,
    isTeamDoc: false,
    webhookUrl: "",
    webhookConnected: false,
    gDocs: [],
    filteredGDocs: [],
    token: "",
    compressed: false,
    importAll: false,
    showInstallMessage: false,
    forms: [],
    singleForm: {},
    formContents: [],
    qIndex: 0,
    questionTitle: "",
    optionValue: "",
    options: [],
    required: false,
    deleteLastOption: false,
    publicForm: {},
    fullFile: "",
    spacing: 2,
    emailOK: false,
    profileEmail: "",
    countFilesDone: false,
    displayMessage: false,
    visible: false,
    newSharedDoc: false,
    markdown: false,
    markdownContent: "",
    wordCount: 0,
    createRTC: false,
    wholeFile: {},
    collabContent: "",
    readOnlyContent: "",
    fullContent: "",
    versions: [],
    versionModal: false,
    publicVaultFile: false,
    pubVaultShared: true,
    teamName: "",
    myTimeline: {},
    timelineTitle: {},
    timelineEvents: {},
    timelineTitleMediaUrl: "",
    timelineTitleMediaCaption: "",
    timelineTitleMediaCredit: "",
    timelineTitleTextHeadline: "",
    timelineTitleTextText: "",
    timelineEventMediaUrl: "",
    timelineEventMediaCaption: "",
    timelineEventMediaCredit: "",
    timelineEventStartMonth: "",
    timelineEventStartDay: "",
    timelineEventStartYear: "",
    timelineEventTextHeadline: "",
    timelineEventTextText: "",
    peopleList: [],
    profileFound: false, 
    response: {}, 
    reAuth: false, 
    provider: "",
    shareModalOpen: false, 
    docToShare: {}
})

configure({
    apiServer: port,
    userSession
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
