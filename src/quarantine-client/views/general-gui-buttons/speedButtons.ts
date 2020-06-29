import { MainScene } from "../scenes/main-scene";
import { ChartScene } from "../tablet/chart-scene";
import { MapScene } from "../tablet/map-scene";
import { TimeController } from "../../controller/timeController";
import { GuiElement } from "../guiElement";
import { PopupWindow } from "../popupWindow";
import { Tablet } from "../tablet/tablet";

/**
 * Factory which generates the game speed buttons.
 * @see GuiScene
 * @see TimeController
 * @author Hien
 * @author Sebastian Führ
 */
export class GameSpeedButtons extends GuiElement {

    private gameSpeedButtons: Phaser.GameObjects.Image[];

    /**
     * Creates the following buttons and adds them to the GuiScene:  
     * * pause
     * * slow speed
     * * normal speed
     * * faster speed
     * * the fastest speed
     */
    public create(): GameSpeedButtons {
        this.gameSpeedButtons = [this.addPauseButton(), 
        this.addButtonResume(),
        this.addSpeedButtonNormal(),
        this.addSpeedButtonQuicker(),
        this.addSpeedButtonQuickest()]
        return this;
    }

    private addPauseButton(): Phaser.GameObjects.Image {
        const pause = this.scene.add.image(this.scene.game.renderer.width / 2 + 150, 50, 'pause').setInteractive();

        pause.on('pointerover', () => {
            pause.setScale(0.7);
        });

        pause.on('pointerout', () => {
            pause.setScale(1);
        });

        pause.on('pointerup', () => {
            if (!this.scene.mainSceneIsPaused) {
                const main = this.scene.scene.get('MainScene') as MainScene;
                const chart = this.scene.scene.get('ChartScene') as ChartScene;
                const map = this.scene.scene.get('MapScene') as MapScene;
                main.scene.pause();
                chart.scene.pause();
                map.scene.pause();
                this.scene.mainSceneIsPaused = true;
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }
        });

        return pause;
    }

    private addButtonResume(): Phaser.GameObjects.Image {
        const resume = this.scene.add.image(this.scene.game.renderer.width / 2 + 250, 50, 'resume-button').setInteractive();

        resume.on('pointerover', () => {
            resume.setScale(0.7);
        });

        resume.on('pointerout', () => {
            resume.setScale(1);
        });

        resume.on('pointerup', () => {
            if (this.scene.mainSceneIsPaused) {
                const chart = this.scene.scene.get('ChartScene') as ChartScene;
                const map = this.scene.scene.get('MapScene') as MapScene;
                const main = this.scene.scene.get('MainScene') as MainScene;
                main.scene.resume();
                chart.scene.resume();
                map.scene.resume();
                this.scene.showBtns();
                this.scene.mainSceneIsPaused = false;
                /** Only wake up the scenes if they were prviously displayed in the tablet */
                if (!Tablet.instance.getChartSceneIsSleeping()) chart.scene.wake();
                if (!Tablet.instance.getMapSceneIsSleeping()) map.scene.wake();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }
        });
        return resume;
    }

    private addSpeedButtonNormal(): Phaser.GameObjects.Image {
        const speed1x = this.scene.add.image(this.scene.game.renderer.width / 2 + 350, 50, 'speed1x').setInteractive();

        speed1x.on('pointerover', () => {
            speed1x.setScale(0.7);
        });

        speed1x.on('pointerout', () => {
            speed1x.setScale(1);
        });

        speed1x.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                this.scene.gameSpeed = 1;
                TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });
        return speed1x;
    }

    private addSpeedButtonQuicker(): Phaser.GameObjects.Image {
        const speed2x = this.scene.add.image(this.scene.game.renderer.width / 2 + 450, 50, 'speed2x').setInteractive();

        speed2x.on('pointerover', () => {
            speed2x.setScale(0.7);
        });

        speed2x.on('pointerout', () => {
            speed2x.setScale(1);
        });

        speed2x.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                this.scene.gameSpeed = 1.5;
                TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });
        return speed2x;
    }

    private addSpeedButtonQuickest(): Phaser.GameObjects.Image {
        const speed3x = this.scene.add.image(this.scene.game.renderer.width / 2 + 550, 50, 'speed3x').setInteractive();

        speed3x.on('pointerover', () => {
            speed3x.setScale(0.7);
        });

        speed3x.on('pointerout', () => {
            speed3x.setScale(1);
        });

        speed3x.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                this.scene.gameSpeed = 2;
                TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });
        return speed3x;
    }

    /** @returns Phaser.GameObjects.Image[] of game speed buttons */
    public getGameSpeedButtons(): Phaser.GameObjects.Image[] {return this.gameSpeedButtons}
}