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
content.addEventListener('click', async(e) => {
    console.log(e)
    let isButtonCheck = e.path.find(el => el.className == "button-check")
    if (isButtonCheck) {
        let data = await getItemStorage('list')
        let bool = data.list[isButtonCheck.name].active
        data.list[isButtonCheck.name].active = !bool
        test = ChangeAllStorageList(data.list)
        e.path[isButtonCheck].checked = true
    }
    if (e.path[1].name) {
        deleteNode(e.path[1].name, items)
    }
})

NewNodeButton.addEventListener('click', () => {
    newnode_box.style.display = "flex"
    NewNodeButton.style.display = "none"
})

CreateNodeButton.addEventListener('click', () => {
    let pattern = /^https:\/\//i;
    if (pattern.test(form_url.value)) { // verify is url gived is an url
        let url = new URL(form_url.value)
        console.log(url)
        console.log("dzad", form_time.value)
        let node = {
            url: url.origin,
            time: form_time.value,
            active: true
        }
        form_url.value = ""
        newnode_box.style.display = "none"
        NewNodeButton.style.display = "block"
        InsertAndGetItemsStorage(node, 'list')
    } else { // if its not an url
        form_url.value = ""
        newnode_box.style.display = "none"
        NewNodeButton.style.display = "block"
    }
})

/**
 * if list change add new items
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
    items = changes.list.newValue
    CreateNode(items) // print modifications
});

/**
 * return if a value is Null or not
 * @param {*} val 
 * @returns 
 */
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
            let result = data.list.find(element => element.url === node.url) // verify if element alright exist
            if (isNull(result)) {
                update(data.list, node);
            }
        });

        function update(array, val) {
            array.push(val);
            chrome.storage.local.set({
                list: array
            }, async() => {
                console.log("added to list with new values");
                let data = await getItemStorage('list')
                console.log(data.list)
                resolv(data.list)
            });
        }
    });
}

/**
 * Delete all old value and set new one, to add activate changement
 * @param {Object} data 
 * @returns 
 */
const ChangeAllStorageList = (data) => {
    return new Promise(function(resolv, reject) {
        chrome.storage.local.set({
            list: data
        }, async() => {
            let data = await getItemStorage('list')
            console.log(data.list)
            resolv(data.list)
        });
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
            resolv(data)
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
        if (item[i].active) {
            div.innerHTML = `
           <div class="gauche" >
                <div class="item-hour"><p>${item[i].time}</p><div class="circle-green"></div></div>
                <p class="item-url">${item[i].url}</p>
           </div>
           <div class="droit" >
                <button class="button-leave" value="${i}" name="${i}"><img class="trash" src="/baseline_delete_outline_white_24dp.png"></button> 
                <input class="button-check" name="${i}" type="radio">
            </div>
        `;
        } else {
            div.innerHTML = `
           <div class="gauche" >
                <div class="item-hour"><p>${item[i].time}</p><div class="circle-red"></div></div>
                <p class="item-url">${item[i].url}</p>
           </div>
           <div class="droit" >
                <button class="button-leave" value="${i}" name="${i}"><img class="trash" src="/baseline_delete_outline_white_24dp.png"></button> 
                <input class="button-check" name="${i}" type="radio">
            </div>
        `;
        }

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
    items = item.list
    CreateNode(items)
})