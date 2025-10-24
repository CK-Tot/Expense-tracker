// Helper function
const $ = id => document.getElementById(id);

// Access DOM EL
const balanceEl = $('balance');
const incomeEl = $('income');
const expenseEl = $('expense');
const transactionForm = $('transaction-form');
const textInput = $('text');
const amountInput = $('amount');
const typeSelect = $('type');
const transactionList = $('transaction-list');

// Load transactions from localStorage or initialize empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// init the app
function init () 
{
    updateBalance();
    renderTransactions();
}

// Add transaction
function addTransaction(e)
{
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (text === '' || isNaN(amount)) {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        type
    }

    transactions.push(transaction);

    updateLocalStorage();
    updateBalance();
    renderTransactions();

    // Reset form
    textInput.value = '';
    amountInput.value = '';

}


// Generate random id
function generateID () 
{
    return Math.floor(Math.random() * 1000000000);
}


// Remove transaction by ID
function removeTransaction(id)
{
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateBalance();
    renderTransactions();
}


// Update Balance, income and expense

function updateBalance()
{
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

    const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

    const expense = (
        amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balanceEl.textContent = `$${total}`;
    incomeEl.textContent = `$${income}`;
    expenseEl.textContent = `$${expense}`;
}

// Render Transactions
function renderTransactions()
{
    transactionList.innerHTML = '';

    if (transactions.length === 0)
    {
        transactionList.innerHTML = '<p>No Transactions Yet</p>';
        return;
    }

    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const li = document.createElement('li');
        li.className = `transaction ${transaction.type}`;

        li.innerHTML = `
        <div class="details">
        ${transaction.text}
        </div>
        <div class="amount">
        ${sign}$${Math.abs(transaction.amount).toFixed(2)}
        </div>
        <button class="delete" id="delete-btn"><i class="fa-solid fa-xmark"></i></button>

        `;

         transactionList.appendChild(li);
        const deleteBtn = document.getElementById('delete-btn');

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this transaction?')){
                removeTransaction(transaction.id);
            }
            
        });

       
    });
}

// Update localStorage
function updateLocalStorage()
{
    localStorage.setItem('transactions',JSON.stringify(transactions));
}

// Event listeners
transactionForm.addEventListener('submit', addTransaction);


// Initialize app
init();

