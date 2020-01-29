class RowOperationCalculator extends CalculatorSetup{
    /****************************** GAUSSIAN CALCULATOR ****************************/
    constructor(matrixCount, matrixHolder,matrixContainer,mtx){
        
        super(matrixCount, matrixHolder, matrixContainer);
        this.ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // Used to give the matrices letter labels

        this.matrixCount = matrixCount;
        this.matrixHolder = matrixHolder;
        this.matrixContainer = matrixContainer;
        this.mtx = mtx;

        // this.gaussianCalc = false; // This will determine whether to show the gaussian calculator or not
        this.rowOperatedMatrix = []; // Array to save the matrices which have had row operations performed, as well as the operation
        this.operationCount = 1;

        // Identity matrix operations
        this.identityOperationMatrix = [];

        // Calculator containers
        this.gaussCalculatorContainer = document.getElementById('gaussian-calculator');
        this.matrixCalculatorContainer = document.getElementById('matrix-calculator');
        this.rowOpContainer = document.getElementById('row-operation-container');

        this.gaussian = true;

        // Create input for user to put formula
        this.operationInput = document.getElementById('row-operation');
        this.operationSubmit = document.getElementById('row-operation-submit');

        // Create button for user to click when done and wants to submit the matrix
        this.showElementaryMatricesButton = document.getElementById('elementary-matrix-show-button');
        this.showIdentityMatricesButton = document.getElementById('identity-matrix-show-button');

        // Create button for user to click when done and wants to submit the matrix
        this.doneButton = document.getElementById('gaussian-matrix-submit');




    }
    
    newElement(elementType, appendagee, attributes, text) {
        // Appendagee is the parent element it will be attached to
        let element = document.createElement(elementType);
        // Add the attributes, {attributes} will be an object where the attributes can be placed and will be looped through
        Object.keys(attributes).forEach(key => { element.setAttribute(key, attributes[key]); });
        if (text) element.innerHTML = text; // If there is text then add it to the element
        if (appendagee) appendagee.appendChild(element);// Add the element to the parent
        return element;
    }
    printMatrix(container, mtx, mtxCount, text, className, matrixText,idName) {
        // Loop through matrix values and create table from them
        // Called in printMatrices(),
        let matrixBox = this.newElement('div', container, { class: className ? className : 'matrix-calculator-box' })
        this.newElement('h3', matrixBox, {}, (matrixText ? matrixText : "MATRIX " + this.ALPHABET.charAt(mtxCount).toUpperCase() + " " + text))

        // New table to hold the matrix values
        let newMatrixTable = this.newElement('table', '', { class: 'matrix' })

        for (let row = 0; row < mtx.length; row++) {
            // Loop through rows of matrix
            let rowContainer = this.newElement('tr', '', { id: 'print-matrix-' + mtx + '-row-' + row, class: 'matrix-print-row' })

            for (let col = 0; col < mtx[0].length; col++) {
                // Loop through each column value in the matrix row
                this.newElement('td', rowContainer, {}, mtx[row][col] + "")
            }
            // Append tr to table
            newMatrixTable.appendChild(rowContainer);
        }
        matrixBox.appendChild(newMatrixTable);
    }

    gaussianCalculator(){
        // Called in extractCalculation() of MatrixCalculator class when 'matrixletterR' is typed into the input
        this.rowOperatedMatrix.push({ matrix: this.mtx, operation: '' }); // Push the original matrix
        this.createGaussianCalculator();
        
    }

    createGaussianCalculator(){
        /* Add the calculator to the DOM, remove the matrix calculator till finished */
        // Get the container for the calculation input
        this.gaussCalculatorContainer.classList.remove('inputs-container-hidden');

        // Remove the matrixCalculator from the DOM
        this.matrixCalculatorContainer.classList.add('inputs-container-hidden');
 
        // Add initial Elementary matrix to the holder
        this.identityOperationMatrix.push({ matrix: this.getElementaryMatrix(this.mtx.length, this.mtx[0].length), operation: '' });

        /************************* EVENT LISTENERS ********************************/
        this.showElementaryMatricesButton.addEventListener('click', () => {
            // Will remove or show all elementary matrices associated with the row operations
            let container = document.querySelectorAll('.elementary-matrix-container');
            container.forEach(ele => ele.classList.toggle('matrix-container-hidden'));
        });

        this.showIdentityMatricesButton.addEventListener('click', () => {
            // Will remove or show all identity matrix associated with the row operations
            let container = document.querySelectorAll('.identity-matrix-container');
            container.forEach(ele => ele.classList.toggle('matrix-container-hidden'));
        });

        this.operationSubmit.addEventListener('click', () => {
            // When user clicks the submit button to perform row operation on the matrix
            let operation = this.operationInput.value;
            this.extractRowOperation(operation);
        });

        this.doneButton.addEventListener('click', () => {
            /* When user done performing row operations, submit the matrix to the holder
               remove the gauss-calculator and show the matrix-calculator again
               Also, show which operations were performed to get this matrix when print it to screen */

            // Get the container for the calculation input and clear it

            document.querySelectorAll('#gaussian-calculator > .identity-matrix-container').forEach(node => {
                node.remove();
            })
            document.querySelectorAll('#gaussian-calculator > .matrix-calculator-box').forEach(node => {
                node.remove();
            })
            document.querySelectorAll('#gaussian-calculator > .elementary-matrix-container').forEach(node=>{
                node.remove();
            })

            // Add the matrixCalculator to the DOM
            this.matrixCalculatorContainer.classList.remove('inputs-container-hidden');

            /******* Print the matrix *******/

            // Create text form matrix
            let text = '';
            this.rowOperatedMatrix.forEach((obj, index) => { if (index > 0) text += ('<br>' + (index) + '. ' + obj.operation) });

            this.matrixCount = parseInt(this.matrixCount) + 1; // Increment the matrix count

            // Add to matrix holder
            this.matrixHolder[this.matrixCount - 1] = this.rowOperatedMatrix[this.operationCount - 1]['matrix'];

            // Print
            this.printMatrix(this.matrixContainer, this.rowOperatedMatrix[this.operationCount - 1]['matrix'], this.matrixCount - 1,
                text) // Print the final matrix, which matrix its defined from and what operations performed
            // Clear the operations
            this.rowOperatedMatrix = []; // Array to save the matrices which have had row operations performed, as well as the operation
            this.operationCount = 1;
            this.gaussian = false;
            this.gaussCalculatorContainer.classList.add('inputs-container-hidden');

        })
    };
    extractRowOperation(operation){
        // Operation should be in the form 'R1=R1+R2'
        let operationArray = operation.split('='); // Split array into R1, R1+R2
        let rowToOperateOn = operationArray[0].match(/\d/) - 1; // The row will be one less than written
        let newOperation = operationArray[1];
        // Take the current matrix form and perform the next operation
        let currentMatrix = this.rowOperatedMatrix[this.operationCount - 1]['matrix'];

        let newMatrix = [...currentMatrix]; // Create variable for new matrix

        // Get elementary matrix matching the size of this one
        let rowSize = newMatrix.length;
        let columnSize = newMatrix[0].length;
        let elementaryMatrix = this.getElementaryMatrix(rowSize, columnSize);

        // Current identity matrix
        let identityMatrix = [...this.identityOperationMatrix[this.operationCount - 1]['matrix']];

        if (newOperation.includes('*') && newOperation.includes('+')) {
            this.addOrSubtractMultipleOfRow(newMatrix, rowToOperateOn, newOperation, '+');
            this.addOrSubtractMultipleOfRow(elementaryMatrix, rowToOperateOn, newOperation, '+');
            this.addOrSubtractMultipleOfRow(identityMatrix, rowToOperateOn, newOperation, '+');

        } else if (newOperation.includes('*') && newOperation.includes('-')) {
            this.addOrSubtractMultipleOfRow(newMatrix, rowToOperateOn, newOperation, '-');
            this.addOrSubtractMultipleOfRow(elementaryMatrix, rowToOperateOn, newOperation, '-');
            this.addOrSubtractMultipleOfRow(identityMatrix, rowToOperateOn, newOperation, '-');

        } else if (newOperation.includes('+')) {
            this.rowOperation(newMatrix, rowToOperateOn, newOperation, '+');
            this.rowOperation(elementaryMatrix, rowToOperateOn, newOperation, '+');
            this.rowOperation(identityMatrix, rowToOperateOn, newOperation, '+');
        } else if (newOperation.includes('-')) {
            this.rowOperation(newMatrix, rowToOperateOn, newOperation, '-');
            this.rowOperation(elementaryMatrix, rowToOperateOn, newOperation, '-');
            this.rowOperation(identityMatrix, rowToOperateOn, newOperation, '-');

        } else if (newOperation.includes('/')) {
            this.rowOperation(newMatrix, rowToOperateOn, newOperation, '/');
            this.rowOperation(elementaryMatrix, rowToOperateOn, newOperation, '/');
            this.rowOperation(identityMatrix, rowToOperateOn, newOperation, '/');

        } else if (newOperation.includes('*')) {
            this.rowOperation(newMatrix, rowToOperateOn, newOperation, '*');
            this.rowOperation(elementaryMatrix, rowToOperateOn, newOperation, '*');
            this.rowOperation(identityMatrix, rowToOperateOn, newOperation, '*');
        } else if(newOperation.includes('>')){
            // This means switching rows
            this.rowOperation(newMatrix, rowToOperateOn, newOperation, '>');
            this.rowOperation(elementaryMatrix, rowToOperateOn, newOperation, '>');
            this.rowOperation(identityMatrix, rowToOperateOn, newOperation, '>');
        }

        // Push the new matrix to the matrix holder (containing all forms of the matrix and its operations)
        this.rowOperatedMatrix.push({ matrix: newMatrix, operation: operation })
        this.identityOperationMatrix.push({ matrix: identityMatrix, operation: operation });

        // Print the current operated matrix to the screen
        this.printMatrix(this.gaussCalculatorContainer, newMatrix, this.operationCount - 1, operation);

        // Print the elementary matrix as well with its row operation
        let elementaryText = 'E'+this.operationCount;
        this.printMatrix(this.gaussCalculatorContainer, elementaryMatrix, this.operationCount - 1, operation, 'elementary-matrix-container', elementaryText);

        // Print identity matrix operated on to screen, used to get inverse of matrix
        let identityText = 'I -> ' + operation;
        this.printMatrix(this.gaussCalculatorContainer, identityMatrix, this.operationCount - 1, operation, 'identity-matrix-container', identityText);

        // Increment to keep track the amount of operations performed
        this.operationCount += 1;
    }

    getElementaryMatrix(rowSize, columnSize){
        // Get the elemetary matrix, called in extractRowOperation
        let matrix = new Array(rowSize);

        for (let i = 0; i < columnSize; i++) {
            matrix[i] = new Array(columnSize).fill(0);
            matrix[i][i] = 1;
        }
        return matrix;
    }
    /****************** ROW OPERATIONS *******************/
    addOrSubtractMultipleOfRow(newMatrix, rowToOperateOn, newOperation, operation){
        // Subtract/ add(depending on operation) a multiple of a row to another. Split at the operation sign, then pass in 
        let operationArray = newOperation.split(operation);
        // Find the row # which is multiplied then will be added or subtracted to another
        let multipliedRow = operationArray[1].match(/\d/)[0];
        // Multiply the row and save it to a variable
        let rowMultiplied = this.rowOperation(newMatrix, multipliedRow - 1, newOperation,'*',true);

        // Perform operation on all the values from rowMultiplied to their destination row
        if (operation === '+') {
            console.log(newMatrix[rowToOperateOn].map((val, index) => parseInt(val) + rowMultiplied[index]))
            newMatrix[rowToOperateOn] = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) + rowMultiplied[index])
        } else if (operation === '-') {
            newMatrix[rowToOperateOn] = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) - rowMultiplied[index])
        }
    }

    rowOperation(newMatrix, rowToOperateOn, newOperation, operation,returnVal){
        // Perform 'operation' on the row 
        let newRow; // Holds the value for the new row
        if (operation === '+' || operation == '-' || operation=='>') { // If adding or subtraction
            // Extract the row value, one less than whats written
            let rowToOperate = (newOperation.split(operation)[1].match(/\d/)[0]) - 1;
            if (operation === '+') {
                newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) + parseInt(newMatrix[rowToOperate][index]));
            } else if (operation === '-') {
                newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) - parseInt(newMatrix[rowToOperate][index]));
            } else if(operation === '>'){
                // Switch the rows
                let rowToSwitch1 = [...newMatrix[rowToOperateOn]];
                let rowToSwitch2 = [...newMatrix[rowToOperate]];
                newMatrix[rowToOperateOn] = rowToSwitch2;
                newMatrix[rowToOperate] = rowToSwitch1;
            }
        } else { // If multiplication or division
            // Extract the row value, one less than whats written
            let operationInteger = parseInt(newOperation.split(operation)[1]);
            // Divide the values in selected row all the values to the current matrix
            if (operation === '*') {
                newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) * operationInteger);
            } else if (operation === '/') {
                newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) / operationInteger);
            }
        }
        if(operation!=='>'){
            // Add the operation row to the new matrix
            if (returnVal) return newRow; // addOrSubtractMultipleOfRow uses this when multiplying row
            else newMatrix[rowToOperateOn] = newRow;
        }

    }
}