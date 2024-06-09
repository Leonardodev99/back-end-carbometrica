import { Router } from 'express';
import receitasController from '../controllers/ReceitasController';

import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.post('/',  loginRequired, receitasController.store);
router.get('/', receitasController.index);
router.get('/:id', loginRequired, receitasController.show);
router.put('/:id', loginRequired, receitasController.update);
//router.delete('/:id', receitasController.delete);
router.post('/:id/segura',  receitasController.quantidadeSegura);

export default router;

