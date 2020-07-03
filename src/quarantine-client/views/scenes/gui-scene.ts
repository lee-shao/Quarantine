import { ItemMenu } from '../item-menu/menu'
import { TutorialController } from "../../controller/gui-controller/tutorialController";
import { GameSpeedButtons } from "../general-gui-buttons/speedButtons";
import { RuleButton } from "../general-gui-buttons/rulesButton";
import { RestartButton } from "../general-gui-buttons/restartButton";
import { SkillTreeButton } from "../skill-tree/skillTreeButton";
import { LogBookButton } from '../log-book/logBookButton';
import { SoundButtons } from '../general-gui-buttons/soundButtons';
import { SkipTutorialButton } from '../tutorial/skipTutorialButton';
import { StatusBar } from '../status-bar/statusBar';
import { Tablet } from '../tablet/tablet';
import { NewsPaper } from '../tablet/newspaper';
import { PetriInfoButton } from '../general-gui-buttons/petriInfoButton';

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    private tC: TutorialController;

    //** variables to save sound in */
    public inGameMusic: Phaser.Sound.BaseSound;
    public buttonClickMusic: Phaser.Sound.BaseSound;
    public itemBoughtSound: Phaser.Sound.BaseSound;
    public increaseSound: Phaser.Sound.BaseSound;
    public decreaseSound: Phaser.Sound.BaseSound;

    private randomBoughtSound: Array<Phaser.Sound.BaseSound> = new Array<Phaser.Sound.BaseSound>();

    /** Gui scene instance */
    public static instance: GuiScene;

    private menu: ItemMenu;
    private skipTutorialBtn: SkipTutorialButton;
    private newspaper: NewsPaper;

    private statusBar: StatusBar;
    public mainSceneIsPaused = false;
    public gameSpeed = 1;
    public soundON = true;
    public musicON = true;

    /** Buttons of GuiScene which should be hidden if a popup is displayed  */
    private buttons: Phaser.GameObjects.Image[] = [];
    private backgroundImgs: Phaser.GameObjects.Image[];

    constructor() {
        super({
            key: "GuiScene",
            active: false
        });
        GuiScene.instance = this;
        this.tC = TutorialController.getInstance();
    }

    preload(): void {
        this.load.pack(
            'preload',
            'assets/guiPack.json',
            'preload'
        );

        this.load.plugin('tooltipPlugin', 'Phasetips.js');

        //** load audio files */
        this.load.audio("game_theme_music", "assets/sounds/In_Game_Music.mp3");
        this.load.audio("button_click", ["assets/sounds/click-sound.mp3", "assets/sounds/click-sound.ogg"]);
        this.load.audio("money_notes_x3_sound", ["assets/sounds/money_notes_x3_sound.mp3", "assets/sounds/money_notes_x3_sound.ogg"]);
        this.load.audio("50_and_20_pence_peice_sound", ["assets/sounds/50_and_20_pence_peice_sound.mp3", "assets/sounds/50_and_20_pence_peice_sound.ogg"]);
        this.load.audio("20_pence_peice_sound", ["assets/sounds/20_pence_peice_sound.mp3", "assets/sounds/20_pence_peice_sound.ogg"]);
        this.load.audio("buy_sound", "assets/sounds/cash-register.mp3");
        this.load.audio("decrease_sound", ["assets/sounds/decrease_sound.mp3", "assets/sounds/decrease_sound.ogg"]);
        this.load.audio("increase_sound", ["assets/sounds/increase_sound.mp3", "assets/sounds/increase_sound.ogg"]);
    }

    public randomSound(): Phaser.Sound.BaseSound {
        //** Returns an integer random number between min (0) (included) and max (this.randomBoughtSound.length - 1) (included): */
        const randomIndex = Math.floor(Math.random() * ((this.randomBoughtSound.length - 1) - 0 + 1) + 0);
        return this.itemBoughtSound = this.randomBoughtSound[randomIndex];
    }

    create(): void {
        // Creates Itemmenu and it to this scene
        this.menu = ItemMenu.getInstance(this, 650, 750);

        //** create sound objects */
        this.inGameMusic = this.sound.add("game_theme_music");
        this.buttonClickMusic = this.sound.add("button_click");
        this.increaseSound = this.sound.add("increase_sound");
        this.decreaseSound = this.sound.add("decrease_sound");
        // this.itemBoughtSound = this.sound.add("buy_sound");
        this.randomBoughtSound.push(this.sound.add("buy_sound"));
        this.randomBoughtSound.push(this.sound.add("20_pence_peice_sound"));
        this.randomBoughtSound.push(this.sound.add("money_notes_x3_sound"));
        this.randomBoughtSound.push(this.sound.add("50_and_20_pence_peice_sound"));

        
        
        

        const musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.inGameMusic.play(musicConfig);

        // ------------------------------------------------------------------- GUI ELEMENTS
        // adds petri Info button
        this.buttons.push(new PetriInfoButton(this).create().getInfoButton());
        // adds pause, slow, normal, quicker and quickest game speed buttons
        new GameSpeedButtons(this).create().getGameSpeedButtons().forEach(b =>{
            this.buttons.push(b);
        });
        // adds the rules button which opens the rules sub menu
        this.buttons.push(new RuleButton(this).create().getRulesButton());
        // add the restart button
        this.buttons.push(new RestartButton(this).create().getRestartButton());
        // add the skill tree button
        const skillTreeBtn = new SkillTreeButton(this).create();
        // add the log book button
        const logBookBtn = new LogBookButton(this).create();
        // add the sound buttons
        new SoundButtons(this).create().getSoundButtons().forEach(b => {
            this.buttons.push(b);
        });
        // add the tablet
        const tablet = new Tablet(this).create();
        // add the newspaper
        const newspaper = new NewsPaper(this).create();
        // add the status bar
        this.statusBar = new StatusBar(this).create();

        // -------------------------------------------------------------------- TUTORIAL SET UP
        const tutComponents = [tablet, logBookBtn, this.menu, skillTreeBtn, newspaper];
        // adds skip tutorial button
        this.skipTutorialBtn = new SkipTutorialButton(this, tutComponents).create();
        // start tutorial
        this.tC.startTutorial(this, tutComponents);

    }

    update(): void {
        // if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour
        if (!this.mainSceneIsPaused) this.statusBar.update();
    }

    //-----Hide/show the buttons while pause/resume
    public showBtns(): void {
        this.buttons.forEach(b => {
            b.setVisible(true);
        });
    }

    public hideBtns(): void {
        this.buttons.forEach(b => {
            b.setVisible(false);
        });
    }

    /** Removes skipTutorialButton from GuiScene (=> used after the tutorial ends) */
    public removeSkipBtn(): void {
        this.skipTutorialBtn.removeSkipButton();
        delete this.skipTutorialBtn;
    }

    /** Adds element to the list of buttons/images which should be hidden by a popup window. */
    public addToVisibleButtons(element: Phaser.GameObjects.Image): void {
        this.buttons.push(element);
    }
}
