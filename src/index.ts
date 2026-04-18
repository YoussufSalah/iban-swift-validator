import { Hono } from 'hono';
import { handleValidate } from './routes/validate';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.use('*', async (c, next) => {
  const host = c.req.header('x-forwarded-host') || c.req.header('host');
  
  if (!host || !host.includes('.rapidapi.com')) {
    return c.json({ 
      success: false, 
      error: { 
        message: 'Direct access blocked. Use the RapidAPI gateway endpoint.', 
        code: 'GATEWAY_REQUIRED' 
      } 
    }, 403);
  }
  
  await next();
});

app.get('/health', (c) => c.json({ status: 'ok' }));

app.post('/validate', handleValidate);

app.notFound((c) => c.json({ success: false, error: { message: 'Endpoint not found', code: 'NOT_FOUND', status: 404 } }, 404));

export default app;