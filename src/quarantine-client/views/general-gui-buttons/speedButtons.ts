import { TimeController } from "../../controller/timeController";
import { GuiElement } from "../guiElement";
import { PopupWindow } from "../popupWindow";

/**
 * Factory which generates the game speed buttons.
 * @see GuiScene
 * @see TimeController
 * @author Hien
 * @author Sebastian Führ
 */
export class GameSpeedButtons extends GuiElement {

    private gameSpeedButtons: Phaser.GameObjects.Image[];

    /** Only existing instance of the time controller singleton */
    private timeController: TimeController;

    /**
     * Creates the following buttons and adds them to the GuiScene:  
     * * pause
     * * slow speed
     * * normal speed
     * * faster speed
     * * the fastest speed
     */
    public create(): GameSpeedButtons {
        this.timeController = TimeController.getInstance();

        this.gameSpeedButtons = [this.addPauseButton(), 
        this.addButtonResume(),
        this.addSpeedButtonNormal(),
        this.addSpeedButtonQuicker()]
        return this;
    }

    private addPauseButton(): Phaser.GameObjects.Image {
        const pause = this.scene.add.image(this.scene.game.renderer.width / 2 + 500, 50, 'pause').setInteractive();

        pause.on('pointerover', () => {
            pause.setScale(this.scaling);
        });

        pause.on('pointerout', () => {
            pause.setScale(1);
        });

        pause.on('pointerup', () => {
            if (!this.scene.mainSceneIsPaused) {
                this.scene.mainSceneIsPaused = true;

                this.exeucteClickAnimation(pause);
                this.timeController.pauseGame();

                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }
        });

        return pause;
    }

    private addButtonResume(): Phaser.GameObjects.Image {
        const resume = this.scene.add.image(this.scene.game.renderer.width / 2 + 600, 50, 'speed1x').setInteractive();
        resume.setScale(0.8);

        resume.on('pointerover', () => {
            resume.setScale(this.scaling);
        });

        resume.on('pointerout', () => {
            resume.setScale(1);
        });

        resume.on('pointerup', () => {
            this.scene.gameSpeed = 0;
            TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);

            if (this.scene.mainSceneIsPaused) {
                this.scene.showBtns();
                this.timeController.resumeGame();
                this.scene.mainSceneIsPaused = false;
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }
            this.exeucteClickAnimation(resume);
        });
        return resume;
    }

    private addSpeedButtonNormal(): Phaser.GameObjects.Image {
        const speed1x = this.scene.add.image(this.scene.game.renderer.width / 2 + 700, 50, 'speed2x').setInteractive();

        speed1x.on('pointerover', () => {
            speed1x.setScale(this.scaling);
        });

        speed1x.on('pointerout', () => {
            speed1x.setScale(1);
        });

        speed1x.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                //this.scene.gameSpeed = 1;
                this.scene.gameSpeed = 1.5;
                TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);

                this.exeucteClickAnimation(speed1x);
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            } else {
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
        const speed2x = this.scene.add.image(this.scene.game.renderer.width / 2 + 800, 50, 'speed3x').setInteractive();

        speed2x.on('pointerover', () => {
            speed2x.setScale(this.scaling);
        });

        speed2x.on('pointerout', () => {
            speed2x.setScale(1);
        });

        speed2x.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                //this.scene.gameSpeed = 1.5;
                this.scene.gameSpeed = 2;
                TimeController.getInstance().setGameSpeed(this.scene.gameSpeed);
                this.exeucteClickAnimation(speed2x);
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

    /** @returns Phaser.GameObjects.Image[] of game speed buttons */
    public getGameSpeedButtons(): Phaser.GameObjects.Image[] {return this.gameSpeedButtons}

    /** Marks button as clicked and removes markings from all other buttons 
     * @params image if null all markings of buttons are removed
     */
    private exeucteClickAnimation(image: Phaser.GameObjects.Image = null): void {
        if(image) image.setScale(0.8);
        
        this.gameSpeedButtons.forEach(x => {
            x.off('pointerover').off('pointerout'); //remove hovering animation
            if(x !== image) {
                x.setScale(1);
                x.on('pointerover', () => x.setScale(0.7)).on('pointerout', () => x.setScale(1));
            }
        });
    }
}