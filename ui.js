function updateUI(){

    if(scoreText){

        scoreText.setText("Skor: " + QUEST.score);

    }

    if(inventoryText){

        if(QUEST.inventory.length === 0){

            inventoryText.setText("Tas: kosong");

        }else{

            inventoryText.setText(
                "Tas: " + QUEST.inventory.join(", ")
            );

        }

    }

    if(missionText){

        missionText.setText(
            "Misi: " + getMission()
        );

    }

}

function showDialog(text){

    dialogOpen = true;

    dialogBox.setVisible(true);

    dialogText.setVisible(true);

    dialogText.setText(text);

    showMove(false);

}

function hideDialog(){

    dialogOpen = false;

    dialogBox.setVisible(false);

    dialogText.setVisible(false);

    showMove(true);

}