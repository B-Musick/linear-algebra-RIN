/******************* INITIAL MATRIX COUNT AND SIZE **************************/

// Take the matrix-count input, and use it to show that amount of inputs for matrices

let matrixCountButton = document.getElementById('matrix-count-button');
let matrixAmountInput = document.getElementById('matrix-amount-input-container');
let matrixSizeInputContainer = document.getElementById('matrix-size-input-container');
// Create container to put the matrix value inputs
let matrixValInputContainer = document.getElementById('matrix-value-input-container');
let matrixContainer = document.getElementById('show-matrices-container'); // Called in printMatrices()
let matrixCount; // Holds the count for amount of matrices which will be used
let matrixHolder = {}; // This will hold the actual matrix 2D arrays with values

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // Used to give the matrices letter labels

let gaussianCalc = false; // This will determine whether to show the gaussian calculator or not

/******************************** METHODS *************************************/
let newElement=(elementType, appendagee, attributes, text)=>{
    // Appendagee is the parent element it will be attached to
    let element = document.createElement(elementType);
    // Add the attributes, {attributes} will be an object where the attributes can be placed and will be looped through
    Object.keys(attributes).forEach(key => { element.setAttribute(key, attributes[key]); });
    if (text) element.innerHTML = text; // If there is text then add it to the element
    if (appendagee) appendagee.appendChild(element);// Add the element to the parent
    return element;
}

/***************************** EVENT LISTENERS ********************************/

matrixCountButton.addEventListener('click',()=>{
    matrixAmountInput.style.display = 'none'; // Remove the amount inputs
    matrixSizeInputContainer.classList.remove('inputs-container-hidden'); // Make it visible
    // When user submits matrix count, print out that number of inputs for the matrix sizes
    matrixCount = document.getElementById('matrix-count').value;

    // Add paragraph so user knows what to input (size of matrices)
    newElement('p', matrixSizeInputContainer, {},'How big will the matrices be?');

    // Create the inputs for the sizes of matrices
    for(let i = 0;i<matrixCount;i++){
        // Add the matrix number header
        newElement('h2', matrixSizeInputContainer, {}, 'MATRIX ' + ALPHABET.charAt(i).toUpperCase());
        
        let matrixSizeBox = newElement('div',matrixSizeInputContainer,{id:'matrix-size-containers'})
        // Title to denote the row input
        newElement('span', matrixSizeBox, {}, "Rows: ");
        newElement('input', matrixSizeBox,{ id: 'matrix-' + i + '-row-size', class: 'matrix-row' }, '');
        newElement('br', matrixSizeBox, {});
        
        // Title to denote the column input
        newElement('span', matrixSizeBox, {}, "Columns: ")
        newElement('input', matrixSizeBox, { id: 'matrix-' + i + '-col-size', class: 'matrix-col' },'');
        newElement('br', matrixSizeBox, {});
    }

    // Create the submit button for the matrix dimensions
    newElement('input', matrixSizeInputContainer, {type: 'submit', id: 'matrix-dimension-submit'})
    createMatrices();
});

let createMatrices =()=>{
    /********************** CREATE INPUTS FOR MATRIX VALUES *********************
     * Called in the event listener for the matrixCount, otherwise gives error 
     * because matrix-dimension-submit not created yet.
    */
    let matrixDimensionSubmit = document.getElementById('matrix-dimension-submit');
    
    matrixDimensionSubmit.addEventListener('click', () => {
        // When user submits the dimensions, create the inputs for the matrix arrays
        for(let i = 0;i<matrixCount; i++){
            // Get the row and column counts for the individual matrix
            let rowCount = document.getElementById('matrix-'+i+'-row-size').value;
            let colCount = document.getElementById('matrix-'+i+'-col-size').value;
            
            // Create array with rowCount x colCount, add it to matrixHolder with associated matrix number
            // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript
            // matrixHolder[i] = new Array(rowCount).map(e => new Array(colCount));

            // Create container for individual matrix
            newElement('h2', matrixValInputContainer, {}, 'MATRIX ' + ALPHABET.charAt(i).toUpperCase() + ' VALUES');

            let matrixDiv = newElement('div', matrixValInputContainer, { id: 'matrix-' + i, class: 'matrix matrix-container'});
            
            // Create the matrix of inputs
            for(let row =0; row<rowCount; row++){
                // Row for the matrix
                let rowDiv = newElement('div','',{class:'row'})
                
                for (let col = 0; col < colCount; col++) {
                    // Input label
                    newElement('input', rowDiv, { class: 'row-' + row + " col-" + col,
                                                  id: 'matrix-' + i + '-row-' + row + "-col-" + col})
                    matrixDiv.appendChild(rowDiv);
                }
            }
        }
        newElement('input', matrixValInputContainer, { type: 'submit', id: 'matrix-submit-button'});

        matrixValInputContainer.classList.remove('inputs-container-hidden'); // Make container shown
        addValuesToArray();
        
        matrixSizeInputContainer.style.display = 'none'; // Remove the size inputs

    });
};

