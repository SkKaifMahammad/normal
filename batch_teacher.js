
import { API_URL } from "./config.js";


// API Configuration
const API_ENDPOINTS = {
    GET_BATCHES: `${API_URL}/teacher/batches`,
    CREATE_BATCH: `${API_URL}/teacher/batches/create`,
    DELETE_BATCH: `${API_URL}/teacher/batches/delete`,
    SHARE_BATCH: `${API_URL}/teacher/batches/share`,
};

// State Management
let currentBatches = [];

// API Integration Functions
async function fetchBatches() {
    try {

        let returnVal;

        const response = await fetch(API_ENDPOINTS.GET_BATCHES,{
            method:'GET',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
            }
           })

        if(response.status === 401){
            alert("You are not authorized, please login again");
            window.location.href = "index.html";
            return [];
        }
         if(!response.ok){
            alert("something went worng,please refresh again;");
            return [];
         }

        const data = await response.json();




        return data.batches;
    } catch (error) {
        console.error('Error fetching batches:', error);
        return [];
    }
}

async function createBatch(batchData) {
    try {

        const response = await fetch(API_ENDPOINTS.CREATE_BATCH,{
            method:'POST',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            },body: JSON.stringify({
                batchData,
            })
        });
        if(response.status === 401){
            alert("You are not authorized, please login again");
            window.location.href = "index.html";
            return [];
        }
        

        if(!response.ok){
            throw new error();   
        }

        const body = await response.json();
        return body;
    } catch (error) {
        console.error('Error creating batch:', error);
        return { success: false, error: 'Failed to create batch' };
    }
}

async function deleteBatchAPI(batchId) {
    try {

        const response = await fetch(API_ENDPOINTS.DELETE_BATCH,{
            method:'DELETE',
            credentials: 'include',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            },body:JSON.stringify({
                batchId,
            })

        })

        if(response.status === 401){
            alert("You are not authorized, please login again");
            window.location.href = "index.html";
            return [];
        }
         i

        if(!response.ok){
            return {success:false};
        }

        return {success:true,};
    } catch (error) {
        console.error('Error deleting batch:', error);
        return { success: false, error: 'Failed to delete batch' };
    }
}

async function shareBatchAPI(batchId) {
    try {
    
        const response = await fetch(`${API_ENDPOINTS.SHARE_BATCH}/${batchId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                batchId,}),
        });
         if(response.status === 401){
            alert("You are not authorized, please login again");
            window.location.href = "index.html";
            return [];
        }
         i
         if(!response.ok){
            alert("something went wrong,please refresh again;");
            throw new Error('Failed to generate share link');
         }
        return await response.json();
        
        // Temporary mock response
        // return { 
        //     success: true, 
        //     shareLink: `https://yourplatform.com/batch/${batchId}` 
        // };
    } catch (error) {
        console.error('Error sharing batch:', error);
        return { success: false, error: 'Failed to generate share link' };
    }
}

// UI Components
function createBatchButton(batch) {
    const batchButton = document.createElement("button");
    batchButton.className = "batch-btn";
    batchButton.dataset.batchId = batch.id;
    
    const batchContent = document.createElement("div");
    batchContent.className = "batch-content";
    batchContent.innerHTML = `
        <h2>${batch.title}</h2>
        <p>${batch.details}</p>
    `;
    batchContent.addEventListener('click', () => handleBatchClick(batch));

    const menuContainer = document.createElement("div");
    menuContainer.className = "three-dot-menu";
    
    // Create three-dot icon with SVG
    const threeDotIcon = document.createElement("div");
    threeDotIcon.className = "three-dot-icon";
    threeDotIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
        </svg>
    `;
    threeDotIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenuOptions(e);
    });

    const menuOptions = document.createElement("div");
    menuOptions.className = "menu-options";
    menuOptions.innerHTML = `
        <button class="menu-option share-btn">Share Link</button>
        <button class="menu-option delete-btn">Delete Batch</button>
    `;

    // Add event listeners for menu options
    const shareBtn = menuOptions.querySelector('.share-btn');
    const deleteBtn = menuOptions.querySelector('.delete-btn');
    

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
    
        // Assuming `batch` contains the batch-specific information (e.g., batch link or ID)
        const batchLink = `https://example.com/batch/${batch.id}`; // Replace with actual logic for generating the batch link
    
        // Populate the share link in the modal
        const shareLink = document.getElementById('shareLink');
        shareLink.textContent = batchLink;
    
        // Display the share popup modal
        const sharePopup = document.getElementById('sharePopup');
        sharePopup.style.display = 'block';
    
        // Hide the menu options
        e.target.closest('.menu-options').classList.remove('show');
    });
    
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDeleteBatch(e, batch);
        e.target.closest('.menu-options').classList.remove('show');
    });

    menuContainer.appendChild(threeDotIcon);
    menuContainer.appendChild(menuOptions);

    batchButton.appendChild(batchContent);
    batchButton.appendChild(menuContainer);
    return batchButton;
}

