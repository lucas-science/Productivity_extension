// Handles your frontend UI logic.
const NewNodeButton = document.getElementById('new-node');
const CreateNodeButton = document.getElementById('create-node');
const content = document.getElementById('content');

const newnode_box = document.getElementById('newnode_box');
const form_url = document.getElementById('form_url');
const form_time = document.getElementById('form_time');

let node_items = []

content.addEventListener('click', (e) => {
    console.log(e.path[0].name)
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
        /*
        while (document.getElementById('content').firstChild) {
            div.removeChild(document.getElementById('content').firstChild);
        }*/
        for (let i in val) {
            console.log(val[i]);
            const div = document.createElement('div');
            div.className = "item"
            div.innerHTML = `
                <p>${val[i].url}</p>
                <p>${val[i].time}</p>
                <button name="${i}">X</button>
            `;
            document.getElementById('content').appendChild(div);
        }
    })
})



const getItemStorage = (name) => {
    return new Promise(function(resolv, reject) {
        chrome.storage.local.get(name, function(data) {
            let val = data.list;

            for (let i in val) {
                const div = document.createElement('div');
                div.className = "item"
                div.innerHTML = `
                    <p>${val[i].url}</p>
                    <p>${val[i].time}</p>
                    <button name="${i}">X</button>
                `;
                document.getElementById('content').appendChild(div);
            }
        });
    })
}


getItemStorage('list').then((val) => {

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