const showList = document.querySelector(".showList");
const btnGroup = document.querySelector(".button-group");
const btnGroupBtn = document.querySelectorAll(".button-group .btn");
const search = document.querySelector(".search-group");
const cropInput = document.querySelector("#crop");
const select = document.querySelector(".sort-select");
const toSort = document.querySelector(".toSort");
const sortAdvanced = document.querySelector(".js-sort-advanced");
const URL = "https://hexschool.github.io/js-filter-data/data.json";

let data = [];
let filteredData = [];

// 取得API資料 
function getData() {
    axios.get(URL)
        .then(function (response) {
            console.log(data)
            data = response.data.filter(function (item) {
                return item.作物名稱 && item.種類代碼.trim() && item.交易量 !== 0;
            });
        })
        .catch(function (error) {
            console.log(error)
        });
};
getData();

// 資料渲染畫面
function renderData(toShow) {
    let showInfo = "";
    toShow.forEach(function (item) {
        showInfo += `
        <tr>
            <td>${item.作物名稱}</td>
            <td>${item.市場名稱}</td>
            <td>${item.上價}</td>
            <td>${item.中價}</td>
            <td>${item.下價}</td>
            <td>${item.平均價}</td>
            <td>${item.交易量}</td>
        </tr>
        `
    });
    showList.innerHTML = showInfo;
};

// 資料對應tab + tab active
btnGroup.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
        btnGroupBtn.forEach(function (item) {
            item.classList.remove("active");
        });
        e.target.classList.add("active");
        let tab = e.target.getAttribute("data-type");
        // if (tab === "N04") {
        //     filteredData = data.filter(function (item) {
        //         return item.種類代碼 === "N04";
        //     });
        // } else if (tab === "N05") {
        //     filteredData = data.filter(function (item) {
        //         return item.種類代碼 === "N05";
        //     });
        // } else if (tab === "N06") {
        //     filteredData = data.filter(function (item) {
        //         return item.種類代碼 === "N06";
        //     });
        // };
        // renderData(filteredData);   
        changetab(tab);
    };
});

function changetab(tab) {
    filteredData = data.filter(function (item) {
        return item.種類代碼 === tab;
    });
    renderData(filteredData);
};

// 作物名稱搜尋
search.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
        if (cropInput.value.trim() === "") {
            alert("請輸入查詢項目!");
            return;
        };
        filteredData = data.filter(function (item) {
            // 若item.作物名稱= null/undefined，則返回undefined;若有值，再確認輸入內容是否有對應的值
            // return item.作物名稱?.match(cropInput.value)
            return item.作物名稱.match(cropInput.value);
        });
        // 查無相關作物時，顯示相關訊息
        if (filteredData.length === 0) {
            showList.innerHTML = `<tr><td colspan="7" class="text-center p-5">找不到相關資料Q_Q</td></tr>`
        } else {
            renderData(filteredData);
            cropInput.value = "";
        };
        // 取消btnGroup內btn active樣式
        btnGroupBtn.forEach(function (item) {
            item.classList.remove("active");
        });
        // 取消select排序篩選
        select.value = "排序篩選";
    };
});

// 排序篩選
// select.addEventListener("filterData", function (e) {
//     switch (e.target.value) {
//         case "依上價排序":
//             selectfilterData("上價");
//             break;
//         case "依中價排序":
//             selectfilterData("中價");
//             break;
//         case "依下價排序":
//             selectfilterData("下價");
//             break;
//         case "依平均價排序":
//             selectfilterData("平均價");
//             break;
//         case "依交易量排序":
//             selectfilterData("交易量");
//             break;
//     };
// });
select.addEventListener("change", function (e) {
    if (filteredData.length === 0) {
        alert("請先選擇作物分類!");
    } else if (e.target.value === "排序篩選") {
        toSort.setAttribute("disabled", "disabled");
    } else if (e.target.value === "依上價排序") {
        selectfilterData("上價");
    } else if (e.target.value === "依中價排序") {
        selectfilterData("中價");
    } else if (e.target.value === "依下價排序") {
        selectfilterData("下價");
    } else if (e.target.value === "依平均價排序") {
        selectfilterData("平均價");
    } else if (e.target.value === "依交易量排序") {
        selectfilterData("交易量");
    };
});

function selectfilterData(value) {
    filteredData.sort(function (a, b) {
        return b[value] - a[value];
    });
    renderData(filteredData);
};

// 進階排序資料
sortAdvanced.addEventListener("click", function (e) {
    if (e.target.nodeName === "I") {
        let sortPrice = e.target.getAttribute("data-price");
        let sortIcon = e.target.getAttribute("data-sort");
        if (sortIcon === "up") {
            filteredData.sort(function (a, b) {
                return b[sortPrice] - a[sortPrice];
            });
        } else {
            filteredData.sort(function (a, b) {
                return a[sortPrice] - b[sortPrice];
            });
        };

        // 連動下拉式選單更改排序的value
        switch (sortPrice) {
            case "上價":
                select.value = "依上價排序";
                break;
            case "中價":
                select.value = "依中價排序";
                break;
            case "下價":
                select.value = "依下價排序";
                break;
            case "平均價":
                select.value = "依平均價排序";
                break;
            case "交易量":
                select.value = "依交易量排序";
                break;
        }
        renderData(filteredData);
    };
});