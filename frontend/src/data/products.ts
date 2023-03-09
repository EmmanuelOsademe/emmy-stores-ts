import {faker} from '@faker-js/faker';
import {IProduct} from "../interface/product";

const createRandomProducts = (): IProduct => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        color: faker.helpers.arrayElements(['cyan', 'blue', 'red', 'orange', 'white', 'grey', 'magenta']),
        image: faker.image.business(640, 480, true),
        category: faker.helpers.arrayElement(['general', 'electronics', 'fashion', 'home & office', 'computing', 'kitchen']),
        company: faker.helpers.arrayElement(['marcos', 'argos', 'emmy-special']),
        featured: faker.datatype.boolean(),
        freeShipping: faker.datatype.boolean()
    }
}

const products: IProduct[] = [];

Array.from({length: 30}).forEach(() => {
    products.push(createRandomProducts());
})
console.log(products);

export default products;