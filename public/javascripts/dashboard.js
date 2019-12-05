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

let fBeerType = document.getElementById('beerType');
let fBeerFlavour = document.getElementById('beerFlavour');
let fBeerTexture = document.getElementById('beerTexture');
let fBeerGrade = document.getElementById('beerGrade');

let fillBatchFlag = 0;

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
    console.log('Fetching Batch data by ID...', id);
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

    fillBatchFlag = 1;
}

const sendForm = async () => {
    //console.log('THE VALUE OF BEER TYPE IS: ', fBeerType.value);
    console.log('POST Form to API...');

    if (fillBatchFlag == 1) {
        if (fBeerType.value != '' && fBeerFlavour.value != '' && fBeerTexture.value != '' && fBeerGrade != '') {
            const data = {
                type: fBeerType.value,
                flavour: fBeerFlavour.value,
                texture: fBeerTexture.value,
                grade: fBeerGrade.value
            };
            const params = {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                method: 'POST'
            }
            console.log(JSON.stringify(data));
            fetch(`/brewing/results/${bBeerBatch.innerHTML}`, params).then(function(response) {
                return response.json();
            }).then(function(json) {
                console.log('Response from Form POST: ', json);
            });
            
        } else console.log('Forms values are blank, fill them');
    } else console.log('You need to select a batch first');  
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
