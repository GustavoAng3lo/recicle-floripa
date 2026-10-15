import json
import os
import time
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "imagens"
load_dotenv(BASE_DIR.parent / "backend" / ".env")

MODEL = "gemini-3.8-flash"
MAX_ATTEMPTS = 3
MIME_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
              ".png": "image/png", ".webp": "image/webp"}

PROMPT = """
Você é um especialista em reciclagem e sustentabilidade urbana no Brasil.
Analise a imagem enviada e retorne estritamente um objeto JSON com o seguinte formato:
{
  "item": "Nome do item identificado",
  "reciclavel": true,
  "categoria": "Plástico",
  "corLixeira": "Vermelho",
  "instrucaoPreparo": "Instrução prática e curta de como preparar o item antes do descarte",
  "pontosSugeridos": 5
}
Categorias válidas: Plástico, Papel, Vidro, Metal, Orgânico, Não Reciclável / Rejeito, Eletrônico.
Cores válidas: Vermelho, Azul, Verde, Amarelo, Marrom, Cinza.
Não adicione blocos de markdown nem texto extra fora do JSON.
"""


def list_images():
    return sorted(p for p in IMAGES_DIR.iterdir() if p.suffix.lower() in MIME_TYPES)


def analyze_image(path):
    """Envia uma foto ao Gemini e retorna (arquivo, item, categoria, tempo)."""
    client = genai.Client(
        api_key=os.environ["GEMINI_API_KEY"],
        http_options=types.HttpOptions(timeout=60_000),  # desiste após 60 s
    )
    image = types.Part.from_bytes(data=path.read_bytes(),
                                  mime_type=MIME_TYPES[path.suffix.lower()])
    config = types.GenerateContentConfig(response_mime_type="application/json")

    start = time.perf_counter()
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = client.models.generate_content(
                model=MODEL, contents=[PROMPT, image], config=config)
            result = json.loads(response.text)
            return (path.name, result.get("item"), result.get("categoria"),
                    time.perf_counter() - start)
        except Exception as error:
            if attempt == MAX_ATTEMPTS:
                return path.name, f"ERRO: {error}", "-", time.perf_counter() - start
            time.sleep(2 ** attempt)  # espera antes de tentar de novo (limite da API)


def print_results(results):
    for name, item, category, seconds in results:
        print(f"  {name:<20} -> {item} ({category}) em {seconds:.2f} s")


def main():
    if not os.getenv("GEMINI_API_KEY"):
        print("❌ GEMINI_API_KEY não encontrada em backend/.env")
        return

    images = list_images()
    print(f"Imagens: {len(images)}")
    print(f"Início: {datetime.now():%H:%M:%S}")
    start = time.perf_counter()

    results = []
    for path in images:  # uma por vez
        result = analyze_image(path)
        results.append(result)
        print(f"  ✔ {result[0]} -> {result[1]} em {result[3]:.2f} s", flush=True)

    end = time.perf_counter()
    print(f"Fim: {datetime.now():%H:%M:%S}")
    print_results(results)
    print(f"Tempo total (sequencial): {end - start:.2f} s")


if __name__ == "__main__":
    main()