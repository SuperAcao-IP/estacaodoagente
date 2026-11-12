// URLs externas extraídas do protótipo Figma (botões "Open link" → figma.com/exit?url=…
// e hiperlinks de texto). Coletadas em 05/11/2026.

const SP_DOC = 'https://fgvbr.sharepoint.com/sites/AgentesSupervisores-Superao/Documentos%20Compartilhados/Forms/AllItems.aspx?id=%2Fsites%2FAgentesSupervisores%2DSuperao%2FDocumentos%20Compartilhados%2FTodos%20os%20munic%C3%ADpios%20%2D%20Documentos%20e%20Avisos%20Gerais%2F01%2E%20Manuais%2C%20Cadernos%20e%20Legisla%C3%A7%C3%B5es%20para%20consulta%2F';
const SP_PARENT = '&parent=%2Fsites%2FAgentesSupervisores%2DSuperao%2FDocumentos%20Compartilhados%2FTodos%20os%20munic%C3%ADpios%20%2D%20Documentos%20e%20Avisos%20Gerais%2F01%2E%20Manuais%2C%20Cadernos%20e%20Legisla%C3%A7%C3%B5es%20para%20consulta';
const SP_B = 'https://fgvbr.sharepoint.com/:b:/r/sites/AgentesSupervisores-Superao/Documentos%20Compartilhados/Todos%20os%20munic%C3%ADpios%20-%20Documentos%20e%20Avisos%20Gerais/';
const SP_B_MAN = SP_B + '01.%20Manuais,%20Cadernos%20e%20Legisla%C3%A7%C3%B5es%20para%20consulta/';
const SP_V = 'https://fgvbr.sharepoint.com/:v:/r/sites/AgentesSupervisores-Superao/Documentos%20Compartilhados/Todos%20os%20munic%C3%ADpios%20-%20Documentos%20e%20Avisos%20Gerais/02.%20SIGMA/';
const SP_STREAM = 'https://fgvbr.sharepoint.com/sites/AgentesSupervisores-Superao/_layouts/15/stream.aspx?id=';
const SP_STREAM_PDF = SP_STREAM + '/sites/AgentesSupervisores-Superao/Documentos+Compartilhados/Todos+os+munic%25u00edpios+-+Documentos+e+Avisos+Gerais/02.+SIGMA/';
const DS = 'https://www.desenvolvimentosocial.sp.gov.br/sec_desenvolv_social/';
const DE = 'https://www.desenvolvimentoeconomico.sp.gov.br/DesenvolvimentoEconomico/institucional/Programas/';

const geral = {
  oportunidades: 'https://superacao-ip.github.io/plataforma/login.html?destino=index.html',
  whatsapp: 'https://api.whatsapp.com/send?phone=5511921409019',
  sigma: 'https://sigma.sp.gov.br/',
  cadernoPoliticas: SP_DOC + '3%2E%20Cadernos%2FCaderno%20de%20Pol%C3%ADticas%20P%C3%BAblicas%20Estaduais%2Epdf' + SP_PARENT + '%2F3%2E%20Cadernos',
};

const linksUteis = {
  'SuperAção SP • Site Oficial': 'https://www.superacaosp.sp.gov.br/',
  'Portal de Serviços ao Cidadão': 'https://servicos.sp.gov.br/',
  'Sistema Único de Assistência Social': DS + 'programas-federais/Sistema%20%C3%9Anico%20de%20Assist%C3%AAncia%20Social',
  'Cadastro Único': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/cadastro%20%C3%BAnico%20(cad%C3%BAnico)',
  'Acesso ao SIGMA': geral.sigma,
};

