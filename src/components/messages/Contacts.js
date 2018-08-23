import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  isSignInPending,
  loadUserData,
  getFile,
  putFile,
  lookupProfile,
  signUserOut,
  handlePendingSignIn,
} from "blockstack";
import Header from '../Header';
import axios from 'axios';
import update from 'immutability-helper';
import { getMonthDayYear } from '../helpers/getMonthDayYear';

const { getPublicKeyFromPrivate } = require('blockstack');
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      results: [],
      messages: [],
      filteredContacts: [],
      contacts: [],
      showFirstLink: "",
      showSecondLink: "hide",
      redirect: false,
      newContact: "",
      addContact: "",
      confirmAdd: false,
      confirmManualAdd: false,
      add: false,
      loading: "hide",
      show: "",
      newContactImg: "",
      name: "",
      contactsPerPage: 10,
      currentPage: 1,
      activeIndicator: false,
      typeModal: "hide",
      contactsSelected: [],
      type: "",
      singleContactTypes: [],
      selectedTypeId: "",
      deleteState: false,
      loadingTwo: "hide",
      typeDownload: false,
      index: "",
      types: [],
      contact: "",
      dateAdded: "",
      typeIndex: "",
      appliedFilter: false,
      typesList: "hide",
      dateList: "hide",
      selectedType: "",
      selectedDate: "",
      applyFilter: false,
      manualResults: {}
    }
    this.handleaddItem = this.handleaddItem.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
    this.handleNewContact = this.handleNewContact.bind(this);
    this.newContact = this.newContact.bind(this);
    this.filterList = this.filterList.bind(this);
    this.handleManualAdd = this.handleManualAdd.bind(this);
    this.manualAdd = this.manualAdd.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.setTypes = this.setTypes.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.addTypeManual = this.addTypeManual.bind(this);
    this.saveNewTypes = this.saveNewTypes.bind(this);
    this.loadSingleTypes = this.loadSingleTypes.bind(this);
    this.saveFullCollectionTypes = this.saveFullCollectionTypes.bind(this);
    this.loadCollection = this.loadCollection.bind(this);
    this.deleteType = this.deleteType.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.filterNow = this.filterNow.bind(this);
  }

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    window.$('.modal').modal();
    window.$('.button-collapse').sideNav({
      menuWidth: 400, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens
    }
  );
    const publicKey = getPublicKeyFromPrivate(loadUserData().appPrivateKey)
    putFile('key.json', JSON.stringify(publicKey), {encrypt: false})
    .then(() => {
        console.log("Saved!");
        console.log(JSON.stringify(publicKey));
      })
      .catch(e => {
        console.log(e);
      });
      this.loadCollection();
  }

  loadCollection() {
    getFile("contact.json", {decrypt: true})
     .then((fileContents) => {
       if(fileContents) {
         console.log("Contacts are here");
         this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
         this.setState({ filteredContacts: this.state.contacts });
       } else {
         console.log("No contacts");
       }
     })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidUpdate() {
    if(this.state.confirmAdd === true) {
      this.handleaddItem();
    }
    if(this.state.confirmManualAdd === true) {
      this.handleManualAdd();
    }
  }

  newContact() {
    this.setState({add: true});
  }

  handleaddItem() {
    console.log("adding...");
    const object = {};
    object.contact = this.state.addContact + '.id';
    object.img = this.state.newContactImg;
    object.name = this.state.name;
    object.dateAdded = getMonthDayYear();
    object.types = [];
    object.fileType = "contacts";
    let link = 'https://core.blockstack.org/v1/names/' + object.contact;
    axios
      .get(
        link
      )
      .then(res => {
        if(res.data.zonefile.indexOf('https://blockstack.s3.amazonaws.com/') >= 0){
          window.Materialize.toast(object.contact + " is a legacy Blockstack ID and cannot access Graphite.", 3000);
        } else {
          this.setState({ showResults: "hide", loading: "", show: "hide", confirmAdd: false })
          this.setState({ contacts: [...this.state.contacts, object], add: false });
          this.setState({ filteredContacts: this.state.contacts });
          setTimeout(this.saveNewFile, 500);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  saveNewFile() {
    putFile("contact.json", JSON.stringify(this.state), {encrypt: true})
      .then(() => {
        console.log("Saved!");
        this.setState({loading: "hide", show: "" });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  handleNewContact(e) {
    this.setState({ newContact: e.target.value })
    let link = 'https://core.blockstack.org/v1/search?query=';
    axios
      .get(
        link + this.state.newContact
      )
      .then(res => {
        if(res.data.results.length > 0){
          this.setState({ results: res.data.results });
        } else {
          this.setState({ results: [] })
          lookupProfile(this.state.newContact, "https://core.blockstack.org/v1/names")
            .then((profile) => {
              console.log(profile);
              this.setState({ manualResults: profile });
            })
            .catch((error) => {
              console.log('could not resolve profile')
            })
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleManualAdd(e) {
    this.setState({ showResults: "hide", loading: "", show: "hide", confirmManualAdd: false })
    console.log("adding...");
    const object = {};
    object.contact = this.state.addContact;
    object.img = this.state.newContactImg;
    object.name = this.state.name;
    object.dateAdded = getMonthDayYear();
    object.types = [];
    let link = 'https://core.blockstack.org/v1/names/' + object.contact;
    axios
      .get(
        link
      )
      .then(res => {
        if(res.data.zonefile.indexOf('https://blockstack.s3.amazonaws.com/') >= 0){
          window.Materialize.toast(object.contact + " is a legacy Blockstack ID and cannot access Graphite.", 3000);
        } else {
          this.setState({ contacts: [...this.state.contacts, object], add: false });
          this.setState({ filteredContacts: this.state.contacts });
          setTimeout(this.saveNewFile, 500);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  manualAdd() {
    lookupProfile(this.state.newContact, "https://core.blockstack.org/v1/names")
      .then((profile) => {
          console.log(profile);
          const object = {};
          object.contact = this.state.newContact;
          if(profile.image) {
            object.img = profile.image[0].contentUrl;
          } else {
            object.img = avatarFallbackImage;
          }
          if(profile.name) {
            object.name = profile.name;
          } else {
            object.name = "";
          }
          object.types = [];
          object.dateAdded = getMonthDayYear();
          this.setState({ contacts: [...this.state.contacts, object], add: false });
          this.setState({ filteredContacts: this.state.contacts });
          setTimeout(this.saveNewFile, 500);
      })
      .catch((error) => {
        console.log('could not resolve profile')
        window.Materialize.toast("That ID was not found. Please make sure you are typing the full ID.", 3000);
      })

  }

  filterList(event){
    var updatedList = this.state.contacts;
    updatedList = updatedList.filter(function(item){
      return item.contact.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({filteredContacts: updatedList});
  }

  handleCheckbox(event) {
    let checkedArray = this.state.contactsSelected;
      let selectedValue = event.target.value;

        if (event.target.checked === true) {
        	checkedArray.push(selectedValue);
            this.setState({
              contactsSelected: checkedArray
            });
          if(checkedArray.length === 1) {
            this.setState({activeIndicator: true});

          } else {
            this.setState({activeIndicator: false});
          }
        } else {
          this.setState({activeIndicator: false});
        	let valueIndex = checkedArray.indexOf(selectedValue);
			      checkedArray.splice(valueIndex, 1);

            this.setState({
              contactsSelected: checkedArray
            });
            if(checkedArray.length === 1) {
              this.setState({activeIndicator: true});
            } else {
              this.setState({activeIndicator: false});
            }
        }
  }

  setTypes(e) {
    this.setState({ type: e.target.value});
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.setState({ types: [...this.state.types, this.state.type]});
      this.setState({ type: "" });
    }
  }

  addTypeManual(){
    this.setState({ types: [...this.state.types, this.state.type]});
    this.setState({ type: "" });
  }

  loadSingleTypes() {
    window.$('#typeModal').modal('open');
    this.setState({typeDownload: false});
    getFile("contact.json", {decrypt: true})
    .then((fileContents) => {
      this.setState({ contacts: JSON.parse(fileContents || '{}').contacts });
      this.setState({ filteredContacts: this.state.contacts });
    }).then(() =>{
      let contacts = this.state.contacts;
      const thisContact = contacts.find((contact) => { return contact.contact === this.state.contactsSelected[0]});
      let index = thisContact && thisContact.contact;
      function findObjectIndex(contact) {
          return contact.contact === index;
      }
      if(thisContact && thisContact.types) {
        this.setState({index: contacts.findIndex(findObjectIndex), newContactImg: thisContact && thisContact.img, types: thisContact && thisContact.types, name: thisContact && thisContact.name, contact: thisContact && thisContact.contact, dateAdded: thisContact && thisContact.dateAdded });
      } else {
        this.setState({index: contacts.findIndex(findObjectIndex), newContactImg: thisContact && thisContact.img, types: [], name: thisContact && thisContact.name, contact: thisContact && thisContact.contact, dateAdded: thisContact && thisContact.dateAdded });
      }

    })
     .then(() => {
       this.setState({ typeModal: ""});
     })
      .catch(error => {
        console.log(error);
      });
  }

  saveNewTypes() {
    this.setState({ loadingTwo: ""});
    const object = {};
    object.contact = this.state.contact;
    object.name = this.state.name;
    object.dateAdded = this.state.dateAdded;
    object.types = this.state.types;
    object.img = this.state.newContactImg;
    const index = this.state.index;
    const updatedContact = update(this.state.contacts, {$splice: [[index, 1, object]]});
    this.setState({contacts: updatedContact, filteredContacts: updatedContact });
    setTimeout(this.saveFullCollectionTypes, 500);
  }

  saveFullCollectionTypes() {
    window.$('#typeModal').modal('close');
    putFile("contact.json", JSON.stringify(this.state), {encrypt: true})
      .then(() => {
        console.log("Saved");
        this.setState({typeModal: "hide", type: "", loadingTwo: "hide"})
        this.loadCollection();
      })
      .catch(e => {
        console.log("e");
        console.log(e);
      });
  }

  handlePageChange(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  deleteType() {
    console.log("Deleted");
    this.setState({ deleteState: false });

    let types = this.state.types;
    const thisType = types.find((type) => { return type.id === this.state.selectedTypeId});
    let typeIndex = thisType && thisType.id;
    function findObjectIndex(type) {
        return type.id === typeIndex;
    }
    this.setState({ typeIndex: types.findIndex(findObjectIndex) });
    const updatedTypes = update(this.state.types, {$splice: [[this.state.typeIndex, 1]]});
    this.setState({types: updatedTypes });
  }

  applyFilter() {
    this.setState({ applyFilter: false });
    setTimeout(this.filterNow, 500);
    console.log(this.state.selectedType);
  }

  filterNow() {
    let contacts = this.state.contacts;

    if(this.state.selectedType !== "") {
      let typeFilter = contacts.filter(x => typeof x.types !== 'undefined' ? x.types.includes(this.state.selectedType) : console.log("nada"));
      // let typeFilter = contacts.filter(x => x.types.includes(this.state.selectedType));
      this.setState({ filteredContacts: typeFilter, appliedFilter: true});
      window.$('.button-collapse').sideNav('hide');
    } else if (this.state.selectedDate !== "") {
      let dateFilter = contacts.filter(x => typeof x.dateAdded !== 'undefined' ? x.dateAdded.includes(this.state.selectedDate) : console.log("nada"));
      // let dateFilter = contacts.filter(x => x.dateAdded.includes(this.state.selectedDate));
      this.setState({ filteredContacts: dateFilter, appliedFilter: true});
      window.$('.button-collapse').sideNav('hide');
    }
  }


  renderView() {
    this.state.applyFilter === true ? this.applyFilter() : console.log("No filter applied");
    const {manualResults, typesList, dateList, appliedFilter, deleteState, typeDownload, loadingTwo, typeModal, currentPage, contactsPerPage} = this.state;
    let contacts = this.state.filteredContacts;
    let show = this.state.show;
    let showResults = "";
    let loading = this.state.loading;
    let results;
    if(this.state.results !=null) {
      results = this.state.results;
    } else {
      results = [];
    }
    let newContact = this.state.newContact;
    let showFirstLink = this.state.showFirstLink;
    if(newContact.length < 1) {
      showResults = "hide";
    } else {
      showResults = "";
    }
    let types;
    if(this.state.types !== null) {
      types = this.state.types;
    } else {
      types = [];
    }

    // Logic for displaying page numbers
   const pageNumbers = [];
   for (let i = 1; i <= Math.ceil(contacts.length / contactsPerPage); i++) {
     pageNumbers.push(i);
   }

   const renderPageNumbers = pageNumbers.map(number => {
          return (
            <li
              key={number}
              id={number}
              className={number === this.state.currentPage ? "active" : ""}
            >
              <a id={number} onClick={this.handlePageChange}>{number}</a>
            </li>
          );
        });

    typeDownload === true ? this.loadSingleTypes() : console.log("no contact selected");
    deleteState === true ? this.deleteType() : console.log("no delete");
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(0).reverse();
    let searchImg;
    if(manualResults.image) {
      searchImg = manualResults.image[0].contentUrl;
    } else {
      searchImg = avatarFallbackImage;
    }

    let contactTypes = currentContacts.map(a => a.types);
    let mergedTypes = [].concat.apply([], contactTypes);
    let uniqueTypes = [];
    window.$.each(mergedTypes, function(i, el) {
      if(window.$.inArray(el, uniqueTypes) === -1) uniqueTypes.push(el);
    })

    let date = currentContacts.map(a => a.dateAdded);
    let mergedDate = [].concat.apply([], date);
    let uniqueDate = [];
    window.$.each(mergedDate, function(i, el) {
      if(window.$.inArray(el, uniqueDate) === -1) uniqueDate.push(el);
    })

    if(this.state.add === true){
    return (
      <div className="add-contact row">
        <h3 className="center-align">Add a new contact</h3>


        <div className="card-add col s12">
          <div className="add-new">
            <div>
              <p>Search for a contact</p>
              <label>Search</label>
              <input type="text" placeholder="Ex: Johnny Cash" onChange={this.handleNewContact} />
            </div>
            <div className={showResults}>

            <ul className="collection">
            {results.map(result => {
              console.log(results);
              let profile = result.profile;
              let image = profile.image;
              let imageLink;
              if(image !=null) {
                if(image[0]){
                  imageLink = image[0].contentUrl;
                } else {
                  imageLink = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
                }
              } else {
                imageLink = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
              }

                return (
                  <div key={result.username} className={showFirstLink}>
                  <a className="contact-add" onClick={() => this.setState({ addContact: result.username, newContactImg: imageLink, name: result.profile.name, confirmAdd: true })}>
                    <li className="collection-item avatar">
                      <img src={imageLink} alt="avatar" className="circle" />
                      <span className="title">{result.profile.name}</span>
                      <p>{result.username}</p>
                    </li>
                  </a>
                  </div>
                )
              })
            }
            {
              manualResults !== {} ?
              <div key={this.state.newContact} className={showFirstLink}>
              <a className="contact-add" onClick={() => this.setState({ addContact: this.state.newContact, newContactImg: manualResults.img, name: manualResults.name, confirmManualAdd: true })}>
                <li className="collection-item avatar">
                  <img src={searchImg} alt="avatar" className="circle" />
                  <span className="title">{manualResults.name}</span>
                  <p>{this.state.newContact}</p>
                </li>
              </a>
              </div>:
              <div />

            }
            </ul>

            </div>
            <div className={show}>
            </div>
            <div className={loading}>
              <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-green-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div><div className="gap-patch">
                    <div className="circle"></div>
                  </div><div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="docs">

        {/* Add button */}
        <div className="container">
          <div className="fixed-action-btn">
            <a onClick={this.newContact} className="btn-floating btn-large black">
              <i className="large material-icons">add</i>
            </a>
        </div>
        {/* End Add Button */}

        <div className="row">
          <div className="col s12 m6">
            <h5>Contacts ({currentContacts.length})
              {appliedFilter === false ? <span className="filter"><a data-activates="slide-out" className="menu-button-collapse button-collapse">Filter<i className="filter-icon material-icons">arrow_drop_down</i></a></span> : <span className="hide"><a data-activates="slide-out" className="menu-button-collapse button-collapse">Filter<i className="filter-icon material-icons">arrow_drop_down</i></a></span>}
              {appliedFilter === true ? <span className="filter"><a className="card filter-applied" onClick={() => this.setState({ appliedFilter: false, filteredContacts: this.state.contacts})}>Clear</a></span> : <div />}
            </h5>
            {/* Filter Dropdown */}
            <ul id="slide-out" className="comments-side-nav side-nav">
              <h5 className="center-align">Filter</h5>
              <li><a onClick={() => this.setState({typesList: ""})}>Contact Types</a></li>
              {/* Types list */}
                <ul className={typesList}>
                {
                  uniqueTypes.map(type => {
                    return (
                      <li className="filter-li" key={Math.random()}><a onClick={() => this.setState({ selectedType: type, typesList: "hide", applyFilter: true})}>{type}</a></li>
                    )
                  })
                }
                </ul>
              {/* End Tag list */}
              <li><a onClick={() => this.setState({dateList: ""})}>Date Added</a></li>
              {/* Date list */}
                <ul className={dateList}>
                {
                  uniqueDate.map(date => {
                    return (
                      <li className="filter-li" key={Math.random()}><a onClick={() => this.setState({ selectedDate: date, dateList: "hide", applyFilter: true})}>{date}</a></li>
                    )
                  })
                }
                </ul>
              {/* End Date list */}
            </ul>
            {/* End Filter Dropdown */}
          </div>
          <div className="col right s12 m6">
          <form className="searchform">
          <fieldset className=" form-group searchfield">
          <input type="text" className="form-control docform form-control-lg searchinput" placeholder="Search Contacts" onChange={this.filterList}/>
          </fieldset>
          </form>
          </div>
        </div>
        {
          this.state.activeIndicator === true ?
            <ul className="pagination action-items">
              <li><a onClick={() => this.setState({typeDownload: true})}>Contact Type</a></li>
            </ul>
         :
            <ul className="pagination inactive action-items">
              <li><a>Contact Type</a></li>
            </ul>

        }
          <div className="">
            <table className="bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date Added</th>
                  <th>Contact Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
            {
              currentContacts.slice(indexOfFirstContact, indexOfLastContact).map(contact => {
                var types;
                if(contact.types) {
                  types = Array.prototype.slice.call(contact.types);
                } else {
                  types = "";
                }

              return(
                <tr key={contact.contact}>
                  <td><input type="checkbox" checked={this.state.checked} value={contact.contact} id={contact.contact} onChange={this.handleCheckbox} /><label htmlFor={contact.contact}></label></td>
                  <td><img src={contact.img || avatarFallbackImage} className="profile-grid-img circle" alt="img" />
                    <Link className="profile-name-link" to={'/contacts/profile/'+ contact.contact}>
                      {contact.contact.length > 30 ? contact.contact.substring(0,30)+"..." :  contact.contact}
                    </Link>
                  </td>
                  <td>{contact.name || ""}</td>
                  <td>{contact.dateAdded}</td>
                  <td>{types === "" ? types : types.join(', ')}</td>
                  <td><Link to={'/contacts/delete/'+ contact.contact}><i className="modal-trigger material-icons red-text delete-button">delete</i></Link></td>
                </tr>
              );
              })
            }
            </tbody>
          </table>
          <div>
            <ul className="center-align pagination">
            {renderPageNumbers}
            </ul>
            <div className="docs-per-page right-align">
              <label>Contacts per page</label>
              <select value={this.state.docsPerPage} onChange={(event) => this.setState({ docsPerPage: event.target.value})}>
                <option value={10}>
                10
                </option>
                <option value={20}>
                20
                </option>
                <option value={50}>
                50
                </option>
              </select>
            </div>
          </div>
        </div>
        {/* Type Modal */}
          <div className={typeModal}>
            <div id="typeModal" className="project-page-modal modal">
              <div className="modal-content">
                <a onClick={() => this.setState({type: "", typeModal: "hide"})} className="btn-floating modalClose grey"><i className="material-icons">close</i></a>

                  <h4>Contact Types</h4>
                  <p>Add a new contact type or remove an existing contact type.</p>
                  <div className="row">
                    <div className="col s9">
                      <input type="text" value={this.state.type} onChange={this.setTypes} onKeyPress={this.handleKeyPress} />
                    </div>
                    <div className="col s3">
                      <a onClick={this.addTypeManual}><i className="material-icons">check</i></a>
                    </div>
                  </div>
                  <div>
                  {types.slice(0).reverse().map(type => {
                      return (
                        <div key={type} className="chip">
                          {type}<a onClick={() => this.setState({selectedTypeId: type, deleteState: true})}><i className="close material-icons">close</i></a>
                        </div>
                      )
                    })
                  }
                  </div>
                  <div>
                    <button onClick={this.saveNewTypes} className="btn">Save</button>
                  </div>
              </div>
              {/*loading */}
              <div className={loadingTwo}>
                <div className="center">
                  <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-green-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*end loading */}
            </div>
          </div>
        {/* End type Modal */}
            </div>
          </div>

      </div>
    );
  }
  }

  render(){
    return(
      <div>
        <Header />
        {this.renderView()}
      </div>
    )
  }
}
