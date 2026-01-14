// Script principal - importa todos os módulos
// Este arquivo coordena a inicialização e importa todos os módulos necessários

// Importar módulos na ordem correta (dependências primeiro)
import('./shared/utils.js');
import('./shared/api.js');
import('./shared/modal-functions.js');
import('./shared/ui-functions.js');
import('./produto/product-functions.js');
import('./categoria/category-functions.js');

// Configuração global da API
window.API_BASE_URL = 'http://localhost:3000';

// Funções para abrir modais criados dinamicamente
function abrirModalProduto() {
    // Criar modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    // HTML do modal
    modalOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 800px; width: 95%; max-width: min(800px, 95vw); background: white; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); max-height: 90%; overflow: hidden;">
            <div class="modal-header" style="padding: 25px 30px 15px; border-bottom: 1px solid #eee; text-align: center;">
                <span class="modal-icon" style="font-size: 2em; display: block; margin-bottom: 10px;">📦</span>
                <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 1.5em;">Cadastrar Produto</h2>
                <p style="margin: 0; color: #666; font-size: 14px;">Digite o código de barras para buscar automaticamente as informações do produto</p>
            </div>
            <div class="modal-body" style="padding: 20px 30px;">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="codigoBarrasModal" style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Código de Barras *</label>
                    <input type="text" id="codigoBarrasModal" placeholder="Ex: 7891234567890" maxlength="18" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 16px;">
                    <small style="color: #666; font-size: 12px;">Digite o código EAN do produto</small>
                </div>
                <div id="produtoInfo" style="display: none; margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                    <h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.2em;">📋 Produto Encontrado:</h4>
                    <div id="produtoPreview" style="display: grid; grid-template-columns: 120px 1fr; gap: 20px; align-items: start;">
                        <!-- Imagem e informações serão inseridas aqui -->
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding: 15px 30px 25px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="fecharModal()" style="padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; background: #95a5a6; color: white;">Cancelar</button>
                <button class="btn btn-primary" onclick="buscarProdutoPorCodigo()" id="btnBuscar" style="padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; background: linear-gradient(135deg, #3498db, #2980b9); color: white;">🔍 Buscar Produto</button>
                <button class="btn btn-success" onclick="mostrarModalFinalizarCadastro()" id="btnPreencher" style="display: none; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; background: linear-gradient(135deg, #27ae60, #229954); color: white;">✅ Usar Este Produto</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Focar no input
    setTimeout(() => {
        const input = modalOverlay.querySelector('#codigoBarrasModal');
        if (input) input.focus();
    }, 100);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

