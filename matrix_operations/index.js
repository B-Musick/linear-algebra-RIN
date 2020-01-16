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

matrixCountButton.addEventListener('click',()=>{
    matrixAmountInput.style.display = 'none'; // Remove the amount inputs
    // When user submits matrix count, print out that number of inputs for the matrix sizes
    matrixCount = document.getElementById('matrix-count').value;

    // Add paragraph so user knows what to input (size of matrices)
    let paragraph   = document.createElement('p');
    paragraph.textContent = 'How big will the matrices be?'
    matrixSizeInputContainer.appendChild(paragraph);

    // Create the inputs for the sizes of matrices
    for(let i = 0;i<matrixCount;i++){
        // Add the matrix number header
        let matrixHeader = document.createElement('h4');
        matrixHeader.textContent = 'Matrix '+i;
        matrixSizeInputContainer.appendChild(matrixHeader);

        // Title to denote the row input
        let rowSpan = document.createElement('span');
        rowSpan.textContent = "Rows: ";

        // Title to denote the column input
        let colSpan = document.createElement('span');
        colSpan.textContent = "Columns: ";
        // Create the input elements
        let newRowInput = document.createElement('input');
        let newColInput = document.createElement('input');

        // Set the class attribute of the input elements
        newRowInput.setAttribute('id','matrix-'+i+'-row-size');
        newRowInput.setAttribute('class','matrix-row');
        newColInput.setAttribute('id','matrix-'+i+'-col-size');
        newColInput.setAttribute('class','matrix-col');

        // Append the inputs to the container
        matrixSizeInputContainer.appendChild(rowSpan);
        matrixSizeInputContainer.appendChild(newRowInput);
        matrixSizeInputContainer.appendChild(colSpan);
        matrixSizeInputContainer.appendChild(newColInput);

    }
    // Create the submit button for the matrix dimensions
    let submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('id', 'matrix-dimension-submit');
    matrixSizeInputContainer.appendChild(submitButton);

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
}






