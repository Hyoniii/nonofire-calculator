/**
 * 노노파이어 커튼 계산기
 * 제작 사이즈 및 주문 수량 계산
 */

// ===== 설정값 =====
const CONFIG = {
    // 주름 스타일별 나눗수
    styleDivisor: {
        '나비주름': 70,
        '뒷맞주름': 80,
        '민자주름': 130
    }
};

// ===== 상태 관리 =====
let state = {
    windowType: '통창',
    pleatsStyle: '나비주름'
};

// ===== DOM 요소 =====
const elements = {
    inputWidth: document.getElementById('inputWidth'),
    inputHeight: document.getElementById('inputHeight'),
    windowType: document.getElementById('windowType'),
    pleatsStyle: document.getElementById('pleatsStyle'),
    calcButton: document.getElementById('calcButton'),
    resultArea: document.getElementById('resultArea'),
    resultWidth: document.getElementById('resultWidth'),
    resultHeight: document.getElementById('resultHeight'),
    resultFormula: document.getElementById('resultFormula'),
    resultQuantity: document.getElementById('resultQuantity'),
    quantityFormula: document.getElementById('quantityFormula'),
    resultNotice: document.getElementById('resultNotice')
};

// ===== 초기화 =====
function init() {
    setupEventListeners();
}

function setupEventListeners() {
    // 창 종류 토글
    elements.windowType.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.windowType.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.windowType = btn.dataset.value;
        });
    });

    // 주름 스타일 버튼
    elements.pleatsStyle.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.pleatsStyle.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.pleatsStyle = btn.dataset.value;
        });
    });

    // 계산 버튼
    elements.calcButton.addEventListener('click', calculate);

    // Enter 키로도 계산
    elements.inputWidth.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });
    elements.inputHeight.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });
}

// ===== 계산 로직 =====
function calculate() {
    const inputWidth = parseFloat(elements.inputWidth.value);
    const inputHeight = parseFloat(elements.inputHeight.value);

    // 입력값 검증
    if (!inputWidth || !inputHeight || inputWidth <= 0 || inputHeight <= 0) {
        showNotice('실측 가로와 세로를 입력해 주세요.', 'error');
        return;
    }

    // 1. 제작 사이즈 계산
    const productionWidth = Math.round(inputWidth * 1.1);
    const productionHeight = state.windowType === '통창'
        ? inputHeight - 4
        : inputHeight + 30;

    // 2. 주문 수량 계산
    const divisor = CONFIG.styleDivisor[state.pleatsStyle];
    const calculatedQuantity = productionWidth / divisor;
    const orderQuantity = Math.ceil(calculatedQuantity);

    // 3. 결과 표시
    displayResults({
        inputWidth,
        inputHeight,
        productionWidth,
        productionHeight,
        divisor,
        calculatedQuantity,
        orderQuantity
    });
}

// 결과 표시
function displayResults(data) {
    // placeholder 클래스 제거 (실제 결과 표시)
    elements.resultArea.classList.remove('placeholder');

    // 제작 사이즈 표시
    elements.resultWidth.textContent = data.productionWidth;
    elements.resultHeight.textContent = data.productionHeight;

    // 제작 사이즈 계산식
    const heightFormula = state.windowType === '통창'
        ? `${data.inputHeight}-4`
        : `${data.inputHeight}+30`;
    elements.resultFormula.textContent = `(${data.inputWidth}×1.1 / ${heightFormula})`;

    // 주문 수량 표시
    elements.resultQuantity.textContent = data.orderQuantity;

    // 주문 수량 계산식
    elements.quantityFormula.textContent = `(${data.productionWidth}÷${data.divisor} = ${data.calculatedQuantity.toFixed(1)} → 올림)`;

    // 안내 메시지
    showNotice(`${state.pleatsStyle} 기준 주문 수량: ${data.orderQuantity}개`, 'success');
}

// 안내 메시지 표시
function showNotice(message, type = '') {
    elements.resultNotice.className = 'result-notice';
    if (type) {
        elements.resultNotice.classList.add(type);
    }
    elements.resultNotice.querySelector('p').textContent = message;
}

// ===== 시작 =====
document.addEventListener('DOMContentLoaded', init);
