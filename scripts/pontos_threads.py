import os
import threading
import time
from multiprocessing import Pool, cpu_count

from pontos_sequencial import gerar_coletas, processar_coleta, TOTAL_COLETAS


def processar_lote(lote):
    """Processa um lote de coletas e informa o PID de quem processou."""
    resultados = [processar_coleta(c) for c in lote]
    return resultados, os.getpid()


def dividir(coletas, partes):
    tamanho = -(-len(coletas) // partes)  # divisão arredondando para cima
    return [coletas[i:i + tamanho] for i in range(0, len(coletas), tamanho)]


def somar(listas):
    ranking = {}
    for resultados in listas:
        for usuario, pontos in resultados:
            ranking[usuario] = ranking.get(usuario, 0) + pontos
    return ranking


def top3(ranking):
    return sorted(ranking.items(), key=lambda x: x[1], reverse=True)[:3]


class TarefaThread(threading.Thread):
    """Mesma ideia da classe Tarefa_t do exemplo do professor."""
    def __init__(self, lote):
        super().__init__()
        self.lote = lote
        self.saida = None

    def run(self):
        self.saida = processar_lote(self.lote)


def com_processos(coletas, n):
    inicio = time.perf_counter()
    with Pool(processes=n) as pool:
        saidas = pool.map(processar_lote, dividir(coletas, n))
    ranking = somar(s[0] for s in saidas)
    return ranking, time.perf_counter() - inicio, {s[1] for s in saidas}


def com_threads(coletas, n):
    inicio = time.perf_counter()
    threads = [TarefaThread(lote) for lote in dividir(coletas, n)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    ranking = somar(t.saida[0] for t in threads)
    return ranking, time.perf_counter() - inicio, {t.saida[1] for t in threads}


def main():
    coletas = gerar_coletas(TOTAL_COLETAS)

    inicio = time.perf_counter()
    ranking_seq = somar([[processar_coleta(c) for c in coletas]])
    tempo_seq = time.perf_counter() - inicio
    print(f"Sequencial: {tempo_seq:.2f} s | PID {os.getpid()}")

    for n in (4, cpu_count()):
        ranking, tempo, pids = com_processos(coletas, n)
        print(f"Processos ({n}): {tempo:.2f} s | {tempo_seq / tempo:.2f}x | "
              f"PIDs diferentes: {len(pids)} | mesmo Top 3: {top3(ranking) == top3(ranking_seq)}")

        ranking, tempo, pids = com_threads(coletas, n)
        print(f"Threads   ({n}): {tempo:.2f} s | {tempo_seq / tempo:.2f}x | "
              f"PIDs diferentes: {len(pids)} | mesmo Top 3: {top3(ranking) == top3(ranking_seq)}")


if __name__ == "__main__":
    main()