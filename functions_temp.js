// ====================================
// SISTEMA DE VENDAS - ALEMÃO GÁS
// JavaScript Functions
// ====================================

// ========== FUNÇÃO AUXILIAR ==========
function formatarMoeda(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ========== LIMPEZA AUTOMÁTICA DIÁRIA ==========
function verificareLimparDadosDiarios() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const ultimaDataRegistrada = localStorage.getItem('ultimaDataRegistrada');
    
    console.log(`🔍 Verificando data: Hoje=${hoje}, Última=${ultimaDataRegistrada}`);
    
    // Se é um novo dia, limpar dados
    if (ultimaDataRegistrada !== hoje) {
        console.log('🗑️ Novo dia detectado! Limpando vendas e despesas...');
        
        // Limpar vendas e despesas
        localStorage.setItem('vendas', JSON.stringify([]));
        localStorage.setItem('despesas', JSON.stringify([]));
        
        // Salvar a data atual
        localStorage.setItem('ultimaDataRegistrada', hoje);
        
        console.log('✅ Dados limpos com sucesso!');
    }
}

// ========== AUTENTICAÇÃO ==========
function verificarAutenticacao() {
    const autenticado = sessionStorage.getItem('autenticado');
    if (autenticado === 'sim') {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('sidebarContainer').style.display = 'block';
        document.getElementById('mainContent').style.display = 'block';
        document.body.style.marginLeft = '260px';
        abrirSidebarItem('dashboard');
    }
}

function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('loginUser').value.toUpperCase();
    const senha = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    
    // Credenciais corretas
    if (usuario === 'ALEMAO' && senha === '96103719') {
        sessionStorage.setItem('autenticado', 'sim');
        loginError.style.display = 'none';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Mostrar sistema
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('sidebarContainer').style.display = 'block';
        document.getElementById('mainContent').style.display = 'block';
        document.body.style.marginLeft = '260px';
        
        // Abrir dashboard
        abrirSidebarItem('dashboard');
    } else {
        loginError.style.display = 'block';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginPassword').focus();
    }
}

function fazerLogout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        sessionStorage.removeItem('autenticado');
        
        // Voltar para login
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('sidebarContainer').style.display = 'none';
        document.getElementById('mainContent').style.display = 'none';
        document.body.style.marginLeft = '0';
        
        // Limpar campos
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
        document.getElementById('loginUser').focus();
    }
}

// ========== MODAIS ==========
function abrirSidebarItem(item) {
    // Fechar todos os modais
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    
    // Atualizar sidebar ativo
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        const btn = event.target.closest('.sidebar-item');
        if (btn) btn.classList.add('active');
    }

    // Abrir modal correto
    const modalId = {
        'dashboard': 'modalDashboard',
        'vendas': 'modalVendas',
        'despesas': 'modalDespesas',
        'fiados': 'modalFiados',
        'creditos': 'modalCreditos',
        'entregadores': 'modalEntregadores',
        'configuracao': 'modalConfiguracao'
    }[item];

    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            if (item === 'dashboard') calcularDashboardDia();
            if (item === 'vendas') preencherEntregadores();
            if (item === 'despesas') listarDespesas();
            if (item === 'configuracao') carregarCustos();
        }
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// ========== PREENCHIMENTO DE DROPDOWN ==========
function preencherEntregadores() {
    const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
    const select = document.getElementById('entregador');
    
    // Guardar opção vazia
    const opcaoVazia = select.options[0];
    
    // Limpar opções anteriores (mantendo a primeira)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Adicionar novos entregadores
    entregadores.forEach(e => {
        if (e.ativo !== false) {  // Mostrar apenas entregadores ativos
            const option = document.createElement('option');
            option.value = e.nome;
            option.textContent = '🚚 ' + e.nome;
            select.appendChild(option);
        }
    });
}

// ========== VENDAS ==========
function atualizarTotalVenda() {
    // Produtos
    const prod1 = document.getElementById('produto1').value;
    const qtd1 = parseInt(document.getElementById('qtd1').value) || 0;
    const valor1 = parseFloat(document.getElementById('valor1').value.replace(',', '.')) || 0;
    const pagto1 = document.getElementById('pagto1').value;
    
    const prod2 = document.getElementById('produto2').value;
    const qtd2 = parseInt(document.getElementById('qtd2').value) || 0;
    const valor2 = parseFloat(document.getElementById('valor2').value.replace(',', '.')) || 0;
    const pagto2 = document.getElementById('pagto2').value;
    
    const totalProdutos = (prod1 && valor1 && pagto1 ? valor1 : 0) + 
                          (prod2 && valor2 && pagto2 ? valor2 : 0);
    
    document.getElementById('totalVendaExibido').textContent = formatarMoeda(totalProdutos);
    
    const alerta = document.getElementById('alertaPagamento');
    if (!prod1 || !qtd1 || !valor1 || !pagto1) {
        alerta.textContent = '⚠️ Preencha produto 1 completo (produto, qtd, valor e pagamento)!';
        alerta.style.display = 'block';
    } else {
        alerta.style.display = 'none';
    }
}