// "Recursos utilizados" (hiperlinks de texto nas páginas da jornada)
const recursos = {
  'Manual do Agente': SP_DOC + '1%2E%20Manuais%2F20250827%2D%20Manual%20para%20Agentes%20de%20SuperAc%CC%A7a%CC%83o%2Epdf' + SP_PARENT + '%2F1%2E%20Manuais',
  'Caderno da Família': SP_DOC + '3%2E%20Cadernos%2FCaderno%20da%20fam%C3%ADlia%2Epdf' + SP_PARENT + '%2F3%2E%20Cadernos',
  'Protocolo de Visitação Domiciliar': SP_DOC + '2%2E%20Protocolos%2FProtocolo%20de%20Visita%C3%A7%C3%A3o%20Domiciliar%20%2D%202025%2Epdf' + SP_PARENT + '%2F2%2E%20Protocolos',
  'Protocolo de Proteção do Agente': SP_DOC + '2%2E%20Protocolos%2F20261001%20%2D%20Protocolo%20de%20Prote%C3%A7%C3%A3o%20do%20Agente%20%2D%20Vers%C3%A3o%20final%20digital%2Epdf' + SP_PARENT + '%2F2%2E%20Protocolos',
  'Pré-diagnóstico': SP_STREAM + '%2Fsites%2FAgentesSupervisores%2DSuperao%2FDocumentos%20Compartilhados%2FTodos%20os%20munic%C3%ADpios%20%2D%20Documentos%20e%20Avisos%20Gerais%2F02%2E%20SIGMA%2F02%2E%20Diagn%C3%B3stico%20e%20Pr%C3%A9%20diagn%C3%B3stico%2F04%20V%C3%ADdeo%20SIGMA%20%2D%20Pr%C3%A9%2DDiagn%C3%B3stico%20%2D%20Trilha%20de%20Supera%C3%A7%C3%A3o%20da%20Pobreza%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2Ebed06b55%2D30f4%2D49d1%2Da320%2D42b7b7bd8544',
  'Termo de Adesão': SP_STREAM + '%2Fsites%2FAgentesSupervisores%2DSuperao%2FDocumentos%20Compartilhados%2FTodos%20os%20munic%C3%ADpios%20%2D%20Documentos%20e%20Avisos%20Gerais%2F02%2E%20SIGMA%2F00%20Busca%20ativa%2C%20Ades%C3%A3o%20e%20Desist%C3%AAncia%2F05%20V%C3%ADdeo%20SIGMA%20%20%2D%20Termo%20de%20Ades%C3%A3o%20%2D%20Aceite%2Emp4&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview%2E324c09f6%2Dd789%2D4384%2Daa93%2Dcbad74271609',
  'Folder 10 Perguntas e respostas': 'https://drive.google.com/file/d/1zaUS_XKFexNY79xEjuNjSXMTEr2VLtd_/view',
  'Guia detalhado do EBIA': SP_B + 'EBIA/Guia_detalhado_do_EBIA.pdf?d=w61bedf70254b41ddb673d9eb5ee0ed63&csf=1&web=1&e=FBNikn',
  'Guia de bolso do EBIA': SP_B + 'EBIA/Guia_de_Bolso_EBIA_na_Pratica_Edi%C3%A7%C3%A3o%201.pdf?d=wa20e01216d124ce19d276b6c6071fda6&csf=1&web=1&e=saupDw',
  'Questionário de Diagnóstico': SP_DOC + 'Supera%C3%A7%C3%A3o%5FDiagn%C3%B3stico%20Interativo%20PDF%20%2D%202026%2Epdf' + SP_PARENT,
  'Caderno de Políticas Públicas': geral.cadernoPoliticas,
  'Guia Prático Sebrae': SP_DOC + '4%2E%20Guias%2FSebrae%5FGuia%20Pratico%20do%20Agente%2Epdf' + SP_PARENT + '%2F4%2E%20Guias',
};

