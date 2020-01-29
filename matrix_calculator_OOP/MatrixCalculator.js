class MatrixCalculator extends CalculatorSetup{
    constructor(matrixHolder,matrixContainer,matrixCount){
        // Variables passed in from the calculator setup
        super(matrixHolder, matrixContainer, matrixCount);
        this.matrixContainer = matrixContainer;
        this.matrixHolder = matrixHolder;
        this.matrixCount = matrixCount;
        // Get the container for the calculation input
        this.calculatorContainer = document.getElementById('matrix-calculator');
        // Hold current formula
        this.formula;
    }
    printMatrix(container, mtx, mtxCount, text, className, matrixText){
        super.printMatrix(container, mtx, mtxCount, text, className, matrixText);
    }
    matrixCalculator(){
        // Create input for user to put formula
        let formulaInput = this.newElement('input', this.calculatorContainer, { id: 'formula', type: 'text' })
        let formulaSubmit = this.newElement('input', this.calculatorContainer, { id: 'formula-submit', type: 'submit', value: 'Submit' })

        formulaSubmit.addEventListener('click', () => {
            this.formula = formulaInput.value;
            this.extractCalculation();
        });
    }

    extractCalculation(){
        let matrixOne = this.matrixHolder[this.ALPHABET.indexOf(this.formula.charAt(0).toLowerCase())];
        let matrixTwo;
        if (this.formula.charAt(2)) {
            matrixTwo = this.matrixHolder[this.ALPHABET.indexOf(this.formula.charAt(2).toLowerCase())];
        }
        let operator = this.formula.charAt(1);

        if (operator === '+') {
            this.addMatrices(matrixOne, matrixTwo, '(' + this.formula.charAt(0) + '+' + this.formula.charAt(2) + ")",operator);
        } else if (operator === '-') {
            this.subtractMatrices(matrixOne, matrixTwo, '(' + this.formula.charAt(0) + '-' + this.formula.charAt(2) + ")",operator);
        } else if (operator === '*') {
            this.multiplyMatrices(matrixOne, matrixTwo, '(' + this.formula.charAt(0) + '' + this.formula.charAt(2) + ")");
        } else if (operator === 't') {
            this.transpose(matrixOne, "(" + this.formula.charAt(0) + this.ALPHABET.charAt(19).toUpperCase().sup() + ")");
        } else if (operator === 'e') {
            this.trace(matrixOne, "(" + this.formula.charAt(0) + ")");
        } else if (operator === 'R') {
            // This will mean you will be doing gaussian calculations
            // AR will start the gaussian calculator on matrix A
            let rowCalculator = new RowOperationCalculator(this.matrixCount, this.matrixHolder, this.matrixContainer, matrixOne);
            rowCalculator.gaussianCalculator();
            this.matrixCount++;
        }
    }
    matrixOperation(mtx1, mtx2, text, operation){
        // Add, subtract. Depends on which operation passed in
        let newMtx = [];
        // Matrices must be the same size to add together
        for (let row = 0; row < mtx1.length; row++) {
            let rowArray = [];
            for (let col = 0; col < mtx1[0].length; col++) {
                // Add/subtract each value together at the individual column
                if(operation ==='+') rowArray.push(parseInt(mtx1[row][col]) + parseInt(mtx2[row][col]));
                else if (operation === '-') rowArray.push(parseInt(mtx1[row][col]) - parseInt(mtx2[row][col]));
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
        this.saveMatrix(newMtx, text);
    }

    saveMatrix(newMtx,text){
        // Add the matrix to be used later, called in the matrix Operations
        this.matrixCount = parseInt(this.matrixCount) + 1;
        this.matrixHolder[this.matrixCount - 1] = newMtx;
        this.printMatrix(this.matrixContainer, newMtx, this.matrixCount - 1, text);
    }

    addMatrices(mtx1, mtx2, text,operation){
        if (mtx1.length === mtx2.length && mtx1[0].length === mtx2[0].length) {
            // Only perform operation if matrices are the same size
            this.matrixOperation(mtx1, mtx2, text, operation);
        }
    }

    subtractMatrices = (mtx1, mtx2, text,operation) => {
        if (mtx1.length === mtx2.length && mtx1[0].length === mtx2[0].length) {
            this.matrixOperation(mtx1, mtx2, text, operation);
        }
    }

    multiplyMatrices(mtx1, mtx2, text){
        let newMtx = [];
        if (mtx1[0].length === mtx2.length) {
            // Columns of the first matrix must match the amount of rows in the second

            for (let row = 0; row < mtx1.length; row++) {
                let rowArray = [];
                for (let col = 0; col < mtx2[0].length; col++) {
                    let total = 0;
                    for (let mtx2row = 0; mtx2row < mtx2.length; mtx2row++) {
                        // Multiply values in the row of the first matrix by those in the column of second and add them together
                        total += (parseInt(mtx1[row][mtx2row]) * parseInt(mtx2[mtx2row][col]));
                    }
                    // Add each value together at the individual column
                    rowArray.push(total);
                }
                // Add the new row to the array
                newMtx.push(rowArray);
            }
            
        }
        this.saveMatrix(newMtx, text);
    }

    transpose(mtx, text){
        // Type in the matrix number then 't' after (0t)
        let newMtx = [];

        // Matrices must be the same size to add together
        for (let row = 0; row < mtx.length; row++) {
            for (let col = 0; col < mtx[0].length; col++) {
                // Create a new row to transpose the column val to the row
                if (row === 0) newMtx.push([]);
                // Push the value from the column to the row of same place
                newMtx[col].push(parseInt(mtx[row][col]));
            }
        }
        this.saveMatrix(newMtx,text);
    }

    trace(mtx,text){
        let total = 0;
        if (mtx.length === mtx[0].length) {
            // Must be an nxn matrix
            for (let i = 0; i < mtx.length; i++) {
                // Add the eigenvalue to the totals
                total += parseInt(mtx[i][i]);
            }
        }
        alert('Trace is '+total+' for Matrix '+text);
    }
}
