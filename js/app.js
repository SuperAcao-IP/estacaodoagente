/* Ponto de entrada: abre a tela do endereço (#s123-456) ou a Home. Precisa ser o último script. */
const inicial=location.hash.slice(2).replace('-',':');
show(META[inicial]?inicial:START,false); history.replaceState({s:cur},'', '#s'+cur.replace(':','-'));