// Add menu toggle function
function toggleMenuOptions(event) {
    event.stopPropagation();
    
    // Close all other open menus
    const allMenuOptions = document.querySelectorAll('.menu-options');
    allMenuOptions.forEach(menu => {
        if (menu !== event.currentTarget.closest('.three-dot-menu').querySelector('.menu-options')) {
            menu.classList.remove('show');
        }
    });

    // Toggle current menu
    const menuOptions = event.currentTarget.closest('.three-dot-menu').querySelector('.menu-options');
    menuOptions.classList.toggle('show');
}

// Event Handlers
function handleBatchClick(batch) {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const queryParams = url.searchParams;

    const temp = "?username="+queryParams.get("username")+"&batchId="+batch.id;

    window.location.href = "teacher_dashboard.html"+temp;

}



async function handleDeleteBatch(event, batch) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete batch: ${batch.title}?`)) {
        const result = await deleteBatchAPI(batch.id);
        if (result.success) {
            const batchElement = document.querySelector(`[data-batch-id="${batch.id}"]`);
            if (batchElement) {
                batchElement.remove();
                currentBatches = currentBatches.filter(b => b.id !== batch.id);
            }
        } else {
            alert('Failed to delete batch. Please try again.');
        }
    }
}

async function handleBatchSubmit(event) {
    event.preventDefault();
    
    const formData = {
        batchName: document.getElementById('batchName').value,
        subject: document.getElementById('subject').value,
        startDate: document.getElementById('startDate').value,
        description: document.getElementById('description').value
    };

    const newBatchData = {
        title: `${formData.subject} - ${formData.batchName}`,
        details: formData.description,
        startDate: formData.startDate
    };

    const result = await createBatch(newBatchData);

    if (result.success) {
        currentBatches.push(result.data);
        batchContainer.appendChild(createBatchButton(result.data));
        closeBatchForm();
    } else {
        alert('Failed to create batch. Please try again.');
    }
}

// Form Management
// function openBatchForm() {
//     const popup = document.getElementById('batchFormPopup');
//     popup.classList.add('active');
// }

function closeBatchForm() {
    const popup = document.getElementById('batchFormPopup');
    popup.classList.remove('active');
    document.getElementById('batchForm').reset();
}

// Global click listener to close menus when clicking outside
document.addEventListener('click', function(event) {
    const menus = document.querySelectorAll('.menu-options');
    menus.forEach(menu => {
        if (!menu.contains(event.target) && !event.target.closest('.three-dot-menu')) {
            menu.classList.remove('show');
        }
    });
});

// Initialize Application
const batchContainer = document.getElementById("existingBatchContainer");

async function initializeApp() {
    try {
        currentBatches = await fetchBatches();
        currentBatches.forEach(batch => {
            batchContainer.appendChild(createBatchButton(batch));
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Function to open the modal
function openBatchForm() {
    const modal = document.getElementById('batchFormModal');
    modal.style.display = 'flex'; // Show the modal
}

// Function to close the modal
// function closeBatchForm() {
//     const modal = document.getElementById('batchFormModal');
//     modal.style.display = 'none'; // Hide the modal
// }

// Function to handle form submission
function submitBatchForm(event) {
    event.preventDefault(); // Prevent form submission

    try {

        handleBatchSubmit(event);

        // Close the modal after submission
        
        // Clear the form
        document.getElementById('batchForm').reset();
        closeBatchForm();

        // Optional: Success message
        alert("Batch created successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the batch. Please try again.");
    }
}



//   ------------------ copy the share link--------------------------//

function closeSharePopup() {
    document.getElementById('sharePopup').style.display = 'none';
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy link.');
    });
}
// Attach event
document.getElementById('copyButton').addEventListener('click', () => {
    copyToClipboard(document.getElementById('shareLink').textContent);
});


//---------------- Spinner functionality --------------//
const spinner = document.getElementById("spinner"); // Reference to spinner

// Function to show the spinner
function showSpinner() {
  spinner.style.display = "block";
}

// Function to hide the spinner
function hideSpinner() {
  spinner.style.display = "none";
}

// Start the application
initializeApp();
