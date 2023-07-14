const URL = "https://hexschool.github.io/js-filter-data/data.json";
const showList = document.querySelector(".showList");
const btnGroup = document.querySelector(".button-group");
const cropInput = document.querySelector("#crop");
const searchBtn = document.querySelector(".search-btn");
const select = document.querySelector(".sort-select");
const sortAdvanced = document.querySelector(".js-sort-advanced");

let data = [];
let filterData = [];

// 取得API資料
function getData() {
    axios.get(URL)
        .then(function (response) {
            data = response.data;
            render(data);
        })
        .catch(function (error) {
            console.log(error)
        })
}
getData();

// 資料渲染畫面
function render(toShow) {
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

// tab active
btnGroup.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
        let btn = document.querySelectorAll(".button-group .btn");
        btn.forEach(function (item) {
            item.classList.remove("active");
        });
        e.target.classList.add("active");
        // 對應資料
        const tab = e.target.getAttribute("data-type");
        change(tab);
    };
});

// + 對應資料-模組化
function change(tab) {
    filterData = data.filter(function (item) {
        return item.種類代碼 === tab
    });
    render(filterData);
};

// 輸入框搜尋
searchBtn.addEventListener("click", function (e) {
    if (cropInput.value.trim() === "") {
        alert("請輸入要搜尋的作物名稱");
        return;
    };
    filterData = data.filter(function (item) {
        return item.作物名稱?.match(cropInput.value);
    });
    if (filterData.length === 0) {
        showList.innerHTML = `
        <tr><td colspan="7" class="p-5 text-center">找不到相關的資料唷Q_Q</td></tr>
        `
    } else {
        render(filterData);
    };
});

// 下拉選單
select.addEventListener("change", function (e) {
    switch (e.target.value) {
        case "依上價排序":
            sort("上價");
            break;
        case "依中價排序":
            sort("中價");
            break;
        case "依下價排序":
            sort("下價");
            break;
        case "依平均價排序":
            sort("平均價");
            break;
        case "依交易量排序":
            sort("交易量");
            break;
    };
});

function sort(value) {
    const toSort = document.querySelector(".toSort").setAttribute("disabled", "disabled");
    filterData = data.sort(function (a, b) {
        return a[value] - b[value]
    });
    render(filterData);
};

// 進階排序資料
sortAdvanced.addEventListener("click", function (e) {
    if (e.target.nodeName === "I") {
        const dataPrice = e.target.getAttribute("data-price");
        const dataSort = e.target.getAttribute("data-sort");
        if (dataSort === "up") {
            filterData = data.sort(function (a, b) {
                return b[dataPrice] - a[dataPrice]
            });
        } else {
            filterData = data.sort(function (a, b) {
                return a[dataPrice] - b[dataPrice]
            });
        };
        render(filterData);
    };
});