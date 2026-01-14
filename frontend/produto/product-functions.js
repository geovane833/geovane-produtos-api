// Funções específicas para listagem e exibição de produtos

// Funções de salvamento de produtos (para formulários antigos)
async function salvarProduto(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imagemFile = document.getElementById('imagem').files[0];

    let imagemBase64 = null;
    if (imagemFile) {
        imagemBase64 = await fileToBase64(imagemFile);
    }

    // Garantir que os valores estão em maiúsculo
    const produtoData = {
        nome: document.getElementById('nome').value.toUpperCase(),
        codigoBarras: document.getElementById('codigoBarras').value.toUpperCase() || null,
        imagem: imagemBase64,
        descricao: document.getElementById('descricao') ? document.getElementById('descricao').value.toUpperCase() || null : null,
        observacao: document.getElementById('observacao').value.toUpperCase() || null,
        categoriaId: parseInt(document.getElementById('categoriaId').value)
    };

    console.log('Dados sendo enviados:', produtoData);

    try {
        const produto = await apiRequest('/produtos', {
            method: 'POST',
            body: JSON.stringify(produtoData)
        });

        if (typeof notificationManager !== 'undefined') {
            notificationManager.show(`Produto "${produto.nome}" cadastrado com sucesso!`, 'success');
        }
        event.target.reset();
        carregarProdutos();
    } catch (error) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Erro ao salvar produto: ' + error.message, 'error');
        }
    }
}

async function carregarProdutos() {
    try {
        const produtos = await apiRequest('/produtos');
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function buscarProdutos() {
    const nome = searchNome.value.trim();
    if (!nome) {
        carregarProdutos();
        return;
    }

    try {
        const produtos = await apiRequest(`/produtos?nome=${encodeURIComponent(nome)}`);
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Variável global para armazenar todos os produtos
let todosProdutos = [];

function exibirProdutos(produtos, filtroCategoria = '') {
    // Armazenar todos os produtos para filtros
    todosProdutos = produtos;

    // Aplicar filtro se necessário
    let produtosFiltrados = produtos;
    if (filtroCategoria) {
        produtosFiltrados = produtos.filter(produto => produto.categoriaId === parseInt(filtroCategoria));
    }

    // Atualizar estatísticas
    atualizarEstatisticas(produtosFiltrados);

    const produtosList = document.getElementById('produtosList');
    if (!produtosList) return;

    produtosList.innerHTML = '';

    if (produtosFiltrados.length === 0) {
        produtosList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <h3 style="margin-bottom: 10px;">📦 Nenhum produto encontrado</h3>
                <p>${filtroCategoria ? 'Nenhum produto encontrado para esta categoria.' : 'Nenhum produto cadastrado ainda.'}</p>
                ${filtroCategoria ? '<button onclick="filtrarProdutos()" class="btn btn-secondary" style="margin-top: 15px;">Ver todos os produtos</button>' : ''}
            </div>
        `;
        return;
    }

    // Criar tabela
    const table = document.createElement('table');
    table.className = 'data-table products-table';

    // Cabeçalho da tabela
    table.innerHTML = `
        <thead>
            <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Descrição</th>
                <th>Observação</th>
                <th>Categoria</th>
                <th>Criado em</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    // Adicionar produtos à tabela
    produtosFiltrados.forEach(produto => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                ${produto.imagem ?
                    `<img src="data:image/jpeg;base64,${arrayBufferToBase64(produto.imagem.data)}" alt="${produto.nome}" class="product-image">` :
                    '<div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Sem foto</div>'
                }
            </td>
            <td>
                <div class="product-name" title="${produto.nome}">${produto.nome}</div>
            </td>
            <td>${produto.codigoBarras || '-'}</td>
            <td>
                <div class="product-description" title="${produto.descricao || ''}">${produto.descricao || '-'}</div>
            </td>
            <td>
                <div class="product-description" title="${produto.observacao || ''}">${produto.observacao || '-'}</div>
            </td>
            <td>
                <span class="category-name">${produto.categoria ? produto.categoria.nome : 'N/A'}</span>
            </td>
            <td class="date-column">${new Date(produto.criadoEm).toLocaleDateString('pt-BR')}</td>
            <td class="actions">
                <button class="btn btn-primary" onclick="abrirModalEditarProduto(${produto.id})" title="Editar produto" style="margin-right: 5px;">✏️</button>
                <button class="btn btn-danger" onclick="deletarProduto(${produto.id})" title="Excluir produto">🗑️</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    produtosList.appendChild(table);
}

function atualizarEstatisticas(produtos) {
    const totalProdutos = document.getElementById('totalProdutos');
    const produtosComImagem = document.getElementById('produtosComImagem');
    const categoriasAtivas = document.getElementById('categoriasAtivas');

    if (totalProdutos) totalProdutos.textContent = produtos.length;
    if (produtosComImagem) produtosComImagem.textContent = produtos.filter(p => p.imagem).length;

    // Contar categorias únicas nos produtos filtrados
    const categoriasUnicas = new Set(produtos.map(p => p.categoriaId).filter(id => id));
    if (categoriasAtivas) categoriasAtivas.textContent = categoriasUnicas.size;
}

async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }

    try {
        await apiRequest(`/produtos/${id}`, {
            method: 'DELETE'
        });
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Produto excluído com sucesso!', 'success');
        }
        carregarProdutos();
    } catch (error) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Erro ao excluir produto: ' + error.message, 'error');
        }
    }
}

// Busca por EAN
async function buscarPorEAN() {
    const ean = document.getElementById('eanInput').value.trim();

    if (!ean) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Digite um código EAN para buscar', 'error');
        }
        return;
    }

    // Limpar resultado anterior
    const resultadoDiv = document.getElementById('resultadoBusca');
    const produtoDiv = document.getElementById('produtoEncontrado');
    if (resultadoDiv) resultadoDiv.style.display = 'none';
    if (produtoDiv) produtoDiv.innerHTML = '';

    try {
        const produto = await apiRequest(`/produtos/codigo/${ean}`);
        exibirProdutoEncontrado(produto);
    } catch (error) {
        if (error.message.includes('404') || error.message.includes('Not Found')) {
            exibirProdutoNaoEncontrado(ean);
        } else {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.show('Erro ao buscar produto: ' + error.message, 'error');
            }
        }
    }
}

