import { Router } from 'express';
import * as controller from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();

router.get('/', requirePermission('GET:/tnc'), controller.getAllTnc);
router.post('/', requirePermission('POST:/tnc'), controller.createTnc);
router.put('/:id', requirePermission('PUT:/tnc/:id'), controller.updateTnc);
router.delete('/:id', requirePermission('DELETE:/tnc/:id'), controller.deleteTnc);

export default router;
