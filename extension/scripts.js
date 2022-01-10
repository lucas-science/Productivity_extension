// Handles your frontend UI logic.
const NewNodeButton = document.getElementById('new-node');
const CreateNodeButton = document.getElementById('create-node');
const content = document.getElementById('content');

const newnode_box = document.getElementById('newnode_box');
const form_url = document.getElementById('form_url');
const form_time = document.getElementById('form_time');

let items = []

/* Listeners */

content.addEventListener('click', (e) => {
    console.log(e.path[0].name)
    deleteNode(e.path[0].name, items)
})

NewNodeButton.addEventListener('click', () => {
    newnode_box.style.display = "block"
})

CreateNodeButton.addEventListener('click', () => {
    let node = {
        url: form_url.value,
        time: form_time.value
    }
    form_url.value = ""
    form_time.value = 0
    newnode_box.style.display = "none"

    InsertAndGetItemsStorage(node, 'list')
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    items = changes.list.newValue
    CreateNode(items) // print modifications
});

/**
 * Insert Data in local storage
 * @param {*} node 
 * @returns Promise of data inserted
 */
const InsertAndGetItemsStorage = (node, name) => {
    return new Promise(function(resolv, reject) {
        chrome.storage.local.get(name, function(data) {
            update(data.list, node);
        });

        function update(array, val) {
            array.push(val);
            chrome.storage.local.set({
                list: array
            }, function() {
                console.log("added to list with new values");
                chrome.storage.local.get('list', function(data) {
                    resolv(data.list)
                });
            });
        }
    });
}

/**
 * Get list of data stored in local storage
 * @param {*} name 
 * @returns 
 */
const getItemStorage = (name) => {
    return new Promise(function(resolv, reject) {
        chrome.storage.local.get(name, function(data) {
            resolv(data.list)
        });
    })
}

/**
 * Print items inside the div
 * @param {*} item 
 */
const CreateNode = (item) => {
    document.getElementById('content').innerHTML = "";
    for (let i in item) {
        const div = document.createElement('div');
        div.className = "item"
        div.innerHTML = `
            <p>${item[i].url}</p>
            <p>${item[i].time}</p>
            <button name="${i}">X</button>
        `;
        document.getElementById('content').appendChild(div);
    }
}

/**
 * Delete an item with its index
 * @param {*} index 
 * @param {*} items 
 */
const deleteNode = (index, items) => {
    items.splice(index, 1)
    chrome.storage.local.set({
        list: items
    }, () => {
        chrome.storage.local.get('list', function(data) {
            console.log("value deleted", data.list)
        });
    });
}

getItemStorage('list').then(item => {
    items = item
    CreateNode(item)
})