function exibirProdutoEncontrado(produto) {
    const resultadoDiv = document.getElementById('resultadoBusca');
    const produtoDiv = document.getElementById('produtoEncontrado');

    if (!resultadoDiv || !produtoDiv) return;

    produtoDiv.innerHTML = `
        <h2>🎯 Produto Encontrado!</h2>
        ${produto.imagem ? `<img src="data:image/jpeg;base64,${arrayBufferToBase64(produto.imagem.data)}" alt="${produto.nome}" class="produto-imagem-principal">` : '<div style="width: 300px; height: 200px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px auto; color: #999;">Sem imagem</div>'}

        <div class="produto-info">
            <h3>${produto.nome}</h3>
            <p><strong>Código EAN:</strong> ${produto.codigoBarras || 'N/A'}</p>
            ${produto.observacao ? `<p><strong>Observação:</strong> ${produto.observacao}</p>` : ''}
            <p><strong>Categoria:</strong> ${produto.categoria ? produto.categoria.nome : 'N/A'}</p>
            <p><strong>Cadastrado em:</strong> ${new Date(produto.criadoEm).toLocaleString('pt-BR')}</p>
        </div>
    `;

    resultadoDiv.style.display = 'block';

    // Scroll suave para o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof notificationManager !== 'undefined') {
        notificationManager.show('Produto encontrado com sucesso!', 'success');
    }
}

function exibirProdutoNaoEncontrado(ean) {
    const resultadoDiv = document.getElementById('resultadoBusca');
    const produtoDiv = document.getElementById('produtoEncontrado');

    if (!resultadoDiv || !produtoDiv) return;

    produtoDiv.innerHTML = `
        <div class="produto-nao-encontrado">
            <h3>❌ Produto não encontrado</h3>
            <p>O código EAN <strong>${ean}</strong> não foi encontrado em nossa base de dados.</p>
            <p>Que tal cadastrar este produto?</p>
            <button class="btn btn-primary" onclick="iniciarCadastroProduto()">
                Cadastrar Produto
            </button>
        </div>
    `;

    resultadoDiv.style.display = 'block';
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