function limparVendaSimples() {
    document.getElementById('clienteNome').value = '';
    document.getElementById('entregador').value = '';
    document.getElementById('observacao').value = '';
    document.getElementById('marcacaoVenda').value = '';
    
    document.getElementById('produto1').value = '';
    document.getElementById('qtd1').value = '1';
    document.getElementById('valor1').value = '';
    document.getElementById('pagto1').value = '';
    
    document.getElementById('produto2').value = '';
    document.getElementById('qtd2').value = '1';
    document.getElementById('valor2').value = '';
    document.getElementById('pagto2').value = '';
    
    atualizarTotalVenda();
}

function finalizarVendaSimples() {
    const cliente = document.getElementById('clienteNome').value.trim();
    const entregador = document.getElementById('entregador').value;
    const observacao = document.getElementById('observacao').value.trim();
    const marcacao = document.getElementById('marcacaoVenda').value;
    
    const prod1 = document.getElementById('produto1').value;
    const qtd1 = parseInt(document.getElementById('qtd1').value) || 0;
    const valor1 = parseFloat(document.getElementById('valor1').value.replace(',', '.')) || 0;
    const pagto1 = document.getElementById('pagto1').value;
    
    const prod2 = document.getElementById('produto2').value;
    const qtd2 = parseInt(document.getElementById('qtd2').value) || 0;
    const valor2 = parseFloat(document.getElementById('valor2').value.replace(',', '.')) || 0;
    const pagto2 = document.getElementById('pagto2').value;
    
    if (!cliente) {
        alert('Preencha o nome do cliente!');
        return;
    }
    
    if (!prod1 || !qtd1 || !valor1 || !pagto1) {
        alert('Preencha os dados do produto 1 (produto, qtd, valor e pagamento)!');
        return;
    }
    
    // CONFIRMAÇÃO ANTES DE FINALIZAR
    if (!confirm('Tem certeza que deseja finalizar esta venda?')) {
        return;
    }
    
    // Montar array de produtos
    const produtos = [];
    if (prod1 && qtd1 && valor1) {
        produtos.push({ 
            produto: prod1, 
            quantidade: qtd1, 
            valor: valor1,
            pagamento: pagto1
        });
    }
    if (prod2 && qtd2 && valor2) {
        produtos.push({ 
            produto: prod2, 
            quantidade: qtd2, 
            valor: valor2,
            pagamento: pagto2
        });
    }
    
    const total = produtos.reduce((sum, p) => sum + p.valor, 0);
    
    // Verificar se há algum pagamento "fiado"
    const temFiado = produtos.some(p => p.pagamento === 'fiado');
    
    if (temFiado) {
        // Adicionar à lista de fiados automaticamente
        const fiados = JSON.parse(localStorage.getItem('fiados') || '[]');
        const produtosFiado = produtos.filter(p => p.pagamento === 'fiado');
        const valorFiado = produtosFiado.reduce((sum, p) => sum + p.valor, 0);
        const produtosDescricao = produtosFiado
            .map(p => `${p.produto} (${p.quantidade}x)`)
            .join(', ');
        
        fiados.push({
            cliente,
            valor: valorFiado,
            descricao: produtosDescricao + (observacao ? ` - ${observacao}` : ''),
            data: new Date().toLocaleString('pt-BR'),
            entregador: entregador || 'Sem entregador',
            especial: false
        });
        localStorage.setItem('fiados', JSON.stringify(fiados));
    }
    
    // Salvar ou atualizar venda
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    
    if (window.vendaEditandoIdx !== undefined) {
        // Atualizando venda existente
        vendas[window.vendaEditandoIdx] = {
            ...vendas[window.vendaEditandoIdx],
            cliente,
            entregador: entregador || 'Sem entregador',
            observacao,
            marcacao: marcacao || '',
            produtos: produtos,
            total: total,
            data: new Date().toLocaleString('pt-BR')
        };
        alert('✅ Venda atualizada com sucesso!');
        delete window.vendaEditandoIdx;
    } else {
        // Criando nova venda
        vendas.push({
            id: Date.now(),
            cliente,
            entregador: entregador || 'Sem entregador',
            observacao,
            marcacao: marcacao || '',
            produtos: produtos,
            total: total,
            data: new Date().toLocaleString('pt-BR')
        });
        // Sem alert para nova venda, apenas atualiza silenciosamente
    }
    
    localStorage.setItem('vendas', JSON.stringify(vendas));
    
    limparVendaSimples();
    listarVendas();
    listarFiados();
    calcularDashboardDia();
}

