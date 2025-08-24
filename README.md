# Calculadora de Rampa de Calçada

## Descrição
Aplicação web responsiva para calcular as dimensões adequadas de rampas de calçada, seguindo regras específicas de cálculo e gerando visualizações gráficas.

## Funcionalidades
- ✅ Cálculo automático das dimensões da rampa baseado em altura e largura
- ✅ Visualização gráfica da rampa em canvas HTML5
- ✅ Download da imagem gerada
- ✅ Interface responsiva e moderna
- ✅ Validação de dados de entrada
- ✅ Indicação visual se a inclinação está dentro dos padrões recomendados

## Regras de Cálculo
O sistema utiliza as seguintes fórmulas:

1. **C1** = L × 1,20
2. **H2** = C1 ÷ 12
3. **C2** = (H1 - H2) × 20

### Condicionais:
- Se C2 > C1, usar C2
- Se C2 < C1, então C2 = H1 ÷ 12

Onde:
- **H1**: Altura do desnível (inserida pelo usuário)
- **L**: Largura disponível (inserida pelo usuário)
- **C1**: Comprimento base calculado
- **H2**: Altura intermediária calculada
- **C2**: Comprimento final da rampa

## Como Usar
1. Abra o arquivo `index.html` em um navegador web moderno
2. Insira a altura (H1) em centímetros
3. Insira a largura (L) em centímetros
4. Clique em "Calcular Rampa"
5. Visualize os resultados e a representação gráfica
6. Baixe a imagem gerada se desejar

## Tecnologias Utilizadas
- HTML5
- CSS3 (Design responsivo)
- JavaScript (ES6+)
- Canvas API para visualização gráfica

## Estrutura de Arquivos
```
/
├── index.html      # Estrutura principal da aplicação
├── styles.css      # Estilos e design responsivo
├── script.js       # Lógica de cálculo e visualização
└── README.md       # Este arquivo
```

## Compatibilidade
- Chrome (recomendado)
- Firefox
- Safari
- Edge
- Dispositivos móveis (responsivo)

## Notas sobre Acessibilidade
A calculadora foi desenvolvida considerando normas de acessibilidade. A inclinação recomendada para rampas de acessibilidade é de no máximo 8,33% (1:12). O sistema indica visualmente quando os valores calculados excedem esse limite.