// "Saiba Mais" dos cards de Políticas Públicas (por título)
const politicas = {
  'Restaurante Bom Prato': DS + 'programas%20estaduais/bom%20prato',
  'VivaLeite': DS + 'programas%20estaduais/vivaleitev2',
  'PAIF': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20b%C3%A1sica',
  'SCFV': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20b%C3%A1sica',
  'PSB Domicílio': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20b%C3%A1sica',
  'CREAS': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'PAEFI': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Auxílio-Aluguel para Mulheres Vítimas de Violência': DS + 'programas%20estaduais/aux%C3%ADlio-aluguel%20para%20mulheres%20v%C3%ADtimas%20de%20viol%C3%AAncia%20dom%C3%A9stica',
  'Casa Paulista': 'https://www.casapaulista.sp.gov.br/',
  'Pró-Conexão': 'https://www.al.sp.gov.br/repositorio/legislacao/lei/2012/lei-14687-02.01.2012.html',
  'Tarifa Social Paulista': 'https://servicos.sp.gov.br/fcarta/1E3A9D76-3F20-48EC-8542-256D88B9E0F6',
  'Estratégia Saúde da Família (ESF)': 'https://www.gov.br/saude/pt-br/composicao/saps/esf',
  'Saúde Bucal': 'https://saude.sp.gov.br/ses/perfil/profissional-da-saude/areas-tecnicas-da-sessp/saude-bucal/',
  'AME + Digital': 'https://blogsaudedigital.saude.sp.gov.br/quem-somos/ame-mais-digital-pdi/',
  'Espaço Prevenir': DS + 'programas%20estaduais/Espa%C3%A7o%20Prevenir',
  'Casas Terapêuticas': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/pol%C3%ADtica%20estadual%20sobre%20drogas/casas%20terap%C3%AAuticas%3A%20perguntas%20e%20respostas',
  'Escola de Ensino Integral': 'https://querointegral.org/onde-encontrar/',
  'Fábricas de Cultura': 'https://www.fabricasdecultura.org.br/',
  'Serviço Especializado em Abordagem Social': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Serviço para Pessoas em Situação de Rua': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Serviço de Acolhimento Institucional': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Serviço de Acolhimento em Família Acolhedora': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Serviço de Acolhimento em República': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'Serviço de Proteção em Situação de Calamidades Públicas e Emergências': DS + 'Pol%C3%ADticas%20P%C3%BAblicas/assist%C3%AAncia%20social/prote%C3%A7%C3%A3o%20social%20especial',
  'EJA': 'https://educacao.sme.prefeitura.sp.gov.br/educacao-de-jovens-e-adultos-eja/',
  'Qualifica SP': 'https://www.qualificasp.sp.gov.br/',
  'Caminho da Capacitação': 'https://www.caminhodacapacitacao.sp.gov.br/',
  'Escolas de Qualificação Profissional': 'https://www.fundosocial.sp.gov.br/escolas/',
  'CultSP Pro': 'https://www.cultsppro.org.br/',
  'BEEM': 'https://www.beem.sp.gov.br/',
  'Plataforma Trampolim': 'https://www.trampolim.sp.gov.br/pt/',
  'PAT': DE + 'pat_programa',
  'Jovem Aprendiz Paulista': DE + 'jovem_aprendiz_paulista',
  'Banco do Povo Paulista': DE + 'banco_do_povo',
  // "Educação Infantil" não tem "Saiba Mais" no protótipo.
};

