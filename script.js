const $ = (id) => document.getElementById(id);
const months = $('months');
months.addEventListener('input', () => $('monthsValue').textContent = months.value);

let chart;
function calcProbability() {
  const educationScore = {'Primaria': 0, 'Bachillerato': 5, 'Técnico / Tecnológico': 10, 'Universitario': 15, 'Posgrado': 18}[$('education').value] || 0;
  const training = Number($('training').value);
  const finance = Number($('finance').value);
  const digital = Number($('digital').value);
  const support = Number($('support').value);
  const monthsNum = Number(months.value);
  const sectorBonus = {'Turismo y gastronomía': 2, 'Comercio': 0, 'Tecnología': 6, 'Servicios': 2, 'Manufactura': 1, 'Economía creativa': 4}[$('sector').value] || 0;
  const localityBonus = {'Centro': 5, 'Getsemaní': 4, 'Bocagrande': 6, 'La Boquilla': 0, 'Olaya Herrera': -3, 'El Pozón': -4, 'Otra localidad': 0}[$('locality').value] || 0;
  let score = 34 + educationScore + training * 8 + finance * 12 + digital * 7 + support * 7 + Math.min(monthsNum, 12) * 1.3 + sectorBonus + localityBonus;
  if ($('age').value >= 30 && $('age').value <= 50) score += 2;
  if ($('gender').value === 'Prefiero no decirlo') score -= 0; // No se usa el sexo como factor de predicción.
  score = Math.max(15, Math.min(92, Math.round(score)));
  return score;
}
function updateDashboard(event) {
  if (event) event.preventDefault();
  const score = calcProbability();
  $('probability').textContent = score + '%';
  $('probabilityCopy').textContent = score + '%';
  $('activeStat').textContent = score + '%';
  const color = score >= 70 ? '#159b55' : score >= 40 ? '#ffbf16' : '#ff514d';
  const label = score >= 70 ? 'ALTA' : score >= 40 ? 'MEDIA' : 'BAJA';
  $('gauge').style.background = `conic-gradient(${color} 0 ${score}%, #d8e0e9 ${score}% 100%)`;
  $('status').textContent = label;
  $('statusPill').style.background = score >= 70 ? '#d9f4e8' : score >= 40 ? '#fff3ce' : '#ffe0df';
  $('statusPill i').style.background = color;
  $('financeIndicator').textContent = Math.round(Number($('finance').value) * 55 + 25) + '%';
  const innovation = Math.min(95, 48 + Number($('digital').value) * 18 + ( $('sector').value === 'Tecnología' ? 15 : 6 ));
  $('innovationIndicator').textContent = innovation + '%';
  $('innovationStat').textContent = innovation + '%';
  $('profitIndicator').textContent = Math.min(88, Math.round(score * .78 + 7)) + '%';
  $('incomeStat').textContent = '$' + (Math.round((650000 + score * 8100) / 50000) * 50000).toLocaleString('es-CO');
  $('jobsStat').textContent = score >= 75 ? '2–4' : score >= 50 ? '1–2' : '1';
  const recs = [];
  if (Number($('training').value) === 0) recs.push('Buscar formación práctica en gestión financiera, ventas y formalización.');
  if (Number($('finance').value) < 1) recs.push('Explorar microcréditos, capital semilla y programas de financiación local.');
  if (Number($('digital').value) === 0) recs.push('Incorporar herramientas digitales, pagos electrónicos y canales de venta en línea.');
  if (Number($('support').value) < 1) recs.push('Solicitar acompañamiento a entidades de desarrollo empresarial.');
  recs.push('Definir metas mensuales de ingresos y revisar los costos para cuidar la rentabilidad.');
  recs.push('Medir avances durante el primer año y ajustar la propuesta según los clientes.');
  $('recommendations').innerHTML = recs.slice(0,5).map(t => `<li>${t}</li>`).join('');
  const x = [1, 3, 6, 9, 12];
  const y = x.map(m => Math.max(10, Math.min(95, Math.round(score * (0.45 + 0.55 * m / 12)))));
  if (chart) {
    chart.data.datasets[0].data = y;
    chart.update();
  }
}
const ctx = $('probabilityChart').getContext('2d');
chart = new Chart(ctx, {
  type: 'line',
  data: { labels: ['1', '3', '6', '9', '12'], datasets: [{
    label: 'Probabilidad de éxito', data: [32, 50, 64, 76, 82],
    borderColor: '#176cf5', backgroundColor: 'rgba(35,110,245,.12)', fill: true,
    borderWidth: 2.5, tension: .25, pointRadius: 4, pointHoverRadius: 6,
    pointBackgroundColor: '#176cf5'
  }]},
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.y}%` } } },
    scales: {
      x: { title: { display: true, text: 'Meses de operación', color: '#34547f', font: { size: 10 } }, grid: { color: '#e5edf9' }, ticks: { color: '#49658f' } },
      y: { min: 0, max: 100, title: { display: true, text: 'Probabilidad de éxito', color: '#34547f', font: { size: 10 } }, ticks: { stepSize: 20, callback: v => v + '%', color: '#49658f' }, grid: { color: '#e5edf9' } }
    }
  }
});
$('predictForm').addEventListener('submit', updateDashboard);
['age','gender','education','training','finance','locality','sector','digital','support'].forEach(id => $(id).addEventListener('change', updateDashboard));
$('menuToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => $('sidebar').classList.remove('open')));
updateDashboard();
