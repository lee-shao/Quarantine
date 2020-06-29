import { MainScene } from "./main-scene";
import { GuiScene } from "./gui-scene";
import { ChartScene } from "../tablet/chart-scene";
import { MapScene } from "../tablet/map-scene";
import { Stats } from "../../controller/stats";
import { DifficultyLevel } from "../../models/util/enums/difficultyLevels";

/**
 * Menu scene at the start of the game.
 * Player can start a new game from here.
 * @author Shao
 */
export class StartMenuScene extends Phaser.Scene {
    //** variables to save sound in */
    mainThemeMusic: any;
    buttonClickMusic: any;

    private sticker1: Phaser.GameObjects.Image;
    private sticker2: Phaser.GameObjects.Image;
    private sticker3: Phaser.GameObjects.Image;

    private budget: Phaser.GameObjects.Text;
    private income: Phaser.GameObjects.Text;
    private interactions: Phaser.GameObjects.Text;

    public easy = require('../../../../res/json/difficulty-levels/easy.json');
    public normal = require('../../../../res/json/difficulty-levels/normal.json');
    public hard = require('../../../../res/json/difficulty-levels/hard.json');

    private selectedDifficulty = DifficultyLevel.NORMAL; 

    constructor() {
        super({
            key: "StartMenuScene",
            active: true
        });
    }

    preload(): void {
        // Loading Sprites
        this.load.image('Background', 'assets/sprites/start-menu/quarantine-logo-17.png');
        this.load.image('Attributes', 'assets/sprites/start-menu/difficulty-attributes.png');
        this.load.image('Sticker', 'assets/sprites/start-menu/old-virus-sticker.png');
        // New Game button
        this.load.image('NewGame', 'assets/sprites/start-menu/new-game-button-neutral.png');
        this.load.image('NewGameH', 'assets/sprites/start-menu/new-game-button-hovered.png');
        this.load.image('NewGameP', 'assets/sprites/start-menu/new-game-button-pressed.png');
        // Easy button
        this.load.image('Easy', 'assets/sprites/start-menu/easy-button-neutral.png');
        this.load.image('EasyH', 'assets/sprites/start-menu/easy-button-hovered.png');
        this.load.image('EasyA', 'assets/sprites/start-menu/easy-button-active.png');
        this.load.image('EasyP', 'assets/sprites/start-menu/easy-button-pressed.png');
        // Normal button
        this.load.image('Normal', 'assets/sprites/start-menu/normal-button-neutral.png');
        this.load.image('NormalH', 'assets/sprites/start-menu/normal-button-hovered.png');
        this.load.image('NormalA', 'assets/sprites/start-menu/normal-button-active.png');
        this.load.image('NormalP', 'assets/sprites/start-menu/normal-button-pressed.png');
        // Hard button
        this.load.image('Hard', 'assets/sprites/start-menu/hard-button-neutral.png');
        this.load.image('HardH', 'assets/sprites/start-menu/hard-button-hovered.png');
        this.load.image('HardA', 'assets/sprites/start-menu/hard-button-active.png');
        this.load.image('HardP', 'assets/sprites/start-menu/hard-button-pressed.png');
        // Start button
        this.load.image('Start', 'assets/sprites/start-menu/start-button-neutral.png');
        this.load.image('StartH', 'assets/sprites/start-menu/start-button-hovered.png');
        this.load.image('StartP', 'assets/sprites/start-menu/start-button-pressed.png');
        // Temporary skip button to allow faster development by skipping to choose the difficulty (delete later).
        this.load.image('Skip', 'assets/sprites/arrow-button-right.png');

        //** load audio files */
        this.load.audio("main_menu_audio_theme", ["assets/sounds/Main_Menu_Music.mp3", "assets/sounds/Main_Menu_Music.ogg"]);
        this.load.audio("button_click", ["assets/sounds/click-sound.mp3", "assets/sounds/click-sound.ogg"]);
    }

