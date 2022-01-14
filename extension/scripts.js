// Handles your frontend UI logic.
const NewNodeButton = document.getElementById('new-node');
const CreateNodeButton = document.getElementById('create-node');
const content = document.getElementById('content');

const newnode_box = document.getElementById('newnode_box');
const form_url = document.getElementById('form_url');
const form_time = document.getElementById('form_time');

let items = []

/* Listeners */
newnode_box.style.display = "none"
content.addEventListener('click', (e) => {
    console.log(e.path[1].name)
    if(!isNull(e.path[1].name)){
        deleteNode(e.path[1].name, items)
    }
})

NewNodeButton.addEventListener('click', () => {
    newnode_box.style.display = "flex"
    NewNodeButton.style.display = "none"
})

CreateNodeButton.addEventListener('click', () => {
    let node = {
        url: form_url.value,
        time: form_time.value
    }
    form_url.value = ""
    form_time.value = 0
    newnode_box.style.display = "none"
    NewNodeButton.style.display = "block"
    InsertAndGetItemsStorage(node, 'list')
})

chrome.storage.onChanged.addListener(function(changes, namespace) {
    items = changes.list.newValue
    CreateNode(items) // print modifications
});

const isNull = (val) => {
    return val == null ? true : false
}

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
            }, async() => {
                console.log("added to list with new values");
                let data = await getItemStorage('list')
                resolv(data)
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
            <button class="button-leave" value="${i}" name="${i}"><img class="trash" src="/baseline_delete_outline_white_24dp.png"></button>
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
            console.log("New list : ", data.list)
        });
    });
}
chrome.storage.local.get('list', function(result) {
    console.log(result)
    if (Object.entries(result).length === 0) {
        chrome.storage.local.set({ 'list': [] }, () => {
            chrome.storage.local.get('list', result => console.log(result));
        })
    }
});
// print items stored
getItemStorage('list').then(item => {
    items = item
    CreateNode(item)
})


