import re
import matplotlib.pyplot as plt
import numpy as np
import os

def extrair_variaveis_arquivo(caminho_arquivo):
    with open(caminho_arquivo, 'r', encoding='utf-8') as arquivo:
        conteudo = arquivo.read()
    
    variaveis = {}
    
    # Extrair período analisado e datas
    periodo_match = re.search(r'Período analisado: (\d+) registros', conteudo)
    if periodo_match:
        variaveis['periodo_analisado'] = int(periodo_match.group(1))
    
    data_inicio_match = re.search(r'Período temporal: (.+?) até', conteudo)
    if data_inicio_match:
        variaveis['data_inicio'] = data_inicio_match.group(1)
    
    data_fim_match = re.search(r'até (.+)', conteudo)
    if data_fim_match:
        variaveis['data_fim'] = data_fim_match.group(1)
    
    # Extrair seções usando a lógica mencionada
    secoes = {
        'fps': r'--- FPS ---[\s\S]*?(?=---|$)',
        'memory': r'--- MEMORY ---[\s\S]*?(?=---|$)',
        'rendertime': r'--- RENDERTIME ---[\s\S]*?(?=---|$)',
        'anomalias': r'--- ANOMALIAS DETECTADAS ---[\s\S]*?(?=---|$)'
    }
    
    secoes_extraidas = {}
    
    for nome_secao, padrao_secao in secoes.items():
        match = re.search(padrao_secao, conteudo)
        if match:
            secoes_extraidas[nome_secao] = match.group(0)
    
    # Processar seção FPS
    if 'fps' in secoes_extraidas:
        secao_fps = secoes_extraidas['fps']
        padroes_fps = {
            'fps_media': r'média: (\d+\.?\d*)',
            'fps_mediana': r'mediana: (\d+\.?\d*)',
            'fps_desvio_padrao': r'desvio_padrão: (\d+\.?\d*)',
            'fps_minimo': r'mínimo: (\d+\.?\d*)',
            'fps_maximo': r'máximo: (\d+\.?\d*)',
            'fps_quantidade': r'quantidade: (\d+\.?\d*)'
        }
        
        for nome, padrao in padroes_fps.items():
            match = re.search(padrao, secao_fps)
            if match:
                valor = match.group(1)
                if '.' in valor:
                    variaveis[nome] = float(valor)
                else:
                    variaveis[nome] = int(valor)
    
    # Processar seção MEMORY
    if 'memory' in secoes_extraidas:
        secao_memory = secoes_extraidas['memory']
        padroes_memory = {
            'memory_media': r'média: (\d+\.?\d*)',
            'memory_mediana': r'mediana: (\d+\.?\d*)',
            'memory_desvio_padrao': r'desvio_padrão: (\d+\.?\d*)',
            'memory_minimo': r'mínimo: (\d+\.?\d*)',
            'memory_maximo': r'máximo: (\d+\.?\d*)',
            'memory_quantidade': r'quantidade: (\d+\.?\d*)'
        }
        
        for nome, padrao in padroes_memory.items():
            match = re.search(padrao, secao_memory)
            if match:
                valor = match.group(1)
                if '.' in valor:
                    variaveis[nome] = float(valor)
                else:
                    variaveis[nome] = int(valor)
    
    # Processar seção RENDERTIME
    if 'rendertime' in secoes_extraidas:
        secao_rendertime = secoes_extraidas['rendertime']
        padroes_rendertime = {
            'rendertime_media': r'média: (\d+\.?\d*)',
            'rendertime_mediana': r'mediana: (\d+\.?\d*)',
            'rendertime_desvio_padrao': r'desvio_padrão: (\d+\.?\d*)',
            'rendertime_minimo': r'mínimo: (\d+\.?\d*)',
            'rendertime_maximo': r'máximo: (\d+\.?\d*)',
            'rendertime_quantidade': r'quantidade: (\d+\.?\d*)'
        }
        
        for nome, padrao in padroes_rendertime.items():
            match = re.search(padrao, secao_rendertime)
            if match:
                valor = match.group(1)
                if '.' in valor:
                    variaveis[nome] = float(valor)
                else:
                    variaveis[nome] = int(valor)
    
    # Processar seção ANOMALIAS
    if 'anomalias' in secoes_extraidas:
        secao_anomalias = secoes_extraidas['anomalias']
        padroes_anomalias = {
            'anomalias_fps': r'fps: (\d+) anomalias',
            'anomalias_memory': r'memory: (\d+) anomalias',
            'anomalias_rendertime': r'renderTime: (\d+) anomalias'
        }
        
        for nome, padrao in padroes_anomalias.items():
            match = re.search(padrao, secao_anomalias)
            if match:
                variaveis[nome] = int(match.group(1))
    
    return variaveis

