import { Application, Request, Response } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/tasks', async (req: Request, res: Response) => {
    const taskId = req.query.id;

    try {
      if (taskId) {
        const response = await axios.get(`http://localhost:4000/tasks/${taskId}`);
        res.render('tasks', {
          tasks: [response.data],
          searchId: taskId,
        });
      } else {
        const response = await axios.get('http://localhost:4000/tasks');
        res.render('tasks', {
          tasks: response.data,
          searchId: '',
        });
      }
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      res.render('tasks', {
        tasks: [],
        searchId: taskId || ''
      });
    }
  });
}
