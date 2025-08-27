import json
import pandas as pd
import matplotlib.pyplot as plt

def generate_fps_report(json_file):
    """Gera relatório completo a partir do JSON"""
    
    # Ler e converter dados
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Criar relatório
    report = {
        'total_records': len(df),
        'time_period': {
            'start': df['timestamp'].min(),
            'end': df['timestamp'].max()
        },
        'fps_stats': df['fps'].describe().to_dict(),
        'by_url': df.groupby('url')['fps'].agg(['mean', 'count', 'std']).to_dict(),
        'performance_categories': pd.cut(
            df['fps'], 
            bins=[0, 29, 59, float('inf')],
            labels=['Ruim', 'Bom', 'Ótimo']
        ).value_counts().to_dict()
    }
    
    # Gerar gráficos
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    df['fps'].hist(bins=20, alpha=0.7, color='skyblue')
    plt.title('Distribuição de FPS')
    plt.xlabel('FPS')
    plt.ylabel('Frequência')
    
    plt.subplot(1, 2, 2)
    df.groupby('url')['fps'].mean().plot(kind='bar', color='lightgreen')
    plt.title('FPS Médio por URL')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    
    plt.savefig('fps_report.png', bbox_inches='tight')
    plt.close()
    
    return report, df

# Gerar relatório
report, df = generate_fps_report('fps-data.json')

print("Relatório de Análise FPS:")
print(json.dumps(report, indent=2, default=str))

# Salvar DataFrame para análise posterior
df.to_csv('fps_analysis.csv', index=False)
df.to_parquet('fps_analysis.parquet', index=False)

print(f"\nDados salvos em CSV e Parquet. Shape: {df.shape}")
