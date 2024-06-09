import { Router } from "express";

import loginRequired from "../middlewares/loginRequired";
import ingredientesController from "../controllers/IngredientesController";

const router = new Router();

router.post('/', loginRequired, ingredientesController.store);
router.get('/', ingredientesController.index);
router.get('/:id',loginRequired, ingredientesController.show);
router.put('/:id', loginRequired, ingredientesController.update);
router.delete('/:id', ingredientesController.delete);

export default router;
