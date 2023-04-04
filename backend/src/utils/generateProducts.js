const {faker} = require("@faker-js/faker");
const fs = require('fs');
//const {singleProductInterface} = require("@/resources/product/product.interface");

const createRandomProduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        discountRate: faker.helpers.arrayElement([0, 2, 5, 10]),
        currentStock: faker.helpers.arrayElement([0, 20, 50, 100]),
        triggerQuantity: faker.helpers.arrayElement([2, 5, 8, 10]),
        color: faker.helpers.arrayElements(['cyan', 'blue', 'red', 'orange', 'white', 'grey', 'magenta']),
        image: faker.image.business(640, 480, true),
        category: faker.helpers.arrayElement(['general', 'electronics', 'fashion', 'home & office', 'computing', 'kitchen']),
        company: faker.helpers.arrayElement(['marcos', 'argos', 'emmy-special']),
        featured: faker.datatype.boolean(),
        freeShipping: faker.datatype.boolean(),
        averageRating: faker.helpers.arrayElement([1, 2, 3, 4, 5])
    }
}

const products = [];

Array.from({length: 100}).forEach(() => {
    products.push(createRandomProduct());
})

fs.writeFile("./src/data/products.json", JSON.stringify(products), (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Dummy products successfully created");
    }
})