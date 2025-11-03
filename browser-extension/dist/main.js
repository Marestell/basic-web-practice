form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}
function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        form.style.display = 'none';
        results.style.display = 'block';
        loading.style.display = 'block';
        clearBtn.style.display = 'block';
        errors.textContent = '';
        displayCarbonUsage(storedApiKey, storedRegion);
    }
};

function handleSubmit(e) {
    e.preventDefault();
    form.style.display = 'none';
    results.style.display = 'block';
    loading.style.display = 'block';
    clearBtn.style.display = 'block';
    errors.textContent = '';
    displayCarbonUsage(storedApiKey, storedRegion);
}


