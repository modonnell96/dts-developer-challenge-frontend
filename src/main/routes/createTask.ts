import { Application, Request, Response } from 'express';
import axios from 'axios';

function isValidDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return false;
  }

  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;

  // js silently corrects invalid dates, so if stays the same is a valid date
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export default function (app: Application): void {
  app.get('/tasks/create', (req: Request, res: Response) => {
    res.render('create-task');
  });

  app.post('/tasks/create', async (req: Request, res: Response) => {
    try {
      const title = req.body.title;
      const description = req.body.description;
      const status = req.body.status;

      const day = Number(req.body['dueDate-day']);
      const month = Number(req.body['dueDate-month']);
      const year = Number(req.body['dueDate-year']);

      if (!isValidDate(day, month, year)) {
        return res.render('create-task', {
          error: 'Enter a valid due date.',
          formData: req.body
        });
      }

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

      return res.redirect('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      return res.render('create-task', {
        error: 'Unable to create task.',
        formData: req.body
      });
    }
  });
}