/****************** ADD VALUE USER INPUTS TO ARRAY  **********************/

let addValuesToArray=(rowCount,colCount)=>{
    // Add the user inputs to the array matrixHolder
    let submitButton = document.getElementById('matrix-submit-button');

    submitButton.addEventListener('click',()=>{
        for (let i = 0; i < matrixCount; i++) {
            // Go through each input, get its value and add it to the array

            // Get the row and column counts for the individual matrix
            let rowCount = document.getElementById('matrix-' + i + '-row-size').value;
            let colCount = document.getElementById('matrix-' + i + '-col-size').value;

            // Create array to hold the current matrix 'i'
            matrixHolder[i] = new Array(rowCount);

            // Add the values to the array
            for (let row = 0; row < rowCount; row++) {
                // Add new Array with size of columns in current row
                matrixHolder[i][row] = new Array(colCount);
                for (let col = 0; col < colCount; col++) {
                    let value = document.getElementById('matrix-' + i + '-row-' + row + "-col-" + col).value;
                    matrixHolder[i][row][col] = value; // Add value to the array
                }
            }
        }
        console.log(matrixHolder);
        printMatrices();
    });
}

/************************ PRINT MATRICES TO SCREEN  **************************/
// Used the following to make the matrix
// https://stackoverflow.com/questions/11561137/html-css-for-brackets-around-mathematical-matrix-prefer-lightweight
let printMatrices=()=>{
    // Called in addValuesToArray()
    matrixValInputContainer.style.display = 'none'; // Remove matrix value inputs
    
    // Loop through matrixes and print them to the screen
    for (let mtx = 0; mtx < matrixCount; mtx++) {
        let matrixBox = newElement('div',matrixContainer,{class:'matrix-calculator-box'})
        newElement('h3', matrixBox, {}, 'MATRIX ' + ALPHABET.charAt(mtx).toUpperCase()); 
       

        let newMatrixTable = newElement('table','',{class:'matrix'})
        
        for (let row = 0; row < matrixHolder[mtx].length; row++) {
            // Loop through rows of matrix
            let rowContainer = newElement('tr', '', { id: 'print-matrix-' + mtx + '-row-' + row, class: 'matrix-print-row'})

            for (let col = 0; col < matrixHolder[mtx][row].length; col++) {
                // Loop through each column value in the matrix row
                newElement('td', rowContainer, {}, matrixHolder[mtx][row][col])
            }
            // Append tr to table
            newMatrixTable.appendChild(rowContainer);
        }
        matrixBox.appendChild(newMatrixTable);
    }
    matrixCalculator();
    document.getElementById('matrix-calculator-operations').classList.remove('inputs-container-hidden');

}


let matrixCalculator=()=>{
    // Get the container for the calculation input
    let calculatorContainer = document.getElementById('matrix-calculator');

    // Create input for user to put formula
    let formulaInput = newElement('input',calculatorContainer,{id:'formula',type:'text'})
    let formulaSubmit = newElement('input',calculatorContainer,{id:'formula-submit',type:'submit',value:'Submit'})

    formulaSubmit.addEventListener('click',()=>{
        let formula = formulaInput.value;
        console.log(formula);
        extractCalculation(formula);
    });
}

