// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT
let isVisible = true

/**
 * Get list of data stored in local storage
 * @param {string} name 
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
 * 
 * @param {Object} val 
 * @returns True or False
 */
const isNull = (val) => {
    return val == null ? true : false
}

const addTimeUsed = (domain) => {
    return new Promise((resolv, reject) => {
        chrome.storage.local.get('timeused', function(result) {
            let array = result.timeused
            array.push(domain.origin)
            chrome.storage.local.set({ 'timeused': array }, () => {
                chrome.storage.local.get('timeused', result => resolv(result));
            })
        });
    })
}

/**
 * delete all data which is inside of .timeused
 */
const deleteTimeUsed = () => {
    chrome.storage.local.set({
        timeused: []
    }, () => {
        chrome.storage.local.get('timeused', function(data) {
            console.log("deleted : ", data.timeused)
        });
    });
}

/**
 * add current Date
 * @param {Date} data 
 */
const SetDataTimeStamp = (data) => {
    chrome.storage.local.set({ 'timestamp': data }, () => {
        chrome.storage.local.get('timestamp', result => console.log(result));
    })
}

/**
 * get back data of list of website with restriction and timeUsed website
 */
getItemStorage(['list', 'timeused']).then(async(val) => {
    let url = window.location.href;
    let domain = new URL(url);
    console.log(domain)
    console.log(val)

    let result = val.list.find(element => element.url == domain)
    let result2 = val.timeused.find(element => element == domain.origin)

    if (!isNull(result2)) {
        window.location.replace("http://www.w3schools.com");
    }

    if (!isNull(result)) {
        time = result.time.split('h').map(Number)
        let hour = time[0]
        let minute = time[1]
        let converted_time = (hour * 3600 + minute * 60) * 1000
        console.log(converted_time / 1000)
        let i = 0
        setInterval(() => {
            if (isVisible) {
                i++
                console.log(i)
            }
            if (i == (converted_time / 1000)) {
                window.location.replace("http://www.w3schools.com");
                addTimeUsed(domain)
            }
        }, 1000)
    }
})

/**
 * if user isn't on the page restricted
 */
document.addEventListener('visibilitychange', function(event) {
    if (document.hidden) {
        isVisible = false
    } else {
        isVisible = true
    }
});

/**
 * if restriction website list changed
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes.list.newValue)
});

/**
 * Each day reset timeUsed
 * Create timeStamp Object, if he doesn't exist
 */
chrome.storage.local.get('timestamp', function(result) {
    let currentDay = new Date().getDate()

    if (result.timestamp != currentDay) {
        SetDataTimeStamp(currentDay)
        deleteTimeUsed()
    }
    if (Object.entries(result).length === 0) {
        SetDataTimeStamp(currentDay)
    }
});

/**
 * Create TimeUsed Object, if he doesn't exist
 */
chrome.storage.local.get('timeused', function(result) {
    console.log(result)
    if (Object.entries(result).length === 0) {
        chrome.storage.local.set({ 'timeused': [] }, () => {
            chrome.storage.local.get('timeused', result => console.log(result));
        })
    }
});