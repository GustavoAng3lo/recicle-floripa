import sys
import time
from datetime import datetime
from multiprocessing import Pool

from ia_sequencial import analyze_image, list_images, print_results


def main():
    workers = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    images = list_images()
    print(f"Imagens: {len(images)} | Workers: {workers}")
    print(f"Início: {datetime.now():%H:%M:%S}")
    start = time.perf_counter()

    # Cada worker é um processo separado com seu próprio cliente do Gemini
    with Pool(processes=workers) as pool:
        results = pool.map(analyze_image, images)

    end = time.perf_counter()
    print(f"Fim: {datetime.now():%H:%M:%S}")
    print_results(results)
    print(f"Tempo total (paralelo, {workers} workers): {end - start:.2f} s")


if __name__ == "__main__":
    main()