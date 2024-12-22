document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employee-form');
    const employeeTableBody = document.getElementById('employee-table-body');
    const employeeListBtn = document.getElementById('employee-list-btn');
    const addEmployeeBtn = document.getElementById('add-employee-btn');
    const employeeFormCard = document.getElementById('employee-form-card');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    let editEmployeeId = null;

    // Load employees from LocalStorage
    function loadEmployees() {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        employeeTableBody.innerHTML = '';
        employees.forEach(employee => {
            const row = `<tr>
                <td>${employee.id}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.age}</td>
                <td>${employee.department}</td>
                <td>${employee.role}</td>
                <td>${employee.salary}</td>
                <td>${employee.hiringDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee('${employee.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${employee.id}')">Delete</button>
                </td>
            </tr>`;
            employeeTableBody.innerHTML += row;
        });
    }

    // Check if Employee ID is unique and hasn't been used before
    function isUniqueEmployee(id, email) {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const usedEmployeeIds = JSON.parse(localStorage.getItem('usedEmployeeIds')) || [];
        return !employees.some(employee => employee.id === id || employee.email === email) && !usedEmployeeIds.includes(id);
    }

    // Add employee
    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('emp-id').value;
        const email = document.getElementById('email').value;

        if (!isUniqueEmployee(id, email) && !editEmployeeId) {
            alert('Employee ID or Email already exists, or ID has been used before.');
            return;
        }

        const newEmployee = {
            id: id,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: email,
            age: document.getElementById('age').value,
            department: document.getElementById('department').value,
            role: document.getElementById('role').value,
            salary: document.getElementById('salary').value,
            hiringDate: document.getElementById('hiring-date').value,
        };

        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        let usedEmployeeIds = JSON.parse(localStorage.getItem('usedEmployeeIds')) || [];

        if (editEmployeeId) {
            employees = employees.map(employee =>
                employee.id === editEmployeeId ? newEmployee : employee
            );
            editEmployeeId = null;
            submitBtn.textContent = 'Add Employee';
        } else {
            employees.push(newEmployee);
            usedEmployeeIds.push(id); // Store the used ID, even if the employee is deleted later
        }

        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.setItem('usedEmployeeIds', JSON.stringify(usedEmployeeIds)); // Update used IDs list
        loadEmployees();
        clearForm();
        employeeFormCard.style.display = 'none';
    });

    // Delete employee
    window.deleteEmployee = function(id) {
        let employees = JSON.parse(localStorage.getItem('employees')) || [];
        employees = employees.filter(employee => employee.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        loadEmployees();
        // Note: The ID is not removed from the `usedEmployeeIds` array to prevent reuse
    }

    // Edit employee
    window.editEmployee = function(id) {
        const employees = JSON.parse(localStorage.getItem('employees')) || [];
        const employee = employees.find(emp => emp.id === id);

        if (employee) {
            document.getElementById('emp-id').value = employee.id;
            document.getElementById('first-name').value = employee.firstName;
            document.getElementById('last-name').value = employee.lastName;
            document.getElementById('email').value = employee.email;
            document.getElementById('age').value = employee.age;
            document.getElementById('department').value = employee.department;
            document.getElementById('role').value = employee.role;
            document.getElementById('salary').value = employee.salary;
            document.getElementById('hiring-date').value = employee.hiringDate;

            formTitle.textContent = 'Edit Employee';
            submitBtn.textContent = 'Update Employee';
            editEmployeeId = id;
            employeeFormCard.style.display = 'block';

            // Disable editing the Employee ID
            document.getElementById('emp-id').disabled = true;
        }
    }

    // Show employee form
    employeeListBtn.addEventListener('click', () => {
        employeeFormCard.style.display = 'none';
    });

    // Show form when "Add Employee" is clicked
    addEmployeeBtn.addEventListener('click', () => {
        clearForm();
        employeeFormCard.style.display = 'block';
        formTitle.textContent = 'Add New Employee';
        submitBtn.textContent = 'Add Employee';
    });

    // Cancel form
    cancelBtn.addEventListener('click', () => {
        employeeFormCard.style.display = 'none';
    });

    // Clear form fields
    function clearForm() {
        employeeForm.reset();
        editEmployeeId = null;
        document.getElementById('emp-id').disabled = false; // Enable ID field when adding new
    }

    // Initial load
    loadEmployees();
});
