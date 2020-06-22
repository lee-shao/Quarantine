import { Stats } from "../stats";
import { TutorialView } from "../../views/tutorial/tutorialView";

/**
 * The tutorial which shows basic game introductions and
 * allows to be opened inside a popup.
 * This class is implemented as a singleton.
 * @author Sebastian Führ
 */
export class Tutorial {

    /** The only existing instance of this singleton */
    private static instance: Tutorial;
    /** The scene in which the sub menu schould be displayed */
    private scene: Phaser.Scene;
    /** Instance of the Stats singleton */
    private stats: Stats;

    private virusName = "the virus";

    private tutorial = [
        "Hello, good that you're here.\n\nWe have some important news. An apparently highly contagious disease, "
        + this.virusName +
        " has started spreading in our country and it is your duty as health minister to contain it.",

        "You have the authority to announce social distancing and lock down "
        + "for the entire nation, this will surely reduce infections but our "
        + "citizens won't be happy and the economy will take a hit so use it "
        + "with caution.\n\nIf you need to, you can always lift the measures and "
        + "re-announce them at a later time. Only one of the two measures can "
        + "be active at a time.",

        "But solely containing " + this.virusName + " is not enough, we have to find a cure "
        + "as fast as possible. We have a team of researchers working on it, make "
        + "sure you provide them with money if you wish to see results. The cure "
        + "will not only cure people but also work as a vaccine for healthy citizens.",

        "I upgraded your tablet, by the way. It now receives the newest infection "
        + "numbers daily. The testing capacities are limited though, we are sure "
        + "there are a lot of cases that go unnoticed. You can however invest in "
        + "our health-workers, if we employ more of those, we can test more.\n\n"
        + "Once the cure is developed, they will also be the people distributing it.",

        "Our police is also not idling at the moment. They are patroling the streets, "
        + "quarantining infected people, if they come across them. Feel free to employ "
        + "more police officers, if that is your strategy.",

        "The country is relying on your leadership. Come up with a strategy, keep the "
        + "nation happy, manage your finances and develop a cure before " + this.virusName
        + " gets out of control."
    ]

    private constructor() {
        this.stats = Stats.getInstance();
        this.virusName = this.stats.virusName;
    }

    /** 
     * @param scene Phaser scene where the sub menu should open
     * @returns the only existing instance of this singleton
     */
    public static getInstance(): Tutorial {
        if (!this.instance) this.instance = new Tutorial();
        return this.instance;
    }

    /**
     * Creates a popup with information regarding the game mechanics.
     * @param page The current page of the tutorial
     */
    private createTutorialView(page: number): TutorialView {
        const lbView = new TutorialView(this.scene, page);

        const styleDesc = { // description style
            color: 'Black',
            fontSize: '28px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };

        const arr = [];
        const ppDescription = new Phaser.GameObjects.Text(this.scene, 300, 300, this.tutorial[page], styleDesc);
        ppDescription.setWordWrapWidth(600);
        arr.push(ppDescription);

        const imgPolitician = new Phaser.GameObjects.Image(this.scene, 1200, 584, 'politician');
        imgPolitician.scale = 1.5;
        arr.push(imgPolitician);

        lbView.addGameObjects(arr)
          
        return lbView;
    }

    /**
     * Opens the tutorial sub menu on the first page
     * @param scene The scene in which the sub scene should be displayed
     */
    public open(scene: Phaser.Scene): void {
        this.scene = scene;
        this.createTutorialView(0).createModal();
    }

    /**
     * @param currPage The current page of the tutorial
     * @returns wether the operation can be performed
     */
    public showNextPage(currPage: number): boolean {
        this.createTutorialView(currPage + 1).createModal();
        return true;
    }

    /**
     * @param currPage The current page of the tutorial
     * @returns wether the operation can be performed
     */
    public showPrevPage(currPage: number): boolean {
        this.createTutorialView(currPage - 1).createModal();
        return true;
    }

    /** @returns the number of pages of the tutorial */
    public getNumberOfPages(): number {
        return this.tutorial.length;
    }

}