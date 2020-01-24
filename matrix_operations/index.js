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

/******************************** METHODS *************************************/
let newElement=(elementType, appendagee, attributes, text)=>{
    // Appendagee is the parent element it will be attached to
    // {attributes} will be an object where the attributes can be placed and will be looped through
    let element = document.createElement(elementType);

    Object.keys(attributes).forEach(key => {
        // Add the attributes
        element.setAttribute(key, attributes[key]);
    });

    if(text){
        // If there is text then add it to the element
        element.textContent = text;
    }
    // Add the element to the parent
    appendagee.appendChild(element);
}

/***************************** EVENT LISTENERS ********************************/

matrixCountButton.addEventListener('click',()=>{
    matrixAmountInput.style.display = 'none'; // Remove the amount inputs
    // When user submits matrix count, print out that number of inputs for the matrix sizes
    matrixCount = document.getElementById('matrix-count').value;

    // Add paragraph so user knows what to input (size of matrices)
    newElement('p', matrixSizeInputContainer, {},'How big will the matrices be?');

    // Create the inputs for the sizes of matrices
    for(let i = 0;i<matrixCount;i++){
        // Add the matrix number header
        newElement('h4', matrixSizeInputContainer, {}, 'Matrix ' + i);
      
        // Title to denote the row input
        newElement('span', matrixSizeInputContainer, {}, "Rows: ")
        newElement('input', matrixSizeInputContainer,{ id: 'matrix-' + i + '-row-size', class: 'matrix-row' }, '');

        // Title to denote the column input
        newElement('span', matrixSizeInputContainer, {}, "Columns: ")
        newElement('input', matrixSizeInputContainer, { id: 'matrix-' + i + '-col-size', class: 'matrix-col' },'');
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
            let matrixDiv = document.createElement('div'); // Create div for matrix
            matrixDiv.setAttribute('id','matrix-'+i); // Give matrix its number
            matrixDiv.setAttribute('class','matrix-container');
            matrixValInputContainer.appendChild(matrixDiv); // Add new matrix to container

            
            // Create the matrix of inputs
            for(let row =0; row<rowCount; row++){
                let rowDiv = document.createElement('div');
                rowDiv.setAttribute('class','row'); 
                for (let col = 0; col < colCount; col++) {
                    let inputElement = document.createElement('input');
                    inputElement.setAttribute('class','row-'+row+" col-"+col);
                    inputElement.setAttribute('id', 'matrix-'+i+'-row-'+row+"-col-"+col);

                    let titleSpan = document.createElement('span');
                    titleSpan.textContent = 'Row ' + row + ", Column " + col+": "
                    rowDiv.appendChild(titleSpan)
                    rowDiv.appendChild(inputElement);
                    matrixDiv.appendChild(rowDiv);
                }
            }
        }
        let matrixSubmitButton = document.createElement('input');
        matrixSubmitButton.setAttribute('type','submit');
        matrixSubmitButton.setAttribute('id','matrix-submit-button');
        matrixValInputContainer.appendChild(matrixSubmitButton);

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
        // Loop through each matrix
        let matrixHeader = document.createElement('h3');
        matrixHeader.textContent = 'Matrix ' + mtx;
        matrixContainer.appendChild(matrixHeader);

        let newMatrixTable = document.createElement('table');
        newMatrixTable.setAttribute('class','matrix');
       
        for (let row = 0; row < matrixHolder[mtx].length; row++) {
            // Loop through rows of matrix
            let rowContainer = document.createElement('tr');
            rowContainer.setAttribute('id','print-matrix-'+mtx+'-row-'+row);
            rowContainer.setAttribute('class','matrix-print-row');
            
            for (let col = 0; col < matrixHolder[mtx][row].length; col++) {
                // Loop through each column value in the matrix row
                let newColumnVal = document.createElement('td');
                newColumnVal.textContent = matrixHolder[mtx][row][col]; // Give value to td
                rowContainer.appendChild(newColumnVal); // Add td to tr
                console.log(matrixHolder[mtx][row][col]);

            }
            // Append tr to table
            newMatrixTable.appendChild(rowContainer);
        }

        matrixContainer.appendChild(newMatrixTable);

    }
    matrixCalculator();
}


let matrixCalculator=()=>{
    // Get the container for the calculation input
    let calculatorContainer = document.getElementById('matrix-calculator');

    // Create input for user to put formula
    let formulaInput = document.createElement('input');
    formulaInput.setAttribute('id','formula');
    formulaInput.setAttribute('type','text');

    let formulatSubmit = document.createElement('input');
    formulatSubmit.setAttribute('id','formula-submit');
    formulatSubmit.setAttribute('type','submit');
    formulatSubmit.setAttribute('value','Submit');

    // Add the input and submit button to the container
    calculatorContainer.appendChild(formulaInput);
    calculatorContainer.appendChild(formulatSubmit);

    

    formulatSubmit.addEventListener('click',()=>{
        let formula = formulaInput.value;
        console.log(formula);
        extractCalculation(formula);
    })

    
}

let extractCalculation=(formula)=>{
    let matrixOne = formula.charAt(0);
    let matrixTwo = formula.charAt(2);
    let operator  = formula.charAt(1);

    if(operator==='+'){
        addMatrices(matrixOne, matrixTwo);
    }else if(operator === '-'){
        subtractMatrices(matrixOne, matrixTwo);
    }else if(operator==='*'){
        multiplyMatrices(matrixOne, matrixTwo);
    }
}

let addMatrices=(mtx1,mtx2)=>{
    let newMtx = [];
    if(mtx1.length===mtx2.length && mtx1[0].length===mtx2[0].length){
        // Matrices must be the same size to add together
        for(let row = 0; row<mtx1.length;row++){
            let rowArray = [];
            for (let col = 0; col < mtx1.length; col++) {
                // Add each value together at the individual column
                rowArray.push(mtx1[row][col]+mtx2[row][col]);
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
    }
}

let subtractMatrices = (mtx1, mtx2) => {
    let newMtx = [];
    if (mtx1.length === mtx2.length && mtx1[0].length === mtx2[0].length) {
        // Matrices must be the same size to add together
        for (let row = 0; row < mtx1.length; row++) {
            let rowArray = [];
            for (let col = 0; col < mtx1.length; col++) {
                // Add each value together at the individual column
                rowArray.push(mtx1[row][col] - mtx2[row][col]);
            }
            // Add the new row to the array
            newMtx.push(rowArray);
        }
    }
}

let transpose=(mtx)=>{
    
}

let trace=(mtx)=>{

}







