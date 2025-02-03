import express, { Router } from 'express';
import { Request, Response } from 'express';

interface Controller {
    create: (req: Request, res: Response) => void;
    readAll: (req: Request, res: Response) => void;
    readById: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
}

const createBaseRoutes = (controller: Controller): Router => {
    const router = express.Router();

    router.post('/', controller.create);
    router.get('/', controller.readAll);
    router.get('/:id', controller.readById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    return router;
};

export default createBaseRoutes;
