const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js')
require('dotenv').config();

const app = express();

const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology: true })
    .then((result) =>{
        console.log("Connected to db")
        //listen for requests
        app.listen(3001);
    })
    .catch((err) =>{
        console.log(err)
    })


//register view engine
app.set('view engine', 'ejs');


//sending static files into browser
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//routes
app.get('/', (req, res)=>{
    res.redirect('/blogs')
})  



app.get('/about', (req, res)=>{
    res.render('about', {title: 'About'})
}) 

app.get('/blogs', (req, res) =>{
    Blog.find().sort({ createdAt : -1 })
    .then((result) =>{
        res.render('index', { title : 'All blogs', blogs: result })
    })
    .catch((err) =>{
        console.log(err)
    })
})

app.post('/blogs', (req, res) =>{
    const blog = new Blog(req.body)

    blog.save()
        .then((result) =>{
            res.redirect('/blogs')
        })
        .catch((err) =>{
            console.log(err)
        })
})


app.get('/blogs/create', (req, res)=>{
    res.render('create', {title: 'Create'});
}) 


app.get('/blogs/:id', (req, res) =>{
    const id = req.params.id;
    // console.log(id);

    Blog.findById(id)
        .then(result =>{
            res.render('details', { blog: result, title: 'Blog Details'})
        })
        .catch((err) =>{
            console.log(err)
        })
})

app.delete('/blogs/:id', (req, res) =>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
     .then(result =>{
        res.json({ redirect: '/blogs' });
     })
     .catch(err => console.log(err));
})



//404 error
app.use((req, res) =>{
    res.status(404).render('404', {title: 404});
})