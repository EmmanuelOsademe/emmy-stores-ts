import {faker} from "@faker-js/faker";
import fs from 'fs';
import {singleProductInterface} from "@/resources/product/product.interface";

const createRandomProduct = (): singleProductInterface => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        currentStock: faker.helpers.arrayElement([0, 20, 50, 100]),
        color: faker.helpers.arrayElements(['cyan', 'blue', 'red', 'orange', 'white', 'grey', 'magenta']),
        image: faker.image.business(640, 480, true),
        category: faker.helpers.arrayElement(['general', 'electronics', 'fashion', 'home & office', 'computing', 'kitchen']),
        company: faker.helpers.arrayElement(['marcos', 'argos', 'emmy-special']),
        featured: faker.datatype.boolean(),
        freeShipping: faker.datatype.boolean()
    }
}

const products: singleProductInterface[] = [];

Array.from({length: 30}).forEach(() => {
    products.push(createRandomProduct());
})

fs.writeFile("@data/product.json", JSON.stringify(products), (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Dummy products successfully created");
    }
})