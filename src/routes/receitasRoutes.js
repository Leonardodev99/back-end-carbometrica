import { Router } from 'express';
import receitasController from '../controllers/ReceitasController';

//import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.post('/',  receitasController.store);
router.get('/', receitasController.index);
router.get('/:id', receitasController.show);
router.put('/:id',  receitasController.update);
router.delete('/:id', receitasController.delete);

export default router;

