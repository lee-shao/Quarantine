import { GuiElement } from "../guiElement";

/**
 * Factory which generates the the sound buttons to toogle
 * the sound and music on and off.
 * @see GuiScene
 * @author Stagnum
 * @author Sebastian Führ
 */
export class SoundButtons extends GuiElement {

    /** Create and add the sound and music buttons to the GuiScene */
    public create(): void {
        const musicOn = this.scene.add.sprite(this.scene.game.renderer.width - 100, 250, 'music_on').setInteractive();
        const soundOn = this.scene.add.sprite(this.scene.game.renderer.width - 100, 350, 'sound_on').setInteractive();

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
        });

        soundOn.on('pointerup', () => {
            if (this.scene.soundON) {
                // changes img and reset soundON atribute
                soundOn.setTexture('sound_off');
                this.scene.soundON = false;
            } else {
                // changes img and reset soundON atribute
                soundOn.setTexture('sound_on');
                this.scene.soundON = true;
            }
        });
    }

}