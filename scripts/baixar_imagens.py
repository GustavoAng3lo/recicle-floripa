import json
import urllib.parse
import urllib.request
from pathlib import Path

IMAGES_DIR = Path(__file__).resolve().parent / "imagens"
IMAGES_DIR.mkdir(exist_ok=True)
HEADERS = {"User-Agent": "RecicleFloripa-Estudo/1.0 (projeto academico)"}

SEARCHES = {
    "garrafa_pet": "PET bottle",
    "lata_aluminio": "aluminium can",
    "caixa_papelao": "cardboard box",
    "pote_vidro": "glass jar",
    "casca_banana": "banana peel",
    "pilha": "AA battery",
    "jornal": "newspaper",
    "celular_velho": "old mobile phone",
}


def fetch(url):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def find_image(term):
    params = {
        "action": "query", "format": "json",
        "generator": "search", "gsrsearch": f"filetype:bitmap {term}",
        "gsrnamespace": 6, "gsrlimit": 5,
        "prop": "imageinfo", "iiprop": "url|mime", "iiurlwidth": 800,
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    data = json.loads(fetch(url))
    for page in data.get("query", {}).get("pages", {}).values():
        info = page.get("imageinfo", [{}])[0]
        if info.get("mime") in ("image/jpeg", "image/png"):
            extension = ".png" if info["mime"] == "image/png" else ".jpg"
            return info.get("thumburl") or info.get("url"), extension
    return None, None


def main():
    for name, term in SEARCHES.items():
        try:
            image_url, extension = find_image(term)
            if not image_url:
                print(f"⚠️  Nenhuma imagem encontrada para: {name}")
                continue
            (IMAGES_DIR / f"{name}{extension}").write_bytes(fetch(image_url))
            print(f"✅ {name}{extension} salva")
        except Exception as error:
            print(f"❌ Erro em {name}: {error}")


if __name__ == "__main__":
    main()