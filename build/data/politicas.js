// Políticas Públicas (frame 532-267 "Todos" e frames 1428-* por categoria).
// `f` = filtros (categoria) em que o card aparece nos frames de categoria do protótipo.

const categorias = [
  { id: 'protecao-social', label: 'Proteção social especializada', icon: 'escudo', figma: '1428-1232' },
  { id: 'educacao', label: 'Educação básica', icon: 'livro', figma: '1428-1950' },
  { id: 'formacao', label: 'Formação e qualificação profissional', icon: 'capelo', figma: '1428-3478' },
  { id: 'saude', label: 'Saúde e bem-estar', icon: 'saude', figma: '1428-2714' },
  { id: 'seguranca', label: 'Segurança alimentar', icon: 'talheres', figma: '1428-5006' },
  { id: 'moradia', label: 'Moradia e condições de vida', icon: 'predio', figma: '1428-5770' },
  { id: 'cultura', label: 'Cultura e cidadania', icon: 'pessoa', figma: '1428-6534' },
  { id: 'familia', label: 'Proteção e fortalecimento familiar', icon: 'casa', figma: '1428-7298' },
  { id: 'trabalho', label: 'Trabalho e geração de renda', icon: 'renda', figma: '1428-4242' },
];

// Ordem dos chips de filtro no protótipo (3 linhas).
const ordemFiltros = ['todos', 'protecao-social', 'educacao', 'saude', 'formacao', 'trabalho', 'seguranca', 'moradia', 'cultura', 'familia'];

const p = (f, cat, mod, t, d) => ({ f, cat, mod, t, d });
const PFF = 'Proteção e fortalecimento familiar';
const MCV = 'Moradia e condições de vida';
const SBE = 'Saúde e bem-estar';
const EDU = 'Educação básica';
const PSE = 'Proteção social especializada';
const FQP = 'Formação e qualificação profissional';
const TGR = 'Trabalho e geração de renda';

