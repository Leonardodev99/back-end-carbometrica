import { Router } from "express";
import ingredientesController from "../controllers/IngredientesController";

const router = new Router();

router.post('/', ingredientesController.store);
router.get('/', ingredientesController.index);
router.get('/:id', ingredientesController.show);
router.put('/:id', ingredientesController.update);
router.delete('/:id', ingredientesController.delete);

export default router;
