// 読み込まれた時
document.addEventListener("DOMContentLoaded", async function () {
  const currentTab = await getCurrentTab();
  let tabs = await getStorageTabs();

  if (isAddedTab(tabs, currentTab)) {
    const currentRootTab = findCurrentRootTab(tabs, currentTab); 
    document.getElementById("redirect-to-root").innerHTML = currentRootTab.title;
    document.getElementById("root-fav-icon").src = currentRootTab.favIconUrl;
  } else {
    document.getElementById("redirect-to-root").innerHTML = "none";
    document.getElementById("root-fav-icon").src = '';
  }
});

// 遷移ボタンを押された時
document.getElementById('redirect-to-root').onclick = async function () {
  const currentTab = await getCurrentTab();
  let tabs = await getStorageTabs();

  if (isAddedTab(tabs, currentTab)) {
    chrome.tabs.sendMessage(currentTab.id, {type: 'redirect', url: findCurrentRootTab(tabs, currentTab).url});
  } else {
    console.log("not sei")
  }
}

// 追加ボタンを押された時
document.getElementById('add-to-tab').onclick = async function () {
  const currentTab = await getCurrentTab();
  let tabs = await getStorageTabs();

  if (isAddedTab(tabs, currentTab)) {
    removeTab(tabs, currentTab)
    document.getElementById("redirect-to-root").innerHTML = "none";
    document.getElementById("root-fav-icon").src = '';
  } else {
    tabs.push(currentTab);
    const currentRootTab = findCurrentRootTab(tabs, currentTab); 
    document.getElementById("redirect-to-root").innerHTML = currentRootTab.title;
    document.getElementById("root-fav-icon").src = currentRootTab.favIconUrl;
  }
  chrome.storage.sync.set({ tabs: tabs });
}

function getCurrentTab() {
  return new Promise( resolve => {
    chrome.tabs.getSelected(window.id, function (currentTab) { 
      resolve(currentTab);
    });
  });
}

function getStorageTabs() {
  return new Promise(resolve => {
    chrome.storage.sync.get(["tabs"], function (items) {
      let tabs = [];

      if (items.tabs !== undefined && items.tabs.length > 0) {
        Array.prototype.push.apply(tabs, items.tabs);
      }
      resolve(tabs);
    });
  });
}

function findCurrentRootTab(tabs, currentTab) {
  return tabs.find( tab => {
    return tab.id === currentTab.id;
  })
}

function isAddedTab(tabs, currnentTab) {
  const tabIds = tabs.map( tab => {
    return tab.id;
  })
  return tabIds.includes(currnentTab.id);
}

function removeTab(tabs, currentTab) {
  tabs.forEach((val, index) => {
    if(val.id === currentTab.id) {
      tabs.splice(index, 1);
    }
  })
}