// "Saiba Mais" da Biblioteca (por título, sem quebras de linha)
const biblioteca = {
  'Lei n° 18.176, de 08 de julho de 2025': 'https://www.al.sp.gov.br/repositorio/legislacao/lei/2025/lei-18176-08.07.2025.html',
  'Decreto nº 69.762, de 04 de agosto de 2025': 'https://www.al.sp.gov.br/repositorio/legislacao/decreto/2025/decreto-69762-04.08.2025.html',
  'Portaria CIB/SP n° 09, de 01 de agosto de 2025': 'https://admin.cms.sp.gov.br/dx/api/dam/v1/collections/1239b6ab-15a7-4718-bfa3-93ebe9b0b949/items/cd5a6aec-04b3-44ac-b60d-a1fc7b193e3c/renditions/7db13e51-1b4e-4f1a-8147-1ab54a8103bc?binary=true',
  'Deliberação n° 16, de 05 de agosto de 2025': 'https://www.doe.sp.gov.br/executivo/secretaria-de-desenvolvimento-social/deliberacao-n-16-de-5-de-agosto-de-2025-20250805112022031247462',
  'Resolução SEDS nº 32, de 6 de agosto de 2025': 'https://admin.cms.sp.gov.br/dx/api/dam/v1/collections/1239b6ab-15a7-4718-bfa3-93ebe9b0b949/items/63394794-b944-4d15-9974-21b433832cec/renditions/dfe6bda0-3433-46b8-b9e6-2eda307f546d?binary=true',
  'Nota Técnica DAS nº 10, de 26 de setembro de 2025': SP_B_MAN + 'Materiais%20para%20o%20per%C3%ADodo%20eleitoral/Nota%20T%C3%A9cnica%20DAS%2010_Supera%C3%A7%C3%A3o_Per%C3%ADodo%20Eleitoral.pdf?d=w3cc3146e6e044387a52acbc8b00ae28c&csf=1&web=1&e=hLB2mR',
  'Nota Técnica DAS nº 11, de 26 de setembro de 2025': SP_B_MAN + 'Materiais%20para%20o%20per%C3%ADodo%20eleitoral/Nota%20T%C3%A9cnica%20GSUAS%2011_Supera%C3%A7%C3%A3o_Per%C3%ADodo%20Eleitoral.pdf?d=w727faa93227a455a9f0fe533ad133571&csf=1&web=1&e=AfU7Xt',
  'Nota Técnica DAS nº 12, de 30 de janeiro de 2026': SP_B_MAN + 'Materiais%20para%20o%20per%C3%ADodo%20eleitoral/Nota%20T%C3%A9cnica%20DAS%2012_Supera%C3%A7%C3%A3o_Per%C3%ADodo%20Eleitoral.pdf?d=w0e1cebe4de41437388c1cf9b7a6bb4c8&csf=1&web=1&e=T7eEjN',
  'Manual para Agentes': SP_B_MAN + '1.%20Manuais/20250827-%20Manual%20para%20Agentes%20de%20SuperAc%CC%A7a%CC%83o.pdf?d=wd2ffbb339deb47109d973f386716e10a&csf=1&web=1&e=vUncNw',
  'Manual Suplementar Coordenação e Supervisão': SP_B_MAN + '1.%20Manuais/20250827%20-%20Manual%20Suplementar%20Coordenac%CC%A7a%CC%83o%20e%20Supervisa%CC%83o_vf.pdf?d=wbd63fcb72448481fbdbeffe81c830626&csf=1&web=1&e=zLBJKK',
  'Manual SIGMA SUAS para Agentes e Supervisores': SP_B + '02.%20SIGMA/99.%20Entenda%20o%20SIGMA/Manual%20SIGMA%20SP%20para%20Supervisores%20e%20Agentes%20de%20SuperAc%CC%A7a%CC%83o%20-%20versa%CC%83o%20digital.pdf?d=w8fd70c044a5d4eb98e39d6835fddf215&csf=1&web=1&e=7jS1eG',
  'Caderno da Família': SP_B_MAN + '3.%20Cadernos/Caderno%20da%20fam%C3%ADlia.pdf?d=wbb5273e625264c44aa46254e34a0e45f&csf=1&web=1&e=C9lL60',
  'Caderno de Políticas Públicas e Articulação de Serviços': SP_B_MAN + '3.%20Cadernos/Caderno%20de%20Pol%C3%ADticas%20P%C3%BAblicas%20Estaduais.pdf?d=wcd9f391ab5734b1ea9dadb790dc3a7dc&csf=1&web=1&e=4elA4f',
  'Folder 10 Perguntas e Respostas': 'https://drive.google.com/file/d/1zaUS_XKFexNY79xEjuNjSXMTEr2VLtd_/view',
  'Sebrae Guia Prático do Agente e Supervisor': SP_B_MAN + '4.%20Guias/Sebrae_Guia%20Pratico%20do%20Agente.pdf?d=w2b68f5a5c064494c8253919e2b3edb97&csf=1&web=1&e=Aq1SQs',
  'Protocolo de Visitação Domiciliar': SP_B_MAN + '2.%20Protocolos/Protocolo%20de%20Visita%C3%A7%C3%A3o%20Domiciliar%20-%202025.pdf?d=wad80405a196c4234b6d5484ec3979216&csf=1&web=1&e=DaLvrQ',
  'Protocolo de Proteção do Agente': SP_B_MAN + '2.%20Protocolos/20261001%20-%20Protocolo%20de%20Prote%C3%A7%C3%A3o%20do%20Agente%20-%20Vers%C3%A3o%20final%20digital.pdf?d=wd3c065fc41824b39bb431e6907ad3310&csf=1&web=1&e=Nz91e2',
  'Questionário de Pré e Diagnóstico Familiar': SP_B_MAN + 'Supera%C3%A7%C3%A3o_Diagn%C3%B3stico%20Interativo%20PDF%20-%202026.pdf?d=wfa3ad748a65b4b0a8c09db32b820ef0b&csf=1&web=1&e=7uG92k',
  'EBIA - Guia de Bolso': SP_B + 'EBIA/Guia_de_Bolso_EBIA_na_Pratica_Edi%C3%A7%C3%A3o%201.pdf?d=wa20e01216d124ce19d276b6c6071fda6&csf=1&web=1&e=D667hT',
  'EBIA - Guia detalhado': SP_B + 'EBIA/Guia_detalhado_do_EBIA.pdf?d=w61bedf70254b41ddb673d9eb5ee0ed63&csf=1&web=1&e=0mhaZG',
};

