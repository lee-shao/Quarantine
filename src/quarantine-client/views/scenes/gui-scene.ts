import { ItemMenu } from '../item-menu/menu'
import { Tutorial } from "../../controller/gui-controller/tutorial";
import { GameSpeedButtons } from "../general-gui-buttons/speedButtons";
import { RuleButton } from "../general-gui-buttons/rulesButton";
import { RestartButton } from "../general-gui-buttons/restartButton";
import { SkillTreeButton } from "../skill-tree/skillTreeButton";
import { LogBookButton } from '../log-book/logBookButton';
import { SoundButtons } from '../general-gui-buttons/soundButtons';
import { StatusBar } from '../status-bar/statusBar';

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    //** variables to save sound in */
    public inGameMusic: Phaser.Sound.BaseSound;
    public buttonClickMusic: Phaser.Sound.BaseSound;
    public itemBoughtSound: Phaser.Sound.BaseSound;

    /** Gui scene instance */
    public static instance: GuiScene;

    private menu: ItemMenu;
    private statusBar: StatusBar;
    public mainSceneIsPaused = false;
    public gameSpeed = 1;
    public soundON = true;
    public musicON = true;

    constructor() {
        super({
            key: "GuiScene",
            active: false
        });
        GuiScene.instance = this;
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
        this.load.audio("buy_sound", "assets/sounds/cash-register.mp3");
    }

    create(): void {
        this.poseSprites();

        // Creates Itemmenu and it to this scene
        this.menu = new ItemMenu(this, 0, 750);

        //** create sound objects */
        this.inGameMusic = this.sound.add("game_theme_music");
        this.buttonClickMusic = this.sound.add("button_click");
        this.itemBoughtSound = this.sound.add("buy_sound");
        

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
        // adds pause, slow, normal, quicker and quickest game speed buttons
        new GameSpeedButtons(this).create();
        // adds the rules button which opens the rules sub menu
        new RuleButton(this).create();
        // add the restart button
        new RestartButton(this).create();
        // add the skill tree button
        new SkillTreeButton(this).create();
        // add the log book button
        new LogBookButton(this).create();
        // add the sound buttons
        new SoundButtons(this).create();
        // add the status bar
        this.statusBar = new StatusBar(this);
        this.statusBar.create();

        Tutorial.getInstance().open(this);
    }

    // -------------------------------------------------------------------------- GAME MENU
    poseSprites(): void {
        /** Position tablet */
        const tablet = this.add.sprite(35, 20, 'tablet').setInteractive();
        tablet.setOrigin(0, 0);
        tablet.scaleX = 0.57;
        tablet.scaleY = 0.7;
    }

    update(): void {
        if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
        if (!this.mainSceneIsPaused) this.statusBar.update();
    }
}
