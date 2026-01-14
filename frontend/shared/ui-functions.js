// Funções de Interface e Utilitários da UI

// Sistema de Notificações Flutuantes
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        // Criar container para notificações
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        this.container.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10001 !important;
            max-width: 400px !important;
            pointer-events: none !important;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = null) {
        // Definir duração baseada no tipo se não especificada
        if (!duration) {
            switch (type) {
                case 'success':
                    duration = 4000;
                    break;
                case 'error':
                    duration = 6000;
                    break;
                case 'info':
                case 'warning':
                    duration = 5000;
                    break;
                default:
                    duration = 4000;
            }
        }

        // Definir ícone baseado no tipo
        let icon = 'ℹ️';
        let title = 'Informação';

        switch (type) {
            case 'success':
                icon = '✅';
                title = 'Sucesso!';
                break;
            case 'error':
                icon = '❌';
                title = 'Erro!';
                break;
            case 'warning':
                icon = '⚠️';
                title = 'Atenção!';
                break;
            case 'info':
                icon = 'ℹ️';
                title = 'Informação!';
                break;
        }

        // Criar elemento da notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="notificationManager.close(this)">×</button>
            </div>
            <div class="notification-progress"></div>
        `;

        // Adicionar barra de progresso
        const progressBar = notification.querySelector('.notification-progress');
        progressBar.style.animationDuration = `${duration}ms`;

        // Adicionar ao container
        this.container.appendChild(notification);

        // Adicionar à lista de notificações
        const notificationData = {
            element: notification,
            timeout: setTimeout(() => this.close(progressBar), duration)
        };

        this.notifications.push(notificationData);

        // Limitar número máximo de notificações simultâneas
        if (this.notifications.length > 5) {
            this.close(this.notifications[0].element.querySelector('.notification-close'));
        }

        // Adicionar evento de clique na notificação
        notification.addEventListener('click', (e) => {
            if (e.target !== notification.querySelector('.notification-close')) {
                this.close(notification.querySelector('.notification-close'));
            }
        });

        return notification;
    }

    close(closeButton) {
        const notification = closeButton.closest('.notification');
        const index = this.notifications.findIndex(n => n.element === notification);

        if (index > -1) {
            clearTimeout(this.notifications[index].timeout);
            this.notifications.splice(index, 1);
        }

        // Adicionar animação de saída
        notification.style.animation = 'slideOutRight 0.3s ease-in';

        // Remover após animação
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// Inicializar gerenciador de notificações
let notificationManager;

// Funções de navegação entre abas
function showTab(tabName) {
    // Esconder todas as abas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remover classe active de todos os botões
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    // Mostrar aba selecionada
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ativar botão correspondente
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Função para filtrar produtos
function filtrarProdutos() {
    const filtroCategoria = document.getElementById('filtroCategoria');
    if (!filtroCategoria) return;

    const categoriaSelecionada = filtroCategoria.value;
    exibirProdutos(todosProdutos, categoriaSelecionada);
}

// Função para limpar filtros
function limparFiltros() {
    const filtroCategoria = document.getElementById('filtroCategoria');
    if (filtroCategoria) {
        filtroCategoria.value = '';
        filtrarProdutos();
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Filtros limpos com sucesso!', 'info');
        }
    }
}

// Função para editar produto (placeholder - implementação completa pode ser adicionada)
async function editarProduto(id) {
    try {
        // Buscar dados atuais do produto
        const produto = await apiRequest(`/produtos/${id}`);

        // Criar modal de edição complexo
        const modalExistente = document.querySelector('.modal-overlay');
        if (modalExistente) {
            modalExistente.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        // Buscar categorias para o select
        const categorias = await apiRequest('/categorias');

        modalOverlay.innerHTML = `
            <div class="modal-content" style="max-width: 600px; width: 90%;">
                <div class="modal-header">
                    <span class="modal-icon">✏️</span>
                    <h2>Editar Produto</h2>
                    <p>Modifique os dados do produto conforme necessário</p>
                </div>
                <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">Nome do Produto *</label>
                            <input type="text" id="editNome" value="${produto.nome}" required style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 4px;">
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
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="salvarEdicaoProduto(${id})">Salvar Alterações</button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Função para fechar modal
        window.fecharModal = function() {
            modalOverlay.remove();
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

    } catch (error) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Erro ao carregar dados do produto: ' + error.message, 'error');
        }
    }
}

