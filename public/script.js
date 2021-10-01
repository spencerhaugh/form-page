const submitBtn = document.getElementById('submit');
const required = document.querySelectorAll('label');
const reset = document.getElementById('reset');
const formElements = document.querySelectorAll('.form-item');

let formError = false;

// AUTO-ADD * FLAGS TO REQUIRED FIELDS
required.forEach(element => {
    if (element.classList.contains('required')) {
        let requiredSpan = document.createElement('span');
        let requiredText = document.createTextNode(' *');
        requiredSpan.appendChild(requiredText);
        element.appendChild(requiredSpan);
    }
});

// CREATE ERROR MESSAGE
const errorMsg = (id) => {
    if (id === 'checkboxes') return;
    const errorEl = document.createElement('div');
    const errorText = document.createTextNode(`This field is required`);
    errorEl.setAttribute("id", `${id}-errorMsg`);
    errorEl.classList.add("errorMsg")
    errorEl.appendChild(errorText);

    let failedEl = document.getElementById(`form-${id}`);
    if (failedEl) failedEl.classList.add('failed');
    failedEl.prepend(errorEl);
};

// ADD ERROR CLASS
const addError = (id) => {
    let formInputError = document.getElementById(`${id}`);
    formInputError.classList.add('error');
    formError = true;
};

// REMOVE ERROR CLASSES
const removeErrorClass = (id) => {
    let removeErr = document.getElementById(`${id}`);
    if (removeErr) removeErr.classList.remove('error');
};

// VALIDATE CHECKBOXES (Expectaion: Minimum 1 checked)
const validateCheckboxes = (boxes) => {
    let isChecked = false;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i]) isChecked = true;
    };

    if (!isChecked) {
        formError = true;
        addError('checkboxes');
        errorMsg('checkboxes');
    };
    return isChecked;
};

// VALIDATE EMAIL (EXTRA SIMPLE MOCK)
const validateEmail = (email) => {
    let atSign = false;
    for (let char of email) {
        if (char === '@') atSign = true;
    };
    return atSign;
};

// HANDLE FORM SUBMIT
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formError = false;

    if (!formError) removeErrorClass('checkboxes');

    // Get Form Submission Data
    const formData = document.querySelectorAll('#form input, #form select');

    const formInfo = {
        firstName: null,
        lastName: null,
        email: null,
        euResident: null,
        oneIsChecked: false,
        advances: false,
        alerts: false,
        other: false
    };

    // Remove any previous error messages
    formElements.forEach(el => {
        if (el.classList.contains('failed')) {
            el.classList.remove('failed')
            el.firstChild.remove();
        }
    });

    // MAIN LOOP OF SUBMISSION DATA
    for (let i = 0; i < formData.length; i++) {
        let item = formData[i];

        // Handle null & non-required input values
        if (item.value || item.id === "organization") {
            removeErrorClass(item.id);
        } else {
            addError(item.id)
            errorMsg(item.id)
        };
        // Validate non-null user input
        if (item.id === "firstName" || item.id === "lastName" || item.id === "euResident") {
            !item.value ? addError(item.id) : formInfo[item.id] = item.value;
        } else if (item.id === "email") {
            item.value && validateEmail(item.value) ? formInfo[item.id] = item.value : addError(item.id);
        } else if (item.id === "advances" || "alerts" || "other") {
            if (item.checked) formInfo[item.id] = item.checked;
        };
    };

    // Validate checkbox section (Minium 1 checked)
    const userCheckboxes = [formInfo.advances, formInfo.alerts, formInfo.other]
    formInfo.oneIsChecked = validateCheckboxes(userCheckboxes);

    // EXECUTE FORM
    const executeForm = async () => {
        const data = await fetch('/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formInfo)
        })
        const serverResponse = await data.json()
        console.log(serverResponse);
    };

    // SEND POST REQ
    if (!formError) {
        console.log(formInfo);
        // Send formInfo to server
        executeForm();
    };
});
