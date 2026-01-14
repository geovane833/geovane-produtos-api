// Utilitários gerais

// Função para converter arquivo em base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove o prefixo "data:image/jpeg;base64," e retorna apenas o base64
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Função para converter URL de imagem para base64
function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            // Remove o prefixo "data:image/jpeg;base64," e retorna apenas o base64
            const base64 = dataURL.split(',')[1];
            resolve(base64);
        };
        img.onerror = function() {
            reject(new Error('Erro ao carregar imagem da URL'));
        };
        img.src = url;
    });
}

// Função para converter buffer para base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = 'info') {
    const container = document.getElementById('messageContainer');
    if (!container) return;

    container.innerHTML = '';

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = mensagem;

    container.appendChild(messageDiv);

    // Auto-remover após 8 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 8000);
}
