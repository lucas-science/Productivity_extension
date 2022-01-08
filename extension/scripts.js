// Handles your frontend UI logic.
document.getElementById('bouton').onclick = function() {
    chrome.storage.local.set({ test: "test" }, function() {
        alert("sucess")
    });

    chrome.storage.local.get('test', function(result) {
        alert(result.test);
    });
}