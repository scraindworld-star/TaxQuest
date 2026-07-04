const NPC = {

    outside: {

        name: "Petugas Pajak",

        x: 0,

        y: 0

    },

    inside: {

        name: "Petugas SPT",

        x: 0,

        y: 0

    }

};

function createNPC(scene, x, y, color){

    const npc = scene.add.container(x, y);

    npc.add(scene.add.circle(0, -22, 13, 0xffcc80));

    npc.add(scene.add.rectangle(0, 5, 30, 40, color));

    npc.add(scene.add.rectangle(-10, 32, 8, 22, 0x263238));

    npc.add(scene.add.rectangle(10, 32, 8, 22, 0x263238));

    return npc;

}