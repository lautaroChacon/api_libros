const express = require('express');
const router = express.Router();
const libros = require("../data");
const joi = require('joi');

const libroSchema = joi.object({
  titulo: joi.string().required().label('Titulo'),
  autor: joi.string().required().label('Autor')
});


// Obtener todos los libros:
router.get('/', (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});


// Obtener un libro por ID:
router.get('/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("libro no encontrado");
      error.status = 404;
      throw error;
    }
    res.json(libro);
  } catch (err) {
    next(err);
  }
});


// Crear un nuevo libro:
router.post('/', (req, res, next) => {
  try {
    const {error, value} = libroSchema.validate(req.body);
    
    // Si hay algun error en la validacion lo enviamos como respuesta:
    if (error) {
      const validationError = new Error("Error de Validación");
      validationError.status = 400;
      validationError.details = error.details.map(detail => detail.message);
      throw validationError;
    }

    const {titulo, autor} = value;

    const nuevoLibro = {
      id: libros.length + 1,
      titulo,
      autor
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});


// Actualizar un libro existente:
router.put('/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const { error, value } = libroSchema.validate(req.body);

    if (error) {
      const validationError = new Error("Error de Validación");
      validationError.status = 400;
      validationError.details = error.details.map(detail => detail.message);
      throw validationError;
    }

    const { titulo, autor } = value;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("libro no encontrado");
      error.status = 404;
      throw error;
    }
    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;
    
    res.json(libro);
  } catch (err) {
    next(err);
  }
});


// Eliminar un libro:
router.delete("/:id", (req,res,next)=>{
  try {
    const id = req.params.id;
    const index = libros.findIndex((l) => l.id === id);

    if (index === -1) {
      const error = new Error("El libro no fue encontrado");
      error.status = 404;
      throw error;
    }

    const libroEliminado = libros.splice(index, 1);
    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;