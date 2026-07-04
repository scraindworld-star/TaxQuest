const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#7ec850",
  scene: { create, update }
};

const game = new Phaser.Game(config);

let player, npc;
let currentMap = "outside";
let world = [];
let moveButtons = [];

let up=false, down=false, left=false, right=false;
let dialogOpen=false;
let dialogMode="";
let currentTarget="";

let missionText, inventoryText, scoreText, dialogBox, dialogText;

function create(){
  drawOutside(this);
  createHUD(this);
  createControls();
  updateUI();
}

function update(){
  const speed = dialogOpen ? 0 : 4;

  if(up) player.y -= speed;
  if(down) player.y += speed;
  if(left) player.x -= speed;
  if(right) player.x += speed;

  player.x = Phaser.Math.Clamp(player.x,20,config.width-20);
  player.y = Phaser.Math.Clamp(player.y,20,config.height-20);

  currentTarget = getTarget();
  updateHint();
}

function getTarget(){
  if(currentMap === "outside"){
    if(distance(player,npc) < 90) return "petugas_luar";

    if(
      player.x > config.width/2-120 &&
      player.x < config.width/2+120 &&
      player.y < 280
    ) return "pintu_masuk";
  }

  if(currentMap === "inside"){
    if(distancePoint(player, config.width/2-120, 330) < 110) return "meja1";
    if(distancePoint(player, config.width/2+120, 330) < 110) return "meja2";
    if(distance(player,npc) < 75) return "petugas_spt";

    if(
      player.x > config.width/2-120 &&
      player.x < config.width/2+120 &&
      player.y > config.height-230
    ) return "pintu_keluar";
  }

  return "";
}

function updateHint(){
  if(dialogOpen) return;

  if(hasItem("BPE")){
    missionText.setText("Misi selesai: BPE berhasil diterbitkan");
    return;
  }

  const hints = {
    petugas_luar: "Tekan A untuk bicara dengan petugas",
    pintu_masuk: "Tekan A untuk masuk KPP",
    pintu_keluar: "Tekan A untuk keluar KPP",
    petugas_spt: "Tekan A untuk ambil Data Penghasilan",
    meja1: hasItem("Formulir SPT") ? "Tekan A untuk isi Formulir SPT" : "Tekan A untuk ambil Formulir SPT",
    meja2: "Tekan A untuk lapor SPT"
  };

  missionText.setText(hints[currentTarget] || "Misi: Lengkapi dokumen dan lapor SPT");
}

function press(choice){
  if(dialogOpen){
    handleDialog(choice);
    return;
  }

  if(currentTarget === "petugas_luar"){
    dialogMode = "bukti";
    showDialog(DIALOG.askBuktiPotong);
  }

  if(currentTarget === "pintu_masuk"){
    drawInside(game.scene.scenes[0]);
    updateUI();
  }

  if(currentTarget === "pintu_keluar"){
    drawOutside(game.scene.scenes[0]);
    updateUI();
  }

  if(currentTarget === "petugas_spt"){
    dialogMode = "data";
    showDialog("Petugas SPT:\nData apa yang digunakan untuk menghitung pajak terutang?\n\nA. Data penghasilan\nB. Jumlah followers\nC. Nomor sepatu");
  }

  if(currentTarget === "meja1"){
    meja1Action();
  }

  if(currentTarget === "meja2"){
    submitSPT();
  }
}
function meja1Action(){

  if(!hasItem("Formulir SPT")){
    addItem("Formulir SPT");
    addScore(15);
    updateUI();

    dialogMode="info";

    showDialog(
      "Meja 1:\n\nKamu mengambil Formulir SPT.\n\nItem didapat:\nFormulir SPT\n\nTekan A/B/C untuk menyelesaikan tugas di meja 1."
    );

    return;
  }

  if(!hasItem("Formulir Terisi")){
    dialogMode="form";

    showDialog(
      "FORMULIR SPT\n\nStatus wajib pajak yang sesuai adalah...\n\nA. Orang Pribadi\nB. Alien\nC. Robot"
    );

    return;
  }

  dialogMode="info";

  showDialog(
    "Meja 1\n\nFormulir sudah selesai diisi.\n\nLanjut ke meja 2."
  );

}

