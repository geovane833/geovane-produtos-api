// Sistema de Modal Personalizado
function criarModal(titulo, mensagem, tipo = 'info', callback = null) {
    // Remover modal existente se houver
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Criar overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // Definir ícone baseado no tipo
    let icone = '⚠️';
    let corBotao = 'btn-primary';

    switch (tipo) {
        case 'success':
            icone = '✅';
            corBotao = 'btn-primary';
            break;
        case 'error':
            icone = '❌';
            corBotao = 'btn-danger';
            break;
        case 'warning':
            icone = '⚠️';
            corBotao = 'btn-secondary';
            break;
        case 'confirm':
            icone = '❓';
            corBotao = 'btn-primary';
            break;
        case 'edit':
            icone = '✏️';
            corBotao = 'btn-primary';
            break;
    }

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-icon">${icone}</span>
                <h2>${titulo}</h2>
                <p>${mensagem}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn ${corBotao}" onclick="confirmarModal()">Confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Função para fechar modal
    window.fecharModal = function() {
        modalOverlay.remove();
        if (callback) callback(false);
    };

    // Função para confirmar
    window.confirmarModal = function() {
        modalOverlay.remove();
        if (callback) callback(true);
    };

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });

    return modalOverlay;
}

function criarModalInput(titulo, mensagem, valorAtual = '', callback = null) {
    // Remover modal existente se houver
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Criar overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-icon">✏️</span>
                <h2>${titulo}</h2>
                <p>${mensagem}</p>
            </div>
            <div class="modal-body">
                <input type="text" class="modal-input" value="${valorAtual}" placeholder="Digite o novo nome..." maxlength="100">
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="confirmarModalInput()">Salvar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Focar no input
    const input = modalOverlay.querySelector('.modal-input');
    setTimeout(() => input.focus(), 100);

    // Função para fechar modal
    window.fecharModal = function() {
        modalOverlay.remove();
        if (callback) callback(null);
    };

    // Função para confirmar
    window.confirmarModalInput = function() {
        const valor = input.value.trim();
        modalOverlay.remove();
        if (callback) callback(valor);
    };

    // Confirmar com Enter
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmarModalInput();
        }
    });

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });

    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });

    return modalOverlay;
}

// Sistema de Cadastro com Código de Barras
let produtoEncontradoGlobal = null;

function abrirModalCodigoBarras() {
    const modal = document.getElementById('modalCodigoBarras');
    modal.style.display = 'flex';

    // Limpar dados anteriores
    document.getElementById('codigoBarrasModal').value = '';
    document.getElementById('produtoInfo').style.display = 'none';
    document.getElementById('produtoPreview').innerHTML = '';
    document.getElementById('btnBuscar').style.display = 'inline-block';
    document.getElementById('btnPreencher').style.display = 'none';
    produtoEncontradoGlobal = null;

    // Focar no input
    setTimeout(() => document.getElementById('codigoBarrasModal').focus(), 100);
}

function fecharModalCodigoBarras() {
    const modal = document.getElementById('modalCodigoBarras');
    modal.style.display = 'none';
    produtoEncontradoGlobal = null;
}

async function mostrarModalFinalizarCadastro() {
    if (!produtoEncontradoGlobal) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Nenhum produto selecionado', 'error');
        }
        return;
    }

    // Remover modal existente se houver
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Criar overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // Processar imagem se disponível
    let imagemBase64 = null;
    if (produtoEncontradoGlobal.imagemUrl) {
        try {
            imagemBase64 = await urlToBase64(produtoEncontradoGlobal.imagemUrl);
        } catch (error) {
            console.log('Erro ao converter imagem externa:', error);
        }
    }

    modalOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 600px; width: 90%;">
            <div class="modal-header">
                <span class="modal-icon">📦</span>
                <h2>Finalizar Cadastro do Produto</h2>
                <p>Confirme as informações e complete os dados adicionais</p>
            </div>
            <div class="modal-body" style="max-height: 500px; overflow-y: auto;">
                <!-- Preview do produto -->
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div>
                        ${produtoEncontradoGlobal.imagemUrl ?
                            `<img src="${produtoEncontradoGlobal.imagemUrl}" alt="${produtoEncontradoGlobal.nome}" style="max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid #ddd;">` :
                            '<div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Sem foto</div>'
                        }
                    </div>
                    <div>
                        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">${produtoEncontradoGlobal.nome}</h4>
                        <p style="margin: 0 0 4px 0; color: #666;"><strong>Código:</strong> ${produtoEncontradoGlobal.codigoBarras}</p>
                        ${produtoEncontradoGlobal.marca ? `<p style="margin: 0 0 4px 0; color: #666;"><strong>Marca:</strong> ${produtoEncontradoGlobal.marca}</p>` : ''}
                        ${produtoEncontradoGlobal.categoria ? `<p style="margin: 0 0 4px 0; color: #666;"><strong>Categoria Sugerida:</strong> ${produtoEncontradoGlobal.categoria}</p>` : ''}
                        ${produtoEncontradoGlobal.descricao ? `<p style="margin: 0 0 8px 0; color: #666;"><strong>Descrição:</strong> ${produtoEncontradoGlobal.descricao.substring(0, 80)}${produtoEncontradoGlobal.descricao.length > 80 ? '...' : ''}</p>` : ''}
                    </div>
                </div>

                <!-- Formulário adicional -->
                <div style="display: grid; gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Observação (opcional)</label>
                        <textarea id="modalObservacao" placeholder="Observações adicionais sobre o produto" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; min-height: 80px; resize: vertical;"></textarea>
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Categoria *</label>
                        <input type="text" id="modalCategoriaNome" required placeholder="Digite o nome da categoria" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px;" value="${produtoEncontradoGlobal.categoria || ''}">
                        <small style="color: #666; font-size: 12px;">Se a categoria não existir, será criada automaticamente</small>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="finalizarCadastroProduto(${imagemBase64 ? `'${imagemBase64}'` : 'null'})">🚀 Cadastrar Produto</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Focar no campo de categoria
    setTimeout(() => {
        const categoriaInput = modalOverlay.querySelector('#modalCategoriaNome');
        if (categoriaInput) categoriaInput.focus();
    }, 100);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });
}