// "Clique e assista" dos Tutoriais SIGMA, na mesma ordem de data/tutoriais.js (grade linha a linha).
const V = {
  desistirPrograma: SP_V + '00%20Busca%20ativa,%20Ades%C3%A3o%20e%20Desist%C3%AAncia/01%20SIGMA%20-%20Desistir%20do%20programa.mp4?d=w30a2eca658974a56b15a263c725598b4&csf=1&web=1&e=hik7Vg',
  desistirQuestionario: SP_V + 'SIGMA%20-%20Desistir%20do%20question%C3%A1rio.mp4?d=wb76136786d28412f9b48ac6d4a814316&csf=1&web=1&e=Cvbsbs',
  introducao: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/00%20V%C3%ADdeo%20SIGMA%20-%20SIGMA%20SUAS%20SP%20-%20Introdu%C3%A7%C3%A3o.mp4?d=w2b2c1f8f5c354f3da8e80bb19133ec7b&csf=1&web=1&e=b5pF1c',
  esqueciSenha: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/01%20V%C3%ADdeo%20SIGMA%20-%20%20Esqueci%20minha%20senha.mp4?d=wfb4ccd02debb43c985eeca1b38e650c5&csf=1&web=1&e=Cvcpg1',
  alterarSenha: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/02%20V%C3%ADdeo%20SIGMA%20-%20%20Alterar%20a%20senha.mp4?d=w438bea8432b4499e99977a6cbf05bca0&csf=1&web=1&e=p4WKKU',
  statusBusca: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/03%20V%C3%ADdeo%20SIGMA%20-%20Status%20da%20Busca%20Ativa%20-%20Trilha%20de%20Supera%C3%A7%C3%A3o%20da%20Pobreza.mp4?d=wf39e0adf10e847c892ef9bf7b9d56a3f&csf=1&web=1&e=pO0xXQ',
  preDiagnostico: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/04%20V%C3%ADdeo%20SIGMA%20-%20Pr%C3%A9-Diagn%C3%B3stico%20-%20Trilha%20de%20Supera%C3%A7%C3%A3o%20da%20Pobreza.mp4?d=wa9dd570c5e7c4ee8881731f690a27d5b&csf=1&web=1&e=WbtpPA',
  termoAceite: SP_STREAM + '/sites/AgentesSupervisores-Superao/Documentos+Compartilhados/Todos+os+munic%25u00edpios+-+Documentos+e+Avisos+Gerais/02.+SIGMA/00+Busca+ativa,+Ades%25u00e3o+e+Desist%25u00eancia/05+V%25u00eddeo+SIGMA++-+Termo+de+Ades%25u00e3o+-+Aceite.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.e90bc21d-7029-4506-abf7-0ad990b2b4c8&ClientRender=1',
  termoUpload: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/06%20%20V%C3%ADdeo%20SIGMA%20-%20Termo%20de%20Ades%C3%A3o%20-%20Upload%20no%20sistema-.mp4?d=w127ca596b63b493aaef6e882f1a05cd0&csf=1&web=1&e=WxJCfG',
  novoAgendamento: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/07%20V%C3%ADdeo%20SIGMA%20-%20Agenda%20-%20Novo%20agendamento.mp4?d=wf95d405812ed442ba055e35340485ce5&csf=1&web=1&e=pD1rOf',
  reagendamento: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/08%20V%C3%ADdeo%20SIGMA%20-%20Agenda%20-%20Reagendamento-.mp4?d=wf056f4101bd94fe09a7f0b61ee45d8d8&csf=1&web=1&e=hbYaC7',
  cancelamento: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/09%20Agenda%20-%20Cancelamento.mp4?d=wda7d0cb6e76c4e879c86ca9e03fcbb87&csf=1&web=1&e=wv1GGZ',
  visitasConcluidas: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/10%20V%C3%ADdeo%20SIGMA%20-%20Agenda%20-%20Visitas%20conclu%C3%ADdas.mp4?d=wa25d23372abf444b827d2ecabcddf1ae&csf=1&web=1&e=V29Mug',
  trocaRF: SP_V + '00%20TUTORIAIS%20(AGOSTO26)/12%20-%20V%C3%ADdeo%20SIGMA%20-%20Troca%20de%20RF%20(Representante%20Familiar).mp4?d=weefd5fba7348465d904f52046f40a323&csf=1&web=1&e=FJaspL',
  diagIntroducoes: SP_V + '04.%20Diagn%C3%B3stico/13%20-%20V%C3%ADdeo%20SIGMA%20-%20Diagn%C3%B3stico%20-%20Introdu%C3%A7%C3%B5es.mp4?d=w147a5638d76c4f7293c8dfb6e7f84327&csf=1&web=1&e=Mryi0H',
  diagIdentificacao: SP_V + '04.%20Diagn%C3%B3stico/14%20-%20Vi%CC%81deo%20SIGMA%20-%20Diagno%CC%81stico%20-%20Aba%20Identificac%CC%A7a%CC%83o%20e%20Controles.mp4?d=wbce16b95736947bd99ca6b84cbd4640a&csf=1&web=1&e=f3CL3g',
  diagOutroTrabalho: SP_V + '04.%20Diagn%C3%B3stico/20_-_V%C3%ADdeo_SIGMA_-_Diagn%C3%B3stico_-_Aba_Outro_Trabalho.mp4?d=w27391ba5c02d4c54b44f3cd8b688865e&csf=1&web=1&e=w3cJOi',
  diagOutros: SP_V + '04.%20Diagn%C3%B3stico/21_-_Diagn%C3%B3stico_-_Aba_Outros_1.mp4?d=wfbf25161bccc4e7a98c35945584fcba3&csf=1&web=1&e=HpQoJy',
  diagEndividamento: SP_V + '04.%20Diagn%C3%B3stico/22_-_Diagn%C3%B3stico_--Aba_Endividamento-_1.mp4?d=w99650118c07f4e10b952f5c9a1dac111&csf=1&web=1&e=Ziuxng',
  diagAlocacao: SP_V + '04.%20Diagn%C3%B3stico/23_-_Diagn%C3%B3stico_-_Aba_Aloca%C3%A7%C3%A3o_de_Tempo.mp4?d=wdba902f8cfa34a1eb08dcaf97d13da40&csf=1&web=1&e=FZmnhF',
  diagSaude: SP_V + '04.%20Diagn%C3%B3stico/24_-_Diagn%C3%B3stico_-_Aba_Sa%C3%BAde.mp4?d=wab19d109162840de95037ac39e53dc8b&csf=1&web=1&e=9RrtPP',
  pdfDemandas: SP_V + '03.%20Sobre%20PDF/SIGMA%20-%20PDF%20DEMANDAS.mp4?d=wa2f87fc88fa54ec2b31fbb81439e9650&csf=1&web=1&e=JV98ck',
  ebia: SP_STREAM_PDF + '01.+Seguran%25u00e7a+Alimentar+&+EBIA/SIGMA+-+EBIA.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.b9388dcd-0b39-40a5-b60f-0518fb7ff8c0&OR=EXCEL-WEB.BODY.NT&CT=1793136597671&ClientRender=1',
  areaInteresse: SP_V + '02.%20Diagn%C3%B3stico%20e%20Pr%C3%A9%20diagn%C3%B3stico/SIGMA%20-%20Atualiza%C3%A7%C3%A3o%20Q6.36%20-%20%C3%81rea%20de%20interesse.mp4?d=wdcfa77c88c714733bd34950126e96a8d&csf=1&web=1&e=ZHohZA',
  pdfIntro: SP_STREAM_PDF + '03.+Sobre+PDF/25_-_PDF__Plano_de_Desenvolvimento_Familiar__-_Introdu%25u00e7%25u00e3o_1.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.8fa37c32-9530-4f76-98a7-7fb24ce02fb4&ClientRender=1',
  menuApresentacao: SP_STREAM_PDF + '03.+Sobre+PDF/26_-_V%25u00eddeo_SIGMA_-_PDF_-_Menu_de_Pol%25u00edticas_e_Programas_1_1.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.48dcdb96-7751-4bfb-a6b6-7cc1a9f19482&ClientRender=1',
  menuPreencher: SP_STREAM_PDF + '03.+Sobre+PDF/27_-_Menu_de_Pol%25u00edticas_e_Programas_-_Como_preencher-_1.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.feab395c-bb68-41d3-b562-fbe693ea15ef&ClientRender=1',
  estrategiasEstrutura: SP_STREAM_PDF + '03.+Sobre+PDF/28_-_PDF_-_Estrat%25u00e9gias_-_Como_ele_%25u00e9_estruturado_1.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.e9a59269-a8ff-4e55-9383-6aa336904dd0&ClientRender=1',
  cadastrarProgramas: SP_V + '03.%20Sobre%20PDF/29_-_PDF_-_Estrat%C3%A9gias_-_Como_cadastrar_os_programas_de_interesse_da_fam%C3%ADlia_1.mp4?d=w244b4a9fab724305a31b353670e69731&csf=1&web=1&e=lM8gsG',
  politicasMunicipais: SP_V + '03.%20Sobre%20PDF/31_-_PDF_-_Pol%C3%ADticas_Municipais_1.mp4?d=w5e19932562d1418ba32efb09cead0c03&csf=1&web=1&e=BoSF9S',
  historicoPDF: SP_V + '03.%20Sobre%20PDF/SIGMA%20%5BAgente%5D%20-%20Hist%C3%B3rico%20PDF%20Estrat%C3%A9gias.mp4?d=w31368efd8d8b4afe9bf8a0e80867d3e8&csf=1&web=1&e=qQnsir',
  avaliacaoProgressao: SP_V + '04%20M%C3%B3dulo%20Desenvolver/32_-_M%C3%B3dulo_Desenvolver_-_Avalia%C3%A7%C3%A3o_de_Progress%C3%A3o-_1.mp4?d=w427a8c2280994130961ca8694eb3e1d2&csf=1&web=1&e=ELH2bW',
  modalidadeEnsino: SP_V + '04%20M%C3%B3dulo%20Desenvolver/33_-_M%C3%B3dulo_Desenvolver_-_Educa%C3%A7%C3%A3o_Formal_-_Como_cadastrar_a_modalidade_de_ensino_1.mp4?d=wdf202aa96d084ecdb79f0542c3223500&csf=1&web=1&e=kce1H1',
  atualizarVisitas: SP_V + '04%20M%C3%B3dulo%20Desenvolver/34_-_Educa%C3%A7%C3%A3o_Formal_-_Como_atualizar_as_informa%C3%A7%C3%B5es_durante_as_visitas_de_acompanhamento_1.mp4?d=w9b382e30bd3d4b2eadaba51f0856bbb2&csf=1&web=1&e=6Wc0VU',
  cursosQualificacao: SP_V + '04%20M%C3%B3dulo%20Desenvolver/35_-__M%C3%B3dulo_Desenvolver_-_Qualifica%C3%A7%C3%A3o_Profissional_-_Como_cadastrar_os_cursos_de_qualifica%C3%A7%C3%A3o_profissional_1.mp4?d=w4aec4bd7f9e349d6b240b08ade9f8f3e&csf=1&web=1&e=Bs43Yl',
  justificativa: SP_STREAM_PDF + '04+M%25u00f3dulo+Desenvolver/37_-M%25u00f3dulo_Desenvolver_-_Como_introduzir_uma_justificativa_para_os_curso_com_carga_hor%25u00e1ria_inferior_a_20hs_1.mp4&referrer=StreamWebApp.Web&referrerScenario=AddressBarCopied.view.1c97d7c5-f73b-4eee-92e8-1de218a774d6&ClientRender=1',
  documentacaoFrequencia: SP_V + '04%20M%C3%B3dulo%20Desenvolver/SIGMA%20-%20M%C3%B3dulo%20Desenvolver%20-%20Documenta%C3%A7%C3%A3o%20Frequencia.mp4?d=w6f1c1e2c6a9c4c16bdf6f525141bcdca&csf=1&web=1&e=P8p16r',
  botaoDesistencia: SP_V + '00%20Busca%20ativa,%20Ades%C3%A3o%20e%20Desist%C3%AAncia/02%20SIGMA%20-%20Bot%C3%A3o%20Desist%C3%AAncia.mp4?d=wcfde68a81f104d1ab926cad5061b1450&csf=1&web=1&e=AMfZBf',
  acompSegAlimentar: SP_V + '01.%20Seguran%C3%A7a%20Alimentar%20%26%20EBIA/SIGMA%20-%20Acompanhamento%20Seguran%C3%A7a%20Alimentar%20(agente).mp4?d=wd2f405a46e7042a9832dde39f305b459&csf=1&web=1&e=ERQugG',
  aprovarPreDiag: SP_V + '08.%20Perfil%20Supervis%C3%A3o/SIGMA%20%5BSupervisor%5D%20-%20Aprovar%20edi%C3%A7%C3%A3o%20de%20pr%C3%A9-diagn%C3%B3stico.mp4?d=w19e927c2351544dda548056346104590&csf=1&web=1&e=SMZep7',
  enderecoTelefone: SP_V + 'SIGMA%20%5BAgente%20e%20Supervisor%5D%20-%20Endere%C3%A7o%20e%20telefone.mp4?d=wf9a0b96e493846119f1d03474edbffe7&csf=1&web=1&e=WXfM7p',
  // No protótipo estes dois apontam para a página "AccessDenied" do SharePoint; usamos o arquivo de origem (parâmetro Source).
  chamadoSuporte: SP_V + 'SIGMA%20-%20Chamado%20Suporte.mp4?d=we4401a7fb3814725a0f0f2cb8a3201d5&csf=1&web=1&e=g2x6vX',
  qualificacaoProfissional: SP_V + '04%20M%C3%B3dulo%20Desenvolver/36_-_V%C3%ADdeo_SIGMA_-_M%C3%B3dulo_Desenvolver_-_Qualifica%C3%A7%C3%A3o_Profissional_-_1.mp4?d=w233d3177438540399b981fe3ea43bf5d&csf=1&web=1&e=FqJ2CM',
};