function submitSPT(){

  const complete =
      hasItem("Bukti Potong") &&
      hasItem("Data Penghasilan") &&
      hasItem("Formulir SPT") &&
      hasItem("Formulir Terisi");

  if(!complete){

      dialogMode="info";

      showDialog(
`Meja 2

Dokumen belum lengkap.

Butuh:
- Bukti Potong
- Data Penghasilan
- Formulir SPT
- Formulir Terisi`
      );

      return;
  }

  dialogMode="coretax";

  showCoretaxPanel(
      "error",
      "CORETAX ERROR",
      "Mengirim SPT...\n\nERROR 504 Gateway Timeout\n\nServer sedang sibuk.",
      [
        "A. Refresh",
        "B. Tunggu sebentar",
        "C. Hubungi Kring Pajak"
      ]
  );

}

function handleDialog(choice){

  if(dialogMode==="info"){
      hideDialog();
      return;
  }

  if(dialogMode==="bukti"){

      if(choice==="A"){

          addItem("Bukti Potong");
          addScore(10);

          updateUI();

          dialogMode="info";

          showDialog(
`Benar!

Item didapat:
Bukti Potong

Tekan A/B/C untuk menutup.`
          );

      }else{

          showDialog(
DIALOG.wrongBuktiPotong +
"\n\nPilih lagi."
          );

      }

      return;

  }

  if(dialogMode==="data"){

      if(choice==="A"){

          addItem("Data Penghasilan");
          addScore(20);

          updateUI();

          dialogMode="info";

          showDialog(
`Benar!

Item didapat:
Data Penghasilan

Tekan A/B/C untuk menutup.`
          );

      }else{

          showDialog(
`Belum tepat.

Pajak dihitung dari data penghasilan.

Pilih lagi.`
          );

      }

      return;

  }

  if(dialogMode==="form"){

      if(choice==="A"){

          addItem("Formulir Terisi");
          addScore(20);

          updateUI();

          dialogMode="info";

          showDialog(
`Formulir berhasil diisi.

Item didapat:
Formulir Terisi

Silahkan ke meja 2.`
          );

      }else{

          showDialog(
`Jawaban belum benar.

Status yang dipilih adalah:

Orang Pribadi

Silakan pilih lagi.`
          );

      }

      return;

  }
    if(dialogMode==="coretax"){

      if(choice==="A"){

          showCoretaxPanel(
              "error",
              "SERVER BUSY",
              "Refresh gagal.\n\nSistem masih sibuk.\nCoba lebih sabar.",
              [
                "A. Refresh lagi",
                "B. Tunggu sebentar",
                "C. Hubungi Kring Pajak"
              ]
          );

          return;

      }

      if(choice==="B"){

          addItem("BPE");
          addScore(50);
          updateUI();

          dialogMode="finish";

          showCoretaxPanel(
              "success",
              "BPE BERHASIL",
              "SPT berhasil dilaporkan.\n\nNomor BPE:\nBPE-2026-000001\n\nAchievement unlocked:\nCoretax Survivor 🏆",
              [
                "A. Tutup",
                "B. Tutup",
                "C. Tutup"
              ]
          );

          return;

      }

      if(choice==="C"){

          showCoretaxPanel(
              "error",
              "KRING PAJAK",
              "Saran bantuan:\nSilakan coba beberapa saat lagi dan pastikan koneksi stabil.\n\nPilihan paling aman sekarang: tunggu sebentar.",
              [
                "A. Refresh",
                "B. Tunggu sebentar",
                "C. Baca lagi"
              ]
          );

          return;

      }

  }

  if(dialogMode==="finish"){

      closeCoretaxPanel();

      missionText.setText("Misi selesai: TaxQuest tamat");

      return;

  }

}