// Função para salvar edição de produto (placeholder)
async function salvarEdicaoProduto(id) {
    try {
        const nome = document.getElementById('editNome').value.trim();
        const codigoBarras = document.getElementById('editCodigoBarras').value.trim() || null;
        const categoriaId = parseInt(document.getElementById('editCategoriaId').value);
        const descricao = document.getElementById('editDescricao').value.trim() || null;
        const observacao = document.getElementById('editObservacao').value.trim() || null;

        if (!nome) {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.show('Nome do produto é obrigatório', 'error');
            }
            return;
        }

        if (!categoriaId) {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.show('Categoria é obrigatória', 'error');
            }
            return;
        }

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

        const produtoAtualizado = await apiRequest(`/produtos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(produtoData)
        });

        if (typeof notificationManager !== 'undefined') {
            notificationManager.show(`Produto "${produtoAtualizado.nome}" atualizado com sucesso!`, 'success');
        }
        fecharModal();
        if (typeof carregarProdutos === 'function') {
            carregarProdutos();
        }

    } catch (error) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Erro ao atualizar produto: ' + error.message, 'error');
        }
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de notificações
    notificationManager = new NotificationManager();

    // Só inicializa se os elementos existirem na página
    if (document.getElementById('categoriaId')) {
        carregarCategorias();
    }
    if (document.getElementById('produtosList')) {
        carregarProdutos();
    }
    if (document.getElementById('categoriasList')) {
        carregarCategoriasLista();
    }

    // Event listeners para formulários se existirem
    const produtoForm = document.getElementById('produtoForm');
    if (produtoForm) {
        produtoForm.addEventListener('submit', salvarProduto);
    }

    const categoriaForm = document.getElementById('categoriaForm');
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', salvarCategoria);
    }

    // Event listener para busca por EAN
    const eanInput = document.getElementById('eanInput');
    if (eanInput) {
        eanInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                buscarPorEAN();
            }
        });
    }

    // Event listeners para preview de imagem (se existirem)
    const imagemInput = document.getElementById('imagem');
    const imagemUrlInput = document.getElementById('imagemUrl');

    if (imagemInput) {
        imagemInput.addEventListener('change', function(event) {
            mostrarPreviewImagem(event.target.files[0], null);
        });
    }

    if (imagemUrlInput) {
        imagemUrlInput.addEventListener('input', function(event) {
            const url = event.target.value.trim();
            if (url) {
                mostrarPreviewImagem(null, url);
            } else {
                limparPreviewImagem();
            }
        });
    }
});

// Funções para preview de imagem (se existirem na página)
function mostrarPreviewImagem(file, url) {
    const previewContainer = document.getElementById('imagemPreview');
    if (!previewContainer) return;

    if (file) {
        // Preview de arquivo
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            img.onload = function() {
                previewContainer.innerHTML = '';
                previewContainer.appendChild(img);
                previewContainer.classList.add('has-image');

                const info = document.createElement('div');
                info.className = 'image-info';
                info.textContent = `Arquivo: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                previewContainer.appendChild(info);
            };
        };
        reader.readAsDataURL(file);
    } else if (url) {
        // Preview de URL
        const img = document.createElement('img');
        img.src = url;
        img.className = 'preview-image';
        img.onload = function() {
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
            previewContainer.classList.add('has-image');

            const info = document.createElement('div');
            info.className = 'image-info';
            info.textContent = `URL: ${url}`;
            previewContainer.appendChild(info);
        };
        img.onerror = function() {
            previewContainer.innerHTML = '<div class="preview-placeholder">❌ Erro ao carregar imagem da URL</div>';
            previewContainer.classList.remove('has-image');
        };
    }
}

function limparPreviewImagem() {
    const previewContainer = document.getElementById('imagemPreview');
    if (!previewContainer) return;

    previewContainer.innerHTML = '<div class="preview-placeholder">📷 Selecione uma imagem ou cole uma URL para ver o preview</div>';
    previewContainer.classList.remove('has-image');
}
