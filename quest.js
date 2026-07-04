const QUEST = {

    step: 0,

    mission: [

        "Temui petugas di luar KPP",

        "Masuk ke KPP",

        "Ambil Formulir SPT",

        "Ambil Bukti Potong",

        "Ambil Data Penghasilan",

        "Isi Formulir SPT",

        "Lapor SPT",

        "Cetak Bukti Penerimaan Elektronik"

    ],

    inventory: [],

    score: 0

};

function getMission(){

    return QUEST.mission[QUEST.step];

}

function nextMission(){

    if(QUEST.step < QUEST.mission.length-1){

        QUEST.step++;

    }

}

function addItem(item){

    if(!QUEST.inventory.includes(item)){

        QUEST.inventory.push(item);

    }

}

function hasItem(item){

    return QUEST.inventory.includes(item);

}

function addScore(value){

    QUEST.score += value;

}