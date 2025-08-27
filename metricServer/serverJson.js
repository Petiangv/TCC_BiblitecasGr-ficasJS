// server.js (versão JSON)
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'fps-data.json';

// Função para ler dados do JSON
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna array vazio
    return [];
  }
}

// Função para salvar dados no JSON
async function saveData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Rota para receber dados FPS
app.post('/api/fps-data', async (req, res) => {
  try {
    const { fps, timestamp, userAgent, url } = req.body;
    
    // Ler dados existentes
    const existingData = await readData();
    
    // Adicionar novo registro
    const newRecord = {
      id: Date.now(), // ID único baseado no timestamp
      fps,
      timestamp,
      userAgent,
      url,
      createdAt: new Date().toISOString()
    };
    
    existingData.push(newRecord);
    
    // Salvar dados atualizados
    await saveData(existingData);
    
    res.json({ success: true, id: newRecord.id });
  } catch (error) {
    console.error('Erro ao processar dados:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para visualizar os dados (útil para teste)
app.get('/api/fps-data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001 (modo JSON)');
});
