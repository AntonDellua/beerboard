let bBeerBatch = document.getElementById('bBeerBatchContainer');
let bDate = document.getElementById('bDateContainer');
let bStartedAt = document.getElementById('bStartedAtContainer');
let bFinishedAt = document.getElementById('bFinishedAtContainer');
let bTotalTime = document.getElementById('bTotalTimeContainer');
let bAverageTemp = document.getElementById('bAverageTempContainer');
let bHighestTemp = document.getElementById('bHighestTempContainer');
let bLowestTemp = document.getElementById('bLowestTempContainer');
let bBeerType = document.getElementById('bBeerTypeContainer');
let bFlavour = document.getElementById('bFlavourContainer');
let bTexture = document.getElementById('bTextureContainer');
let bGrade = document.getElementById('bGradeContainer');

//let ex1;

const fetchIDS = async () => {
    console.log('Fetching Batch Ids...');
    const response = await fetch('/brewing');
    const json = await response.json();
    const dropdown = $('#dropdown-batch');

    json.forEach(id => {
        console.log('ID: ', id);
        //batchIDS.append(id);
        dropdown.append(`<a class="dropdown-item" href="javascript:fillBatch('${id}')">` + id + '</a>');
    });
    //console.log('Batch IDS: ', batchIDS);
}

const fillBatch = async (id) => {
    console.log('Fetching Batch data by ID...');
    const response = await fetch(`/brewing/all/${id}`);
    const json = await response.json();

    bBeerBatch.innerHTML = json.batch;
    bDate.innerHTML = json.date;
    bStartedAt.innerHTML = json.started;
    bFinishedAt.innerHTML = json.finished;
    bTotalTime.innerHTML = json.total;
    bAverageTemp.innerHTML = json.avg;
    bHighestTemp.innerHTML = json.high;
    bLowestTemp.innerHTML = json.low;
    bBeerType.innerHTML = json.type;
    bFlavour.innerHTML = json.flavour;
    bTexture.innerHTML = json.texture;
    bGrade.innerHTML = json.grade;
}

$(document).ready(function(){
    $(".sideMenuToggler").on("click", function() {
        $(".wrapper").toggleClass("active");
    });

    var adjustSidebar = function() {
        $(".sidebar").slimScroll({
            height: document.documentElement.clientHeight - $(".navbar").outerHeight()
        });
    };

    adjustSidebar();
    $(window).resize(function() {
        adjustSidebar();
    });
});

console.log('Hello from dashboard.js');
fetchIDS();
