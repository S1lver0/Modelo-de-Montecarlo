const dataTable = document.getElementById("data-table").getElementsByTagName('tbody')[0];
const resultadosTable = document.getElementById("resultados-table").getElementsByTagName('tbody')[0];

function addRow() {
    const newRow = dataTable.insertRow();
    const cells = [];

    for (let i = 0; i < 5; i++) {
        cells.push(newRow.insertCell(i));
    }

    cells[0].contentEditable = true; // Hacer editable el valor
    cells[1].contentEditable = true; // Hacer editable la frecuencia
    cells[2].contentEditable = false; // Deshabilitar la edición de frecuencia relativa
    cells[3].contentEditable = false; // Deshabilitar la edición del intervalo inferior
    cells[4].contentEditable = false; // Deshabilitar la edición del intervalo superior
}

function calculateFrequencies() {
    const rows = dataTable.rows;
    let totalFrequency = 0;

    for (let i = 0; i < rows.length; i++) {
        const value = parseFloat(rows[i].cells[0].innerText);
        const frequency = parseInt(rows[i].cells[1].innerText);

        totalFrequency += frequency;
    }

    let lowerBound = 0;

    for (let i = 0; i < rows.length; i++) {
        const value = parseFloat(rows[i].cells[0].innerText);
        const frequency = parseInt(rows[i].cells[1].innerText);

        const relativeFrequency = frequency / totalFrequency;

        const upperBound = lowerBound + relativeFrequency;

        rows[i].cells[2].innerText = relativeFrequency.toFixed(2);
        rows[i].cells[3].innerText = lowerBound.toFixed(2);
        rows[i].cells[4].innerText = upperBound.toFixed(2);

        lowerBound = upperBound;
    }
}

function montecarloSimulation() {
    const totalSimulations = document.getElementById("num-simulations").valueAsNumber || 10000;
    let sumValues = 0;

    // Limpiar la tabla de resultados previos
    resultadosTable.innerHTML = '';

    for (let i = 0; i < totalSimulations; i++) {
        const randomValue = Math.random();
        
        // Verificar en qué intervalo cae
        let selectedValue = null;
        for (let j = 0; j < dataTable.rows.length; j++) {
            const lowerBound = parseFloat(dataTable.rows[j].cells[3].innerText);
            const upperBound = parseFloat(dataTable.rows[j].cells[4].innerText);

            if (randomValue >= lowerBound && randomValue < upperBound) {
                selectedValue = parseFloat(dataTable.rows[j].cells[0].innerText);
                sumValues += selectedValue;
                break;
            }
        }

        // Visualizar en la tabla de resultados
        const resultadosRow = resultadosTable.insertRow();
        const resultadosCells = [resultadosRow.insertCell(0), resultadosRow.insertCell(1)];
        resultadosCells[0].innerText = randomValue.toFixed(4);
        resultadosCells[1].innerText = selectedValue;
    }

    // Calcular y mostrar el resultado promedio
    const averageResult = sumValues / totalSimulations;
    document.getElementById("average-result").innerText = averageResult.toFixed(2);
}

// Inicializar la tabla con una fila al cargar la página
addRow();