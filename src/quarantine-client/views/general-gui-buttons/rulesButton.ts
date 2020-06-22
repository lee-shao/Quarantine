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

    /** Create and add a rules button to the GuiScene */
    public create(): void {
        const rulesBtn = this.scene.add.image(this.scene.game.renderer.width - 100, this.scene.game.renderer.height - 250, 'rules');
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
        const info = new Phaser.GameObjects.Image(this.scene, 800, 150, 'information').setScale(0.4);
        info.setInteractive();

        info.on('pointerup', () => {
            const popupTitle = 'The Information';
            const popupStr = 'The Agents exchange their state when they are close together';

            const popupInfo = new PopupWindow(this.scene, 0, 0, '', 1300, 130, true, [], true);
            const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(1200, 970);
            popupInfo.add(blankNode);
            popupInfo.add(new Phaser.GameObjects.Text(this.scene, 550, 130, popupTitle, { color: 'Black', fontSize: '50px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }));
            popupInfo.add(new Phaser.GameObjects.Text(this.scene, 550, 220, popupStr, { color: 'Black', fontSize: '30px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }));

            popupInfo.createModal();
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
        //add popup Info into popup Rules.
        popupRules.add(info);

        rulesBtn.setInteractive();

        // Change the button textures on hover, press, etc.
        rulesBtn.on('pointerover', () => {
            rulesBtn.setScale(0.7);
        });
        rulesBtn.on('pointerout', () => {
            rulesBtn.setScale(1);
        });
        rulesBtn.on('pointerdown', () => {
            rulesBtn.setScale(1);
        });
        rulesBtn.on('pointerup', () => {
            rulesBtn.setScale(0.8);
            popupRules.createModal();
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
    }

    private addRuleToContainer(container: Phaser.GameObjects.Container, rule: Rule, ruleIndex: number): void {
        // The following x and y for test. 
        // To rescale for the 3200x1600 pixel version (if needed) changes x and y as following x = this.game.redereer.width /2 +- number; y = this.game.redereer.height /2 +- number;
        const x = this.scene.game.renderer.width / 2 - 450;
        const y = this.scene.game.renderer.height / 2 - 250 + ruleIndex * 170;
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

}