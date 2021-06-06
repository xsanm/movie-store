import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Filter from './filter.component'

const MovieListHTML = props => (
    <div className="row border align-items-center">
        <div className="col-3">
            <img src={props.movie.cover} width="150" height="200" alt="Cover"></img>
        </div>
        <div className="col-6">
            <h1><Link to={"/movie/" + props.movie._id} className="text-decoration-none text-dark">{props.movie.title}</Link></h1>
            <p>Release year: <span style={{ fontWeight: 'bold' }}>{props.movie.date.substring(0, 4)}</span></p>
        </div>
        <div className="col-3 text-right">
            <h2>{'\u2605'}Rate: {props.movie.rate.amount ? (props.movie.rate.sum / props.movie.rate.amount).toFixed(2) : "None"}</h2>
            <p>{props.movie.rate.amount} ratings</p>
            {
                props.isLogged &&
                <>
                    <a className="btn btn-secondary" href="#" onClick={() => { props.changeToWatch(props.movie._id, props.movie.title) }}>ToWatch</a>
                    <a className="btn btn-secondary" href="#" onClick={() => { props.changeToFavourites(props.movie._id, props.movie.title) }}>ToFav</a>
                    <a className="btn btn-secondary" href="#" onClick={() => { props.changeToSeen(props.movie._id, props.movie.title) }}>ToSeen</a>
                </>
            }
        </div>
    </div>
)

export default class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = { movies: [], filter: {}, isLogged: false};
        this.setFilter = this.setFilter.bind(this);
        this.deleteMovie = this.deleteMovie.bind(this);
        this.addToWatch = this.addToWatch.bind(this)
        this.addToFavourites = this.addToFavourites.bind(this)
        this.addToSeen = this.addToSeen.bind(this)
        this.changeToWatch = this.changeToWatch.bind(this)
        this.changeToFavourites = this.changeToFavourites.bind(this)
        this.changeToSeen = this.changeToSeen.bind(this)
    }

    componentDidMount() {
        axios.get('http://localhost:5000/movie')
            .then(response => {
                this.setState({ movies: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
        this.userStateChanged()
    }

    componentDidUpdate() {
        //console.log("UPDATED");

    }

    userStateChanged() {
        if (localStorage.getItem("authToken")) {
            axios.get('http://localhost:5000/users/username', {
                headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
            }
            ).then(res => {
                this.setState({
                    isLogged: res.data.success,
                });
            })
        }
    }


    deleteMovie(id) {
        axios.delete('http://localhost:5000/movie/id/' + id)
            .then()//res => console.log(res.data));
        this.setState({
            movies: this.state.movies.filter(el => el._id !== id)
        })
    }


    changeToWatch(id, title) {
        axios.post('http://localhost:5000/libmodifying/towatch/checkstate', { movieID: id }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            if (res.data.found) {
                this.rmvToWatch(id, title)
            }
            else{
                this.addToWatch(id, title)
            }
        })
    }

    addToWatch(id, title) {
        axios.post('http://localhost:5000/libmodifying/towatch/add', { movieID: id, title: title }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            console.log(res)
        })
    }

    rmvToWatch(id, title){
        axios.post('http://localhost:5000/libmodifying/towatch/rmv', { movieID: id, title: title }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            console.log(res)
        })
    }

    changeToFavourites(id, title) {
        axios.post('http://localhost:5000/libmodifying/favourites/checkstate', { movieID: id }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            if (res.data.found) {
                this.rmvToFavourites(id, title)
            }
            else{
                this.addToFavourites(id, title)
            }
        })
    }

    addToFavourites(id, title) {
            axios.post('http://localhost:5000/libmodifying/favourites/add', { movieID: id, title: title }, {
                headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
            }
            ).then(res => {
                //console.log(res)
            })
    }

    rmvToFavourites(id, title){
        axios.post('http://localhost:5000/libmodifying/favourites/rmv', { movieID: id, title: title }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            console.log(res)
        })
    }

    changeToSeen(id, title) {
        axios.post('http://localhost:5000/libmodifying/seen/checkstate', { movieID: id }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            if (res.data.found) {
                this.rmvToSeen(id, title)
            }
            else{
                this.addToSeen(id, title)
            }
        })
    }

    addToSeen(id, title) {
        if (localStorage.getItem("authToken")) {
            axios.post('http://localhost:5000/libmodifying/seen/add', { movieID: id, title: title }, {
                headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
            }
            ).then(res => {
                console.log(res)
            })
        }
    }

    rmvToSeen(id, title){
        axios.post('http://localhost:5000/libmodifying/seen/rmv', { movieID: id, title: title }, {
            headers: { 'authorization': 'Bearer ' + localStorage.getItem("authToken") }
        }
        ).then(res => {
            console.log(res)
        })
    }




    movieList() {

        const movieList = this.state.movies.map(currentMovie => {
            return <MovieListHTML movie={currentMovie} deleteMovie={this.deleteMovie} changeToWatch={this.changeToWatch}
                changeToFavourites={this.changeToFavourites} changeToSeen={this.changeToSeen} isLogged={this.state.isLogged} />;
        })
        if (movieList.length > 0) {
            return movieList
        }
        else {
            return (
                <>
                    <h1>No movies to show</h1>
                </>
            )
        }
    }

    setFilter(arg) {
        //console.log(arg)
        this.setState({ filter: arg }, () => {
            axios.post('http://localhost:5000/movie/filtered', { params: this.state.filter })
                .then(response => {

                    this.setState({ movies: response.data })

                })
                .catch((error) => {
                    console.log(error);
                })
        });
    }


    render() {
        return (
            <>
                <Filter setParentFilter={this.setFilter}></Filter>
                <div className="container">
                    <h3>Movies </h3>
                    <div>
                        {this.movieList()}
                    </div>
                </div>
            </>
        )
    }
}