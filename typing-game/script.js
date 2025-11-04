const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
let gameActive = false;

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startBtn = document.getElementById('start');
const wrap = typedValueElement.closest('.input-wrap');
const icon = wrap ? wrap.querySelector('.fa-keyboard') : null;

const modal = document.getElementById('result-modal');
const modalTime = document.getElementById('result-time');
const modalWpm = document.getElementById('result-wpm');
const modalClose = document.getElementById('modal-close');
const modalRestart = document.getElementById('modal-restart');
const modalBackdrop = modal.querySelector('[data-close]');

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

const modalBest = document.getElementById('modal-best');

const BEST_KEY = 'typingGame.bestWpm.v1';
let bestWpm = null;
try {
  const saved = localStorage.getItem(BEST_KEY);
  if (saved !== null) {
    const n = Number(saved);
    if (Number.isFinite(n)) bestWpm = n;
  }
} catch (e) {
}

document.getElementById('start').addEventListener('click',() => {
    closeModal();
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(function(word) { return `<span>${word} </span>`});
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';

    typedValueElement.value = '';
    typedValueElement.focus();
    typedValueElement.disabled = false;
    startBtn.disabled = true;
    
    startTime = new Date().getTime();
    gameActive = true;
});

typedValueElement.addEventListener('input', () => {
    if (!gameActive) return;

    const currentWord = words[wordIndex];
    const typedValue = typedValueElement .value;
    
    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedSeconds = (new Date().getTime() - startTime) / 1000;
        const formatted = elapsedSeconds.toFixed(2);
        const wpm = Math.max(1, Math.round(words.length / (elapsedSeconds / 60)));

        messageElement.textContent = '';
        typedValueElement.disabled = true;
        startBtn.disabled = false;

        modalTime.textContent = formatted;
        modalWpm.textContent = wpm;
        const isNewBest = (bestWpm === null) || (wpm > bestWpm);
        if (isNewBest) {
            try { localStorage.setItem(BEST_KEY, String(wpm)); } catch (e) {}
            bestWpm = wpm;
            modalBest.textContent = 'New Best Record!';
            modalBest.classList.add('newbest');
        } else {
            modalBest.textContent = `Best: ${bestWpm} WPM`;
            modalBest.classList.remove('newbest');
        }
        openModal();
        return;

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        typedValueElement.value = '';
        wordIndex ++;
        typedValueElement.classList.remove('error', 'shake');
        typedValueElement.closest('.input-wrap')?.classList.remove('error');
        typedValueElement.classList.add('next-flash');
        if (icon) icon.classList.add('next-flash');

        typedValueElement.addEventListener('animationend', () => {
            typedValueElement.classList.remove('next-flash');
            if (icon) icon.classList.remove('next-flash');
        }, { once: true });

        for (const wordElement of quoteElement.childNodes ) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';

    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.classList.remove('error', 'shake');
        typedValueElement.closest('.input-wrap')?.classList.remove('error');

    } else {
        typedValueElement.classList.add('error');
        typedValueElement.closest('.input-wrap').classList.add('error');

        typedValueElement.classList.remove('shake');
        void typedValueElement.offsetWidth;
        typedValueElement.classList.add('shake');
    }
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
modalRestart.addEventListener('click', () => {
  closeModal();
  startBtn.click();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});