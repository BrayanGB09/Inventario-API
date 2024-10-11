const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './products.json');

// Función para leer el archivo JSON
const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        return [];  // Retorna un array vacío en caso de error
    }
};

// Función para escribir al archivo JSON
const writeProductsToFile = (products) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en el archivo de productos:', error);
    }
};


// Obtener productos
const getProducts = (req, res) => {
    try {
        const products = readProductsFromFile();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};


// Agregar un producto
const postProducts = (req, res) => {
    try {
        const { nombre, precio, descripcion, cantidad } = req.body;

        // Validar que no hayan campos vacios
        if (!nombre || !precio || !descripcion || !cantidad) {
            return res.status(400).json({ message: 'Todos los campos del producto son obligatorios.' });
        }

        // Validar que precio y cantidad sean números
        if (isNaN(precio) || isNaN(cantidad)) {
            return res.status(400).json({ message: 'El precio y la cantidad deben ser números.' });
        }

        // Validar que los números sean positivos
        if (precio <= 0 || cantidad <= 0) {
            return res.status(400).json({ message: 'El precio y la cantidad deben ser mayores que cero.' });
        }

        const products = readProductsFromFile();
        const newProduct = {
            id: products.length + 1, // Generar ID único
            nombre,
            precio: parseFloat(precio), // Convertir precio a número
            descripcion,
            cantidad: parseInt(cantidad) // Convertir cantidad a número entero
        };

        products.push(newProduct);
        writeProductsToFile(products);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};



// Actualizar un producto
const updateProducts = (req, res) => {
    try {
        const { id } = req.params; // ID del producto a actualizar
        const { nombre, precio, descripcion, cantidad } = req.body; // Datos a actualizar

        // Verificar que el id sea un número válido
        const productId = parseInt(id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
        }

        // Leer los productos del archivo
        const products = readProductsFromFile();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No hay productos disponibles.' });
        }

        // Buscar el índice del producto con el ID proporcionado
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado.` });
        }

        // Actualizar los campos del producto si están presentes en la solicitud
        const updatedProduct = products[productIndex];
        
        updatedProduct.nombre = nombre ? nombre : updatedProduct.nombre;
        updatedProduct.precio = precio ? precio : updatedProduct.precio;
        updatedProduct.descripcion = descripcion ? descripcion : updatedProduct.descripcion;
        updatedProduct.cantidad = cantidad ? cantidad : updatedProduct.cantidad;

        // Escribir los productos actualizados en el archivo
        writeProductsToFile(products);

        // Mensaje de actualización del producto
        res.status(200).json({ 
            message: 'Producto actualizado exitosamente.', 
            product: updatedProduct 
        });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
};



// Eliminar un producto
const deleteProducts = (req, res) => {
    try {
        const { id } = req.params;
        const products = readProductsFromFile();
        const productIndex = products.findIndex(product => product.id === parseInt(id));

        products.splice(productIndex, 1);
        writeProductsToFile(products);
        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = {
    getProducts,
    postProducts,
    updateProducts,
    deleteProducts
};