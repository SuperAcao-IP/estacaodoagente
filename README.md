# Estação do Agente · SuperAção SP

Protótipo navegável da **Estação do Agente**, a plataforma de apoio aos agentes de campo do
programa **SuperAção SP** (Governo do Estado de São Paulo · Secretaria de Desenvolvimento
Social · apoio técnico da FGV Projetos).

O site é gerado a partir do arquivo do Figma **"FGV - Plataforma SuperAção SP"** (página
*2- Telas*). Ele reproduz as cores, os ícones, a tipografia e as interações do protótipo:
42 telas e 70 popups.

Site estático puro, feito de HTML, CSS e JavaScript. Não tem build nem servidor e está publicado no GitHub Pages:
<https://superacao-ip.github.io/estacaodoagente/>

---

## Rodar na sua máquina

Basta abrir o `index.html` com dois cliques. Ele funciona direto do disco, porque não usa `fetch`.

---

## Estrutura

```
index.html            casca da página: carrega o estilo, os dados e os scripts
css/estilo.css        estilos da casca (busca, popups, menu fixo)
js/                   a aplicação
dados/                telas e popups gerados do Figma
img/                  imagens usadas nas telas e o ícone da aba
ferramentas/          conversor do .fig para os arquivos de dados/ e img/
.nojekyll             avisa o GitHub Pages para servir os arquivos como estão
```

### Os arquivos de `js/`, na ordem em que carregam

A ordem no `index.html` **importa**: não troque.

| Arquivo | O que faz |
|---|---|
| `navegacao.js` | Abre telas e popups, ajusta o zoom à largura da janela, cuida do menu lateral fixo |
| `busca.js` | Busca do topo (procura em todas as telas e popups) e busca da Biblioteca, dos Tutoriais SIGMA e das Políticas Públicas (filtra os cards) |
| `interacoes.js` | Cliques e gestos de arrastar: executa as interações do protótipo (navegar, abrir popup, trocar, fechar, abrir link) |
| `carrossel.js` | Carrossel da Jornada na Home: os cards acompanham o dedo ou o mouse e encaixam na etapa vizinha ao soltar |
| `app.js` | Ponto de entrada: abre a tela do endereço ou a Home. Precisa ser o último |

### Os arquivos de `dados/`

| Arquivo | O que tem |
|---|---|
| `telas.js` | O HTML de cada tela e popup, com o nome do frame do Figma em comentário |
| `mapa-telas.js` | Nome e tamanho de cada tela, a tela inicial e o destino de cada interação |
| `glifos.js` | Os contornos das letras da fonte Gotham, tirados do Figma |

Os arquivos de `dados/` e `img/` são **gerados**: não edite à mão. Para mudar uma tela,
mude no Figma e gere de novo (veja abaixo).

### Por que a fonte aparece certa sem a Gotham instalada

A Gotham é uma fonte paga. O Figma guarda o desenho de cada letra, e o site desenha os textos
com esses contornos. Por isso fica idêntico ao Figma em qualquer computador. Por cima de cada
texto há uma camada invisível com o texto de verdade, que permite selecionar, copiar,
buscar e clicar nos links.

---

## Endereços

Cada tela tem um endereço próprio, que pode ser favoritado ou enviado:
`…/estacaodoagente/#s346-679` é a Home. O número é o identificador do frame no Figma.
Os botões Voltar e Avançar do navegador também funcionam.

---

## Atualizar a partir de uma nova versão do Figma

Precisa de Node e Python 3 com Pillow (`pip install pillow`).

1. No Figma, use **Arquivo → Salvar cópia local** para baixar o `.fig`.
2. Renomeie o `.fig` para `.zip` e descompacte numa pasta, por exemplo `ferramentas/.tmp/fig/`.
   Ela deve conter `canvas.fig` e a pasta `images/`.
3. Rode, a partir da raiz do repositório:

```bash
cd ferramentas && npm install && cd ..
node ferramentas/decodificar_fig.js ferramentas/.tmp/fig/canvas.fig ferramentas/.tmp/doc.json
python3 ferramentas/gerar_site.py ferramentas/.tmp/fig
```

4. Abra o `index.html` para conferir e suba as pastas `dados/` e `img/`.

A pasta `ferramentas/.tmp/` fica fora do Git (veja `.gitignore`).

### Ajustes que o gerador aplica sobre o Figma

Ficam em `ferramentas/gerar_site.py` e são reaplicados a cada geração:

- **Cores da jornada:** o título de cada etapa e o botão ativo do menu lateral usam o mesmo
  gradiente do card da etapa na Home.
- **Oportunidades:** o botão do menu e o card da Home abrem
  <https://superacao-ip.github.io/plataforma/>.
- **Tutoriais SIGMA:** quando a miniatura e o "Clique e assista" de um card apontam para vídeos
  diferentes, os dois passam a abrir o vídeo cujo nome combina com o título do card.
- **Módulo 2:** o título "O que pode entrar" fica em uma linha, sem cobrir a lista.
- **Cabeçalho:** a faixa azul-escura fica na largura da tela e alinhada à faixa do governo. Na Home, a faixa do governo usa o mesmo degradê azul das páginas internas e o cabeçalho ganha a casinha que leva à Home.
- **Carrossel:** a faixa de cards da Home recebe a posição de cada etapa, que o `carrossel.js` usa para deslizar.
- **WhatsApp:** o ícone é recortado em círculo, mantendo a sombra.
- **Perguntas frequentes:** quando um menu lateral não tem o botão, o gerador o acrescenta.
- **Telas soltas:** frames que nenhuma interação alcança ficam de fora.

---

## Pendências de conteúdo (corrigir no Figma)

- "Acessar" de **Apoio ao Campo - Operação** (FAQ) não tem link: no Figma está como "fechar".
- Card **Saúde** (Tutoriais): a miniatura aponta para o vídeo "Chamado Suporte" e o botão para "Aba Saúde". O gerador usa "Aba Saúde" nos dois.
