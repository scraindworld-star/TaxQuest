function makeTree(scene, x, y){
  add(scene.add.rectangle(x, y + 38, 24, 58, 0x8d6e63));
  add(scene.add.circle(x, y, 42, 0x2e7d32));
  add(scene.add.circle(x - 25, y + 10, 32, 0x388e3c));
  add(scene.add.circle(x + 25, y + 10, 32, 0x388e3c));
}

function drawOutside(scene){
  currentMap = "outside";
  clearWorld();

  add(scene.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0x7ec850));
  add(scene.add.rectangle(config.width/2, config.height-170, config.width, 110, 0xc2a878));
  add(scene.add.rectangle(config.width/2, config.height/2, 90, config.height, 0xc2a878));

  add(scene.add.rectangle(config.width/2, 160, 260, 150, 0xf7f7f7));
  add(scene.add.rectangle(config.width/2, 80, 280, 35, 0x2f6f4e));
  add(scene.add.text(config.width/2-50, 65, "KPP", {font:"28px Arial", color:"#fff"}));
  add(scene.add.rectangle(config.width/2-70, 145, 38, 35, 0x90caf9));
  add(scene.add.rectangle(config.width/2+70, 145, 38, 35, 0x90caf9));
  add(scene.add.rectangle(config.width/2, 218, 58, 75, 0x8d6e63));

  makeTree(scene, 55, 120);
  makeTree(scene, config.width-55, 120);
  makeTree(scene, 55, config.height-330);
  makeTree(scene, config.width-55, config.height-330);

  npc = createNPC(scene, config.width/2+155, 350, 0xffc107);
  add(npc);
  add(scene.add.text(config.width/2+115, 380, "Petugas", {
    font:"14px Arial",
    color:"#fff",
    backgroundColor:"#000"
  }));

  player = createNPC(scene, config.width/2, config.height-170, 0x1565c0);
  add(player);

  showMove(true);
}

function drawInside(scene){
  currentMap = "inside";
  clearWorld();

  add(scene.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0xf5f1e8));
  add(scene.add.rectangle(config.width/2, 95, config.width-40, 70, 0x2f6f4e));
  add(scene.add.text(config.width/2-115, 72, "KANTOR PAJAK", {font:"26px Arial", color:"#fff"}));

  add(scene.add.rectangle(config.width/2, 220, config.width-90, 100, 0xd7ccc8));
  add(scene.add.rectangle(config.width/2, 190, config.width-120, 34, 0x8d6e63));
  add(scene.add.text(config.width/2-60, 172, "LOKET SPT", {font:"20px Arial", color:"#fff"}));

  add(scene.add.rectangle(config.width/2-120, 330, 90, 70, 0xffffff));
  add(scene.add.text(config.width/2-150, 315, "Meja 1", {font:"16px Arial", color:"#000"}));

  add(scene.add.rectangle(config.width/2+120, 330, 90, 70, 0xffffff));
  add(scene.add.text(config.width/2+90, 315, "Meja 2", {font:"16px Arial", color:"#000"}));

  add(scene.add.rectangle(config.width/2, config.height-90, 95, 95, 0x8d6e63));
  add(scene.add.text(config.width/2-35, config.height-145, "PINTU", {
    font:"16px Arial",
    color:"#fff",
    backgroundColor:"#000"
  }));

  npc = createNPC(scene, config.width/2, 285, 0xffc107);
  add(npc);
  add(scene.add.text(config.width/2-45, 320, "Petugas SPT", {
    font:"14px Arial",
    color:"#fff",
    backgroundColor:"#000"
  }));

  player = createNPC(scene, config.width/2, config.height-180, 0x1565c0);
  add(player);

  showMove(true);
}
function drawHouse(scene){

    currentMap = "house";

    clearWorld();

    add(scene.add.rectangle(
        config.width/2,
        config.height/2,
        config.width,
        config.height,
        0xd7ccc8
    ));

    add(scene.add.text(
        config.width/2-80,
        60,
        "RUMAH",
        {
            font:"28px Arial",
            color:"#000"
        }
    ));

    add(scene.add.rectangle(
        config.width/2,
        220,
        160,
        80,
        0x8d6e63
    ));

    add(scene.add.text(
        config.width/2-45,
        210,
        "MEJA",
        {
            font:"18px Arial",
            color:"#fff"
        }
    ));

    player = createNPC(
        scene,
        config.width/2,
        config.height-170,
        0x1565c0
    );

    add(player);

}