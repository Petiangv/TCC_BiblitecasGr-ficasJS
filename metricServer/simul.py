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
