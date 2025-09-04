import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import statistics

class PerformanceAnalyzer:
    def __init__(self, json_file_path):
        self.json_file_path = json_file_path
        self.data = self.load_data()
        self.df = self.create_dataframe()
        
    def load_data(self):
        """Carrega os dados do arquivo JSON"""
        try:
            with open(self.json_file_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Arquivo {self.json_file_path} não encontrado!")
            return []
        except json.JSONDecodeError:
            print("Erro ao decodificar JSON!")
            return []
    
    def create_dataframe(self):
        """Cria um DataFrame pandas com os dados"""
        if not self.data:
            return pd.DataFrame()
            
        df = pd.DataFrame(self.data)
        
        # Converte timestamp para datetime
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['time_seconds'] = (df['timestamp'] - df['timestamp'].min()).dt.total_seconds()
        
        return df
    
    def basic_statistics(self):
        """Retorna estatísticas básicas das métricas"""
        if self.df.empty:
            return "Nenhum dado disponível para análise"
        
        stats = {}
        metrics = ['fps', 'memory', 'renderTime']
        
        for metric in metrics:
            if metric in self.df.columns:
                values = self.df[metric].dropna()
                if len(values) > 0:
                    stats[metric] = {
                        'média': round(values.mean(), 2),
                        'mediana': round(values.median(), 2),
                        'desvio_padrão': round(values.std(), 2),
                        'mínimo': round(values.min(), 2),
                        'máximo': round(values.max(), 2),
                        'quantidade': len(values)
                    }
        
        return stats
    
    def detect_anomalies(self, threshold_std=2):
        """Detecta anomalias nos dados"""
        anomalies = {}
        
        for metric in ['fps', 'memory', 'renderTime']:
            if metric in self.df.columns:
                values = self.df[metric].dropna()
                if len(values) > 10:  # Precisa de dados suficientes
                    mean = values.mean()
                    std = values.std()
                    
                    # Valores fora de threshold_std desvios padrão
                    anomalies_df = self.df[
                        (self.df[metric] < mean - threshold_std * std) | 
                        (self.df[metric] > mean + threshold_std * std)
                    ]
                    
                    if not anomalies_df.empty:
                        anomalies[metric] = {
                            'quantidade_anomalias': len(anomalies_df),
                            'anomalias': anomalies_df[['timestamp', metric]].to_dict('records')
                        }
        
        return anomalies
    
    def generate_report(self,output_file="report.txt"):
        """Gera um relatório completo em texto"""
        if self.df.empty:
            return "Nenhum dado disponível para análise"
        
        report = []
        report.append("=" * 60)
        report.append("RELATÓRIO DE ANÁLISE DE PERFORMANCE")
        report.append("=" * 60)
        report.append(f"Período analisado: {len(self.df)} registros")
        report.append(f"Período temporal: {self.df['timestamp'].min()} até {self.df['timestamp'].max()}")
        report.append("")
        
        stats = self.basic_statistics()
        for metric, values in stats.items():
            report.append(f"--- {metric.upper()} ---")
            for stat_name, stat_value in values.items():
                report.append(f"  {stat_name}: {stat_value}")
            report.append("")
        
        anomalies = self.detect_anomalies()
        if anomalies:
            report.append("--- ANOMALIAS DETECTADAS ---")
            for metric, anomaly_info in anomalies.items():
                report.append(f"  {metric}: {anomaly_info['quantidade_anomalias']} anomalias")
        else:
            report.append("Nenhuma anomalia detectada")


        with open(output_file,'w', encoding='utf-8') as f:
                f.write("\n".join(report))
        
        return "\n".join(report)
    
    def plot_metrics(self, save_path=None):
        """Cria gráficos das métricas"""
        if self.df.empty:
            print("Nenhum dado para plotar")
            return
        
        fig, axes = plt.subplots(3, 1, figsize=(12, 10))
        fig.suptitle('Análise de Performance - Métricas ao Longo do Tempo', fontsize=16)
        
        # Plot FPS
        if 'fps' in self.df.columns and 'time_seconds' in self.df.columns:
            axes[0].plot(self.df['time_seconds'], self.df['fps'], 'b-', alpha=0.7)
            axes[0].set_ylabel('FPS')
            axes[0].grid(True, alpha=0.3)
            axes[0].set_title('Frames por Segundo')
        
        # Plot Memória
        if 'memory' in self.df.columns and 'time_seconds' in self.df.columns:
            axes[1].plot(self.df['time_seconds'], self.df['memory'], 'r-', alpha=0.7)
            axes[1].set_ylabel('Memória (MB)')
            axes[1].grid(True, alpha=0.3)
            axes[1].set_title('Uso de Memória')
        
        # Plot Tempo de Render
        if 'renderTime' in self.df.columns and 'time_seconds' in self.df.columns:
            axes[2].plot(self.df['time_seconds'], self.df['renderTime'], 'g-', alpha=0.7)
            axes[2].set_xlabel('Tempo (segundos)')
            axes[2].set_ylabel('Tempo de Render (ms)')
            axes[2].grid(True, alpha=0.3)
            axes[2].set_title('Tempo de Renderização')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Gráfico salvo em: {save_path}")
        
        plt.show()
    
    def plot_correlation_heatmap(self, save_path=None):
        """Cria heatmap de correlação entre métricas"""
        if self.df.empty:
            return
        
        # Seleciona apenas colunas numéricas para correlação
        numeric_cols = ['fps', 'memory', 'renderTime']
        numeric_df = self.df[numeric_cols].dropna()
        
        if len(numeric_df) > 1:
            correlation_matrix = numeric_df.corr()
            
            plt.figure(figsize=(8, 6))
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
                       square=True, fmt='.2f')
            plt.title('Matriz de Correlação entre Métricas de Performance')
            
            if save_path:
                plt.savefig(save_path, dpi=300, bbox_inches='tight')
                print(f"Heatmap salvo em: {save_path}")
            
            plt.show()
    
    def export_to_csv(self, csv_path):
        """Exporta dados para CSV"""
        if not self.df.empty:
            self.df.to_csv(csv_path, index=False, encoding='utf-8')
            print(f"Dados exportados para: {csv_path}")

# Função principal de exemplo
def main():
    # Configuração
    JSON_FILE = 'performanceData.json'
    OUTPUT_CSV = 'performance_analysis.csv'
    PLOT_IMAGE = 'performance_plot.png'
    HEATMAP_IMAGE = 'correlation_heatmap.png'
    
    # Inicializa analisador
    analyzer = PerformanceAnalyzer(JSON_FILE)
    
    if analyzer.df.empty:
        print("Nenhum dado encontrado para análise.")
        return
    
    # Gera relatório
    print(analyzer.generate_report())
    
    # Estatísticas básicas
    print("\nEstatísticas Detalhadas:")
    stats = analyzer.basic_statistics()
    for metric, values in stats.items():
        print(f"\n{metric}:")
        for stat, value in values.items():
            print(f"  {stat}: {value}")
    
    # Cria gráficos
    analyzer.plot_metrics(PLOT_IMAGE)
    analyzer.plot_correlation_heatmap(HEATMAP_IMAGE)
    
    # Exporta para CSV
    analyzer.export_to_csv(OUTPUT_CSV)
    
    # Análises adicionais
    anomalies = analyzer.detect_anomalies()
    if anomalies:
        print("\nAnomalias detectadas:")
        for metric, info in anomalies.items():
            print(f"  {metric}: {info['quantidade_anomalias']} anomalias")
    else:
        print("\nNenhuma anomalia significativa detectada.")

if __name__ == "__main__":
    main()
