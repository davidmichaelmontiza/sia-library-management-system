import { Request, Response } from 'express';

class BaseController {
    async create(req: Request, res: Response) {
        try {
            // Implement create logic here
            res.status(201).json({ message: 'Resource created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async readAll(req: Request, res: Response) {
        try {
            // Implement read all logic here
            res.status(200).json({ message: 'Fetched all resources' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async readById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Implement read by ID logic here
            res.status(200).json({ message: `Fetched resource with ID ${id}` });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Implement update logic here
            res.status(200).json({ message: `Updated resource with ID ${id}` });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Implement delete logic here
            res.status(200).json({ message: `Deleted resource with ID ${id}` });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default BaseController;
