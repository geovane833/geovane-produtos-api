// Funções de Categorias

async function salvarCategoria(event) {
    if (event) event.preventDefault();

    const categoriaNome = document.getElementById('categoriaNome');
    if (!categoriaNome) return;

    const nome = categoriaNome.value.trim();

    if (!nome) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('❌ Nome da categoria é obrigatório', 'error');
        }
        return;
    }

    try {
        const categoriaData = {
            nome: nome.toUpperCase()
        };

        // Verificar se há imagem selecionada (priorizar URL sobre arquivo)
        let imagemBase64 = null;

        // Primeiro, tentar usar imagem da URL
        if (produtoEncontradoGlobal && produtoEncontradoGlobal.imagemUrlBase64) {
            imagemBase64 = produtoEncontradoGlobal.imagemUrlBase64;
        }
        // Se não tiver imagem da URL, tentar arquivo
        else {
            const categoriaImagem = document.getElementById('categoriaImagem');
            if (categoriaImagem && categoriaImagem.files && categoriaImagem.files[0]) {
                const file = categoriaImagem.files[0];

                // Validar tamanho (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    if (typeof notificationManager !== 'undefined') {
                        notificationManager.show('Imagem muito grande! Tamanho máximo: 5MB', 'error');
                    }
                    return;
                }

                // Converter para base64
                imagemBase64 = await fileToBase64(file);
            }
        }

        // Adicionar imagem se existir
        if (imagemBase64) {
            categoriaData.imagem = imagemBase64;
        }

        const response = await fetch(`${window.API_BASE_URL || API_BASE_URL}/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaData)
        });

        const result = await response.json();

        if (response.ok) {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.show(`✅ Categoria "${result.nome}" cadastrada com sucesso!`, 'success');
            }
            if (event && event.target) event.target.reset();

            // Limpar preview da imagem
            const preview = document.getElementById('categoriaImagemPreview');
            if (preview) preview.style.display = 'none';

            // Recarregar listas se necessário
            if (typeof carregarCategorias === 'function') {
                carregarCategorias();
            }
        } else {
            // Verificar se é erro de categoria já existente
            if (result.message && result.message.includes('já existe')) {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show(`⚠️ ${result.message}`, 'info');
                }
            } else {
                throw new Error(result.message || 'Erro ao cadastrar categoria');
            }
        }

    } catch (error) {
        console.error('Erro:', error);
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show(`❌ Erro: ${error.message}`, 'error');
        }
    }
}

async function carregarCategorias() {
    try {
        const categorias = await apiRequest('/categorias');
        exibirCategorias(categorias);
        preencherSelectCategorias(categorias);
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

function exibirCategorias(categorias) {
    const categoriasList = document.getElementById('categoriasList');
    if (!categoriasList) return;

    categoriasList.innerHTML = '';

    if (categorias.length === 0) {
        categoriasList.innerHTML = '<p>Nenhuma categoria encontrada.</p>';
        return;
    }

    categorias.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.className = 'item';
        categoriaDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                ${categoria.imagem ?
                    `<img src="data:image/jpeg;base64,${arrayBufferToBase64(categoria.imagem.data)}" alt="${categoria.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">` :
                    '<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 20px;">🏷️</div>'
                }
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0;">${categoria.nome}</h3>
                    <p style="margin: 0 0 3px 0; color: #666; font-size: 14px;"><strong>Criado em:</strong> ${new Date(categoria.criadoEm).toLocaleString('pt-BR')}</p>
                    <p style="margin: 0; color: #666; font-size: 14px;"><strong>Produtos:</strong> ${categoria.produtos ? categoria.produtos.length : 0}</p>
                </div>
            </div>
            <div class="actions" style="margin-top: 10px;">
                <button class="btn btn-primary" onclick="editarCategoria(${categoria.id}, '${categoria.nome}')">Editar</button>
                <button class="btn btn-danger" onclick="deletarCategoria(${categoria.id})">Excluir</button>
            </div>
        `;
        categoriasList.appendChild(categoriaDiv);
    });
}

function preencherSelectCategorias(categorias) {
    const categoriaSelect = document.getElementById('categoriaId');
    const filtroCategoria = document.getElementById('filtroCategoria');

    if (categoriaSelect) {
        categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        });
    }

    if (filtroCategoria) {
        filtroCategoria.innerHTML = '<option value="">🌟 Todos os produtos</option>';

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            filtroCategoria.appendChild(option);
        });
    }
}

