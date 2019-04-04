// NOTE: views folder is the default dir that express uses for your templates
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // kapag naka up na yung app naten sa server, yung port ng server ang gagamitin, pero kapag hindi. yung local naten.
const app = express();

hbs.registerPartials(__dirname + '/views/partials'); // register our partial files like footer, header, etc... so we cna use it in view {{> header}}
app.set('view engine', 'hbs'); // set() is used to set some various express related configuration set('key', 'value')

// creating our custom middleware. middlewares will fire for every request
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) throw err;
    });
    next(); // if not called, the handlers on next request will not gonna fire, so always call next on every middleware
});

// maintenance mode
// app.use((req, res, next) => {
//     res.render('maintenance.hbs'); // so pwede dn ako mag render sa middleware
// });

// so cinall ko tong express.static after ng maintenance mw naten, kase kapag nag register na to, hindi na magiging private yung mga files sa public naten,
// kahit na naka maintenance mode tayo. kase nag rurun na si express sa static
app.use(express.static(__dirname + '/public')); // we are using middleware of express called static (we can visit help.html using localhost:3000/help.html)

// helpers is like a global functions that we can use inside hbs views
// takes 2 argument, 1 name of helper 2 function to run.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello world!</h1>');
    res.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Hello express.js'
    });
});

app.get('/about', (req, res) => {
    // will auto read the view folder and will find about.hbs
    res.render('about.hbs', {
        pageTitle: 'About page'
    }); 
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

// second parameter of listen is a function we want to run when the server is ready to go
app.listen(port, () => {
    console.log('server is up on port ' + port);
});