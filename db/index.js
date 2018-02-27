const conn = require('./conn');
const Customer = require('./customer');

const sync = () => {
    return conn.sync({ force: true })
};

const seed = () => {
    return Promise.all([
        Customer.create({ email: 'Brooklyn@NewYork.com'}),
        Customer.create({ email: 'Manhattan@BigApple.com'})
    ])
    .then( () => console.log('### DATA SEEEDED ###'))
};

module.exports = {
    sync, 
    seed,
    models: {
        Customer
    }
}