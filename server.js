// *** SERVER SIDE ****

const express = require('express');
const app = express();
app.use(require('body-parser').json());
app.use(require('method-override')('_method'));
const path = require('path');

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/vendor',express.static(path.join(__dirname, 'client')));

const db = require('./db');
const { Customer } = db.models;

app.use((req, res, next) => {
    res.locals.path = req.url
    next()
});

// sends page
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "./index.html"))
});

// need a route for api that gets all customers
app.get('/api/customers', (req, res, next) => {
    Customer.findAll()
    .then( customers => {
        res.send(customers)
    })
    .catch(next);
});

// add customer
app.post('/api/customers', (req, res, next) => {
    Customer.createFromForm(req.body)
    .then( () => res.redirect('/api/customers'))
    .catch(next)
});

// delete customer
app.delete('/api/customers/:id', (req, res, next) => {
    Customer.findById(req.params.id)
    .then(customer => 
        customer.destroy())
    .then( () => res.redirect('api/customers'))
    .catch(next)
});

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err)
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`*** listening on port ${port} ***`));

db.sync()
    .then( () => db.seed())
