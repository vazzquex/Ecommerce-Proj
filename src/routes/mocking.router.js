import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { isAuth, isGuest } from '../middleware/auth.middleware.js';

const mockingRouters = Router();

// Función para generar los productos ficticios
const generateProducts = (limit, page, sort, query) => {
    let numOfProducts = faker.string.numeric({ min: 10, max: 50 });
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push({
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            stock: Math.floor(Math.random() * 6),
            category: "AAA",
            thumbnail: faker.image.url(),
        });
    }
    return products;
};

// Función para obtener los productos paginados y ordenados
const getProducts = (limit, page, sort, query) => {
    const allProducts = generateProducts(); // Obtiene todos los productos generados
    const formatLimit = limit ? Number(limit) : 4;
    const formatPage = page ? Number(page) : 1;

    let formattedProducts = allProducts;
    if (query) {
        formattedProducts = allProducts.filter((product) => product.category === query);
    }

    // Aplica el ordenamiento según el valor de sort
    if (sort === 'asc') {
        formattedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        formattedProducts.sort((a, b) => b.price - a.price);
    } else if (sort && sort !== 'asc' && sort !== 'desc') {
        throw new Error('Error: Bad Request, just admit asc and desc');
    }

    const totalProducts = formattedProducts.length;
    const totalPages = Math.ceil(totalProducts / formatLimit);

    // Calcula el índice inicial y final para paginación
    const startIndex = (formatPage - 1) * formatLimit;
    const endIndex = Math.min(startIndex + formatLimit, totalProducts);

    const paginatedProducts = formattedProducts.slice(startIndex, endIndex);

    return {
        products: paginatedProducts,
        totalPages,
        currentPage: formatPage,
        pageSize: formatLimit,
    };
};

mockingRouters.get('/', isAuth, async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        // Obtén los productos paginados utilizando la función getProducts
        const products = getProducts(limit, page, sort, query);

        const { user } = req.session;
        delete user.password;

        products.prevLink = products.currentPage > 1 ? `/products?page=${products.currentPage - 1}` : null;
        products.nextLink = products.currentPage < products.totalPages ? `/products?page=${products.currentPage + 1}` : null;

        if (products.totalPages > 1) {
            products.totalPagesArray = Array.from({ length: products.totalPages }, (_, i) => i + 1);
        }

        res.status(200).render('mockingproducts', {
            script: 'index',
            style: 'index',
            title: 'Productos',
            products: products.products,
            user,
            currentPage: products.currentPage,
            totalPages: products.totalPages,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
            totalPagesArray: products.totalPagesArray,
        });

    } catch (error) {
        res.status(500).send(`Error trying to fetch all the products: ${error}`);
    }
});

// ...

export default mockingRouters;
