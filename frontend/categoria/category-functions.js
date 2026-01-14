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

        const response = await fetch(`${API_BASE_URL}/categorias`, {
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
            <h3>${categoria.nome}</h3>
            <p><strong>Criado em:</strong> ${new Date(categoria.criadoEm).toLocaleString('pt-BR')}</p>
            <p><strong>Produtos:</strong> ${categoria.produtos ? categoria.produtos.length : 0}</p>
            <div class="actions">
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
