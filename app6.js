const Account = class{

    constructor(id, name){
        this.id = id;
        this.name = name;
        this.balance = 0.0; 

        globalAcctID += 1;
    }
}

const Transaction = class{

    constructor(id, date, description, fromAcct, toAcct, amount){
        this.id = id;
        this.date = date;
        this.description = description;
        this.fromAcct = fromAcct;
        this.toAcct = toAcct;
        this.amount = amount;

        globalTransID += 1;
    }

}

const AddAccount = function(){

    let name = InputNewAcct.value;
    accounts[[globalAcctID]] = new Account(globalAcctID, name);

    updateAccounts();
};

const DeleteAccount = function(){

    const delAcct = SelectDelAcct.value;
    if (accounts[delAcct].name == "External"){
        alert("Cannot delete external account");
        return;
    }

    if (confirm("Delete account will also remove all related transactions. Continue?")) {
        delete accounts[delAcct];
        updateAccounts();
    
        // also update all transaction related to the deleted account
        for (let key in transactions){
            if (transactions[key].fromAcct == delAcct || transactions[key].toAcct == delAcct){
                delete transactions[key];
            }
        }
    }

    if (currAcct) {
        ViewAccount();
    }

};

const updateAccounts = function(){

    let txt = ""
    for (let key in accounts){
        acc = accounts[key];
        txt += "<option value="+acc.id+">"+acc.name+"</option>";
    }

    SelectDelAcct.innerHTML = txt;
    SelectFromAcct.innerHTML = txt;
    SelectToAcct.innerHTML = txt;
    SelectViewAcct.innerHTML = txt;
};

const UpdateTransactions = function(){

    let date = InputTransDate.value;
    let desc = InputTransCont.value;
    let fromAcct = SelectFromAcct.value;
    let toAcct = SelectToAcct.value;
    let amt = InputTransAmt.value;

    // do a sanity check
    if (date == ""){
        alert("Input the date for proper bookkeeping!");
        return;
    } 

    if (fromAcct == 0 && toAcct == 0){
        alert("Pure external transaction is irrelevant to your accounts!");
        return;
    }
    
    if (amt == 0){
        alert("Transaction of Zero does not make sense!");
        return;
    }

    // console.log("checked?", cbUpdateTrans.checked);
    if (cbUpdateTrans.checked){

        let id = InputUpdateID.value;
        console.log("id", id);
        if (id in transactions){
            trans = transactions[id];

            // paste the results to the database
            trans.date = date;
            trans.description = desc;
            trans.fromAcct = fromAcct;
            trans.toAcct = toAcct;
            trans.amount = amt;

        } else {
            alert("No such ID for update. Please check.");
            return;
        }
    } else {
        transactions[[globalTransID]] = new Transaction(globalTransID, date, desc, fromAcct, toAcct, amt);
    }

    //console.log(transactions);
    if (currAcct) {
        ViewAccount();
    }

};

const EditTransaction = function(id){

    trans = transactions[id];

    InputTransDate.value = trans.date;
    InputTransCont.value = trans.description;
    SelectFromAcct.value = trans.fromAcct;
    SelectToAcct.value = trans.toAcct;
    InputTransAmt.value = trans.amount;

    //divCBUpdate.innerHTML = "<label>Update?</label><input type='checkbox' class='custom-control-input' id='CheckBoxUpdateTransaction' checked='true'>"
    cbUpdateTrans.checked = true;
    
    //colInputUpdateID.innerHTML = "<input type='number' class='form-control' id='InputUpdateID' placeholder='Update Transaction ID' value=" + id + ">";
    InputUpdateID.value = id;
    InputUpdateID.readOnly = false;
    InputUpdateID.placeholder = "Transaction ID to update";

}

const DeleteTransaction = function(id){

    delete transactions[id];
    ViewAccount();
};

const ViewAccount = function(){

    let acct = SelectViewAcct.value;
    currAcct = acct;

    console.log("Viewing account", acct);

    let selectedTrans = [];
    for (let key in transactions){
        let trans = transactions[key];
        if (trans.toAcct == acct || trans.fromAcct == acct){
            selectedTrans.push(trans);
        }
    }

    
    // sort the transaction according to date
    selectedTrans.sort(function(a,b){return b.date > a.date});
    

    let txt = "";
    let subtotal = 0;
    for (let i=0; i<selectedTrans.length; i++){

        trans = selectedTrans[i];

        if (trans.fromAcct == acct){
            subtotal -= parseFloat(trans.amount);
        } else {
            subtotal += parseFloat(trans.amount);
        }

        txt += "<tr><td scope='col-1'>" + trans.id + "</td>" + 
        "<td scope='col-2'>"+ trans.date + "</td>" + 
        "<td scope='col-3'>"+ trans.description + "</td>" + 
        "<td scope='col-1'>"+ accounts[trans.fromAcct]["name"] + "</td>" + 
        "<td scope='col-1'>"+ accounts[trans.toAcct]["name"] + "</td>" + 
        "<td scope='col-1'>"+ trans.amount + "</td>"

        if (subtotal >= 0){
            txt += "<td scope='col-1'>"+ subtotal + "</td>";
        } else {
            txt += "<td scope='col-1' style='color:red'>"+ subtotal + "</td>";
        }

        txt += "<td scope='col-1'>"+ "<button onclick='EditTransaction(" +trans.id+")'>edit</button>" + "</td>" + 
        "<td scope='col-1'>"+ "<button onclick='DeleteTransaction(" +trans.id+")'>delete</button>" + "</td>" +
      "</td>";
    }

    TransTable.innerHTML = txt;

}

let globalAcctID = 0;
let globalTransID = 0;
let currAcct = "0";

// get all the input from new account setting
const InputNewAcct = document.getElementById("InputNewAccount");

// get all the input from delete account setting
const SelectDelAcct = document.getElementById("SelectDeleteAccount");

// get all the input from update transaction setting
const InputTransDate = document.getElementById("InputTransactionDate");
const InputTransCont = document.getElementById("InputTransactionContent");
const SelectFromAcct = document.getElementById("SelectFromAccount");
const SelectToAcct = document.getElementById("SelectToAccount");
const InputTransAmt = document.getElementById("InputTransactionAmount");

const divCBUpdate = document.getElementById("DivCBUpdate");
const cbUpdateTrans = document.getElementById("CheckBoxUpdateTransaction");
const colInputUpdateID = document.getElementById("ColInputUpdateID");
const InputUpdateID = document.getElementById("InputUpdateID");


// get all the input from view account setting
const SelectViewAcct = document.getElementById("SelectViewAccount");
const TransTable = document.getElementById("TransactionTable");

cbUpdateTrans.addEventListener('change', function(){

    if(cbUpdateTrans.checked){
        //colInputUpdateID.innerHTML = "<input type='number' class='form-control' id='InputUpdateID' placeholder='Update Transaction ID'>";
        InputUpdateID.readOnly = false;
        InputUpdateID.placeholder = "Transaction ID";

    } else {
        //colInputUpdateID.innerHTML = "<input type='number' class='form-control' id='InputUpdateID' placeholder='Leave empty' readonly>";
        InputUpdateID.value = null;
        InputUpdateID.readOnly = true;
        InputUpdateID.placeholder = "Leave blank";


    }
});



const accounts = {[globalAcctID] : new Account(globalAcctID, "External")};
const transactions = {};

console.log(accounts);
updateAccounts();
