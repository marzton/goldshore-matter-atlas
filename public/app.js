const table = document.querySelector('#periodic');
const search = document.querySelector('#search');
const name = document.querySelector('#elementName');
const detail = document.querySelector('#elementDetail');
let elements = [];
let current = 2;
function inspect(number) {
  current = number;
  const el = elements.find(e => e.number === number);
  if (!el) return;
  name.textContent = `${el.name} · ${el.symbol}`;
  detail.replaceChildren();
  const p = document.createElement('p');
  p.textContent = `Atomic number: ${el.number}. Chart row: ${el.period}. Chart column: ${el.group}.`;
  detail.append(p);
  const hint = document.createElement('p');
  hint.className = 'foot';
  hint.textContent = 'This baseline record does not include experimentally measured properties. They will be integrated with verified units, conditions, and citations.';
  detail.append(hint);
  render();
}
function render() {
  const term = search.value.trim().toLowerCase();
  table.replaceChildren();
  for (const el of elements) {
    if (term && !(el.name.toLowerCase().includes(term) || el.symbol.toLowerCase() === term || String(el.number) === term)) continue;
    const button = document.createElement('button');
    button.className = 'element' + (el.period === 8 ? ' lanthanide' : el.period === 9 ? ' actinide' : '') + (el.number === current ? ' active' : '');
    button.type = 'button';
    button.style.gridRow = String(el.period);
    button.style.gridColumn = String(el.group);
    button.setAttribute('aria-label', `${el.number}: ${el.name}`);
    const small = document.createElement('small'); small.textContent = el.number;
    const strong = document.createElement('strong'); strong.textContent = el.symbol;
    const span = document.createElement('span'); span.textContent = el.name;
    button.append(small, strong, span);
    button.addEventListener('click', () => inspect(el.number));
    table.append(button);
  }
  if (table.children.length === 0) table.textContent = 'No elements found.';
}
search.addEventListener('input', render);
fetch('/api/v1/elements').then(r => {if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()}).then(data => {elements=data.elements;inspect(current)}).catch(() => {table.textContent='Element data unavailable. Please try again.'});
