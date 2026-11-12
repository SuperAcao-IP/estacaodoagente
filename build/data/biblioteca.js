// Biblioteca de materiais (frame 999-372 e filtros 1455-*).
const filtros = [
  { id: 'todos', label: 'Todos' },
  { id: 'normativos', label: 'Normativos', figma: '1455-18744' },
  { id: 'manuais', label: 'Manuais', figma: '1455-19572' },
  { id: 'protocolos', label: 'Protocolos', figma: '1455-20400' },
  { id: 'instrumentos', label: 'Instrumentos', figma: '1455-21228' },
  { id: 'guias', label: 'Guias', figma: '1455-22056' },
];

const d = (f, t, desc) => ({ f, t, d: desc });

const documentos = [
  d('normativos', 'Lei n° 18.176,<br>de 08 de julho de 2025', 'Institui o Programa de Superação da Pobreza no Estado de São Paulo'),
  d('normativos', 'Decreto nº 69.762,<br>de 04 de agosto de 2025', 'Regulamenta a Lei n° 18.176, de 8 de julho de 2025, que institui o Programa de Superação da Pobreza no Estado de São Paulo e dá providências correlatas.'),
  d('normativos', 'Portaria CIB/SP n° 09,<br>de 01 de agosto de 2025', 'Pactua e aprova os critérios, valores e procedimentos para a concessão dos auxílios e incentivos às famílias e para o cofinanciamento estadual aos municípios no âmbito do Programa.'),
  d('normativos', 'Deliberação n° 16,<br>de 05 de agosto de 2025', 'Dispõe sobre a aprovação de critérios, valores, e procedimento para a consessão dos auxílios e incentivos às famílias e para o cofinanciamento estadual aos municípios no âmbito do Programa SuperAção SP.'),
  d('normativos', 'Resolução SEDS nº 32,<br>de 6 de agosto de 2025', 'Regulamenta, no âmbito da Secretaria de Desenvolvimento Social, o Decreto nº 69.762, de 4 de agosto de 2025, que regulamenta a Lei nº 18.176, de 8 de julho de 2025, que institui o Programa de Superação da Pobreza no Estado de São Paulo e dá providências correlatas'),
  d('normativos', 'Nota Técnica DAS nº 10,<br>de 26 de setembro de 2025', 'Orientações Técnicas para a atuação da Proteção Social Básica e do Centro de Referência da Assistência Social – CRAS no âmbito das ações do Programa SuperAção.'),
  d('normativos', 'Nota Técnica DAS nº 11,<br>de 26 de setembro de 2025', 'Orientações Técnicas para a Gestão do Sistema Único de Assistência Social e das equipes de Vigilância Socioassistencial no âmbito das ações do Programa SuperAção.'),
  d('normativos', 'Nota Técnica DAS nº 12,<br>de 30 de janeiro de 2026', 'Orientações Técnicas para a atuação das equipes municipais da Assistência Social no acompanhamento das famílias no âmbito da Trilha de Proteção Social do Programa SuperAção SP.'),
  d('manuais', 'Manual para Agentes', 'Manual de apoio ao dia a dia dos Agentes, reunindo informações sobre o Programa SuperAção SP, suas ferramentas e a tomada de decisões em cada etapa da jornada com as famílias.'),
  d('manuais', 'Manual Suplementar<br>Coordenação e Supervisão', 'Complementa o Manual para Agentes de SuperAção e os demais documentos técnicos do Programa, reunindo orientações sobre responsabilidades e práticas para apoiar as decisões cotidianas, em alinhamento à metodologia do Programa.'),
  d('manuais', 'Manual SIGMA SUAS para<br>Agentes e Supervisores', 'Manual de apresentação e orientação de uso e navegação no SIGMA'),
  d('guias', 'Caderno da Família', 'Ferramenta prática que acompanha toda a jornada da família no Programa. É entregue no início do acompanhamento, após a adesão da família, e serve como um espaço de registro e construção conjunta entre família e agente.'),
  d('guias', 'Caderno de Políticas Públicas<br>e Articulação de Serviços', 'Reúne políticas públicas, serviços e programas estaduais que apoiam a superação e autonomia das famílias.'),
  d('', 'Folder<br>10 Perguntas e Respostas', 'Livreto com 10 perguntas e respostas sobre o Programa.'),
  d('guias', 'Sebrae Guia Prático do<br>Agente e Supervisor', 'Guia Sebrae de empreendedorismo, para apoiar os agentes na identificação de potenciais e proposição de capacitações disponíveis.'),
  d('protocolos', 'Protocolo de<br>Visitação Domiciliar', 'Documento de orientação para visitação domiciliar'),
  d('protocolos', 'Protocolo de Proteção do Agente', 'Documento de orientação e proteção institucional que fortalece a atuação consciente, reduz improvisos e apoia tomada de decisões em situações críticas e de tensão.'),
  d('instrumentos', 'Questionário de Pré e<br>Diagnóstico Familiar', 'Arquivo PDF que espelha as abas e campos do questionário do SIGMA'),
  d('guias', 'EBIA - Guia de Bolso', 'Guia de consulta rápida, com orientações essenciais para uma aplicação padronizada, respeitosa e segura.'),
  d('guias', 'EBIA - Guia detalhado', 'Guia com orientações para compreender e aplicar a EBIA, conduzir a entrevista e registrar as respostas no SIGMA.'),
];

module.exports = { filtros, documentos };
