const $ = (id) => document.getElementById(id);
const dimensionMeta = [
  {key:'finance', label:'Financiación', source:'DANE / fuentes de inclusión financiera', indicator:'Acceso a crédito productivo'},
  {key:'training', label:'Formación', source:'Secretaría de Desarrollo Económico', indicator:'Participación en capacitación empresarial'},
  {key:'markets', label:'Acceso a mercados', source:'Cámara de Comercio / MEData', indicator:'Acceso a clientes y canales comerciales'},
  {key:'infra', label:'Infraestructura', source:'Planeación Medellín / MEData', indicator:'Conectividad y acceso al transporte'},
  {key:'networks', label:'Redes de apoyo', source:'Secretaría de Desarrollo Económico', indicator:'Participación en redes empresariales'},
  {key:'safety', label:'Entorno seguro', source:'Fuentes oficiales de seguridad', indicator:'Condiciones de seguridad para operar'},
  {key:'care', label:'Economía del cuidado', source:'SICGEM / Secretaría de las Mujeres', indicator:'Disponibilidad de tiempo y apoyos de cuidado'},
  {key:'innovation', label:'Innovación', source:'DANE / Secretaría de Desarrollo Económico', indicator:'Adopción tecnológica y digitalización'}
];
const defaultValues = {finance:55,training:60,markets:58,infra:65,networks:50,safety:62,care:45,innovation:57};
// Cifras publicadas incorporadas en la interfaz. COP 16.244 millones se trata como un mínimo porque la fuente dice 'más de'.
const officialData = {soloPct:93.4, jointPct:6.4, otherPct:0.3, credits:22746, creditAmountLowerBoundCOP:16244000000, metroValueAddedSharePct:20.5, metroNominalRevenueSharePct:17.7};
const averageCreditLowerBound = officialData.creditAmountLowerBoundCOP / officialData.credits;
const weights = {finance:.17,training:.14,markets:.17,infra:.12,networks:.10,safety:.10,care:.10,innovation:.10};
const territories = [
 ['Popular','Comuna'],['Santa Cruz','Comuna'],['Manrique','Comuna'],['Aranjuez','Comuna'],['Castilla','Comuna'],['Doce de Octubre','Comuna'],['Robledo','Comuna'],['Villa Hermosa','Comuna'],['Buenos Aires','Comuna'],['La Candelaria','Comuna'],['Laureles-Estadio','Comuna'],['La América','Comuna'],['San Javier','Comuna'],['El Poblado','Comuna'],['Guayabal','Comuna'],['Belén','Comuna'],['San Sebastián de Palmitas','Corregimiento'],['San Cristóbal','Corregimiento'],['Altavista','Corregimiento'],['San Antonio de Prado','Corregimiento'],['Santa Elena','Corregimiento']
];
// Values below exist only to demonstrate interactions. They are not observations or official estimates.
const demoTerritoryScores = [48,51,50,56,58,52,60,53,61,64,68,62,54,76,63,66,45,52,49,55,57];
const state = {scenario:{...defaultValues}, appliedScenario:{...defaultValues}, importedRows:[], territory:'Medellín',year:2025,outcome:'survival'};
let trendChart, radarChart;

