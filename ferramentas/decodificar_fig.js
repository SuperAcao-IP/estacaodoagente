// Lê o .fig (formato kiwi do Figma) e grava doc.json + blobs.json.
// Uso: node ferramentas/decodificar_fig.js <pasta>/canvas.fig ferramentas/.tmp/doc.json
const fs=require('fs'),kiwi=require('kiwi-schema'),pako=require('pako'),fz=require('fzstd');
const b=fs.readFileSync(process.argv[2]);let o=12;const ch=[];
while(o<b.length){const n=b.readUInt32LE(o);o+=4;ch.push(b.subarray(o,o+n));o+=n;}
const un=c=>{try{return pako.inflateRaw(c)}catch(e){return fz.decompress(c)}};
const schema=kiwi.compileSchema(kiwi.decodeBinarySchema(un(ch[0])));
const msg=schema.decodeMessage(un(ch[1]));
fs.writeFileSync(process.argv[3],JSON.stringify(msg,(k,v)=>typeof v==='bigint'?Number(v):(v instanceof Uint8Array?('hex:'+Buffer.from(v).toString('hex').slice(0,80)):v)));
console.log('nós decodificados:', msg.nodeChanges.length);
fs.writeFileSync(require('path').join(require('path').dirname(process.argv[3]),'blobs.json'),JSON.stringify(msg.blobs.map(b=>Buffer.from(b.bytes).toString('base64'))));
