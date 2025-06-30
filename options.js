const nameInput = document.getElementById('name-input')
const saveBtn = document.getElementById('save-btn')

// Load saved name when page loads
chrome.storage.sync.get(['name'], function(result) {
    if (result.name) {
        nameInput.value = result.name
        console.log("Loaded saved name:", result.name)
    }
})

// Save name when button is clicked
saveBtn.addEventListener("click", function() {
    chrome.storage.sync.set({name: nameInput.value}, function() {
        console.log("Name is saved:", nameInput.value)
        alert("Name saved successfully!")
    })
})


chrome.storage.sync.get(["name"],(result) => {
    nameInput.value = result.name
    console.log("Name is saved:", result.name)
});