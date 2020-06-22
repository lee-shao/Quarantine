import { MainScene } from "../scenes/main-scene";
import { ChartScene } from "../scenes/chart-scene";
import { MapScene } from "../scenes/map-scene";
import { TimeController } from "../../controller/timeController";
import { GuiElement } from "../guiElement";

/**
 * Factory which generates the game speed buttons.
 * @see GuiScene
 * @see TimeController
 * @author Hien
 * @author Sebastian Führ
 */
export class GameSpeedButtons extends GuiElement {

    /**
     * Creates the following buttons and adds them to the GuiScene:  
     * * pause
     * * slow speed
     * * normal speed
     * * faster speed
     * * the fastest speed
     */
    public create(): void {
        this.addPauseButton();
        this.addSpeedButtonSlow();
        this.addSpeedButtonNormal();
        this.addSpeedButtonQuicker();
        this.addSpeedButtonQuickest();
    }

    private addPauseButton(): void {
        const pause = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 150, 50, 'pause').setInteractive();

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
    }

    private addSpeedButtonSlow(): void {
        const resume = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 250, 50, 'resume-button').setInteractive();

        resume.on('pointerover', () => {
            resume.setScale(0.7);
        });

        resume.on('pointerout', () => {
            resume.setScale(1);
        });

        resume.on('pointerup', () => {
            if (this.scene.mainSceneIsPaused) {
                const main = this.scene.scene.get('MainScene') as MainScene;
                const chart = this.scene.scene.get('ChartScene') as ChartScene;
                const map = this.scene.scene.get('MapScene') as MapScene;
                main.scene.resume();
                chart.scene.resume();
                map.scene.resume();
                this.scene.mainSceneIsPaused = false;
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }
        });
    }

    private addSpeedButtonNormal(): void {
        const speed1x = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 350, 50, 'speed1x').setInteractive();

        speed1x.on('pointerover', () => {
            speed1x.setScale(0.7);
        });

        speed1x.on('pointerout', () => {
            speed1x.setScale(1);
        });

        speed1x.on('pointerup', () => {
            this.scene.gameSpeed = 1;
            TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
    }

    private addSpeedButtonQuicker(): void {
        const speed2x = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 450, 50, 'speed2x').setInteractive();

        speed2x.on('pointerover', () => {
            speed2x.setScale(0.7);
        });

        speed2x.on('pointerout', () => {
            speed2x.setScale(1);
        });

        speed2x.on('pointerup', () => {
            this.scene.gameSpeed = 1.5;
            TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
    }

    private addSpeedButtonQuickest(): void {
        const speed3x = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 550, 50, 'speed3x').setInteractive();

        speed3x.on('pointerover', () => {
            speed3x.setScale(0.7);
        });

        speed3x.on('pointerout', () => {
            speed3x.setScale(1);
        });

        speed3x.on('pointerup', () => {
            this.scene.gameSpeed = 2;
            TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
    }

}