import { Application, Request, Response } from 'express';
import axios from 'axios';

function formatStatus(status: string): string {
  switch (status) {
    case 'TODO':
      return 'To do';
    case 'IN_PROGRESS':
      return 'In progress';
    case 'DONE':
      return 'Done';
    default:
      return status;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export default function (app: Application): void {
  app.get('/tasks', async (req: Request, res: Response) => {
    const taskId = req.query.id;

    try {
      if (taskId) {
        const response = await axios.get(`http://localhost:4000/tasks/${taskId}`);

        const formattedTask = {
          ...response.data,
          statusLabel: formatStatus(response.data.status),
          dueDateFormatted: formatDate(response.data.dueDateTime),
        };

        res.render('tasks', {
          tasks: [formattedTask],
          searchId: taskId,
        });
      } else {
        const response = await axios.get('http://localhost:4000/tasks');

        const formattedTasks = response.data.map((task: any) => ({
          ...task,
          statusLabel: formatStatus(task.status),
          dueDateFormatted: formatDate(task.dueDateTime),
        }));

        res.render('tasks', {
          tasks: formattedTasks,
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

  app.post('/tasks/:id/status', async (req: Request, res: Response) => {
    const taskId = req.params.id;
    const { status } = req.body;

    try {
      await axios.post(`http://localhost:4000/tasks/${taskId}/status`, null, {
        params: { status }
      });

      res.redirect('/tasks');
    } catch (error) {
      console.error('Error updating task status:', error);
      res.redirect('/tasks');
    }
  });

  app.post('/tasks/:id/delete', async (req: Request, res: Response) => {
    const taskId = req.params.id;

    try {
      await axios.post(`http://localhost:4000/tasks/${taskId}/delete`);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      res.redirect('/tasks');
    }
  });
}