function weightedScore(values){return Math.round(Object.keys(weights).reduce((sum,key)=>sum+(Number(values[key]||0)*weights[key]),0));}
function band(score){if(score>=70)return {label:'Alto · ilustrativo',cls:'high',color:'#269c78'};if(score>=45)return {label:'Medio · ilustrativo',cls:'medium',color:'#e8a348'};return {label:'Bajo · ilustrativo',cls:'low',color:'#d85b6a'};}
function formatPercent(v){return `${Math.round(v)}%`;}
function renderScenario(){
  const score=weightedScore(state.scenario);
  $('scenarioScore').textContent=score;
  $('resultRing').style.background=`conic-gradient(${band(score).color} ${score*3.6}deg,#eeedf7 ${score*3.6}deg)`;
  const b=band(score);
  $('scenarioStatus').innerHTML=`<span class="status-light" style="background:${b.color}"></span><span>${b.label}</span>`;
  $('scenarioExplanation').textContent=`El índice ponderado del escenario es ${score}/100. Este valor resume los supuestos introducidos y no debe interpretarse como probabilidad real de supervivencia.`;
  $('contributionList').innerHTML=dimensionMeta.map(d=>`<div class="contribution-row"><span>${d.label}</span><div class="contribution-track"><span style="width:${state.scenario[d.key]}%"></span></div><b>${state.scenario[d.key]}</b></div>`).join('');
  dimensionMeta.forEach(d=>{$(d.key+'Out').value=state.scenario[d.key];});
}
function renderIndicators(){
  $('indicatorTable').innerHTML=dimensionMeta.map(d=>`<tr><td>${d.label}</td><td>${d.indicator}</td><td>${d.source}</td><td><span class="table-status demo">Fuente por verificar</span></td></tr>`).join('');
}
function renderTerritoryTable(){
  const query=($('territorySearch').value||'').toLocaleLowerCase('es');
  const rows=territories.map(t=>({name:t[0],type:t[1]})).filter(t=>t.name.toLocaleLowerCase('es').includes(query));
  $('territoryTable').innerHTML=rows.map(t=>`<tr><td>${t.name}</td><td>${t.type}</td><td>N/D</td><td><span class="table-status demo">Sin dato territorial comparable</span></td><td><a href="https://www.medellin.gov.co/es/secretaria-desarrollo-economico/observatorio-de-desarrollo-economico/visores-de-datos/mapas/mapa-de-estructura-empresarial/" target="_blank" rel="noopener">Observatorio ↗</a></td></tr>`).join('');
  $('tableCount').textContent=`${rows.length} de 21 territorios`;
}
function initCharts(){
  if(!window.Chart)return;
  const gridColor='#eeeef5',tickColor='#9394a7';
  trendChart=new Chart($('trendChart'),{type:'bar',data:{labels:['Lo creó una sola persona','Con otras personas','Otra categoría'],datasets:[{label:'Porcentaje de micronegocios',data:[officialData.soloPct,officialData.jointPct,officialData.otherPct],backgroundColor:['#6b5ce7','#4d91e8','#e8a348'],borderRadius:7,maxBarThickness:54}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#292842',padding:10,displayColors:false,callbacks:{label:(ctx)=>`${ctx.parsed.y}% · DANE EMICRON 2024`}}},scales:{x:{grid:{display:false},ticks:{color:tickColor,font:{size:9},maxRotation:0,minRotation:0}},y:{beginAtZero:true,max:100,grid:{color:gridColor},ticks:{color:tickColor,font:{size:9},stepSize:20,callback:(v)=>v+'%'}}}}});
  radarChart=new Chart($('radarChart'),{type:'radar',data:{labels:dimensionMeta.map(d=>d.label),datasets:[{label:'Escenario ilustrativo',data:dimensionMeta.map(d=>state.scenario[d.key]),borderColor:'#4d91e8',backgroundColor:'rgba(77,145,232,.15)',pointBackgroundColor:'#fff',pointBorderColor:'#4d91e8',pointRadius:3,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>`${ctx.parsed.r}/100 (demostración)`}}},scales:{r:{min:0,max:100,ticks:{stepSize:25,backdropColor:'transparent',color:tickColor,font:{size:8}},grid:{color:gridColor},angleLines:{color:gridColor},pointLabels:{color:'#77798d',font:{size:9}}}}}});
}
function updateKpis(){
  // No se muestra probabilidad porque los datos agregados no permiten estimar supervivencia.
  $('probabilityValue').textContent='N/D';
  $('probabilityStatus').textContent='Sin validar';
  $('probabilityStatus').className='status-pill neutral';
  $('probabilityBar').style.width='0%';
  $('indexValue').textContent=Math.round(averageCreditLowerBound).toLocaleString('es-CO');
  $('indexStatus').textContent='Cálculo derivado';
  $('indexStatus').className='status-pill neutral';
  $('indexBar').style.width='0%';
  $('qualityValue').innerHTML='5<small> indicadores oficiales</small>';
  const avg=$('averageCreditCalc'); if(avg) avg.textContent='más de '+Math.round(averageCreditLowerBound).toLocaleString('es-CO')+' COP por crédito';
  const ratio=$('creationRatio'); if(ratio) ratio.textContent=(officialData.soloPct/officialData.jointPct).toLocaleString('es-CO',{maximumFractionDigits:1})+' veces';
  $('yearLabel').textContent='Datos oficiales';
}
function refreshRadar(){if(radarChart){radarChart.data.datasets[0].data=dimensionMeta.map(d=>state.scenario[d.key]);radarChart.update();}}
function parseCSV(text){
  const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(line=>line.trim());
  if(lines.length<2)throw new Error('El archivo debe incluir encabezado y al menos una fila.');
  const parseLine=(line)=>{const out=[];let cur='',quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'&&quoted){cur+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===','&&!quoted){out.push(cur.trim());cur='';}else cur+=c;}out.push(cur.trim());return out;};
  const headers=parseLine(lines[0]).map(h=>h.toLowerCase());
  const required=['year','territory','indicator','value','source'];
  const missing=required.filter(h=>!headers.includes(h));
  if(missing.length)throw new Error('Faltan columnas obligatorias: '+missing.join(', '));
  return lines.slice(1).map((line,i)=>{const cells=parseLine(line);const row={};headers.forEach((h,j)=>row[h]=cells[j]??'');if(!row.year||!row.territory||!row.indicator||row.value===''||!row.source)throw new Error(`Fila ${i+2}: hay campos obligatorios vacíos.`);const val=Number(row.value.replace(',','.'));if(!Number.isFinite(val))throw new Error(`Fila ${i+2}: el valor no es numérico.`);row.value=val;return row;});
}
function download(filename,content,type='text/csv;charset=utf-8;'){
  const blob=new Blob(['\uFEFF'+content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function downloadTemplate(){
  const headers=['year','territory','indicator','value','source','unit','numerator','denominator','quality_status'];
  const sample=['2025','Medellín','ejemplo_indicador','','Entidad oficial','porcentaje','','','pendiente'];
  download('plantilla_indicadores_territoriales.csv',[headers.join(','),sample.map(csvEscape).join(',')].join('\n'));
}
function exportScenario(){
  const rows=[['field','value'],['territory',state.territory],['year',state.year],['outcome',state.outcome],['scenario_index',weightedScore(state.scenario)],['probability_estimate','NOT_AVAILABLE_MODEL_NOT_VALIDATED'],...dimensionMeta.map(d=>[d.key,state.scenario[d.key]])];
  download('escenario_eficacia_territorial.csv',rows.map(r=>r.map(csvEscape).join(',')).join('\n'));
}
function init(){
  dimensionMeta.forEach(d=>{$(d.key).addEventListener('input',e=>{state.scenario[d.key]=Number(e.target.value);renderScenario();refreshRadar();});});
  $('resetSliders').addEventListener('click',()=>{state.scenario={...defaultValues};dimensionMeta.forEach(d=>$(d.key).value=state.scenario[d.key]);renderScenario();refreshRadar();});
  $('useScenario').addEventListener('click',()=>{state.appliedScenario={...state.scenario};renderScenario();$('scenarioExplanation').textContent=`Índice de escenario ${weightedScore(state.appliedScenario)}/100. Es una simulación basada en controles, no un resultado calculado a partir de la muestra oficial ni una probabilidad real.`;$('scenarioScore').scrollIntoView({behavior:'smooth',block:'center'});});
  $('territorySearch').addEventListener('input',renderTerritoryTable);
  $('exportBtn').addEventListener('click',exportScenario);
  $('downloadTemplate').addEventListener('click',downloadTemplate);
  $('csvFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const rows=parseCSV(await file.text());state.importedRows=rows;$('uploadMessage').textContent=`Archivo leído correctamente: ${rows.length} registros. La importación no valida la veracidad de la fuente ni reentrena un modelo estadístico.`;$('qualityValue').textContent='—';}catch(err){$('uploadMessage').textContent='No se pudo importar: '+err.message;state.importedRows=[];}});
  $('menuToggle').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{$('sidebar').classList.remove('open');document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'));a.classList.add('active');}));
  renderScenario();renderIndicators();renderTerritoryTable();updateKpis();initCharts();
}
document.addEventListener('DOMContentLoaded',init);