async function deletarCategoria(id) {
    criarModal(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir esta categoria?<br><strong>Todos os produtos relacionados serão afetados.</strong><br><br>Esta ação não pode ser desfeita.',
        'confirm',
        async function(confirmado) {
            if (!confirmado) return;

            try {
                await apiRequest(`/categorias/${id}`, {
                    method: 'DELETE'
                });
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('Categoria excluída com sucesso!', 'success');
                }
                carregarCategoriasLista();
                if (typeof carregarCategorias === 'function') {
                    carregarCategorias(); // Recarregar select se existir
                }
            } catch (error) {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('Erro ao excluir categoria: ' + error.message, 'error');
                }
            }
        }
    );
}

async function carregarCategoriasLista() {
    try {
        const categorias = await apiRequest('/categorias');
        exibirCategorias(categorias);
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function editarCategoria(id, nomeAtual) {
    criarModalInput(
        'Editar Categoria',
        'Digite o novo nome para a categoria:',
        nomeAtual,
        async function(novoNome) {
            if (novoNome === null) return; // Cancelado

            if (!novoNome || novoNome.trim() === '') {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('Nome da categoria é obrigatório', 'error');
                }
                return;
            }

            if (novoNome.toUpperCase() === nomeAtual.toUpperCase()) {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('O nome da categoria não foi alterado', 'info');
                }
                return;
            }

            try {
                const categoriaAtualizada = await apiRequest(`/categorias/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ nome: novoNome.toUpperCase() })
                });

                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show(`Categoria atualizada para "${categoriaAtualizada.nome}" com sucesso!`, 'success');
                }
                carregarCategoriasLista();
                if (typeof carregarCategorias === 'function') {
                    carregarCategorias(); // Recarregar select se existir
                }
            } catch (error) {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('Erro ao atualizar categoria: ' + error.message, 'error');
                }
            }
        }
    );
}

// Função para mostrar formulário de categoria
function mostrarFormularioCategoria() {
    const categoriaForm = document.getElementById('categoriaForm');
    if (categoriaForm) {
        categoriaForm.style.display = 'block';
        const categoriaNomeManual = document.getElementById('categoriaNomeManual');
        if (categoriaNomeManual) categoriaNomeManual.focus();
    }
}

// Função para esconder formulário de categoria
function esconderFormularioCategoria() {
    const categoriaForm = document.getElementById('categoriaForm');
    const categoriaNomeManual = document.getElementById('categoriaNomeManual');
    if (categoriaForm) categoriaForm.style.display = 'none';
    if (categoriaNomeManual) categoriaNomeManual.value = '';
}

// Função para cadastrar categoria manualmente (usada no cadastro.html)
async function cadastrarCategoria() {
    const categoriaNomeManual = document.getElementById('categoriaNomeManual');
    if (!categoriaNomeManual) return;

    const nome = categoriaNomeManual.value.trim();

    if (!nome) {
        mostrarMensagem('❌ Nome da categoria é obrigatório', 'error');
        return;
    }

    try {
        const categoriaData = {
            nome: nome
        };

        const response = await fetch(`${API_BASE_URL}/categorias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaData)
        });

        const result = await response.json();

        if (response.ok) {
            mostrarMensagem(`✅ Categoria "${result.nome}" cadastrada com sucesso!`, 'success');
            esconderFormularioCategoria();
            // Limpar o campo
            categoriaNomeManual.value = '';
            // Recarregar listas se necessário
            if (typeof carregarCategorias === 'function') {
                carregarCategorias();
            }
        } else {
            // Verificar se é erro de categoria já existente
            if (result.message && result.message.includes('já existe')) {
                mostrarMensagem(`⚠️ ${result.message}`, 'info');
            } else {
                throw new Error(result.message || 'Erro ao cadastrar categoria');
            }
        }

    } catch (error) {
        console.error('Erro:', error);
        mostrarMensagem(`❌ Erro: ${error.message}`, 'error');
    }
}

