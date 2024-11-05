const apiUrl = '/students';

// Fetch records and populate the table on page load
document.addEventListener('DOMContentLoaded', fetchStudents);

// Function to fetch students from the API
async function fetchStudents() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderItems(data);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Function to render students in the table
function renderItems(items) {
    const tableBody = document.getElementById("itemsTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    items.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td contenteditable="true" oninput="updateItem(${item.id}, 'name', this.innerText)">${item.name}</td>
            <td contenteditable="true" oninput="updateItem(${item.id}, 'age', this.innerText)">${item.age}</td>
            <td contenteditable="true" oninput="updateItem(${item.id}, 'study', this.innerText)">${item.study}</td>
            <td>
                <button onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to update an existing student
async function updateItem(id, property, value) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [property]: value })
        });

        if (response.ok) {
            fetchStudents(); // Refresh the table
        } else {
            console.error("Error updating student");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to delete a student
async function deleteItem(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchStudents(); // Refresh the table
        } else {
            console.error("Error deleting student");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to create a new student
async function createNewItem() {
    const newProp1 = document.getElementById("newProp1").value;
    const newProp2 = document.getElementById("newProp2").value;
    const newProp3 = document.getElementById("newProp3").value;

    if (!newProp1 || !newProp2 || !newProp3) {
        alert("Please fill in all fields.");
        return;
    }

    const newItem = {
        name: newProp1,
        age: newProp2,
        study: newProp3,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        if (response.ok) {
            fetchStudents(); // Refresh the table
        } else {
            console.error("Error creating student");
        }
    } catch (error) {
        console.error("Error:", error);
    }

    // Clear the input fields
    document.getElementById("newProp1").value = "";
    document.getElementById("newProp2").value = "";
    document.getElementById("newProp3").value = "";
}

// Add event listener to the button for creating new items
document.querySelector('.new-item-form button').addEventListener('click', createNewItem);
