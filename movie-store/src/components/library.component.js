import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Library extends Component {
    constructor() {
        super();
        this.state = {
            access: "not authorized",

            lib: {
                toWatch: [],
                favourites: [],
                seen: []
            }
        }
    }

    componentDidMount() {
        const headers = {
            'Content-Type': "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        };

        axios.get('http://localhost:5000/library', { headers: headers })
            .then(response => {
                console.log(response);
                this.setState({ access: "authorized", lib: response.data });
            })
            .catch((error) => {
                this.state = {
                    access: "not authorized"
                }
            });
    }

    seenList() {
        console.log(this.state);
        const movieList = this.state.lib.seen.map(currentMovie => {
            return (
                <li>
                    <Link to={"/movie/" + currentMovie.movieID}>{currentMovie.title}</Link>
                </li>
            );//<MovieList movie={currentMovie} deleteMovie={this.deleteMovie}/>;
        })
        if (movieList.length > 0) {
            return movieList
        }
        else {
            return (
               <p>No movies to show</p>
            )
        }
    }
    favouriteList() {
        console.log(this.state.lib.favourites);
        const movieList = this.state.lib.favourites.map(currentMovie => {
            return (
                <li>
                    <Link to={"/movie/" + currentMovie.movieID}>{currentMovie.title}</Link>
                </li>
            );//<MovieList movie={currentMovie} deleteMovie={this.deleteMovie}/>;
        })
        if (movieList.length > 0) {
            return movieList
        }
        else {
            return (
               <p>No movies to show</p>
            )
        }
    }
    towatchList() {
        console.log(this.state);
        const movieList = this.state.lib.toWatch.map(currentMovie => {
            return (
                <li>
                    <Link to={"/movie/" + currentMovie.movieID}>{currentMovie.title}</Link>
                </li>
            );//<MovieList movie={currentMovie} deleteMovie={this.deleteMovie}/>;
        })
        if (movieList.length > 0) {
            return movieList
        }
        else {
            return (
               <p>No movies to show</p>
            )
        }
    }

    libraryView() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        Movies seen
                        {this.seenList()}
                    </div>
                    <div class="col-sm">
                        Favourites movie
                        {this.favouriteList()}
                    </div>
                    <div class="col-sm">
                        Watch movie
                        {this.towatchList()}
                    </div>
                </div>
            </div>
        );
    }


    render() {
        return (
            <>
                <h1>Library</h1>
                <h1>Access: {this.state.access}</h1>
                <div>
                    {this.libraryView()}
                </div>
            </>
        );
    }
}