import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    notes: [],
    loader: true,
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.getNotes();
  }

  postNotes = async (post) => {
    this.setState({
      loader: true,
    });

    // fetch('https://my-first-project-dbbb1.firebaseio.com/notes.json', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "applicatopn/json",
    //   },
    //   body: JSON.stringify({name: "TEST"})
    // }).then(res => res.json()).then(console.log)

    try {
      const data = await axios.post(
        "https://my-first-project-dbbb1.firebaseio.com/notes.json",
        post
      );
      console.log(data);
      await this.getNotes();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loader: false,
      });
    }
  };

  getNotes = async () => {
    this.setState({
      loader: true,
    });

    try {
      const data = await axios.get(
        "https://my-first-project-dbbb1.firebaseio.com/notes.json"
      );
      console.log(data);

      let transformResponse = data.data
        ? Object.keys(data.data).map((key) => ({
            ...data.data[key],
            id: key,
          }))
        : [];

      this.setState({
        notes: transformResponse,
      });
      // console.log(transformResponse);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loader: false,
      });
    }
  };

  deleteNote = async (id) => {
    this.setState({
      loader: true,
    });
    try {
      await axios.delete(
        `https://my-first-project-dbbb1.firebaseio.com/notes/${id}.json`
      );
      await this.getNotes();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loader: false,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const post = {};
    formData.forEach((value, name) => (post[name] = value));
    console.log(post);
    this.postNotes(post);
  };

  render() {
    // console.log("render");
    const { notes, loader } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <input
            placeholder="enter your notes..."
            name="title"
            type="text"
          ></input>
          <input type="date" name="date"></input>
          <button type="submit">SEND</button>
          <button onClick={this.postNotes}>POST</button>
        </form>
        {loader && <h2>Loading...</h2>}
        <ul>
          {" "}
          {notes.map((note) => (
            <li key={note.id}>
              <h2>{note.title}</h2>
              <button onClick={() => this.deleteNote(note.id)}>DELETE</button>
            </li>
          ))}{" "}
        </ul>
      </>
    );
  }
}

export default App;