function abrirModalCategoria() {
    // Criar modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // HTML do modal
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-icon">🏷️</span>
                <h2>Cadastrar Categoria</h2>
                <p>Adicione uma nova categoria ao sistema</p>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="categoriaNome">Nome da Categoria *</label>
                    <input type="text" id="categoriaNome" required placeholder="Ex: Bebidas, Alimentos" oninput="this.value = this.value.toUpperCase()">
                    <small>Digite o nome da nova categoria</small>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="cadastrarCategoria()" id="btnCadastrarCategoria">🚀 Cadastrar Categoria</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Focar no input
    setTimeout(() => {
        const input = modalOverlay.querySelector('#categoriaNome');
        if (input) input.focus();
    }, 100);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

function abrirModalEditarProduto(produtoId) {
    // Definir o ID do produto para edição
    window.produtoParaEditar = produtoId;

    // Criar modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // HTML do modal (será carregado dinamicamente)
    modalOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <span class="modal-icon">✏️</span>
                <h2>Editar Produto</h2>
                <p>Modifique os dados do produto conforme necessário</p>
            </div>
            <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                <div style="text-align: center; padding: 40px;">
                    <div class="loading" style="width: 40px; height: 40px; margin: 0 auto 20px;"></div>
                    <p>Carregando dados do produto...</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="salvarEdicaoProduto()" id="btnSalvarEdicao" style="display: none;">💾 Salvar Alterações</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Carregar dados do produto
    carregarDadosProdutoEdicao(produtoId, modalOverlay);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

// Função auxiliar para fechar modal
function fecharModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// Função auxiliar para carregar dados do produto para edição
async function carregarDadosProdutoEdicao(produtoId, modalOverlay) {
    try {
        const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/produtos/${produtoId}`);
        const produto = await response.json();

        if (response.ok) {
            // Atualizar o conteúdo do modal
            const modalBody = modalOverlay.querySelector('.modal-body');
            const btnSalvar = modalOverlay.querySelector('#btnSalvarEdicao');

            // Buscar categorias
            const categoriasResponse = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/categorias`);
            const categorias = await categoriasResponse.json();

            modalBody.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Nome do Produto *</label>
                        <input type="text" id="editNome" value="${produto.nome || ''}" required style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Código de Barras</label>
                        <input type="text" id="editCodigoBarras" value="${produto.codigoBarras || ''}" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Categoria *</label>
                    <select id="editCategoriaId" required style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px;">
                        <option value="">Selecione uma categoria</option>
                        ${categorias.map(cat => `<option value="${cat.id}" ${cat.id === produto.categoriaId ? 'selected' : ''}>${cat.nome}</option>`).join('')}
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Descrição</label>
                    <textarea id="editDescricao" placeholder="Descrição detalhada do produto" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px; min-height: 60px; resize: vertical;">${produto.descricao || ''}</textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Observação</label>
                    <textarea id="editObservacao" placeholder="Observações adicionais" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px; min-height: 60px; resize: vertical;">${produto.observacao || ''}</textarea>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Nova Imagem (opcional)</label>
                    <input type="file" id="editImagem" accept="image/*" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px;">
                    <small style="color: #7f8c8d;">Deixe em branco para manter a imagem atual</small>
                </div>
            `;

            btnSalvar.style.display = 'inline-block';
        } else {
            throw new Error('Erro ao carregar dados do produto');
        }
    } catch (error) {
        console.error('Erro:', error);
        modalOverlay.querySelector('.modal-body').innerHTML = `
            <div style="text-align: center; color: #e74c3c; padding: 40px;">
                <h4>❌ Erro ao carregar dados</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}



async function buscarProdutoPorCodigo() {
    console.log('🔍 Iniciando busca de produto por código...');

    const codigoBarras = document.getElementById('codigoBarrasModal').value.trim();
    console.log('📝 Código de barras digitado:', codigoBarras);

    if (!codigoBarras) {
        console.log('❌ Código de barras vazio');
        alert('Digite um código de barras');
        return;
    }

    const btnBuscar = document.getElementById('btnBuscar');
    const btnPreencher = document.getElementById('btnPreencher');
    const produtoInfo = document.getElementById('produtoInfo');
    const produtoPreview = document.getElementById('produtoPreview');

    console.log('🎯 Elementos encontrados:', {
        btnBuscar: !!btnBuscar,
        btnPreencher: !!btnPreencher,
        produtoInfo: !!produtoInfo,
        produtoPreview: !!produtoPreview
    });

    // Mostrar loading
    btnBuscar.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div> Buscando...';
    btnBuscar.disabled = true;

    try {
        // Buscar através do backend (proxy para API externa)
        const responseExterna = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/produtos/buscar-externo/${codigoBarras}`);

        if (!responseExterna.ok) {
            // Produto não encontrado
            produtoPreview.innerHTML = `
                <div style="text-align: center; color: #7f8c8d;">
                    <h4>❌ Produto Não Encontrado</h4>
                    <p>Código de barras não encontrado na base de dados externa.</p>
                    <p>Você pode cadastrar manualmente.</p>
                </div>
            `;
            produtoInfo.style.display = 'block';
            btnBuscar.style.display = 'none';
            btnPreencher.style.display = 'inline-block';
            produtoEncontradoGlobal = { codigoBarras: codigoBarras }; // Apenas código
            return;
        }

        // Produto encontrado
        const produtosExternos = await responseExterna.json();
        const produtoExterno = Array.isArray(produtosExternos) ? produtosExternos[0] : produtosExternos;

        // Preparar dados para preview
        const produtoFormatado = {
            nome: produtoExterno.Nome || produtoExterno.descricao || produtoExterno.nome || 'Nome não informado',
            codigoBarras: codigoBarras,
            descricao: produtoExterno.Nome ? `${produtoExterno.Nome} - Produto com código ${codigoBarras}` : produtoExterno.descricao_detalhada || produtoExterno.descricao || '',
            imagemUrl: `http://www.eanpictures.com.br:9000/api/gtin/${codigoBarras}`,
            marca: produtoExterno.Marca || produtoExterno.marca || 'Marca não informada',
            categoria: produtoExterno.Categoria || produtoExterno.categoria || produtoExterno.secao || 'Categoria Geral'
        };

        // Salvar globalmente
        produtoEncontradoGlobal = produtoFormatado;

        // Mostrar preview
        produtoPreview.innerHTML = `
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; align-items: start;">
                <div>
                    ${produtoFormatado.imagemUrl ?
                        `<img src="${produtoFormatado.imagemUrl}" alt="${produtoFormatado.nome}" style="max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid #ddd;">` :
                        '<div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Sem foto</div>'
                    }
                </div>
                <div>
                    <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${produtoFormatado.nome}</h4>
                    <p style="margin: 0 0 4px 0; color: #666;"><strong>Código:</strong> ${produtoFormatado.codigoBarras}</p>
                    ${produtoFormatado.marca ? `<p style="margin: 0 0 4px 0; color: #666;"><strong>Marca:</strong> ${produtoFormatado.marca}</p>` : ''}
                    ${produtoFormatado.categoria ? `<p style="margin: 0 0 4px 0; color: #666;"><strong>Categoria:</strong> ${produtoFormatado.categoria}</p>` : ''}
                    ${produtoFormatado.descricao ? `<p style="margin: 0 0 8px 0; color: #666;"><strong>Descrição:</strong> ${produtoFormatado.descricao.substring(0, 100)}${produtoFormatado.descricao.length > 100 ? '...' : ''}</p>` : ''}
                </div>
            </div>
        `;

        produtoInfo.style.display = 'block';
        btnBuscar.style.display = 'none';
        btnPreencher.style.display = 'inline-block';

        alert('Produto encontrado com sucesso!');

    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        produtoPreview.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <h4>❌ Erro na Busca</h4>
                <p>Não foi possível buscar as informações do produto.</p>
                <p>Tente novamente ou cadastre manualmente.</p>
            </div>
        `;
        produtoInfo.style.display = 'block';
        btnBuscar.style.display = 'none';
        btnPreencher.style.display = 'inline-block';
        produtoEncontradoGlobal = { codigoBarras: codigoBarras }; // Apenas código

        alert('Erro ao buscar produto. Você pode cadastrar manualmente.');
    } finally {
        // Restaurar botão
        btnBuscar.innerHTML = '🔍 Buscar Produto';
        btnBuscar.disabled = false;
    }
}

function mostrarModalFinalizarCadastro() {
    // Criar modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // HTML do modal de finalização
    modalOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 700px; width: 95%;">
            <div class="modal-header">
                <span class="modal-icon">📦</span>
                <h2>Finalizar Cadastro do Produto</h2>
                <p>Confirme as informações e complete os dados adicionais</p>
            </div>
            <div class="modal-body" style="max-height: 600px; overflow-y: auto;">
                <!-- Preview do produto -->
                <div id="produtoPreviewContainer" style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div id="produtoImagem">
                        <!-- Imagem será inserida aqui -->
                    </div>
                    <div id="produtoInfo">
                        <!-- Info do produto será inserida aqui -->
                    </div>
                </div>

                <!-- Formulário adicional -->
                <div style="display: grid; gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Nome do Produto *</label>
                        <input type="text" id="modalNomeProduto" required style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px;" oninput="this.value = this.value.toUpperCase()">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Descrição</label>
                        <textarea id="modalDescricao" placeholder="Descrição detalhada do produto" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; min-height: 80px; resize: vertical;"></textarea>
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Observação (opcional)</label>
                        <textarea id="modalObservacao" placeholder="Observações adicionais sobre o produto" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; min-height: 80px; resize: vertical;"></textarea>
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Categoria *</label>
                        <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: end;">
                            <div style="position: relative;">
                                <input type="text" id="categoriaSearch" placeholder="Buscar categoria..." style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px;" oninput="filtrarCategorias()">
                                <select id="modalCategoriaId" required style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; margin-top: 5px;">
                                    <option value="">Selecione uma categoria</option>
                                    <!-- Categorias serão carregadas aqui -->
                                </select>
                            </div>
                            <button type="button" class="btn btn-secondary" onclick="abrirModalCategoria()" title="Cadastrar nova categoria" style="padding: 10px 15px;">🏷️</button>
                        </div>
                        <small style="color: #666; font-size: 12px;">Selecione uma categoria existente ou cadastre uma nova</small>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="finalizarCadastroProduto()" id="btnCadastrar">🚀 Cadastrar Produto</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Carregar dados do produto e categorias
    carregarDadosProdutoFinalizar(modalOverlay);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}

function carregarDadosProdutoFinalizar(modalOverlay) {
    const produto = produtoEncontradoGlobal;
    if (!produto) {
        alert('Nenhum produto selecionado');
        fecharModal();
        return;
    }

    // Preencher preview do produto
    const produtoImagem = modalOverlay.querySelector('#produtoImagem');
    const produtoInfo = modalOverlay.querySelector('#produtoInfo');
    const nomeInput = modalOverlay.querySelector('#modalNomeProduto');
    const descricaoTextarea = modalOverlay.querySelector('#modalDescricao');
    const categoriaSelect = modalOverlay.querySelector('#modalCategoriaId');

    produtoImagem.innerHTML = produto.imagemUrl ?
        `<img src="${produto.imagemUrl}" alt="${produto.nome}" style="max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid #ddd;">` :
        '<div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Sem foto</div>';

    produtoInfo.innerHTML = `
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${produto.nome}</h4>
        <p style="margin: 0 0 4px 0; color: #666;"><strong>Código:</strong> ${produto.codigoBarras}</p>
        ${produto.marca ? `<p style="margin: 0 0 4px 0; color: #666;"><strong>Marca:</strong> ${produto.marca}</p>` : ''}`
    ;

    // Preencher campos editáveis
    nomeInput.value = produto.nome || '';
    descricaoTextarea.value = produto.descricao || '';

    // Carregar categorias no select
    carregarCategoriasNoSelect(modalOverlay, produto.categoria);

    // Focar no campo de nome
    setTimeout(() => nomeInput.focus(), 100);
}

async function carregarCategoriasNoSelect(modalOverlay, categoriaSugerida = '') {
    try {
        const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/categorias`);
        const categorias = await response.json();

        if (response.ok) {
            const categoriaSelect = modalOverlay.querySelector('#modalCategoriaId');
            categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

            // Adicionar categorias
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;

                // Selecionar categoria sugerida se existir
                if (categoriaSugerida && categoria.nome.toLowerCase().includes(categoriaSugerida.toLowerCase())) {
                    option.selected = true;
                }

                categoriaSelect.appendChild(option);
            });

            // Armazenar categorias para filtro
            modalOverlay.categoriasList = categorias;
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

function filtrarCategorias() {
    const searchInput = document.getElementById('categoriaSearch');
    const categoriaSelect = document.getElementById('modalCategoriaId');

    if (!searchInput || !categoriaSelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const modalOverlay = searchInput.closest('.modal-overlay');

    if (!modalOverlay.categoriasList) return;

    // Limpar select
    categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

    // Filtrar e adicionar categorias
    modalOverlay.categoriasList.forEach(categoria => {
        if (categoria.nome.toLowerCase().includes(searchTerm)) {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        }
    });

    // Adicionar opção "Criar nova categoria" se não encontrou nenhuma
    if (categoriaSelect.options.length === 1 && searchTerm) {
        const option = document.createElement('option');
        option.value = 'nova';
        option.textContent = `Criar nova: "${searchTerm}"`;
        categoriaSelect.appendChild(option);
    }
}

async function finalizarCadastroProduto() {
    const produto = produtoEncontradoGlobal;
    if (!produto) {
        alert('Nenhum produto selecionado');
        return;
    }

    const nome = document.getElementById('modalNomeProduto').value.trim();
    const descricao = document.getElementById('modalDescricao').value.trim();
    const observacao = document.getElementById('modalObservacao').value.trim();
    const categoriaId = document.getElementById('modalCategoriaId').value;

    if (!nome) {
        alert('Nome do produto é obrigatório');
        return;
    }

    if (!categoriaId || categoriaId === 'nova') {
        alert('Selecione uma categoria válida');
        return;
    }

    const btnCadastrar = document.getElementById('btnCadastrar');
    const originalText = btnCadastrar.innerHTML;
    btnCadastrar.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div> Salvando...';
    btnCadastrar.disabled = true;

    // Preparar dados do produto
    const produtoData = {
        nome: nome.toUpperCase(),
        codigoBarras: produto.codigoBarras,
        imagem: produto.imagemUrl ? await urlToBase64(produto.imagemUrl) : null,
        descricao: descricao ? descricao.toUpperCase() : null,
        observacao: observacao ? observacao.toUpperCase() : null,
        categoriaId: parseInt(categoriaId)
    };

    console.log('Dados sendo enviados:', produtoData);

    try {
        const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Produto "${result.nome}" cadastrado com sucesso!`);
            fecharModal();

            // Limpar dados globais
            produtoEncontradoGlobal = null;

            // Notificar para recarregar produtos
            if (typeof carregarProdutos === 'function') {
                carregarProdutos();
            }
        } else {
            throw new Error(result.message || 'Erro ao cadastrar produto');
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar produto: ' + error.message);
    } finally {
        if (btnCadastrar) {
            btnCadastrar.innerHTML = originalText;
            btnCadastrar.disabled = false;
        }
    }
}

async function cadastrarCategoria() {
    const nome = document.getElementById('categoriaNome').value.trim();

    if (!nome) {
        alert('Nome da categoria é obrigatório');
        return;
    }

    const btnCadastrar = document.getElementById('btnCadastrarCategoria');
    const originalText = btnCadastrar.innerHTML;
    btnCadastrar.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div> Salvando...';
    btnCadastrar.disabled = true;

    try {
        const categoriaData = {
            nome: nome.toUpperCase()
        };

        const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Categoria "${result.nome}" cadastrada com sucesso!`);
            fecharModal();

            // Notificar para recarregar categorias
            if (typeof carregarCategorias === 'function') {
                carregarCategorias();
            }
        } else {
            // Verificar se é erro de categoria já existente
            if (result.message && result.message.includes('já existe')) {
                alert(`⚠️ ${result.message}`);
            } else {
                throw new Error(result.message || 'Erro ao cadastrar categoria');
            }
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar categoria: ' + error.message);
    } finally {
        if (btnCadastrar) {
            btnCadastrar.innerHTML = originalText;
            btnCadastrar.disabled = false;
        }
    }
}

async function salvarEdicaoProduto() {
    const produtoId = window.produtoParaEditar;
    if (!produtoId) {
        alert('ID do produto não encontrado');
        return;
    }

    const nome = document.getElementById('editNome').value.trim();
    const codigoBarras = document.getElementById('editCodigoBarras').value.trim() || null;
    const categoriaId = parseInt(document.getElementById('editCategoriaId').value);
    const descricao = document.getElementById('editDescricao').value.trim() || null;
    const observacao = document.getElementById('editObservacao').value.trim() || null;

    if (!nome) {
        alert('Nome do produto é obrigatório');
        return;
    }

    if (!categoriaId) {
        alert('Categoria é obrigatória');
        return;
    }

    const btnSalvar = document.getElementById('btnSalvarEdicao');
    const originalText = btnSalvar.innerHTML;
    btnSalvar.innerHTML = '<div class="loading" style="width: 16px; height: 16px;"></div> Salvando...';
    btnSalvar.disabled = true;

    try {
        // Verificar se imagem foi alterada
        const imagemFile = document.getElementById('editImagem').files[0];
        let imagemBase64 = null;

        if (imagemFile) {
            imagemBase64 = await fileToBase64(imagemFile);
        }

        const produtoData = {
            nome: nome.toUpperCase(),
            codigoBarras: codigoBarras ? codigoBarras.toUpperCase() : null,
            categoriaId: categoriaId,
            descricao: descricao ? descricao.toUpperCase() : null,
            observacao: observacao ? observacao.toUpperCase() : null
        };

        // Só incluir imagem se foi alterada
        if (imagemBase64) {
            produtoData.imagem = imagemBase64;
        }

        const response = await fetch(`${window.API_BASE_URL || 'http://localhost:3000'}/produtos/${produtoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Produto "${result.nome}" atualizado com sucesso!`);
            fecharModal();

            // Notificar para recarregar produtos
            if (typeof carregarProdutos === 'function') {
                carregarProdutos();
            }
        } else {
            throw new Error(result.message || 'Erro ao atualizar produto');
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar produto: ' + error.message);
    } finally {
        if (btnSalvar) {
            btnSalvar.innerHTML = originalText;
            btnSalvar.disabled = false;
        }
    }
}

// Função principal de inicialização (já está definida no ui-functions.js)
// Aqui podemos adicionar inicializações específicas se necessário

// Inicialização específica do index.html
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página index.html (que tem as abas)
    const produtosTab = document.getElementById('produtos-tab');
    if (produtosTab) {
        // Estamos na página index.html com abas
        console.log('Inicializando página principal com abas...');
    }

    // Verificar se estamos na página cadastro.html
    const cadastroSection = document.querySelector('.cadastro-section');
    if (cadastroSection) {
        // Estamos na página cadastro.html
        console.log('Inicializando página de cadastro...');
    }
});
