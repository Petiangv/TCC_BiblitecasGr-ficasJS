const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar banco SQLite
const db = new sqlite3.Database('fps-data.db');

// Criar tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS fps_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fps INTEGER,
      timestamp DATETIME,
      user_agent TEXT,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rota para receber dados FPS
app.post('/api/fps-data', (req, res) => {
  const { fps, timestamp, userAgent, url } = req.body;
  
  db.run(
    `INSERT INTO fps_metrics (fps, timestamp, user_agent, url) 
     VALUES (?, ?, ?, ?)`,
    [fps, timestamp, userAgent, url],
    function(err) {
      if (err) {
        console.error('Erro ao inserir dados:', err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
