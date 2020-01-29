class CalculatorSetup{
    constructor(){
        this.ALPHABET = 'abcdefghijklmnopqrstuvwxyz'; // Used to give the matrices letter labels

        // Variables for first screen question getting the number of matrices (saveMatrixCount())
        this.matrixAmountInput = document.getElementById('matrix-amount-input-container');
        this.matrixCountButton = document.getElementById('matrix-count-button');
        this.matrixCount; // Holds the count for amount of matrices which will be used

        // Second input screen asking for the dimensions (createMatrices())
        this.matrixSizeInputContainer = document.getElementById('matrix-size-input-container');
        this.matrixDimensionSubmit; // Can only get element by ID when made

        // Third input screen for row and column value input
        this.matrixValInputContainer = document.getElementById('matrix-value-input-container');
        this.submitButton; // Set in addValuesToArray()
        this.matrixHolder = {}; // This will hold the actual matrix 2D arrays with values

        // Called in printMatrices()
        this.matrixContainer = document.getElementById('show-matrices-container'); 


    }

    /******************************** METHODS *************************************/
    newElement(elementType, appendagee, attributes, text){
        // Appendagee is the parent element it will be attached to
        let element = document.createElement(elementType);
        // Add the attributes, {attributes} will be an object where the attributes can be placed and will be looped through
        Object.keys(attributes).forEach(key => { element.setAttribute(key, attributes[key]); });
        if (text) element.innerHTML = text; // If there is text then add it to the element
        if (appendagee) appendagee.appendChild(element);// Add the element to the parent
        return element;
    }

    /***************************** EVENT LISTENERS ********************************/
    saveMatrixCount=()=>{
        // When user clicks submit for the matrix count input
        // Called on new class instance
        this.matrixCountButton.addEventListener('click', () => {
            this.matrixAmountInput.style.display = 'none'; // Remove the amount inputs
            this.matrixSizeInputContainer.classList.remove('inputs-container-hidden'); // Make it visible
            // When user submits matrix count, print out that number of inputs for the matrix sizes
            this.matrixCount = document.getElementById('matrix-count').value;

            // Add paragraph so user knows what to input (size of matrices)
            this.newElement('p', this.matrixSizeInputContainer, {}, 'How big will the matrices be?');

            // Create the inputs for the sizes of matrices
            for (let i = 0; i < this.matrixCount; i++) {
                // Add the matrix number header
                this.newElement('h2', this.matrixSizeInputContainer, {}, 'MATRIX ' + this.ALPHABET.charAt(i).toUpperCase());

                let matrixSizeBox = this.newElement('div', this.matrixSizeInputContainer, { id: 'matrix-size-containers' })
                // Title to denote the row input
                this.newElement('span', matrixSizeBox, {}, "Rows: ");
                this.newElement('input', matrixSizeBox, { id: 'matrix-' + i + '-row-size', class: 'matrix-row' }, '');
                this.newElement('br', matrixSizeBox, {});

                // Title to denote the column input
                this.newElement('span', matrixSizeBox, {}, "Columns: ")
                this.newElement('input', matrixSizeBox, { id: 'matrix-' + i + '-col-size', class: 'matrix-col' }, '');
                this.newElement('br', matrixSizeBox, {});
            }

            // Create the submit button for the matrix dimensions
            this.newElement('input', this.matrixSizeInputContainer, { type: 'submit', id: 'matrix-dimension-submit' })
            this.createMatrices();
        });
    }

    createMatrices(){
        /********************** CREATE INPUTS FOR MATRIX VALUES *********************
         * Called in the event listener of saveMatrixCount(), otherwise gives error 
         * because matrix-dimension-submit not created yet.
        */
        this.matrixDimensionSubmit = document.getElementById('matrix-dimension-submit');

        this.matrixDimensionSubmit.addEventListener('click', () => {
            // When user submits the dimensions, create the inputs for the matrix arrays
            for (let i = 0; i < this.matrixCount; i++) {
                // Get the row and column counts for the individual matrix
                let rowCount = document.getElementById('matrix-' + i + '-row-size').value;
                let colCount = document.getElementById('matrix-' + i + '-col-size').value;

                // Create container for individual matrix
                this.newElement('h2', this.matrixValInputContainer, {}, 'MATRIX ' + this.ALPHABET.charAt(i).toUpperCase() + ' VALUES');

                let matrixDiv = this.newElement('div', this.matrixValInputContainer, { id: 'matrix-' + i, class: 'matrix matrix-container' });

                // Create the matrix of inputs
                for (let row = 0; row < rowCount; row++) {
                    // Row for the matrix
                    let rowDiv = this.newElement('div', '', { class: 'row' })

                    for (let col = 0; col < colCount; col++) {
                        // Input label
                        this.newElement('input', rowDiv, {
                            class: 'row-' + row + " col-" + col,
                            id: 'matrix-' + i + '-row-' + row + "-col-" + col
                        })
                        matrixDiv.appendChild(rowDiv);
                    }
                }
            }
            this.newElement('input', this.matrixValInputContainer, { type: 'submit', id: 'matrix-submit-button' });
            this.matrixValInputContainer.classList.remove('inputs-container-hidden'); // Make container shown
            this.addValuesToArray();
            this.matrixSizeInputContainer.style.display = 'none'; // Remove the size inputs
        });
    };

    /****************** ADD VALUE USER INPUTS TO ARRAY  **********************/

    addValuesToArray(){
        // Add the user inputs to the array matrixHolder. Called in createMatrices()
        this.submitButton = document.getElementById('matrix-submit-button');

        this.submitButton.addEventListener('click', () => {
            for (let i = 0; i < this.matrixCount; i++) {
                // Go through each input, get its value and add it to the array
                // Get the row and column counts for the individual matrix
                let rowCount = document.getElementById('matrix-' + i + '-row-size').value;
                let colCount = document.getElementById('matrix-' + i + '-col-size').value;

                // Create array to hold the current matrix 'i'
                this.matrixHolder[i] = new Array(rowCount);

                // Add the values to the array
                for (let row = 0; row < rowCount; row++) {
                    // Add new Array with size of columns in current row
                    this.matrixHolder[i][row] = new Array(colCount);
                    for (let col = 0; col < colCount; col++) {
                        let value = document.getElementById('matrix-' + i + '-row-' + row + "-col-" + col).value;
                        this.matrixHolder[i][row][col] = value; // Add value to the array
                    }
                }
            }
            
            this.printMatrices();
        });
    }

    /************************ PRINT MATRICES TO SCREEN  **************************/
    // Used the following to make the matrix. Called in 'addValuesToArray()
    // https://stackoverflow.com/questions/11561137/html-css-for-brackets-around-mathematical-matrix-prefer-lightweight
    printMatrices(){
        // Called in addValuesToArray()
        this.matrixValInputContainer.style.display = 'none'; // Remove matrix value inputs

        // Loop through matrixes and print them to the screen
        for (let mtx = 0; mtx < this.matrixCount; mtx++) {
            this.printMatrix(this.matrixContainer,this.matrixHolder[mtx],mtx,'');   
        }
        // Set up the calculator
        let matrixCalculator = new MatrixCalculator(this.matrixHolder, this.matrixContainer, this.matrixCount);
        matrixCalculator.matrixCalculator();
        document.getElementById('matrix-calculator-operations').classList.remove('inputs-container-hidden');
        
    }

    printMatrix(container, mtx, mtxCount, text, className, matrixText){
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
}

let createCalculator = new CalculatorSetup();
createCalculator.saveMatrixCount();