let extractCalculation=(formula)=>{
    let matrixOne = matrixHolder[ALPHABET.indexOf(formula.charAt(0).toLowerCase())];
    let matrixTwo;
    if(formula.charAt(2)){
        matrixTwo = matrixHolder[ALPHABET.indexOf(formula.charAt(2).toLowerCase())];
    }
    let operator  = formula.charAt(1);

    if(operator==='+'){
        addMatrices(matrixOne, matrixTwo, '(' + formula.charAt(0) + '+' + formula.charAt(2) + ")");
    }else if(operator === '-'){
        subtractMatrices(matrixOne, matrixTwo, '('+formula.charAt(0) + '-' + formula.charAt(2)+")");
    }else if(operator==='*'){
        multiplyMatrices(matrixOne, matrixTwo, '(' + formula.charAt(0) + '' + formula.charAt(2) + ")") ;
    }else if(operator==='t'){
        transpose(matrixOne, "(" + formula.charAt(0)+ALPHABET.charAt(19).toUpperCase().sup()+")");
    } else if (operator === 't') {
        transpose(matrixOne, "(" + formula.charAt(0) + ")");
    }else if(operator === 'R'){
        // This will mean you will be doing gaussian calculations
        // AR will start the gaussian calculator on matrix A
        gaussianCalculator(matrixOne);
    }
}

let printMatrix = (container, mtx, mtxCount, text,className,matrixText) => {
    // Loop through matrixes and print them to the screen 
    let matrixBox = newElement('div', container, { class: className?className:'matrix-calculator-box' })
    newElement('h3', matrixBox, {}, (matrixText ? matrixText:"MATRIX "+ALPHABET.charAt(mtxCount).toUpperCase()+" "+text))

    let newMatrixTable = newElement('table', '', { class: 'matrix' })

    for (let row = 0; row < mtx.length; row++) {
        // Loop through rows of matrix
        let rowContainer = newElement('tr', '', { id: 'print-matrix-' + mtx + '-row-' + row, class: 'matrix-print-row' })

        for (let col = 0; col < mtx[0].length; col++) {
            // Loop through each column value in the matrix row
            newElement('td', rowContainer, {}, mtx[row][col]+"")
        }
        // Append tr to table
        newMatrixTable.appendChild(rowContainer);
    }
    matrixBox.appendChild(newMatrixTable);
}
    


