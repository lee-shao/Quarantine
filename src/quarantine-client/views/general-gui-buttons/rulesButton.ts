import { State } from "../../models/util/enums/healthStates";
import { Controller } from "../../controller/controller";
import { PopupWindow } from "../popupWindow";
import { Rule } from "../../controller/entities/rule";
import { GuiElement } from "../guiElement";

/**
 * Factory which generates the the rules button which opens the
 * rules sub scene.
 * @see GuiScene
 * @author Hien
 * @author Sebastian Führ
 */
export class RuleButton extends GuiElement {

    private ruleBtn: Phaser.GameObjects.Image;

    /** Create and add a rules button to the GuiScene */
    public create(): RuleButton {
        this.ruleBtn = this.scene.add.image(50, 100, 'rules');
        this.ruleBtn.setInteractive().setScale(1);

        // Change the button textures on hover, press, etc.
        this.ruleBtn.on('pointerover', () => {
            this.ruleBtn.setScale(this.scaling);
        });
        this.ruleBtn.on('pointerout', () => {
            this.ruleBtn.setScale(0.6);
        });
        this.ruleBtn.on('pointerdown', () => {
            this.ruleBtn.setScale(0.6);
        });
        this.ruleBtn.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                const popupRules = new PopupWindow(this.scene, 0, 0, '', 1300, 130, true, [], false);
                const title = this.scene.add.text(550, 130, 'The Rules', { color: 'Black', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setDepth(1);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(1200, 970);
                popupRules.addGameObjects([blankNode, title]);
                /*---------START: add Rules ---------- */
                const allRules = Controller.getInstance().getRules();
                let ruleIndex = 0;

                allRules.forEach(r => {
                    this.addRuleToContainer(popupRules, r, ruleIndex);
                    ruleIndex++;
                });
                /*---------END: add Rules ---------- */

                // popup info as a seconde popup
                const info = new Phaser.GameObjects.Sprite(this.scene, 800, 150, 'information').setScale(0.4);
                info.setInteractive();

                info.on('pointerup', () => {
                    const popupTitle = 'Population Protocols';
                    const popupStr = 'Population protocols are used as a theoretical model \nfor a collection (or population) of tiny mobile agents \nthat interact with one another to carry out a computation. \n\nAgents: are identically programmed finite state machines. \n\n\n\nInteraction: exchange of the state information between \nthe agents by collision. \n\n\n\n\n\n\nMovement pattern of the agents is unpredictable. \nHere: random selection inside of an array. \n\nSource: Aspnes, J., Ruppert, E. (2007): \nAn introduction to population protocols ';
                    const view = this.scene.add.sprite(1000, 670, 'view');
                    view.setDepth(4);
                    const state = this.scene.add.sprite(1000, 450, 'state');
                    state.setDepth(4);

                    const popupInfo = new PopupWindow(this.scene, 0, 0, '', 1300, 130, true, [], true);
                    const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(1200, 970);
                    popupInfo.add(blankNode);
                    popupInfo.add(new Phaser.GameObjects.Text(this.scene, 550, 130, popupTitle, { color: 'Black', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }));
                    popupInfo.add(new Phaser.GameObjects.Text(this.scene, 550, 220, popupStr, { color: 'Black', fontSize: '30px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }));
                    popupInfo.add(view);
                    popupInfo.add(state);
                    popupInfo.createModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
                });
                //add popup Info into popup Rules.
                popupRules.add(info);
                this.ruleBtn.setScale(0.8);
                popupRules.createModal();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();

            } else {
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        }).setScale(0.7);

        return this;
    }

    private addRuleToContainer(container: Phaser.GameObjects.Container, rule: Rule, ruleIndex: number): void {
        // The following x and y for test.
        // To rescale for the 3200x1600 pixel version (if needed) changes x and y as following x = this.game.redereer.width /2 +- number; y = this.game.redereer.height /2 +- number;
        const x = this.scene.game.renderer.width / 2 - 450;
        const y = this.scene.game.renderer.height / 2 - 250 + ruleIndex * 90;
        const pos1 = new Phaser.GameObjects.Image(this.scene, x, y, this.getTextures(rule.inputState1)).setOrigin(0);
        container.add(pos1);

        const pos2 = new Phaser.GameObjects.Image(this.scene, x + 200, y, this.getTextures(rule.inputState2)).setOrigin(0);
        container.add(pos2);

        const pos3 = new Phaser.GameObjects.Image(this.scene, x + 480, y, this.getTextures(rule.outputState1)).setOrigin(0);
        container.add(pos3);

        const pos4 = new Phaser.GameObjects.Image(this.scene, x + 680, y, this.getTextures(rule.outputState2)).setOrigin(0);
        container.add(pos4);

        const arrow = new Phaser.GameObjects.Image(this.scene, x + 400, y + 20, 'pprules-arrow').setOrigin(0);
        container.add(arrow);
    }

    private getTextures(str: string): string {
        switch (str) {
            case State.HEALTHY:
                return 'healthy';

            case State.INFECTED:
                return 'infected';

            case State.UNKNOWINGLY_INFECTED:
                return 'unknowingly-infected';

            case State.CURE:
                return 'cure';

            case State.DECEASED:
                return 'deceased';

            case State.IMMUNE:
                return 'immune';

            case State.TEST_KIT:
                return 'test-kit';
        }
    }

    /** @returns Phaser.GameObjects.Image of rule button */
    public getRulesButton(): Phaser.GameObjects.Image {return this.ruleBtn}

}