// Função para alternar entre input de arquivo e URL
function alternarInputUrl() {
    const urlContainer = document.getElementById('categoriaUrlContainer');
    const fileInput = document.getElementById('categoriaImagem');

    if (urlContainer.style.display === 'none') {
        urlContainer.style.display = 'block';
        fileInput.style.display = 'none';
        // Limpar arquivo selecionado
        fileInput.value = '';
        // Limpar preview
        const preview = document.getElementById('categoriaImagemPreview');
        if (preview) preview.style.display = 'none';
    } else {
        urlContainer.style.display = 'none';
        fileInput.style.display = 'none';
        // Limpar URL
        const urlInput = document.getElementById('categoriaImagemUrl');
        if (urlInput) urlInput.value = '';
        // Limpar preview
        const preview = document.getElementById('categoriaImagemPreview');
        if (preview) preview.style.display = 'none';
    }
}

// Função para preview da imagem da categoria (upload de arquivo)
function previewCategoriaImagem(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Por favor, selecione apenas arquivos de imagem.', 'error');
        }
        event.target.value = '';
        return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Imagem muito grande! Tamanho máximo: 5MB', 'error');
        }
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('categoriaImagemPreview');
        const img = document.getElementById('categoriaImagemImg');

        if (preview && img) {
            img.src = e.target.result;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

// Função para preview da imagem da categoria por URL
async function previewCategoriaImagemPorUrl() {
    const urlInput = document.getElementById('categoriaImagemUrl');
    const url = urlInput.value.trim();

    if (!url) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('Por favor, digite uma URL válida.', 'warning');
        }
        return;
    }

    // Validar formato da URL
    try {
        new URL(url);
    } catch (e) {
        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('URL inválida. Use o formato: https://exemplo.com/imagem.jpg', 'error');
        }
        return;
    }

    try {
        // Mostrar loading
        const button = document.querySelector('button[onclick="previewCategoriaImagemPorUrl()"]');
        const originalText = button.textContent;
        button.textContent = '⏳ Carregando...';
        button.disabled = true;

        // Fazer download da imagem
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors' // Tentar CORS primeiro
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar imagem: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            throw new Error('A URL não aponta para uma imagem válida.');
        }

        const blob = await response.blob();

        // Validar tamanho (5MB)
        if (blob.size > 5 * 1024 * 1024) {
            throw new Error('Imagem muito grande! Tamanho máximo: 5MB');
        }

        // Converter para base64
        const base64 = await blobToBase64(blob);

        // Mostrar preview
        const preview = document.getElementById('categoriaImagemPreview');
        const img = document.getElementById('categoriaImagemImg');

        if (preview && img) {
            img.src = base64;
            preview.style.display = 'block';
        }

        // Armazenar a imagem convertida
        produtoEncontradoGlobal = produtoEncontradoGlobal || {};
        produtoEncontradoGlobal.imagemUrlBase64 = base64;

        if (typeof notificationManager !== 'undefined') {
            notificationManager.show('✅ Imagem carregada com sucesso!', 'success');
        }

    } catch (error) {
        console.error('Erro ao carregar imagem da URL:', error);

        // Tentar sem CORS se falhar
        if (error.message.includes('CORS')) {
            try {
                // Usar um proxy simples ou tentar carregamento direto
                const img = new Image();
                img.crossOrigin = 'anonymous';

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const base64 = canvas.toDataURL('image/jpeg');

                    const preview = document.getElementById('categoriaImagemPreview');
                    const imgElement = document.getElementById('categoriaImagemImg');

                    if (preview && imgElement) {
                        imgElement.src = base64;
                        preview.style.display = 'block';
                    }

                    produtoEncontradoGlobal = produtoEncontradoGlobal || {};
                    produtoEncontradoGlobal.imagemUrlBase64 = base64;

                    if (typeof notificationManager !== 'undefined') {
                        notificationManager.show('✅ Imagem carregada com sucesso!', 'success');
                    }
                };

                img.onerror = function() {
                    if (typeof notificationManager !== 'undefined') {
                        notificationManager.show('❌ Não foi possível carregar a imagem da URL. Verifique se a URL é acessível e permite CORS.', 'error');
                    }
                };

                img.src = url;

            } catch (fallbackError) {
                if (typeof notificationManager !== 'undefined') {
                    notificationManager.show('❌ Erro ao carregar imagem da URL. A imagem pode não ser acessível ou não permitir carregamento.', 'error');
                }
            }
        } else {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.show(`❌ ${error.message}`, 'error');
            }
        }
    } finally {
        // Restaurar botão
        const button = document.querySelector('button[onclick="previewCategoriaImagemPorUrl()"]');
        if (button) {
            button.textContent = '🔍 Carregar Imagem';
            button.disabled = false;
        }
    }
}

// Função auxiliar para converter Blob para base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