// Ordem = data/tutoriais.js. Itens marcados com "repetido" usam no protótipo o mesmo link de outro vídeo.
const tutoriais = [
  V.desistirPrograma, V.desistirQuestionario,
  V.introducao, V.esqueciSenha,
  V.alterarSenha, V.statusBusca,
  V.preDiagnostico, V.termoAceite,
  V.termoUpload, V.novoAgendamento,
  V.reagendamento, V.cancelamento,
  V.visitasConcluidas, V.cancelamento, // "Aplicação da EBIA" — repetido no protótipo
  V.trocaRF, V.diagIntroducoes,
  V.diagIdentificacao, V.diagIntroducoes, // "Caracterização do Domicílio" — repetido
  V.diagIdentificacao, V.diagIntroducoes, // "Caracterização da família" / "Educação dos Indivíduos" — repetidos
  V.diagIdentificacao, V.diagOutroTrabalho, // "Trabalho" — repetido
  V.diagOutros, V.diagEndividamento,
  V.diagAlocacao, V.diagAlocacao, // "Exportar famílias elegíveis" — repetido
  V.diagSaude, V.pdfDemandas, // "Documentação Frequência" aponta para "PDF DEMANDAS"
  V.ebia, V.areaInteresse,
  V.pdfIntro, V.menuApresentacao,
  V.menuPreencher, V.estrategiasEstrutura,
  V.cadastrarProgramas, V.cadastrarProgramas, // "Atualização de registros no PDF Estratégias" — repetido
  V.politicasMunicipais, V.historicoPDF,
  V.avaliacaoProgressao, V.modalidadeEnsino,
  V.atualizarVisitas, V.cursosQualificacao,
  V.justificativa, V.documentacaoFrequencia,
  V.botaoDesistencia, V.acompSegAlimentar,
  V.cursosQualificacao, V.acompSegAlimentar, // "Gerenciador de agentes" / "Aprovação de Documentos" — repetidos
  V.aprovarPreDiag, V.enderecoTelefone,
  V.chamadoSuporte, V.qualificacaoProfissional,
];

// Página FAQ (cartões "Acessar")
const faq = {
  perguntas: 'https://projetos.fgv.br/superacaosp-jpr',
  apoioCampo: 'busca-ativa.html', // no protótipo este botão leva à página Busca Ativa
  gestaoPessoas: 'https://fgvbr.sharepoint.com/:f:/r/sites/AgentesSupervisores-Superao/Documentos%20Compartilhados/Todos%20os%20munic%C3%ADpios%20-%20Documentos%20e%20Avisos%20Gerais/Gest%C3%A3o%20de%20Pessoas?d=w77d08538766047108180d8a2bce2cd08&csf=1&web=1&e=eNbkbe',
};

module.exports = { geral, linksUteis, recursos, politicas, biblioteca, tutoriais, faq };
