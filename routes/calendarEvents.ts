import { createEvent, updateEvent, deleteEvent, getEvents } from "../controllers/calendarEventsController.js";
import { check } from "express-validator";
import { RequestHandler, Router } from "express";
import { jwtValidator } from "../middleware/jwt-validator.js";
import { calendarValidators } from "../middleware/calendarValidators.js";


/* 
  CRUD: Create, Read, Update, Delete
  /api/events

 
*/
const router = Router();

// Si quiero que haya rutas publicas lo unico que hay que hacer
// es poner el router.use debajo de la ruta que quiera validar

// Validar el token en todas las rutas
router.use(jwtValidator as RequestHandler);

router.get(
  "/",
  getEvents as RequestHandler
);

router.post(
  "/", 
  [
    check("tratament", "El tratamento es requerido").not().isEmpty(),
    check("start", "La fecha de inicio debe ser valida").isISO8601().toDate(),
    check("end", "La fecha de fin debe ser valida").isISO8601().toDate(),
    check("end").custom((value, { req }) => {
      const startDate = new Date(req.body.start);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
    check("start").custom((value, { req }) => {
      const startDate = new Date(value);
      const endDate = new Date(req.body.end);
      
      if (startDate >= endDate) {
        throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
      }
      return true;
    }),
    check("description", "La descripción es requerida").not().isEmpty(),
    check("bgColor", "El color de fondo es requerido").not().isEmpty(),
    check("treatmentCost", "El costo del tratamiento es requerido").not().isEmpty(),
    check("remainingBalance", "El saldo restante es requerido").not().isEmpty(),
    check("totalPayment", "El pago total es requerido").not().isEmpty(),
    check("status", "El estado es requerido").not().isEmpty(),
    calendarValidators as RequestHandler

  ],
  createEvent
);


router.put(
  "/:id", 
  [

  ],
  updateEvent as RequestHandler
);

router.delete(
  "/:id",
  deleteEvent as RequestHandler
);




export default router;
