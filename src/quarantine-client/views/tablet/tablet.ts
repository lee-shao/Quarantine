import { GuiElement } from "../guiElement";
import { ChartScene } from "./chart-scene";
import { MapScene } from "./map-scene";
import { TutorialComponent } from "../tutorial/tutorialComponent";

/**
 * Factory which generates the tablet and home button and 
 * allows the user to switch between the map scene and chart scene
 * @author Jakob Hartmann
 */
export class Tablet extends GuiElement implements TutorialComponent {
    /** Tablet instance */
    public static instance: Tablet;

    /** Allows the pop-up window to decide whether the map scene should be woken up when the window is closed */
    private mapSceneIsSleeping: boolean;
    /** Allows the pop-up window to decide whether the chart scene should be woken up when the window is closed */
    private chartSceneIsSleeping: boolean;

    private homeBtn: Phaser.GameObjects.Image;

    private chartScene: ChartScene;
    private mapScene: MapScene;
    private tablet: Phaser.GameObjects.Image;
    

    /** Create the tablet and the home button and manage their logic */
    public create(): Tablet {
        Tablet.instance = this;

        /** Reference to the chart scene */
        this.chartScene = this.scene.scene.get('ChartScene') as ChartScene;
        /** Reference to the map scene */
        this.mapScene = this.scene.scene.get('MapScene') as MapScene;

        /** At the beginning of the game, the tablet shows the chart */
        this.mapScene.scene.sleep();
        this.mapSceneIsSleeping = true;
        this.chartSceneIsSleeping = false;

        /** Position the tablet */
        this.tablet = this.scene.add.image(35, 20, 'tablet').setInteractive();
        this.tablet.setOrigin(0, 0);
        this.tablet.scaleX = 0.57;
        this.tablet.scaleY = 0.7;

        /** Create the info texts that are displayed when you hover over the home button */
        const showChart = this.scene.add.text(this.tablet.getBottomCenter().x + 25, this.tablet.getBottomCenter().y - 32, 'Show Chart', {fill: '#FFFFFF'});
        const showMap = this.scene.add.text(this.tablet.getBottomCenter().x + 25, this.tablet.getBottomCenter().y - 32, 'Show Map', {fill: '#FFFFFF'});
        showChart.setVisible(false);
        showMap.setVisible(false);

        /** Position the home button */
        this.homeBtn = this.scene.add.image(this.tablet.getBottomCenter().x, this.tablet.getBottomCenter().y - 26, 'home-button');
        this.homeBtn.setOrigin(0.5, 0.5);
        this.homeBtn.setScale(0.055);
        //this.homeBtn.setInteractive();
        
        /** 
         * Clicking the home button changes the scene in the tablet, 
         * updates the variables for the pop-up windows and 
         * adjusts the corresponding info texts
         */
        this.homeBtn.on('pointerup', () => {
            if (!this.chartScene.scene.isSleeping()) {
                this.chartScene.scene.sleep();
                this.chartSceneIsSleeping = true;
                this.mapScene.scene.wake();
                this.mapSceneIsSleeping = false;
                showChart.setVisible(true);
                showMap.setVisible(false);
            } else {
                this.chartScene.scene.wake();
                this.chartSceneIsSleeping = false;
                this.mapScene.scene.sleep();
                this.mapSceneIsSleeping = true;
                showChart.setVisible(false);
                showMap.setVisible(true);
            }
        });

        /** When hovering over the home button, it becomes smaller and the corresponding info text is displayed */
        this.homeBtn.on('pointerover', () => {
            this.homeBtn.setScale(0.048);
            if (!this.chartScene.scene.isSleeping()) {
                showMap.setVisible(true);
            } else {
                showChart.setVisible(true);
            }
        })

        /** If the user´s mouse no longer points to the home button, 
         * its original size is restored and the info texts are hidden */
        this.homeBtn.on('pointerout', () => {
            this.homeBtn.setScale(0.055);
            showChart.setVisible(false);
            showMap.setVisible(false);
        });

        this.hideComponent();
        return this;
    }

    /** Getter-function, which allows the pop-up window to determine whether the map scene is sleeping */
    public getMapSceneIsSleeping(): boolean {
        return this.mapSceneIsSleeping;
    }

    /** Getter-function, which allows the pop-up window to determine whether the chart scene is sleeping */
    public getChartSceneIsSleeping(): boolean {
        return this.chartSceneIsSleeping;
    }

    /** @returns Phaser.GameObjects.Image of home button */
    public getHomeButton(): Phaser.GameObjects.Image {return this.homeBtn;}

    /** @see TutorialComponent */
    public hideComponent(): void {
        this.chartScene.hideComponent();
        this.mapScene.hideComponent();
        this.tablet.setVisible(false);
        this.homeBtn.disableInteractive();
        this.homeBtn.setVisible(false);
    }

    /** @see TutorialComponent */
    public activateComponent(): void {
        this.chartScene.activateComponent();
        this.mapScene.activateComponent();
        this.tablet.setVisible(true);
        this.homeBtn.setInteractive();
        this.homeBtn.setVisible(true);
        this.scene.addToVisibleButtons(this.homeBtn);
    }
    
}