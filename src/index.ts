import { Hono } from 'hono';
import { handleValidate } from './routes/validate';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/health', (c) => c.json({ status: 'ok' }));

app.post('/validate', handleValidate);

app.notFound((c) => c.json({ success: false, error: { message: 'Endpoint not found', code: 'NOT_FOUND', status: 404 } }, 404));

export default app;