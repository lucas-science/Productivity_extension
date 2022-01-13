/**
 * Insert Data in local storage
 * @param {*} node 
 * @returns Promise of data inserted
 */
export const InsertAndGetItemsStorage = (node, name) => {
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
export const getItemStorage = (name) => {
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
export const CreateNode = (item) => {
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
export const deleteNode = (index, items) => {
    items.splice(index, 1)
    chrome.storage.local.set({
        list: items
    }, () => {
        chrome.storage.local.get('list', function(data) {
            console.log("New list : ", data.list)
        });
    });
}