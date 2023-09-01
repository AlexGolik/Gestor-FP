document.addEventListener('DOMContentLoaded', () => {
    const incomeForm = document.getElementById('income-form');
    const expenseForm = document.getElementById('expense-form');
    const addIncomeCategoryForm = document.getElementById('add-income-category-form');
    const addExpenseCategoryForm = document.getElementById('add-expense-category-form');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeCategorySelect = document.getElementById('income-category');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategorySelect = document.getElementById('expense-category');
    const newIncomeCategoryInput = document.getElementById('new-income-category');
    const newExpenseCategoryInput = document.getElementById('new-expense-category');
    const incomeTotal = document.getElementById('income-total');
    const expenseTotal = document.getElementById('expense-total');
    const incomeTable = document.getElementById('income-table');
    const expenseTable = document.getElementById('expense-table');
    const savePdfButton = document.getElementById('save-pdf-button');

    const totalsByCategory = {
        income: {},
        expense: {},
    };

    // Crear el gráfico utilizando Chart.js
    const ctx = document.getElementById("chart").getContext("2d");
    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Ingresos", "Gastos"],
            datasets: [{
                label: "Resumen Financiero",
                data: [0, 0],
                backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Oculta la leyenda
                }
            }
        }
    });

    incomeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const incomeAmount = parseFloat(incomeAmountInput.value);
        const incomeCategory = incomeCategorySelect.value;

        if (isNaN(incomeAmount) || incomeAmount <= 0) {
            alert("Por favor, ingrese una cantidad válida.");
            return;
        }

        if (!totalsByCategory.income[incomeCategory]) {
            totalsByCategory.income[incomeCategory] = 0;
        }

        totalsByCategory.income[incomeCategory] += incomeAmount;

        updateTotals();
        updateChart();
        updateCategoryTable();
    });

    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const expenseAmount = parseFloat(expenseAmountInput.value);
        const expenseCategory = expenseCategorySelect.value;

        if (isNaN(expenseAmount) || expenseAmount <= 0) {
            alert("Por favor, ingrese una cantidad válida.");
            return;
        }

        if (!totalsByCategory.expense[expenseCategory]) {
            totalsByCategory.expense[expenseCategory] = 0;
        }

        totalsByCategory.expense[expenseCategory] += expenseAmount;

        updateTotals();
        updateChart();
        updateCategoryTable();
    });

    addIncomeCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newIncomeCategory = newIncomeCategoryInput.value.trim();

        if (!newIncomeCategory) {
            alert("Por favor, ingrese una nueva categoría de ingreso.");
            return;
        }

        newIncomeCategoryInput.value = "";

        const newIncomeCategoryOption = document.createElement("option");
        newIncomeCategoryOption.value = newIncomeCategory;
        newIncomeCategoryOption.textContent = newIncomeCategory;
        incomeCategorySelect.appendChild(newIncomeCategoryOption);

        updateCategoryTable();
    });

    addExpenseCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newExpenseCategory = newExpenseCategoryInput.value.trim();

        if (!newExpenseCategory) {
            alert("Por favor, ingrese una nueva categoría de gasto.");
            return;
        }

        newExpenseCategoryInput.value = "";

        const newExpenseCategoryOption = document.createElement("option");
        newExpenseCategoryOption.value = newExpenseCategory;
        newExpenseCategoryOption.textContent = newExpenseCategory;
        expenseCategorySelect.appendChild(newExpenseCategoryOption);

        updateCategoryTable();
    });

    function updateTotals() {
        let totalIncome = 0;
        let totalExpense = 0;

        for (const category in totalsByCategory.income) {
            totalIncome += totalsByCategory.income[category];
        }

        for (const category in totalsByCategory.expense) {
            totalExpense += totalsByCategory.expense[category];
        }

        incomeTotal.textContent = `Total de Ingresos: $${totalIncome.toFixed(2)}`;
        expenseTotal.textContent = `Total de Gastos: $${totalExpense.toFixed(2)}`;
    }

    function updateChart() {
        chart.data.datasets[0].data = [calculateTotalIncome(), calculateTotalExpense()];
        chart.update();
    }

    function calculateTotalIncome() {
        let total = 0;
        for (const category in totalsByCategory.income) {
            total += totalsByCategory.income[category];
        }
        return total;
    }

    function calculateTotalExpense() {
        let total = 0;
        for (const category in totalsByCategory.expense) {
            total += totalsByCategory.expense[category];
        }
        return total;
    }

    function updateCategoryTable() {
        const incomeTable = document.getElementById("income-table");
        const expenseTable = document.getElementById("expense-table");

        incomeTable.innerHTML = "";
        expenseTable.innerHTML = "";

        let totalIncome = 0;
        let totalExpense = 0;

        for (const category in totalsByCategory.income) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${category}</td><td>$${totalsByCategory.income[category].toFixed(2)}</td>`;
            incomeTable.appendChild(row);
            totalIncome += totalsByCategory.income[category];
        }

        for (const category in totalsByCategory.expense) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${category}</td><td>$${totalsByCategory.expense[category].toFixed(2)}</td>`;
            expenseTable.appendChild(row);
            totalExpense += totalsByCategory.expense[category];
        }

        incomeTotal.textContent = `Total de Ingresos: $${totalIncome.toFixed(2)}`;
        expenseTotal.textContent = `Total de Gastos: $${totalExpense.toFixed(2)}`;
    }
   

    savePdfButton.addEventListener('click', () => {
        saveAsPdf();
    });

    function saveAsPdf() {
        const doc = new jsPDF(); // Crear un nuevo objeto de documento
        doc.setFontSize(18);
        doc.text('Resumen Financiero', 10, 20);

        // Resto de tu código para generar las tablas y contenido del PDF

        doc.save('resumen_financiero.pdf');
    }

    function generateTable(doc, x, y, data, title) {
        doc.setFontSize(14);
        doc.text(title, x, y - 10);

        let startY = y;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            for (let j = 0; j < row.length; j++) {
                doc.text(row[j], x + j * 60, startY);
            }
            startY += 10;
        }
    }

    function getTableData(tableId) {
        const tableData = [];
        const table = document.getElementById(tableId);

        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowData = [];

            for (let j = 0; j < row.cells.length; j++) {
                rowData.push(row.cells[j].textContent);
            }

            tableData.push(rowData);
        }

        return tableData;
    }


});