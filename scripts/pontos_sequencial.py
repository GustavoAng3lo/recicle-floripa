import hashlib
import random
import time
from datetime import datetime

TOTAL_COLETAS = 100_000
PONTOS_POR_KG = {"plastico": 10, "papel": 8, "vidro": 6,
                 "metal": 12, "eletronico": 20, "organico": 3}


def gerar_coletas(qtd):
    """Gera coletas simuladas: (id_coleta, id_usuario, tipo, peso_kg)."""
    random.seed(42)
    tipos = list(PONTOS_POR_KG)
    return [(i, random.randint(1, 500), random.choice(tipos),
             round(random.uniform(0.1, 10.0), 2)) for i in range(qtd)]


def processar_coleta(coleta):
    """Valida o comprovante da coleta e calcula os pontos do usuário."""
    id_coleta, id_usuario, tipo, peso = coleta
    assinatura = f"{id_coleta}-{id_usuario}-{tipo}-{peso}".encode()
    for _ in range(100):  # simula a verificação de integridade do comprovante
        assinatura = hashlib.sha256(assinatura).digest()
    pontos = int(PONTOS_POR_KG[tipo] * peso)
    return id_usuario, pontos


def main():
    coletas = gerar_coletas(TOTAL_COLETAS)

    print(f"Início: {datetime.now():%H:%M:%S}")
    inicio = time.perf_counter()

    ranking = {}
    for coleta in coletas:
        usuario, pontos = processar_coleta(coleta)
        ranking[usuario] = ranking.get(usuario, 0) + pontos

    fim = time.perf_counter()
    print(f"Fim: {datetime.now():%H:%M:%S}")

    top3 = sorted(ranking.items(), key=lambda x: x[1], reverse=True)[:3]
    print(f"Coletas processadas: {len(coletas)}")
    print(f"Top 3 usuários (id, pontos): {top3}")
    print(f"Tempo de execução (sequencial): {fim - inicio:.2f} s")


if __name__ == "__main__":
    main()