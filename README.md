# Estação do Agente • SuperAção SP — site HTML

Recriação em HTML/CSS/JS do protótipo Figma
**"FGV - Plataforma SuperAção SP"**, atualizada a partir do arquivo
`121126 _ FGV - Plataforma SuperAção SP.fig` (fonte de verdade atual),
no tamanho de referência do frame *Tablet - Campo (Horizontal)* — **1194 px** de largura.

## Como abrir

Os arquivos `.html` funcionam abrindo direto no navegador (`index.html`).
Para servir localmente:

```bash
node build/serve.js
```

e acesse <http://localhost:5173>.

## Páginas

| Arquivo | Frame no Figma |
| --- | --- |
| `index.html` | Tablet • Home • Stage 1 (346:679) |
| `busca-ativa.html` | Busca Ativa (453:4148) |
| `visita-1.html` | Visita 1 • Conhecendo a família (494:150) |
| `visitas-2-e-3.html` | Visitas 2 e 3 • Compreendendo a realidade familiar (494:527) |
| `visitas-4-e-5.html` | Visitas 4 e 5 • Planejando o caminho (494:904) |
| `visitas-mensais.html` | Visitas mensais • Acompanhando a jornada (494:1281) |
| `conclusao.html` | Conclusão • Acompanhamento de concluintes (494:1658) |
| `politicas-publicas.html` | Políticas Públicas — "Todos" (532:267) + 9 categorias (1428:*) como filtros |
| `tutoriais-sigma.html` | Tutoriais SIGMA (1134:527) + 10 filtros (1446:17660, 1439:*) |
| `biblioteca.html` | Biblioteca (999:372) + 5 filtros (1455:*) |
| `links-uteis.html` | Links úteis (1066:538) |
| `modulos-e-incentivos.html` | Módulos e incentivos (1064:48) + popups Módulo 1/2/3 (913:7460, 930:2, 942:87) |
| `faq.html` | Perguntas frequentes (FAQ) (1973:2) |

Popups (abrem sobre a página, fecham com "Fechar", clique fora ou Esc):

- **Passos das etapas** — cada número da trilha de passos abre o seu popup, com as abas
  **COMO FAZER / EVITAR**, o "Lembre-se" de cada aba e os botões **Anterior / Próximo**
  (frames "Popup … Como Fazer / Evitar"; textos em `build/data/popups.json`).
- **Módulos** — os cards "1 • PROTEGER", "2 • DESENVOLVER", "3 • INCLUIR" e as pílulas da tabela
  "Duração da trilha" abrem o popup do módulo; os botões verdes do topo trocam de módulo.
- **Legenda da Biblioteca** — botão "Legenda" no painel de filtros (frames 1989:3246…3331).

Os frames de filtro do Figma (uma tela por categoria) viraram **uma página com filtro**:
os chips filtram os cards e a URL guarda o filtro (`politicas-publicas.html#saude`,
`tutoriais-sigma.html#agenda`, `biblioteca.html#manuais`).

## Estrutura

```
index.html, *.html        páginas geradas (não edite à mão)
assets/css/style.css      estilos (cores, medidas e tipografia do Figma)
assets/js/main.js         carrossel, filtros, popup e busca do cabeçalho
assets/js/search-index.js índice da busca (gerado)
assets/img/               miniatura do vídeo (imagem original do Figma) e favicon
build/build.js            gerador das páginas (templates de cabeçalho, menu, rodapé…)
build/data/*.js           textos de cada página (etapas, políticas, tutoriais, biblioteca)
build/data/popups.json    textos dos popups dos passos (extraídos do .fig)
build/data/figma-icons.json  ícones exportados do .fig como SVG
build/icons.js            fig(nome) para os ícones do .fig + alguns ícones de linha (setas)
build/serve.js            servidor estático para visualização local
```

Para alterar textos ou itens, edite `build/data/*.js` e rode:

```bash
node build/build.js
```

## Observações

- **Fonte:** o protótipo usa **Gotham** (licenciada). O CSS chama `Gotham` primeiro (se estiver
  instalada, é usada) e cai para **Montserrat** (Google Fonts), a alternativa gratuita de métricas
  mais próximas. Rodapé e alguns botões usam **Inter**, como no Figma.
- **Ícones:** exportados diretamente dos vetores do .fig (`build/data/figma-icons.json`), com
  `currentColor` onde o ícone tem uma só cor; só as setas de "Voltar" e Anterior/Próximo são
  desenhadas à mão.
- **Links externos** foram extraídos do próprio protótipo (botões "Open link" do Figma e
  hiperlinks de texto) e ficam em `build/data/links.js`: Oportunidades, WhatsApp de apoio,
  Links úteis, recursos das etapas, "Saiba Mais" (Políticas e Biblioteca) e "Clique e assista"
  (Tutoriais). Todos abrem em nova aba. Observações sobre o que veio do protótipo:
  - Em Tutoriais SIGMA, alguns cartões repetem o link de outro vídeo no Figma (ex.: "Aplicação
    da EBIA" abre "Agenda – Cancelamento"); estão marcados com comentário em `links.js`.
  - "Chamado de suporte" e "Qualificação profissional" apontavam para a página "AccessDenied"
    do SharePoint; foi usado o arquivo de origem indicado nessa página.
  - O cartão "Educação Infantil" não tem "Saiba Mais" no protótipo.
  - Em Links úteis e Módulos o botão "Clique aqui e receba apoio" não tinha link no Figma; no
    site ele usa o mesmo WhatsApp das demais páginas.
- **FAQ:** "Perguntas e Respostas - Site FGV Projetos" e "Gestão de Pessoas" abrem links externos;
  no .fig, o botão de "Apoio ao Campo - Operação" leva à página Busca Ativa, e o site mantém isso
  (`build/data/links.js`, objeto `faq`).
- No popup do **Módulo 2**, a linha "Colocar os prérequisitos para o recebimento (ex: comprovante
  de matrícula)" é uma anotação do próprio .fig; foi mantida como está até haver o texto final.
- O *Frame 607* (Flow 4) é um quadro de rascunho interno com cards de vídeo e anotações
  ("Problema no link (conferir planilha)"); seu conteúdo está coberto pela página Tutoriais SIGMA.