const politicas = [
  p('seguranca', 'Segurança Alimentar', 'Proteger', 'Restaurante Bom Prato', 'Oferece refeições a preços acessíveis para ampliar o acesso da população à alimentação adequada.'),
  p('seguranca', 'Segurança Alimentar', 'Proteger', 'VivaLeite', 'Oferece leite gratuitamente a públicos definidos pelo programa, contribuindo para a segurança alimentar e nutricional.'),
  p('familia', PFF, 'Proteger', 'PAIF', 'Serviço do CRAS que apoia famílias em situação de vulnerabilidade, fortalecendo vínculos, acesso a direitos e proteção social.'),
  p('familia', PFF, 'Proteger', 'SCFV', 'Promove atividades em grupo para fortalecer vínculos familiares e comunitários, a convivência e a participação social.'),
  p('familia', PFF, 'Proteger', 'PSB Domicílio', 'Oferece acompanhamento no domicílio a pessoas idosas ou com deficiência que enfrentam limitações para participação e acesso a direitos.'),
  p('familia', PFF, 'Proteger', 'CREAS', 'Equipamento de referência da Proteção Social Especial para famílias e pessoas que vivenciam situações de risco, violência ou violação de direitos.'),
  p('familia', PFF, 'Proteger', 'PAEFI', 'Oferece acompanhamento especializado a famílias e indivíduos que vivenciam situações de violação de direitos.'),
  p('familia', PFF, 'Proteger', 'Auxílio-Aluguel para Mulheres Vítimas de Violência', 'Apoia mulheres vítimas de violência doméstica que atendam aos critérios do programa, contribuindo para sua proteção e autonomia habitacional.'),
  p('moradia', MCV, 'Proteger', 'Casa Paulista', 'Reúne iniciativas habitacionais que ampliam o acesso à moradia, incluindo alternativas de financiamento e aquisição de imóveis.'),
  p('moradia', MCV, 'Proteger', 'Pró-Conexão', 'Apoia o acesso a serviços de saneamento básico para famílias em situação de vulnerabilidade.'),
  p('moradia', MCV, 'Proteger', 'Tarifa Social Paulista', 'Reduz o custo dos serviços de água e esgoto para famílias que atendem aos critérios da tarifa social.'),
  p('saude', SBE, 'Proteger', 'Estratégia Saúde da Família (ESF)', 'É a principal porta de entrada da atenção primária à saúde e acompanha as pessoas e famílias no território.'),
  p('saude', SBE, 'Proteger', 'Saúde Bucal', 'Oferece cuidados de saúde bucal no âmbito da atenção primária, incluindo ações de prevenção e atendimento.'),
  p('saude', SBE, 'Proteger', 'AME + Digital', 'Amplia o acesso a consultas e avaliações com especialistas por meio de atendimento mediado por tecnologia.'),
  p('saude', SBE, 'Proteger', 'Espaço Prevenir', 'Oferece acolhimento e apoio a pessoas e famílias impactadas pelo uso de substâncias psicoativas, com acesso de baixa barreira.'),
  p('saude', SBE, 'Proteger', 'Casas Terapêuticas', 'Oferecem acolhimento terapêutico residencial para pessoas que precisam de apoio no processo de cuidado relacionado ao uso de substâncias psicoativas.'),
  p('educacao', EDU, 'Proteger', 'Educação Infantil', 'Oferece jornada ampliada de ensino, com atividades voltadas ao desenvolvimento integral dos estudantes.'),
  p('educacao', EDU, 'Proteger', 'Escola de Ensino Integral', 'Oferece jornada ampliada de ensino, com atividades voltadas ao desenvolvimento integral dos estudantes.'),
  p('cultura', EDU, 'Proteger', 'Fábricas de Cultura', 'Oferecem atividades culturais e formativas, ampliando o acesso à cultura, à convivência e à participação comunitária.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço Especializado em Abordagem Social', 'Realiza busca ativa e abordagem de pessoas em situação de risco nos espaços públicos, favorecendo o acesso à rede de proteção.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço para Pessoas em Situação de Rua', 'Oferece atendimento e acompanhamento especializado a pessoas em situação de rua, articulando acesso a direitos e à rede de proteção.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço de Acolhimento Institucional', 'Oferece acolhimento provisório e proteção a pessoas que precisam ser afastadas temporariamente do convívio familiar ou comunitário.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço de Acolhimento em Família Acolhedora', 'Oferece acolhimento temporário em famílias previamente preparadas para crianças e adolescentes que precisam ser afastados de sua família de origem.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço de Acolhimento em República', 'Oferece moradia protegida e apoio à autonomia de pessoas que não dispõem de condições para permanecer ou retornar ao convívio familiar.'),
  p('protecao-social', PSE, 'Proteger', 'Serviço de Proteção em Situação de Calamidades Públicas e Emergências', 'Organiza proteção e acolhimento para pessoas e famílias afetadas por situações de calamidade pública ou emergência.'),
  p('formacao', FQP, 'Desenvolver', 'EJA', 'Possibilita a jovens, adultos e idosos retomar ou concluir a escolarização básica.'),
  p('formacao', FQP, 'Desenvolver', 'Qualifica SP', 'Oferece cursos de qualificação profissional para ampliar conhecimentos e oportunidades de inserção no mundo do trabalho.'),
  p('formacao', FQP, 'Desenvolver', 'Caminho da Capacitação', 'Oferece formação profissional alinhada às oportunidades e demandas dos territórios.'),
  p('formacao', FQP, 'Desenvolver', 'Escolas de Qualificação Profissional', 'Oferecem cursos de formação e qualificação profissional em diferentes áreas de atuação.'),
  p('formacao', FQP, 'Desenvolver', 'CultSP Pro', 'Oferece formação e qualificação para profissionais e pessoas interessadas em atuar na economia da cultura e da criatividade.'),
  p('formacao', FQP, 'Desenvolver', 'BEEM', 'Oferece oportunidade de estágio para estudantes do ensino médio, combinando experiência prática e formação para o trabalho.'),
  p('trabalho', TGR, 'Incluir', 'Plataforma Trampolim', 'Conecta pessoas a oportunidades de trabalho, qualificação e outros caminhos de inserção produtiva.'),
  p('trabalho', TGR, 'Incluir', 'PAT', 'Oferece serviços de apoio ao trabalhador, incluindo acesso a oportunidades de emprego e orientação para inserção no mercado de trabalho.'),
  p('trabalho', TGR, 'Incluir', 'Jovem Aprendiz Paulista', 'Conecta jovens a oportunidades de aprendizagem profissional, combinando experiência prática e formação.'),
  p('trabalho', TGR, 'Incluir', 'Banco do Povo Paulista', 'Oferece microcrédito produtivo para pequenos empreendedores formais e informais ampliarem ou iniciarem suas atividades.'),
];

module.exports = { categorias, ordemFiltros, politicas };