let addMatrices=(mtx1,mtx2, text)=>{
    let newMtx = [];
    if(mtx1.length===mtx2.length && mtx1[0].length===mtx2[0].length){
        // Matrices must be the same size to add together
        for(let row = 0; row<mtx1.length;row++){
            let rowArray = [];
            for (let col = 0; col < mtx1[0].length; col++) {
                // Add each value together at the individual column
                rowArray.push(parseInt(mtx1[row][col])+parseInt(mtx2[row][col]));
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
        console.log(newMtx);
        // Add the matrix to be used later
        matrixCount = parseInt(matrixCount)+1;
        matrixHolder[matrixCount-1] = newMtx;
        printMatrix(matrixContainer,newMtx,matrixCount-1,text);
    }
    console.log(matrixHolder)
}

let subtractMatrices = (mtx1, mtx2, text) => {
    let newMtx = [];

    if (mtx1.length === mtx2.length && mtx1[0].length === mtx2[0].length) {
       // Matrices must be the same size to add together
        for (let row = 0; row < mtx1.length; row++) {
            // Same amount of rows as in the first matrix
            let rowArray = [];
            for (let col = 0; col < mtx1[0].length; col++) {
                // Add each value together at the individual column
                rowArray.push(parseInt(mtx1[row][col]) - parseInt(mtx2[row][col]));
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
        console.log(newMtx);
        // Add the matrix to be used later
        matrixCount = parseInt(matrixCount) + 1;
        matrixHolder[matrixCount - 1] = newMtx;
        printMatrix(matrixContainer,newMtx, matrixCount - 1, text);
        
    }
}

let multiplyMatrices = (mtx1, mtx2, text) => {
    let newMtx = [];
    if (mtx1[0].length === mtx2.length) {
         // Columns of the first matrix must match the amount of rows in the second
        
        for (let row = 0; row < mtx1.length; row++) {
            let rowArray = [];
            for (let col = 0; col < mtx1[0].length; col++) {
                let total=0;
                for(let mtx2row=0;mtx2row<mtx2.length;mtx2row++){
                    // Multiply values in the row of the first matrix by those in the column of second and add them together
                    total += (parseInt(mtx1[row][mtx2row])*parseInt(mtx2[mtx2row][col]));
                    console.log(total);
                }
                // Add each value together at the individual column
                rowArray.push(total);
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
        console.log(newMtx);
        // Add the matrix to be used later
        matrixCount = parseInt(matrixCount) + 1;
        matrixHolder[matrixCount - 1] = newMtx;
        printMatrix(matrixContainer,newMtx, matrixCount - 1, text);
    }
}

let transpose=(mtx,text)=>{
    // Type in the matrix number then 't' after (0t)
    let newMtx = [];

    // Matrices must be the same size to add together
    for (let row = 0; row < mtx.length; row++) {       
        for (let col = 0; col < mtx[0].length; col++) {
            if(row ===0){
                // create a new row to transpose the column val to the row
                newMtx.push([])
            }
            // Push the value from the column to the row of same place
            console.log
            newMtx[col].push(parseInt(mtx[row][col]));
        }
    }
    console.log(newMtx)
    // Add the matrix to be used later
    matrixCount = parseInt(matrixCount) + 1;
    matrixHolder[matrixCount - 1] = newMtx;
    printMatrix(matrixContainer,newMtx, matrixCount - 1, text);
}

let trace=(mtx)=>{
    let total = 0;
    if(mtx.length === mtx[0].length){
        // Must be an nxn matrix
        for(let i=0;i<mtx.length;i++){
            // Add the eigenvalue to the totals
            total+=mtx[i][i];
        }
    }
    return total;
}

/****************************** GAUSSIAN CALCULATOR ****************************/
let rowOperatedMatrix = []; // Array to save the matrices which have had row operations performed, as well as the operation
let operationCount = 1;

// Identity matrix operations
let identityOperationMatrix = [];


let gaussianCalculator=(mtx)=>{
    // Called in extractCalculation() when 'matrixletterR' is typed into the input
    rowOperatedMatrix.push({matrix:mtx, operation:''}); // Push the original matrix
    createGaussianCalculator(mtx);
}

let createGaussianCalculator=(mtx)=>{
    /* Add the calculator to the DOM, remove the matrix calculator till finished */
    
    // Get the container for the calculation input
    let gaussCalculatorContainer = document.getElementById('gaussian-calculator');
    gaussCalculatorContainer.classList.remove('inputs-container-hidden');

    // Remove the matrixCalculator from the DOM
    let matrixCalculatorContainer = document.getElementById('matrix-calculator');
    matrixCalculatorContainer.classList.add('inputs-container-hidden');

    // Add Header
    newElement('h1',gaussCalculatorContainer, {id:'gaussian-calculator-header'},'ENTER ROW OPERATIONS');

    let rowOpContainer = newElement('div',gaussCalculatorContainer,{id:'row-operation-container'});
    // Create input for user to put formula
    let operationInput = newElement('input', rowOpContainer, { id: 'row-operation', type: 'text' })
    let operationSubmit = newElement('input', rowOpContainer, { id: 'row-operation-submit', type: 'submit', value: 'SUBMIT' });

    // Create button for user to click when done and wants to submit the matrix
    let showElementaryMatricesButton = newElement('input', gaussCalculatorContainer, { id: 'elementary-matrix-show-button', type: 'submit', value: 'SHOW ELEMENTARY MATRICES' });
    // newElement('br', gaussCalculatorContainer, {});

    let showIdentityMatricesButton = newElement('input', gaussCalculatorContainer, { id: 'identity-matrix-show-button', type: 'submit', value: 'SHOW IDENTITY MATRICES' });

    // Create button for user to click when done and wants to submit the matrix
    let doneButton = newElement('input', gaussCalculatorContainer, { id: 'gaussian-matrix-submit', type: 'submit', value: 'DONE' })
    
    identityOperationMatrix.push({ matrix:getElementaryMatrix(mtx.length,mtx[0].length), operation: '' });

    showElementaryMatricesButton.addEventListener('click',()=>{
        let container = document.querySelectorAll('.elementary-matrix-container');
        container.forEach(ele => ele.classList.toggle('matrix-container-hidden'));
    })
    showIdentityMatricesButton.addEventListener('click', () => {
        let container = document.querySelectorAll('.identity-matrix-container');
        container.forEach(ele => ele.classList.toggle('matrix-container-hidden'));
    })
    operationSubmit.addEventListener('click', () => {
        // When user clicks the submit button to perform row operation on the matrix
        let operation = operationInput.value;
        console.log(operation);
        extractRowOperation(operation);
    });

    doneButton.addEventListener('click',()=>{
        // When user done performing row operations, submit the matrix to the holder
        // remove the gauss-calculator and show the matrix-calculator again
        // Also, show which operations were performed to get this matrix when print it to screen

        // Get the container for the calculation input
        let gaussCalculatorContainer = document.getElementById('gaussian-calculator');
        gaussCalculatorContainer.innerHTML ='';

        // Add the matrixCalculator from the DOM
        let matrixCalculatorContainer = document.getElementById('matrix-calculator');
        matrixCalculatorContainer.classList.remove('inputs-container-hidden');

        /******* Print the matrix */

        // Create text form matrix
        let text = '';
        rowOperatedMatrix.forEach((obj,index) => { if(index>0) text+=('<br>'+(index)+'. '+obj.operation)  });
       
   
        matrixCount = parseInt(matrixCount) + 1; // Increment the matrix count

        // Add to matrix holder
        matrixHolder[matrixCount - 1] = rowOperatedMatrix[operationCount - 1]['matrix'];

        // Print
        printMatrix(matrixContainer, rowOperatedMatrix[operationCount-1]['matrix'], matrixCount-1, 
            text) // Print the final matrix, which matrix its defined from and what operations performed
        // Clear the operations
        rowOperatedMatrix = []; // Array to save the matrices which have had row operations performed, as well as the operation
        operationCount = 1;

    })
}

let extractRowOperation=(operation)=>{
    // Operation should be in the form 'R1=R1+R2'
    let operationArray = operation.split('='); // Split array into R1, R1+R2
    let rowToOperateOn = operationArray[0].match(/\d/)-1; // The row will be one less than written
    let newOperation = operationArray[1];
    // Take the current matrix form and perform the next operation
    let currentMatrix = rowOperatedMatrix[operationCount-1]['matrix'];
    
    let newMatrix = [...currentMatrix]; // Create variable for new matrix
    
    // Get elementary matrix matching the size of this one
    let rowSize = newMatrix.length;
    let columnSize = newMatrix[0].length;
    let elementaryMatrix = getElementaryMatrix(rowSize,columnSize);

    // Current identity matrix
    let identityMatrix = [...identityOperationMatrix[operationCount-1]['matrix']];

    if (newOperation.includes('*') && newOperation.includes('+')) {
        addOrSubtractMultipleOfRow(newMatrix, rowToOperateOn, newOperation,'+');
        addOrSubtractMultipleOfRow(elementaryMatrix, rowToOperateOn, newOperation, '+');
    } else if (newOperation.includes('*') && newOperation.includes('-')) {
        addOrSubtractMultipleOfRow(newMatrix, rowToOperateOn, newOperation, '-');
        addOrSubtractMultipleOfRow(elementaryMatrix, rowToOperateOn, newOperation, '-');
    } else if(newOperation.includes('+')){
        rowOperation(newMatrix, rowToOperateOn, newOperation, '+');
        rowOperation(elementaryMatrix,rowToOperateOn,newOperation,'+');
        rowOperation(identityMatrix,rowToOperateOn,newOperation,'+');
    } else if (newOperation.includes('-')) {
        rowOperation(newMatrix, rowToOperateOn, newOperation,'-');
        rowOperation(elementaryMatrix,rowToOperateOn,newOperation,'-');
    } else if (newOperation.includes('/')) {
        rowOperation(newMatrix, rowToOperateOn, newOperation,'/');
        rowOperation(elementaryMatrix,rowToOperateOn,newOperation,'/');
    } else if (newOperation.includes('*')) { 
        rowOperation(newMatrix, rowToOperateOn, newOperation,'*');
        rowOperation(elementaryMatrix,rowToOperateOn,newOperation,'*');
    } 
    let gaussCalculatorContainer = document.getElementById('gaussian-calculator');
    // Push the new matrix to the matrix holder (containing all forms of the matrix and its operations)
    rowOperatedMatrix.push({matrix:newMatrix,operation:operation})
    identityOperationMatrix.push({matrix:identityMatrix,operation:operation});

    // Print the current operated matrix to the screen
    printMatrix(gaussCalculatorContainer, newMatrix, operationCount - 1, operation);

    // Print the elementary matrix as well with its row operation
    let elementaryText = 'E<sub>' + (operationCount - 1) + '</sub>';
    printMatrix(gaussCalculatorContainer, elementaryMatrix, operationCount - 1, operation, 'elementary-matrix-container',elementaryText);

    // Print identity matrix operated on to screen, used to get inverse of matrix
    let identityText = 'I -> ' + operation;
    printMatrix(gaussCalculatorContainer, identityMatrix, operationCount - 1, operation, 'identity-matrix-container',identityText);

    // Increment to keep track the amount of operations performed
    operationCount+=1;
}

let getElementaryMatrix=(rowSize, columnSize)=>{
    // Get the elemetary matrix, called in extractRowOperation
    let matrix = new Array(rowSize);

    for(let i=0;i<columnSize;i++){
        matrix[i] = new Array(columnSize).fill(0);
        matrix[i][i] = 1;
    }
    
    return matrix;
}

/****************** ROW OPERATIONS *******************/
let addOrSubtractMultipleOfRow = (newMatrix, rowToOperateOn, newOperation,operation)=>{
    // Subtract/ add(depending on operation) a multiple of a row to another. Split at the operation sign, then pass in 
    let operationArray = newOperation.split(operation);
    // Find the row # which is multiplied then will be added or subtracted to another
    let multipliedRow = operationArray[1].match(/\d/)[0];
    // Multiply the row and save it to a variable
    let rowMultiplied = rowMultiplication(newMatrix, multipliedRow - 1, newOperation);
    
    // Perform operation on all the values from rowMultiplied to their destination row
    if(operation === '+'){
        newMatrix[rowToOperateOn] = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) + rowMultiplied[index])
    }else if(operation === '-'){
        newMatrix[rowToOperateOn] = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) - rowMultiplied[index])
    }
}

let rowOperation = (newMatrix, rowToOperateOn, newOperation, operation)=>{
    // Perform 'operation' on the row 
    let newRow; // Holds the value for the new row
    if(operation==='+'||operation=='-'){ // If adding or subtraction
        // Extract the row value, one less than whats written
        let rowToOperate = (newOperation.split(operation)[1].match(/\d/)[0]) - 1;
        if(operation === '+'){
            newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) + parseInt(newMatrix[rowToOperate][index]));
        } else if (operation === '-'){
            newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) - parseInt(newMatrix[rowToOperate][index]));
        }
    }else{ // If multiplication or division
        // Extract the row value, one less than whats written
        let operationInteger = parseInt(newOperation.split(operation)[1]);
        console.log(operationInteger);
        // Divide the values in selected row all the values to the current matrix
        if(operation === '*'){
            newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) * operationInteger);
        }else if(operation==='/'){
            newRow = newMatrix[rowToOperateOn].map((val, index) => parseInt(val) / operationInteger);
        }
    }
    // Add the operation row to the new matrix
    newMatrix[rowToOperateOn] = newRow;
}



// How to fill matrix with values
// https://flaviocopes.com/how-to-initialize-array-with-values/ 

            // Create array with rowCount x colCount, add it to matrixHolder with associated matrix number
            // https://stackoverflow.com/questions/16512182/how-to-create-empty-2d-array-in-javascript