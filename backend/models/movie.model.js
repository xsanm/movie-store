const mongoose = require('mongoose');
const Schema = mongoose.Schema

const movieSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'title is required']
    },
    genre: {
        type: [String],
        validate: {
            validator: function (v) {
                v = v.map((g) => g.toLowerCase());
                return (new Set(v)).size === v.length;
            },
            message: props => `${props.value} duplicated movie genres!`
        },
        required: true
    },

    date: {
        type: String,
        required: true

    },
    runtime: {
        type: Number,
        required: true,
        min: 1
    },
    plot: {
        type: String,
        default: "To be added"
    },
    rate: {
        sum: {
            type: Number,
            required: true,
            min: 0
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    directors: [{
        _id: false,
        directorID: {
            type: String
        },
        directorName: {
            type: String,
            default: "Anonymous director"
        }
    }],
    writers: [{
        _id: false,
        writerID: {

            type: String
        },
        writerName: {
            type: String,
            default: "Anonymous writer"
        }
    }],
    actors: [{
        _id: false,
        actorID: {
            type: String
        },
        actorName: {
            type: String,
            default: "Anonymous actor"
        }
    }],

    cover: {
        type: String,
        default: "https://d5ip5p2ldkpmf.cloudfront.net/cinema/DB_Photos/default/Movies/movies.jpg"
    },

    platforms: [{
        _id: false,
        name: {
            type: String,
            required: true
        },
        URL: {
            type: String,
            required: true
        }
    }],

    adult: {
        type: Boolean
    },

    budget: {
        type: Number,
        default: 0
    },

    revenue: {
        type: Number,
        dafult: 0
    },

    homepage: {
        type: String,
        default: "#"
    }

}, {
    timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;