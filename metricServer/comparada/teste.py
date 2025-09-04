import re

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

# Uso (mantido igual)
variaveis = extrair_variaveis_arquivo('threejs_benchmark.txt')
print("=== TODAS AS VARIÁVEIS EXTRAÍDAS ===")
for chave, valor in variaveis.items():
    print(f"{chave}: {valor}")

print("\n=== ESTATÍSTICAS FPS ===")
print(f"Média FPS: {variaveis.get('fps_media', 'N/A')}")
print(f"Desvio padrão FPS: {variaveis.get('fps_desvio_padrao', 'N/A')}")
print(f"Mínimo FPS: {variaveis.get('fps_minimo', 'N/A')}")
print(f"Máximo FPS: {variaveis.get('fps_maximo', 'N/A')}")

print("\n=== ESTATÍSTICAS MEMORY ===")
print(f"Média Memory: {variaveis.get('memory_media', 'N/A')}")
print(f"Desvio padrão Memory: {variaveis.get('memory_desvio_padrao', 'N/A')}")

print("\n=== ESTATÍSTICAS RENDERTIME ===")
print(f"Média RenderTime: {variaveis.get('rendertime_media', 'N/A')}")
print(f"Desvio padrão RenderTime: {variaveis.get('rendertime_desvio_padrao', 'N/A')}")

print("\n=== ANOMALIAS DETECTADAS ===")
print(f"Anomalias FPS: {variaveis.get('anomalias_fps', 'N/A')}")
print(f"Anomalias Memory: {variaveis.get('anomalias_memory', 'N/A')}")
print(f"Anomalias RenderTime: {variaveis.get('anomalias_rendertime', 'N/A')}")
