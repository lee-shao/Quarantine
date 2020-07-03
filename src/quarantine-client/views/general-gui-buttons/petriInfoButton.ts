import {GuiElement} from '../guiElement'
import { PopupWindow } from "../popupWindow";
/**
 * Factory which generates the the rules button which opens the
 * petri net's info scene.
 * @see GuiScene
 * @author Hien
 */

 export class PetriInfoButton extends GuiElement{
    private petriInfoBtn: Phaser.GameObjects.Sprite;
    public create(): PetriInfoButton {
        this.petriInfoBtn = this.scene.add.sprite(this.scene.game.renderer.width - 50, 50, 'information');
        this.petriInfoBtn.setInteractive();

        //Change the button textures on hover, press, etc.
        this.petriInfoBtn.on('pointerover', () => {
            this.petriInfoBtn.setScale(this.scaling);
        });
        this.petriInfoBtn.on('pointerout', () => {
            this.petriInfoBtn.setScale(1);
        });
        this.petriInfoBtn.on('pointerdown', () => {
            this.petriInfoBtn.setScale(1);
        });
        // Open popup window
        this.petriInfoBtn.on('pointerup',() => {
            if(!this.scene.mainSceneIsPaused){
                const popupInfo = new PopupWindow(this.scene, 0, 0, '', 1400, 50, true, [], false);
                const title = this.scene.add.text(450, 50, 'Petri net', { color: 'Black', fontStyle: 'bold', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setDepth(1);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(1200, 970);
                const content = this.scene.add.container(450,100);

                /*
                //BEGIN: Add content into petri popup
                //For example:
                content.add(new Phaser.GameObjects.Text(this.scene,450, 100, 'example content 1', { color: 'Black', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setDepth(1));
                content.add(new Phaser.GameObjects.Text(this.scene,450, 150, 'example content 2', { color: 'Black', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setDepth(1));
                //END: Add content into petri popup
                */

               content.add(new Phaser.GameObjects.Text(this.scene, 0, 100, 'The Petri net helps you to understand the Population Protocol, \nwhich simulates the spread of the virus in the background. \n\nThe places represent the states in which a person can find himself \n(e.g. infected) or which role he plays (e.g. police officer). \n\nThe colored bubbles within the places put the number of these \npeople in relation to the population of the country. They change \nover time depending on how fast the virus spreads or what actions \nyou take. If you hover over the bubbles, the exact number of people \nin that state will be displayed. \n\nThe transitions in the Petri net illustrate how a person´s state \nchanges as time passes or as he interacts with another person.', { color: 'Black', fontSize: '35px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setDepth(1));


                popupInfo.addGameObjects([blankNode, title, content]);
                popupInfo.createModal();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        })
        return this;
    }

    /** @returns Phaser.GameObjects.Image of petri net's info button */
    public getInfoButton(): Phaser.GameObjects.Image {return this.petriInfoBtn}
 }