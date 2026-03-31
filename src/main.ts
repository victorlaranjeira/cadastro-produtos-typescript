// 1. Definição da Interface 
interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  descricao: string;
  imagem: string;
  status: boolean;
}

// 2. Seleção de Elementos (Type Casting)
const form = document.getElementById('produto-form') as HTMLFormElement;
const listaContainer = document.getElementById('lista-produtos') as HTMLDivElement;
const filtroCat = document.getElementById('filtro-categoria') as HTMLSelectElement;
const btnOrdem = document.getElementById('ordenar-preco') as HTMLButtonElement;
const inputId = document.getElementById('produto-id') as HTMLInputElement;

// 3. Estado da Aplicação (Lendo do LocalStorage)
let produtos: Produto[] = JSON.parse(localStorage.getItem('produtos_db') || '[]');

// 4. Função para Salvar/Editar
form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const id = inputId.value;
  
  const novoProduto: Produto = {
      id: id ? Number(id) : Date.now(),
      nome: (document.getElementById('nome') as HTMLInputElement).value,
      categoria: (document.getElementById('categoria') as HTMLSelectElement).value,
      preco: parseFloat((document.getElementById('preco') as HTMLInputElement).value),
      quantidade: parseInt((document.getElementById('quantidade') as HTMLInputElement).value),
      descricao: (document.getElementById('descricao') as HTMLTextAreaElement).value,
      imagem: (document.getElementById('imagem') as HTMLInputElement).value,
      status: (document.getElementById('status') as HTMLInputElement).checked
  };

  if (id) {
      const index = produtos.findIndex(p => p.id === Number(id));
      if (index !== -1) produtos[index] = novoProduto;
  } else {
      produtos.push(novoProduto);
  }

  renderizar();
  form.reset();
  inputId.value = '';
});

// 5. Função para Renderizar a Lista
function renderizar(dados: Produto[] = produtos): void {
  localStorage.setItem('produtos_db', JSON.stringify(produtos));
  listaContainer.innerHTML = '';

  if (dados.length === 0) {
      listaContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 py-10">Nenhum produto encontrado.</p>`;
      return;
  }

  dados.forEach((p) => {
      const card = document.createElement('div');
      card.className = `bg-white p-4 rounded-xl shadow border-l-4 ${p.status ? 'border-green-500' : 'border-red-500'} transition-all hover:shadow-md`;
      
      card.innerHTML = `
          <img src="${p.imagem}" alt="${p.nome}" class="w-full h-40 object-cover rounded-lg mb-3 shadow-sm">
          <div class="flex justify-between items-start">
              <div>
                  <h3 class="font-bold text-lg text-slate-800">${p.nome}</h3>
                  <span class="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-500">${p.categoria}</span>
              </div>
              <p class="text-blue-600 font-bold text-lg">R$ ${p.preco.toFixed(2)}</p>
          </div>
          <p class="text-sm text-gray-500 mt-2 line-clamp-2">${p.descricao || 'Sem descrição.'}</p>
          <p class="text-xs mt-1 text-gray-400">Estoque: ${p.quantidade} unidades</p>
          
          <div class="flex gap-2 mt-4">
              <button onclick="window.prepararEdicao(${p.id})" class="flex-1 bg-amber-100 text-amber-700 font-bold py-2 rounded-lg hover:bg-amber-200 transition text-sm">Editar</button>
              <button onclick="window.excluirProduto(${p.id})" class="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-lg hover:bg-red-200 transition text-sm">Excluir</button>
          </div>
      `;
      listaContainer.appendChild(card);
  });
}

// 6. Funções Globais (Expostas para o HTML)
(window as any).excluirProduto = (id: number) => {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
      produtos = produtos.filter(p => p.id !== id);
      renderizar();
  }
};

(window as any).prepararEdicao = (id: number) => {
  const p = produtos.find(prod => prod.id === id);
  if (!p) return;

  inputId.value = p.id.toString();
  (document.getElementById('nome') as HTMLInputElement).value = p.nome;
  (document.getElementById('categoria') as HTMLSelectElement).value = p.categoria;
  (document.getElementById('preco') as HTMLInputElement).value = p.preco.toString();
  (document.getElementById('quantidade') as HTMLInputElement).value = p.quantidade.toString();
  (document.getElementById('descricao') as HTMLTextAreaElement).value = p.descricao;
  (document.getElementById('imagem') as HTMLInputElement).value = p.imagem;
  (document.getElementById('status') as HTMLInputElement).checked = p.status;

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 7. Filtros e Ordenação
filtroCat.addEventListener('change', () => {
  const selecionada = filtroCat.value;
  const filtrados = selecionada === 'todos' ? produtos : produtos.filter(p => p.categoria === selecionada);
  renderizar(filtrados);
});

btnOrdem.addEventListener('click', () => {
  const ordenados = [...produtos].sort((a, b) => a.preco - b.preco);
  renderizar(ordenados);
});

// Inicialização
renderizar();