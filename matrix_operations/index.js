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

/******************************** METHODS *************************************/
let newElement=(elementType, appendagee, attributes, text)=>{
    // Appendagee is the parent element it will be attached to
    let element = document.createElement(elementType);
    // Add the attributes, {attributes} will be an object where the attributes can be placed and will be looped through
    Object.keys(attributes).forEach(key => { element.setAttribute(key, attributes[key]); });
    if (text) element.textContent = text; // If there is text then add it to the element
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
        addMatrices(matrixOne, matrixTwo, 'MATRIX(' + formula.charAt(0) + '+' + formula.charAt(2) + ")");
    }else if(operator === '-'){
        subtractMatrices(matrixOne, matrixTwo, 'MATRIX('+formula.charAt(0) + '-' + formula.charAt(2)+")");
    }else if(operator==='*'){
        multiplyMatrices(matrixOne, matrixTwo, 'MATRIX(' + formula.charAt(0) + '' + formula.charAt(2) + ")") ;
    }else if(operator==='t'){
        transpose(matrixOne, "tr(" + formula.charAt(0)+")");
    }
}

let printMatrix = (mtx, mtxCount, text) => {
    // Loop through matrixes and print them to the screen 
    let matrixBox = newElement('div', matrixContainer, { class: 'matrix-calculator-box' })
    newElement('h3', matrixBox, {}, text+" "+ALPHABET.charAt(mtxCount).toUpperCase())

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
        printMatrix(newMtx,matrixCount-1,text);
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
        printMatrix(newMtx, matrixCount - 1, text);
        
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
        printMatrix(newMtx, matrixCount - 1, text);
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
    printMatrix(newMtx, matrixCount - 1, text);
}

let trace=(mtx)=>{

}







