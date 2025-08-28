const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'performanceData.json');
const MAX_RECORDS = 500; // Tamanho ideal para análise estatística

// Função para garantir que o arquivo existe
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // Se o arquivo não existir, cria com array vazio
    console.log('Criando novo arquivo performanceData.json...');
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Função para carregar dados do arquivo
async function loadData() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    
    // Garante que não excede o limite máximo
    if (parsedData.length > MAX_RECORDS) {
      return parsedData.slice(-MAX_RECORDS);
    }
    return parsedData;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return [];
  }
}

// Função para salvar dados no arquivo
async function saveData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`Dados salvos em ${DATA_FILE} (${data.length} registros)`);
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Carrega dados ao iniciar o servidor
let performanceData = [];

async function initializeServer() {
  performanceData = await loadData();
  console.log(`Servidor inicializado com ${performanceData.length} registros existentes`);
  console.log(`Arquivo de dados: ${DATA_FILE}`);
  console.log(`Limite máximo: ${MAX_RECORDS} registros`);
}

// Rotas da API
app.post('/performance-metrics', async (req, res) => {
  try {
    // Verifica se atingiu o limite
    if (performanceData.length >= MAX_RECORDS) {
      return res.status(429).json({ 
        error: 'Limite de registros atingido',
        message: `Máximo de ${MAX_RECORDS} registros permitidos`,
        totalRecords: performanceData.length,
        maxRecords: MAX_RECORDS,
        suggestion: 'Use DELETE /performance-metrics para limpar os dados'
      });
    }
    
    const metrics = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString(),
      id: Date.now() + Math.random().toString(36).substr(2, 9) // ID único
    };
    
    console.log('Nova métrica recebida:', metrics);
    
    // Adiciona aos dados
    performanceData.push(metrics);
    
    // Salva no arquivo (assincronamente)
    saveData(performanceData);
    
    res.status(200).json({ 
      message: 'Métrica salva com sucesso',
      totalRecords: performanceData.length,
      maxRecords: MAX_RECORDS,
      remaining: MAX_RECORDS - performanceData.length
    });
  } catch (error) {
    console.error('Erro ao processar métrica:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/performance-metrics', (req, res) => {
  res.json({
    data: performanceData,
    total: performanceData.length,
    max: MAX_RECORDS,
    remaining: MAX_RECORDS - performanceData.length,
    file: DATA_FILE
  });
});

app.get('/performance-stats', (req, res) => {
  res.json({
    totalRecords: performanceData.length,
    maxRecords: MAX_RECORDS,
    remainingCapacity: MAX_RECORDS - performanceData.length,
    percentageUsed: ((performanceData.length / MAX_RECORDS) * 100).toFixed(1) + '%',
    fileSize: `${(JSON.stringify(performanceData).length / 1024).toFixed(2)} KB`,
    status: performanceData.length >= MAX_RECORDS ? 'LIMITE ATINGIDO' : 'ACEITANDO DADOS'
  });
});

app.delete('/performance-metrics', async (req, res) => {
  try {
    performanceData = [];
    await saveData(performanceData);
    
    res.json({ 
      message: 'Todos os dados foram limpos',
      totalRecords: 0,
      maxRecords: MAX_RECORDS,
      remaining: MAX_RECORDS,
      file: DATA_FILE
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao limpar dados' });
  }
});

app.get('/export-data', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const filename = `performance-data-${new Date().toISOString().split('T')[0]}.json`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao exportar dados' });
  }
});

app.get('/file-info', async (req, res) => {
  try {
    const stats = await fs.stat(DATA_FILE);
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(fileData);
    
    res.json({
      filePath: DATA_FILE,
      fileSize: `${(stats.size / 1024).toFixed(2)} KB`,
      created: stats.birthtime,
      modified: stats.mtime,
      records: jsonData.length,
      maxRecords: MAX_RECORDS
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler informações do arquivo' });
  }
});

// Inicializa o servidor
initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Endpoint: http://localhost:${PORT}/performance-metrics`);
    console.log(`📁 Arquivo: ${DATA_FILE}`);
    console.log(`📈 Limite: ${MAX_RECORDS} registros\n`);
  });
}).catch(error => {
  console.error('Erro ao inicializar servidor:', error);
});
