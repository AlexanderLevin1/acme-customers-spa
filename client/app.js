// *** CLIENT SIDE ****

// select the elements on the DOM
const createButton = document.getElementById('createButton');
const emailInput = document.getElementById('email');
const customerList = document.getElementById('customerList');
const message = document.getElementById('message');


// Create Customer item in list
// append list item to customerList then append removeBtn to list item
const createCustomer = (customer) => {
    emailInput.value = 'New customer email'

    const newCustomer = document.createElement('li')
    newCustomer.style = 'margin: 20px 0px'
    newCustomer.className = 'list-group-item'
    newCustomer.innerText = customer.email

    // create remove button
    const removeBtn = document.createElement('removeButton')
    removeBtn.className = 'btn btn-danger pull-right'
    removeBtn.style = 'margin: 10px 0px'
    removeBtn.innerText = 'Remove'
    // add event listener to remove button
    removeBtn.addEventListener('click', () => {
        deleteCustomer(customer)
        newCustomer.remove()
    })

    customerList.appendChild(newCustomer)
    newCustomer.appendChild(removeBtn)
};

// fetch and create the list of all customers
fetch('/api/customers')
    .then(response => errorCheck(response))
    .then(response => response.json())
    .then(data => data.forEach(customer => createCustomer(customer)))
    .catch(error => console.log('** error when fetching customer **', error))

createButton.addEventListener('click', () => {
    // want to be able to add a message
    // create DOM element
    const newMessage = document.createElement('h3');
    // append DOM element
    message.appendChild(newMessage);
    fetch('/api/customers', {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify({ email: emailInput.value })
    })
        .then(response => errorCheck(response))
        .then(response => response.json())
        .then(customer => createCustomer(customer))
        .then(() => newMessage.innerText = '** You added a customer! **')
        .catch(error => console.log('**** error when posting new customer ***', error))
})

// Methods

// delete customer
const deleteCustomer = (customer) => {
    fetch(`/api/customers/${customer.id}`, {
        method: 'delete',
        body: JSON.stringify({ id: `${customer.id}` })
    })
};

// check if there was an error
const errorCheck = (response) => {
    if (!response.ok) console.log('error check', response)
    return response
}
