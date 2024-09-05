const prompt = require('prompt-sync')();
const mongoose = require('mongoose');
//const username = prompt('What is your name? ');
const dotenv = require('dotenv');
dotenv.config();

//console.log(`Your name is ${username}`);


//connect to mongodb
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Welcome to the CRM');
        await main(); 
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit();
      }
};


const displayMenu = () => {
    console.log(`
      What would you like to do?

        1. Create Customer
        2. View Customers
        3. Update Customer
        4. Delete Customer
        5. Quit
    `);
  };


const Customer = require('./model/customer');

const main = async () => {
    let exit = false;

    while (!exit) {
        displayMenu();
        const choice = prompt('Number of action to run: ');

        switch (choice) {
        case '1':
            await createCustomer();
            break;
        case '2':
            await viewCustomers();
            break;
        case '3':
            await updateCustomer();
            break;
        case '4':
            await deleteCustomer();
            break;
        case '5':
            exit = true;
            console.log('Goodbye!');
            break;
        default:
            console.log('Invalid choice, please try again.');
        }
    }
};

connect();

//-------------------------------------------functions----------------------------------------------

const createCustomer = async () => {
    const name = prompt('Enter customer name: ');
    const age = prompt('Enter customer age: ');

    const customer = new Customer({ name, age });
    await customer.save();
    console.log('Customer created successfully');
}

const viewCustomers = async () => {
    const customers = await Customer.find();
    console.log('Customers:');
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
};


const updateCustomer = async () => {
    const customers = await Customer.find();
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
  
    const id = prompt('Enter the ID of the customer to update: ');
    const customer = await Customer.findById(id);
  
    if (customer) {
      const newName = prompt('Enter new name: ');
      const newAge = prompt('Enter new age: ');
  
      customer.name = newName || customer.name;
      customer.age = newAge || customer.age;
      await customer.save();
  
      console.log('Customer updated successfully!');
    } else {
      console.log('Customer not found.');
    }
};
  

const deleteCustomer = async () => {
    const customers = await Customer.find();
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
  
    const id = prompt('Enter the ID of the customer to delete: ');
    const customer = await Customer.findById(id);
  
    if (customer) {
      await customer.deleteOne();
      console.log('Customer deleted successfully!');
    } else {
      console.log('Customer not found.');
    }
};
  