def criar_graficos_comparativos(arquivos):
    """
    Cria gráficos comparativos entre os diferentes arquivos
    """
    dados = {}
    
    # Extrair dados de todos os arquivos
    for arquivo in arquivos:
        if os.path.exists(arquivo):
            nome = arquivo.replace('.txt', '').upper()
            dados[nome] = extrair_variaveis_arquivo(arquivo)
        else:
            print(f"Arquivo {arquivo} não encontrado!")
    
    if not dados:
        print("Nenhum dado encontrado para criar gráficos!")
        return
    
    # Configurações dos gráficos
    plt.style.use('seaborn-v0_8')
    fig, axes = plt.subplots(2, 2, figsize=(8 , 5))
    fig.suptitle(' 6000 Partículas ', fontsize=10, fontweight='bold')
    
    bibliotecas = list(dados.keys())
    cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826']
    
    # Gráfico 1: FPS
    ax1 = axes[0, 0]
    fps_medias = [dados[bib].get('fps_media', 0) for bib in bibliotecas]
    fps_desvios = [dados[bib].get('fps_desvio_padrao', 0) for bib in bibliotecas]
    
    bars = ax1.bar(bibliotecas, fps_medias, yerr=fps_desvios, 
                  capsize=5, alpha=0.8, color=cores[:len(bibliotecas)])
    ax1.set_title('FPS ')
    ax1.set_ylabel('FPS')
    ax1.grid(True, alpha=0.3)
    
    # Adicionar valores nas barras
    for bar, valor in zip(bars, fps_medias):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                f'{valor:.1f}', ha='center', va='bottom', fontweight='bold')
    
    # Gráfico 2: Memória
    ax2 = axes[0, 1]
    memory_medias = [dados[bib].get('memory_media', 0) for bib in bibliotecas]
    memory_desvios = [dados[bib].get('memory_desvio_padrao', 0) for bib in bibliotecas]
    
    bars = ax2.bar(bibliotecas, memory_medias, yerr=memory_desvios,
                  capsize=5, alpha=0.8, color=cores[:len(bibliotecas)])
    ax2.set_title('Uso de Memória')
    ax2.set_ylabel('Memória (MB)')
    ax2.grid(True, alpha=0.3)
    
    for bar, valor in zip(bars, memory_medias):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
                f'{valor:.1f}', ha='center', va='bottom', fontweight='bold')
    
    # Gráfico 3: Render Time
    ax3 = axes[1, 0]
    rendertime_medias = [dados[bib].get('rendertime_media', 0) for bib in bibliotecas]
    rendertime_desvios = [dados[bib].get('rendertime_desvio_padrao', 0) for bib in bibliotecas]
    
    bars = ax3.bar(bibliotecas, rendertime_medias, yerr=rendertime_desvios,
                  capsize=5, alpha=0.8, color=cores[:len(bibliotecas)])
    ax3.set_title('Tempo de Renderização')
    ax3.set_ylabel('Tempo (ms)')
    ax3.grid(True, alpha=0.3)
    
    for bar, valor in zip(bars, rendertime_medias):
        ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                f'{valor:.2f}', ha='center', va='bottom', fontweight='bold')
    
    # Gráfico 4: Anomalias
    ax4 = axes[1, 1]
    anomalias_totais = []
    for bib in bibliotecas:
        total = (dados[bib].get('anomalias_fps', 0) + 
                dados[bib].get('anomalias_memory', 0) + 
                dados[bib].get('anomalias_rendertime', 0))
        anomalias_totais.append(total)
    
    bars = ax4.bar(bibliotecas, anomalias_totais, alpha=0.8, color=cores[:len(bibliotecas)])
    ax4.set_title('Total de Anomalias')
    ax4.set_ylabel('Número de Anomalias')
    ax4.grid(True, alpha=0.3)
    
    for bar, valor in zip(bars, anomalias_totais):
        ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                f'{valor}', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('comparativo_performance.png', dpi=300, bbox_inches='tight')
    plt.show()
    

# Lista de arquivos para comparar
arquivos_para_comparar = ['Three.txt', 'Pixi.txt', 'D3.txt']

# Executar a comparação
criar_graficos_comparativos(arquivos_para_comparar)

# Mostrar dados individuais também
print("=== DADOS INDIVIDUAIS ===")
for arquivo in arquivos_para_comparar:
    if os.path.exists(arquivo):
        print(f"\n--- {arquivo.upper()} ---")
        dados = extrair_variaveis_arquivo(arquivo)
        print(f"FPS Média: {dados.get('fps_media', 'N/A')}")
        print(f"Memória Média: {dados.get('memory_media', 'N/A')}")
        print(f"Render Time Média: {dados.get('rendertime_media', 'N/A')}")
        print(f"Anomalias Totais: {(dados.get('anomalias_fps', 0) + dados.get('anomalias_memory', 0) + dados.get('anomalias_rendertime', 0))}")
