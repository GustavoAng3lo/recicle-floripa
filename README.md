# Recicle Floripa

O **Recicle Floripa** é um sistema de gerenciamento de coleta seletiva desenvolvido para otimizar o descarte de resíduos sólidos em Florianópolis. O projeto integra uma interface intuitiva com um backend robusto para identificação inteligente de materiais e gamificação.

## Integrantes
* **Luis Gustavo Angelo** (ADS - 3º Semestre)
* **Lucas de Azevedo** (ADS - 3º Semestre)
* **Henrique Hoepers** (ADS - 3º Semestre)

## Funcionalidades Principais
- **Cadastro e Login:** Autenticação segura de usuários integrada ao PostgreSQL.
- **Reconhecimento Inteligente:** Identificação automática do tipo de material (Papel, Vidro, Metal, Plástico) com base na descrição.
- **Sistema de Gamificação:** Atribuição automática de +5 pontos ao perfil do usuário para cada coleta realizada.
- **Histórico Persistente:** Listagem dinâmica de todos os descartes realizados, consumindo dados via API REST.

## Tecnologias Utilizadas
* **Frontend:** React + Vite, Axios, Lucide React, React Router.
* **Backend:** Node.js + Express.
* **Banco de Dados:** PostgreSQL.

---

## Como rodar o projeto localmente

### Pré-requisitos
* Node.js instalado (versão LTS).
* PostgreSQL configurado e em execução.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/GustavoAng3lo/recicle-floripa.git](https://github.com/GustavoAng3lo/recicle-floripa.git)