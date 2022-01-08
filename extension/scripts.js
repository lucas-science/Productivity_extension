// Handles your frontend UI logic.
const NewNodeButton = document.getElementById('new-node');
const CreateNodeButton = document.getElementById('create-node');

const newnode_box = document.getElementById('newnode_box');
const form_url = document.getElementById('form_url');
const form_time = document.getElementById('form_time');

let node_items = []

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

    const InsertAndGetItemsStorage = new Promise(function(resolv, reject) {
        chrome.storage.local.get('list', function(data) {
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

    InsertAndGetItemsStorage.then((val) => {
        for (let i in val) {
            console.log(val[i]);
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <p>${val[i].url}</p>
                <p>${val[i].time}</p>
            `;
            document.getElementById('content').appendChild(div);
        }
    })
})

const getItemStorage = (name) => {
    return new Promise(function(resolv, reject) {
        chrome.storage.local.get(name, function(data) {
            resolv(data.list);
        });
    })
}

getItemStorage('list').then((val) => {
    for (let i in val) {
        console.log(val[i]);
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <p>${val[i].url}</p>
            <p>${val[i].time}</p>
        `;
        document.getElementById('content').appendChild(div);
    }
})

/*
document.getElementById('bouton').onclick = function() {
    chrome.storage.local.set({ test: "test" }, function() {
        alert("sucess")
    });

    chrome.storage.local.get('test', function(result) {
        alert(result.test);
    });
}*/