function listarVendas() {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const lista = document.getElementById('listaVendas');
    
    if (!vendas.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhuma venda registrada.</p>';
        return;
    }

    lista.innerHTML = vendas.map((v, idx) => {
        const produtosHTML = v.produtos.map(p => {
            const iconPagto = {
                'dinheiro': '💰',
                'pix': '📱',
                'cartao': '💳',
                'fiado': '📋'
            }[p.pagamento] || '💵';
            const iconProduto = {
                'gas': '⛽',
                'agua': '💧',
                'regulador': '⚙️',
                'mangueira': '〰️',
                'botija': '🟦',
                'galao': '🧴'
            }[p.produto] || '📦';
            return `<div style="margin: 8px 0;">• ${iconProduto} ${p.produto}: ${p.quantidade}x R$ ${p.valor.toFixed(2).replace('.', ',')} ${iconPagto}</div>`;
        }).join('');
        
        const badgeMarcacao = v.marcacao ? `<span class="badge-marcacao badge-${v.marcacao}">${v.marcacao === 'importante' ? '⭐ Importante' : v.marcacao === 'urgente' ? '🔴 Urgente' : v.marcacao === 'pendente' ? '⏳ Pendente' : '🔄 Devolvido'}</span>` : '';
        
        return `
            <div style="background: linear-gradient(135deg, #fff5f0 0%, #f0f8ff 100%); padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #ff6b35;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <strong style="color: #ff6b35; font-size: 16px;">👤 ${v.cliente}</strong>
                        <small style="color: #999; display: block; margin-top: 2px;">${v.data}</small>
                    </div>
                    <strong style="color: #2ecc71; font-size: 18px;">R$ ${v.total.toFixed(2).replace('.', ',')}</strong>
                </div>
                ${badgeMarcacao ? `<div style="margin-bottom: 8px;">${badgeMarcacao}</div>` : ''}
                <div style="font-size: 13px; color: #333; margin-bottom: 8px;">
                    ${produtosHTML}
                </div>
                ${v.entregador && v.entregador !== 'Sem entregador' ? `<div style="font-size: 12px; color: #666;">🚚 Entregador: ${v.entregador}</div>` : ''}
                ${v.observacao ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">📝 Obs: ${v.observacao}</div>` : ''}
                <div style="margin-top: 10px;">
                    <button onclick="editarVenda(${idx})" style="background: #0066ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">✏️ Editar</button>
                    <button onclick="removerVenda(${idx})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ Remover</button>
                </div>
            </div>
        `;
    }).join('');
}

function editarVenda(idx) {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const venda = vendas[idx];
    
    // Preencher campos com dados da venda
    document.getElementById('clienteNome').value = venda.cliente;
    document.getElementById('entregador').value = venda.entregador === 'Sem entregador' ? '' : venda.entregador;
    document.getElementById('observacao').value = venda.observacao || '';
    document.getElementById('marcacaoVenda').value = venda.marcacao || '';
    
    // Preencher primeiro produto
    if (venda.produtos[0]) {
        document.getElementById('produto1').value = venda.produtos[0].produto;
        document.getElementById('qtd1').value = venda.produtos[0].quantidade;
        document.getElementById('valor1').value = venda.produtos[0].valor.toFixed(2).replace('.', ',');
        document.getElementById('pagto1').value = venda.produtos[0].pagamento;
    }
    
    // Preencher segundo produto (se existir)
    if (venda.produtos[1]) {
        document.getElementById('produto2').value = venda.produtos[1].produto;
        document.getElementById('qtd2').value = venda.produtos[1].quantidade;
        document.getElementById('valor2').value = venda.produtos[1].valor.toFixed(2).replace('.', ',');
        document.getElementById('pagto2').value = venda.produtos[1].pagamento;
    }
    
    atualizarTotalVenda();
    
    // Rolar até o topo do formulário
    document.querySelector('.modal-body').scrollTop = 0;
    
    // Guardar ID da venda sendo editada
    window.vendaEditandoIdx = idx;
}

function removerVenda(idx) {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const venda = vendas[idx];
    
    if (confirm(`Tem certeza que deseja remover a venda de ${venda.cliente} no valor de R$ ${venda.total.toFixed(2).replace('.', ',')}?`)) {
        vendas.splice(idx, 1);
        localStorage.setItem('vendas', JSON.stringify(vendas));
        listarVendas();
        calcularDashboardDia();
    }
}

// ========== FILTRO DE VENDAS ==========
function filtrarVendas(termo) {
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const lista = document.getElementById('listaVendas');
    
    if (!vendas.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhuma venda registrada.</p>';
        return;
    }
    
    const vendasFiltradas = vendas.filter(v => 
        v.cliente.toLowerCase().includes(termo.toLowerCase())
    );
    
    if (!vendasFiltradas.length && termo) {
        lista.innerHTML = `<p style="color: #999;">Nenhuma venda encontrada com o nome "${termo}".</p>`;
        return;
    }

    lista.innerHTML = vendasFiltradas.map((v, idx) => {
        const indiceReal = vendas.findIndex(venda => venda === v);
        const produtosHTML = v.produtos.map(p => {
            const iconPagto = {
                'dinheiro': '💰',
                'pix': '📱',
                'cartao': '💳',
                'fiado': '📋'
            }[p.pagamento] || '💵';
            const iconProduto = {
                'gas': '⛽',
                'agua': '💧',
                'regulador': '⚙️',
                'mangueira': '〰️',
                'botija': '🟦',
                'galao': '🧴'
            }[p.produto] || '📦';
            return `<div style="margin: 8px 0;">• ${iconProduto} ${p.produto}: ${p.quantidade}x R$ ${p.valor.toFixed(2).replace('.', ',')} ${iconPagto}</div>`;
        }).join('');
        
        const badgeMarcacao = v.marcacao ? `<span class="badge-marcacao badge-${v.marcacao}">${v.marcacao === 'importante' ? '⭐ Importante' : v.marcacao === 'urgente' ? '🔴 Urgente' : v.marcacao === 'pendente' ? '⏳ Pendente' : '🔄 Devolvido'}</span>` : '';
        
        return `
            <div style="background: linear-gradient(135deg, #fff5f0 0%, #f0f8ff 100%); padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #ff6b35;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <strong style="color: #ff6b35; font-size: 16px;">👤 ${v.cliente}</strong>
                        <small style="color: #999; display: block; margin-top: 2px;">${v.data}</small>
                    </div>
                    <strong style="color: #2ecc71; font-size: 18px;">R$ ${v.total.toFixed(2).replace('.', ',')}</strong>
                </div>
                ${badgeMarcacao ? `<div style="margin-bottom: 8px;">${badgeMarcacao}</div>` : ''}
                <div style="font-size: 13px; color: #333; margin-bottom: 8px;">
                    ${produtosHTML}
                </div>
                ${v.entregador && v.entregador !== 'Sem entregador' ? `<div style="font-size: 12px; color: #666;">🚚 Entregador: ${v.entregador}</div>` : ''}
                ${v.observacao ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">📝 Obs: ${v.observacao}</div>` : ''}
                <div style="margin-top: 10px;">
                    <button onclick="editarVenda(${indiceReal})" style="background: #0066ff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">✏️ Editar</button>
                    <button onclick="removerVenda(${indiceReal})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ Remover</button>
                </div>
            </div>
        `;
    }).join('');
}

// ========== FIADOS ==========
function adicionarFiado() {
    const cliente = document.getElementById('fiadoCliente').value;
    const valor = document.getElementById('fiadoValor').value.replace('R$', '').trim();
    const descricao = document.getElementById('fiadoDescricao').value;
    const especial = document.getElementById('fiadoEspecial').checked;

    if (!cliente || !valor) {
        alert('Preencha cliente e valor!');
        return;
    }

    const fiados = JSON.parse(localStorage.getItem('fiados') || '[]');
    fiados.push({
        cliente,
        valor: parseFloat(valor.replace(',', '.')),
        descricao,
        especial: especial,
        data: new Date().toLocaleString('pt-BR')
    });

    localStorage.setItem('fiados', JSON.stringify(fiados));
    
    document.getElementById('fiadoCliente').value = '';
    document.getElementById('fiadoValor').value = '';
    document.getElementById('fiadoDescricao').value = '';
    document.getElementById('fiadoEspecial').checked = false;

    listarFiados();
    calcularDashboardDia();
}

function listarFiados() {
    const fiados = JSON.parse(localStorage.getItem('fiados') || '[]');
    const lista = document.getElementById('listaFiados');
    
    const total = fiados.reduce((sum, f) => sum + f.valor, 0);
    document.getElementById('totalFiadosValor').textContent = formatarMoeda(total);
    document.getElementById('qtdFiadosClientes').textContent = fiados.length;

    if (!fiados.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhum fiado registrado.</p>';
        return;
    }

    lista.innerHTML = fiados.map((f, idx) => `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${f.especial ? '#FFD700' : '#0066ff'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${f.especial ? '<span style="font-size: 18px;">⭐</span>' : ''}
                    <strong>${f.cliente}</strong>
                </div>
                <span style="color: #e74c3c; font-weight: bold;">R$ ${f.valor.toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                ${f.descricao} | ${f.data}
            </div>
            ${f.entregador && f.entregador !== 'Sem entregador' ? `<div style="font-size: 12px; color: #0066ff; margin-bottom: 8px;">🚚 ${f.entregador}</div>` : ''}
            <button onclick="removerFiado(${idx})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ Remover</button>
        </div>
    `).join('');
}

function removerFiado(idx) {
    const fiados = JSON.parse(localStorage.getItem('fiados') || '[]');
    const fiado = fiados[idx];
    
    if (confirm(`Tem certeza que deseja remover o fiado de ${fiado.cliente} no valor de R$ ${fiado.valor.toFixed(2).replace('.', ',')}?`)) {
        fiados.splice(idx, 1);
        localStorage.setItem('fiados', JSON.stringify(fiados));
        listarFiados();
        calcularDashboardDia();
    }
}

// ========== DESPESAS ==========
function adicionarDespesa() {
    const descricao = document.getElementById('despesaDescricao').value.trim();
    const valor = document.getElementById('despesaValor').value.replace('R$', '').trim();
    const categoria = document.getElementById('despesaCategoria').value;

    if (!descricao || !valor || !categoria) {
        alert('Preencha descrição, valor e categoria!');
        return;
    }

    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    const dataAtual = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR');
    
    despesas.push({
        descricao,
        valor: parseFloat(valor.replace(',', '.')),
        categoria,
        data: dataAtual
    });

    localStorage.setItem('despesas', JSON.stringify(despesas));
    
    document.getElementById('despesaDescricao').value = '';
    document.getElementById('despesaValor').value = '';
    document.getElementById('despesaCategoria').value = '';

    listarDespesas();
    calcularDashboardDia();
}

function listarDespesas() {
    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    const lista = document.getElementById('listaDespesas');
    
    const total = despesas.reduce((sum, d) => {
        let valor = d.valor;
        if (typeof valor === 'string') {
            valor = parseFloat(valor.replace(',', '.'));
        } else {
            valor = parseFloat(valor);
        }
        return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    document.getElementById('totalDespesasValor').textContent = formatarMoeda(total);
    document.getElementById('qtdDespesas').textContent = despesas.length;

    if (!despesas.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhuma despesa registrada.</p>';
        return;
    }

    const iconCategoria = {
        'combustivel': '⛽',
        'manutencao': '🔧',
        'salario': '💼',
        'aluguel': '🏠',
        'diaria': '💵',
        'utensilio': '🛠️',
        'outro': '📌'
    };

    lista.innerHTML = despesas.map((d, idx) => `
        <div style="background: #fff5f0; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #e74c3c;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <strong>${iconCategoria[d.categoria] || '📌'} ${d.descricao}</strong>
                <span style="color: #e74c3c; font-weight: bold;">-R$ ${d.valor.toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="font-size: 11px; color: #666;">
                ${d.data}
            </div>
            <button onclick="removerDespesa(${idx})" style="background: #e74c3c; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 6px;">🗑️ Remover</button>
        </div>
    `).join('');
}

function removerDespesa(idx) {
    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    despesas.splice(idx, 1);
    localStorage.setItem('despesas', JSON.stringify(despesas));
    listarDespesas();
    calcularDashboardDia();
}

// ========== CRÉDITOS ==========
function adicionarCredito() {
    const cliente = document.getElementById('creditoCliente').value;
    const valor = document.getElementById('creditoValor').value.replace('R$', '').trim();
    const descricao = document.getElementById('creditoDescricao').value;

    if (!cliente || !valor) {
        alert('Preencha cliente e valor!');
        return;
    }

    const creditos = JSON.parse(localStorage.getItem('creditos') || '[]');
    creditos.push({
        cliente,
        valor: parseFloat(valor.replace(',', '.')),
        descricao,
        data: new Date().toLocaleString('pt-BR')
    });

    localStorage.setItem('creditos', JSON.stringify(creditos));
    
    document.getElementById('creditoCliente').value = '';
    document.getElementById('creditoValor').value = '';
    document.getElementById('creditoDescricao').value = '';

    listarCreditos();
    calcularDashboardDia();
}

function listarCreditos() {
    const creditos = JSON.parse(localStorage.getItem('creditos') || '[]');
    const lista = document.getElementById('listaCreditos');
    
    const total = creditos.reduce((sum, c) => sum + c.valor, 0);
    document.getElementById('totalCreditosValor').textContent = formatarMoeda(total);
    document.getElementById('qtdCreditosClientes').textContent = creditos.length;

    if (!creditos.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhum crédito registrado.</p>';
        return;
    }

    lista.innerHTML = creditos.map((c, idx) => `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #0066ff;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <strong>${c.cliente}</strong>
                <span style="color: #2ecc71; font-weight: bold;">R$ ${c.valor.toFixed(2).replace('.', ',')}</span>
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                ${c.descricao} | ${c.data}
            </div>
            <button onclick="removerCredito(${idx})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ Remover</button>
        </div>
    `).join('');
}

function removerCredito(idx) {
    const creditos = JSON.parse(localStorage.getItem('creditos') || '[]');
    creditos.splice(idx, 1);
    localStorage.setItem('creditos', JSON.stringify(creditos));
    listarCreditos();
    calcularDashboardDia();
}

// ========== ENTREGADORES ==========
function adicionarEntregador() {
    const nome = document.getElementById('entregadorNome').value;
    const telefone = document.getElementById('entregadorTelefone').value;
    const veiculo = document.getElementById('entregadorVeiculo').value;

    if (!nome) {
        alert('Preencha o nome!');
        return;
    }

    const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
    entregadores.push({
        nome,
        telefone,
        veiculo,
        ativo: true,
        data: new Date().toLocaleString('pt-BR')
    });

    localStorage.setItem('entregadores', JSON.stringify(entregadores));
    
    document.getElementById('entregadorNome').value = '';
    document.getElementById('entregadorTelefone').value = '';
    document.getElementById('entregadorVeiculo').value = '';

    listarEntregadores();
    preencherEntregadores();
}

function listarEntregadores() {
    const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
    const lista = document.getElementById('listaEntregadores');
    
    const ativos = entregadores.filter(e => e.ativo).length;
    document.getElementById('totalEntregadores').textContent = entregadores.length;
    document.getElementById('entregadoresAtivos').textContent = ativos;

    if (!entregadores.length) {
        lista.innerHTML = '<p style="color: #999;">Nenhum entregador registrado.</p>';
        return;
    }

    lista.innerHTML = entregadores.map((e, idx) => `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${e.ativo ? '#2ecc71' : '#e74c3c'};">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${e.nome}</strong> ${e.ativo ? '✅' : '❌'}
                    <div style="font-size: 12px; color: #666;">
                        ${e.telefone} | ${e.veiculo}
                    </div>
                </div>
                <button onclick="removerEntregador(${idx})" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️</button>
            </div>
        </div>
    `).join('');
}

function removerEntregador(idx) {
    const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
    entregadores.splice(idx, 1);
    localStorage.setItem('entregadores', JSON.stringify(entregadores));
    listarEntregadores();
    preencherEntregadores();
}

// ========== DASHBOARD ==========
function calcularDashboardDia() {
    // Carregar dados do localStorage
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const custos = JSON.parse(localStorage.getItem('custos') || '{}');
    const despesas = JSON.parse(localStorage.getItem('despesas') || '[]');
    
    // Data de hoje para filtrar
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    // === SEÇÃO 1: VENDAS ===
    let totalDinheiro = 0;
    let totalPix = 0;
    let totalCartao = 0;
    let totalFiado = 0;
    let gasQtd = 0;
    let aguaQtd = 0;
    let reguladorQtd = 0;
    let mangueiraqtd = 0;
    let botijaQtd = 0;
    let galaoQtd = 0;
    
    console.log('🔍 DEBUG: Iniciando cálculo do dashboard');
    console.log('📊 Vendas carregadas:', vendas);
    
    vendas.forEach(v => {
        // CONTAR TODAS AS VENDAS (comentaremos filtro de data por enquanto para debug)
        // if (v.data) {
        //     const dataVenda = v.data.split(' ')[0];
        //     if (dataVenda !== hoje) return;
        // }
        
        v.produtos.forEach(p => {
            console.log('📦 Processando produto:', p.produto, 'Quantidade:', p.quantidade);
            // Contar quantidade de cada produto
            if (p.produto === 'gas') gasQtd += p.quantidade;
            if (p.produto === 'agua') aguaQtd += p.quantidade;
            if (p.produto === 'regulador') reguladorQtd += p.quantidade;
            if (p.produto === 'mangueira') mangueiraqtd += p.quantidade;
            if (p.produto === 'botija') botijaQtd += p.quantidade;
            if (p.produto === 'galao') galaoQtd += p.quantidade;
            
            // Somar por forma de pagamento
            const valorProduto = p.valor; // Valor já é o total, não multiplica por quantidade
            if (p.pagamento === 'dinheiro') totalDinheiro += valorProduto;
            if (p.pagamento === 'pix') totalPix += valorProduto;
            if (p.pagamento === 'cartao') totalCartao += valorProduto;
            if (p.pagamento === 'fiado') totalFiado += valorProduto;
        });
    });
    
    // === SEÇÃO 2: CUSTOS DOS PRODUTOS ===
    const custoGas = parseFloat(custos.gas) || 0;
    const custoAgua = parseFloat(custos.agua) || 0;
    const custoRegulador = parseFloat(custos.regulador) || 0;
    const custoMangueira = parseFloat(custos.mangueira) || 0;
    const custoBotija = parseFloat(custos.botija) || 0;
    const custoGalao = parseFloat(custos.galao) || 0;
    
    const totalCustosProdutos = (custoGas * gasQtd) + (custoAgua * aguaQtd) + (custoRegulador * reguladorQtd) + (custoMangueira * mangueiraqtd) + (custoBotija * botijaQtd) + (custoGalao * galaoQtd);
    
    // === SEÇÃO 3: DESPESAS DO DIA ===
    let totalDespesas = 0;
    console.log('🔍 Filtrando despesas para a data:', hoje);
    console.log('📊 Total de despesas no localStorage:', despesas.length);
    
    despesas.forEach((d, idx) => {
        console.log(`Despesa ${idx}:`, d);
        if (d.data) {
            // Pega apenas a data (dd/mm/yyyy) antes do espaço e hora
            const dataDespesa = d.data.split(' ')[0]; 
            console.log(`  Data extraída: ${dataDespesa}, Hoje: ${hoje}, Igual? ${dataDespesa === hoje}`);
            if (dataDespesa === hoje) {
                let valor = d.valor;
                // Garantir que o valor é um número
                if (typeof valor === 'string') {
                    valor = parseFloat(valor.replace(',', '.')) || 0;
                } else {
                    valor = parseFloat(valor) || 0;
                }
                totalDespesas += valor;
                console.log(`  ✓ Somou R$ ${valor}`);
            }
        }
    });
    console.log('💰 TOTAL DE DESPESAS FILTRADAS:', totalDespesas);
    
    // === SEÇÃO 4: CÁLCULOS FINAIS ===
    const entradasRecebidas = totalDinheiro + totalPix + totalCartao; // SEM FIADO (Dinheiro efetivo)
    const totalVendas = totalDinheiro + totalPix + totalCartao + totalFiado; // TODAS AS VENDAS (incluindo fiados)
    const lucro = totalVendas - totalCustosProdutos - totalDespesas;
    const margem = totalVendas > 0 ? ((lucro / totalVendas) * 100).toFixed(1) : 0;
    
    // === SEÇÃO 5: ATUALIZAR TELA ===
    console.log('✅ Totais contabilizados:', {gasQtd, aguaQtd, reguladorQtd, mangueiraqtd, botijaQtd, galaoQtd});
    
    // Pagamentos
    document.getElementById('dashMoney').textContent = formatarMoeda(totalDinheiro);
    document.getElementById('dashPix').textContent = formatarMoeda(totalPix);
    document.getElementById('dashCard').textContent = formatarMoeda(totalCartao);
    document.getElementById('dashFiado').textContent = formatarMoeda(totalFiado);
    
    // Quantidade de produtos
    document.getElementById('dashGasQtd').textContent = gasQtd;
    document.getElementById('dashAguaQtd').textContent = aguaQtd;
    document.getElementById('dashRegQtd').textContent = reguladorQtd;
    document.getElementById('dashManQtd').textContent = mangueiraqtd;
    document.getElementById('dashBotijaQtd').textContent = botijaQtd;
    document.getElementById('dashGalaoQtd').textContent = galaoQtd;
    
    // Resumo financeiro
    document.getElementById('dashEntradas').textContent = formatarMoeda(totalVendas);
    document.getElementById('dashCustoProducts').textContent = formatarMoeda(totalCustosProdutos);
    document.getElementById('dashDespesas').textContent = formatarMoeda(totalDespesas);
    document.getElementById('dashMargem').textContent = margem + '%';
    document.getElementById('lucroGrande').textContent = formatarMoeda(lucro);
    
    // Atualizar listas
    listarVendas();
    listarFiados();
    listarCreditos();
}

function atualizarDashboard() {
    calcularDashboardDia();
    alert('Dashboard atualizado!');
}

// ========== CONFIGURAÇÃO ==========
function salvarCustos() {
    const custos = {
        gas: document.getElementById('custoGas').value.replace('R$', '').trim().replace(',', '.') || '0',
        agua: document.getElementById('custoAgua').value.replace('R$', '').trim().replace(',', '.') || '0',
        regulador: document.getElementById('custoRegulador').value.replace('R$', '').trim().replace(',', '.') || '0',
        mangueira: document.getElementById('custoMangueira').value.replace('R$', '').trim().replace(',', '.') || '0',
        botija: document.getElementById('custoBotija').value.replace('R$', '').trim().replace(',', '.') || '0',
        galao: document.getElementById('custoGalao').value.replace('R$', '').trim().replace(',', '.') || '0'
    };

    localStorage.setItem('custos', JSON.stringify(custos));
    alert('Custos salvos com sucesso!');
    calcularDashboardDia();
}

function carregarCustos() {
    const custos = JSON.parse(localStorage.getItem('custos') || '{}');
    document.getElementById('custoGas').value = custos.gas || '0';
    document.getElementById('custoAgua').value = custos.agua || '0';
    document.getElementById('custoRegulador').value = custos.regulador || '0';
    document.getElementById('custoMangueira').value = custos.mangueira || '0';
    document.getElementById('custoBotija').value = custos.botija || '0';
    document.getElementById('custoGalao').value = custos.galao || '0';
}

// ========== GERAÇÃO DE PDF ==========
function gerarPDFDiario() {
    const hoje = new Date();
    const dataAtual = hoje.toLocaleDateString('pt-BR');
    
    // Criar estrutura HTML para o PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.backgroundColor = '#fff';
    element.style.fontFamily = 'Arial, sans-serif';
    
    // Cabeçalho
    element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 20px;">
            <h1 style="color: #ff6b35; margin: 0; font-size: 28px;">🛢️ Alemão Gás - Relatório Diário</h1>
            <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Relatório de: ${dataAtual}</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #ff6b35; font-size: 18px; border-left: 4px solid #0066ff; padding-left: 15px; margin: 0 0 15px 0;">📊 DASHBOARD</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 8px 0;"><strong>💎 LUCRO DO DIA:</strong> ${document.getElementById('lucroGrande').textContent}</p>
                <p style="margin: 8px 0;"><strong>💵 Entradas:</strong> ${document.getElementById('dashEntradas').textContent}</p>
                <p style="margin: 8px 0;"><strong>❌ Despesas:</strong> ${document.getElementById('dashDespesas').textContent}</p>
                <p style="margin: 8px 0;"><strong>💡 Margem:</strong> ${document.getElementById('dashMargem').textContent}</p>
            </div>

            <h3 style="color: #0066ff; font-size: 14px; margin: 15px 0 10px 0;">💵 Formas de Pagamento:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>💰 Dinheiro:</strong> ${document.getElementById('dashMoney').textContent}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>📱 PIX:</strong> ${document.getElementById('dashPix').textContent}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>💳 Cartão:</strong> ${document.getElementById('dashCard').textContent}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>📋 Fiado:</strong> ${document.getElementById('dashFiado').textContent}</p>
                </div>
            </div>

            <h3 style="color: #0066ff; font-size: 14px; margin: 15px 0 10px 0;">📦 Produtos Vendidos:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #fff5f0; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>⛽ Gás:</strong> ${document.getElementById('dashGasQtd').textContent} un.</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>💧 Água:</strong> ${document.getElementById('dashAguaQtd').textContent} un.</p>
                </div>
                <div style="background: #fff5f0; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>⚙️ Regulador:</strong> ${document.getElementById('dashRegQtd').textContent} un.</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0;"><strong>〰️ Mangueira:</strong> ${document.getElementById('dashManQtd').textContent} un.</p>
                </div>
            </div>
        </div>

        <div>
            <h2 style="color: #ff6b35; font-size: 18px; border-left: 4px solid #0066ff; padding-left: 15px; margin: 0 0 15px 0;">🛍️ VENDAS DO DIA</h2>
            <div id="vendascontent"></div>
        </div>
    `;
    
    // Adicionar conteúdo de vendas
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    const vendascontent = element.querySelector('#vendascontent');
    
    if (vendas.length === 0) {
        vendascontent.innerHTML = '<p style="color: #999;">Nenhuma venda registrada.</p>';
    } else {
        vendascontent.innerHTML = vendas.map(v => {
            const produtosHTML = v.produtos.map(p => 
                `<li style="margin: 4px 0; font-size: 11px;">${p.produto}: ${p.quantidade}x R$ ${p.valor.toFixed(2).replace('.', ',')}</li>`
            ).join('');
            
            return `
                <div style="background: #fff5f0; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #ff6b35;">
                    <p style="margin: 0 0 6px 0;"><strong>👤 ${v.cliente}</strong> - <span style="color: #2ecc71; font-weight: bold;">R$ ${v.total.toFixed(2).replace('.', ',')}</span></p>
                    <ul style="margin: 4px 0; padding-left: 20px;">${produtosHTML}</ul>
                    ${v.entregador && v.entregador !== 'Sem entregador' ? `<p style="margin: 4px 0; font-size: 11px;">🚚 ${v.entregador}</p>` : ''}
                    <p style="margin: 4px 0; font-size: 10px; color: #999;">${v.data}</p>
                </div>
            `;
        }).join('');
    }
    
    // Gerar PDF
    const options = {
        margin: 10,
        filename: `Relatorio_Diario_${dataAtual.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(options).from(element).save();
}

function gerarPDFMensal() {
    const hoje = new Date();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();
    const periodoMes = `${mes}/${ano}`;
    
    const vendas = JSON.parse(localStorage.getItem('vendas') || '[]');
    
    // Filtrar vendas do mês atual
    const vendasMes = vendas.filter(v => {
        const datavenda = v.data.split(' ')[0]; // Pega apenas a data
        return datavenda.includes(`/${mes}/${ano}`) || datavenda.endsWith(`/${periodoMes}`);
    });
    
    // Calcular totais do mês
    let totalMes = 0;
    let pagtosMes = { dinheiro: 0, pix: 0, cartao: 0, fiado: 0 };
    let produtosMes = { gas: { qtd: 0, valor: 0 }, agua: { qtd: 0, valor: 0 }, regulador: { qtd: 0, valor: 0 }, mangueira: { qtd: 0, valor: 0 } };
    
    vendasMes.forEach(v => {
        totalMes += v.total;
        v.produtos.forEach(p => {
            if (produtosMes[p.produto]) {
                produtosMes[p.produto].qtd += p.quantidade;
                produtosMes[p.produto].valor += p.valor * p.quantidade;
            }
            pagtosMes[p.pagamento] += p.valor * p.quantidade;
        });
    });
    
    // Criar estrutura HTML para o PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.backgroundColor = '#fff';
    element.style.fontFamily = 'Arial, sans-serif';
    
    // Cabeçalho
    element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ff6b35; padding-bottom: 20px;">
            <h1 style="color: #ff6b35; margin: 0; font-size: 28px;">🛢️ Alemão Gás - Relatório Mensal</h1>
            <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Período: ${mes}/${ano}</p>
        </div>

        <div style="margin-bottom: 30px;">
            <h2 style="color: #ff6b35; font-size: 18px; border-left: 4px solid #0066ff; padding-left: 15px; margin: 0 0 15px 0;">📊 RESUMO MENSAL</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p style="margin: 8px 0;"><strong>Total de Vendas:</strong> <span style="color: #2ecc71; font-size: 16px; font-weight: bold;">R$ ${totalMes.toFixed(2).replace('.', ',')}</span></p>
                <p style="margin: 8px 0;"><strong>Quantidade de Vendas:</strong> ${vendasMes.length}</p>
            </div>

            <h3 style="color: #0066ff; font-size: 14px; margin: 15px 0 10px 0;">💵 Formas de Pagamento:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 12px;"><strong>💰 Dinheiro:</strong> R$ ${pagtosMes.dinheiro.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 12px;"><strong>📱 PIX:</strong> R$ ${pagtosMes.pix.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 12px;"><strong>💳 Cartão:</strong> R$ ${pagtosMes.cartao.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px;">
                    <p style="margin: 0; font-size: 12px;"><strong>📋 Fiado:</strong> R$ ${pagtosMes.fiado.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>

            <h3 style="color: #0066ff; font-size: 14px; margin: 15px 0 10px 0;">📦 Produtos Vendidos no Mês:</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #fff5f0; padding: 10px; border-radius: 6px; font-size: 11px;">
                    <p style="margin: 0;"><strong>⛽ Gás:</strong> ${produtosMes.gas.qtd} un. | R$ ${produtosMes.gas.valor.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px; font-size: 11px;">
                    <p style="margin: 0;"><strong>💧 Água:</strong> ${produtosMes.agua.qtd} un. | R$ ${produtosMes.agua.valor.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #fff5f0; padding: 10px; border-radius: 6px; font-size: 11px;">
                    <p style="margin: 0;"><strong>⚙️ Regulador:</strong> ${produtosMes.regulador.qtd} un. | R$ ${produtosMes.regulador.valor.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 6px; font-size: 11px;">
                    <p style="margin: 0;"><strong>〰️ Mangueira:</strong> ${produtosMes.mangueira.qtd} un. | R$ ${produtosMes.mangueira.valor.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        </div>
    `;
    
    // Gerar PDF
    const options = {
        margin: 10,
        filename: `Relatorio_Mensal_${ano}-${mes}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(options).from(element).save();
}

// ========== INICIALIZAR ==========
window.addEventListener('DOMContentLoaded', function() {
    verificareLimparDadosDiarios(); // Verificar e limpar dados antigos
    carregarCustos();
    calcularDashboardDia();
    listarVendas();
    listarDespesas();
    listarFiados();
    listarCreditos();
    listarEntregadores();
    preencherEntregadores();
});

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    }
});
// Verificar autenticação ao carregar a página
window.addEventListener('load', function() {
    verificarAutenticacao();
});

// Permitir Enter para fazer login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                fazerLogin(event);
            }
        });
    }
});