    create(): void {
        this.add.image(innerWidth/2, innerHeight/2, 'Background')
        this.createMenuButtons();
        //** create sound objects */
        this.mainThemeMusic = this.sound.add("main_menu_audio_theme");
        this.buttonClickMusic = this.sound.add("button_click");
        
        const musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay:0
        }
        this.mainThemeMusic.play(musicConfig);

    }

    /**
     * Main menu buttons goes here.
     * At the moment only one button. (New Game)
     * Eventually add additional buttons(options, exit, etc.).
     */
    createMenuButtons(): void {
        const newGameButton = this.add.sprite(innerWidth/2, innerHeight/1.6, 'NewGame').setScale(0.9);

        // Change the button textures on hover, press, etc.
        newGameButton.setInteractive()
        .on('pointerover', () => {
            newGameButton.setTexture('NewGameH');
        })
        .on('pointerout', () => {
            newGameButton.setTexture('NewGame');
        })
        .on('pointerdown', () => {
            newGameButton.setTexture('NewGameP');
        })
        .on('pointerup', () => {
            newGameButton.setTexture('NewGameH');
            newGameButton.visible = false;
            this.buttonClickMusic.play();
            this.createDifficultyButtons();
        });
        // Delete later
        /*
        const skipButton = this.add.sprite(1800, 750, 'Skip').setScale(0.4);
        skipButton.setInteractive();
        skipButton.on('pointerdown', () => {
            //loads the "NORMAL" game stats @see{res/json/difficulty-levels/normal.json}
            Stats.getInstance(DifficultyLevel.NORMAL); 
            this.scene.setVisible(false);
            this.loadScenes();
        });
        */
    }

    /**
     * Choose the difficulty of the game.
     * Shows Attributes on the side.
     */
    createDifficultyButtons(): void {
        const easyButton = this.add.sprite(innerWidth*0.25, innerHeight*0.5, 'Easy').setScale(0.75);
        const normalButton = this.add.sprite(innerWidth*0.25, innerHeight*0.65, 'NormalA').setScale(0.75);
        const hardButton = this.add.sprite(innerWidth*0.25, innerHeight*0.8, 'Hard').setScale(0.75);

        this.showDifficultyAttributes(this.normal);

        // initially the difficulty NORMAL is selected
        this.updateDifficultyAttributes(this.normal);

        // Change the button textures on hover, press, etc.
        easyButton.setInteractive()
        .on('pointerover', () => {
            easyButton.setTexture('EasyH');
        })
        .on('pointerout', () => {
            easyButton.setTexture('Easy');
        })
        .on('pointerdown', () => {
            easyButton.setTexture('EasyP');
        })
        .on('pointerup', () => {
            easyButton.setTexture('EasyA');
            easyButton.removeInteractive();
            normalButton.setInteractive().setTexture('Normal');
            hardButton.setInteractive().setTexture('Hard');
            this.buttonClickMusic.play();

            //loads the "EASY" game stats @see{res/json/difficulty-levels/easy.json}
            this.selectedDifficulty = DifficultyLevel.EASY;
            this.updateDifficultyAttributes(this.easy);
        });
        // Change the button textures on hover, press, etc.
        normalButton.removeInteractive()
        .on('pointerover', () => {
            normalButton.setTexture('NormalH');
        })
        .on('pointerout', () => {
            normalButton.setTexture('Normal');
        })
        .on('pointerdown', () => {
            normalButton.setTexture('NormalP');
        })
        .on('pointerup', () => {
            normalButton.setTexture('NormalA');
            normalButton.removeInteractive();
            easyButton.setInteractive().setTexture('Easy');
            hardButton.setInteractive().setTexture('Hard');
            this.buttonClickMusic.play();

            //loads the "NORMAL" game stats @see{res/json/difficulty-levels/normal.json}
            this.selectedDifficulty = DifficultyLevel.NORMAL;
            this.updateDifficultyAttributes(this.normal);
        });
        // Change the button textures on hover, press, etc.
        hardButton.setInteractive()
        .on('pointerover', () => {
            hardButton.setTexture('HardH');
        })
        .on('pointerout', () => {
            hardButton.setTexture('Hard');
        })
        .on('pointerdown', () => {
            hardButton.setTexture('HardP');
        })
        .on('pointerup', () => {
            hardButton.setTexture('HardA');
            hardButton.removeInteractive();
            easyButton.setInteractive().setTexture('Easy');
            normalButton.setInteractive().setTexture('Normal');
            this.buttonClickMusic.play();

            //loads the "HARD" game stats @see{res/json/difficulty-levels/hard.json}
            this.selectedDifficulty = DifficultyLevel.HARD;
            this.updateDifficultyAttributes(this.hard);
        });
    }

    /**
     * Button to confirm the selected Difficulty
     * and starting the game.
     */
    createStartButton(): void {
        const startButton = this.add.sprite(innerWidth*0.9, innerHeight*0.85, 'Start').setScale(0.45);
        
        // Change the button textures on hover, press, etc.
        startButton.setInteractive()
        .on('pointerover', () => {
            startButton.setTexture('StartH');
        })
        .on('pointerout', () => {
            startButton.setTexture('Start');
        })
        .on('pointerdown', () => {
            startButton.setTexture('StartP');
        })
        .on('pointerup', () => {
            startButton.setTexture('StartH');
            Stats.getInstance(this.selectedDifficulty);
            this.scene.setVisible(false);
            this.buttonClickMusic.play();
            this.loadScenes();
            this.scene.remove(this);
        });
    }

    /**
     * Showing a warning sign on the side
     * with some essential attributes
     * which may be important for the player to know.
     * @param difficulty the currently selected difficulty is saved here
     */
    showDifficultyAttributes(difficulty: any): void {
        // Adds warning sign which "contains" the attributes.
        this.add.image(innerWidth*0.7, innerHeight*0.65, 'Attributes');
        // Difficulty text
        this.add.text(innerWidth*0.52, innerHeight*0.4, `DIFFICULTY:`, {
            fontFamily: 'Arial',
            fontSize: '40px', 
            color: '#000000'
        });
        // Start budget text
        this.budget = this.add.text(innerWidth*0.5, innerHeight*0.51, 'START BUDGET:             ' + difficulty['budget'].toLocaleString() + '€', {
            fontFamily: 'Arial',
            fontSize: '40px', 
            color: '#000000'
        });
        // Daily income text
        this.income = this.add.text(innerWidth*0.5, innerHeight*0.61, 'DAILY INCOME:                 ' + difficulty['income'].toLocaleString() + '€', {
            fontFamily: 'Arial',
            fontSize: '40px', 
            color: '#000000'
        });
        // Basic interaction rate text
        this.interactions = this.add.text(innerWidth*0.53, innerHeight*0.72, 'BASIC INTERACTION RATE: ' + difficulty['basicInteractionRate'].toLocaleString(), {
            fontFamily: 'Arial',
            fontSize: '40px', 
            color: '#000000'
        });
        // Using 3 images to show the current selected difficulty 
        this.sticker1 = this.add.image(innerWidth*0.75, innerHeight*0.4, 'Sticker').setScale(0.25).setVisible(true);
        this.sticker2 = this.add.image(innerWidth*0.80, innerHeight*0.41, 'Sticker').setScale(0.25).setRotation(12).setVisible(true);
        this.sticker3 = this.add.image(innerWidth*0.86, innerHeight*0.4, 'Sticker').setScale(0.25).setRotation(-6).setVisible(false);
        this.createStartButton();
    }

    /**
     * Updates the attributes in the warning sign
     */
    updateDifficultyAttributes(difficulty: any): void {
        this.budget.setText('START BUDGET:             ' + difficulty['budget'].toLocaleString() + '€');
        this.income.setText('DAILY INCOME:                 ' + difficulty['income'].toLocaleString() + '€');
        this.interactions.setText('BASIC INTERACTION RATE: ' + difficulty['basicInteractionRate'].toLocaleString());
        this.showDifficultyStickers(difficulty);
    }

    /**
     * Updates the amount of stickers showing, depending on the current difficulty
     * @param difficulty the current selected difficulty
     */
    showDifficultyStickers(difficulty: any): void {
        if(difficulty == this.easy) {
            this.sticker1.setVisible(true);
            this.sticker2.setVisible(false);
            this.sticker3.setVisible(false);
        }
        if (difficulty == this.normal) {
            this.sticker1.setVisible(true);
            this.sticker2.setVisible(true);
            this.sticker3.setVisible(false);
        }
        if(difficulty == this.hard) {
            this.sticker1.setVisible(true);
            this.sticker2.setVisible(true);
            this.sticker3.setVisible(true);
        }
    }

    /**
     * Load all scenes for the main game
     */
    loadScenes(): void {
        this.mainThemeMusic.stop();
        this.scene.add('MainScene', MainScene, true);
        this.scene.add('GuiScene', GuiScene, true);
        this.scene.add('ChartScene', ChartScene, true);
        //this.scene.add('AgentScene', AgentScene, false);
        this.scene.add('MapScene', MapScene, true);
    }
}