function createHUD(scene){

  scene.add.rectangle(config.width/2,42,config.width-24,72,0x1b5e20)
    .setAlpha(.88)
    .setDepth(100);

  scene.add.text(
    20,
    16,
    "TaxQuest v2.3",
    {
      font:"22px Arial",
      color:"#fff"
    }
  ).setDepth(101);

  scoreText = scene.add.text(
    config.width-120,
    18,
    "Skor: 0",
    {
      font:"18px Arial",
      color:"#fff"
    }
  ).setDepth(101);

  missionText = scene.add.text(
    20,
    86,
    "Misi: Temui petugas luar",
    {
      font:"16px Arial",
      color:"#fff",
      backgroundColor:"#000"
    }
  ).setDepth(101);

  inventoryText = scene.add.text(
    20,
    116,
    "Tas: kosong",
    {
      font:"15px Arial",
      color:"#fff",
      backgroundColor:"#000"
    }
  ).setDepth(101);

  dialogBox = scene.add.rectangle(
    config.width/2,
    config.height-180,
    config.width-30,
    170,
    0x000000
  )
  .setAlpha(.9)
  .setVisible(false)
  .setDepth(200);

  dialogText = scene.add.text(
    25,
    config.height-250,
    "",
    {
      font:"15px Arial",
      color:"#fff",
      wordWrap:{width:config.width-55}
    }
  )
  .setVisible(false)
  .setDepth(201);

}

function createControls(){

  moveBtn(
    "▲",
    80,
    config.height-235,
    ()=>up=true,
    ()=>up=false
  );

  moveBtn(
    "▼",
    80,
    config.height-105,
    ()=>down=true,
    ()=>down=false
  );

  moveBtn(
    "◀",
    20,
    config.height-170,
    ()=>left=true,
    ()=>left=false
  );

  moveBtn(
    "▶",
    140,
    config.height-170,
    ()=>right=true,
    ()=>right=false
  );

  choiceBtn(
    "A",
    config.width-195,
    config.height-80,
    ()=>press("A")
  );

  choiceBtn(
    "B",
    config.width-125,
    config.height-80,
    ()=>press("B")
  );

  choiceBtn(
    "C",
    config.width-55,
    config.height-80,
    ()=>press("C")
  );

}

function clearWorld(){

  world.forEach(obj => obj.destroy());

  world = [];

}

function add(obj){

  world.push(obj);

  return obj;

}

function distance(a,b){

  return Phaser.Math.Distance.Between(
    a.x,
    a.y,
    b.x,
    b.y
  );

}

function distancePoint(a,x,y){

  return Phaser.Math.Distance.Between(
    a.x,
    a.y,
    x,
    y
  );

}

function choiceBtn(text,x,y,action){

  const b = document.createElement("button");

  b.innerHTML = text;

  b.style.position = "fixed";
  b.style.left = x+"px";
  b.style.top = y+"px";
  b.style.width = "52px";
  b.style.height = "52px";
  b.style.borderRadius = "50%";
  b.style.border = "none";
  b.style.background = text==="A" ? "#c62828" : "#2f6f4e";
  b.style.color = "white";
  b.style.fontSize = "20px";
  b.style.fontWeight = "bold";
  b.style.opacity = ".9";
  b.style.zIndex = "999";

  b.ontouchstart = e => {
    e.preventDefault();
    action();
  };

  b.onclick = e => {
    e.preventDefault();
    action();
  };

  document.body.appendChild(b);

}

function moveBtn(text,x,y,on,onEnd){

  const b = document.createElement("button");

  b.innerHTML = text;

  b.style.position = "fixed";
  b.style.left = x+"px";
  b.style.top = y+"px";
  b.style.width = "56px";
  b.style.height = "56px";
  b.style.borderRadius = "50%";
  b.style.border = "none";
  b.style.background = "#2f6f4e";
  b.style.color = "white";
  b.style.fontSize = "22px";
  b.style.opacity = ".78";
  b.style.zIndex = "999";

  b.ontouchstart = e => {
    e.preventDefault();
    on();
  };

  b.ontouchend = e => {
    e.preventDefault();
    onEnd();
  };

  b.onmousedown = e => {
    e.preventDefault();
    on();
  };

  b.onmouseup = e => {
    e.preventDefault();
    onEnd();
  };

  document.body.appendChild(b);

  moveButtons.push(b);

}

function showMove(show){

  moveButtons.forEach(b => {

    b.style.display = show ? "block" : "none";

  });

}

