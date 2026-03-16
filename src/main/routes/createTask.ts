import { Application, Request, Response } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/tasks/create', (req: Request, res: Response) => {
    res.render('create-task');
  });

  app.post('/tasks/create', async (req: Request, res: Response) => {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const status = req.body.status;

      const day = req.body['dueDate-day'];
      const month = req.body['dueDate-month'];
      const year = req.body['dueDate-year'];

      const paddedMonth = String(month).padStart(2, '0');
      const paddedDay = String(day).padStart(2, '0');

      const dueDateTime = `${year}-${paddedMonth}-${paddedDay}T00:00:00`;

      const task = {
        title,
        description,
        status,
        dueDateTime,
      };

      await axios.post('http://localhost:4000/tasks', task);

      res.redirect('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      res.render('create-task', {
        error: 'Unable to create task.',
      });
    }
  });
}
