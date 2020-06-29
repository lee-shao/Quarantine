import { GuiElement } from "../guiElement";
import { PopupWindow } from "../popupWindow";

/**
 * Factory which generates the the sound buttons to toogle
 * the sound and music on and off.
 * @see GuiScene
 * @author Stagnum
 * @author Sebastian Führ
 */
export class SoundButtons extends GuiElement {

    private soundButtons: Phaser.GameObjects.Image[];

    /** Create and add the sound and music buttons to the GuiScene */
    public create(): SoundButtons {
        const musicOn = this.scene.add.image(this.scene.game.renderer.width - 100, 250, 'music_on').setInteractive();
        const soundOn = this.scene.add.image(this.scene.game.renderer.width - 100, 350, 'sound_on').setInteractive();

        musicOn.on('pointerover', () => {
            musicOn.setScale(0.7);
        });

        musicOn.on('pointerout', () => {
            musicOn.setScale(1);
        });

        soundOn.on('pointerover', () => {
            soundOn.setScale(0.7);
        });

        soundOn.on('pointerout', () => {
            soundOn.setScale(1);
        });

        musicOn.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                if (this.scene.musicON) {
                    // method to turn off music should be here
                    this.scene.inGameMusic.pause(); //.setMute(true);
                    // changes img and reset musicON atribute
                    musicOn.setTexture('music_off');
                    this.scene.musicON = false;
                } else {
                    // method to turn on music should be here
                    this.scene.inGameMusic.resume(); //.setMute(false);
                    // changes img and reset musicON atribute
                    musicOn.setTexture('music_on');
                    this.scene.musicON = true;
                }
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });

        soundOn.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                if (this.scene.soundON) {
                    // changes img and reset soundON atribute
                    soundOn.setTexture('sound_off');
                    this.scene.soundON = false;
                } else {
                    // changes img and reset soundON atribute
                    soundOn.setTexture('sound_on');
                    this.scene.soundON = true;
                }
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });

        this.soundButtons = [musicOn, soundOn];
        return this;
    }

    /** @returns Phaser.GameObjects.Image[] of sound buttons */
    public getSoundButtons(): Phaser.GameObjects.Image[] { return this.soundButtons; }

}