import { Application, Request, Response } from 'express';

export default function (app: Application): void {
  app.get('/', (req: Request, res: Response) => res.render('home', {}));
}
