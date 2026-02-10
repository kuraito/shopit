import app from './app.js'; 

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// gestione errori
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Errore del server:', err);
  res.status(500).json({ message: 'Internal server error' });
});
