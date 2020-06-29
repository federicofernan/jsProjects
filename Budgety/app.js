// Budget Controller
let budgetController = (function() {

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            console.log(this.value, totalIncome);
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    let calculateTotal = function(type) {
        let sum = 0;
        // Loop to get the
        data.allItems[type].forEach(function(curr, index, array) {
            sum = sum + curr.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, description, value){
            let newItem, id;

            //Create new ID
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            //Depending on the type create the item
            if (type === 'exp') {
                newItem = new Expense(id, description, value)
            } else if (type === 'inc') {
                newItem = new Income(id, description, value)
            };
            //Add the new item the array
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id) {
            let ids, index;

            //Map return a new array
            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index,1);
            };


        },
        calculateBudget: function () {
            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percentage of income spent
            if (data.totals.inc > 0) {
                data.percentage = (data.totals.exp / data.totals.inc) * 100;
            } else {
                data.percentage = -1;
            };

        },
        calculatePercentages: function() {
          data.allItems.exp.forEach(function(current) {
             current.calcPercentage(data.totals.inc);
          });
        },
        getPercentages: function() {
            let allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },
        getbudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function(){
            console.log(data);
        }
    };

})();

// UI Controller
let uiController = (function() {

    let domString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = function(num, type){
        let pos, numSplit, int, dec, sign;

        let insertString = function (main_string, ins_string, pos) {
            if(typeof(pos) == "undefined") {
                pos = 0;
            }
            if(typeof(ins_string) == "undefined") {
                ins_string = '';
            }
            return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
        }

        //Add the sign + or -
        //Round to 2 decimal
        //Add comma for thousand separator
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            pos = int.length % 3; // find the first ','

            for (let i = pos; i < int.length; i+=4) {
                int = insertString(int, ',', i)
            }

        };
        dec = numSplit[1];
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };

    let nodeListForEach = function(list, callback) {
        for(let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                // Type can be inc or exp
                type: document.querySelector(domString.inputType).value,
                description: document.querySelector(domString.inputDescription).value,
                value: parseFloat(document.querySelector(domString.inputValue).value)
            }
        },
        getDomStrings: function() {
            return domString;
        },
        displayYear: function() {
            let now, year, month, monthsArr;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(domString.dateLabel).textContent= monthsArr[month - 1] + ', ' + year;
        },
        addListItem: function(item, type) {
            let html, itemContainer, newHtml;

            //Add item to the list using HTML String
            if (type === 'inc') {
                itemContainer = domString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                itemContainer = domString.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', formatNumber(item.value, type));

            //Insert HTML into the DOM
            document.querySelector(itemContainer).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorId){
            let element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
        },
        clearFields: function() {
            let fields, fieldsArray;
            //Select all fields
            fields = document.querySelectorAll(domString.inputDescription + ',' + domString.inputValue);
            //Create an array of fields
            fieldsArray = Array.prototype.slice.call(fields);
            //Loop through the fields and clear them
            fieldsArray.forEach(function(curr, index, array) {
                curr.value = "";
            });
            fieldsArray[0].focus();
        },
        displayBudget: function(obj) {
            document.querySelector(domString.budgetLabel).textContent = formatNumber(obj.budget, obj.budget >= 0 ? 'inc' : 'exp');
            document.querySelector(domString.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(domString.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(domString.percentageLabel).textContent = obj.percentage.toFixed(2) + '%';
            } else {
                document.querySelector(domString.percentageLabel).textContent = '---';
            };
        },
        changedType: function() {
            let fields = document.querySelectorAll(
                domString.inputType + ',' +
                domString.inputDescription + ',' +
                domString.inputValue
            );
            nodeListForEach(fields,function(curr) {
                curr.classList.toggle('red-focus');
            });
            document.querySelector(domString.inputBtn).classList.toggle('red');
        },
        displayPercentages: function(percentages) {
            let fields = document.querySelectorAll(domString.expensesPercentageLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 1) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                };

            });
        }
    };
})();

// App Controller
let appController = (function(budgetCtrl, uiCtrl){

    let setupEventListener = function() {
        let dom = uiCtrl.getDomStrings();

        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            };
        });

        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(dom.inputType).addEventListener('change', uiCtrl.changedType);
    };

    let updateBudget = function(){
        //Calculate the budget
        budgetCtrl.calculateBudget();
        //Return the budget
        let budget = budgetCtrl.getbudget();
        //Display the budget on UI
        uiCtrl.displayBudget(budget);
        console.log(budget);
    };

    let updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        let percentages = budgetCtrl.getPercentages();
        console.log('Percentages:', percentages);
        uiCtrl.displayPercentages(percentages);
    };

    let ctrlAddItem = function() {
        let input, item;

        /*
        * Get the input data
        * add the item to the budget controller
        * add the item to the table
        * calculate the budget
        * display the calculated budget on the header
        * */
        input = uiCtrl.getInput();
        console.log(input);
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            item = budgetCtrl.addItem(input.type, input.description, input.value);
            //add item to list
            uiCtrl.addListItem(item, input.type);
            //Clear the input fields and focus again
            uiCtrl.clearFields();
            //Calculate and update budget
            updateBudget();
            updatePercentages();
        } else {
            console.log("There is an error with the input fields.");
        };
    };

    let ctrlDeleteItem = function(event){
        let itemId, splitId, type, ID;
        //Retrieve the id of the item that needs to be deleted
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            //Convert the string to number
            ID = parseInt(splitId[1]);
            budgetCtrl.deleteItem(type, ID);
            uiCtrl.deleteListItem(itemId);
            updateBudget();
            updatePercentages();
        };
    };

    return {
        init: function() {
            console.log('Application has started');
            uiCtrl.displayYear();
            setupEventListener();
            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
        }
    };

})(budgetController, uiController);

appController.init();