/*
[Script]
groupPanel = type=generic,timeout=10,script-path= https://raw.githubusercontent.com/fishingworld/something/main/groupPanel.js,argument=icon=network&color=#86abee&group=Master
  对应参数：
	icon：图标
	color：图标颜色
	group：策略组名称
[Panel]
groupPanel = script-name=groupPanel,update-interval=5
*/



;(async () => {
  // 固定参数
  const group = "𝓟𝓻𝓸𝔁𝔂"; // 策略组名称
  const icon = "pc"; // 图标
  const color = "#cc99cc"; // 图标颜色

  try {
    let proxy = await httpAPI("/v1/policy_groups");
    let groupName = (await httpAPI("/v1/policy_groups/select?group_name=" + encodeURIComponent(group))).policy;
    let proxyName = [];
    let arr = proxy[group];
    let allGroup = Object.keys(proxy);

    for (let i = 0; i < arr.length; ++i) {
      proxyName.push(arr[i].name);
    }

    let index = proxyName.indexOf(groupName);

    if ($trigger === "button") {
      index = (index + 1) % arr.length;
      $surge.setSelectGroupPolicy(group, proxyName[index]);
    }

    let name = proxyName[index];
    let secondName;
    let rootName = name;

    if (allGroup.includes(rootName)) {
      secondName = (await httpAPI("/v1/policy_groups/select?group_name=" + encodeURIComponent(rootName))).policy;
      name = name + " ➟ " + secondName;
    }

    while (allGroup.includes(rootName) && rootName !== secondName) {
      let tempName = (await httpAPI("/v1/policy_groups/select?group_name=" + encodeURIComponent(rootName))).policy;
      if (tempName === rootName) break;
      rootName = tempName;
    }

    $done({
      title: group,
      content: name,
      icon: icon,
      "icon-color": color,
    });
  } catch (error) {
    $done({
      title: "Error",
      content: error.toString(),
      icon: "exclamationmark.triangle",
      "icon-color": "#FF0000",
    });
  }
})();

function httpAPI(path = "", method = "GET", body = null) {
  return new Promise((resolve) => {
    $httpAPI(method, path, body, (result) => {
      resolve(result);
    });
  });
}
