// Variáveis globais
let calculationResults = {};

// Elementos DOM
const form = document.getElementById('rampaForm');
const resultsSection = document.getElementById('resultsSection');
const visualizationSection = document.getElementById('visualizationSection');
const canvas = document.getElementById('rampaCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
form.addEventListener('submit', calculateRamp);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetCalculator);

// Função principal de cálculo
function calculateRamp(e) {
    e.preventDefault();
    
    // Obter valores de entrada
    const H1 = parseFloat(document.getElementById('altura').value);
    const L = parseFloat(document.getElementById('largura').value);
    
    // Validar entradas
    if (H1 <= 0 || L <= 0) {
        alert('Por favor, insira valores positivos para altura e largura.');
        return;
    }
    
    // Realizar cálculos conforme as regras fornecidas
    const C1 = L * 1.20;
    const H2 = C1 / 12;
    let C2 = (H1 - H2) * 20;
    
    // Aplicar condicionais
    let comprimentoFinal;
    let condicaoUsada;
    
    if (C2 > C1) {
        comprimentoFinal = C2;
        condicaoUsada = 'ACOMODAÇÕES LATERAIS > COMPRIMENTO DA RAMPA PRINCIPAL, usando ACOMODAÇÕES LATERAIS';
    } else {
        C2 = H1 / 12;
        comprimentoFinal = C2;
        condicaoUsada = 'ACOMODAÇÕES LATERAIS < COMPRIMENTO DA RAMPA PRINCIPAL, recalculado como ALTURA DA GUIA/12';
    }
    
    // Calcular inclinação percentual
    const inclinacao = (H1 / comprimentoFinal) * 100;
    
    // Armazenar resultados
    calculationResults = {
        H1: H1,
        L: L,
        C1: C1,
        H2: H2,
        C2: C2,
        comprimentoFinal: comprimentoFinal,
        inclinacao: inclinacao,
        condicaoUsada: condicaoUsada
    };
    
    // Exibir resultados
    displayResults();
    drawRamp();
    
    // Mostrar seções ocultas
    resultsSection.style.display = 'block';
    visualizationSection.style.display = 'block';
    
    // Scroll suave para resultados
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para exibir resultados
function displayResults() {
    document.getElementById('resultC1').textContent = `${calculationResults.C1.toFixed(2)} cm`;
    document.getElementById('resultH2').textContent = `${calculationResults.H2.toFixed(2)} cm`;
    document.getElementById('resultC2').textContent = `${calculationResults.C2.toFixed(2)} cm`;
    document.getElementById('resultFinal').textContent = `${calculationResults.comprimentoFinal.toFixed(2)} cm`;
    document.getElementById('resultInclinacao').textContent = `${calculationResults.inclinacao.toFixed(2)}%`;
    
    // Adicionar classe de aviso se inclinação estiver fora dos padrões
    const inclinacaoElement = document.getElementById('resultInclinacao');
    if (calculationResults.inclinacao > 8.33) {
        inclinacaoElement.style.color = '#dc2626';
        inclinacaoElement.innerHTML += ' <small>(Acima do recomendado)</small>';
    } else {
        inclinacaoElement.style.color = '#16a34a';
        inclinacaoElement.innerHTML += ' <small>(Dentro do padrão)</small>';
    }
}

// Função para desenhar a rampa
function drawRamp() {
    // Configurar dimensões do canvas
    const canvasWidth = 800;
    const canvasHeight = 400;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Configurar estilo
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calcular proporções para o desenho
    const padding = 80;
    const maxWidth = canvasWidth - (padding * 2);
    const maxHeight = canvasHeight - (padding * 2);
    
    // Escala
    const scale = Math.min(
        maxWidth / calculationResults.comprimentoFinal,
        maxHeight / calculationResults.H1
    ) * 0.8;
    
    // Dimensões escaladas
    const rampWidth = calculationResults.comprimentoFinal * scale;
    const rampHeight = calculationResults.H1 * scale;
    
    // Posição inicial
    const startX = (canvasWidth - rampWidth) / 2;
    const startY = canvasHeight - padding;
    
    // Desenhar grade de fundo
    drawGrid();
    
    // Desenhar a rampa
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + rampWidth, startY);
    ctx.lineTo(startX + rampWidth, startY - rampHeight);
    ctx.closePath();
    
    // Preencher rampa
    const gradient = ctx.createLinearGradient(startX, startY, startX + rampWidth, startY - rampHeight);
    gradient.addColorStop(0, '#dbeafe');
    gradient.addColorStop(1, '#93c5fd');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Contorno da rampa
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Desenhar dimensões
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Comprimento (base)
    drawDimensionLine(startX, startY + 30, startX + rampWidth, startY + 30, 
                     `${calculationResults.comprimentoFinal.toFixed(1)} cm`);
    
    // Altura
    drawDimensionLine(startX + rampWidth + 30, startY, startX + rampWidth + 30, startY - rampHeight, 
                     `${calculationResults.H1.toFixed(1)} cm`, true);
    
    // Ângulo de inclinação
    const angle = Math.atan(calculationResults.H1 / calculationResults.comprimentoFinal);
    const angleDegrees = (angle * 180 / Math.PI).toFixed(1);
    
    ctx.save();
    ctx.translate(startX + 50, startY - 20);
    ctx.rotate(-angle);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${angleDegrees}° (${calculationResults.inclinacao.toFixed(1)}%)`, 0, 0);
    ctx.restore();
    
    // Adicionar título
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Visualização da Rampa de Calçada', canvasWidth / 2, 30);
    
    // Adicionar informações
    ctx.font = '14px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    const infoY = 60;
    ctx.fillText(`LARGURA DA CALÇADA: ${calculationResults.L.toFixed(1)} cm`, 20, infoY);
    ctx.fillText(`Condição aplicada: ${calculationResults.condicaoUsada}`, 20, infoY + 20);
}

// Função para desenhar grade de fundo
function drawGrid() {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Linhas verticais
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Linhas horizontais
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Função para desenhar linha de dimensão
function drawDimensionLine(x1, y1, x2, y2, text, vertical = false) {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    
    // Linha principal
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Setas nas extremidades
    const arrowSize = 8;
    if (vertical) {
        // Seta superior
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - arrowSize/2, y1 + arrowSize);
        ctx.lineTo(x1 + arrowSize/2, y1 + arrowSize);
        ctx.closePath();
        ctx.fill();
        
        // Seta inferior
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - arrowSize/2, y2 - arrowSize);
        ctx.lineTo(x2 + arrowSize/2, y2 - arrowSize);
        ctx.closePath();
        ctx.fill();
    } else {
        // Seta esquerda
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + arrowSize, y1 - arrowSize/2);
        ctx.lineTo(x1 + arrowSize, y1 + arrowSize/2);
        ctx.closePath();
        ctx.fill();
        
        // Seta direita
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - arrowSize, y2 - arrowSize/2);
        ctx.lineTo(x2 - arrowSize, y2 + arrowSize/2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Texto
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Arial';
    if (vertical) {
        ctx.save();
        ctx.translate((x1 + x2) / 2 + 20, (y1 + y2) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText(text, 0, 0);
        ctx.restore();
    } else {
        ctx.textAlign = 'center';
        ctx.fillText(text, (x1 + x2) / 2, y1 - 10);
    }
}

// Função para download da imagem
function downloadImage() {
    // Criar link temporário
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `rampa-calcada-${timestamp}.png`;
    
    // Converter canvas para blob e criar URL
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        
        // Limpar URL após download
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });
}

// Função para resetar calculadora
function resetCalculator() {
    form.reset();
    resultsSection.style.display = 'none';
    visualizationSection.style.display = 'none';
    calculationResults = {};
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Adicionar animação ao carregar
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.calculator-wrapper section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});