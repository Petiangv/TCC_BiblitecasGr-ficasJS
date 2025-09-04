import re
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import os
from datetime import datetime

class MultiBenchmarkAnalyzer:
    def __init__(self):
        self.data = {}
        self.libraries = ['threejs', 'p5js', 'pixi', 'd3']
        self.colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
        
        # Criar diretório para os gráficos
        os.makedirs('graficos_comparacao', exist_ok=True)

    def parse_benchmark_file(self, file_path, library_name):
        """Parse o arquivo de benchmark e extrai os dados"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
        except FileNotFoundError:
            print(f"Arquivo não encontrado: {file_path}")
            return None

        library_data = {
            'library': library_name,
            'periodo': {},
            'fps': {},
            'memory': {},
            'rendertime': {},
            'anomalias': {}
        }

        # Extrair período temporal
        periodo_match = re.search(r'Período temporal: (.+?) até (.+?)\n', content)
        if periodo_match:
            library_data['periodo'] = {
                'inicio': periodo_match.group(1),
                'fim': periodo_match.group(2)
            }

        # Extrair dados de FPS
        fps_match = re.search(r'--- FPS ---\s+(.+?)(?:\n\n|\n---)', content, re.DOTALL)
        if fps_match:
            fps_data = fps_match.group(1)
            library_data['fps'] = self._parse_metrics(fps_data)

        # Extrair dados de Memory
        memory_match = re.search(r'--- MEMORY ---\s+(.+?)(?:\n\n|\n---)', content, re.DOTALL)
        if memory_match:
            memory_data = memory_match.group(1)
            library_data['memory'] = self._parse_metrics(memory_data)

        # Extrair dados de RenderTime
        rendertime_match = re.search(r'--- RENDERTIME ---\s+(.+?)(?:\n\n|\n---)', content, re.DOTALL)
        if rendertime_match:
            rendertime_data = rendertime_match.group(1)
            library_data['rendertime'] = self._parse_metrics(rendertime_data)

        # Extrair anomalias
        anomalias_match = re.search(r'--- ANOMALIAS DETECTADAS ---\s+(.+?)$', content, re.DOTALL)
        if anomalias_match:
            anomalias_data = anomalias_match.group(1)
            library_data['anomalias'] = self._parse_anomalias(anomalias_data)

        self.data[library_name] = library_data
        return library_data

    def _parse_metrics(self, metrics_text):
        """Parse as métricas individuais"""
        metrics = {}
        lines = metrics_text.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            if ':' in line:
                parts = line.split(':', 1)
                key = parts[0].strip().lower().replace(' ', '_').replace('ç', 'c')
                value = parts[1].strip()
                
                # Converter valores numéricos
                try:
                    if '.' in value:
                        metrics[key] = float(value)
                    else:
                        metrics[key] = int(value)
                except ValueError:
                    metrics[key] = value
        
        return metrics

    def _parse_anomalias(self, anomalias_text):
        """Parse as anomalias"""
        anomalias = {}
        lines = anomalias_text.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            if ':' in line:
                parts = line.split(':', 1)
                key = parts[0].strip().lower().replace(' ', '_')
                value_part = parts[1].strip()
                
                # Extrair apenas o número
                numbers = re.findall(r'\d+', value_part)
                if numbers:
                    anomalias[key] = int(numbers[0])
        
        return anomalias

    def plot_individual_graphs(self):
        """Gera cada gráfico como uma imagem separada"""
        if not self.data:
            print("Nenhum dado disponível para plotar")
            return

        print("\nDados carregados para plotagem:")
        for lib, data in self.data.items():
            print(f"{lib}: FPS={data['fps'].get('media', 'N/A')}, "
                  f"Memory={data['memory'].get('media', 'N/A')}, "
                  f"RenderTime={data['rendertime'].get('media', 'N/A')}")

        # Configurar estilo dos gráficos
        plt.style.use('default')
        sns.set_palette(self.colors)
        
        # Gráfico 1: FPS
        self._plot_fps_comparison()
        
        # Gráfico 2: Memória
        self._plot_memory_comparison()
        
        # Gráfico 3: Render Time
        self._plot_render_time_comparison()
        
        # Gráfico 4: Anomalias
        self._plot_anomalies_comparison()
        
        # Gráfico 5: Radar Chart
        self._plot_radar_chart()
        
        # Gráfico 6: Comparação múltipla
        self._plot_multiple_metrics_comparison()
        
        # Gráfico 7: Estatísticas detalhadas
        self._plot_detailed_stats()

    def _plot_fps_comparison(self):
        """Gráfico de comparação de FPS"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        libraries = []
        fps_values = []
        
        for lib in self.libraries:
            if lib in self.data and 'fps' in self.data[lib]:
                fps = self.data[lib]['fps'].get('media', 0)
                libraries.append(lib)
                fps_values.append(fps)
        
        if fps_values and any(fps_values):
            bars = ax.bar(libraries, fps_values, color=self.colors[:len(libraries)], alpha=0.8)
            ax.set_title('Comparação de FPS (Quadros por Segundo)\nMaior valor é melhor', 
                        fontsize=14, fontweight='bold')
            ax.set_ylabel('FPS', fontweight='bold')
            ax.set_xlabel('Bibliotecas', fontweight='bold')
            ax.grid(True, alpha=0.3, axis='y')
            
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + max(fps_values)*0.01,
                       f'{height:.1f} FPS', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/fps_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico de FPS salvo: graficos_comparacao/fps_comparison.png")
        else:
            print("Aviso: Dados de FPS insuficientes")

    def _plot_memory_comparison(self):
        """Gráfico de comparação de uso de memória"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        libraries = []
        memory_values = []
        
        for lib in self.libraries:
            if lib in self.data and 'memory' in self.data[lib]:
                memory = self.data[lib]['memory'].get('media', 0)
                libraries.append(lib)
                memory_values.append(memory)
        
        if memory_values and any(memory_values):
            bars = ax.bar(libraries, memory_values, color=self.colors[:len(libraries)], alpha=0.8)
            ax.set_title('Comparação de Uso de Memória\nMenor valor é melhor', 
                        fontsize=14, fontweight='bold')
            ax.set_ylabel('Memória (MB)', fontweight='bold')
            ax.set_xlabel('Bibliotecas', fontweight='bold')
            ax.grid(True, alpha=0.3, axis='y')
            
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + max(memory_values)*0.01,
                       f'{height:.1f} MB', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/memory_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico de Memória salvo: graficos_comparacao/memory_comparison.png")
        else:
            print("Aviso: Dados de Memória insuficientes")

    def _plot_render_time_comparison(self):
        """Gráfico de comparação de tempo de renderização"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        libraries = []
        render_values = []
        
        for lib in self.libraries:
            if lib in self.data and 'rendertime' in self.data[lib]:
                render_time = self.data[lib]['rendertime'].get('media', 0)
                libraries.append(lib)
                render_values.append(render_time)
        
        if render_values and any(render_values):
            bars = ax.bar(libraries, render_values, color=self.colors[:len(libraries)], alpha=0.8)
            ax.set_title('Comparação de Tempo de Renderização\nMenor valor é melhor', 
                        fontsize=14, fontweight='bold')
            ax.set_ylabel('Tempo (ms)', fontweight='bold')
            ax.set_xlabel('Bibliotecas', fontweight='bold')
            ax.grid(True, alpha=0.3, axis='y')
            
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + max(render_values)*0.01,
                       f'{height:.2f} ms', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/render_time_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico de Render Time salvo: graficos_comparacao/render_time_comparison.png")
        else:
            print("Aviso: Dados de Render Time insuficientes")

    def _plot_anomalies_comparison(self):
        """Gráfico de comparação de anomalias"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        libraries = []
        anomaly_values = []
        
        for lib in self.libraries:
            if lib in self.data and 'anomalias' in self.data[lib]:
                anomalies = sum(self.data[lib]['anomalias'].values())
                libraries.append(lib)
                anomaly_values.append(anomalies)
        
        if anomaly_values:
            bars = ax.bar(libraries, anomaly_values, color=self.colors[:len(libraries)], alpha=0.8)
            ax.set_title('Comparação de Anomalias Detectadas\nMenor valor é melhor', 
                        fontsize=14, fontweight='bold')
            ax.set_ylabel('Quantidade de Anomalias', fontweight='bold')
            ax.set_xlabel('Bibliotecas', fontweight='bold')
            ax.grid(True, alpha=0.3, axis='y')
            
            for bar in bars:
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                       f'{int(height)}', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/anomalies_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico de Anomalias salvo: graficos_comparacao/anomalies_comparison.png")
        else:
            print("Aviso: Dados de Anomalias insuficientes")

    def _plot_radar_chart(self):
        """Gráfico radar para comparação multidimensional"""
        fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(polar=True))
        
        categories = ['FPS Performance', 'Memory Efficiency', 'Render Speed', 'Stability']
        
        normalized_data = {}
        for lib in self.libraries:
            if lib in self.data:
                data = self.data[lib]
                
                # Normalização
                fps = min(data['fps'].get('media', 0) / 60 * 100, 100)
                memory_used = data['memory'].get('media', 0)
                memory = max(0, 100 - (memory_used / 50 * 100))
                render_time = data['rendertime'].get('media', 0)
                render_score = max(0, 100 - min(render_time * 50, 100))
                anomalies = sum(data['anomalias'].values())
                stability = max(0, 100 - min(anomalies * 20, 100))
                
                normalized_data[lib] = [fps, memory, render_score, stability]

        if normalized_data:
            angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()
            angles += angles[:1]

            for i, (lib, values) in enumerate(normalized_data.items()):
                values += values[:1]
                ax.plot(angles, values, 'o-', linewidth=2, label=lib, color=self.colors[i])
                ax.fill(angles, values, alpha=0.1, color=self.colors[i])

            ax.set_thetagrids(np.degrees(angles[:-1]), categories)
            ax.set_ylim(0, 100)
            ax.set_title('Comparação Multidimensional de Performance\n(Valores normalizados 0-100%)', 
                        fontsize=14, fontweight='bold', pad=20)
            ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/radar_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico Radar salvo: graficos_comparacao/radar_comparison.png")
        else:
            print("Aviso: Dados insuficientes para radar chart")

    def _plot_multiple_metrics_comparison(self):
        """Gráfico com múltiplas métricas normalizadas"""
        fig, ax = plt.subplots(figsize=(12, 8))
        
        metrics_data = {
            'FPS': [],
            'Memory': [],
            'RenderTime': [],
            'Stability': []
        }
        
        libraries_with_data = []
        
        for lib in self.libraries:
            if lib in self.data:
                data = self.data[lib]
                libraries_with_data.append(lib)
                
                fps_norm = min(data['fps'].get('media', 0) / 60 * 100, 100)
                memory_norm = max(0, 100 - (data['memory'].get('media', 0) / 50 * 100))
                render_norm = max(0, 100 - min(data['rendertime'].get('media', 0) * 50, 100))
                stability_norm = max(0, 100 - min(sum(data['anomalias'].values()) * 20, 100))
                
                metrics_data['FPS'].append(fps_norm)
                metrics_data['Memory'].append(memory_norm)
                metrics_data['RenderTime'].append(render_norm)
                metrics_data['Stability'].append(stability_norm)
        
        if libraries_with_data:
            x = np.arange(len(libraries_with_data))
            width = 0.2
            
            for i, (metric, values) in enumerate(metrics_data.items()):
                ax.bar(x + i*width, values, width, label=metric, alpha=0.8)
            
            ax.set_xlabel('Bibliotecas', fontweight='bold')
            ax.set_ylabel('Score Normalizado (0-100)', fontweight='bold')
            ax.set_title('Comparação de Múltiplas Métricas Normalizadas\n(Valores mais altos são melhores)', 
                        fontsize=14, fontweight='bold')
            ax.set_xticks(x + width*1.5)
            ax.set_xticklabels(libraries_with_data)
            ax.legend()
            ax.grid(True, alpha=0.3)
            
            plt.tight_layout()
            plt.savefig('graficos_comparacao/multiple_metrics_comparison.png', dpi=300, bbox_inches='tight')
            plt.close()
            print("Gráfico Múltiplas Métricas salvo: graficos_comparacao/multiple_metrics_comparison.png")
        else:
            print("Aviso: Dados insuficientes para gráfico múltiplo")

    def _plot_detailed_stats(self):
        """Gráfico com estatísticas detalhadas de cada biblioteca"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        axes = axes.flatten()
        
        for i, lib in enumerate(self.libraries):
            if lib in self.data and i < len(axes):
                data = self.data[lib]
                ax = axes[i]
                
                metrics = {
                    'FPS Média': data['fps'].get('media', 0),
                    'FPS Mediana': data['fps'].get('mediana', 0),
                    'Memória Média': data['memory'].get('media', 0),
                    'Render Time Médio': data['rendertime'].get('media', 0),
                    'Anomalias': sum(data['anomalias'].values())
                }
                
                y_pos = np.arange(len(metrics))
                values = list(metrics.values())
                labels = list(metrics.keys())
                
                bars = ax.barh(y_pos, values, color=self.colors[i], alpha=0.8)
                ax.set_yticks(y_pos)
                ax.set_yticklabels(labels)
                ax.set_xlabel('Valores')
                ax.set_title(f'Estatísticas Detalhadas - {lib.upper()}', fontweight='bold')
                
                for bar, value in zip(bars, values):
                    width = bar.get_width()
                    ax.text(width + max(values)*0.01, bar.get_y() + bar.get_height()/2.,
                           f'{value:.2f}', va='center', fontweight='bold')
                
                ax.grid(True, alpha=0.3, axis='x')
        
        plt.tight_layout()
        plt.savefig('graficos_comparacao/detailed_stats.png', dpi=300, bbox_inches='tight')
        plt.close()
        print("Gráfico Estatísticas Detalhadas salvo: graficos_comparacao/detailed_stats.png")

    def generate_summary_report(self):
        """Gera um relatório resumido"""
        print("="*60)
        print("RELATÓRIO RESUMIDO DE COMPARAÇÃO")
        print("="*60)
        
        for lib in self.libraries:
            if lib in self.data:
                data = self.data[lib]
                fps = data['fps'].get('media', 0)
                memory = data['memory'].get('media', 0)
                render = data['rendertime'].get('media', 0)
                anomalies = sum(data['anomalias'].values())
                
                print(f"{lib.upper():<10} | FPS: {fps:6.1f} | "
                      f"Mem: {memory:6.1f}MB | "
                      f"Render: {render:6.2f}ms | "
                      f"Anom: {anomalies:3d}")

# Exemplo de uso
if __name__ == "__main__":
    analyzer = MultiBenchmarkAnalyzer()

    # Parse dos arquivos
    print("=== CARREGANDO DADOS ===")
    analyzer.parse_benchmark_file('threejs_benchmark.txt', 'threejs')
    analyzer.parse_benchmark_file('p5js_benchmark.txt', 'p5js')
    analyzer.parse_benchmark_file('pixi_benchmark.txt', 'pixi')
    analyzer.parse_benchmark_file('d3_benchmark.txt', 'd3')

    # Gerar todos os gráficos individuais
    print("\n=== GERANDO GRÁFICOS ===")
    analyzer.plot_individual_graphs()
    
    # Gerar relatório resumido
    print("\n=== RELATÓRIO FINAL ===")
    analyzer.generate_summary_report()
    
    print("\n" + "="*60)
    print("Processamento concluído!")
    print("Todos os gráficos foram salvos na pasta 'graficos_comparacao/'")
    print("="*60)
