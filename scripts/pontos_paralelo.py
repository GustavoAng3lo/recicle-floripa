import time
from datetime import datetime
from multiprocessing import Pool, cpu_count

from pontos_sequencial import gerar_coletas, processar_coleta, TOTAL_COLETAS


def executar(coletas, workers):
    """Divide as coletas entre os workers e junta o resultado no processo principal."""
    inicio = time.perf_counter()

    with Pool(processes=workers) as pool:
        bloco = len(coletas) // (workers * 4)  # tamanho do lote enviado a cada worker
        resultados = pool.map(processar_coleta, coletas, chunksize=bloco)

    # Soma feita só no processo principal: evita disputa por dados compartilhados
    ranking = {}
    for usuario, pontos in resultados:
        ranking[usuario] = ranking.get(usuario, 0) + pontos

    fim = time.perf_counter()
    return ranking, fim - inicio


def main():
    coletas = gerar_coletas(TOTAL_COLETAS)
    print(f"Núcleos disponíveis: {cpu_count()}")
    print(f"Início: {datetime.now():%H:%M:%S}")

    for workers in sorted({1, 2, 4, cpu_count()}):
        ranking, tempo = executar(coletas, workers)
        top3 = sorted(ranking.items(), key=lambda x: x[1], reverse=True)[:3]
        print(f"{workers} worker(s): {tempo:.2f} s | Top 3: {top3}")

    print(f"Fim: {datetime.now():%H:%M:%S}")


if __name__ == "__main__":
    main()