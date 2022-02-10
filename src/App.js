import React, { Component } from "react";
import Header from "./Header.js";
import NotesList from "./NotesList.js";

class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true
      }
    ],
    searchText: ""
  };
  
  addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true
    };
    const newNotes = [newNote, ...this.state.notes];
    this.setState({ notes: newNotes });
  };
  
  onType = (editMeId, updatedKey, updatedValue) => {
    /* this event handler updates sticky note text fields
      - editMeId: the id of the note storing user input
      - updatedKey: between 'title' vs 'description', which field was edited?
      - updatedValue: new value of edited field */
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== editMeId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });
    //const updatedNotes = this.state.notes.map(updateIdMatch);
    this.setState({ notes: updatedNotes });
  };
  
  onSearch = (text) => {
    /* toggle the doesMatchSearch boolean value of sticky note when user types in search field. 
    doesMatchSearch value set to true if its title or description matches the search string */
    const newSearchText = text.toLowerCase();
    const updatedNotes = this.state.notes.map((note) => {
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
      }
    });
    this.setState({
      searchText: newSearchText,
      notes: updatedNotes
    });
  };
  
  removeNote = (deleteMeId) => {
    /* remove note by id of note user clicked on */
    const notIdMatch = (note) => note.id !== deleteMeId;
    const updatedNotes = this.state.notes.filter(notIdMatch);
    this.setState({ notes: updatedNotes });
  };
  
  componentDidMount() { 
    /* after first time rendering, read saved notes data from local storage 
    and pass that data to compontent state if it exists */
    const savedNotesString = localStorage.getItem("savedNotes");
    if (savedNotesString) {
      const savedNotes = JSON.parse(savedNotesString);
      this.setState({ notes: savedNotes });
    }
  }
  
  componentDidUpdate() {
    /* saves notes data to local storage after each render */
    const savedNotesString = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", savedNotesString);
  }

  render() {
    return (
      <div>
        <Header
          searchText={this.state.searchText}
          addNote={this.addNote}
          onSearch={this.onSearch}
        />
        <NotesList
          notes={this.state.notes}
          onType={this.onType}
          removeNote={this.removeNote}
        />
      </div>
    );
  }
}

export default App;