function showCoretaxPanel(type,title,message,options){

  dialogOpen = true;
  showMove(false);

  dialogBox.setVisible(false);
  dialogText.setVisible(false);

  let old = document.getElementById("coretaxScreen");
  if(old) old.remove();

  const screen = document.createElement("div");
  screen.id = "coretaxScreen";

  screen.style.position = "fixed";
  screen.style.left = "0";
  screen.style.top = "0";
  screen.style.width = "100vw";
  screen.style.height = "100vh";
  screen.style.background = "#f4f7f5";
  screen.style.zIndex = "3000";
  screen.style.fontFamily = "Arial, sans-serif";
  screen.style.color = "#123";
  screen.style.overflow = "auto";

  const isError = type === "error";
  const isSuccess = type === "success";

  const mainTitle = isError ? "STATUS PENGIRIMAN SPT" : "BPE BERHASIL";
  const statusText = isError ? "ERROR 504 Gateway Timeout" : "SPT berhasil dilaporkan";
  const subText = isError ? "Server sedang sibuk." : message;
  const borderColor = isError ? "#c62828" : "#2e7d32";
  const titleColor = isError ? "#b71c1c" : "#1b5e20";
  const icon = isError ? "⚠️" : "✅";
  const progress = isError ? "■■■■□□□□□□" : "■■■■■■■■■■";

  screen.innerHTML = `
    <div style="
      background:#1f6f43;
      color:white;
      padding:18px;
      font-size:24px;
      font-weight:bold;
      text-align:center;
      box-shadow:0 4px 12px rgba(0,0,0,.25);
    ">
      CORETAX
    </div>

    <div style="
      min-height:calc(100vh - 84px);
      display:flex;
      justify-content:center;
      align-items:center;
      padding:28px;
      box-sizing:border-box;
    ">
      <div style="
        width:100%;
        max-width:430px;
        background:white;
        border-radius:24px;
        padding:26px 22px;
        border:3px solid ${borderColor};
        text-align:center;
        box-shadow:0 16px 45px rgba(0,0,0,.25);
        box-sizing:border-box;
      ">

        <div style="font-size:54px;margin-bottom:12px;">
          ${icon}
        </div>

        <div style="
          font-size:24px;
          font-weight:bold;
          margin-bottom:12px;
          color:${titleColor};
        ">
          ${mainTitle}
        </div>

        <div style="
          font-size:18px;
          font-weight:bold;
          margin-bottom:12px;
        ">
          ${statusText}
        </div>

        <div style="
          font-size:16px;
          line-height:1.5;
          white-space:pre-line;
          margin-bottom:22px;
        ">
          ${subText}
        </div>

        <div style="
          background:#e8f5e9;
          border-radius:14px;
          padding:14px;
          font-size:22px;
          letter-spacing:3px;
          margin-bottom:22px;
        ">
          ${progress}
        </div>

        <div id="coretaxButtons"></div>

      </div>
    </div>
  `;

  document.body.appendChild(screen);

  const buttons = document.getElementById("coretaxButtons");

  const labels = isSuccess
    ? ["Tutup"]
    : ["Refresh", "Tunggu sebentar", "Hubungi Kring Pajak"];

  labels.forEach((label,index) => {

    const choice = ["A","B","C"][index] || "A";

    const btn = document.createElement("button");

    btn.innerHTML = isSuccess ? label : choice + ". " + label;

    btn.style.width = "100%";
    btn.style.padding = "14px";
    btn.style.margin = "7px 0";
    btn.style.border = "none";
    btn.style.borderRadius = "14px";
    btn.style.fontSize = "18px";
    btn.style.textAlign = "center";
    btn.style.background = "#2f6f4e";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";

    btn.ontouchstart = e => {
      e.preventDefault();
      handleDialog(choice);
    };

    btn.onclick = e => {
      e.preventDefault();
      handleDialog(choice);
    };

    buttons.appendChild(btn);

  });

}

function closeCoretaxPanel(){

  let screen = document.getElementById("coretaxScreen");

  if(screen){
    screen.remove();
  }

  dialogOpen = false;

  showMove(true);

}